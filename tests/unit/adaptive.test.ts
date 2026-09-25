import { describe, expect, it } from 'vitest';
import { decideNextAction } from '../../src/services/adaptive/adaptiveDecisionEngine';
import { buildRoadmap } from '../../src/services/adaptive/roadmapService';
import { initialTopics } from '../../src/data/topics/topics';

describe('adaptive engine and roadmap', () => {
  it('repairs a blocking prerequisite before target learning', () => {
    const decision = decideNextAction({
      skillGap: {
        competencyId: 'comp-python',
        gap: 32,
        affectedTopicIds: ['py-data'],
        blockingPrerequisiteIds: ['py-functions'],
        priority: 'CRITICAL',
        explanation: 'blocked',
      },
      topics: initialTopics,
      completedTopics: [],
      verifiedTopics: [],
    });
    expect(decision.action).toBe('REPAIR_PREREQUISITE');
    expect(decision.targetTopicId).toBe('py-functions');
    const roadmap = buildRoadmap('l1', 'comp-python', decision, initialTopics);
    expect(roadmap.steps[0].action).toBe('REPAIR_PREREQUISITE');
  });

  it('does not leave a remaining competency gap without a target topic', () => {
    const decision = decideNextAction({
      skillGap: {
        competencyId: 'comp-python',
        gap: 16,
        affectedTopicIds: ['py-analysis'],
        blockingPrerequisiteIds: [],
        priority: 'MEDIUM',
        explanation: 'remaining gap',
      },
      topics: initialTopics,
      completedTopics: [],
      verifiedTopics: [],
    });
    expect(decision.action).toBe('LEARN_TARGET');
    expect(decision.targetTopicId).toBe('py-analysis');
  });
});
