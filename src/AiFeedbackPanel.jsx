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
    <div><strong>Google Gemini 기반 피드백</strong>
      <p>{generated ? '아래 제안과 Teacher Talk에 AI 생성 결과를 표시합니다.' : '연구학교의 5단계 원칙과 네 가지 재구성 사례를 참고해 제안과 대화를 만듭니다.'}</p></div>
    {!generated && <form onSubmit={generate}>
      <div className="ai-access-row"><button type="submit" disabled={busy || !consent}>{busy ? 'AI 피드백 만드는 중…' : 'AI로 피드백 만들기'}</button></div>
      <label className="ai-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} disabled={busy} />
        <span>개인정보·민감정보·비공개 정보를 지웠으며, Google Gemini 무료 API로 전송하고 입력·응답이 Google 제품 개선에 사용될 수 있음을 확인했습니다.</span></label>
      <p className="ai-privacy-note">이름·학교명·연락처와 학생을 알아볼 수 있는 내용은 입력하지 마세요. FeedON 서버는 입력과 결과를 별도 저장하지 않습니다. Google 무료 API는 입력·응답을 제품 개선에 사용하며 사람이 검토할 수 있으므로, 익명화한 수업 예시만 사용해 주세요.</p>
      <details><summary>개인정보 처리 · 전송 내용 · 이용 한도</summary><p>학년·과목·학습 목표·관찰 내용·성취/보완 내용·지원 목적만 Google로 HTTPS 전송합니다. API 키와 원본 연구자료는 전송 내용에 포함하지 않습니다. 이용량 기록에는 입력과 결과를 저장하지 않습니다. 자동 필터만으로 모든 개인정보를 찾을 수 없으므로 교사가 전송 전 확인해 주세요. 학생 대사는 예상 대화입니다.</p><p><a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">Google Gemini 무료 API 데이터 처리 안내</a></p><p>운영 기간은 2026년 12월 31일까지입니다. 무료 API 또는 공용 이용 한도에 도달하면 AI 생성을 멈추고 기존 무료 제안을 유지합니다. 실패한 요청도 한도에 포함될 수 있습니다.</p></details>
    </form>}
    {generated && <p>Google Gemini로 생성한 제안입니다. FeedON 서버는 입력과 결과를 별도 저장하지 않으며, Google 무료 API에서는 제품 개선에 사용될 수 있습니다. 학생 대사는 예상 응답입니다.</p>}
    <p role="status" aria-live="polite">{message}</p>
  </aside>;
}
