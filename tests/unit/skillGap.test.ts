import { describe, expect, it } from 'vitest';
import { analyzeSkillGap } from '../../src/services/skillGap/skillGapEngine';
import { initialTopics } from '../../src/data/topics/topics';

describe('skill-gap engine', () => {
  it('detects prerequisite gaps and priority', () => {
    const result = analyzeSkillGap(
      { competencyId: 'comp-python', currentLevel: 48, requiredLevel: 80, gap: 32, evidenceIds: [], updatedAt: 't0' },
      initialTopics,
    );
    expect(result.priority).toBe('CRITICAL');
    expect(result.blockingPrerequisiteIds).toContain('py-functions');
    expect(result.explanation).toContain('Python Functions');
  });

  it('keeps a concrete focus topic when a competency gap remains after all topics clear the weak threshold', () => {
    const strongTopics = initialTopics.map(topic =>
      topic.competencyId === 'comp-python' ? { ...topic, mastery: Math.max(topic.mastery, 75) } : topic,
    );
    const result = analyzeSkillGap(
      { competencyId: 'comp-python', currentLevel: 64, requiredLevel: 80, gap: 16, evidenceIds: [], updatedAt: 't1' },
      strongTopics,
    );
    expect(result.affectedTopicIds).toHaveLength(1);
    expect(result.affectedTopicIds[0]).toBe('py-functions');
    expect(result.explanation).toContain('16 points');
  });
});
