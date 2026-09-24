import type { Role } from '../../types/role';

export const currentDemoRole: Role = {
  id: 'role-data-operations-trainee',
  name: 'Data Operations Trainee',
  description: 'Supports routine data preparation, validation and reporting while building analyst-level competency.',
  competencyRequirements: [
    { competencyId: 'comp-python', requiredLevel: 45 },
    { competencyId: 'comp-sql', requiredLevel: 50 },
    { competencyId: 'comp-stats', requiredLevel: 55 },
    { competencyId: 'comp-viz', requiredLevel: 55 },
  ],
};

export const demoRole: Role = {
  id: 'role-statistical-data-analyst',
  name: 'Statistical Data Analyst',
  description: 'Analyzes structured data using statistics, Python, SQL and clear visual communication.',
  competencyRequirements: [
    { competencyId: 'comp-python', requiredLevel: 80 },
    { competencyId: 'comp-sql', requiredLevel: 78 },
    { competencyId: 'comp-stats', requiredLevel: 82 },
    { competencyId: 'comp-viz', requiredLevel: 75 },
  ],
};

export const demoRoles: Role[] = [currentDemoRole, demoRole];
