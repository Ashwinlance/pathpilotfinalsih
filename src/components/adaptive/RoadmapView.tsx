import { CheckCircle2, CircleDot, Clock3 } from 'lucide-react';
import type { Roadmap } from '../../types/adaptive';

export function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  return <div className="space-y-3">{roadmap.steps.map((step, index) => <div key={step.id} className="flex gap-3"><div className="mt-0.5">{step.status === 'COMPLETE' ? <CheckCircle2 className="text-emerald-600" size={19}/> : step.status === 'CURRENT' ? <CircleDot className="text-blue-600" size={19}/> : <Clock3 className="text-slate-400" size={19}/>}</div><div className="flex-1 border-b border-slate-100 pb-3"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-900">{index + 1}. {step.label}</p><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{step.status}</span></div><p className="mt-1 text-xs leading-5 text-slate-500">{step.reason}</p></div></div>)}</div>;
}
