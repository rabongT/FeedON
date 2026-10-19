import test from 'node:test';
import assert from 'node:assert/strict';
import { configuration, generate, POLICY, validateInput, validateOutput } from './aiFeedback.js';
import handler from '../api/feedback.js';

const now = Date.parse('2026-10-19T00:00:00Z');
const env = { AI_ENABLED: 'true', GEMINI_API_KEY: 'test-not-a-real-key', GEMINI_FREE_TIER_CONFIRMED: 'true',
  UPSTASH_REDIS_REST_URL: 'https://example.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'test-only', VERCEL_ENV: 'production' };
const data = { grade: '5학년', subject: '수학', goal: '통분하는 이유 설명하기', observation: '분모를 같게 하여 계산했지만 왜 통분하는지는 설명하지 못했다.' };
const body = { requestId: '12345678-1234-1234-1234-123456789abc', consent: true, data };
const sample = () => ({ recommendedIndex: 2, reason: '목표와 현재 설명 사이의 차이를 확인합니다.', evidence: data.observation,
  stages: Array.from({ length: 5 }, (_, i) => ({ talk: '목표와 수행을 살펴보자.',
    talkOptions: ['핵심', '힌트', '질문'].map(label => ({ label, talk: '그 이유를 설명해 볼까?' })),
    dialogue: Array.from({ length: i >= 3 ? 8 : 1 }, (_, j) => ({ who: j % 2 ? '학생' : '교사', text: '기준을 함께 살펴보아요.' })),
  })) });
const ok = value => ({ ok: true, json: async () => value });
test('disabled, incomplete, preview and expired configurations fail closed', () => {
  for (const config of [{ ...env, AI_ENABLED: 'false' }, { ...env, GEMINI_API_KEY: '' }, { ...env, GEMINI_FREE_TIER_CONFIRMED: 'false' }, { ...env, VERCEL_ENV: 'preview' }, { ...env, UPSTASH_REDIS_REST_URL: 'https://evil.example' }])
    assert.throws(() => configuration(config, now));
  configuration(env, POLICY.end - 1);
  assert.throws(() => configuration(env, POLICY.end), /운영 기간/);
});
test('missing consent, long input and obvious personal identifiers cannot call any provider', async () => {
  let calls = 0;
  for (const change of [{ body: { ...body, consent: false } },
    { body: { ...body, data: { ...data, observation: 'a'.repeat(1201) } } },
    { body: { ...body, data: { ...data, observation: data.observation + ' test@example.com' } } }]) {
    await assert.rejects(generate({ body, env, now, fetcher: async () => { calls++; }, ...change }));
  }
  assert.equal(calls, 0);
});
test('missing, full, rate-limited, duplicated, corrupt or unavailable ledger never calls Gemini', async () => {
  for (const result of [-1, -2, -3, -4, null, '1', 0, 101]) {
    const urls = [];
    await assert.rejects(generate({ body, env, now, fetcher: async url => {
      urls.push(url); return ok({ result });
    } }));
    assert.deepEqual(urls, [env.UPSTASH_REDIS_REST_URL]);
  }
  let calls = 0;
  await assert.rejects(generate({ body, env, now, fetcher: async () => { calls++; throw new Error('offline'); } }));
  assert.equal(calls, 1);
});
test('valid generation reserves first, fixes model/output cap and excludes unrelated fields and secrets', async () => {
  const calls = [];
  const result = await generate({ body: { ...body, data: { ...data, unit: 'DO NOT SEND UNIT', session: 'DO NOT SEND SESSION' } }, env, now,
    fetcher: async (url, options) => {
      const payload = JSON.parse(options.body); calls.push(url);
      if (calls.length === 1) { assert.equal(payload[0], 'EVAL'); assert.equal(payload[3], POLICY.ledger); return ok({ result: 1 }); }
      assert.equal(url, `https://generativelanguage.googleapis.com/v1beta/models/${POLICY.model}:generateContent`);
      assert.equal(options.headers['x-goog-api-key'], env.GEMINI_API_KEY);
      assert.equal(payload.generationConfig.maxOutputTokens, 5000); assert.equal(payload.tools, undefined);
      assert.equal(payload.generationConfig.candidateCount, 1);
      assert.equal(payload.generationConfig.responseFormat.text.mimeType, 'APPLICATION_JSON');
      assert.ok(!options.body.includes('DO NOT SEND')); assert.ok(!options.body.includes(env.GEMINI_API_KEY));
      assert.ok(Buffer.byteLength(options.body) <= 24000);
      return ok({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(sample()) }] } }] });
    } });
  assert.equal(result.recommendedIndex, 2);
  assert.equal(calls.length, 2);
});
test('provider failure is not automatically retried or refunded', async () => {
  let calls = 0;
  await assert.rejects(generate({ body, env, now,
    fetcher: async () => ++calls === 1 ? ok({ result: 1 }) : { ok: false, status: 503 } }), /HTTP 503/);
  assert.equal(calls, 2);
});
test('free quota exhaustion never retries or falls back to a paid provider', async () => {
  const urls = [];
  await assert.rejects(generate({ body, env, now, fetcher: async url => {
    urls.push(url); return urls.length === 1 ? ok({ result: 1 }) : { ok: false, status: 429 };
  } }), /무료 이용 한도/);
  assert.equal(urls.length, 2);
  assert.ok(urls[1].includes('generativelanguage.googleapis.com'));
});
test('invented evidence or missing teacher-student turns is rejected', () => {
  assert.throws(() => validateOutput({ ...sample(), evidence: '모두 이해했다' }, data));
  const result = sample(); result.stages[4].dialogue[1].who = '교사';
  assert.throws(() => validateOutput(result, data));
  assert.equal(validateInput(body).observation, data.observation);
});
test('HTTP endpoint rejects unsupported methods and cross-site requests without credentials', async () => {
  const response = { setHeader() {}, status(s) { this.code = s; return this; }, json(v) { this.body = v; return this; } };
  await handler({ method: 'DELETE', headers: {} }, response); assert.equal(response.code, 405);
  await handler({ method: 'POST', headers: { origin: 'https://other.example' } }, response); assert.equal(response.code, 403);
});
