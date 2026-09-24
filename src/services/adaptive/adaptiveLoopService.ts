import type { AdaptiveState, Roadmap } from '../../types/adaptive';
import type { LearnerCompetency } from '../../types/learner';
import type { Topic } from '../../types/topic';
import type { Evidence } from '../../types/learning';
import { calculateCompetencyState, applyApprovedEvidence } from '../competency/competencyEngine';
import { analyzeSkillGap } from '../skillGap/skillGapEngine';
import { decideNextAction } from './adaptiveDecisionEngine';
import { buildRoadmap } from './roadmapService';

export interface LoopSnapshot {
  learnerCompetency: LearnerCompetency;
  adaptiveState: AdaptiveState;
  competencyGap: number;
}

export function buildInitialAdaptiveState(input: {
  learnerId: string;
  learnerCompetency: LearnerCompetency;
  requiredLevel: number;
  topics: Topic[];
}): LoopSnapshot {
  const comp = calculateCompetencyState(input.learnerCompetency, input.requiredLevel);
  const gap = analyzeSkillGap(comp, input.topics);
  const decision = decideNextAction({ skillGap: gap, topics: input.topics, completedTopics: [], verifiedTopics: [] });
  const roadmap = buildRoadmap(input.learnerId, input.learnerCompetency.competencyId, decision, input.topics);
  return {
    learnerCompetency: input.learnerCompetency,
    competencyGap: comp.gap,
    adaptiveState: { learnerId: input.learnerId, competencyId: input.learnerCompetency.competencyId, currentTopicId: decision.targetTopicId, completedTopics: [], verifiedTopics: [], roadmap, currentAction: decision },
  };
}

export function applyVerificationEvidence(input: {
  snapshot: LoopSnapshot;
  evidence: Evidence;
  requiredLevel: number;
  topics: Topic[];
}): LoopSnapshot {
  const { snapshot, evidence } = input;
  const evidenceMatchesState = evidence.approved
    && evidence.learnerId === snapshot.adaptiveState.learnerId
    && evidence.competencyId === snapshot.learnerCompetency.competencyId;
  if (!evidenceMatchesState) return snapshot;

  const learnerCompetency = applyApprovedEvidence(snapshot.learnerCompetency, evidence);
  const updatedTopics = input.topics.map(topic => topic.id === evidence.topicId ? { ...topic, mastery: Math.max(topic.mastery, evidence.score) } : topic);
  const comp = calculateCompetencyState(learnerCompetency, input.requiredLevel);
  const gap = analyzeSkillGap(comp, updatedTopics);
  const verifiedTopics = [...new Set([...snapshot.adaptiveState.verifiedTopics, evidence.topicId])];
  const completedTopics = [...new Set([...snapshot.adaptiveState.completedTopics, evidence.topicId])];
  const decision = decideNextAction({ skillGap: gap, topics: updatedTopics, completedTopics, verifiedTopics });
  const roadmap: Roadmap = buildRoadmap(snapshot.adaptiveState.learnerId, learnerCompetency.competencyId, decision, updatedTopics, snapshot.adaptiveState.roadmap);
  return { learnerCompetency, competencyGap: comp.gap, adaptiveState: { ...snapshot.adaptiveState, currentTopicId: decision.targetTopicId, completedTopics, verifiedTopics, currentAction: decision, roadmap } };
}
