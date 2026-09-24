import { BookOpenCheck, CircleCheckBig, FlaskConical } from 'lucide-react';
import type { LearningModule, LearningState, TopicPracticeAnswer, TopicPracticeQuestion, TopicPracticeResult } from '../../types/learning';
import { TopicPracticeQuiz } from './TopicPracticeQuiz';

export function LearningActionCard({
  module,
  state,
  practiceQuestions,
  practiceAnswers,
  practiceResult,
  onStart,
  onComplete,
  onPracticeAnswer,
  onPracticeSubmit,
  onPracticeRetry,
  onVerify,
}: {
  module?: LearningModule;
  state?: LearningState;
  practiceQuestions: TopicPracticeQuestion[];
  practiceAnswers: TopicPracticeAnswer[];
  practiceResult?: TopicPracticeResult;
  onStart: () => void;
  onComplete: () => void;
  onPracticeAnswer: (questionId: string, selectedOptionIndex: number) => void;
  onPracticeSubmit: () => void;
  onPracticeRetry: () => void;
  onVerify: () => void;
}) {
  if (!module) return <p className="text-sm text-slate-500">No learning module is needed for the current state.</p>;

  const started = Boolean(state?.startedAt);
  const completed = Boolean(state?.completedAt);
  const verified = state?.verificationStatus === 'PASSED';
  const hasPractice = practiceQuestions.length > 0;
  const practiceComplete = !hasPractice || Boolean(practiceResult);

  return (
    <div>
      <div className="flex gap-3">
        <div className="rounded-xl bg-slate-100 p-2.5"><BookOpenCheck size={20}/></div>
        <div>
          <h3 className="font-bold text-slate-900">{module.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{module.summary}</p>
          <p className="mt-2 text-xs font-semibold text-slate-500">~{module.estimatedMinutes} min</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!started && <button onClick={onStart} className="btn-primary">Start learning</button>}
        {started && !completed && <button onClick={onComplete} className="btn-primary">I've learned this — take 5 MCQs</button>}
        {completed && !hasPractice && !verified && <button onClick={onVerify} className="btn-primary"><FlaskConical size={16}/> Run verification</button>}
        {completed && hasPractice && !practiceComplete && <span className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">Answer all 5 MCQs and submit. A passing result updates competency automatically.</span>}
        {verified && <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"><CircleCheckBig size={17}/> Verification passed · competency updated</span>}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {module.objectives.map(objective => <div key={objective} className="rounded-lg border border-slate-200 p-2 text-xs text-slate-600">{objective}</div>)}
      </div>

      {completed && hasPractice && !verified && (
        <TopicPracticeQuiz
          questions={practiceQuestions}
          answers={practiceAnswers}
          result={practiceResult}
          onAnswer={onPracticeAnswer}
          onSubmit={onPracticeSubmit}
          onRetry={onPracticeRetry}
        />
      )}
    </div>
  );
}
