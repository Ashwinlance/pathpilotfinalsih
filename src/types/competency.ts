export interface Competency {
  id: string;
  name: string;
  description: string;
  topicIds: string[];
}

export interface CompetencyState {
  competencyId: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  evidenceIds: string[];
  updatedAt: string;
}

export interface CompetencyUpdatePolicy {
  passedVerificationGain: number;
  maximumLevel: number;
}
