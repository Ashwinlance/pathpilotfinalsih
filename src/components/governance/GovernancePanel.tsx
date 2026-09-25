import { FileCheck2, UserCheck, Bot, ArrowUpRight, BookOpenCheck } from 'lucide-react';
import type { AuditRecord, GovernanceProposal } from '../../types/governance';

export function GovernancePanel({
  proposals,
  audit,
  pythonKnowledgeVersion,
  pythonRequiredLevel,
  pythonGovernedTopicApplied,
  onCreate,
  onReview,
}: {
  proposals: GovernanceProposal[];
  audit: AuditRecord[];
  pythonKnowledgeVersion: number;
  pythonRequiredLevel: number;
  pythonGovernedTopicApplied: boolean;
  onCreate: () => void;
  onReview: (d: 'APPROVE' | 'REJECT') => void;
}) {
  const latest = proposals.at(-1);
  return <div>
    <div className="grid gap-3 md:grid-cols-3">
      <GovStep icon={<Bot size={18}/>} title="AI-assisted proposal" text="Extract and analyze from authorized material."/>
      <GovStep icon={<UserCheck size={18}/>} title="Human review" text="AI cannot self-approve institutional knowledge."/>
      <GovStep icon={<FileCheck2 size={18}/>} title="Audited update" text="Approved versions create a review trail."/>
    </div>

    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Status label="Python standard" value={`Version ${pythonKnowledgeVersion} · ${pythonRequiredLevel}%`}/>
      <Status label="Python governed topic" value={pythonGovernedTopicApplied ? 'Python Testing & Validation' : 'Not added yet'}/>
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      <button className="btn-primary" onClick={onCreate}>Generate Python v2 proposal</button>
      {latest?.status === 'PENDING_REVIEW' && <>
        <button className="btn-secondary" onClick={() => onReview('APPROVE')}>Approve as reviewer</button>
        <button className="btn-secondary" onClick={() => onReview('REJECT')}>Reject</button>
      </>}
    </div>

    {latest && <div className="mt-4 rounded-xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold text-slate-900">{latest.title}</p>
        <span className="text-xs font-bold text-slate-500">{latest.status.replace('_', ' ')}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{latest.proposedChange}</p>
      <p className="mt-2 text-xs text-slate-500">AI confidence: {Math.round(latest.aiConfidence * 100)}% · human approval still required</p>
      {latest.status === 'PENDING_REVIEW' && <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-800"><ArrowUpRight size={15} className="mt-0.5 shrink-0"/><span>Proposed impact only: Python remains at 80% until a human reviewer approves. Approval raises the required level to 85% and adds Python Testing & Validation to the governed learner roadmap.</span></div>}
      {latest.status === 'APPROVED' && <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><BookOpenCheck size={15} className="mt-0.5 shrink-0"/><span>Applied: Python requirement is now 85% and Python Testing & Validation has been added to the governed learner roadmap.</span></div>}
    </div>}
    {audit.length > 0 && <p className="mt-3 text-xs text-slate-500">Audit records: {audit.length}. Latest action: {audit.at(-1)?.action} by {audit.at(-1)?.actorId}.</p>}
  </div>;
}

function GovStep({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="mb-2 text-slate-700">{icon}</div><p className="text-sm font-bold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>;
}

function Status({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-extrabold text-slate-900">{value}</p></div>;
}
