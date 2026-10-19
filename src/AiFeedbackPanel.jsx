import { useEffect, useRef, useState } from 'react';

export default function AiFeedbackPanel({ data, onGenerated, generated }) {
  const [available, setAvailable] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  const controller = useRef(null);
  useEffect(() => {
    const status = new AbortController();
    fetch('/api/feedback', { signal: status.signal, cache: 'no-store' })
      .then(r => r.ok ? r.json() : null).then(r => setAvailable(r?.available === true)).catch(() => {});
    return () => { status.abort(); controller.current?.abort(); };
  }, []);
  async function generate(event) {
    event.preventDefault();
    if (pending.current || generated || !consent) return;
    pending.current = true; setBusy(true); setMessage('');
    controller.current = new AbortController();
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: controller.current.signal,
        body: JSON.stringify({ requestId: crypto.randomUUID(), consent, data: {
          grade: data.grade, subject: data.subject, goal: data.goal, observation: data.observation,
          achieved: data.achieved, gap: data.gap, purpose: data.purpose,
        } }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'AI 생성에 실패했습니다. 기존 무료 제안을 유지합니다.');
      onGenerated(result);
      setMessage('피드백 제안과 단계별 대화를 반영했습니다.');
    } catch (error) {
      if (error.name !== 'AbortError') setMessage(error instanceof SyntaxError ? 'AI 서버에 연결하지 못했습니다. 기존 무료 제안을 유지합니다.' : error.message);
    } finally { pending.current = false; setBusy(false); }
  }
  if (!available) return null;
  return <aside className="ai-feedback-panel" aria-label="AI 피드백 생성">
    <p>퍼스널 피드백 5단계 연구에 기반합니다.</p>
    {!generated && <form onSubmit={generate}>
      <div className="ai-access-row"><button type="submit" disabled={busy || !consent}>{busy ? '피드백 만드는 중…' : '피드백 만들기'}</button></div>
      <label className="ai-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} disabled={busy} />
        <span>이름, 학교명 등 학생을 알아볼 수 있는 개인정보는 입력하지 마세요.</span></label>
    </form>}
    <p role="status" aria-live="polite">{message}</p>
  </aside>;
}
