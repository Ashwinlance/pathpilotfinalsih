import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import type { DiagnosticResult } from '../../types/assessment';
import { Badge } from '../common/Badge';

export function DiagnosticResultCard({
  result,
  topicNames,
  requiredLevel,
}: {
  result: DiagnosticResult;
  topicNames: Record<string, string>;
  requiredLevel: number;
}) {
  const ordered = [...result.topicAnalysis].sort((a, b) => a.percentage - b.percentage);
  const weakest = ordered[0];

  return <section className="rounded-2xl border border-slate-200 bg-white shadow-panel">
    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><BrainCircuit size={20}/></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Assessment & competency diagnosis</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-950">Initial diagnostic completed</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">This assessment established the learner baseline before PathPilot calculated the knowledge gap and adaptive roadmap.</p>
        </div>
      </div>
      <Badge tone="green"><CheckCircle2 size={13}/> Completed</Badge>
    </div>

    <div className="grid gap-4 p-5 lg:grid-cols-3">
      <div className="rounded-xl bg-slate-950 p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Calculated competency</p>
        <p className="mt-2 text-4xl font-black">{result.score}%</p>
        <p className="mt-2 text-xs text-slate-300">Required level: {requiredLevel}%</p>
      </div>

      <div className="rounded-xl border border-slate-200 p-4 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-extrabold text-slate-900">Topic performance</p>
          {weakest && <Badge tone="amber">Weakest: {topicNames[weakest.topicId] ?? weakest.topicId}</Badge>}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {result.topicAnalysis.map(item => <div key={item.topicId} className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-700">{topicNames[item.topicId] ?? item.topicId}</p>
              <span className="text-xs font-extrabold text-slate-900">{item.percentage}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-slate-800" style={{ width: `${Math.max(0, Math.min(100, item.percentage))}%` }}/></div>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
