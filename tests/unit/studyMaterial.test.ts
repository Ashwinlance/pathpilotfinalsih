import { describe, expect, it } from 'vitest';
import { generateStudyPack, gradeStudyQuiz } from '../../src/services/learning/studyMaterialService';

const material = {
  id: 'material-1',
  title: 'Python Functions Notes',
  topicId: 'py-functions',
  content: 'Python functions group reusable logic into named blocks. Parameters allow callers to provide input values. A return statement sends a value back to the caller. Local variables exist inside the function scope. Small focused functions are easier to test and reuse. Clear function names communicate intent. Functions can reduce repeated code in a program.',
  uploadedAt: '2026-09-24T00:00:00.000Z',
};

describe('learner study material service', () => {
  it('creates summary, key points and exactly seven MCQs', () => {
    const pack = generateStudyPack(material);
    expect(pack.summary.length).toBeGreaterThan(20);
    expect(pack.keyPoints.length).toBeGreaterThan(0);
    expect(pack.questions).toHaveLength(7);
    expect(pack.questions.every(question => question.topicId === 'py-functions')).toBe(true);
  });

  it('grades the seven-question self-study quiz', () => {
    const pack = generateStudyPack(material);
    const answers = pack.questions.map(question => ({ questionId: question.id, selectedOptionIndex: question.correctOptionIndex }));
    const result = gradeStudyQuiz(pack.questions, answers);
    expect(result.correct).toBe(7);
    expect(result.total).toBe(7);
    expect(result.score).toBe(100);
  });
});
