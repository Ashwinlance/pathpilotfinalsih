import type { Assessment, AssessmentAnswer, AssessmentResult, Question, QuestionPool, TopicAnalysis, TopicStrength } from '../../types/assessment';

export function createAssessment(input: {
  id: string;
  learnerId: string;
  competencyId: string;
  pool: QuestionPool;
  questions: Question[];
  count?: number;
  createdAt?: string;
}): Assessment {
  if (!input.pool.approved) throw new Error('Question pool must be approved.');
  const count = input.count ?? 15;
  const eligible = input.questions.filter(q => q.competencyId === input.competencyId && input.pool.questionIds.includes(q.id));
  if (eligible.length < count) throw new Error(`At least ${count} approved questions are required.`);
  return { id: input.id, learnerId: input.learnerId, competencyId: input.competencyId, questionIds: eligible.slice(0, count).map(q => q.id), createdAt: input.createdAt ?? new Date().toISOString() };
}

export function gradeAssessment(
  assessment: Assessment,
  answers: AssessmentAnswer[],
  questions: Question[],
  completedAt = new Date().toISOString(),
): AssessmentResult {
  const selected = assessment.questionIds.map(id => questions.find(q => q.id === id)).filter((q): q is Question => Boolean(q));
  const answerMap = new Map(answers.map(a => [a.questionId, a.selectedOptionIndex]));
  const correct = selected.filter(q => answerMap.get(q.id) === q.correctOptionIndex).length;
  const score = selected.length ? Math.round((correct / selected.length) * 100) : 0;
  const topicIds = [...new Set(selected.map(q => q.topicId))];
  const topicAnalysis: TopicAnalysis[] = topicIds.map(topicId => {
    const qs = selected.filter(q => q.topicId === topicId);
    const topicCorrect = qs.filter(q => answerMap.get(q.id) === q.correctOptionIndex).length;
    const percentage = qs.length ? Math.round((topicCorrect / qs.length) * 100) : 0;
    return { topicId, correct: topicCorrect, total: qs.length, percentage, strength: classifyTopic(percentage) };
  });
  return { assessmentId: assessment.id, learnerId: assessment.learnerId, competencyId: assessment.competencyId, questionIds: assessment.questionIds, answers, score, topicAnalysis, completedAt, passed: score >= 70 };
}

function classifyTopic(score: number): TopicStrength {
  return score >= 80 ? 'STRONG' : score >= 55 ? 'DEVELOPING' : 'PRIORITY_GAP';
}
