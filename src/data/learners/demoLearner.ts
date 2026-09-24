import type { Learner, LearnerState } from '../../types/learner';

export const demoLearner: Learner = {
  id: 'learner-ananya',
  name: 'Ananya',
  email: 'ananya.demo@pathpilot.local',
  targetRoleId: 'role-statistical-data-analyst',
};

export const demoLearnerState: LearnerState = {
  learnerId: demoLearner.id,
  targetRoleId: demoLearner.targetRoleId,
  competencies: [
    { competencyId: 'comp-python', currentLevel: 48, evidence: [], updatedAt: '2026-09-24T10:00:00.000Z' },
    { competencyId: 'comp-sql', currentLevel: 54, evidence: [], updatedAt: '2026-09-24T10:00:00.000Z' },
    { competencyId: 'comp-stats', currentLevel: 67, evidence: [], updatedAt: '2026-09-24T10:00:00.000Z' },
    { competencyId: 'comp-viz', currentLevel: 72, evidence: [], updatedAt: '2026-09-24T10:00:00.000Z' },
  ],
};
