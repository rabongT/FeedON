import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFeedback, caseInput, researchCases } from './feedbackEngine.js';

const stages = ['Starter', 'Planner', 'Guide', 'Coach', 'Designer'].map(name => ({ name }));
const blank = { grade: '5학년', subject: '수학', goal: '풀이 설명하기', observation: '계산을 스스로 수정하지 못했고, 질문에도 설명하지 못했다.' };

test('negative and ambiguous observations never auto-classify a student', () => {
  for (const observation of [blank.observation, '스스로 고쳤다.', '질문하지 않았다.', '잘함', '']) {
    const r = buildFeedback({ ...blank, observation }, stages);
    assert.equal(r.recommendedIndex, null);
    assert.match(r.stages[1].talk, /아직 없어요/);
    assert.match(r.stages[2].talk, /아직 확인되지/);
    assert.doesNotMatch(r.stages[1].talk, /해냈어|충족했어/);
  }
});
test('four subject cases retain source and subject-specific hints', () => {
  assert.deepEqual(researchCases.map(c => c.subject).sort(), ['과학','국어','사회','수학']);
  for (const c of researchCases) {
    const r = buildFeedback(caseInput(c), stages);
    assert.equal(r.sourceCase.id, c.id);
    assert.ok(r.stages[2].talk.includes(c.hint));
    assert.ok(r.stages[1].talk.includes(c.achieved));
    assert.ok(r.stages[4].dialogue.some(d => d.text.includes(c.criterion)));
    assert.equal(r.stages.length, 5);
    for (const stage of r.stages) assert.equal(stage.talkOptions.length, 3);
  }
});
test('editing case context or evidence cannot keep source-specific claims', () => {
  const c = researchCases[2];
  for (const key of ['grade','subject','unit','goal','observation','achieved','gap','researchCaseId']) {
    const r = buildFeedback({ ...caseInput(c), [key]: 'changed' }, stages);
    assert.equal(r.sourceCase, undefined, key);
    assert.ok(!r.stages[2].talk.includes(c.hint), key);
  }
});
test('recommendations use only explicit teacher purpose', () => {
  for (const [i, purpose] of ['judge','acknowledge','guide','coach','design'].entries()) {
    assert.equal(buildFeedback({ ...blank, purpose }, stages).recommendedIndex, i);
  }
  assert.equal(buildFeedback({ ...blank, purpose: 'unknown' }, stages).recommendedIndex, null);
  assert.equal(buildFeedback({ ...blank, purpose: '__proto__' }, stages).recommendedIndex, null);
});
test('Coach includes learner choice and Designer includes shared judgment', () => {
  const r = buildFeedback(blank, stages);
  for (const i of [3,4]) {
    assert.ok(r.stages[i].dialogue.length >= 8);
    assert.ok(r.stages[i].dialogue.some(d => d.who === '학생'));
  }
  assert.ok(r.stages[3].dialogue.some(d => d.text.includes('네가 고른 방법')));
  assert.ok(r.stages[4].dialogue.some(d => d.text.includes('선생님의 판단')));
  assert.ok(r.stages[4].dialogue.some(d => d.text.includes('다시 평가')));
});
test('grade groups use distinct accessible opening questions', () => {
  const talks = [1,3,6].map(g => buildFeedback({ ...blank, grade: `${g}학년` }, stages).stages[3].talk);
  assert.equal(new Set(talks).size, 3);
});
