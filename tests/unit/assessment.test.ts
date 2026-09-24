import { describe, expect, it } from 'vitest';
import { createAssessment, gradeAssessment } from '../../src/services/assessment/assessmentService';
import { buildAssessmentGuidance } from '../../src/services/assessment/assessmentGuidanceService';
import { DeterministicQuestionGenerator } from '../../src/services/assessment/questionGenerationService';
import { questions, questionPools } from '../../src/data/assessments/questions';
import { demoLearnerState } from '../../src/data/learners/demoLearner';
import { buildInitialAdaptiveState } from '../../src/services/adaptive/adaptiveLoopService';
import { initialTopics } from '../../src/data/topics/topics';
import { learningModules } from '../../src/data/learning/modules';
import type { AssessmentMaterial } from '../../src/types/assessment';

describe('independent assessment', () => {
  it('grades 15 questions and does not mutate adaptive state', () => {
    const adaptive = buildInitialAdaptiveState({ learnerId: 'l', learnerCompetency: structuredClone(demoLearnerState.competencies[0]), requiredLevel: 80, topics: initialTopics });
    const before = JSON.stringify(adaptive.adaptiveState);
    const assessment = createAssessment({ id: 'a1', learnerId: 'l', competencyId: 'comp-python', pool: questionPools[0], questions, count: 15, createdAt: 't0' });
    const answers = assessment.questionIds.map(id => ({ questionId: id, selectedOptionIndex: 0 }));
    const result = gradeAssessment(assessment, answers, questions, 't1');
    expect(result.score).toBe(100); expect(JSON.stringify(adaptive.adaptiveState)).toBe(before);
  });

  it('generates 45 governed questions and dynamically selects 15 from the published pool', () => {
    const material: AssessmentMaterial = {
      id: 'material-test',
      title: 'Python governed material',
      competencyId: 'comp-python',
      topicIds: ['py-functions', 'py-data', 'py-analysis'],
      content: 'Functions accept parameters and can return values. Lists preserve sequence order. Dictionaries map keys to values. Analytical workflows should be explicit and testable.',
      addedAt: 't0',
    };
    const topics = initialTopics.filter(topic => material.topicIds.includes(topic.id));
    const generated = new DeterministicQuestionGenerator().generateFromApprovedMaterial({ material, topics, count: 45 });
    expect(generated).toHaveLength(45);
    const pool = { id: 'published', competencyId: 'comp-python', approved: true, questionIds: generated.map(q => q.id), sourceMaterialId: material.id };
    const first = createAssessment({ id: 'run-1', learnerId: 'l', competencyId: 'comp-python', pool, questions: generated, count: 15, selectionSeed: 'one' });
    const second = createAssessment({ id: 'run-2', learnerId: 'l', competencyId: 'comp-python', pool, questions: generated, count: 15, selectionSeed: 'two' });
    expect(first.questionIds).toHaveLength(15);
    expect(second.questionIds).toHaveLength(15);
    expect(new Set(first.questionIds).size).toBe(15);
    expect(first.questionIds).not.toEqual(second.questionIds);
  });

  it('returns weak-topic target learning guidance without changing adaptive state', () => {
    const adaptive = buildInitialAdaptiveState({ learnerId: 'l', learnerCompetency: structuredClone(demoLearnerState.competencies[0]), requiredLevel: 80, topics: initialTopics });
    const before = JSON.stringify(adaptive.adaptiveState);
    const assessment = createAssessment({ id: 'a2', learnerId: 'l', competencyId: 'comp-python', pool: questionPools[0], questions, count: 15, createdAt: 't0' });
    const answers = assessment.questionIds.map(id => {
      const question = questions.find(q => q.id === id)!;
      return { questionId: id, selectedOptionIndex: question.topicId === 'py-data' ? 1 : question.correctOptionIndex };
    });
    const result = gradeAssessment(assessment, answers, questions, 't1');
    const guidance = buildAssessmentGuidance({ result, topics: initialTopics, modules: learningModules });
    expect(guidance.targets[0]?.topicId).toBe('py-data');
    expect(guidance.targets[0]?.moduleId).toBe('module-py-data');
    expect(JSON.stringify(adaptive.adaptiveState)).toBe(before);
  });
});
