import type { SkillGapAnalysis } from '../../types/adaptive';
import type { CompetencyState } from '../../types/competency';
import type { Topic } from '../../types/topic';

export function analyzeSkillGap(
  competency: CompetencyState,
  topics: Topic[],
): SkillGapAnalysis {
  const relevant = topics.filter(t => t.competencyId === competency.competencyId).sort((a, b) => a.order - b.order);
  const affected = relevant.filter(t => t.mastery < 70);
  const blocking = new Set<string>();

  for (const topic of affected) {
    for (const prereq of topic.prerequisites) {
      const prerequisiteTopic = topics.find(t => t.id === prereq.topicId);
      if (prerequisiteTopic && prerequisiteTopic.mastery < prereq.requiredMastery) {
        blocking.add(prerequisiteTopic.id);
      }
    }
  }

  const priority = competency.gap >= 30 ? 'CRITICAL' : competency.gap >= 20 ? 'HIGH' : competency.gap >= 10 ? 'MEDIUM' : 'LOW';
  const firstAffected = affected[0];
  const firstBlocking = [...blocking][0];
  const explanation = firstBlocking
    ? `${firstAffected?.name ?? 'Target learning'} is constrained by insufficient mastery of ${topics.find(t => t.id === firstBlocking)?.name ?? firstBlocking}.`
    : competency.gap > 0
      ? `The learner remains ${competency.gap} points below the required competency and should address the weakest target topic.`
      : 'The required competency level has been reached.';

  return {
    competencyId: competency.competencyId,
    gap: competency.gap,
    affectedTopicIds: affected.map(t => t.id),
    blockingPrerequisiteIds: [...blocking],
    priority,
    explanation,
  };
}
