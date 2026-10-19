import { configuration, generate, SafeError } from '../server/aiFeedback.js';

export const config = { maxDuration: 60 };
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'GET') {
    try { configuration(process.env); return res.status(200).json({ available: true }); }
    catch { return res.status(200).json({ available: false }); }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: '허용되지 않은 요청입니다.' }); }
  if (req.headers.origin !== 'https://feed-on-six.vercel.app') return res.status(403).json({ error: 'FeedON 운영 주소에서 이용해 주세요.' });
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return res.status(415).json({ error: 'JSON 요청이 필요합니다.' });
  try {
    if (Buffer.byteLength(JSON.stringify(req.body ?? ''), 'utf8') > 12000) return res.status(413).json({ error: '입력 내용이 너무 깁니다.' });
    const result = await generate({ body: req.body, env: process.env });
    return res.status(200).json(result);
  } catch (error) {
    // Never log prompts, credentials, raw provider errors or student content.
    return res.status(error instanceof SafeError ? error.status : 503).json({ error: error instanceof SafeError ? error.message : '연결을 확인할 수 없습니다. 자동 재시도하지 않으며 기존 무료 제안을 유지합니다.' });
  }
}
