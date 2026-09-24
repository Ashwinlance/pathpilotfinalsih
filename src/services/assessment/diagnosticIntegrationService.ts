import type { DiagnosticResult } from '../../types/assessment';
import type { LearnerCompetency } from '../../types/learner';
import type { Topic } from '../../types/topic';

export function initializeCompetencyFromDiagnostic(input: {
  learnerCompetency: LearnerCompetency;
  result: DiagnosticResult;
  topics: Topic[];
}): { learnerCompetency: LearnerCompetency; topics: Topic[] } {
  if (input.learnerCompetency.competencyId !== input.result.competencyId) {
    throw new Error('Diagnostic result cannot initialize a different competency.');
  }

  const learnerCompetency: LearnerCompetency = {
    ...input.learnerCompetency,
    currentLevel: input.result.score,
    updatedAt: input.result.completedAt,
  };

  const topicPercentages = new Map(input.result.topicAnalysis.map(topic => [topic.topicId, topic.percentage]));
  const topics = input.topics.map(topic => {
    const percentage = topicPercentages.get(topic.id);
    return percentage === undefined ? topic : { ...topic, mastery: percentage };
  });

  return { learnerCompetency, topics };
}
