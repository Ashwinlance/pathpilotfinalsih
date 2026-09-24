import { BrainCircuit, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatAction } from '../../utils/format';
import type { AdaptiveState } from '../../types/adaptive';
import type { Topic } from '../../types/topic';

export function ReasoningPanel({ state, topics }: { state: AdaptiveState; topics: Topic[] }) {
  const topic = topics.find(t => t.id === state.currentAction.targetTopicId);
  return <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/70 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><div className="rounded-xl bg-blue-700 p-2.5 text-white"><BrainCircuit size={22} /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Why PathPilot chose this learning action</p><h2 className="mt-1 text-xl font-extrabold text-slate-950">{formatAction(state.currentAction.action)}</h2></div></div><Badge tone="blue">Explainable decision</Badge></div>
    <p className="mt-4 text-sm leading-6 text-slate-700">{state.currentAction.reason}</p>
    <div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-xl bg-white p-3"><p className="text-xs text-slate-500">Target</p><p className="mt-1 font-semibold text-slate-900">{topic?.name ?? 'Competency complete'}</p></div><div className="rounded-xl bg-white p-3"><p className="text-xs text-slate-500">Expected outcome</p><p className="mt-1 font-semibold text-slate-900">{state.currentAction.expectedOutcome}</p></div><div className="rounded-xl bg-white p-3"><p className="flex items-center gap-1 text-xs text-slate-500"><ShieldCheck size={14}/> Control</p><p className="mt-1 font-semibold text-slate-900">Evidence required before update</p></div></div>
    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-700"><span>Diagnose</span><ArrowRight size={14}/><span>Gap</span><ArrowRight size={14}/><span>Prerequisite</span><ArrowRight size={14}/><span>Adapt</span></div>
  </div>;
}
