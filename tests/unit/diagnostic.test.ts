import { describe, expect, it } from 'vitest';
import { pythonInitialDiagnosticConfig, pythonInitialDiagnosticQuestions } from '../../src/data/assessments/initialDiagnostic';
import { initialTopics } from '../../src/data/topics/topics';
import { demoLearnerState } from '../../src/data/learners/demoLearner';
import { createInitialDiagnostic, gradeInitialDiagnostic } from '../../src/services/assessment/diagnosticService';
import { initializeCompetencyFromDiagnostic } from '../../src/services/assessment/diagnosticIntegrationService';
import { buildInitialAdaptiveState } from '../../src/services/adaptive/adaptiveLoopService';

function demoAnswers() {
  const correct = new Set([
    'diag-py-basics-1',
    'diag-py-basics-2',
    'diag-py-functions-1',
    'diag-py-functions-2',
    'diag-py-data-1',
  ]);
  return pythonInitialDiagnosticQuestions.map(question => ({
    questionId: question.id,
    selectedOptionIndex: correct.has(question.id)
      ? question.correctOptionIndex
      : (question.correctOptionIndex + 1) % question.options.length,
  }));
}

describe('initial competency diagnostic', () => {
  it('derives the demo 48 competency from topic-weighted performance', () => {
    const assessment = createInitialDiagnostic({
      id: 'diag-1',
      learnerId: 'learner-ananya',
      config: pythonInitialDiagnosticConfig,
      questions: pythonInitialDiagnosticQuestions,
      createdAt: 't0',
    });
    const result = gradeInitialDiagnostic({
      assessment,
      answers: demoAnswers(),
      questions: pythonInitialDiagnosticQuestions,
      config: pythonInitialDiagnosticConfig,
      completedAt: 't1',
    });
    expect(result.score).toBe(48);
    expect(result.topicAnalysis.find(topic => topic.topicId === 'py-basics')?.percentage).toBe(100);
    expect(result.topicAnalysis.find(topic => topic.topicId === 'py-functions')?.percentage).toBe(67);
    expect(result.topicAnalysis.find(topic => topic.topicId === 'py-data')?.percentage).toBe(33);
    expect(result.topicAnalysis.find(topic => topic.topicId === 'py-analysis')?.percentage).toBe(0);
  });

  it('explicitly initializes competency/topic mastery before the adaptive engine runs', () => {
    const assessment = createInitialDiagnostic({
      id: 'diag-2',
      learnerId: 'learner-ananya',
      config: pythonInitialDiagnosticConfig,
      questions: pythonInitialDiagnosticQuestions,
      createdAt: 't0',
    });
    const result = gradeInitialDiagnostic({
      assessment,
      answers: demoAnswers(),
      questions: pythonInitialDiagnosticQuestions,
      config: pythonInitialDiagnosticConfig,
      completedAt: 't1',
    });
    const initialized = initializeCompetencyFromDiagnostic({
      learnerCompetency: structuredClone(demoLearnerState.competencies[0]),
      result,
      topics: structuredClone(initialTopics),
    });
    const snapshot = buildInitialAdaptiveState({
      learnerId: 'learner-ananya',
      learnerCompetency: initialized.learnerCompetency,
      requiredLevel: 80,
      topics: initialized.topics,
    });
    expect(initialized.learnerCompetency.currentLevel).toBe(48);
    expect(snapshot.competencyGap).toBe(32);
    expect(snapshot.adaptiveState.currentAction.action).toBe('REPAIR_PREREQUISITE');
    expect(snapshot.adaptiveState.currentAction.targetTopicId).toBe('py-functions');
  });
});
