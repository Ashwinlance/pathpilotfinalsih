import { describe, expect, it } from 'vitest';
import { analyzeSkillGap } from '../../src/services/skillGap/skillGapEngine';
import { initialTopics } from '../../src/data/topics/topics';

describe('skill-gap engine', () => {
  it('detects prerequisite gaps and priority', () => {
    const result = analyzeSkillGap({ competencyId: 'comp-python', currentLevel: 48, requiredLevel: 80, gap: 32, evidenceIds: [], updatedAt: 't0' }, initialTopics);
    expect(result.priority).toBe('CRITICAL'); expect(result.blockingPrerequisiteIds).toContain('py-functions'); expect(result.explanation).toContain('Python Functions');
  });
});
