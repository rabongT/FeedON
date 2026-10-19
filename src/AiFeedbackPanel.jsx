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
      setMessage('AI 제안과 단계별 대화를 반영했습니다.');
    } catch (error) {
      if (error.name !== 'AbortError') setMessage(error instanceof SyntaxError ? 'AI 서버에 연결하지 못했습니다. 기존 무료 제안을 유지합니다.' : error.message);
    } finally { pending.current = false; setBusy(false); }
  }
  if (!available) return null;
  return <aside className="ai-feedback-panel" aria-label="AI 피드백 생성">
    <div><strong>OpenAI GPT 기반 피드백</strong>
      <p>{generated ? '아래 제안과 Teacher Talk에 AI 생성 결과를 표시합니다.' : '연구학교의 5단계 원칙과 네 가지 재구성 사례를 참고해 제안과 대화를 만듭니다.'}</p></div>
    {!generated && <form onSubmit={generate}>
      <div className="ai-access-row"><button type="submit" disabled={busy || !consent}>{busy ? 'AI 피드백 만드는 중…' : 'AI로 피드백 만들기'}</button></div>
      <label className="ai-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} disabled={busy} />
        <span>학생 이름·학교명 등 개인정보를 지웠으며, 위 수업·관찰 내용을 OpenAI에 전송하는 데 동의합니다.</span></label>
      <p className="ai-privacy-note">개인정보 보호를 위해 이름·학교명·연락처는 입력하지 마세요. 입력과 결과는 FeedON 서버에 별도 저장하지 않습니다. AI 생성 시에는 아래 항목이 OpenAI로 전송됩니다.</p>
      <details><summary>개인정보 처리 · 전송 내용 · 이용 한도</summary><p>학년·과목·학습 목표·관찰 내용·성취/보완 내용·지원 목적만 HTTPS로 전송합니다. API 키는 학생 자료에 포함하지 않습니다. 이용량 기록에는 입력과 결과를 저장하지 않으며, API 응답 저장 기능도 끕니다. 다만 OpenAI의 보안·오용 방지 목적 보관은 적용될 수 있습니다. 자동 필터만으로 모든 개인정보를 찾을 수 없으므로 교사가 전송 전 확인해 주세요. 학생 대사는 예상 대화입니다.</p><p><a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noreferrer">OpenAI 데이터 처리 안내</a></p><p>운영 기간은 2026년 12월 31일까지입니다. 공용 예산 한도에 도달하면 AI는 중지되고 무료 제안은 계속 이용할 수 있습니다. 실패한 요청도 한도에 포함될 수 있습니다.</p></details>
    </form>}
    {generated && <p>OpenAI GPT로 생성한 제안입니다. 입력과 결과는 FeedON 서버에 별도 저장하지 않습니다. 학생 대사는 예상 응답이며 실제 관찰과 맞는지 확인해 주세요.</p>}
    <p role="status" aria-live="polite">{message}</p>
  </aside>;
}
