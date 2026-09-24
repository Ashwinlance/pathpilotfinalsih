import { describe, expect, it } from 'vitest';
import { createProposal, reviewProposal } from '../../src/services/governance/governanceService';
import { governanceSources } from '../../src/data/governance/sources';

describe('governance', () => {
  it('requires a human reviewer and blocks AI self-approval', () => {
    const p = createProposal({ id: 'p1', source: governanceSources[0], title: 'x', proposedChange: 'y', evidenceSummary: 'z', aiConfidence: .9, fingerprint: 'f1', existing: [], at: 't0' });
    expect(p.status).toBe('PENDING_REVIEW');
    expect(() => reviewProposal(p, { id: 'r1', proposalId: 'p1', reviewerId: 'ai-reviewer', decision: 'APPROVE', note: '', reviewedAt: 't1' })).toThrow(/AI cannot self-approve/);
    const reviewed = reviewProposal(p, { id: 'r2', proposalId: 'p1', reviewerId: 'human-admin', decision: 'APPROVE', note: 'checked', reviewedAt: 't1' });
    expect(reviewed.proposal.status).toBe('APPROVED'); expect(reviewed.audit.actorId).toBe('human-admin');
  });
});
