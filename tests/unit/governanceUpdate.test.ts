import { describe, expect, it } from 'vitest';
import { createProposal, reviewProposal } from '../../src/services/governance/governanceService';
import { applyApprovedGovernanceKnowledgeUpdate } from '../../src/services/governance/governanceKnowledgeUpdateService';
import { buildInitialAdaptiveState } from '../../src/services/adaptive/adaptiveLoopService';
import { governanceSources } from '../../src/data/governance/sources';
import { pythonCompetencyUpdateV2 } from '../../src/data/governance/pythonCompetencyUpdate';
import { sqlCompetencyUpdateV2 } from '../../src/data/governance/sqlCompetencyUpdate';
import { demoRole } from '../../src/data/roles/demoRole';
import { demoLearnerState } from '../../src/data/learners/demoLearner';
import { initialTopics } from '../../src/data/topics/topics';

describe('governed competency standard update', () => {
  it('does not apply before human approval and applies 80 → 85 plus one roadmap topic after approval', () => {
    const proposal = createProposal({
      id: 'p-v2',
      source: governanceSources[0],
      title: 'Python competency standard v2',
      proposedChange: '80 to 85 and add Python Testing & Validation',
      evidenceSummary: 'authorized update',
      aiConfidence: .87,
      fingerprint: pythonCompetencyUpdateV2.id,
      existing: [],
      at: 't0',
    });
    const learnerCompetency = structuredClone(demoLearnerState.competencies[0]);
    const adaptive = buildInitialAdaptiveState({ learnerId: 'learner-ananya', learnerCompetency, requiredLevel: 80, topics: initialTopics }).adaptiveState;

    expect(() => applyApprovedGovernanceKnowledgeUpdate({ proposal, update: pythonCompetencyUpdateV2, role: demoRole, topics: initialTopics, learnerCompetency, adaptiveState: adaptive })).toThrow(/approved human review/i);
    expect(demoRole.competencyRequirements.find(item => item.competencyId === 'comp-python')?.requiredLevel).toBe(80);
    expect(initialTopics.some(topic => topic.id === 'py-testing')).toBe(false);

    const reviewed = reviewProposal(proposal, { id: 'r-v2', proposalId: proposal.id, reviewerId: 'human-admin', decision: 'APPROVE', note: 'checked', reviewedAt: 't1' });
    const applied = applyApprovedGovernanceKnowledgeUpdate({ proposal: reviewed.proposal, update: pythonCompetencyUpdateV2, role: demoRole, topics: initialTopics, learnerCompetency, adaptiveState: adaptive });

    expect(applied.requiredLevel).toBe(85);
    expect(applied.role.competencyRequirements.find(item => item.competencyId === 'comp-python')?.requiredLevel).toBe(85);
    expect(applied.topics.filter(topic => topic.id === 'py-testing')).toHaveLength(1);
    expect(applied.adaptiveState.roadmap.version).toBe(2);
    expect(applied.adaptiveState.roadmap.steps.some(step => step.topicId === 'py-testing')).toBe(true);
  });

  it('does not apply SQL v2 before human approval and applies 78 → 83 plus one roadmap topic after approval', () => {
    const proposal = createProposal({
      id: 'sql-v2',
      source: governanceSources[1],
      title: 'SQL competency standard v2',
      proposedChange: '78 to 83 and add SQL Window Functions & Validation',
      evidenceSummary: 'authorized update',
      aiConfidence: .86,
      fingerprint: sqlCompetencyUpdateV2.id,
      existing: [],
      at: 't0',
    });
    const learnerCompetency = structuredClone(demoLearnerState.competencies.find(item => item.competencyId === 'comp-sql')!);
    const adaptive = buildInitialAdaptiveState({ learnerId: 'learner-ananya', learnerCompetency, requiredLevel: 78, topics: initialTopics }).adaptiveState;

    expect(() => applyApprovedGovernanceKnowledgeUpdate({ proposal, update: sqlCompetencyUpdateV2, role: demoRole, topics: initialTopics, learnerCompetency, adaptiveState: adaptive })).toThrow(/approved human review/i);
    expect(demoRole.competencyRequirements.find(item => item.competencyId === 'comp-sql')?.requiredLevel).toBe(78);
    expect(initialTopics.some(topic => topic.id === 'sql-window')).toBe(false);

    const reviewed = reviewProposal(proposal, { id: 'sql-r-v2', proposalId: proposal.id, reviewerId: 'human-admin', decision: 'APPROVE', note: 'checked', reviewedAt: 't1' });
    const applied = applyApprovedGovernanceKnowledgeUpdate({ proposal: reviewed.proposal, update: sqlCompetencyUpdateV2, role: demoRole, topics: initialTopics, learnerCompetency, adaptiveState: adaptive });

    expect(applied.requiredLevel).toBe(83);
    expect(applied.role.competencyRequirements.find(item => item.competencyId === 'comp-sql')?.requiredLevel).toBe(83);
    expect(applied.topics.filter(topic => topic.id === 'sql-window')).toHaveLength(1);
    expect(applied.adaptiveState.roadmap.version).toBe(2);
    expect(applied.adaptiveState.roadmap.steps.some(step => step.topicId === 'sql-window')).toBe(true);
  });

});
