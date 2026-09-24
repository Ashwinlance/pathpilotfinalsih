import type { Topic } from '../../types/topic';

export interface GovernedCompetencyUpdate {
  id: string;
  version: number;
  roleId: string;
  competencyId: string;
  previousRequiredLevel: number;
  requiredLevel: number;
  topic: Topic;
}

export const pythonCompetencyUpdateV2: GovernedCompetencyUpdate = {
  id: 'python-standard-v2',
  version: 2,
  roleId: 'role-statistical-data-analyst',
  competencyId: 'comp-python',
  previousRequiredLevel: 80,
  requiredLevel: 85,
  topic: {
    id: 'py-testing',
    competencyId: 'comp-python',
    name: 'Python Testing & Validation',
    description: 'Assertions, test cases and validation checks for reliable analytical Python.',
    order: 5,
    mastery: 0,
    prerequisites: [{ topicId: 'py-analysis', requiredMastery: 70 }],
  },
};
