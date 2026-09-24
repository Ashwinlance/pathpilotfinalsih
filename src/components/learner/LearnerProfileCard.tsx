import { BriefcaseBusiness, GraduationCap, IdCard, Mail, Route, Target } from 'lucide-react';
import type { Learner } from '../../types/learner';
import type { Role, RoleSkillReadiness } from '../../types/role';
import type { Competency } from '../../types/competency';
import { Badge } from '../common/Badge';

export function LearnerProfileCard({
  learner,
  currentRole,
  targetRole,
  competencies,
  readiness,
}: {
  learner: Learner;
  currentRole: Role;
  targetRole: Role;
  competencies: Competency[];
  readiness?: RoleSkillReadiness[];
}) {
  const readinessById = new Map((readiness ?? []).map(item => [item.competencyId, item]));
  const competencyById = new Map(competencies.map(item => [item.id, item]));

  return <section className="rounded-2xl border border-slate-200 bg-white shadow-panel">
    <div className="border-b border-slate-100 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Learner profile & role readiness</p>
      <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">{learner.name}</h2>
          <p className="mt-1 text-sm text-slate-500">PathPilot keeps learner identity, current role and target-role requirements together so every gap is role-specific.</p>
        </div>
        <Badge tone="blue">{learner.careerTrack}</Badge>
      </div>
    </div>

    <div className="grid gap-5 p-5 xl:grid-cols-3">
      <div className="space-y-3 rounded-xl bg-slate-50 p-4">
        <ProfileRow icon={<IdCard size={16}/>} label="Student ID" value={learner.studentId}/>
        <ProfileRow icon={<Mail size={16}/>} label="Email" value={learner.email}/>
        <ProfileRow icon={<GraduationCap size={16}/>} label="Career track" value={learner.careerTrack}/>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 p-4">
        <ProfileRow icon={<BriefcaseBusiness size={16}/>} label="Current role" value={currentRole.name}/>
        <p className="text-xs leading-5 text-slate-500">{currentRole.description}</p>
        <div className="border-t border-slate-100 pt-3">
          <ProfileRow icon={<Target size={16}/>} label="Target role" value={targetRole.name}/>
          <p className="mt-2 text-xs leading-5 text-slate-500">{targetRole.description}</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Route size={17} className="text-blue-700"/>Role transition</div>
        <p className="mt-2 text-sm font-semibold text-slate-800">{currentRole.name} → {targetRole.name}</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">Required skills below come from the selected target role. Approved governance updates automatically change these requirements without changing learner evidence.</p>
      </div>
    </div>

    <div className="border-t border-slate-100 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-extrabold text-slate-950">Required skills for {targetRole.name}</p><p className="mt-1 text-xs text-slate-500">Current level appears only after the learner has completed the initial diagnostic.</p></div>
        {!readiness && <Badge tone="amber">Diagnostic pending</Badge>}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400"><th className="pb-2 pr-4">Skill</th><th className="pb-2 pr-4">Current</th><th className="pb-2 pr-4">Required</th><th className="pb-2 pr-4">Gap</th><th className="pb-2">Status</th></tr></thead>
          <tbody>{targetRole.competencyRequirements.map(requirement => {
            const item = readinessById.get(requirement.competencyId);
            const name = competencyById.get(requirement.competencyId)?.name ?? requirement.competencyId;
            return <tr key={requirement.competencyId} className="border-b border-slate-100 last:border-0">
              <td className="py-3 pr-4 font-bold text-slate-800">{name}</td>
              <td className="py-3 pr-4 font-semibold text-slate-700">{item ? `${item.currentLevel}%` : 'Pending'}</td>
              <td className="py-3 pr-4 font-semibold text-slate-900">{requirement.requiredLevel}%</td>
              <td className="py-3 pr-4 font-semibold text-slate-700">{item ? `${item.gap} pts` : '—'}</td>
              <td className="py-3">{item ? <StatusBadge status={item.status}/> : <Badge tone="amber">Not diagnosed</Badge>}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  </section>;
}

function ProfileRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-slate-400">{icon}</span><div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p></div></div>;
}

function StatusBadge({ status }: { status: RoleSkillReadiness['status'] }) {
  if (status === 'READY') return <Badge tone="green">Ready</Badge>;
  if (status === 'DEVELOPING') return <Badge tone="blue">Developing</Badge>;
  return <Badge tone="amber">Priority gap</Badge>;
}
