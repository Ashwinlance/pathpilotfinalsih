import { ClipboardCheck, RotateCcw, Target } from 'lucide-react';
import type { Assessment, AssessmentAnswer, AssessmentGuidance, AssessmentResult, Question } from '../../types/assessment';

export function AssessmentCard({
  assessment,
  answers,
  result,
  guidance,
  questions,
  poolSize,
  topicNames,
  onStart,
  onAnswer,
  onSubmit,
}: {
  assessment?: Assessment;
  answers: AssessmentAnswer[];
  result?: AssessmentResult;
  guidance?: AssessmentGuidance;
  questions: Question[];
  poolSize: number;
  topicNames: Record<string, string>;
  onStart: () => void;
  onAnswer: (questionId: string, selectedOptionIndex: number) => void;
  onSubmit: () => void;
}) {
  const selectedQuestions = assessment?.questionIds.map(id => questions.find(question => question.id === id)).filter((question): question is Question => Boolean(question)) ?? [];
  const answered = answers.filter(answer => assessment?.questionIds.includes(answer.questionId)).length;

  return <div>
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700"><ClipboardCheck size={21}/></div>
      <div><p className="font-bold text-slate-900">Independent 15-question dynamic diagnostic</p><p className="mt-1 text-sm text-slate-500">15 questions are selected from the currently published {poolSize}-question pool. Assessment is isolated from adaptive state and competency updates.</p></div>
    </div>

    {!assessment && <button onClick={onStart} className="btn-secondary mt-4">Start 15 dynamic MCQs</button>}

    {assessment && !result && <div className="mt-5 space-y-5">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"><span className="text-xs font-semibold text-slate-600">Attempt: {assessment.id}</span><span className="text-xs font-bold text-slate-700">{answered}/15 answered</span></div>
      {selectedQuestions.map((question, index) => <div key={question.id} className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Question {index + 1} · {topicNames[question.topicId] ?? question.topicId}</p><span className="text-[11px] font-semibold text-slate-400">{question.difficulty}</span></div>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{question.prompt}</p>
        <div className="mt-3 grid gap-2">
          {question.options.map((option, optionIndex) => {
            const selected = answers.find(answer => answer.questionId === question.id)?.selectedOptionIndex === optionIndex;
            return <button key={optionIndex} type="button" onClick={() => onAnswer(question.id, optionIndex)} className={`rounded-lg border px-3 py-2 text-left text-sm transition ${selected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>{String.fromCharCode(65 + optionIndex)}. {option}</button>;
          })}
        </div>
      </div>)}
      <button onClick={onSubmit} disabled={answered !== selectedQuestions.length || selectedQuestions.length !== 15} className="btn-primary">Submit assessment</button>
    </div>}

    {result && <div className="mt-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div className="flex items-end gap-2"><span className="text-3xl font-extrabold text-slate-900">{result.score}%</span><span className="pb-1 text-xs font-semibold text-slate-500">overall score</span></div><button onClick={onStart} className="btn-secondary"><RotateCcw size={14}/> New 15-question set</button></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">{result.topicAnalysis.map(topic => <div key={topic.topicId} className="rounded-lg border border-slate-200 p-3"><p className="text-xs font-semibold text-slate-800">{topicNames[topic.topicId] ?? topic.topicId}</p><p className="mt-1 text-xs text-slate-500">{topic.correct}/{topic.total} correct · {topic.percentage}%</p><p className={`mt-1 text-xs font-bold ${topic.strength === 'PRIORITY_GAP' ? 'text-rose-600' : topic.strength === 'DEVELOPING' ? 'text-amber-600' : 'text-emerald-600'}`}>{topic.strength.replace('_', ' ')}</p></div>)}</div>
      {guidance && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-2"><Target size={18} className="mt-0.5 shrink-0 text-amber-700"/><div><p className="font-bold text-amber-950">Weak topics & target learning</p><p className="mt-1 text-xs leading-5 text-amber-800">{guidance.summary}</p></div></div>{guidance.targets.length > 0 && <div className="mt-3 space-y-2">{guidance.targets.map((target, index) => <div key={target.topicId} className="rounded-lg bg-white p-3 ring-1 ring-amber-200"><div className="flex items-center justify-between gap-2"><p className="text-sm font-bold text-slate-900">{index + 1}. {target.topicName}</p><span className="text-xs font-bold text-amber-700">{target.percentage}%</span></div><p className="mt-1 text-xs text-slate-500">{target.reason}</p><p className="mt-2 text-xs font-semibold text-slate-700">Target learning: {target.moduleTitle ?? 'No mapped module yet'}</p></div>)}</div>}<p className="mt-3 text-[11px] font-semibold text-amber-700">Diagnostic guidance only — this assessment does not change competency, unlock lessons, or alter the adaptive roadmap.</p></div>}
    </div>}
  </div>;
}
