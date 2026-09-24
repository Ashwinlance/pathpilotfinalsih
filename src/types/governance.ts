export interface GovernanceSource {
  id: string;
  title: string;
  url: string;
  authorized: boolean;
  available: boolean;
  version: string;
}

export type ProposalStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface GovernanceProposal {
  id: string;
  sourceId: string;
  title: string;
  proposedChange: string;
  evidenceSummary: string;
  aiConfidence: number;
  fingerprint: string;
  status: ProposalStatus;
  createdAt: string;
}

export interface GovernanceReview {
  id: string;
  proposalId: string;
  reviewerId: string;
  decision: 'APPROVE' | 'REJECT';
  note: string;
  reviewedAt: string;
}

export interface AuditRecord {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
  at: string;
}
