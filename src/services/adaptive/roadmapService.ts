import type { AdaptiveDecision, Roadmap, RoadmapStep } from '../../types/adaptive';
import type { Topic } from '../../types/topic';

export function buildRoadmap(
  learnerId: string,
  competencyId: string,
  decision: AdaptiveDecision,
  topics: Topic[],
  previous?: Roadmap,
): Roadmap {
  const target = decision.targetTopicId ? topics.find(t => t.id === decision.targetTopicId) : undefined;
  const currentStep: RoadmapStep = {
    id: `step-${(previous?.version ?? 0) + 1}-current`,
    topicId: decision.targetTopicId,
    action: decision.action,
    label: target ? `${labelFor(decision.action)} — ${target.name}` : labelFor(decision.action),
    reason: decision.reason,
    status: decision.action === 'COMPLETE' ? 'COMPLETE' : 'CURRENT',
  };
  const upcoming = decision.action === 'COMPLETE' ? [] : [
    { id: `step-${(previous?.version ?? 0) + 1}-verify`, topicId: decision.targetTopicId, action: 'VERIFY' as const, label: 'Verify mastery', reason: 'Competency updates require approved verification evidence.', status: 'UPCOMING' as const },
    { id: `step-${(previous?.version ?? 0) + 1}-reassess`, action: 'REASSESS' as const, label: 'Recalculate competency path', reason: 'Recalculate the gap and choose the next adaptive action.', status: 'UPCOMING' as const },
  ];
  return {
    learnerId,
    competencyId,
    version: (previous?.version ?? 0) + 1,
    steps: [currentStep, ...upcoming],
    updatedAt: new Date().toISOString(),
  };
}

function labelFor(action: AdaptiveDecision['action']) {
  const labels: Record<AdaptiveDecision['action'], string> = {
    LEARN_TARGET: 'Learn target topic',
    REPAIR_PREREQUISITE: 'Repair prerequisite',
    PRACTICE: 'Practice and consolidate',
    VERIFY: 'Verify mastery',
    REASSESS: 'Reassess competency',
    COMPLETE: 'Competency requirement complete',
  };
  return labels[action];
}
