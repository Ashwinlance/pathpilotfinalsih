import type { Evidence, LearningState, Verification } from '../../types/learning';

export function startLearning(moduleId: string, at = new Date().toISOString()): LearningState {
  return { lessonId: moduleId, startedAt: at, verificationStatus: 'PENDING' };
}

export function completeLearning(state: LearningState, at = new Date().toISOString()): LearningState {
  return { ...state, completedAt: at };
}

export function verifyLearning(input: {
  learnerId: string;
  competencyId: string;
  topicId: string;
  moduleId: string;
  score: number;
  passingScore?: number;
  at?: string;
}): { verification: Verification; evidence?: Evidence } {
  const passingScore = input.passingScore ?? 70;
  const at = input.at ?? new Date().toISOString();
  const status = input.score >= passingScore ? 'PASSED' : 'FAILED';
  const verification: Verification = {
    id: `verification-${input.learnerId}-${input.topicId}-${at}`,
    learnerId: input.learnerId,
    competencyId: input.competencyId,
    topicId: input.topicId,
    moduleId: input.moduleId,
    score: input.score,
    status,
    completedAt: at,
  };
  if (status !== 'PASSED') return { verification };
  const evidence: Evidence = {
    id: `evidence-${input.learnerId}-${input.topicId}-${at}`,
    learnerId: input.learnerId,
    competencyId: input.competencyId,
    topicId: input.topicId,
    verificationId: verification.id,
    approved: true,
    score: input.score,
    createdAt: at,
    source: 'VERIFICATION',
  };
  return { verification, evidence };
}
