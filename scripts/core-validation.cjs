const assert = require('node:assert/strict');
const { calculateCompetencyState, applyApprovedEvidence } = require('../.core-build/services/competency/competencyEngine.js');
const { analyzeSkillGap } = require('../.core-build/services/skillGap/skillGapEngine.js');
const { decideNextAction } = require('../.core-build/services/adaptive/adaptiveDecisionEngine.js');
const { buildRoadmap } = require('../.core-build/services/adaptive/roadmapService.js');
const { startLearning, completeLearning, verifyLearning } = require('../.core-build/services/learning/learningService.js');
const { createAssessment, gradeAssessment } = require('../.core-build/services/assessment/assessmentService.js');
const { createProposal, reviewProposal } = require('../.core-build/services/governance/governanceService.js');
const { MemoryRepository } = require('../.core-build/services/persistence/memoryRepository.js');
const { buildInitialAdaptiveState, applyVerificationEvidence } = require('../.core-build/services/adaptive/adaptiveLoopService.js');
const { initialTopics } = require('../.core-build/data/topics/topics.js');
const { demoLearnerState } = require('../.core-build/data/learners/demoLearner.js');
const { questions, questionPools } = require('../.core-build/data/assessments/questions.js');
const { governanceSources } = require('../.core-build/data/governance/sources.js');

const checks = [];
function check(name, fn) { return Promise.resolve().then(fn).then(() => checks.push({name, ok:true})).catch(err => { checks.push({name, ok:false, err}); }); }

(async () => {
  const base = structuredClone(demoLearnerState.competencies[0]);
  await check('1 competency calculation', () => { const c=calculateCompetencyState(base,80); assert.equal(c.currentLevel,48); assert.equal(c.requiredLevel,80); assert.equal(c.gap,32); });
  await check('2 skill-gap calculation', () => { const g=analyzeSkillGap(calculateCompetencyState(base,80),initialTopics); assert.equal(g.gap,32); assert.equal(g.priority,'CRITICAL'); });
  await check('3 prerequisite detection', () => { const g=analyzeSkillGap(calculateCompetencyState(base,80),initialTopics); assert.ok(g.blockingPrerequisiteIds.includes('py-functions')); });
  await check('4 adaptive decision', () => { const g=analyzeSkillGap(calculateCompetencyState(base,80),initialTopics); const d=decideNextAction({skillGap:g,topics:initialTopics,completedTopics:[],verifiedTopics:[]}); assert.equal(d.action,'REPAIR_PREREQUISITE'); });
  await check('5 learning completion', () => { const s=completeLearning(startLearning('m','t0'),'t1'); assert.equal(s.completedAt,'t1'); assert.equal(s.verificationStatus,'PENDING'); });
  let evidence;
  await check('6 verification', () => { const r=verifyLearning({learnerId:'l',competencyId:'comp-python',topicId:'py-functions',moduleId:'m',score:86,at:'t2'}); assert.equal(r.verification.status,'PASSED'); assert.ok(r.evidence); evidence=r.evidence; });
  await check('7 competency update', () => { const u=applyApprovedEvidence(base,evidence); assert.equal(u.currentLevel,62); });
  await check('8 gap recalculation', () => { const u=applyApprovedEvidence(base,evidence); assert.equal(calculateCompetencyState(u,80).gap,18); });
  await check('9 roadmap update', () => { const before=buildInitialAdaptiveState({learnerId:'l',learnerCompetency:base,requiredLevel:80,topics:initialTopics}); const after=applyVerificationEvidence({snapshot:before,evidence,requiredLevel:80,topics:initialTopics}); assert.equal(after.adaptiveState.roadmap.version,2); assert.equal(after.competencyGap,18); });
  await check('10 assessment grading', () => { const a=createAssessment({id:'a',learnerId:'l',competencyId:'comp-python',pool:questionPools[0],questions,count:15,createdAt:'t0'}); const answers=a.questionIds.map(questionId=>({questionId,selectedOptionIndex:0})); const r=gradeAssessment(a,answers,questions,'t1'); assert.equal(r.score,100); });
  await check('11 assessment isolation', () => { const before=buildInitialAdaptiveState({learnerId:'l',learnerCompetency:base,requiredLevel:80,topics:initialTopics}); const serialized=JSON.stringify(before.adaptiveState); const a=createAssessment({id:'a2',learnerId:'l',competencyId:'comp-python',pool:questionPools[0],questions,count:15,createdAt:'t0'}); gradeAssessment(a,a.questionIds.map(questionId=>({questionId,selectedOptionIndex:0})),questions,'t1'); assert.equal(JSON.stringify(before.adaptiveState),serialized); });
  await check('12 governance approval', () => { const p=createProposal({id:'p',source:governanceSources[0],title:'x',proposedChange:'y',evidenceSummary:'z',aiConfidence:.9,fingerprint:'fp',existing:[],at:'t0'}); assert.throws(()=>reviewProposal(p,{id:'r0',proposalId:'p',reviewerId:'ai-reviewer',decision:'APPROVE',note:'',reviewedAt:'t1'})); const r=reviewProposal(p,{id:'r',proposalId:'p',reviewerId:'human-admin',decision:'APPROVE',note:'checked',reviewedAt:'t1'}); assert.equal(r.proposal.status,'APPROVED'); });
  await check('13 persistence', async () => { const repo=new MemoryRepository(); await repo.save({id:'x',value:1}); await repo.update('x',e=>({...e,value:2})); assert.equal((await repo.load('x')).value,2); await repo.delete('x'); assert.equal(await repo.load('x'),undefined); });
  await check('14 repeat-run behavior', () => { const once=applyApprovedEvidence(base,evidence); const twice=applyApprovedEvidence(once,evidence); assert.equal(twice.currentLevel,62); assert.equal(twice.evidence.length,1); });
  await check('15 unapproved evidence isolation', () => { const before=buildInitialAdaptiveState({learnerId:'l',learnerCompetency:base,requiredLevel:80,topics:initialTopics}); const serialized=JSON.stringify(before); const rejected={...evidence,id:'rejected',approved:false,score:99}; const after=applyVerificationEvidence({snapshot:before,evidence:rejected,requiredLevel:80,topics:initialTopics}); assert.equal(JSON.stringify(after),serialized); });
  const failed=checks.filter(c=>!c.ok);
  for (const c of checks) console.log(`${c.ok?'PASS':'FAIL'} ${c.name}${c.ok?'':': '+c.err.message}`);
  console.log(`\n${checks.length-failed.length}/${checks.length} validation checks passed.`);
  if (failed.length) process.exit(1);
})();
