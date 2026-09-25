import { Brain, CheckCircle2, Clock3, RotateCcw, X } from 'lucide-react';
import type { RecapOffer, RecapResult, TopicPracticeAnswer, TopicPracticeQuestion } from '../../types/learning';
import type { Topic } from '../../types/topic';

interface Props {
  offer?: RecapOffer;
  questions: TopicPracticeQuestion[];
  answers: TopicPracticeAnswer[];
  result?: RecapResult;
  topics: Topic[];
  onAccept: () => void;
  onDecline: () => void;
  onAnswer: (questionId: string, selectedOptionIndex: number) => void;
  onSubmit: () => void;
  onDismissResult: () => void;
}

export function RecapModeCard(props: Props) {
  const { offer, questions, answers, result, topics } = props;
  if (!offer) return null;
  const topicName = (id: string) => topics.find(topic => topic.id === id)?.name ?? id;
  const manual = offer.daysAway === 0;

  if (offer.status === 'OFFERED') {
    return <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-panel">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700"><Clock3 size={20}/></div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{manual ? 'On-demand recap' : 'Welcome back · Recap mode'}</p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-950">{manual ? 'Ready for a quick knowledge recap?' : `You were away for ${offer.daysAway} days. Want a quick knowledge recap?`}</h2>
          <p className="mt-2 text-sm text-slate-600">PathPilot can ask 5 short MCQs from topics you learned before your break, then show which areas may need review. Recap results do not directly change your official competency or roadmap.</p>
          <div className="mt-3 flex flex-wrap gap-2">{offer.topicIds.map(id => <span key={id} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{topicName(id)}</span>)}</div>
          <div className="mt-4 flex flex-wrap gap-2"><button className="btn-primary" onClick={props.onAccept}><Brain size={15}/> Yes, start recap</button><button className="btn-secondary" onClick={props.onDecline}><X size={15}/> No, continue learning</button></div>
        </div>
      </div>
    </section>;
  }

  if (offer.status === 'STARTED' && !result) {
    return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Recap mode · 5 MCQs</p>
      <h2 className="mt-1 text-lg font-extrabold text-slate-950">Check what you still remember</h2>
      <div className="mt-4 space-y-5">{questions.map((question, index) => {
        const selected = answers.find(answer => answer.questionId === question.id)?.selectedOptionIndex;
        return <div key={question.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold text-slate-900">{index + 1}. {question.prompt}</p><span className="text-xs font-semibold text-slate-400">{topicName(question.topicId)}</span></div><div className="mt-3 grid gap-2">{question.options.map((option, optionIndex) => <button key={option} type="button" onClick={() => props.onAnswer(question.id, optionIndex)} className={`rounded-xl border px-3 py-2 text-left text-sm ${selected === optionIndex ? 'border-indigo-500 bg-indigo-50 font-semibold text-indigo-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>{option}</button>)}</div></div>;
      })}</div>
      <button className="btn-primary mt-4" disabled={questions.some(question => !answers.some(answer => answer.questionId === question.id))} onClick={props.onSubmit}>Submit recap</button>
    </section>;
  }

  if (result) {
    return <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-panel">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><CheckCircle2 size={20}/></div><div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Recap complete</p><h2 className="mt-1 text-lg font-extrabold text-slate-950">Retention score: {result.correct}/{result.total} · {result.score}%</h2></div></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{result.topicResults.map(topicResult => <div key={topicResult.topicId} className="rounded-xl border border-slate-200 p-3"><p className="font-bold text-slate-900">{topicName(topicResult.topicId)}</p><p className="mt-1 text-sm text-slate-600">{topicResult.correct}/{topicResult.total} correct · {topicResult.score}%</p><p className={`mt-2 text-xs font-extrabold ${topicResult.level === 'WEAK' ? 'text-rose-600' : topicResult.level === 'DEVELOPING' ? 'text-amber-600' : 'text-emerald-600'}`}>{topicResult.level}</p></div>)}</div>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{result.weakTopicIds.length > 0 ? <><strong>Weak areas to review:</strong> {result.weakTopicIds.map(topicName).join(', ')}. PathPilot recommends revisiting these topics before continuing.</> : <><strong>Good retention.</strong> No topic fell below the weak threshold in this recap.</>}</div>
      <button className="btn-secondary mt-4" onClick={props.onDismissResult}><RotateCcw size={15}/> Continue to dashboard</button>
    </section>;
  }

  return null;
}
