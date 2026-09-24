export interface RoleCompetencyRequirement {
  competencyId: string;
  requiredLevel: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  competencyRequirements: RoleCompetencyRequirement[];
}

export type RoleSkillReadinessStatus = 'READY' | 'DEVELOPING' | 'PRIORITY_GAP';

export interface RoleSkillReadiness {
  competencyId: string;
  competencyName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  status: RoleSkillReadinessStatus;
}
