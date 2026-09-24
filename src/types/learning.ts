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

export interface TopicPracticeQuestion {
  id: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
}

export interface TopicPracticeAnswer {
  questionId: string;
  selectedOptionIndex: number;
}

export interface TopicPracticeResult {
  topicId: string;
  correct: number;
  total: number;
  score: number;
  completedAt: string;
}


export interface LearnerStudyMaterial {
  id: string;
  title: string;
  topicId: string;
  content: string;
  uploadedAt: string;
}

export interface StudyQuizQuestion {
  id: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  sourceMaterialId: string;
}

export interface StudyQuizAnswer {
  questionId: string;
  selectedOptionIndex: number;
}

export interface StudyQuizResult {
  correct: number;
  total: number;
  score: number;
  completedAt: string;
}

export interface StudyPack {
  id: string;
  material: LearnerStudyMaterial;
  summary: string;
  keyPoints: string[];
  questions: StudyQuizQuestion[];
  generatedAt: string;
}


export type LearningAssistantIntent = 'EXPLAIN' | 'HINT' | 'EXAMPLE' | 'SIMPLIFY' | 'QUESTION' | 'SAMPLE_ASSESSMENT';

export interface LearningAssistantAssessmentQuestion {
  id: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
}

export interface LearningAssistantAssessment {
  id: string;
  topicId: string;
  questions: LearningAssistantAssessmentQuestion[];
}

export interface LearningAssistantResponse {
  intent: LearningAssistantIntent;
  text: string;
  assessment?: LearningAssistantAssessment;
}

export interface LearningAssistantMessage {
  id: string;
  role: 'LEARNER' | 'ASSISTANT';
  text: string;
  intent?: LearningAssistantIntent;
}

export interface LearningAssistantAssessmentResult {
  correct: number;
  total: number;
  score: number;
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

export type RecapPromptStatus = 'OFFERED' | 'DECLINED' | 'STARTED' | 'COMPLETED';

export interface RecapOffer {
  daysAway: number;
  topicIds: string[];
  status: RecapPromptStatus;
}

export interface RecapTopicResult {
  topicId: string;
  correct: number;
  total: number;
  score: number;
  level: 'WEAK' | 'DEVELOPING' | 'RETAINED';
}

export interface RecapResult {
  correct: number;
  total: number;
  score: number;
  topicResults: RecapTopicResult[];
  weakTopicIds: string[];
  completedAt: string;
}

export interface LearnerActivitySnapshot {
  learnerId: string;
  lastActiveAt: string;
  learnedTopicIds: string[];
}
