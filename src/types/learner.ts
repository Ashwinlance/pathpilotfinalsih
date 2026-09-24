import type { Evidence } from './learning';

export interface Learner {
  id: string;
  studentId: string;
  name: string;
  email: string;
  careerTrack: string;
  currentRoleId: string;
  targetRoleId: string;
}

export interface LearnerCompetency {
  competencyId: string;
  currentLevel: number;
  evidence: Evidence[];
  updatedAt: string;
}

export interface LearnerState {
  learnerId: string;
  targetRoleId: string;
  competencies: LearnerCompetency[];
}
