import { describe, expect, it } from 'vitest';
import { learningModules } from '../../src/data/learning/modules';
import { topicPracticeQuestions } from '../../src/data/learning/topicPracticeQuestions';
import { demoLearnerState } from '../../src/data/learners/demoLearner';
import { initialTopics } from '../../src/data/topics/topics';
import { buildInitialAdaptiveState, applyVerificationEvidence } from '../../src/services/adaptive/adaptiveLoopService';
import { verifyLearning } from '../../src/services/learning/learningService';
import { gradeTopicPractice } from '../../src/services/learning/topicPracticeService';

describe('topic practice', () => {
  it('provides exactly five mastery-check MCQs for every Python learning topic', () => {
    for (const topicId of ['py-basics', 'py-functions', 'py-data', 'py-analysis', 'py-testing']) {
      expect(learningModules.some(module => module.topicId === topicId)).toBe(true);
      expect(topicPracticeQuestions.filter(question => question.topicId === topicId)).toHaveLength(5);
    }
  });


  it('provides exactly five mastery-check MCQs for every SQL learning topic, including the governed v2 topic', () => {
    for (const topicId of ['sql-select', 'sql-filter', 'sql-joins', 'sql-window']) {
      expect(learningModules.some(module => module.topicId === topicId)).toBe(true);
      expect(topicPracticeQuestions.filter(question => question.topicId === topicId)).toHaveLength(5);
    }
  });

  it('grades the five-question check deterministically', () => {
    const questions = topicPracticeQuestions.filter(question => question.topicId === 'py-functions');
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

  it('turns a passing five-question check into verification evidence before competency increases', () => {
    const questions = topicPracticeQuestions.filter(question => question.topicId === 'py-functions');
    const practice = gradeTopicPractice(
      'py-functions',
      questions,
      questions.map((question, index) => ({
        questionId: question.id,
        selectedOptionIndex: index === 4 ? 1 : question.correctOptionIndex,
      })),
      '2026-09-24T00:00:00.000Z',
    );
    expect(practice.score).toBe(80);

    const verification = verifyLearning({
      learnerId: 'learner-ananya',
      competencyId: 'comp-python',
      topicId: 'py-functions',
      moduleId: 'module-py-functions',
      score: practice.score,
      at: '2026-09-24T00:01:00.000Z',
    });
    expect(verification.verification.status).toBe('PASSED');
    expect(verification.evidence?.approved).toBe(true);

    const learnerCompetency = structuredClone(demoLearnerState.competencies[0]);
    const before = buildInitialAdaptiveState({
      learnerId: 'learner-ananya',
      learnerCompetency,
      requiredLevel: 80,
      topics: structuredClone(initialTopics),
    });
    const after = applyVerificationEvidence({
      snapshot: before,
      evidence: verification.evidence!,
      requiredLevel: 80,
      topics: structuredClone(initialTopics),
    });

    expect(after.learnerCompetency.currentLevel).toBe(62);
    expect(after.competencyGap).toBe(18);
  });
});
