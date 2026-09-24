import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { LearnerState } from '../../types/learner';
import type { Role } from '../../types/role';
import type { Competency } from '../../types/competency';

export function CompetencyChart({ learnerState, role, competencies }: { learnerState: LearnerState; role: Role; competencies: Competency[] }) {
  const data = role.competencyRequirements.map(req => ({
    name: competencies.find(c => c.id === req.competencyId)?.name.replace(' Programming', '') ?? req.competencyId,
    Current: learnerState.competencies.find(c => c.competencyId === req.competencyId)?.currentLevel ?? 0,
    Required: req.requiredLevel,
  }));
  return <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ left: -18, right: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={11} /><YAxis domain={[0, 100]} fontSize={11} /><Tooltip /><Bar dataKey="Current" fill="#2563eb" radius={[5, 5, 0, 0]} /><Bar dataKey="Required" fill="#cbd5e1" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
