import { describe, expect, it } from 'vitest';
import { buildInitialAdaptiveState, applyVerificationEvidence } from '../../src/services/adaptive/adaptiveLoopService';
import { demoLearnerState } from '../../src/data/learners/demoLearner';
import { initialTopics } from '../../src/data/topics/topics';

describe('closed adaptive loop', () => {
  it('updates competency, recalculates gap and creates a new roadmap after approved evidence', () => {
    const lc = structuredClone(demoLearnerState.competencies[0]);
    const before = buildInitialAdaptiveState({ learnerId: 'learner-ananya', learnerCompetency: lc, requiredLevel: 80, topics: initialTopics });
    expect(before.competencyGap).toBe(32); expect(before.adaptiveState.currentAction.action).toBe('REPAIR_PREREQUISITE');
    const evidence = { id: 'ev', learnerId: 'learner-ananya', competencyId: 'comp-python', topicId: 'py-functions', verificationId: 'ver', approved: true, score: 86, createdAt: 't2', source: 'VERIFICATION' as const };
    const after = applyVerificationEvidence({ snapshot: before, evidence, requiredLevel: 80, topics: initialTopics });
    expect(after.learnerCompetency.currentLevel).toBe(62); expect(after.competencyGap).toBe(18); expect(after.adaptiveState.roadmap.version).toBe(2);
  });
  it('ignores unapproved or mismatched evidence without mutating adaptive state', () => {
    const lc = structuredClone(demoLearnerState.competencies[0]);
    const before = buildInitialAdaptiveState({ learnerId: 'learner-ananya', learnerCompetency: lc, requiredLevel: 80, topics: initialTopics });
    const serialized = JSON.stringify(before);
    const evidence = { id: 'ev-unapproved', learnerId: 'learner-ananya', competencyId: 'comp-python', topicId: 'py-functions', verificationId: 'ver-unapproved', approved: false, score: 99, createdAt: 't2', source: 'VERIFICATION' as const };
    const after = applyVerificationEvidence({ snapshot: before, evidence, requiredLevel: 80, topics: initialTopics });
    expect(JSON.stringify(after)).toBe(serialized);
  });

});
