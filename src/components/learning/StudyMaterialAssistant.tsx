import { BookOpenCheck, CheckCircle2, FileText, ListChecks, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { useMemo, useState, type ChangeEvent } from 'react';
import type { StudyPack, StudyQuizAnswer, StudyQuizResult } from '../../types/learning';
import type { Topic } from '../../types/topic';

export function StudyMaterialAssistant({
  topics,
  currentTopicId,
  pack,
  answers,
  result,
  onGenerate,
  onAnswer,
  onSubmit,
  onReset,
}: {
  topics: Topic[];
  currentTopicId?: string;
  pack?: StudyPack;
  answers: StudyQuizAnswer[];
  result?: StudyQuizResult;
  onGenerate: (input: { title: string; content: string; topicId: string }) => void;
  onAnswer: (questionId: string, selectedOptionIndex: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const availableTopics = useMemo(() => topics.filter(topic => topic.competencyId === 'comp-python'), [topics]);
  const defaultTopicId = currentTopicId && availableTopics.some(topic => topic.id === currentTopicId) ? currentTopicId : availableTopics[0]?.id ?? '';
  const [topicId, setTopicId] = useState(defaultTopicId);
  const [title, setTitle] = useState('My study material');
  const [content, setContent] = useState('');

  const loadFile = async (file?: File) => {
    if (!file) return;
    setTitle(file.name.replace(/\.[^.]+$/, ''));
    setContent(await file.text());
  };

  const answerMap = new Map(answers.map(answer => [answer.questionId, answer.selectedOptionIndex]));
  const allAnswered = pack ? pack.questions.every(question => answerMap.has(question.id)) : false;

  return <div className="space-y-4">
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white p-2 text-slate-700 shadow-sm"><BookOpenCheck size={19}/></div>
        <div>
          <p className="font-bold text-slate-900">Create a personal study pack</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Upload or paste your own learning material. PathPilot creates a concise summary, key points and exactly 7 self-study MCQs for the selected topic.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-xs font-semibold text-slate-600">Topic
          <select className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={topicId} onChange={(event: ChangeEvent<HTMLSelectElement>) => setTopicId(event.target.value)}>
            {availableTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">Material title
          <input className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={title} onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)} placeholder="e.g. Python Functions Notes"/>
        </label>
      </div>

      <label className="mt-3 block text-xs font-semibold text-slate-600">Material content
        <textarea className="mt-1 min-h-36 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6" value={content} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)} placeholder="Paste your notes or learning material here..."/>
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="btn-secondary cursor-pointer"><Upload size={15}/> Upload .txt/.md<input className="hidden" type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event: ChangeEvent<HTMLInputElement>) => void loadFile(event.target.files?.[0])}/></label>
        <button type="button" className="btn-primary" disabled={!title.trim() || !content.trim() || !topicId} onClick={() => onGenerate({ title, content, topicId })}><Sparkles size={15}/> Generate study pack</button>
        <span className="text-xs text-slate-400">{content.trim() ? `${content.trim().length} characters loaded` : 'No material loaded yet'}</span>
      </div>
      <p className="mt-3 text-xs text-slate-400">Prototype note: summarization and MCQ generation are deterministic/local in this version; no production LLM call is claimed.</p>
    </div>

    {pack && <>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
          <div className="flex items-center gap-2 text-blue-900"><FileText size={18}/><p className="font-bold">Generated summary</p></div>
          <p className="mt-3 text-sm leading-6 text-slate-700">{pack.summary}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-900"><ListChecks size={18}/><p className="font-bold">Key points</p></div>
          <ul className="mt-3 space-y-2">
            {pack.keyPoints.map((point, index) => <li key={`${index}-${point}`} className="flex gap-2 text-sm leading-5 text-slate-700"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">{index + 1}</span><span>{point}</span></li>)}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="font-bold text-slate-900">7-question self-study quiz</p><p className="mt-1 text-xs text-slate-500">This quiz checks understanding of your uploaded material. Its result does not directly change competency, evidence or the adaptive roadmap.</p></div>
          <button type="button" className="btn-secondary" onClick={onReset}><RotateCcw size={15}/> New material</button>
        </div>
        <div className="mt-4 space-y-4">
          {pack.questions.map((question, questionIndex) => {
            const selected = answerMap.get(question.id);
            return <fieldset key={question.id} disabled={Boolean(result)} className="rounded-xl border border-slate-200 bg-white p-3">
              <legend className="px-1 text-sm font-bold text-slate-900">{questionIndex + 1}. {question.prompt}</legend>
              <div className="mt-3 grid gap-2">
                {question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition ${selected === optionIndex ? 'border-slate-900 bg-slate-50 text-slate-950' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                  <input type="radio" name={question.id} checked={selected === optionIndex} onChange={() => onAnswer(question.id, optionIndex)} className="mt-0.5"/>
                  <span>{option}</span>
                </label>)}
              </div>
            </fieldset>;
          })}
        </div>

        {!result && <button type="button" className="btn-primary mt-4" disabled={!allAnswered} onClick={onSubmit}><CheckCircle2 size={16}/> Submit 7 MCQs</button>}
        {result && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Self-study result</p><p className="mt-1 text-xl font-extrabold text-emerald-950">{result.correct}/{result.total} correct · {result.score}%</p><p className="mt-1 text-xs text-emerald-700">Feedback only — the adaptive engine and competency score are unchanged.</p></div>}
      </div>
    </>}
  </div>;
}
