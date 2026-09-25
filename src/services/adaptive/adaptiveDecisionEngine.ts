import type { AdaptiveDecision, SkillGapAnalysis } from '../../types/adaptive';
import type { Topic } from '../../types/topic';

export interface AdaptiveDecisionInput {
  skillGap: SkillGapAnalysis;
  topics: Topic[];
  completedTopics: string[];
  verifiedTopics: string[];
}

export function decideNextAction(input: AdaptiveDecisionInput): AdaptiveDecision {
  const { skillGap, topics, completedTopics, verifiedTopics } = input;
  if (skillGap.gap <= 0) {
    return { action: 'COMPLETE', reason: 'Required competency level has been reached.', expectedOutcome: 'Maintain demonstrated competency.' };
  }

  const blockerId = skillGap.blockingPrerequisiteIds[0];
  if (blockerId) {
    return {
      action: 'REPAIR_PREREQUISITE',
      targetTopicId: blockerId,
      prerequisiteTopicId: blockerId,
      reason: `Learner has insufficient prerequisite competency in ${topicName(topics, blockerId)}.`,
      expectedOutcome: 'Improve prerequisite mastery before advancing.',
    };
  }

  const targetIds = skillGap.affectedTopicIds;
  const targetId = targetIds.find(id => !verifiedTopics.includes(id)) ?? targetIds[0];
  if (!targetId) {
    return { action: 'REASSESS', reason: 'Competency gap exists but no topic evidence is available.', expectedOutcome: 'Collect fresh evidence to localize the remaining gap.' };
  }
  if (!completedTopics.includes(targetId)) {
    return { action: 'LEARN_TARGET', targetTopicId: targetId, reason: `${topicName(topics, targetId)} is the highest-priority unresolved topic.`, expectedOutcome: 'Build target knowledge before verification.' };
  }
  if (!verifiedTopics.includes(targetId)) {
    return { action: 'VERIFY', targetTopicId: targetId, reason: 'Learning is complete, but mastery has not been verified.', expectedOutcome: 'Produce approved evidence before competency changes.' };
  }
  return { action: 'PRACTICE', targetTopicId: targetId, reason: `${topicName(topics, targetId)} is currently the lowest-mastered available topic while the overall competency gap remains.`, expectedOutcome: 'Reinforce the weakest current topic and collect fresh verification evidence.' };
}

function topicName(topics: Topic[], id: string) {
  return topics.find(t => t.id === id)?.name ?? id;
}
