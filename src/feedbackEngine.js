// Local-only case library. Adaptations are not quotations or verified student records.
export const researchSource = '학생평가 연구학교 피드백 5단계 예시 자료(최종)';
export const researchCases = [
  {
    id: 'sentence', subject: '국어', grade: '5학년', title: '문장 성분의 호응', pages: '4쪽(인쇄 5쪽)',
    goal: '문장 성분의 호응 관계가 올바른 문장을 구성하기',
    observation: '주어와 서술어에 표시했지만, 두 성분이 어울리지 않는 문장을 고치지는 못했다.',
    achieved: '문장에서 주어와 서술어를 찾아 표시한 것', gap: '주어와 서술어가 서로 어울리도록 문장을 고치는 것',
    hint: '표시한 주어와 서술어만 이어 읽어 보자. 누가 무엇을 하는지 자연스럽게 이어지는지 보고, 어울리지 않는 말을 바꿔 보자.',
    strategy: '주어와 서술어만 먼저 이어 읽고, 어울리지 않는 말을 바꿔 볼래요.',
    criterion: '주어와 서술어가 자연스럽게 이어지는가', evidence: '고치기 전 문장과 고친 문장',
  },
  {
    id: 'terrain', subject: '사회', grade: '5학년', title: '우리나라 지형의 분포', pages: '12쪽(인쇄 13쪽)',
    goal: '지도에서 우리나라 산지·하천·해안의 위치를 찾고 지형 분포의 특징 설명하기',
    observation: '지도에서 산지와 하천을 찾아 표시했지만 산지가 어느 쪽에 많이 분포하는지는 설명하지 못했다.',
    achieved: '지도에서 산지와 하천의 위치를 찾아 표시한 것', gap: '산지가 어느 쪽에 많이 분포하는지 지도와 연결해 설명하는 것',
    hint: '지도의 범례에서 높이를 나타내는 색을 확인해 보자. 동쪽과 서쪽의 색을 비교하고 산지가 많이 나타나는 쪽을 한 문장으로 설명해 보자.',
    strategy: '범례를 보고 동쪽과 서쪽의 높이를 비교한 다음, 지도에서 찾은 곳을 가리키며 설명할래요.',
    criterion: '지도에서 찾은 위치를 근거로 지형의 분포 특징을 설명했는가', evidence: '지도에 표시한 위치와 설명한 문장',
  },
  {
    id: 'fraction', subject: '수학', grade: '5학년', title: '분모가 다른 분수의 덧셈·뺄셈', pages: '20쪽(인쇄 21쪽)',
    goal: '분모가 다른 분수의 덧셈과 뺄셈을 계산하고 통분이 필요한 이유 설명하기',
    observation: '분모를 같게 하여 덧셈을 계산했고 답은 맞았다. 왜 통분하는지 묻자 설명하지 못했다.',
    achieved: '분모를 같게 하여 덧셈을 정확히 계산한 것', gap: '왜 통분해야 하는지 설명하는 것',
    hint: '같은 크기의 전체를 둘로 나눈 그림과 셋으로 나눈 그림을 보자. 조각의 크기가 다르지? 둘 다 여섯 조각으로 나누어 같은 크기의 조각끼리 더하는 모습을 설명해 보자.',
    strategy: '같은 크기의 분수 그림을 그려 조각의 크기를 맞춘 뒤, 식과 연결해서 설명할래요.',
    criterion: '통분이 필요한 이유를 그림과 식을 연결해 설명했는가', evidence: '분수 그림과 통분한 식, 이유를 설명한 문장',
  },
  {
    id: 'rock', subject: '과학', grade: '5학년', title: '알갱이 크기로 퇴적암 분류하기', pages: '28쪽(인쇄 29쪽)',
    goal: '퇴적암을 관찰하고 알갱이의 크기를 기준으로 분류하여 설명하기',
    observation: '돋보기로 암석의 알갱이를 관찰해 크기가 다르다고 말했다. 분류할 때에는 알갱이 크기가 아니라 암석의 색을 기준으로 묶었다.',
    achieved: '돋보기로 관찰해 암석의 알갱이 크기가 다르다는 점을 찾은 것', gap: '색이 아니라 알갱이 크기를 기준으로 분류하는 것',
    hint: '이번에 비교할 것은 암석의 색이 아니라 알갱이 크기야. 같은 배율로 표본을 살펴보고, 알갱이 크기가 비슷한 것끼리 묶은 뒤 까닭을 말해 보자.',
    strategy: '같은 배율로 알갱이를 다시 보고, 크기가 비슷한 표본끼리 묶어서 비교할래요.',
    criterion: '알갱이 크기를 기준으로 분류하고 관찰한 특징으로 까닭을 설명했는가', evidence: '표본을 관찰한 기록과 분류한 묶음',
  },
];

export function caseInput(c) {
  return { grade: c.grade, subject: c.subject, unit: c.title, session: '', goal: c.goal,
    observation: c.observation, researchCaseId: c.id, purpose: '', achieved: c.achieved, gap: c.gap };
}

export function buildFeedback(data, stages) {
  const grade = Number.parseInt(data.grade, 10);
  const low = grade <= 2;
  const mid = grade === 3 || grade === 4;
  // No fuzzy keyword diagnosis: only an explicitly selected, unchanged source case is used.
  const sourceCase = researchCases.find(c => c.id === data.researchCaseId &&
    c.subject === data.subject && c.grade === data.grade && c.title === data.unit &&
    c.goal === data.goal && c.observation === data.observation &&
    c.achieved === data.achieved && c.gap === data.gap);
  const goal = (data.goal || '').trim();
  const achieved = (data.achieved || '').trim();
  const gap = (data.gap || '').trim();
  const purposeIndex = { judge: 0, acknowledge: 1, guide: 2, coach: 3, design: 4 };
  const recommendedIndex = Object.hasOwn(purposeIndex, data.purpose) ? purposeIndex[data.purpose] : null;
  const hint = sourceCase?.hint || (low
    ? '선생님이 첫 부분을 보여 줄게. 그다음 부분은 네가 해 보자.'
    : mid ? '선생님이 한 부분을 예로 보여 줄게. 그 방법으로 다음 부분을 해 보자.'
      : '선생님이 첫 과정을 예로 보여 줄게. 어떤 순서로 해결하는지 살펴보고, 다음 과정에 적용해 보자.');
  const criteria = sourceCase?.criterion || (low ? '오늘 하기로 한 일을 했는가' : `‘${goal}’을 수행에서 확인할 수 있는가`);
  const evidence = sourceCase?.evidence || '직접 말하거나 쓰거나 행동한 부분';
  const strategy = sourceCase?.strategy || (low ? '제가 해 볼 방법을 하나 골라 말해 볼게요.' : '제가 써 볼 방법과 그 방법을 고른 까닭을 말해 볼게요.');
  const guide = gap
    ? `오늘 목표는 ‘${goal}’이야. 지금 더 필요한 부분은 ‘${gap}’이야. ${hint}`
    : '목표와 현재 수행 사이의 차이가 아직 확인되지 않았어요. 교사가 보완할 점을 확인한 뒤 구체적인 설명이나 힌트를 제시해 주세요.';
  const starter = achieved ? '이 부분은 해냈구나.' : '판단 근거가 아직 확인되지 않았어요. 학생의 답이나 수행을 확인한 뒤 옳고 그름을 짧게 알려 주세요.';
  const planner = achieved ? `‘${achieved}’을 확인했어. 오늘 수행에서 해낸 부분이야.` : '확인된 성취가 아직 없어요. 관찰 기록에서 실제로 충족한 기준을 먼저 확인해 주세요.';
  const coach = low ? '다음에는 어떻게 해 보고 싶어?' : mid ? '다른 방법으로 해 본다면 무엇부터 바꿔 보고 싶어?' : '목표에 더 가까워지려면 어떤 방법을 선택하고 싶어? 그 방법을 고른 까닭도 말해 줄래?';
  const designer = low ? '무엇을 보면 잘했다고 할 수 있을까? 우리 같이 약속을 정해 보자.' : '채점 기준을 함께 만들어 볼까? 어떤 수행을 보면 목표를 이루었다고 말할 수 있을까?';
  const T = text => ({ who: '교사', text });
  const S = text => ({ who: '학생', text });
  const dialogues = [
    [T(starter)], [T(planner)], [T(guide)],
    [T(low ? '네가 한 것 중에 다시 해 보고 싶은 곳을 짚어 줄래?' : `‘${goal}’을 생각하며 네 수행을 돌아보자. 더 살펴보고 싶은 부분은 어디야?`),
      S(gap ? `‘${gap}’을 다시 해 보고 싶어요.` : '제가 다시 살펴보고 싶은 부분을 짚어 볼게요.'),
      T(coach), S(strategy),
      T(low ? '왜 그 방법으로 해 보고 싶어?' : '그 방법이 도움이 될 거라고 생각한 이유는 무엇이야?'),
      S('제가 고른 방법으로 해 보면 막힌 부분을 확인할 수 있을 것 같아요.'),
      T('좋아. 네가 고른 방법으로 해 보자. 해 본 뒤에는 무엇을 보며 달라진 점을 확인할까?'),
      S(`‘${evidence}’을 보며 바꾸기 전과 뒤를 비교해 볼래요.`),
      T('해 본 결과가 예상과 다르면 방법을 다시 함께 찾아보자.')],
    [T(designer), S(`‘${criteria}’를 보면 좋겠어요.`),
      T(low ? '그 약속을 지켰는지는 무엇을 보면 알 수 있을까?' : '그 기준을 충족했다는 것은 어떤 증거로 확인할 수 있을까?'),
      S(`‘${evidence}’을 보면서 확인하면 좋겠어요.`),
      T('좋아. 다른 기준도 필요한지 함께 살펴보고, 우리가 동의한 기준으로 확인표를 만들자.'),
      S('확인표로 제 수행을 먼저 살펴보고, 그렇게 판단한 부분을 표시할게요.'),
      T('이제 같은 수행을 함께 보자. 네 판단과 선생님의 판단이 같은지, 다른 부분은 어떤 증거 때문인지 이야기해 보자.'),
      S('판단이 다른 부분은 기준과 증거를 다시 보고, 고칠 곳을 정할래요.'),
      T('좋아. 필요한 경우 기준의 표현도 함께 다듬자. 수정한 수행은 우리가 만든 기준으로 다시 평가해 보자.')],
  ];
  const texts = [starter, planner, guide, coach, designer];
  const alternatives = [
    achieved ? ['수행 인정', '여기까지 해냈어.', '짧은 확인', '이 부분은 잘했어.'] : ['판단 보류', starter, '증거 먼저', starter],
    achieved ? ['성취 짚기', `이번 수행에서 ‘${achieved}’이 드러났어.`, '기준 연결', `‘${achieved}’은 확인된 부분이야. 이 부분을 기억해 두자.`] : ['성취 확인 필요', planner, '기준 확인 필요', planner],
    ['설명·힌트', gap ? hint : guide, '목표와 차이', gap ? `목표는 ‘${goal}’이고, 더 필요한 부분은 ‘${gap}’이야. ${hint}` : guide],
    ['방법 선택', low ? '어떤 방법부터 해 볼래?' : '생각한 방법 중 무엇을 먼저 써 보고 싶어? 왜 그렇게 골랐니?', '다시 확인', '네가 고른 방법으로 해 본 뒤, 무엇을 보면서 달라진 점을 확인할까?'],
    ['기준 만들기', low ? '우리 약속을 확인할 때 무엇을 보면 좋을까?' : '우리 기준을 충족했다는 증거는 무엇일까? 함께 정해 보자.', '공동 평가', '우리가 함께 만든 기준으로 같은 수행을 살펴보자. 판단이 다르다면 각각 어떤 증거를 보았는지 이야기해 볼까?'],
  ];
  return {
    sourceCase, recommendedIndex,
    reason: recommendedIndex === null ? '기록의 단어만으로 학생의 상태나 단계를 판정하지 않습니다. 필요한 지원 목적에 맞게 단계를 선택해 주세요.' : '교사가 선택한 지원 목적에 따른 제안입니다. 학생을 수준별로 분류한 결과가 아닙니다.',
    stages: stages.map((s, i) => ({ ...s, talk: texts[i], dialogue: dialogues[i], talkOptions: [
      { label: '핵심 표현', talk: texts[i] }, { label: alternatives[i][0], talk: alternatives[i][1] }, { label: alternatives[i][2], talk: alternatives[i][3] },
    ] })),
  };
}
