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

const sqlQuestions: Question[] = Array.from({ length: 15 }, (_, i) => ({
  id: `q-sql-${i + 1}`,
  competencyId: 'comp-sql',
  topicId: i % 3 === 0 ? 'sql-select' : i % 3 === 1 ? 'sql-filter' : 'sql-joins',
  prompt: `SQL diagnostic question ${i + 1}: choose the most reliable relational-query approach.`,
  options: ['Use explicit columns and deliberate predicates', 'Use SELECT * everywhere', 'Join without keys', 'Depend on row order'],
  correctOptionIndex: 0,
  difficulty: i < 5 ? 'FOUNDATION' : i < 10 ? 'INTERMEDIATE' : 'ADVANCED',
  sourceId: 'approved-sql-material-v1',
}));

export const questions: Question[] = [...pythonQuestions, ...sqlQuestions];
export const questionPools: QuestionPool[] = [
  { id: 'pool-python', competencyId: 'comp-python', approved: true, questionIds: pythonQuestions.map(q => q.id) },
  { id: 'pool-sql', competencyId: 'comp-sql', approved: true, questionIds: sqlQuestions.map(q => q.id) },
];
