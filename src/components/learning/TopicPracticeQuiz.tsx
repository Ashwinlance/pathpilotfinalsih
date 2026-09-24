import { CheckCircle2, CircleHelp, RotateCcw } from 'lucide-react';
import type { TopicPracticeAnswer, TopicPracticeQuestion, TopicPracticeResult } from '../../types/learning';

export function TopicPracticeQuiz({
  questions,
  answers,
  result,
  onAnswer,
  onSubmit,
  onRetry,
}: {
  questions: TopicPracticeQuestion[];
  answers: TopicPracticeAnswer[];
  result?: TopicPracticeResult;
  onAnswer: (questionId: string, selectedOptionIndex: number) => void;
  onSubmit: () => void;
  onRetry: () => void;
}) {
  if (questions.length === 0) return null;

  const answerMap = new Map(answers.map(answer => [answer.questionId, answer.selectedOptionIndex]));
  const allAnswered = questions.every(question => answerMap.has(question.id));

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white p-2 text-slate-700 shadow-sm"><CircleHelp size={18}/></div>
        <div>
          <p className="font-bold text-slate-900">Topic practice · {questions.length} MCQs</p>
          <p className="mt-1 text-xs text-slate-500">Answer all 5 questions after learning. Score at least 70% (4/5) to create approved verification evidence and update competency.</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {questions.map((question, questionIndex) => {
          const selected = answerMap.get(question.id);
          return (
            <fieldset key={question.id} disabled={Boolean(result)} className="rounded-xl border border-slate-200 bg-white p-3">
              <legend className="px-1 text-sm font-bold text-slate-900">{questionIndex + 1}. {question.prompt}</legend>
              <div className="mt-3 grid gap-2">
                {question.options.map((option, optionIndex) => (
                  <label key={option} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition ${selected === optionIndex ? 'border-slate-900 bg-slate-50 text-slate-950' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      name={question.id}
                      checked={selected === optionIndex}
                      onChange={() => onAnswer(question.id, optionIndex)}
                      className="mt-0.5"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>

      {!result && (
        <button type="button" onClick={onSubmit} disabled={!allAnswered} className="btn-primary mt-4">
          <CheckCircle2 size={16}/> Submit 5-question practice
        </button>
      )}

      {result && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Practice result</p>
            <p className="mt-1 text-lg font-extrabold text-slate-950">{result.correct}/{result.total} correct · {result.score}%</p>
            <p className="mt-1 text-xs text-slate-500">A passing score is verified through PathPilot's evidence service. Below 70% does not change competency; retry the MCQs.</p>
          </div>
          <button type="button" onClick={onRetry} className="btn-secondary"><RotateCcw size={15}/> Retry MCQs</button>
        </div>
      )}
    </div>
  );
}
