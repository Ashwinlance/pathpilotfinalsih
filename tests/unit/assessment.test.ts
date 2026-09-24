import { describe, expect, it } from 'vitest';
import { createAssessment, gradeAssessment } from '../../src/services/assessment/assessmentService';
import { questions, questionPools } from '../../src/data/assessments/questions';
import { demoLearnerState } from '../../src/data/learners/demoLearner';
import { buildInitialAdaptiveState } from '../../src/services/adaptive/adaptiveLoopService';
import { initialTopics } from '../../src/data/topics/topics';

describe('independent assessment', () => {
  it('grades 15 questions and does not mutate adaptive state', () => {
    const adaptive = buildInitialAdaptiveState({ learnerId: 'l', learnerCompetency: structuredClone(demoLearnerState.competencies[0]), requiredLevel: 80, topics: initialTopics });
    const before = JSON.stringify(adaptive.adaptiveState);
    const assessment = createAssessment({ id: 'a1', learnerId: 'l', competencyId: 'comp-python', pool: questionPools[0], questions, count: 15, createdAt: 't0' });
    const answers = assessment.questionIds.map(id => ({ questionId: id, selectedOptionIndex: 0 }));
    const result = gradeAssessment(assessment, answers, questions, 't1');
    expect(result.score).toBe(100); expect(JSON.stringify(adaptive.adaptiveState)).toBe(before);
  });
});
