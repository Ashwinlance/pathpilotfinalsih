import { CheckCircle2, FileText, Sparkles, Upload } from 'lucide-react';
import type { AssessmentMaterial, Question, QuestionPool } from '../../types/assessment';
import type { Competency } from '../../types/competency';
import type { Topic } from '../../types/topic';
import { useMemo, useState, type ChangeEvent } from 'react';

export function QuestionPoolManager({
  competencies,
  topics,
  material,
  generatedQuestions,
  publishedPool,
  onGenerate,
  onPublish,
}: {
  competencies: Competency[];
  topics: Topic[];
  material?: AssessmentMaterial;
  generatedQuestions: Question[];
  publishedPool?: QuestionPool;
  onGenerate: (input: { title: string; content: string; competencyId: string; topicIds: string[] }) => void;
  onPublish: () => void;
}) {
  const [competencyId, setCompetencyId] = useState('comp-python');
  const [title, setTitle] = useState('Python competency learning material');
  const [content, setContent] = useState('');
  const competencyTopics = useMemo(() => topics.filter(topic => topic.competencyId === competencyId), [topics, competencyId]);
  const [topicIds, setTopicIds] = useState<string[]>(['py-functions', 'py-data', 'py-analysis']);

  const toggleTopic = (topicId: string) => {
    setTopicIds(current => current.includes(topicId) ? current.filter(id => id !== topicId) : [...current, topicId]);
  };

  const loadFile = async (file?: File) => {
    if (!file) return;
    setTitle(file.name.replace(/\.[^.]+$/, ''));
    setContent(await file.text());
  };

  const generationReady = title.trim().length > 0 && content.trim().length > 0 && topicIds.length > 0;
  const counts = generatedQuestions.reduce<Record<string, number>>((acc, question) => {
    acc[question.topicId] = (acc[question.topicId] ?? 0) + 1;
    return acc;
  }, {});

  return <div className="space-y-4">
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white p-2 text-slate-700"><FileText size={19}/></div>
        <div>
          <p className="font-bold text-slate-900">1. Add approved learning material</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Paste text or upload a .txt/.md file. PathPilot uses deterministic prototype generation — no production LLM is claimed.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-xs font-semibold text-slate-600">Competency
          <select className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={competencyId} onChange={(event: ChangeEvent<HTMLSelectElement>) => { setCompetencyId(event.target.value); setTopicIds(topics.filter(t => t.competencyId === event.target.value).map(t => t.id)); }}>
            {competencies.map(competency => <option key={competency.id} value={competency.id}>{competency.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">Material title
          <input className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={title} onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)} placeholder="e.g. Python Functions Handbook"/>
        </label>
      </div>
      <label className="mt-3 block text-xs font-semibold text-slate-600">Material content
        <textarea className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6" value={content} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)} placeholder="Paste the approved learning material here..."/>
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="btn-secondary cursor-pointer"><Upload size={15}/> Upload text file<input className="hidden" type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event: ChangeEvent<HTMLInputElement>) => void loadFile(event.target.files?.[0])}/></label>
        <span className="text-xs text-slate-400">{content.trim() ? `${content.trim().length} characters loaded` : 'No material loaded yet'}</span>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 p-4">
      <p className="font-bold text-slate-900">2. Choose topics for the question pool</p>
      <p className="mt-1 text-xs text-slate-500">The generated 45 questions are tagged by these governed topics so the learner result can identify weak areas.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {competencyTopics.map(topic => <label key={topic.id} className="flex cursor-pointer gap-2 rounded-lg border border-slate-200 p-3 text-sm">
          <input type="checkbox" checked={topicIds.includes(topic.id)} onChange={() => toggleTopic(topic.id)}/>
          <span><span className="font-semibold text-slate-800">{topic.name}</span><span className="mt-0.5 block text-xs text-slate-500">{topic.description}</span></span>
        </label>)}
      </div>
      <button className="btn-primary mt-4" disabled={!generationReady} onClick={() => onGenerate({ title, content, competencyId, topicIds })}><Sparkles size={15}/> Generate 45 MCQs</button>
    </div>

    {generatedQuestions.length > 0 && <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="font-bold text-slate-900">3. Review generated pool</p><p className="mt-1 text-xs text-slate-500">{generatedQuestions.length} generated questions from “{material?.title}”.</p></div>
        <button className="btn-primary" onClick={onPublish}><CheckCircle2 size={15}/> Publish question pool</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(counts).map(([topicId, count]) => <span key={topicId} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{topics.find(t => t.id === topicId)?.name ?? topicId}: {count}</span>)}
      </div>
      <div className="mt-4 space-y-2">
        {generatedQuestions.slice(0, 3).map((question, index) => <div key={question.id} className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-xs font-semibold text-slate-400">Preview {index + 1} · {question.difficulty}</p><p className="mt-1 text-sm font-semibold text-slate-800">{question.prompt}</p></div>)}
        <p className="text-xs text-slate-400">Previewing 3 of {generatedQuestions.length}; publishing makes all 45 available to the learner assessment.</p>
      </div>
    </div>}

    {publishedPool && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-start gap-2 text-emerald-900"><CheckCircle2 size={19}/><div><p className="font-bold">Published question pool active</p><p className="mt-1 text-sm">{publishedPool.questionIds.length} approved questions · Independent assessment dynamically selects 15 questions per attempt.</p><p className="mt-1 text-xs text-emerald-700">Assessment results remain isolated from the adaptive state; weak-topic learning is shown as diagnostic guidance only.</p></div></div>
    </div>}
  </div>;
}
