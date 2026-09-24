import type { CompetencyState, CompetencyUpdatePolicy } from '../../types/competency';
import type { Evidence } from '../../types/learning';
import type { LearnerCompetency } from '../../types/learner';

export const DEFAULT_COMPETENCY_POLICY: CompetencyUpdatePolicy = {
  passedVerificationGain: 14,
  maximumLevel: 100,
};

export function calculateCompetencyState(
  learnerCompetency: LearnerCompetency,
  requiredLevel: number,
): CompetencyState {
  const currentLevel = clamp(learnerCompetency.currentLevel, 0, 100);
  const required = clamp(requiredLevel, 0, 100);
  return {
    competencyId: learnerCompetency.competencyId,
    currentLevel,
    requiredLevel: required,
    gap: Math.max(0, required - currentLevel),
    evidenceIds: learnerCompetency.evidence.filter(e => e.approved).map(e => e.id),
    updatedAt: learnerCompetency.updatedAt,
  };
}

export function applyApprovedEvidence(
  learnerCompetency: LearnerCompetency,
  evidence: Evidence,
  policy: CompetencyUpdatePolicy = DEFAULT_COMPETENCY_POLICY,
): LearnerCompetency {
  if (!evidence.approved || evidence.competencyId !== learnerCompetency.competencyId) return learnerCompetency;
  if (learnerCompetency.evidence.some(e => e.id === evidence.id)) return learnerCompetency;
  return {
    ...learnerCompetency,
    currentLevel: Math.min(policy.maximumLevel, learnerCompetency.currentLevel + policy.passedVerificationGain),
    evidence: [...learnerCompetency.evidence, evidence],
    updatedAt: evidence.createdAt,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
