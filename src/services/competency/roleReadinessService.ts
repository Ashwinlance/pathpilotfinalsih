import type { Competency } from '../../types/competency';
import type { LearnerState } from '../../types/learner';
import type { Role, RoleSkillReadiness } from '../../types/role';

export function calculateRoleSkillReadiness(input: {
  learnerState: LearnerState;
  targetRole: Role;
  competencies: Competency[];
}): RoleSkillReadiness[] {
  const competencyById = new Map(input.competencies.map(item => [item.id, item]));
  const learnerById = new Map(input.learnerState.competencies.map(item => [item.competencyId, item]));

  return input.targetRole.competencyRequirements.map(requirement => {
    const learner = learnerById.get(requirement.competencyId);
    const currentLevel = learner?.currentLevel ?? 0;
    const gap = Math.max(0, requirement.requiredLevel - currentLevel);
    const ratio = requirement.requiredLevel > 0 ? currentLevel / requirement.requiredLevel : 1;

    return {
      competencyId: requirement.competencyId,
      competencyName: competencyById.get(requirement.competencyId)?.name ?? requirement.competencyId,
      currentLevel,
      requiredLevel: requirement.requiredLevel,
      gap,
      status: gap === 0 ? 'READY' : ratio >= 0.8 ? 'DEVELOPING' : 'PRIORITY_GAP',
    };
  });
}
