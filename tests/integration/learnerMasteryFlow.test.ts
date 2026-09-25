import { beforeEach, describe, expect, it } from 'vitest';
import { pythonInitialDiagnosticQuestions } from '../../src/data/assessments/initialDiagnostic';
import { getTopicPracticeQuestions } from '../../src/data/learning/topicPracticeQuestions';
import { usePathPilotStore } from '../../src/store/pathpilotStore';

function answerHeroDiagnostic() {
  const correct = new Set([
    'diag-py-basics-1',
    'diag-py-basics-2',
    'diag-py-functions-1',
    'diag-py-functions-2',
    'diag-py-data-1',
  ]);
  const state = usePathPilotStore.getState();
  state.startInitialDiagnostic();
  for (const question of pythonInitialDiagnosticQuestions) {
    usePathPilotStore.getState().answerInitialDiagnostic(
      question.id,
      correct.has(question.id)
        ? question.correctOptionIndex
        : (question.correctOptionIndex + 1) % question.options.length,
    );
  }
  usePathPilotStore.getState().submitInitialDiagnostic();
}

describe('learner mastery + recap integration', () => {
  beforeEach(() => usePathPilotStore.getState().resetDemo());

  it('updates the visible learner competency after a passing 5-question mastery check and enables recap', () => {
    answerHeroDiagnostic();
    let state = usePathPilotStore.getState();
    expect(state.diagnosticResult?.score).toBe(48);
    expect(state.learnerState.competencies.find(item => item.competencyId === 'comp-python')?.currentLevel).toBe(48);
    expect(state.adaptiveState.currentAction.targetTopicId).toBe('py-functions');

    state.startCurrentLearning();
    usePathPilotStore.getState().completeCurrentLearning();

    const practice = getTopicPracticeQuestions('py-functions', usePathPilotStore.getState().learningState?.startedAt ?? 'practice');
    expect(practice).toHaveLength(5);
    for (const question of practice) {
      usePathPilotStore.getState().answerCurrentPractice(question.id, question.correctOptionIndex);
    }
    usePathPilotStore.getState().submitCurrentPractice();

    state = usePathPilotStore.getState();
    expect(state.learnerState.competencies.find(item => item.competencyId === 'comp-python')?.currentLevel).toBe(62);
    expect(state.evidence).toHaveLength(1);
    expect(state.adaptiveState.roadmap.version).toBe(2);

    state.startRecapNow();
    state = usePathPilotStore.getState();
    expect(state.recapOffer?.status).toBe('OFFERED');
    expect(state.recapOffer?.topicIds).toContain('py-functions');
  });
});
