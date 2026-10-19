import test from 'node:test';
import assert from 'node:assert/strict';
import { generateFeedback } from './generateFeedback.js';

test('explicit generation sends one whitelisted request without unrelated fields', async () => {
  let calls = 0;
  const signal = new AbortController().signal;
  const expected = { recommendedIndex: 2, stages: Array(5).fill({}) };
  const result = await generateFeedback({ grade: '5학년', observation: '익명 예시', privateField: 'not-sent' }, signal, async (url, options) => {
    calls++;
    assert.equal(url, '/api/feedback');
    assert.equal(options.signal, signal);
    const body = JSON.parse(options.body);
    assert.equal(body.consent, true);
    assert.equal(body.data.privateField, undefined);
    assert.ok(body.requestId);
    return { ok: true, json: async () => expected };
  });
  assert.equal(calls, 1);
  assert.deepEqual(result, expected);
});

test('failure and abort do not retry or switch providers', async () => {
  for (const failure of [new Error('network'), Object.assign(new Error('aborted'), { name: 'AbortError' })]) {
    let calls = 0;
    await assert.rejects(generateFeedback({}, undefined, async () => { calls++; throw failure; }));
    assert.equal(calls, 1);
  }
});

test('invalid results and HTTP failures do not become AI feedback', async () => {
  await assert.rejects(generateFeedback({}, undefined, async () => ({ ok: false })));
  await assert.rejects(generateFeedback({}, undefined, async () => ({ ok: true, json: async () => ({}) })));
});
