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
