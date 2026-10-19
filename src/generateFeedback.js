// Called only by an explicit, validated form submission. Never retry automatically.
export async function generateFeedback(data, signal, request = fetch) {
  const response = await request('/api/feedback', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
    body: JSON.stringify({ requestId: crypto.randomUUID(), consent: true, data: {
      grade: data.grade, subject: data.subject, goal: data.goal, observation: data.observation,
      achieved: data.achieved, gap: data.gap, purpose: data.purpose,
    } }),
  });
  if (!response.ok) throw new Error('generation-unavailable');
  const result = await response.json();
  if (!Number.isInteger(result.recommendedIndex) || result.stages?.length !== 5) throw new Error('invalid-result');
  return result;
}
