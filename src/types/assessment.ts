export interface Question {
  id: string;
  competencyId: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED';
  sourceId: string;
}

export interface AssessmentMaterial {
  id: string;
  title: string;
  competencyId: string;
  topicIds: string[];
  content: string;
  addedAt: string;
}

export interface QuestionPool {
  id: string;
  competencyId: string;
  approved: boolean;
  questionIds: string[];
  sourceMaterialId?: string;
  publishedAt?: string;
  version?: number;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionIndex: number;
}

export type TopicStrength = 'STRONG' | 'DEVELOPING' | 'PRIORITY_GAP';

export interface TopicAnalysis {
  topicId: string;
  correct: number;
  total: number;
  percentage: number;
  strength: TopicStrength;
}

export interface Assessment {
  id: string;
  learnerId: string;
  competencyId: string;
  questionIds: string[];
  createdAt: string;
}

export interface AssessmentState {
  assessmentId: string;
  learnerId: string;
  competencyId: string;
  questionIds: string[];
  answers: AssessmentAnswer[];
  score: number;
  topicAnalysis: TopicAnalysis[];
  completedAt?: string;
}

export interface AssessmentResult extends AssessmentState {
  passed: boolean;
}

export interface AssessmentLearningTarget {
  topicId: string;
  topicName: string;
  percentage: number;
  strength: TopicStrength;
  moduleId?: string;
  moduleTitle?: string;
  reason: string;
}

export interface AssessmentGuidance {
  targets: AssessmentLearningTarget[];
  summary: string;
}

export interface DiagnosticAssessment extends Assessment {
  kind: 'INITIAL_DIAGNOSTIC';
}

export interface DiagnosticConfig {
  competencyId: string;
  questionIds: string[];
  topicWeights: Record<string, number>;
}

export interface DiagnosticResult {
  assessmentId: string;
  learnerId: string;
  competencyId: string;
  answers: AssessmentAnswer[];
  score: number;
  topicAnalysis: TopicAnalysis[];
  completedAt: string;
}
