import type { AdaptiveState } from '../../types/adaptive';
import type { GovernanceProposal } from '../../types/governance';
import type { LearnerCompetency } from '../../types/learner';
import type { Role } from '../../types/role';
import type { Topic } from '../../types/topic';
import type { GovernedCompetencyUpdate } from '../../data/governance/pythonCompetencyUpdate';
import { calculateCompetencyState } from '../competency/competencyEngine';
import { analyzeSkillGap } from '../skillGap/skillGapEngine';
import { decideNextAction } from '../adaptive/adaptiveDecisionEngine';
import { addGovernedRequirementStep, buildRoadmap } from '../adaptive/roadmapService';

export interface AppliedGovernanceKnowledgeUpdate {
  role: Role;
  topics: Topic[];
  adaptiveState: AdaptiveState;
  requiredLevel: number;
}

export function applyApprovedGovernanceKnowledgeUpdate(input: {
  proposal: GovernanceProposal;
  update: GovernedCompetencyUpdate;
  role: Role;
  topics: Topic[];
  learnerCompetency: LearnerCompetency;
  adaptiveState: AdaptiveState;
}): AppliedGovernanceKnowledgeUpdate {
  const { proposal, update } = input;
  if (proposal.status !== 'APPROVED') throw new Error('Governance update requires an approved human review.');
  if (input.role.id !== update.roleId) throw new Error('Governance update does not target the active role.');
  if (input.learnerCompetency.competencyId !== update.competencyId) throw new Error('Governance update does not target the active competency.');

  const requirementExists = input.role.competencyRequirements.some(item => item.competencyId === update.competencyId);
  if (!requirementExists) throw new Error('Target competency requirement was not found on the role.');

  const role: Role = {
    ...input.role,
    competencyRequirements: input.role.competencyRequirements.map(item =>
      item.competencyId === update.competencyId
        ? { ...item, requiredLevel: Math.max(item.requiredLevel, update.requiredLevel) }
        : item,
    ),
  };

  const topicAlreadyExists = input.topics.some(topic => topic.id === update.topic.id);
  const topics = topicAlreadyExists ? input.topics : [...input.topics, structuredClone(update.topic)];
  const requiredLevel = role.competencyRequirements.find(item => item.competencyId === update.competencyId)!.requiredLevel;
  const competency = calculateCompetencyState(input.learnerCompetency, requiredLevel);
  const skillGap = analyzeSkillGap(competency, topics);
  const decision = decideNextAction({
    skillGap,
    topics,
    completedTopics: input.adaptiveState.completedTopics,
    verifiedTopics: input.adaptiveState.verifiedTopics,
  });
  let roadmap = buildRoadmap(
    input.adaptiveState.learnerId,
    update.competencyId,
    decision,
    topics,
    input.adaptiveState.roadmap,
  );
  roadmap = addGovernedRequirementStep(
    roadmap,
    update.topic,
    `Added by approved competency standard v${update.version}; PathPilot will schedule it when prerequisite readiness allows.`,
  );

  return {
    role,
    topics,
    requiredLevel,
    adaptiveState: {
      ...input.adaptiveState,
      currentTopicId: decision.targetTopicId,
      currentAction: decision,
      roadmap,
    },
  };
}
