import type { GovernedCompetencyUpdate } from './pythonCompetencyUpdate';

export const sqlCompetencyUpdateV2: GovernedCompetencyUpdate = {
  id: 'sql-standard-v2',
  version: 2,
  roleId: 'role-statistical-data-analyst',
  competencyId: 'comp-sql',
  previousRequiredLevel: 78,
  requiredLevel: 83,
  topic: {
    id: 'sql-window',
    competencyId: 'comp-sql',
    name: 'SQL Window Functions & Validation',
    description: 'Window functions, partitions, rankings and result validation for reliable analytical SQL.',
    order: 4,
    mastery: 0,
    prerequisites: [{ topicId: 'sql-joins', requiredMastery: 70 }],
  },
};
