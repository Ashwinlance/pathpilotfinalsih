export type VerificationStatus = 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED';

export interface LearningModule {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  objectives: string[];
}

export interface LearningState {
  lessonId: string;
  startedAt?: string;
  completedAt?: string;
  verificationStatus: VerificationStatus;
  evidenceId?: string;
}

export interface Verification {
  id: string;
  learnerId: string;
  competencyId: string;
  topicId: string;
  moduleId: string;
  score: number;
  status: VerificationStatus;
  completedAt: string;
}

export interface Evidence {
  id: string;
  learnerId: string;
  competencyId: string;
  topicId: string;
  verificationId: string;
  approved: boolean;
  score: number;
  createdAt: string;
  source: 'VERIFICATION';
}
