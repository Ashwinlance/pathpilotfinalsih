import { describe, expect, it } from 'vitest';
import { applyApprovedEvidence, calculateCompetencyState } from '../../src/services/competency/competencyEngine';
import type { LearnerCompetency } from '../../src/types/learner';

const base: LearnerCompetency = { competencyId: 'comp-python', currentLevel: 48, evidence: [], updatedAt: 't0' };

describe('competency engine', () => {
  it('calculates deterministic current, required and gap values', () => { expect(calculateCompetencyState(base, 80)).toMatchObject({ currentLevel: 48, requiredLevel: 80, gap: 32 }); });
  it('updates competency only from approved evidence and is repeat-run safe', () => {
    const evidence = { id: 'e1', learnerId: 'l1', competencyId: 'comp-python', topicId: 'py-functions', verificationId: 'v1', approved: true, score: 86, createdAt: 't1', source: 'VERIFICATION' as const };
    const once = applyApprovedEvidence(base, evidence); const twice = applyApprovedEvidence(once, evidence);
    expect(once.currentLevel).toBe(62); expect(twice.currentLevel).toBe(62); expect(twice.evidence).toHaveLength(1);
  });
});
