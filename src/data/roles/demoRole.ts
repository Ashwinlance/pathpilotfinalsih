import type { Role } from '../../types/role';

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
