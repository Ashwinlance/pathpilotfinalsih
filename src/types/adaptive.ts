export type AdaptiveAction =
  | 'LEARN_TARGET'
  | 'REPAIR_PREREQUISITE'
  | 'PRACTICE'
  | 'VERIFY'
  | 'REASSESS'
  | 'COMPLETE';

export interface AdaptiveDecision {
  action: AdaptiveAction;
  reason: string;
  targetTopicId?: string;
  prerequisiteTopicId?: string;
  expectedOutcome: string;
}

export interface RoadmapStep {
  id: string;
  topicId?: string;
  action: AdaptiveAction;
  label: string;
  reason: string;
  status: 'CURRENT' | 'UPCOMING' | 'COMPLETE';
}

export interface Roadmap {
  learnerId: string;
  competencyId: string;
  version: number;
  steps: RoadmapStep[];
  updatedAt: string;
}

export interface AdaptiveState {
  learnerId: string;
  competencyId: string;
  currentTopicId?: string;
  completedTopics: string[];
  verifiedTopics: string[];
  roadmap: Roadmap;
  currentAction: AdaptiveDecision;
}

export type GapPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SkillGapAnalysis {
  competencyId: string;
  gap: number;
  affectedTopicIds: string[];
  blockingPrerequisiteIds: string[];
  priority: GapPriority;
  explanation: string;
}
