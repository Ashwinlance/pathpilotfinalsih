import type { AuditRecord, GovernanceProposal, GovernanceReview, GovernanceSource } from '../../types/governance';

export function createProposal(input: {
  id: string;
  source: GovernanceSource;
  title: string;
  proposedChange: string;
  evidenceSummary: string;
  aiConfidence: number;
  fingerprint: string;
  existing: GovernanceProposal[];
  at?: string;
}): GovernanceProposal {
  if (!input.source.authorized || !input.source.available) throw new Error('Source must be authorized and available.');
  if (input.existing.some(p => p.fingerprint === input.fingerprint && p.status !== 'REJECTED')) throw new Error('Duplicate proposal detected.');
  return {
    id: input.id,
    sourceId: input.source.id,
    title: input.title,
    proposedChange: input.proposedChange,
    evidenceSummary: input.evidenceSummary,
    aiConfidence: Math.max(0, Math.min(1, input.aiConfidence)),
    fingerprint: input.fingerprint,
    status: 'PENDING_REVIEW',
    createdAt: input.at ?? new Date().toISOString(),
  };
}

export function reviewProposal(
  proposal: GovernanceProposal,
  review: GovernanceReview,
): { proposal: GovernanceProposal; audit: AuditRecord } {
  if (proposal.status !== 'PENDING_REVIEW') throw new Error('Only pending proposals can be reviewed.');
  if (!review.reviewerId || review.reviewerId.toLowerCase().includes('ai')) throw new Error('AI cannot self-approve governance changes.');
  const status = review.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  return {
    proposal: { ...proposal, status },
    audit: {
      id: `audit-${review.id}`,
      actorId: review.reviewerId,
      action: review.decision,
      entityType: 'GovernanceProposal',
      entityId: proposal.id,
      detail: review.note,
      at: review.reviewedAt,
    },
  };
}
