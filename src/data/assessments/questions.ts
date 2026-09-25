import type { Question, QuestionPool } from '../../types/assessment';

const pythonQuestions: Question[] = Array.from({ length: 15 }, (_, i) => {
  const topics = ['py-basics', 'py-functions', 'py-data'];
  const topicId = topics[i % topics.length];
  return {
    id: `q-python-${i + 1}`,
    competencyId: 'comp-python',
    topicId,
    prompt: `Python diagnostic question ${i + 1}: choose the option that best preserves predictable program behavior.`,
    options: ['Use an explicit, testable construct', 'Rely on hidden global mutation', 'Ignore return values', 'Mix unrelated responsibilities'],
    correctOptionIndex: 0,
    difficulty: i < 5 ? 'FOUNDATION' : i < 10 ? 'INTERMEDIATE' : 'ADVANCED',
    sourceId: 'approved-python-material-v1',
  } as Question;
});

export const questions: Question[] = [...pythonQuestions];
export const questionPools: QuestionPool[] = [
  { id: 'pool-python', competencyId: 'comp-python', approved: true, questionIds: pythonQuestions.map(q => q.id) },
];
