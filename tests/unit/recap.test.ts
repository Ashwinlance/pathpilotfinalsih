import { describe, expect, it } from 'vitest';
import { topicPracticeQuestions } from '../../src/data/learning/topicPracticeQuestions';
import { buildRecapQuestions, detectRecapOffer, gradeRecap } from '../../src/services/learning/recapService';

describe('recap mode', () => {
  it('offers recap only after the inactivity threshold and with learned topics', () => {
    expect(detectRecapOffer({ lastActiveAt: '2026-09-01T00:00:00.000Z', now: '2026-09-10T00:00:00.000Z', learnedTopicIds: ['py-functions'] })?.daysAway).toBe(9);
    expect(detectRecapOffer({ lastActiveAt: '2026-09-08T00:00:00.000Z', now: '2026-09-10T00:00:00.000Z', learnedTopicIds: ['py-functions'] })).toBeUndefined();
  });

  it('builds five recap MCQs from learned topics', () => {
    const questions = buildRecapQuestions(['py-functions', 'py-data'], topicPracticeQuestions, 5);
    expect(questions).toHaveLength(5);
    expect(new Set(questions.map(question => question.topicId))).toEqual(new Set(['py-functions', 'py-data']));
  });

  it('identifies weak topics without changing competency state', () => {
    const questions = buildRecapQuestions(['py-functions'], topicPracticeQuestions, 5);
    const answers = questions.map((question, index) => ({ questionId: question.id, selectedOptionIndex: index < 2 ? question.correctOptionIndex : (question.correctOptionIndex + 1) % question.options.length }));
    const result = gradeRecap(questions, answers, '2026-09-10T00:00:00.000Z');
    expect(result.score).toBe(40);
    expect(result.weakTopicIds).toEqual(['py-functions']);
  });
});
