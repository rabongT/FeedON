export default function PrivacyNotice() {
  return <div className="privacy-notice">
    <section>
      <h3>입력 전 확인해 주세요</h3>
      <p>이름·학교명·연락처와 학생을 알아볼 수 있는 개인정보·민감정보·비공개 정보는 입력하지 마세요. 특정 학생을 식별할 수 없는 익명화한 수업 예시만 사용해 주세요.</p>
    </section>
    <section>
      <h3>어떤 내용이 전송되나요?</h3>
      <p>피드백 만들기를 누르면 학년·과목·학습 목표·관찰 내용·성취/보완 내용·지원 목적이 Google Gemini로 HTTPS 전송됩니다. API 키와 원본 연구자료는 이 내용에 포함하지 않습니다.</p>
    </section>
    <section>
      <h3>저장과 데이터 활용</h3>
      <p>FeedON 서버는 입력과 결과를 별도 저장하지 않습니다. 이용량 관리 저장소에는 사용 횟수와 중복 요청 방지용 식별자만 기록합니다. 호스팅 서비스의 접속 기록과 Google의 데이터 처리는 별도입니다.</p>
      <p>Google 무료 API는 입력·응답을 제품 개선에 사용하며 사람이 검토할 수 있습니다. 자동 필터만으로 모든 개인정보를 찾을 수 없으므로 전송 전 직접 확인해 주세요.</p>
      <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">Google 무료 API 데이터 처리 안내 ↗</a>
    </section>
    <section>
      <h3>이용 안내</h3>
      <p>학생 대사는 예상 대화입니다. 제안은 실제 관찰과 학습 목표에 맞게 확인해 사용해 주세요.</p>
      <p>현재 운영 기간은 2026년 12월 31일까지입니다. 무료 API 또는 공용 이용 한도에 도달하면 AI 생성을 멈추고 기존 무료 제안을 유지합니다. 실패한 요청도 한도에 포함될 수 있습니다.</p>
    </section>
  </div>;
}
