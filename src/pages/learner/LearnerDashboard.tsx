import { useEffect } from 'react';
import { Activity, Award, Brain, RotateCcw, Target, TriangleAlert } from 'lucide-react';
import { usePathPilotStore, pathpilotCatalog } from '../../store/pathpilotStore';
import { Panel } from '../../components/common/Panel';
import { Badge } from '../../components/common/Badge';
import { CompetencyChart } from '../../components/dashboard/CompetencyChart';
import { ReasoningPanel } from '../../components/adaptive/ReasoningPanel';
import { RoadmapView } from '../../components/adaptive/RoadmapView';
import { LearningActionCard } from '../../components/learning/LearningActionCard';
import { AssessmentCard } from '../../components/assessment/AssessmentCard';
import { InitialDiagnosticCard } from '../../components/assessment/InitialDiagnosticCard';
import { DiagnosticResultCard } from '../../components/assessment/DiagnosticResultCard';
import { StudyMaterialAssistant } from '../../components/learning/StudyMaterialAssistant';
import { LearningAssistant } from '../../components/learning/LearningAssistant';
import { RecapModeCard } from '../../components/learning/RecapModeCard';
import { LearnerProfileCard } from '../../components/learner/LearnerProfileCard';
import { calculateCompetencyState } from '../../services/competency/competencyEngine';
import { analyzeSkillGap } from '../../services/skillGap/skillGapEngine';
import { calculateRoleSkillReadiness } from '../../services/competency/roleReadinessService';

export function LearnerDashboard() {
  const s = usePathPilotStore(); const { demoLearner, currentDemoRole, competencies, learningModules, getTopicPracticeQuestions } = pathpilotCatalog;
  const py = s.learnerState.competencies.find(c => c.competencyId === 'comp-python')!;
  const req = s.targetRole.competencyRequirements.find(r => r.competencyId === 'comp-python')!.requiredLevel;
  const topicNames = Object.fromEntries(s.topics.map(topic => [topic.id, topic.name]));

  useEffect(() => {
    s.checkRecapOnReturn();
    const record = () => s.recordLearnerActivity();
    const onVisibility = () => { if (document.visibilityState === 'hidden') record(); };
    window.addEventListener('beforeunload', record);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', record);
      record();
    };
  }, []);

  if (s.recapOffer) {
    return <div className="min-h-screen bg-slate-50"><Topbar name={demoLearner.name} role={s.targetRole.name} onReset={s.resetDemo}/><main className="mx-auto max-w-5xl px-4 py-8 lg:px-6"><RecapModeCard offer={s.recapOffer} questions={s.recapQuestions} answers={s.recapAnswers} result={s.recapResult} topics={s.topics} onAccept={s.acceptRecap} onDecline={s.declineRecap} onAnswer={s.answerRecap} onSubmit={s.submitRecap} onDismissResult={s.dismissRecapResult}/></main></div>;
  }

  if (!s.diagnosticResult) {
    return <div className="min-h-screen bg-slate-50"><Topbar name={demoLearner.name} role={s.targetRole.name} onReset={s.resetDemo}/><main className="mx-auto max-w-7xl space-y-5 px-4 py-8 lg:px-6"><LearnerProfileCard learner={demoLearner} currentRole={currentDemoRole} targetRole={s.targetRole} competencies={competencies}/><InitialDiagnosticCard assessment={s.diagnosticAssessment} answers={s.diagnosticAnswers} questions={s.diagnosticQuestions} topicNames={topicNames} requiredLevel={req} onStart={s.startInitialDiagnostic} onAnswer={s.answerInitialDiagnostic} onSubmit={s.submitInitialDiagnostic}/></main></div>;
  }

  const compState = calculateCompetencyState(py, req); const gap = analyzeSkillGap(compState, s.topics);
  const module = learningModules.find(m => m.topicId === s.adaptiveState.currentAction.targetTopicId);
  const practiceQuestions = getTopicPracticeQuestions(s.adaptiveState.currentAction.targetTopicId);
  const blocker = s.topics.find(t => t.id === gap.blockingPrerequisiteIds[0]);
  const weakestDiagnostic = [...s.diagnosticResult.topicAnalysis].sort((a, b) => a.percentage - b.percentage)[0];
  const roleReadiness = calculateRoleSkillReadiness({ learnerState: s.learnerState, targetRole: s.targetRole, competencies })
    .filter(item => item.competencyId === s.diagnosticResult?.competencyId);
  const activeCompetencyRole = {
    ...s.targetRole,
    competencyRequirements: s.targetRole.competencyRequirements.filter(item => item.competencyId === s.diagnosticResult?.competencyId),
  };
  const currentFocus = s.topics.find(topic => topic.id === s.adaptiveState.currentAction.targetTopicId);
  return <div className="min-h-screen bg-slate-50"><Topbar name={demoLearner.name} role={s.targetRole.name} onReset={s.resetDemo}/><main className="mx-auto max-w-7xl space-y-5 px-4 py-6 lg:px-6"><LearnerProfileCard learner={demoLearner} currentRole={currentDemoRole} targetRole={s.targetRole} competencies={competencies} readiness={roleReadiness}/><DiagnosticResultCard result={s.diagnosticResult} topicNames={topicNames} requiredLevel={req}/><Panel title="Recap mode" eyebrow="Retention after inactivity"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-slate-900">{s.adaptiveState.completedTopics.length > 0 ? 'Recap tracking is active' : 'Complete a topic to activate recap tracking'}</p><p className="mt-1 text-sm text-slate-600">{s.adaptiveState.completedTopics.length > 0 ? 'If you are away for 7 or more days, PathPilot will ask whether you want a 5-question recap before you continue. You can also launch the same recap immediately for a demo or voluntary review.' : 'After your first completed learning topic, PathPilot records the activity date. Returning after 7 or more days will trigger an optional 5-question recap.'}</p></div><div className="flex flex-wrap items-center gap-2"><Badge>{s.adaptiveState.completedTopics.length > 0 ? 'ARMED · 7 DAYS' : 'WAITING FOR LEARNING'}</Badge><button className="btn-secondary" disabled={s.adaptiveState.completedTopics.length === 0} onClick={s.startRecapNow}><Brain size={15}/> Take recap now</button></div></div></Panel><section className="grid gap-4 md:grid-cols-4"><Metric icon={<Activity size={18}/>} label="Current competency" value={`${compState.currentLevel}%`} note={s.evidence.length ? 'Diagnostic + approved evidence' : 'From initial diagnostic'}/><Metric icon={<Target size={18}/>} label="Required competency" value={`${compState.requiredLevel}%`} note={s.targetRole.name}/><Metric icon={<TriangleAlert size={18}/>} label="Competency gap" value={`${compState.gap} pts`} note={gap.priority + ' priority'}/><Metric icon={<Award size={18}/>} label="Approved evidence" value={`${py.evidence.filter(e => e.approved).length}`} note="verification artifacts"/></section><ReasoningPanel state={s.adaptiveState} topics={s.topics}/><section className="grid gap-5 lg:grid-cols-5"><Panel title="Competency profile" eyebrow="Target role comparison" className="lg:col-span-3"><CompetencyChart learnerState={s.learnerState} role={activeCompetencyRole} competencies={competencies}/></Panel><Panel title="Gap diagnosis" eyebrow="Explainable intelligence" className="lg:col-span-2"><div className="space-y-3"><Row label="Diagnostic baseline" value={`${s.diagnosticResult.score}/100 from 10 questions`}/><Row label="Competency standard" value={`v${s.knowledgeVersion} · Python requirement ${req}%`}/><Row label="Primary gap" value="Python Programming"/><Row label="Weakest initial diagnostic topic" value={weakestDiagnostic ? `${topicNames[weakestDiagnostic.topicId] ?? weakestDiagnostic.topicId} · ${weakestDiagnostic.percentage}%` : 'Not available'}/><Row label="Current focus topic" value={currentFocus?.name ?? (compState.gap === 0 ? 'Competency complete' : 'Reassessment required')}/><Row label="Gap size" value={`${compState.gap} points`}/><Row label="Blocking prerequisite" value={blocker?.name ?? 'None detected'}/><Row label="Why" value={gap.explanation}/></div></Panel></section><section className="grid gap-5 lg:grid-cols-2"><Panel title="Current learning action" eyebrow="Learn → practice → verify"><LearningActionCard module={module} state={s.learningState} practiceQuestions={practiceQuestions} practiceAnswers={s.topicPracticeAnswers} practiceResult={s.topicPracticeResult} onStart={s.startCurrentLearning} onComplete={s.completeCurrentLearning} onPracticeAnswer={s.answerCurrentPractice} onPracticeSubmit={s.submitCurrentPractice} onPracticeRetry={s.retryCurrentPractice} onVerify={s.runHeroVerification}/></Panel><Panel title="Adaptive roadmap" eyebrow={`Version ${s.adaptiveState.roadmap.version}`}><RoadmapView roadmap={s.adaptiveState.roadmap}/></Panel></section><Panel title="AI learning coach" eyebrow="Explain → hint → example → sample assessment"><LearningAssistant topic={s.topics.find(topic => topic.id === s.adaptiveState.currentAction.targetTopicId)} module={module} studyPack={s.studyPack}/></Panel><Panel title="My study material" eyebrow="Upload → summary → key points → 7 MCQs"><StudyMaterialAssistant topics={s.topics} currentTopicId={s.adaptiveState.currentAction.targetTopicId} pack={s.studyPack} answers={s.studyQuizAnswers} result={s.studyQuizResult} onGenerate={s.generateLearnerStudyPack} onAnswer={s.answerLearnerStudyQuiz} onSubmit={s.submitLearnerStudyQuiz} onReset={s.resetLearnerStudyPack}/></Panel><section className="grid gap-5 lg:grid-cols-2"><Panel title="Verification & evidence" eyebrow="Mastery control"><VerificationSummary current={compState.currentLevel} evidenceCount={s.evidence.length} latestScore={s.evidence.at(-1)?.score}/></Panel><Panel title="Independent assessment" eyebrow="Published pool → 15 dynamic MCQs → weak topics"><AssessmentCard assessment={s.assessment} answers={s.assessmentAnswers} result={s.assessmentResult} guidance={s.assessmentGuidance} questions={s.assessmentQuestions} poolSize={(s.assessmentPools.find(pool => pool.competencyId === 'comp-python' && pool.approved && Boolean(pool.sourceMaterialId)) ?? s.assessmentPools.find(pool => pool.competencyId === 'comp-python' && pool.approved))?.questionIds.length ?? 0} topicNames={topicNames} onStart={s.startIndependentAssessment} onAnswer={s.answerIndependentAssessment} onSubmit={s.submitIndependentAssessment}/></Panel></section></main></div>;
}
function Topbar({ name, role, onReset }: { name: string; role: string; onReset: () => void }) { return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6"><div><div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 font-black text-white">P</div><div><p className="font-extrabold text-slate-950">PathPilot</p><p className="text-xs text-slate-500">AI-assisted competency intelligence</p></div></div></div><div className="hidden text-right sm:block"><p className="text-sm font-bold text-slate-900">{name}</p><p className="text-xs text-slate-500">Target: {role}</p></div><button onClick={onReset} className="btn-secondary"><RotateCcw size={15}/> Reset demo</button></div></header>; }
function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel"><div className="flex items-center gap-2 text-slate-500">{icon}<span className="text-xs font-semibold">{label}</span></div><p className="mt-2 text-3xl font-extrabold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="border-b border-slate-100 pb-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{value}</p></div>; }
function VerificationSummary({ current, evidenceCount, latestScore }: { current: number; evidenceCount: number; latestScore?: number }) { return <div><div className="flex flex-wrap items-center gap-3"><Badge tone={evidenceCount ? 'green' : 'amber'}>{evidenceCount ? 'Evidence recorded' : 'Pending verification'}</Badge><span className="text-xs text-slate-500">Learning completion alone never changes competency.</span></div><div className="mt-4 grid grid-cols-3 gap-3"><Mini label="Competency" value={`${current}%`}/><Mini label="Evidence" value={`${evidenceCount}`}/><Mini label="Latest score" value={latestScore ? `${latestScore}%` : '—'}/></div>{evidenceCount > 0 && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Hero flow complete: approved evidence updated competency and triggered gap + roadmap recalculation.</p>}</div>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p></div>; }
