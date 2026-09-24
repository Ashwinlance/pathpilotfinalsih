import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import type { AssessmentAnswer, DiagnosticAssessment, Question } from '../../types/assessment';

export function InitialDiagnosticCard({
  assessment,
  answers,
  questions,
  topicNames,
  requiredLevel,
  onStart,
  onAnswer,
  onSubmit,
}: {
  assessment?: DiagnosticAssessment;
  answers: AssessmentAnswer[];
  questions: Question[];
  topicNames: Record<string, string>;
  requiredLevel: number;
  onStart: () => void;
  onAnswer: (questionId: string, selectedOptionIndex: number) => void;
  onSubmit: () => void;
}) {
  const selected = assessment?.questionIds
    .map(id => questions.find(question => question.id === id))
    .filter((question): question is Question => Boolean(question)) ?? [];
  const answered = answers.filter(answer => assessment?.questionIds.includes(answer.questionId)).length;

  return <div className="mx-auto max-w-4xl">
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700"><BrainCircuit size={24}/></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Initial diagnostic required</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-950">Measure knowledge before calculating the gap</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">PathPilot will use this short Python diagnostic to establish your current competency and topic mastery. Only after submission will it compare your score with the required level of {requiredLevel}, detect prerequisite blockers, and build the adaptive roadmap.</p>
          </div>
        </div>
        {!assessment && <button onClick={onStart} className="btn-primary shrink-0">Start 10-question diagnostic</button>}
      </div>

      {!assessment && <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Info title="10 questions" text="Python basics, functions, data structures and analysis."/>
        <Info title="Explainable score" text="Topic performance is weighted into the current competency."/>
        <Info title="Adaptive result" text="Gap and prerequisite analysis run only after diagnosis."/>
      </div>}

      {assessment && <div className="mt-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold text-slate-600">Initial Python competency diagnostic</span>
          <span className="text-xs font-extrabold text-slate-800">{answered}/{selected.length} answered</span>
        </div>
        {selected.map((question, index) => <div key={question.id} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Question {index + 1} · {topicNames[question.topicId] ?? question.topicId}</p>
            <span className="text-[11px] font-semibold text-slate-400">{question.difficulty}</span>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{question.prompt}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {question.options.map((option, optionIndex) => {
              const isSelected = answers.find(answer => answer.questionId === question.id)?.selectedOptionIndex === optionIndex;
              return <button key={optionIndex} type="button" onClick={() => onAnswer(question.id, optionIndex)} className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${isSelected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                {String.fromCharCode(65 + optionIndex)}. {option}
              </button>;
            })}
          </div>
        </div>)}
        <button onClick={onSubmit} disabled={selected.length === 0 || answered !== selected.length} className="btn-primary"><CheckCircle2 size={16}/> Calculate my competency gap</button>
        <p className="text-xs leading-5 text-slate-500">This initial diagnostic is the explicit entry point into adaptation. The later independent 15-MCQ assessment remains diagnostic-only and does not silently modify the adaptive state.</p>
      </div>}
    </div>
  </div>;
}

function Info({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>;
}
