import { create } from 'zustand';
import { demoLearner, demoLearnerState } from '../data/learners/demoLearner';
import { demoRole } from '../data/roles/demoRole';
import { competencies } from '../data/competencies/competencies';
import { initialTopics } from '../data/topics/topics';
import { learningModules } from '../data/learning/modules';
import { questions, questionPools } from '../data/assessments/questions';
import { governanceSources } from '../data/governance/sources';
import type { AdaptiveState } from '../types/adaptive';
import type { AssessmentResult } from '../types/assessment';
import type { Evidence, LearningState, Verification } from '../types/learning';
import type { LearnerState } from '../types/learner';
import type { Topic } from '../types/topic';
import type { AuditRecord, GovernanceProposal } from '../types/governance';
import { buildInitialAdaptiveState, applyVerificationEvidence } from '../services/adaptive/adaptiveLoopService';
import { completeLearning, startLearning, verifyLearning } from '../services/learning/learningService';
import { createAssessment, gradeAssessment } from '../services/assessment/assessmentService';
import { createProposal, reviewProposal } from '../services/governance/governanceService';

export type ActiveRole = 'SELECT' | 'LEARNER' | 'ADMIN';

interface StoreState {
  activeRole: ActiveRole;
  learnerState: LearnerState;
  topics: Topic[];
  adaptiveState: AdaptiveState;
  learningState?: LearningState;
  verifications: Verification[];
  evidence: Evidence[];
  assessmentResult?: AssessmentResult;
  proposals: GovernanceProposal[];
  audit: AuditRecord[];
  setActiveRole: (role: ActiveRole) => void;
  startCurrentLearning: () => void;
  completeCurrentLearning: () => void;
  runHeroVerification: () => void;
  runAssessmentDemo: () => void;
  createGovernanceDemoProposal: () => void;
  reviewLatestProposal: (decision: 'APPROVE' | 'REJECT') => void;
  resetDemo: () => void;
}

function makeInitialAdaptive() {
  const py = demoLearnerState.competencies.find(c => c.competencyId === 'comp-python')!;
  return buildInitialAdaptiveState({ learnerId: demoLearner.id, learnerCompetency: py, requiredLevel: 80, topics: structuredClone(initialTopics) }).adaptiveState;
}

export const usePathPilotStore = create<StoreState>((set, get) => ({
  activeRole: 'SELECT',
  learnerState: structuredClone(demoLearnerState),
  topics: structuredClone(initialTopics),
  adaptiveState: makeInitialAdaptive(),
  verifications: [],
  evidence: [],
  proposals: [],
  audit: [],
  setActiveRole: activeRole => set({ activeRole }),
  startCurrentLearning: () => {
    const state = get(); const topicId = state.adaptiveState.currentAction.targetTopicId;
    const module = learningModules.find(m => m.topicId === topicId); if (!module) return;
    set({ learningState: startLearning(module.id) });
  },
  completeCurrentLearning: () => {
    const state = get(); if (!state.learningState) return;
    set({ learningState: completeLearning(state.learningState), adaptiveState: { ...state.adaptiveState, completedTopics: [...new Set([...state.adaptiveState.completedTopics, state.adaptiveState.currentAction.targetTopicId].filter(Boolean) as string[])] } });
  },
  runHeroVerification: () => {
    const state = get();
    if (!state.learningState?.completedAt) return;
    const topicId = state.adaptiveState.currentAction.targetTopicId ?? 'py-functions';
    const topic = state.topics.find(t => t.id === topicId); if (!topic) return;
    const module = learningModules.find(m => m.topicId === topicId) ?? learningModules[0];
    const result = verifyLearning({ learnerId: demoLearner.id, competencyId: topic.competencyId, topicId, moduleId: module.id, score: 86 });
    if (!result.evidence) return;
    const req = demoRole.competencyRequirements.find(r => r.competencyId === topic.competencyId)?.requiredLevel ?? 80;
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
    });
  },
  runAssessmentDemo: () => {
    const pool = questionPools.find(p => p.competencyId === 'comp-python')!;
    const assessment = createAssessment({ id: 'assessment-demo', learnerId: demoLearner.id, competencyId: 'comp-python', pool, questions, count: 15 });
    const answers = assessment.questionIds.map((questionId, i) => ({ questionId, selectedOptionIndex: i < 11 ? 0 : 1 }));
    set({ assessmentResult: gradeAssessment(assessment, answers, questions) });
  },
  createGovernanceDemoProposal: () => {
    const state = get();
    try {
      const proposal = createProposal({ id: `proposal-${state.proposals.length + 1}`, source: governanceSources[0], title: 'Clarify Python function competency evidence', proposedChange: 'Require a passing verification artifact before marking function mastery.', evidenceSummary: 'Deterministic prototype extraction from an authorized source.', aiConfidence: 0.87, fingerprint: `python-functions-v${state.proposals.length + 1}`, existing: state.proposals });
      set({ proposals: [...state.proposals, proposal] });
    } catch { /* deterministic demo; duplicate is safely ignored */ }
  },
  reviewLatestProposal: decision => {
    const state = get(); const latest = [...state.proposals].reverse().find(p => p.status === 'PENDING_REVIEW'); if (!latest) return;
    const reviewed = reviewProposal(latest, { id: `review-${latest.id}`, proposalId: latest.id, reviewerId: 'admin-reviewer-001', decision, note: decision === 'APPROVE' ? 'Reviewed against source and approved.' : 'Rejected pending stronger evidence.', reviewedAt: new Date().toISOString() });
    set({ proposals: state.proposals.map(p => p.id === latest.id ? reviewed.proposal : p), audit: [...state.audit, reviewed.audit] });
  },
  resetDemo: () => set({ activeRole: 'SELECT', learnerState: structuredClone(demoLearnerState), topics: structuredClone(initialTopics), adaptiveState: makeInitialAdaptive(), learningState: undefined, verifications: [], evidence: [], assessmentResult: undefined, proposals: [], audit: [] }),
}));

export const pathpilotCatalog = { demoLearner, demoRole, competencies, learningModules, questions, questionPools, governanceSources };
