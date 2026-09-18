import { useEffect, useState } from "react";
import oneMarkerPhoto from "./assets/feedback-tools/one-marker-classroom.png";
import fiveFingersPhoto from "./assets/feedback-tools/five-fingers-classroom.png";
import "./App.css";
import "./Home.css";
import "./Theme.css";

const stages = [
  {
    name: "Starter",
    ko: "평가적 피드백",
    desc: "학생의 성취나 산출물에 대해 인정·불인정 또는 옳고 그름을 알려주는 단계",
    role: "현재 수행에 대한 판단을 짧고 분명하게 전달합니다.",
    talk: "이 답은 정확해. 계산 순서도 실수 없이 잘 썼구나.",
    focus: "이 답은 정확해",
    center: "teacher",
    when: "수행의 옳고 그름이나 완료 여부를 즉시 알려야 할 때",
    caution: "막연한 칭찬이나 학생의 특성을 평가하는 말로 끝나지 않게 합니다.",
    examples: ["두 자료의 공통점을 정확히 표시했어.", "풀이의 마지막 계산에서 오류가 있어.", "문단의 중심 내용을 빠짐없이 찾았구나."],
  },
  {
    name: "Planner",
    ko: "성취 확인",
    desc: "학생이 향상한 점, 성취한 내용, 충족한 기준을 구체적으로 알려주고 수행에 필요한 정보를 제공하는 단계",
    role: "지난 수행과 비교해 나아진 점과 이미 충족한 기준을 구체적인 증거로 확인해 줍니다.",
    talk: "지난번엔 근거를 한 가지만 썼는데, 이번엔 두 가지 근거를 모두 찾아 기준을 충족했어.",
    focus: "두 가지 근거를 모두 찾아 기준을 충족",
    center: "teacher",
    when: "학생이 자신의 진전과 현재 성취를 분명히 인식해야 할 때",
    caution: "다음 행동을 일방적으로 지시하기보다 성취 근거를 구체적으로 말합니다.",
    examples: ["주장에 알맞은 근거를 지난번보다 한 가지 더 찾았어.", "풀이 과정과 답을 모두 확인하는 기준을 충족했어.", "지역의 특징과 생활 모습을 연결해 설명했구나."],
  },
  {
    name: "Guide",
    ko: "차이와 개선점 안내",
    desc: "학습 목표와 현재 상태의 차이를 밝히고 개선할 점과 필요한 설명·힌트를 제공하는 단계",
    role: "현재 수행과 목표 사이의 차이를 짚고, 문제를 풀어 갈 설명이나 단서를 구체적으로 안내합니다.",
    talk: "중심 생각은 정확히 찾았어. 이걸 뒷받침하는 문장을 한 가지만 더 찾아 근거로 덧붙여 보자.",
    focus: "뒷받침하는 문장을 한 가지만 더",
    center: "teacher",
    when: "학생에게 다음 수행의 방향과 기대 수준을 명확히 안내할 때",
    caution: "힌트는 제공하되 학생의 수행 전체를 교사가 대신 완성하지 않습니다.",
    examples: ["중심 생각은 찾았어. 이를 뒷받침하는 문장을 근거로 덧붙여 보자.", "계산은 맞았지만 사용한 방법을 설명하는 과정이 더 필요해.", "지도에서 찾은 특징이 주민 생활과 어떤 관련이 있는지 보충해 보자."],
  },
  {
    name: "Coach",
    ko: "해결 방법 이끌어내기",
    desc: "이전과 현재를 비교하며 더 나아갈 방법을 학생과 대화로 함께 찾는 단계",
    role: "부족한 점보다 앞으로의 방법에 초점을 두고, 질문을 통해 해결 전략을 학생에게서 이끌어냅니다.",
    talk: "이 부분에서 막혔구나. 다른 방법으로 풀어본다면 어디서부터 다시 시작해 보고 싶어?",
    focus: "어디서부터 다시 시작",
    center: "together",
    when: "학생이 대화를 통해 개선 방법을 스스로 찾을 수 있을 때",
    caution: "정답으로 유도하는 질문보다 학생의 전략과 근거를 묻습니다.",
    examples: ["네 주장을 더 설득력 있게 만들 방법에는 무엇이 있을까?", "두 풀이를 비교하면 오류를 확인할 기준을 어떻게 세울 수 있을까?", "친구 의견을 반영한다면 어느 부분부터 바꾸고 싶니?"],
  },
  {
    name: "Designer",
    ko: "평가기준 공동 설계",
    desc: "학생과 학습 목표·성공 기준을 함께 만들고, 그 기준으로 수행을 공동 평가하는 단계",
    role: "최종 성취를 먼저 생각하는 백워드 설계로 성공 기준을 함께 만들고 자기·동료평가와 수정까지 연결합니다.",
    talk: "이 글이 잘 썼다고 말할 수 있으려면, 우리가 어떤 기준으로 확인해 보면 좋을까?",
    focus: "어떤 기준으로 확인",
    center: "together",
    when: "학생이 목표와 성공 기준을 이해하고 평가 과정에 참여할 수 있을 때",
    caution: "교사가 미리 정한 기준을 형식적으로 확인받는 활동이 되지 않게 합니다.",
    examples: ["설득하는 글을 잘 썼다고 판단할 기준을 함께 정해 볼까?", "좋은 풀이 설명이 갖추어야 할 조건으로 무엇을 넣으면 좋을까?", "지역 조사 결과를 평가할 체크리스트를 함께 만들어 보자."],
  },
];

const feedbackFocus = [
  {
    name: "과정에 대한 피드백",
    tag: "어떻게 배우고 있는가",
    desc: "학생이 사용한 전략과 수행 과정, 막힌 지점을 살펴 목표와 현재 수행의 차이를 스스로 좁히도록 돕습니다.",
    use: "오류의 원인을 찾거나 다음 전략을 계획해야 할 때",
  },
  {
    name: "결과에 대한 피드백",
    tag: "무엇을 해냈는가",
    desc: "과제의 구체적인 내용과 성취 결과를 기준에 비추어 빠르고 분명하게 확인해 줍니다.",
    use: "정답·완성 여부나 현재 성취를 즉시 확인해야 할 때",
  },
];

const feedbackChecks = [
  ["기준", "학습 목표와 분명한 평가 기준에 근거했나요?"],
  ["시기", "학생이 다시 시도할 수 있을 때 제공하나요?"],
  ["초점", "핵심 내용에 집중하고 분량은 알맞나요?"],
  ["구체성", "다음 행동은 보이되 답을 대신해 주지는 않나요?"],
  ["주도성", "학생이 선택하고 수정할 여지를 남겼나요?"],
  ["근거", "실제 수행과 학생의 생각을 반영했나요?"],
];

// 책의 공식 도구 분류가 아니라, 피드백 정보를 확인하고 전달하는 교실 활용 방법이다.
const tools = [
  ["one", "양면 원마커", "빨강·초록 양면 원마커로 학생이 자신의 이해 정도와 도움 필요 여부를 실시간으로 조용히 알리는 도구", "다른 학생의 시선을 끌지 않고 개별 도움이 필요한 학생을 확인할 때", "비공개 도움 요청과 즉각적 피드백"],
  ["hand", "다섯 손가락", "학생이 손가락 수로 자신의 이해 정도를 나타내는 자기점검 도구로, 학습의 어느 단계에서나 사용할 수 있습니다.", "설명이나 활동 전후에 학급 전체의 이해 정도를 빠르게 살피고 교사가 과정을 관찰할 때", "이해도 확인과 메타인지적 자기점검"],
  ["traffic", "학습신호등", "빨강·노랑·초록 세 가지 색으로 학생이 자신의 이해 정도를 표현하는 도구", "중요한 내용을 설명한 뒤 학생별 이해 정도를 한눈에 확인할 때", "이해도 확인과 도움 대상 파악"],
  ["ticket", "입장티켓", "수업 시작 단계에서 학생들이 알고 있는 것 또는 알고 싶은 것을 확인하는 활동", "수업을 시작하며 선개념과 궁금한 점을 확인할 때", "수업 전 진단과 학습 방향 설정"],
  ["ticket", "퇴장티켓", "수업을 마칠 때 학생이 배운 점이나 어려웠던 점에 대한 간단한 피드백을 작성하여 교사에게 제출하는 활동", "수업을 마치며 이해 정도와 다음 지원이 필요한 부분을 확인할 때", "배움 회고와 후속 수업 계획"],
  ["check", "체크리스트", "수행 요소의 충족 여부를 빠르게 확인하는 도구", "여러 수행 기준을 빠짐없이 확인할 때", "과정 점검"],
  ["document", "자기점검표", "학생이 자신의 수행을 스스로 돌아보게 하는 도구", "과제 제출 전 기준에 따라 스스로 검토할 때", "자기 조절"],
  ["compare", "예시 비교", "좋은 예와 수정이 필요한 예를 비교하며 기준을 이해하도록 돕는 도구", "평가 기준을 구체적인 사례로 이해시킬 때", "기준 이해"],
  ["speech", "다시 말하기", "학생이 자신의 생각이나 답을 다시 표현하며 점검하게 하는 도구", "생각은 있으나 표현이 불명확할 때", "재수행"],
  ["people", "동료 설명", "친구에게 설명하며 이해를 정리하고 확인하는 도구", "말로 설명하며 개념을 정교화할 때", "상호 피드백"],
  ["oral", "즉시 구두 피드백", "활동 중 바로 짧게 말로 제공하는 피드백", "즉시 수정할 수 있는 수행 장면에서", "즉각적 교정"],
  ["comment", "디지털 코멘트", "디지털 플랫폼에서 개별 의견이나 조언을 남기는 피드백 방식", "결과물에 개별 기록을 남기고 다시 확인할 때", "기록형 피드백"],
  ["postit", "포스트잇 동료평가", "포스트잇에 친구의 강점과 도움이 될 조언을 짧게 적어 주고받는 동료평가 방법", "작품이나 수행 결과를 함께 살펴보고 구체적인 의견을 나눌 때", "동료 피드백과 수행 개선"],
];

function Icon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const shapes = {
    one: (
      <>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    hand: <path d="M7 12V7a1.5 1.5 0 0 1 3 0v3-5a1.5 1.5 0 0 1 3 0v5-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5c0 5-3 7-7 7-3 0-5-2-7-5l-2-3a1.5 1.5 0 0 1 2-2l2 1Z" />,
    ticket: <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7Zm8 0v10" />,
    traffic: <><circle cx="12" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/><rect x="7" y="2" width="10" height="20" rx="3"/></>,
    check: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="m8 12 3 3 6-7" />
      </>
    ),
    document: (
      <>
        <path d="M6 3h9l3 3v15H6V3Z" />
        <path d="M14 3v4h4m-8 7 2 2 4-5" />
      </>
    ),
    compare: (
      <>
        <rect x="3" y="6" width="8" height="12" rx="1" />
        <rect x="13" y="6" width="8" height="12" rx="1" />
        <path d="M6 10h2m8 0h2" />
      </>
    ),
    speech: <path d="M4 5h16v11H9l-4 3v-3H4V5Zm4 5h8" />,
    people: (
      <>
        <circle cx="8" cy="8" r="2" />
        <circle cx="16" cy="8" r="2" />
        <path d="M3 18c0-3 2-5 5-5s5 2 5 5m-1-3c1-2 5-3 8 0" />
      </>
    ),
    oral: (
      <>
        <circle cx="8" cy="10" r="3" />
        <path d="M3 20c0-4 2-6 5-6s5 2 5 6m1-14h7v8h-3l-2 2v-2h-2V6Z" />
      </>
    ),
    comment: (
      <>
        <rect x="4" y="4" width="16" height="14" rx="2" />
        <path d="m8 21 4-3h5M8 9h8m-8 4h5" />
      </>
    ),
    postit: <><path d="M5 4h14v11l-5 5H5V4Z"/><path d="M14 20v-5h5M8 9h8m-8 4h5"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {shapes[type]}
    </svg>
  );
}

function Header({ goHome, openHelp }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="header">
      <div className="header-inner">
        <button className="brand" onClick={() => { goHome(); setMenuOpen(false); }}>
          <img src="/school-logo.png" alt="서울경인초등학교" className="brand-logo" />
          <span className="brand-name"><span className="brand-feed">Feed</span><span className="brand-on">ON</span></span>
        </button>
        <nav className="site-nav" aria-label="주요 메뉴">
          <button className="nav-link nav-stages" onClick={() => openHelp("stages")}><span aria-hidden="true">⑤</span> 피드백 5단계</button>
          <button className="nav-link nav-tools" onClick={() => openHelp("tools")}><span aria-hidden="true">▣</span> 피드백 도구</button>
        </nav>
        <button
          className="hamburger"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="모바일 메뉴">
          <button className="mobile-nav-link nav-stages" onClick={() => { openHelp("stages"); setMenuOpen(false); }}>⑤ 피드백 5단계</button>
          <button className="mobile-nav-link nav-tools" onClick={() => { openHelp("tools"); setMenuOpen(false); }}>▣ 피드백 도구</button>
        </nav>
      )}
    </header>
  );
}

function FeedbackToolsGuide() {
  const [selectedTool, setSelectedTool] = useState(null);
 return (
    <>
      <p className="modal-intro">
        먼저 학생에게 필요한 <b>피드백의 초점</b>을 정하고, 그다음 수업 맥락에 맞는 확인·전달 방법을 고르세요.
      </p>
      <div className="focus-grid">
        {feedbackFocus.map((item, i) => (
          <article key={item.name} className={`focus-card focus-${i + 1}`}>
            <span>{item.tag}</span>
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <small>
              <b>활용 시점</b> {item.use}
            </small>
          </article>
        ))}
      </div>
      <div className="guide-heading">
        <span>CLASSROOM METHODS</span>
        <h3>교실에서 활용하는 확인·전달 방법</h3>
        <p>아래 방법은 피드백 그 자체가 아니라, 학생의 수행 정보를 확인하고 피드백을 주고받는 방법입니다.</p>
      </div>
      <div className="tool-accordion">
        {tools.map((t, i) => {
          const isOpen = selectedTool === i;
          return <section key={t[1]} className={isOpen ? "open" : ""}><button onClick={() => setSelectedTool(isOpen ? null : i)} aria-expanded={isOpen}><span className="tool-icon"><Icon type={t[0]} /></span><b>{t[1]}</b><i>{isOpen ? "−" : "+"}</i></button>{isOpen && <div className="tool-accordion-detail"><ToolCard tool={t} detailed /></div>}</section>;
        })}
      </div>
      <section className="quality-check">
        <div>
          <span>EFFECTIVE FEEDBACK</span>
          <h3>말하기 전, 효과적인 피드백 점검</h3>
        </div>
        <ul>
          {feedbackChecks.map(([key, value]) => (
            <li key={key}>
              <b>{key}</b>
              <span>{value}</span>
            </li>
          ))}
        </ul>
        <p>강점은 구체적으로 확인하고, 개선점은 학생이 실행할 수 있는 한 가지 다음 행동으로 좁혀 보세요.</p>
      </section>
      <p className="source-note">구성 근거: 김선·반재천, 『학생의 배움과 성장을 지원하는 과정 중심 피드백』의 과정·결과 피드백 구분 및 효과적인 피드백 원칙. 교실 활용 방법은 FeedON에서 수업 적용을 위해 별도로 정리했습니다.</p>
    </>
  );
}

function FeedbackStagesGuide() {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];
  const participation = selected < 3 ? "교사가 정보를 제공해요" : selected === 3 ? "교사와 학생이 해결 방법을 함께 찾아요" : "교사와 학생이 기준을 함께 만들고 평가해요";
  return <>
    <p className="modal-intro">단계가 올라갈수록 좋은 피드백이라는 뜻이 아닙니다. 지금 학생에게 필요한 <b>지원 방식</b>을 골라 사용하세요.</p>
    <div className="stage-help-picker" role="tablist" aria-label="피드백 5단계 선택">{stages.map((s,i)=><button key={s.name} role="tab" aria-selected={selected===i} className={selected===i?"active":""} onClick={()=>setSelected(i)}><span>{i+1}</span><b>{s.name}</b><small>{s.ko}</small></button>)}</div>
    <article className={`stage-help-detail stage-${selected+1}`} role="tabpanel">
      <div className="stage-help-head"><span>{selected+1}단계</span><h3>{stage.name} <small>{stage.ko}</small></h3></div>
      <div className="stage-help-point"><b>한마디로</b><p>{stage.desc}</p></div>
      <dl><div><dt>누가 중심인가요?</dt><dd>{participation}<CenterBadge center={stage.center}/></dd></div><div><dt>교사는 무엇을 하나요?</dt><dd>{stage.role}</dd></div><div><dt>언제 사용하나요?</dt><dd>{stage.when}</dd></div></dl>
      <div className="stage-help-talk"><span>교실에서 이렇게 말해요</span><blockquote>“<HighlightTalk stage={stage}/>”</blockquote></div>
      {selected===4&&<p className="backward-note"><b>디자이너의 핵심</b> 최종적으로 무엇을 성취해야 하는지 먼저 정한 뒤, 학생과 성공 기준을 만들고 그 기준으로 자기·동료평가와 수정을 이어 갑니다.</p>}
    </article>
    <div className="notice"><b>학생을 다섯 수준으로 나누는 체계가 아닙니다.</b><p>같은 학생에게도 상황에 따라 다른 단계를 사용할 수 있습니다.</p></div>
  </>;
}

function Modal({ type, close }) {
  useEffect(() => {
    const f = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [close]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div>
            <p className="eyebrow">QUICK REFERENCE</p>
            <h2 id="modal-title">FeedON 피드백 {type === "tools" ? "도구" : "5단계"}</h2>
          </div>
          <button className="close" onClick={close} aria-label="닫기">
            ×
          </button>
        </div>
        {type === "tools" ? <FeedbackToolsGuide /> : <FeedbackStagesGuide />}
      </section>
    </div>
  );
}

function InfoTip({ text }) {
  const [on, setOn] = useState(false);
  return (
    <span className="info-wrap">
      <button className="info" onClick={() => setOn(!on)} aria-label={text} aria-expanded={on}>
        i
      </button>
      <span className={`tooltip ${on ? "show" : ""}`} role="tooltip">
        {text}
      </span>
    </span>
  );
}
function CenterBadge({ center }) {
  return (
    <div className={`center-badge ${center}`} aria-label={center === "teacher" ? "교사 중심" : center === "student" ? "학생 중심" : "교사와 학생의 쌍방향 상호작용"}>
      <span>교사</span>
      <i aria-hidden="true">{center === "together" ? "↔" : "→"}</i>
      <span>학생</span>
    </div>
  );
}
function HighlightTalk({ stage }) {
  const parts = stage.talk.split(stage.focus);
  return (
    <>
      {parts[0]}
      <strong>{stage.focus}</strong>
      {parts[1]}
    </>
  );
}
function Dialogue({ lines }) {
  return (
    <div className="dialogue" aria-label="교사와 학생의 대화 예시">
      {lines.map((line, i) => (
        <div className={`dialogue-line ${line.who === "교사" ? "teacher" : "student"}`} key={`${line.who}-${i}`}>
          <b>
            {line.who}
            {line.who === "학생" && <small> 예상 응답</small>}
          </b>
          <p>{line.text}</p>
        </div>
      ))}
    </div>
  );
}
function ToolCard({ tool: t, detailed = false }) {
  const special = t[0] === "one" || t[0] === "hand";
  return (
    <article className={`tool-card ${special && detailed ? "featured-tool" : ""}`}>
      {special && detailed && <img className="tool-photo" src={t[0] === "one" ? oneMarkerPhoto : fiveFingersPhoto} alt={t[0] === "one" ? "책상 위에 빨간 면이 보이도록 놓은 양면 원마커를 보고 교사가 학생에게 다가가는 모습" : "학생들이 주먹, 한두 손가락, 다섯 손가락으로 이해 정도를 표시하는 교실 모습"} />}
      <div className="tool-line">
        <span className="tool-icon">
          <Icon type={t[0]} />
        </span>
        <div>
          <h3>{t[1]}</h3>
          {!detailed && <p>{t[4]}</p>}
        </div>
        <InfoTip text={t[2]} />
      </div>
      {detailed && (
        <>
          <p>{t[2]}</p>
          {t[0] === "one" && (
            <div className="tool-how">
              <h4>사용 방법</h4>
              <ul>
                <li>
                  <b>초록 면</b> — 지금은 스스로 학습할 수 있어요.
                </li>
                <li>
                  <b>빨간 면</b> — 도움이 필요해요. 교사가 학생에게 가서 피드백을 제공합니다.
                </li>
              </ul>
              <p>
                <b>장점</b> 도움 요청에 다른 친구들의 관심이 집중되지 않으며, 교사는 도움이 필요한 학생을 빠르게 찾아 즉각적으로 지원할 수 있습니다.
              </p>
            </div>
          )}
          {t[0] === "hand" && (
            <div className="tool-how">
              <h4>손가락 신호</h4>
              <ol className="finger-scale">
                <li>
                  <b>0 · 닫힌 주먹</b>
                  <span>잘 모르겠어요</span>
                </li>
                <li>
                  <b>1 · 한 손가락</b>
                  <span>조금 더 설명이 필요해요</span>
                </li>
                <li>
                  <b>4 · 네 손가락</b>
                  <span>이해했어요</span>
                </li>
                <li>
                  <b>5 · 다섯 손가락</b>
                  <span>다른 친구를 가르칠 수 있어요</span>
                </li>
              </ol>
            </div>
          )}
          <dl>
            <div>
              <dt>활용 시점</dt>
              <dd>{t[3]}</dd>
            </div>
            <div>
              <dt>피드백 목적</dt>
              <dd>{t[4]}</dd>
            </div>
          </dl>
        </>
      )}
    </article>
  );
}

/* oxlint-disable-next-line no-unused-vars */
function HomeOriginal({ navigate, openHelp }) {
  return (
    <main className="home">
      <section className="hero-section">
        <div className="hero-brand" aria-label="FeedON">
          <span>Feed</span>
          <strong>ON</strong>
          <small>학생 주도성을 켜는 퍼스널 피드백 도우미</small>
        </div>
        <p className="eyebrow">PERSONAL FEEDBACK FOR TEACHERS</p>
        <h1>
          학생의 오늘을 읽고,
          <br />
          <em>다음 배움</em>을 함께 엽니다.
        </h1>
        <p className="lead">수업에서 관찰한 말과 행동을 바탕으로 학생에게 필요한 피드백 방식과 자연스러운 Teacher Talk을 설계하세요.</p>
        <div className="benefit-grid">
          <article>
            <span>01</span>
            <b>관찰 근거에서 시작</b>
            <p>막연한 판단 대신 학생이 실제로 보인 말과 행동을 중심에 둡니다.</p>
          </article>
          <article>
            <span>02</span>
            <b>5단계로 관점 확장</b>
            <p>같은 수행도 학생에게 필요한 지원 정도에 따라 다르게 바라봅니다.</p>
          </article>
          <article>
            <span>03</span>
            <b>바로 말할 수 있게</b>
            <p>교실에서 자연스럽게 사용할 Teacher Talk으로 바꾸어 드립니다.</p>
          </article>
        </div>
        <div className="how-it-works">
          <span>
            <b>1</b> 수행 모습 입력
          </span>
          <i>→</i>
          <span>
            <b>2</b> 피드백 전략 확인
          </span>
          <i>→</i>
          <span>
            <b>3</b> Teacher Talk 선택
          </span>
        </div>
        <div className="track-grid single">
          <button className="track feedback" onClick={() => navigate("feedback")}>
            <span className="track-num">START</span>
            <span>
              <b>학생 수행 기록하고 피드백 만들기</b>
              <small>필수 입력은 학습 목표와 실제 수행 모습 두 가지예요</small>
            </span>
            <i>→</i>
          </button>
        </div>
        <button className="text-button" onClick={() => openHelp("stages")}>
          <span className="steps-icon">5</span> 피드백 5단계 먼저 알아보기 <span>→</span>
        </button>
      </section>
      <section className="home-note">
        <span>FeedON의 약속</span>
        <p>학생을 수준으로 나누지 않습니다. 실제 수행의 증거에서 출발해, 학생이 다음 행동을 스스로 선택하도록 돕습니다.</p>
      </section>
    </main>
  );
}

function Home({ navigate, openHelp }) {
  return (
    <main className="home-v2">
      {/* Hero */}
      <section className="hero-v2" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="hero-label">피드백 한 스푼, 성장 두 스푼</p>
          <div className="hero-product-name" aria-label="FeedON">
            <span>Feed</span><button type="button" onClick={() => navigate("feedback")} aria-label="ON: 피드백 만들기 시작" title="피드백 만들기 시작">ON</button>
          </div>
          <h1 className="hero-title" id="hero-heading">
            학생 주도성을 켜는<br />
            퍼스널 피드백 도우미
          </h1>
          <p className="hero-intro">학생의 실제 수행을 바탕으로 다음 성장을 돕는 피드백을 설계하세요.</p>
        </div>
        <aside className="hero-action-panel" aria-label="피드백 만들기 시작">
          <span className="panel-kicker">FEEDBACK ON</span>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("feedback")}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="btn-content">
                <span className="btn-title">피드백 만들기 시작</span>
                <span className="btn-sub">학년 · 학습 목표 · 실제 수행 모습을 입력하세요.</span>
              </span>
              <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <p className="panel-description">관찰한 모습을 입력하면 바로 활용할 수 있는 피드백 문장과 Teacher Talk을 제안합니다.</p>
            <div className="panel-flow" aria-label="피드백 만들기 과정">
              <span><b>1</b> 실제 수행 기록</span><i aria-hidden="true">→</i><span><b>2</b> 피드백 확인</span>
            </div>
            <button className="btn-secondary" onClick={() => openHelp("stages")}>
              <span aria-hidden="true">💡</span>
              피드백 5단계 알아보기
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{width:15,height:15}}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </aside>
      </section>

      {/* Value props */}
      <section className="values-section" aria-label="FeedON 핵심 가치">
        <ul className="values-grid">
          {[
            { icon: "document", title: "학생 맞춤 피드백", desc: "학생의 실제 수행에 기반한 개별화된 피드백 제안" },
            { icon: "people", title: "학생 주도성 지원", desc: "스스로 생각하고 성장하는 학습 경험 설계" },
            { icon: "check", title: "교사의 부담은 줄이고", desc: "빠르고 쉽게, 바로 활용할 수 있는 피드백 문구와 전략" },
            { icon: "speech", title: "더 나은 수업으로", desc: "관찰에서 평가, 피드백까지 연결되는 수업 디자인" },
          ].map((v) => (
            <li key={v.title} className="value-card">
              <span className="value-icon"><Icon type={v.icon} /></span>
              <strong className="value-title">{v.title}</strong>
              <p className="value-desc">{v.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const initialAssessment = {
  grade: "",
  subject: "",
  unit: "",
  sessions: "4",
  focus: [],
};
function Field({ label, required, children, hint }) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <i>필수</i>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function PageIntro({ step, title, desc }) {
  return (
    <div className="page-intro">
      <span className="step">{step}</span>
      <div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function AssessmentForm({ initial, onSubmit, back }) {
  const [form, setForm] = useState(initial || initialAssessment);
  const focuses = ["개념 이해", "탐구", "의사소통", "문제 해결", "실생활 적용", "협력", "기타"];
  const set = (k, v) => setForm({ ...form, [k]: v });
  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  return (
    <main className="page">
      <button className="back" onClick={back}>
        ← 처음으로
      </button>
      <PageIntro step="평가 ON · 1/2" title="수업의 맥락을 알려주세요" desc="입력한 내용으로 탐구의 흐름과 관찰 가능한 평가를 설계합니다." />
      <form className="form-sheet" onSubmit={submit}>
        <div className="form-grid">
          <Field label="학년" required>
            <select value={form.grade} onChange={(e) => set("grade", e.target.value)} required>
              <option value="">선택하세요</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n}>{n}학년</option>
              ))}
            </select>
          </Field>
          <Field label="과목" required>
            <select value={form.subject} onChange={(e) => set("subject", e.target.value)} required>
              <option value="">선택하세요</option>
              {["국어", "수학", "사회", "과학", "도덕", "체육", "음악", "미술", "실과", "영어"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="단원" required hint="예: 우리 지역의 모습과 생활">
          <input value={form.unit} onChange={(e) => set("unit", e.target.value)} required placeholder="단원명 또는 핵심 내용을 입력하세요" />
        </Field>
        <Field label="예상 차시 수">
          <input type="number" min="1" max="12" value={form.sessions} onChange={(e) => set("sessions", e.target.value)} />
        </Field>
        <fieldset>
          <legend>
            강조하고 싶은 학습 <span>선택</span>
          </legend>
          <div className="chips">
            {focuses.map((x) => (
              <label key={x} className={form.focus.includes(x) ? "selected" : ""}>
                <input type="checkbox" checked={form.focus.includes(x)} onChange={() => set("focus", form.focus.includes(x) ? form.focus.filter((y) => y !== x) : [...form.focus, x])} />
                {x}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="button" className="secondary" onClick={back}>
            취소
          </button>
          <button className="primary">
            평가 설계안 만들기 <span>→</span>
          </button>
        </div>
      </form>
    </main>
  );
}

function makeAssessment(form) {
  const n = Math.min(Number(form.sessions) || 4, 6);
  return {
    standard: "확인 필요",
    area: `${form.subject}과 관련 영역`,
    note: "2022 개정 교육과정 원문에서 학년군과 단원에 해당하는 성취기준을 확인한 뒤 교사가 최종 선택해 주세요.",
    unitQuestions: ["우리 지역의 자연환경은 사람들의 생활 모습에 어떤 영향을 줄까?", "더 살기 좋은 지역을 만들기 위해 우리는 무엇을 살펴보아야 할까?"],
    sessions: Array.from({ length: n }, (_, i) => ({
      focus: ["경험 떠올리기", "자료에서 특징 찾기", "관계 설명하기", "관점 비교하기", "생각 정리하기", "삶에 적용하기"][i] || "배움 확장하기",
      q: `${i + 1}차시의 배움을 우리 생활과 어떻게 연결해 설명할 수 있을까?`,
    })),
    elements: ["글의 중심 생각을 뒷받침하는 내용을 찾아 근거와 함께 설명한다.", "읽는 사람과 목적을 고려해 알맞은 표현을 선택한다.", "친구의 의견을 듣고 자신의 표현을 구체적으로 수정한다."],
    task: {
      name: "우리 반을 위한 문제 해결 설명서",
      situation: "생활 속 문제를 수학적 방법으로 해결하고 풀이 과정을 친구에게 소개합니다.",
      perform: "해결 전략을 두 가지 이상 시도하고, 선택한 방법과 결과가 타당한 까닭을 설명합니다.",
      link: "문제 해결 과정, 수학적 의사소통, 결과의 타당성을 함께 관찰합니다.",
    },
    method: "교사 관찰평가 + 수행평가",
    methodWhy: "실제 수행 과정에서 전략을 선택하고 설명을 수정하는 모습을 관찰하며, 완성된 결과물과 해결 과정의 근거를 함께 확인하기에 적절합니다.",
    tool: "관찰 체크리스트 + 수행 기록지",
  };
}

function Section({ no, title, children }) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <span>{no}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
function AssessmentResult({ form, result, toFeedback, edit }) {
  return (
    <main className="page result-page">
      <button className="back" onClick={edit}>
        ← 입력 내용 수정
      </button>
      <PageIntro step="평가 ON · 2/2" title={`${form.grade} ${form.subject} 평가 설계안`} desc={`${form.unit} · ${form.sessions}차시${form.focus.length ? " · " + form.focus.join(", ") : ""}`} />
      <div className="result-doc">
        <Section no="01" title="교육과정 연결">
          <div className="standard">
            <span className="status">확인 필요</span>
            <div>
              <h3>관련 성취기준 코드와 문구</h3>
              <p>신뢰할 수 있는 교육과정 원문 확인이 필요합니다.</p>
            </div>
          </div>
          <dl className="info-rows">
            <div>
              <dt>관련 영역 후보</dt>
              <dd>{result.area}</dd>
            </div>
            <div>
              <dt>적용 시 고려사항</dt>
              <dd>{result.note}</dd>
            </div>
          </dl>
        </Section>
        <Section no="02" title="탐구 설계">
          <h3 className="subhead">
            단원 탐구질문 제안 <small>사회 예시</small>
          </h3>
          <ol className="big-questions">
            {result.unitQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
          <h3 className="subhead">차시별 탐구질문</h3>
          <div className="session-table">
            {result.sessions.map((s, i) => (
              <div key={i}>
                <b>{i + 1}차시</b>
                <span>{s.focus}</span>
                <p>{s.q}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section no="03" title="평가 설계">
          <h3 className="subhead">
            평가 요소 <small>국어 예시</small>
          </h3>
          <ul className="check-list">
            {result.elements.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h3 className="subhead">
            평가 과제 <small>수학 예시</small>
          </h3>
          <div className="task-block">
            <h3>{result.task.name}</h3>
            <dl className="info-rows">
              <div>
                <dt>평가 상황</dt>
                <dd>{result.task.situation}</dd>
              </div>
              <div>
                <dt>학생 수행</dt>
                <dd>{result.task.perform}</dd>
              </div>
              <div>
                <dt>평가 요소와 연결</dt>
                <dd>{result.task.link}</dd>
              </div>
            </dl>
          </div>
          <div className="recommend-pair">
            <div>
              <span>추천 평가 방법</span>
              <h3>{result.method}</h3>
              <p>{result.methodWhy}</p>
            </div>
            <div>
              <span>추천 평가 도구</span>
              <h3>{result.tool}</h3>
              <p>관찰 기준과 학생의 설명을 구분해 기록하면 수행의 변화가 선명해집니다.</p>
            </div>
          </div>
        </Section>
        <Section no="04" title="FeedON 성장 단계">
          <p className="section-desc">국가교육과정의 공식 성취수준 명칭이 아닌, 피드백 설계를 위한 FeedON의 관찰 언어입니다.</p>
          <div className="growth">
            <div>
              <b>확장</b>
              <p>새로운 상황에 적용하거나 배움을 확장할 수 있어요.</p>
            </div>
            <div>
              <b>성장</b>
              <p>핵심을 대체로 달성했고 일부 보완으로 안정될 수 있어요.</p>
            </div>
            <div>
              <b>도움</b>
              <p>예시, 단서, 질문, 모델링 등의 지원이 필요해요.</p>
            </div>
          </div>
        </Section>
      </div>
      <button className="primary bridge" onClick={toFeedback}>
        이 평가로 학생 피드백 만들기 <span>→</span>
      </button>
    </main>
  );
}

const blankFeedback = {
  grade: "",
  subject: "",
  unit: "",
  session: "",
  goal: "",
  observation: "",
};
const feedbackExamples = {
  국어: { grade: "4학년", subject: "국어", unit: "중심 생각을 찾아요", session: "3차시", goal: "글의 중심 생각을 찾고 뒷받침하는 내용을 근거로 설명하기", observation: "글의 중심 생각은 정확히 찾았지만, 뒷받침하는 문장을 고를 때 자신의 느낌을 근거로 제시했다. 교사가 ‘글에서 확인할 수 있는 문장을 찾아보자’고 하자 해당 문장에 밑줄을 그었다." },
  수학: { grade: "5학년", subject: "수학", unit: "분수의 덧셈과 뺄셈", session: "4차시", goal: "분모가 다른 분수의 덧셈 과정을 설명하고 답이 타당한지 확인하기", observation: "통분하여 계산한 답은 맞았으나 왜 통분해야 하는지 설명하지 못했다. 두 분수 모형을 비교한 뒤에는 ‘조각의 크기를 같게 해야 더할 수 있다’고 말했지만 풀이에는 그 내용을 쓰지 않았다." },
  사회: { grade: "4학년", subject: "사회", unit: "우리 지역의 모습", session: "2차시", goal: "지도와 사진 자료를 근거로 우리 지역의 특징과 생활 모습을 연결하여 설명하기", observation: "지도에서 하천과 도로의 위치를 찾아 표시했고 사람이 많이 모이는 장소도 찾았다. 그러나 지역의 자연환경과 사람들의 생활 모습이 어떻게 연결되는지는 자료를 근거로 설명하지 못했다." },
  과학: { grade: "5학년", subject: "과학", unit: "식물의 구조와 기능", session: "3차시", goal: "관찰 결과를 근거로 식물의 구조와 기능 설명하기", observation: "잎과 줄기의 특징은 정확히 관찰해 기록했지만, 각 구조가 하는 일을 설명할 때 관찰 결과를 근거로 연결하지 못했다. 친구의 설명을 듣고 자신의 기록에서 근거가 될 부분에 밑줄을 그었다." },
};
const observationExamples = [
  { label: "정답은 맞았지만 풀이 설명은 못함", category: "학생이 한 말", text: "답은 정확히 제시했지만 풀이한 까닭을 묻자 ‘그냥 이렇게 하면 돼요’라고 답했다. 교사가 사용한 방법을 순서대로 말해 보게 하자 첫 단계까지는 설명했다." },
  { label: "생각은 먼저 말하고 근거는 뒤늦게 찾음", category: "학생이 한 말", text: "자신의 생각을 먼저 말한 뒤 자료에서 근거가 되는 부분을 찾아 가리켰다. 다만 그 근거가 자신의 생각을 어떻게 뒷받침하는지는 설명하지 못했다." },
  { label: "안 되는 방법 대신 다른 방법으로 재시도", category: "시도한 방법", text: "처음 사용한 방법으로 해결되지 않자 그림과 표로 다시 나타내 보았다. 두 방법의 결과를 비교했지만 어느 방법이 더 알맞은지는 선택하지 못했다." },
  { label: "혼자 시작 못했지만 힌트 받고 끝까지 이어감", category: "시도한 방법", text: "과제를 시작하지 못하고 있었으나 교사가 첫 순서를 질문으로 안내하자 필요한 자료를 스스로 찾아 다음 단계까지 수행했다." },
  { label: "검산 중 오류를 발견하고 스스로 고침", category: "오류와 수정", text: "결과를 다시 확인하는 과정에서 앞의 답과 맞지 않는 부분을 발견했다. 계산 과정을 한 줄씩 비교해 오류가 난 곳에 표시하고 답을 스스로 수정했다." },
  { label: "지적받은 오류가 다음 문제에서 또 반복됨", category: "오류와 수정", text: "교사의 안내를 듣고 한 문항의 오류는 고쳤지만 비슷한 다음 문항에서는 같은 오류가 다시 나타났다. 무엇을 확인해야 하는지 묻자 기준을 말로 설명하지 못했다." },
  { label: "친구 설명 듣고 자기 기록을 스스로 고침", category: "친구와의 상호작용", text: "친구의 설명을 들으며 자신의 결과와 다른 부분에 표시했다. 질문을 한 뒤 빠진 내용을 찾아 자신의 기록을 고치고 수정한 까닭을 친구에게 설명했다." },
  { label: "모둠 의견 차이를 근거로 조율하려 시도", category: "친구와의 상호작용", text: "모둠에서 서로 다른 의견이 나오자 두 의견의 공통점과 차이점을 정리했다. 자료를 근거로 한 의견을 선택하자고 제안했지만 최종 기준을 합의하지는 못했다." },
];
function FeedbackForm({ initial, onSubmit, back }) {
  const [f, setF] = useState({ ...blankFeedback, ...initial });
  const [errors, setErrors] = useState({});
  const [exampleFields, setExampleFields] = useState(new Set());
  const set = (key, value) => {
    setF({ ...f, [key]: value });
    setErrors({ ...errors, [key]: "" });
    setExampleFields((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  };
  const fillExample = (subject) => {
    setF(feedbackExamples[subject]);
    setErrors({});
    setExampleFields(new Set(["grade", "subject", "unit", "session", "goal", "observation"]));
  };
  const fillObservationExample = (text) => {
    setF((current) => ({ ...current, observation: text }));
    setErrors((current) => ({ ...current, observation: "" }));
    setExampleFields((current) => new Set([...current, "observation"]));
  };
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!f.grade) next.grade = "학생 눈높이에 맞는 말로 제안하려면 학년이 필요해요.";
    if (!f.subject) next.subject = "교과에 맞는 예시와 표현을 제안하려면 과목이 필요해요.";
    if (!f.goal.trim()) next.goal = "관찰하려던 학습 목표나 평가 요소를 적어 주세요.";
    if (!f.observation.trim()) next.observation = "학생이 실제로 말하거나 행동한 모습을 적어 주세요.";
    else if (f.observation.trim().length < 20) next.observation = "판단만 적기보다 구체적인 말·행동·오류·해결 과정 중 한 가지를 더 적어 주세요.";
    setErrors(next);
    if (!Object.keys(next).length) onSubmit(f);
  };
  return (
    <main className="page">
      <button className="back" onClick={back}>
        ← 처음으로
      </button>
      <PageIntro step="피드백 만들기 · 1/2" title="학생의 수행을 들려주세요" desc="학년, 학습 목표, 실제 수행 모습을 알려주시면 학생의 눈높이에 맞는 대화를 제안합니다." />
      <aside className="form-welcome">
        <div>
          <span>처음 사용하시나요?</span>
          <b>예시를 먼저 살펴보면 기록 방법을 쉽게 알 수 있어요.</b>
        </div>
        <div className="example-buttons" aria-label="교과별 입력 예시">
          {Object.keys(feedbackExamples).map((subject) => <button key={subject} type="button" onClick={() => fillExample(subject)}>{subject} 예시</button>)}
        </div>
      </aside>
      <form className="form-sheet" onSubmit={submit} noValidate>
        {exampleFields.size > 0 && (
          <div className="example-edit-notice" role="status">
            <b>예시)</b> 흐린 글씨로 채워진 내용은 입력 예시입니다.
            <span>각 칸을 눌러 수업 내용에 맞게 수정해 주세요.</span>
          </div>
        )}
        <div className="form-section-label">
          <span>수업 정보</span>
          <p>학년과 과목은 필수이며, 나머지는 알고 있는 만큼만 입력해도 괜찮아요.</p>
        </div>
        <div className="form-grid">
          <div className={errors.grade ? "field-error" : ""}>
            <Field label="학년" required>
              <select className={exampleFields.has("grade") ? "example-value" : ""} value={f.grade} onChange={(e) => set("grade", e.target.value)} aria-invalid={!!errors.grade}>
                <option value="">학년을 선택하세요</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n}>{n}학년</option>
                ))}
              </select>
              {errors.grade && (
                <span className="error-message" role="alert">
                  {errors.grade}
                </span>
              )}
            </Field>
          </div>
          <div className={errors.subject ? "field-error" : ""}>
            <Field label="과목" required>
              <select className={exampleFields.has("subject") ? "example-value" : ""} value={f.subject} onChange={(e) => set("subject", e.target.value)} aria-invalid={!!errors.subject}>
                <option value="">과목을 선택하세요</option>
                {["국어", "수학", "사회", "과학", "도덕", "체육", "음악", "미술", "실과", "영어"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              {errors.subject && (
                <span className="error-message" role="alert">
                  {errors.subject}
                </span>
              )}
            </Field>
          </div>
        </div>
        <div className="form-grid">
          <Field label="단원">
            <input className={exampleFields.has("unit") ? "example-value" : ""} value={f.unit} onChange={(e) => set("unit", e.target.value)} placeholder="선택 · 예: 식물의 구조와 기능" />
          </Field>
          <Field label="차시">
            <input className={exampleFields.has("session") ? "example-value" : ""} value={f.session} onChange={(e) => set("session", e.target.value)} placeholder="선택 · 예: 3차시" />
          </Field>
        </div>
        <div className="form-section-label essential">
          <span>핵심 기록</span>
          <p>판단보다 관찰한 사실을 구체적으로 적어 주세요.</p>
        </div>
        <div className={errors.goal ? "field-error" : ""}>
          <Field label="학습 목표 또는 평가 요소" required>
            <input className={exampleFields.has("goal") ? "example-value" : ""} value={f.goal} onChange={(e) => set("goal", e.target.value)} aria-invalid={!!errors.goal} placeholder="예: 관찰 결과를 근거로 예상과 다른 까닭 설명하기" />
            {errors.goal && (
              <span className="error-message" role="alert">
                {errors.goal}
              </span>
            )}
          </Field>
        </div>
        <div className={errors.observation ? "field-error" : ""}>
          <Field label="학생이 보인 실제 수행 모습" required hint="좋은 기록: 예상은 정확히 말했지만 결과를 기록할 때 측정 단위를 두 번 빠뜨렸다. 친구의 기록을 보고 스스로 한 곳을 고쳤다.">
            <textarea className={exampleFields.has("observation") ? "example-value" : ""} rows="7" value={f.observation} onChange={(e) => set("observation", e.target.value)} aria-invalid={!!errors.observation} placeholder="‘잘함·부족함’ 같은 판단보다 학생이 실제로 말하거나 행동한 장면을 적어 주세요." />
            {errors.observation && (
              <span className="error-message" role="alert">
                {errors.observation}
              </span>
            )}
          </Field>
        </div>
        <div className="observation-guide">
          <div className="observation-guide-head"><b>교·수·평 설계용 사례 불러오기</b><span>실제 기록이 아직 없다면 비슷한 사례를 골라 Teacher Talk를 미리 설계해 보세요.</span></div>
          <div className="observation-example-buttons">
            {observationExamples.map((example) => <button key={example.label} type="button" onClick={() => fillObservationExample(example.text)} title={`${example.category}: ${example.text}`}>{example.label}<small>{example.category}</small></button>)}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="secondary" onClick={back}>
            취소
          </button>
          <button className="primary">
            피드백 제안 확인하기 <span>→</span>
          </button>
        </div>
      </form>
    </main>
  );
}

function buildPersonalizedStages(data) {
  const evidence = data.observation.trim().replace(/\s+/g, " ").slice(0, 72) + (data.observation.trim().length > 72 ? "…" : "");
  const goal = data.goal.trim();
  const grade = Number.parseInt(data.grade) || 4;
  const low = grade <= 2;
  const talks = [
    {
      talk: low ? `여기까지 했구나. 선생님이 본 모습은 이거야. ${evidence}` : `여기까지 한 내용은 확인했어. ${evidence}`,
      focus: "확인했어",
      dialogue: [
        {
          who: "교사",
          text: low ? "여기까지 했구나. 선생님이 본 모습을 같이 확인해 보자." : "지금까지 한 내용을 먼저 확인해 보자.",
        },
      ],
    },
    {
      talk: low ? `아까 ${evidence} 그 부분은 잘 해냈어.` : `${evidence} 이 부분은 ‘${goal}’에 맞게 해냈어.`,
      focus: "해냈어",
      dialogue: [{ who: "교사", text: `${evidence} 이 부분은 오늘 목표에 맞게 해냈어.` }],
    },
    {
      talk: low ? `여기까지 좋아. 이제 한 가지만 더 해 보자. ${goal}을 생각하며 빠진 곳을 찾아볼까?` : `여기까지는 좋아. 이제 ‘${goal}’에 비추어 빠진 근거 한 가지를 보완해 보자.`,
      focus: "한 가지만 더",
      dialogue: [
        {
          who: "교사",
          text: `${evidence} 여기까지는 좋아. 이제 ‘${goal}’에 비추어 무엇을 보완해야 하는지 한 가지 짚어 보자.`,
        },
      ],
    },
    {
      talk: low ? "어떻게 하면 더 잘할 수 있을까? 네가 먼저 해 보고 싶은 방법을 말해 줄래?" : `네가 한 방법을 돌아보면, ‘${goal}’에 더 가까워지기 위해 다음에는 어떤 전략을 써 보고 싶어?`,
      focus: low ? "네가 먼저" : "어떤 전략",
      dialogue: [
        { who: "교사", text: `네가 한 것을 같이 볼까? ${evidence}` },
        {
          who: "교사",
          text: low ? "이 가운데 네 마음에 드는 부분은 어디야?" : `이 가운데 스스로 잘됐다고 생각하는 부분은 어디야? 그렇게 생각한 까닭도 말해 줄래?`,
        },
        {
          who: "학생",
          text: low ? "이 부분이요. 제가 혼자 해 봤어요." : "이 부분은 제가 생각한 방법대로 해 봤고, 앞보다 더 나아진 것 같아요.",
        },
        {
          who: "교사",
          text: `그렇구나. 그럼 ‘${goal}’을 생각했을 때 아직 더 살펴볼 곳은 어디일까?`,
        },
        {
          who: "학생",
          text: low ? "여기요. 한 번 더 해 볼래요." : "근거가 충분한지 다시 확인해 봐야 할 것 같아요.",
        },
        {
          who: "교사",
          text: low ? "좋아. 어떤 방법으로 다시 해 볼래?" : `좋아. 확인하기 위해 네가 먼저 써 보고 싶은 방법은 뭐야?`,
        },
        {
          who: "학생",
          text: low ? "그림이랑 다시 비교해 볼래요." : "기준과 제 결과를 하나씩 비교하고, 빠진 부분을 표시해 볼게요.",
        },
        {
          who: "교사",
          text: "좋은 방법이야. 먼저 그렇게 해 보고, 바뀐 점을 다시 이야기해 보자.",
        },
      ],
    },
    {
      talk: low ? "우리가 잘했다고 말하려면 무엇을 보면 좋을까? 같이 약속을 정해 보자." : `‘${goal}’을 잘 해냈다고 판단할 기준을 우리가 함께 정해 볼까?`,
      focus: low ? "같이 약속" : "함께 정해",
      dialogue: [
        {
          who: "교사",
          text: `오늘 목표는 ‘${goal}’이야. 이 목표를 잘 해냈다고 말하려면 무엇을 확인해야 할까?`,
        },
        {
          who: "학생",
          text: low ? "해야 할 일을 끝까지 했는지 보면 좋겠어요." : "결과만 맞는지 보지 말고, 어떤 방법을 썼는지도 보면 좋겠어요.",
        },
        {
          who: "학생",
          text: low ? "친구에게 말로 알려 줄 수 있는지도 봐요." : "제 생각을 근거와 함께 설명할 수 있는지도 기준에 넣고 싶어요.",
        },
        {
          who: "교사",
          text: "좋아. 지금 나온 의견을 짧은 확인표로 만들어 보자. 빠진 기준은 없을까?",
        },
        {
          who: "학생",
          text: "친구의 설명을 듣고 내 생각을 고치거나 보탠 것도 확인하면 좋겠어요.",
        },
        {
          who: "교사",
          text: "그 기준도 넣자. 활동이 끝나면 이 확인표로 먼저 스스로 살펴보고, 친구와도 의견을 나눠 보자.",
        },
        {
          who: "학생",
          text: "확인표를 보고 부족한 부분을 고친 뒤 다시 보여 드릴게요.",
        },
        {
          who: "교사",
          text: "좋아. 우리가 만든 기준으로 무엇이 달라졌는지 마지막에 함께 확인하자.",
        },
      ],
    },
  ];
  const talkOptions = [
    [
      { label: "관찰 그대로", talk: `선생님이 확인한 모습은 이거야. ${evidence}` },
      { label: "수행 짚기", talk: `지금 한 것부터 함께 확인해 보자. ${evidence}` },
      { label: "짧게 확인", talk: low ? `여기까지 했구나. ${evidence}` : `현재 수행에서 확인된 내용을 먼저 말해 줄게. ${evidence}` },
    ],
    [
      { label: "목표 연결", talk: `${evidence} 이 부분은 ‘${goal}’이라는 목표와 연결되는 성취야.` },
      { label: "충족한 점", talk: `오늘 목표 가운데 네가 해낸 부분부터 볼게. ${evidence}` },
      { label: "기준 확인", talk: `‘${goal}’의 기준으로 보면, 현재 수행에서 확인되는 점은 이거야. ${evidence}` },
    ],
    [
      { label: "한 가지 보완", talk: `여기까지는 확인했어. 이제 ‘${goal}’에 더 가까워지도록 한 가지만 보완해 보자.` },
      { label: "근거 더하기", talk: `${evidence} 이 내용을 바탕으로, 목표에 필요한 근거나 설명을 하나 더 찾아 넣어 보자.` },
      { label: "차이 찾기", talk: `현재 수행과 ‘${goal}’을 나란히 놓고 보면 무엇이 빠져 있을까? 선생님과 한 가지씩 찾아보자.` },
    ],
    [
      { label: "전략 돌아보기", talk: `네가 사용한 방법 가운데 도움이 된 것은 무엇이었어? 그렇게 생각한 까닭도 말해 줄래?` },
      { label: "다음 시도", talk: `‘${goal}’에 더 가까워지려면 다음에는 어떤 방법으로 다시 해 보고 싶어?` },
      { label: "스스로 수정", talk: `${evidence} 이 모습을 돌아보면, 어디부터 바꾸고 싶어? 바꾼 뒤에는 어떻게 확인할 수 있을까?` },
    ],
    [
      { label: "성공 기준", talk: `‘${goal}’을 잘 해냈다고 판단하려면 어떤 기준이 필요할까? 함께 정해 보자.` },
      { label: "자기 점검", talk: `우리가 만든 기준으로 네 수행을 살펴보면 무엇을 유지하고 무엇을 수정하고 싶어?` },
      { label: "동료와 평가", talk: `친구의 수행을 살펴볼 때 꼭 확인할 기준은 무엇일까? 그 기준을 네 수행에도 적용해 보자.` },
    ],
  ];
  return stages.map((stage, index) => ({ ...stage, ...talks[index], talkOptions: talkOptions[index] }));
}

function FeedbackResult({ data, edit }) {
  const [view, setView] = useState("proposal");
  const [selectedStage, setSelectedStage] = useState(null);
  const [showFullTalk, setShowFullTalk] = useState(false);
  const [selectedTalk, setSelectedTalk] = useState(0);
  const personalizedStages = buildPersonalizedStages(data);
  const coachReady = /스스로|고쳤|수정|비교|확인|질문/.test(data.observation);
  const recommended = coachReady ? stages[3] : stages[2];
  const recommendedIndex = coachReady ? 3 : 2;
  const activeStageIndex = selectedStage ?? recommendedIndex;
  const activeStage = personalizedStages[activeStageIndex];
  const byName = (name) => tools.find((tool) => tool[1] === name);
  const recommendedTools = coachReady ? [byName("자기점검표"), byName("예시 비교"), byName("다시 말하기")] : [byName("체크리스트"), byName("예시 비교"), byName("즉시 구두 피드백")];
  const context = [data.grade, data.subject, data.unit, data.session].filter(Boolean).join(" · ") || "수업 맥락 미입력";
  return (
    <main className="page result-page">
      <button className="back" onClick={edit}>
        ← 수행 기록 수정
      </button>
      <PageIntro step="피드백 만들기 · 2/2" title="학생의 다음 행동을 위한 피드백" desc={context} />
      <div className="record-warning">
        <b>공식 성적·평가 기록이 아닌 피드백 설계 제안입니다.</b>
        <p>교사가 실제 수행 증거와 학습 목표를 다시 확인하고, 학생에게 맞게 수정한 뒤 사용해 주세요.</p>
      </div>
      <nav className="result-tabs" aria-label="피드백 결과 메뉴">
        <button className={view === "evidence" ? "active" : ""} onClick={() => setView("evidence")} aria-pressed={view === "evidence"}>
          <span>01</span>관찰 사실
        </button>
        <button className={view === "proposal" ? "active" : ""} onClick={() => setView("proposal")} aria-pressed={view === "proposal"}>
          <span>02</span>FeedON 제안
        </button>
        <button className={view === "talk" ? "active" : ""} onClick={() => setView("talk")} aria-pressed={view === "talk"}>
          <span>03</span>5단계 Teacher Talk
        </button>
        <button className={`summary-tab ${view === "all" ? "active" : ""}`} onClick={() => setView("all")} aria-pressed={view === "all"}>
          한 화면에 정리하기
        </button>
      </nav>
      <div className="result-doc">
        {(view === "evidence" || view === "all") && <Section no="01" title="관찰 사실">
          <div className="evidence">
            <span className="result-label fact">교사가 입력한 원문</span>
            <p>“{data.observation}”</p>
            <dl>
              <div>
                <dt>학습 목표</dt>
                <dd>{data.goal}</dd>
              </div>
            </dl>
          </div>
        </Section>}
        {(view === "proposal" || view === "all") && <Section no="02" title="FeedON 제안">
          <div className="strategy">
            <div>
              <span>추천 단계</span>
              <h3>
                {recommended.name} · {recommended.ko}
              </h3>
            </div>
            <div className="strategy-body">
              <p className="strategy-desc"><i>✓</i>{recommended.desc}</p>
              <p className="strategy-reason"><i>→</i>{coachReady ? "학생이 스스로 확인하거나 수정한 흔적이 있어요. 질문으로 다음 해결 방법을 이끌어내는 접근을 우선 제안합니다." : "현재 기록만으로 해결 전략이 충분히 드러나지 않아요. 목표와 현재 수행의 차이를 구체적으로 안내하는 접근을 우선 제안합니다."}</p>
            </div>
          </div>
          <h3 className="subhead">추천 확인·전달 방법</h3>
          <div className="recommended-tools">
            {recommendedTools.map((t) => (
              <ToolCard key={t[1]} tool={t} />
            ))}
          </div>
        </Section>}
        {(view === "talk" || view === "all") && <Section no="03" title="5단계 Teacher Talk">
          <p className="section-desc">단계 하나를 선택해 핵심 문장을 먼저 확인하세요. 4·5단계는 전체 대화에서 학생과 주고받는 흐름을 볼 수 있습니다.</p>
          <div className="stage-picker" role="tablist" aria-label="Teacher Talk 단계 선택">
            {personalizedStages.map((s,i)=><button key={s.name} role="tab" aria-selected={activeStageIndex===i} className={activeStageIndex===i?"active":""} onClick={()=>{setSelectedStage(i);setShowFullTalk(false);setSelectedTalk(0)}}><span>0{i+1}</span><b>{s.name}</b><small>{s.ko}</small>{i===recommendedIndex&&<em>추천</em>}</button>)}
          </div>
          <article className={`selected-talk stage-${activeStageIndex+1}`} role="tabpanel">
            <div className="selected-talk-head"><div><span>STEP 0{activeStageIndex+1}</span><h3>{activeStage.name} <small>{activeStage.ko}</small></h3></div><CenterBadge center={activeStage.center}/></div>
            <div className="talk-summary">
              <span>입력 내용에 맞춘 Teacher Talk · 3가지 표현</span>
              <div className="talk-option-tabs" role="tablist" aria-label={`${activeStage.name} Teacher Talk 표현 선택`}>
                {activeStage.talkOptions.map((option, i) => <button key={option.label} role="tab" aria-selected={selectedTalk === i} className={selectedTalk === i ? "active" : ""} onClick={() => setSelectedTalk(i)}>{option.label}</button>)}
              </div>
              <blockquote>“{activeStage.talkOptions[selectedTalk].talk}”</blockquote>
              <small>교사가 입력한 학습 목표·평가 요소와 실제 수행 모습을 반영한 문장입니다.</small>
            </div>
            <div className="stage-quick-info"><div><b>언제 쓰나요?</b><p>{activeStage.when}</p></div><div><b>무엇이 다른가요?</b><p>{activeStage.desc}</p></div></div>
            <button className="full-talk-toggle" onClick={()=>setShowFullTalk(!showFullTalk)} aria-expanded={showFullTalk}>{showFullTalk?"핵심만 보기":"전체 대화 보기"}<span>{showFullTalk?"−":"+"}</span></button>
            {showFullTalk&&<div className="selected-talk-detail"><div className="detail-note">학생 문장은 정답이 아닌 <b>예상 응답</b>입니다. 실제 대답을 듣고 다음 질문을 이어 가세요.</div><Dialogue lines={activeStage.dialogue}/><div className="talk-caution"><b>교사가 주의할 점</b><p>{activeStage.caution}</p></div></div>}
          </article>
        </Section>}
        {view === "all" && <Section no="04" title="교사 확인">
          <div className="teacher-check">
            <p>학생에게 말하기 전에 세 가지를 확인해 주세요.</p>
            <label>
              <input type="checkbox" /> 입력한 관찰 사실과 제안 문장이 일치하나요?
            </label>
            <label>
              <input type="checkbox" /> 학생의 수준을 낙인찍는 표현이 없나요?
            </label>
            <label>
              <input type="checkbox" /> 학생이 직접 해 볼 다음 행동이 분명한가요?
            </label>
          </div>
        </Section>}
      </div>
    </main>
  );
}

function App() {
  const [page, setPage] = useState("home"),
    [help, setHelp] = useState(null),
    [fForm, setFForm] = useState(null),
    [fResult, setFResult] = useState(null);
  const feedbackDone = (f) => {
    setFForm(f);
    setFResult(f);
    setPage("feedbackResult");
    scrollTo(0, 0);
  };
  const nav = (p) => {
    setPage(p);
    scrollTo(0, 0);
  };
  return (
    <>
      <Header goHome={() => nav("home")} openHelp={setHelp} />
      {page === "home" && <Home navigate={nav} openHelp={setHelp} />} {page === "feedback" && <FeedbackForm initial={fForm} onSubmit={feedbackDone} back={() => nav("home")} />} {page === "feedbackResult" && <FeedbackResult data={fResult} edit={() => nav("feedback")} />} {help && <Modal type={help} close={() => setHelp(null)} />}
      <footer>
        <small className="copyright">© 경인초 학생평가 연구팀</small>
      </footer>
    </>
  );
}

export default App;
