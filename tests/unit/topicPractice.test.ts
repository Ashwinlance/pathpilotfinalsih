import { describe, expect, it } from 'vitest';
import { topicPracticeQuestions } from '../../src/data/learning/topicPracticeQuestions';
import { gradeTopicPractice } from '../../src/services/learning/topicPracticeService';

describe('topic practice', () => {
  it('provides exactly five Python Functions MCQs and grades them deterministically', () => {
    const questions = topicPracticeQuestions.filter(question => question.topicId === 'py-functions');
    expect(questions).toHaveLength(5);

    const result = gradeTopicPractice(
      'py-functions',
      questions,
      questions.map(question => ({ questionId: question.id, selectedOptionIndex: question.correctOptionIndex })),
      '2026-09-24T00:00:00.000Z',
    );

    expect(result.correct).toBe(5);
    expect(result.total).toBe(5);
    expect(result.score).toBe(100);
  });
});
