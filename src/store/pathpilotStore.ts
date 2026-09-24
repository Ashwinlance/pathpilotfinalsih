import { create } from 'zustand';
import { demoLearner, demoLearnerState } from '../data/learners/demoLearner';
import { demoRole } from '../data/roles/demoRole';
import { competencies } from '../data/competencies/competencies';
import { initialTopics } from '../data/topics/topics';
import { learningModules } from '../data/learning/modules';
import { getTopicPracticeQuestions } from '../data/learning/topicPracticeQuestions';
import { questions, questionPools } from '../data/assessments/questions';
import { pythonInitialDiagnosticConfig, pythonInitialDiagnosticQuestions } from '../data/assessments/initialDiagnostic';
import { governanceSources } from '../data/governance/sources';
import { pythonCompetencyUpdateV2 } from '../data/governance/pythonCompetencyUpdate';
import type { AdaptiveState } from '../types/adaptive';
import type { Assessment, AssessmentAnswer, AssessmentGuidance, AssessmentMaterial, AssessmentResult, DiagnosticAssessment, DiagnosticResult, Question, QuestionPool } from '../types/assessment';
import type { Evidence, LearningState, StudyPack, StudyQuizAnswer, StudyQuizResult, TopicPracticeAnswer, TopicPracticeResult, Verification } from '../types/learning';
import type { LearnerState } from '../types/learner';
import type { Topic } from '../types/topic';
import type { AuditRecord, GovernanceProposal } from '../types/governance';
import type { Role } from '../types/role';
import { buildInitialAdaptiveState, applyVerificationEvidence } from '../services/adaptive/adaptiveLoopService';
import { completeLearning, startLearning, verifyLearning } from '../services/learning/learningService';
import { gradeTopicPractice } from '../services/learning/topicPracticeService';
import { generateStudyPack, gradeStudyQuiz } from '../services/learning/studyMaterialService';
import { createAssessment, gradeAssessment } from '../services/assessment/assessmentService';
import { DeterministicQuestionGenerator } from '../services/assessment/questionGenerationService';
import { buildAssessmentGuidance } from '../services/assessment/assessmentGuidanceService';
import { createInitialDiagnostic, gradeInitialDiagnostic } from '../services/assessment/diagnosticService';
import { initializeCompetencyFromDiagnostic } from '../services/assessment/diagnosticIntegrationService';
import { createProposal, reviewProposal } from '../services/governance/governanceService';
import { applyApprovedGovernanceKnowledgeUpdate } from '../services/governance/governanceKnowledgeUpdateService';

export type ActiveRole = 'SELECT' | 'LEARNER' | 'ADMIN';

interface StoreState {
  activeRole: ActiveRole;
  learnerState: LearnerState;
  targetRole: Role;
  knowledgeVersion: number;
  topics: Topic[];
  adaptiveState: AdaptiveState;
  diagnosticQuestions: Question[];
  diagnosticAssessment?: DiagnosticAssessment;
  diagnosticAnswers: AssessmentAnswer[];
  diagnosticResult?: DiagnosticResult;
  learningState?: LearningState;
  verifications: Verification[];
  evidence: Evidence[];
  assessmentQuestions: Question[];
  assessmentPools: QuestionPool[];
  assessmentMaterial?: AssessmentMaterial;
  generatedAssessmentQuestions: Question[];
  assessment?: Assessment;
  assessmentAnswers: AssessmentAnswer[];
  assessmentResult?: AssessmentResult;
  assessmentGuidance?: AssessmentGuidance;
  assessmentRun: number;
  topicPracticeAnswers: TopicPracticeAnswer[];
  topicPracticeResult?: TopicPracticeResult;
  studyPack?: StudyPack;
  studyQuizAnswers: StudyQuizAnswer[];
  studyQuizResult?: StudyQuizResult;
  proposals: GovernanceProposal[];
  audit: AuditRecord[];
  setActiveRole: (role: ActiveRole) => void;
  startInitialDiagnostic: () => void;
  answerInitialDiagnostic: (questionId: string, selectedOptionIndex: number) => void;
  submitInitialDiagnostic: () => void;
  startCurrentLearning: () => void;
  completeCurrentLearning: () => void;
  answerCurrentPractice: (questionId: string, selectedOptionIndex: number) => void;
  submitCurrentPractice: () => void;
  retryCurrentPractice: () => void;
  generateLearnerStudyPack: (input: { title: string; content: string; topicId: string }) => void;
  answerLearnerStudyQuiz: (questionId: string, selectedOptionIndex: number) => void;
  submitLearnerStudyQuiz: () => void;
  resetLearnerStudyPack: () => void;
  runHeroVerification: () => void;
  generateAssessmentQuestionPool: (input: { title: string; content: string; competencyId: string; topicIds: string[] }) => void;
  publishAssessmentQuestionPool: () => void;
  startIndependentAssessment: () => void;
  answerIndependentAssessment: (questionId: string, selectedOptionIndex: number) => void;
  submitIndependentAssessment: () => void;
  createGovernanceDemoProposal: () => void;
  reviewLatestProposal: (decision: 'APPROVE' | 'REJECT') => void;
  resetDemo: () => void;
}

function makeInitialAdaptive() {
  const py = demoLearnerState.competencies.find(c => c.competencyId === 'comp-python')!;
  return buildInitialAdaptiveState({ learnerId: demoLearner.id, learnerCompetency: py, requiredLevel: 80, topics: structuredClone(initialTopics) }).adaptiveState;
}

function initialAssessmentState() {
  return {
    assessmentQuestions: structuredClone(questions),
    assessmentPools: structuredClone(questionPools),
    assessmentMaterial: undefined,
    generatedAssessmentQuestions: [],
    assessment: undefined,
    assessmentAnswers: [],
    assessmentResult: undefined,
    assessmentGuidance: undefined,
    assessmentRun: 0,
  };
}

export const usePathPilotStore = create<StoreState>((set, get) => ({
  activeRole: 'SELECT',
  learnerState: structuredClone(demoLearnerState),
  targetRole: structuredClone(demoRole),
  knowledgeVersion: 1,
  topics: structuredClone(initialTopics),
  adaptiveState: makeInitialAdaptive(),
  diagnosticQuestions: structuredClone(pythonInitialDiagnosticQuestions),
  diagnosticAssessment: undefined,
  diagnosticAnswers: [],
  diagnosticResult: undefined,
  verifications: [],
  evidence: [],
  proposals: [],
  audit: [],
  topicPracticeAnswers: [],
  studyPack: undefined,
  studyQuizAnswers: [],
  studyQuizResult: undefined,
  ...initialAssessmentState(),
  setActiveRole: activeRole => set({ activeRole }),
  startInitialDiagnostic: () => {
    const state = get();
    if (state.diagnosticResult) return;
    set({
      diagnosticAssessment: createInitialDiagnostic({
        id: 'diagnostic-python-initial',
        learnerId: demoLearner.id,
        config: pythonInitialDiagnosticConfig,
        questions: state.diagnosticQuestions,
      }),
      diagnosticAnswers: [],
    });
  },
  answerInitialDiagnostic: (questionId, selectedOptionIndex) => {
    const state = get();
    if (!state.diagnosticAssessment || state.diagnosticResult || !state.diagnosticAssessment.questionIds.includes(questionId)) return;
    const remaining = state.diagnosticAnswers.filter(answer => answer.questionId !== questionId);
    set({ diagnosticAnswers: [...remaining, { questionId, selectedOptionIndex }] });
  },
  submitInitialDiagnostic: () => {
    const state = get();
    if (!state.diagnosticAssessment || state.diagnosticAssessment.questionIds.some(id => !state.diagnosticAnswers.some(answer => answer.questionId === id))) return;
    const result = gradeInitialDiagnostic({
      assessment: state.diagnosticAssessment,
      answers: state.diagnosticAnswers,
      questions: state.diagnosticQuestions,
      config: pythonInitialDiagnosticConfig,
    });
    const currentLearnerComp = state.learnerState.competencies.find(competency => competency.competencyId === result.competencyId);
    if (!currentLearnerComp) return;
    const initialized = initializeCompetencyFromDiagnostic({ learnerCompetency: currentLearnerComp, result, topics: state.topics });
    const requiredLevel = state.targetRole.competencyRequirements.find(requirement => requirement.competencyId === result.competencyId)?.requiredLevel ?? 80;
    const snapshot = buildInitialAdaptiveState({ learnerId: demoLearner.id, learnerCompetency: initialized.learnerCompetency, requiredLevel, topics: initialized.topics });
    set({
      diagnosticResult: result,
      learnerState: { ...state.learnerState, competencies: state.learnerState.competencies.map(competency => competency.competencyId === result.competencyId ? initialized.learnerCompetency : competency) },
      topics: initialized.topics,
      adaptiveState: snapshot.adaptiveState,
      learningState: undefined,
      topicPracticeAnswers: [],
      topicPracticeResult: undefined,
    });
  },
  startCurrentLearning: () => {
    const state = get(); if (!state.diagnosticResult) return; const topicId = state.adaptiveState.currentAction.targetTopicId;
    const module = learningModules.find(m => m.topicId === topicId); if (!module) return;
    set({ learningState: startLearning(module.id), topicPracticeAnswers: [], topicPracticeResult: undefined });
  },
  completeCurrentLearning: () => {
    const state = get(); if (!state.diagnosticResult || !state.learningState) return;
    set({ learningState: completeLearning(state.learningState), adaptiveState: { ...state.adaptiveState, completedTopics: [...new Set([...state.adaptiveState.completedTopics, state.adaptiveState.currentAction.targetTopicId].filter(Boolean) as string[])] } });
  },
  answerCurrentPractice: (questionId, selectedOptionIndex) => {
    const state = get();
    if (state.topicPracticeResult) return;
    const withoutQuestion = state.topicPracticeAnswers.filter(answer => answer.questionId !== questionId);
    set({ topicPracticeAnswers: [...withoutQuestion, { questionId, selectedOptionIndex }] });
  },
  submitCurrentPractice: () => {
    const state = get();
    const topicId = state.adaptiveState.currentAction.targetTopicId;
    if (!topicId || !state.learningState?.completedAt) return;
    const practiceQuestions = getTopicPracticeQuestions(topicId);
    if (practiceQuestions.length !== 5 || practiceQuestions.some(question => !state.topicPracticeAnswers.some(answer => answer.questionId === question.id))) return;
    const result = gradeTopicPractice(topicId, practiceQuestions, state.topicPracticeAnswers);
    set({ topicPracticeResult: result });
    // The five-question topic check is the deterministic verification step for the
    // current learning module. A passing score creates approved evidence through
    // the existing verification service; failed attempts never update competency.
    if (result.score >= 70) get().runHeroVerification();
  },
  retryCurrentPractice: () => set({ topicPracticeAnswers: [], topicPracticeResult: undefined }),
  generateLearnerStudyPack: input => {
    const topic = get().topics.find(candidate => candidate.id === input.topicId);
    if (!topic || !input.title.trim() || !input.content.trim()) return;
    const material = {
      id: `learner-material-${input.topicId}-${Date.now()}`,
      title: input.title.trim(),
      topicId: input.topicId,
      content: input.content.trim(),
      uploadedAt: new Date().toISOString(),
    };
    set({ studyPack: generateStudyPack(material), studyQuizAnswers: [], studyQuizResult: undefined });
  },
  answerLearnerStudyQuiz: (questionId, selectedOptionIndex) => {
    const state = get();
    if (!state.studyPack || state.studyQuizResult || !state.studyPack.questions.some(question => question.id === questionId)) return;
    const remaining = state.studyQuizAnswers.filter(answer => answer.questionId !== questionId);
    set({ studyQuizAnswers: [...remaining, { questionId, selectedOptionIndex }] });
  },
  submitLearnerStudyQuiz: () => {
    const state = get();
    if (!state.studyPack || state.studyPack.questions.some(question => !state.studyQuizAnswers.some(answer => answer.questionId === question.id))) return;
    set({ studyQuizResult: gradeStudyQuiz(state.studyPack.questions, state.studyQuizAnswers) });
  },
  resetLearnerStudyPack: () => set({ studyPack: undefined, studyQuizAnswers: [], studyQuizResult: undefined }),
  runHeroVerification: () => {
    const state = get();
    if (!state.diagnosticResult || !state.learningState?.completedAt) return;
    const currentTopicId = state.adaptiveState.currentAction.targetTopicId;
    const configuredPractice = getTopicPracticeQuestions(currentTopicId);
    if (configuredPractice.length > 0 && state.topicPracticeResult?.topicId !== currentTopicId) return;
    if (configuredPractice.length > 0 && (state.topicPracticeResult?.score ?? 0) < 70) return;
    const topicId = state.adaptiveState.currentAction.targetTopicId ?? 'py-functions';
    const topic = state.topics.find(t => t.id === topicId); if (!topic) return;
    const module = learningModules.find(m => m.topicId === topicId) ?? learningModules[0];
    const verificationScore = state.topicPracticeResult?.topicId === topicId ? state.topicPracticeResult.score : 86;
    const result = verifyLearning({ learnerId: demoLearner.id, competencyId: topic.competencyId, topicId, moduleId: module.id, score: verificationScore });
    if (!result.evidence) return;
    const req = state.targetRole.competencyRequirements.find(r => r.competencyId === topic.competencyId)?.requiredLevel ?? 80;
    const currentLearnerComp = state.learnerState.competencies.find(c => c.competencyId === topic.competencyId)!;
    const snapshot = { learnerCompetency: currentLearnerComp, adaptiveState: state.adaptiveState, competencyGap: Math.max(0, req - currentLearnerComp.currentLevel) };
    const next = applyVerificationEvidence({ snapshot, evidence: result.evidence, requiredLevel: req, topics: state.topics });
    const topics = state.topics.map(t => t.id === topicId ? { ...t, mastery: Math.max(t.mastery, result.evidence!.score) } : t);
    const verifiedLearningState = { ...state.learningState, verificationStatus: 'PASSED' as const, evidenceId: result.evidence.id };
    const actionMovedToAnotherTopic = next.adaptiveState.currentAction.targetTopicId !== topicId;
    set({
      topics,
      learnerState: { ...state.learnerState, competencies: state.learnerState.competencies.map(c => c.competencyId === topic.competencyId ? next.learnerCompetency : c) },
      adaptiveState: next.adaptiveState,
      verifications: [...state.verifications, result.verification],
      evidence: [...state.evidence, result.evidence],
      learningState: actionMovedToAnotherTopic ? undefined : verifiedLearningState,
      topicPracticeAnswers: actionMovedToAnotherTopic ? [] : state.topicPracticeAnswers,
      topicPracticeResult: actionMovedToAnotherTopic ? undefined : state.topicPracticeResult,
    });
  },
  generateAssessmentQuestionPool: input => {
    const state = get();
    const material: AssessmentMaterial = {
      id: `material-${input.competencyId}-${Date.now()}`,
      title: input.title.trim(),
      competencyId: input.competencyId,
      topicIds: [...input.topicIds],
      content: input.content.trim(),
      addedAt: new Date().toISOString(),
    };
    const selectedTopics = state.topics.filter(topic => material.topicIds.includes(topic.id) && topic.competencyId === material.competencyId);
    const generated = new DeterministicQuestionGenerator().generateFromApprovedMaterial({ material, topics: selectedTopics, count: 45 });
    set({ assessmentMaterial: material, generatedAssessmentQuestions: generated });
  },
  publishAssessmentQuestionPool: () => {
    const state = get();
    if (!state.assessmentMaterial || state.generatedAssessmentQuestions.length !== 45) return;
    const previousPublished = state.assessmentPools.find(pool => pool.competencyId === state.assessmentMaterial!.competencyId && Boolean(pool.sourceMaterialId));
    const previousIds = new Set(previousPublished?.questionIds ?? []);
    const retainedQuestions = state.assessmentQuestions.filter(question => !previousIds.has(question.id));
    const version = (previousPublished?.version ?? 0) + 1;
    const pool: QuestionPool = {
      id: `pool-published-${state.assessmentMaterial.competencyId}`,
      competencyId: state.assessmentMaterial.competencyId,
      approved: true,
      questionIds: state.generatedAssessmentQuestions.map(question => question.id),
      sourceMaterialId: state.assessmentMaterial.id,
      publishedAt: new Date().toISOString(),
      version,
    };
    set({
      assessmentQuestions: [...retainedQuestions, ...state.generatedAssessmentQuestions],
      assessmentPools: [...state.assessmentPools.filter(existing => existing.id !== pool.id), pool],
      assessment: undefined,
      assessmentAnswers: [],
      assessmentResult: undefined,
      assessmentGuidance: undefined,
    });
  },
  startIndependentAssessment: () => {
    const state = get();
    const competencyId = 'comp-python';
    const pool = state.assessmentPools.find(candidate => candidate.competencyId === competencyId && candidate.approved && Boolean(candidate.sourceMaterialId))
      ?? state.assessmentPools.find(candidate => candidate.competencyId === competencyId && candidate.approved);
    if (!pool) return;
    const nextRun = state.assessmentRun + 1;
    const assessment = createAssessment({
      id: `assessment-${nextRun}`,
      learnerId: demoLearner.id,
      competencyId,
      pool,
      questions: state.assessmentQuestions,
      count: 15,
      selectionSeed: `run-${nextRun}-pool-${pool.version ?? 0}`,
    });
    set({ assessment, assessmentAnswers: [], assessmentResult: undefined, assessmentGuidance: undefined, assessmentRun: nextRun });
  },
  answerIndependentAssessment: (questionId, selectedOptionIndex) => {
    const state = get();
    if (!state.assessment || state.assessmentResult || !state.assessment.questionIds.includes(questionId)) return;
    const remaining = state.assessmentAnswers.filter(answer => answer.questionId !== questionId);
    set({ assessmentAnswers: [...remaining, { questionId, selectedOptionIndex }] });
  },
  submitIndependentAssessment: () => {
    const state = get();
    if (!state.assessment || state.assessment.questionIds.some(id => !state.assessmentAnswers.some(answer => answer.questionId === id))) return;
    const result = gradeAssessment(state.assessment, state.assessmentAnswers, state.assessmentQuestions);
    const guidance = buildAssessmentGuidance({ result, topics: state.topics, modules: learningModules });
    set({ assessmentResult: result, assessmentGuidance: guidance });
  },
  createGovernanceDemoProposal: () => {
    const state = get();
    try {
      const proposal = createProposal({
        id: `proposal-${state.proposals.length + 1}`,
        source: governanceSources[0],
        title: 'Python competency standard v2',
        proposedChange: 'Raise the Statistical Data Analyst Python requirement from 80% to 85% and add Python Testing & Validation as a governed roadmap topic.',
        evidenceSummary: 'Deterministic prototype extraction from an authorized competency-standard update. Human approval is required before the requirement or curriculum changes.',
        aiConfidence: 0.87,
        fingerprint: pythonCompetencyUpdateV2.id,
        existing: state.proposals,
      });
      set({ proposals: [...state.proposals, proposal] });
    } catch { /* deterministic demo; duplicate approved/pending proposals are safely ignored */ }
  },
  reviewLatestProposal: decision => {
    const state = get();
    const latest = [...state.proposals].reverse().find(p => p.status === 'PENDING_REVIEW');
    if (!latest) return;
    const reviewed = reviewProposal(latest, {
      id: `review-${latest.id}`,
      proposalId: latest.id,
      reviewerId: 'admin-reviewer-001',
      decision,
      note: decision === 'APPROVE' ? 'Reviewed against source and approved for competency standard v2.' : 'Rejected pending stronger evidence.',
      reviewedAt: new Date().toISOString(),
    });

    if (decision === 'REJECT') {
      set({ proposals: state.proposals.map(p => p.id === latest.id ? reviewed.proposal : p), audit: [...state.audit, reviewed.audit] });
      return;
    }

    const pythonCompetency = state.learnerState.competencies.find(c => c.competencyId === pythonCompetencyUpdateV2.competencyId);
    if (!pythonCompetency) return;
    const applied = applyApprovedGovernanceKnowledgeUpdate({
      proposal: reviewed.proposal,
      update: pythonCompetencyUpdateV2,
      role: state.targetRole,
      topics: state.topics,
      learnerCompetency: pythonCompetency,
      adaptiveState: state.adaptiveState,
    });
    const actionChanged = applied.adaptiveState.currentAction.targetTopicId !== state.adaptiveState.currentAction.targetTopicId;
    set({
      targetRole: applied.role,
      knowledgeVersion: pythonCompetencyUpdateV2.version,
      topics: applied.topics,
      adaptiveState: applied.adaptiveState,
      proposals: state.proposals.map(p => p.id === latest.id ? reviewed.proposal : p),
      audit: [...state.audit, reviewed.audit],
      learningState: actionChanged ? undefined : state.learningState,
      topicPracticeAnswers: actionChanged ? [] : state.topicPracticeAnswers,
      topicPracticeResult: actionChanged ? undefined : state.topicPracticeResult,
    });
  },
  resetDemo: () => set({
    activeRole: 'SELECT',
    learnerState: structuredClone(demoLearnerState),
    targetRole: structuredClone(demoRole),
    knowledgeVersion: 1,
    topics: structuredClone(initialTopics),
    adaptiveState: makeInitialAdaptive(),
    diagnosticQuestions: structuredClone(pythonInitialDiagnosticQuestions),
    diagnosticAssessment: undefined,
    diagnosticAnswers: [],
    diagnosticResult: undefined,
    learningState: undefined,
    verifications: [],
    evidence: [],
    topicPracticeAnswers: [],
    topicPracticeResult: undefined,
    studyPack: undefined,
    studyQuizAnswers: [],
    studyQuizResult: undefined,
    proposals: [],
    audit: [],
    ...initialAssessmentState(),
  }),
}));

export const pathpilotCatalog = { demoLearner, demoRole, competencies, learningModules, questions, questionPools, governanceSources, getTopicPracticeQuestions, pythonInitialDiagnosticConfig };
