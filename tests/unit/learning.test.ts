import { describe, expect, it } from 'vitest';
import { completeLearning, startLearning, verifyLearning } from '../../src/services/learning/learningService';

describe('learning and verification', () => {
  it('separates completion from verification', () => { const state = completeLearning(startLearning('m1', 't0'), 't1'); expect(state.completedAt).toBe('t1'); expect(state.verificationStatus).toBe('PENDING'); });
  it('creates evidence only for a passing verification', () => {
    const fail = verifyLearning({ learnerId: 'l', competencyId: 'c', topicId: 't', moduleId: 'm', score: 69, at: 'x' });
    const pass = verifyLearning({ learnerId: 'l', competencyId: 'c', topicId: 't', moduleId: 'm', score: 86, at: 'y' });
    expect(fail.evidence).toBeUndefined(); expect(pass.verification.status).toBe('PASSED'); expect(pass.evidence?.approved).toBe(true);
  });
});
