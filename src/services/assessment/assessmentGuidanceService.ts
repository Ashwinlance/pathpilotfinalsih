import type { AssessmentGuidance, AssessmentResult } from '../../types/assessment';
import type { LearningModule } from '../../types/learning';
import type { Topic } from '../../types/topic';

export function buildAssessmentGuidance(input: {
  result: AssessmentResult;
  topics: Topic[];
  modules: LearningModule[];
}): AssessmentGuidance {
  const ranked = [...input.result.topicAnalysis]
    .filter(item => item.strength !== 'STRONG')
    .sort((a, b) => a.percentage - b.percentage);

  const targets = ranked.map(item => {
    const topic = input.topics.find(candidate => candidate.id === item.topicId);
    const module = input.modules.find(candidate => candidate.topicId === item.topicId);
    const topicName = topic?.name ?? item.topicId;
    return {
      topicId: item.topicId,
      topicName,
      percentage: item.percentage,
      strength: item.strength,
      moduleId: module?.id,
      moduleTitle: module?.title,
      reason: `${topicName} scored ${item.percentage}% in the independent assessment, so it is highlighted for focused learning.`,
    };
  });

  return {
    targets,
    summary: targets.length
      ? `Focus first on ${targets[0].topicName}. This is assessment guidance only and does not alter the adaptive roadmap or competency state.`
      : 'No weak topic was detected in this assessment. The adaptive roadmap remains independent.',
  };
}
