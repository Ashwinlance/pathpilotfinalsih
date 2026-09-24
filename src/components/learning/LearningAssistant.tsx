import { Bot, CheckCircle2, HelpCircle, Lightbulb, MessageCircleQuestion, RotateCcw, Send, Sparkles, WandSparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import type { LearningModule, LearningAssistantAssessment, LearningAssistantAssessmentResult, LearningAssistantIntent, LearningAssistantMessage, StudyPack } from '../../types/learning';
import type { Topic } from '../../types/topic';
import { DeterministicLearningAssistant, gradeLearningAssistantAssessment } from '../../services/learning/learningAssistantService';

const quickActions: Array<{ intent: LearningAssistantIntent; label: string; icon: ReactNode; prompt: string }> = [
  { intent: 'EXPLAIN', label: 'Explain', icon: <MessageCircleQuestion size={14}/>, prompt: 'Explain this topic to me.' },
  { intent: 'HINT', label: 'Give a hint', icon: <Lightbulb size={14}/>, prompt: 'Give me a hint for this topic.' },
  { intent: 'EXAMPLE', label: 'Show example', icon: <Sparkles size={14}/>, prompt: 'Show me an example.' },
  { intent: 'SIMPLIFY', label: 'Simplify', icon: <WandSparkles size={14}/>, prompt: 'Explain this in a simpler way.' },
  { intent: 'SAMPLE_ASSESSMENT', label: 'Sample assessment', icon: <HelpCircle size={14}/>, prompt: 'Create a sample assessment.' },
];

export function LearningAssistant({ topic, module, studyPack }: { topic?: Topic; module?: LearningModule; studyPack?: StudyPack }) {
  const provider = useMemo(() => new DeterministicLearningAssistant(), []);
  const [messages, setMessages] = useState<LearningAssistantMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [assessment, setAssessment] = useState<LearningAssistantAssessment | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<LearningAssistantAssessmentResult | undefined>(undefined);
  const sequence = useRef(0);

  useEffect(() => {
    if (!topic) return;
    sequence.current = 0;
    setMessages([{ id: `assistant-${topic.id}-welcome`, role: 'ASSISTANT', text: `I’m your learning coach for ${topic.name}. Ask for an explanation, hint, example, simpler explanation, or a sample assessment.` }]);
    setAssessment(undefined);
    setAnswers({});
    setAssessmentResult(undefined);
    setDraft('');
  }, [topic?.id]);

  if (!topic) return <p className="text-sm text-slate-500">The learning coach becomes available when PathPilot selects a learning topic.</p>;

  const appendInteraction = (prompt: string, intent?: LearningAssistantIntent) => {
    const clean = prompt.trim();
    if (!clean) return;
    sequence.current += 1;
    const response = provider.respond({ message: clean, intent, context: { topic, module, studyPack } });
    const id = sequence.current;
    setMessages(current => [
      ...current,
      { id: `learner-${id}`, role: 'LEARNER', text: clean, intent },
      { id: `assistant-${id}`, role: 'ASSISTANT', text: response.text, intent: response.intent },
    ]);
    if (response.assessment) {
      setAssessment(response.assessment);
      setAnswers({});
      setAssessmentResult(undefined);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    appendInteraction(draft);
    setDraft('');
  };

  const resetAssessment = () => {
    setAssessment(undefined);
    setAnswers({});
    setAssessmentResult(undefined);
  };

  const allAssessmentAnswered = assessment?.questions.every(question => answers[question.id] !== undefined) ?? false;

  return <div className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4">
      <div className="flex gap-3">
        <div className="rounded-xl bg-white p-2.5 text-blue-700 shadow-sm"><Bot size={20}/></div>
        <div><p className="font-bold text-slate-950">AI Learning Coach <span className="text-xs font-semibold text-blue-700">· prototype</span></p><p className="mt-1 text-sm text-slate-600">Context: <span className="font-semibold">{topic.name}</span>{module ? ` · ${module.title}` : ''}</p></div>
      </div>
      <p className="max-w-xl text-xs leading-5 text-slate-500">The current prototype uses deterministic, local topic guidance. It does not claim a production LLM connection, and coach practice never changes competency or the adaptive roadmap.</p>
    </div>

    <div className="flex flex-wrap gap-2">
      {quickActions.map(action => <button key={action.intent} type="button" className="btn-secondary" onClick={() => appendInteraction(action.prompt, action.intent)}>{action.icon}{action.label}</button>)}
    </div>

    <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
      {messages.map(message => <div key={message.id} className={`flex ${message.role === 'LEARNER' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-sm leading-6 ${message.role === 'LEARNER' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>{message.text}</div></div>)}
    </div>

    <form onSubmit={submit} className="flex gap-2">
      <input value={draft} onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm" placeholder={`Ask about ${topic.name}... e.g. “What is return?”`}/>
      <button type="submit" className="btn-primary" disabled={!draft.trim()}><Send size={15}/> Ask</button>
    </form>

    {assessment && <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-slate-950">Sample assessment · {topic.name}</p><p className="mt-1 text-xs text-slate-500">5 practice questions generated for the current learning context. Feedback only.</p></div><button type="button" className="btn-secondary" onClick={resetAssessment}><RotateCcw size={14}/> Close assessment</button></div>
      <div className="mt-4 space-y-4">
        {assessment.questions.map((question, index) => <fieldset key={question.id} disabled={Boolean(assessmentResult)} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><legend className="px-1 text-sm font-bold text-slate-900">{index + 1}. {question.prompt}</legend><div className="mt-3 grid gap-2">{question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${answers[question.id] === optionIndex ? 'border-slate-900 bg-white text-slate-950' : 'border-slate-200 bg-white text-slate-600'}`}><input className="mt-0.5" type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}/><span>{option}</span></label>)}</div></fieldset>)}
      </div>
      {!assessmentResult && <button type="button" className="btn-primary mt-4" disabled={!allAssessmentAnswered} onClick={() => setAssessmentResult(gradeLearningAssistantAssessment(assessment, answers))}><CheckCircle2 size={15}/> Submit sample assessment</button>}
      {assessmentResult && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Practice result</p><p className="mt-1 text-xl font-extrabold text-emerald-950">{assessmentResult.correct}/{assessmentResult.total} correct · {assessmentResult.score}%</p><p className="mt-1 text-xs text-emerald-700">This coach assessment is practice only. Verification remains the mastery gate.</p></div>}
    </div>}
  </div>;
}
