# PathPilot

**AI-Powered Competency Intelligence & Adaptive Learning Platform**

PathPilot is a from-scratch prototype that demonstrates a closed adaptive competency loop:

**Diagnose → Gap → Prerequisite → Adapt → Learn → Verify → Evidence → Update → Recalculate → Next Action**

It is intentionally **not** a generic LMS. Its main job is to explain what a learner knows, what they are missing, why they are missing it, and what should happen next.

## Initial diagnostic before gap calculation

The learner flow now starts with a required 10-question Python diagnostic. PathPilot does not display the competency gap or adaptive roadmap until this diagnostic is submitted. The diagnostic computes topic-level performance across Python Basics, Python Functions, Python Data Structures and Analytical Python, combines those results with configured topic weights, and explicitly initializes the learner's current competency. The existing Skill Gap Engine then detects weak topics and prerequisite blockers, and the existing Adaptive Decision Engine remains the single authority for choosing the next action.

For the canonical SIH demo response profile, the diagnostic produces **48/100**, which yields **48 current / 80 required / gap 32** and selects **REPAIR_PREREQUISITE → Python Functions**. Different learner answers legitimately produce different competency and gap values. The later independent 15-question assessment remains isolated and does not silently mutate adaptive state.


## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Zustand
- Recharts
- Lucide React
- Vitest
- TypeScript service architecture with repository abstraction

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Validate

```bash
npm run typecheck
npm test
npm run build
```

## Hero demo

1. Choose **Learner**.
2. Observe Ananya's Python competency: **48 current / 80 required / 32 gap**.
3. PathPilot explains the prerequisite blocker and chooses **REPAIR_PREREQUISITE**.
4. Start the targeted learning module.
5. Click **I've learned this — take 5 MCQs**.
6. Answer the five topic-specific mastery-check questions and submit them.
7. A passing score (at least 70%; 4/5) is sent through the deterministic verification service and creates approved evidence automatically. A failed attempt does not change competency.
8. Competency moves **48 → 62** after approved evidence.
9. Gap moves **32 → 18**.
10. The roadmap version changes and the next action is recalculated.
11. Run the independent assessment and note that it does **not** mutate adaptive state.
12. Switch to **Admin** and exercise the governance proposal + human approval flow.

## Architecture

The domain model is strongly typed under `src/types`. Business logic is kept in services and is not implemented in React event handlers:

- `src/services/competency` — deterministic competency calculation and evidence-based update.
- `src/services/skillGap` — affected topics, prerequisites, priority and explanation.
- `src/services/adaptive/adaptiveDecisionEngine.ts` — the **single authoritative decision engine**.
- `src/services/adaptive/roadmapService.ts` — represents the plan; it does not decide independently.
- `src/services/learning` — learning completion and deterministic verification policy.
- `src/services/assessment` — isolated assessment creation and grading.
- `src/services/governance` — authorized-source proposals, duplicate checks, mandatory human review and audit trail.
- `src/services/persistence` — repository interface plus memory/local-storage adapters.

The backend boundary can later be implemented with FastAPI/PostgreSQL/iGOT APIs without changing the frontend domain vocabulary.

## Important prototype limits

- No live iGOT integration.
- No production LLM integration.
- Question generation is deterministic/mock.
- Governance source URLs are placeholders for the prototype.
- Verification policy is deterministic and simplified for the hero demo.
- Local repository adapters are provided; there is no server database in this MVP.
- This prototype demonstrates competency updates, but it does not claim guaranteed mastery or personalization.

## Project structure

```text
pathpilot/
├── src/
│   ├── components/{common,adaptive,learning,assessment,governance,dashboard}
│   ├── pages/{learner,admin}
│   ├── services/{competency,skillGap,adaptive,learning,assessment,governance,persistence}
│   ├── types/
│   ├── data/{learners,roles,competencies,topics,learning,assessments,governance}
│   ├── store/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── tests/{unit,integration,e2e}
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

## Next development recommendation

Replace the repository adapter with a typed API client backed by FastAPI/PostgreSQL, then integrate a governed competency source in a staging environment. Keep the current service interfaces stable, and add any AI extraction/generation only behind the existing interfaces with evaluation and human approval.

## Deployment

PathPilot is a client-side Vite prototype and does not require a backend for the current memory/local repository behavior. For Vercel or Netlify use:

- Build command: `npm run build`
- Output directory: `dist`

No environment variables are required by the current prototype.


### Topic learning mastery check

Every Python adaptive topic now resolves to a real learning module, including **Python Basics**. After the learner marks a module as learned, PathPilot displays exactly **5 topic-specific MCQs**. Submitting a score of at least **70% (4/5)** runs the existing verification/evidence path automatically; only approved verification evidence increases competency and triggers gap/roadmap recalculation. Scores below the threshold leave competency unchanged and allow a retry.

### Learner study material assistant

Learners can paste or upload `.txt` / `.md` study material for a selected topic. The prototype deterministically generates a concise summary, up to five key points, and exactly seven self-study MCQs. The quiz is feedback-only and cannot directly change competency, evidence, or the adaptive roadmap.

### Learner AI Learning Coach (prototype)

The learner dashboard includes a context-aware learning coach for the active adaptive topic. It supports free-form learner questions plus quick actions for **Explain**, **Hint**, **Example**, **Simplify**, and a **5-question sample assessment**. The current implementation is deterministic/local and intentionally does not claim a production LLM connection. Coach responses may use the active module objectives and the learner's generated study pack as context. Coach assessments are practice-only and never directly modify competency, evidence, verification, or the adaptive roadmap.

## Governed competency version update

The Admin governance demo now models an actual governed curriculum change rather than a cosmetic approval. Before human approval, the Statistical Data Analyst role requires **80% Python competency** and the learner curriculum does not contain `py-testing`. After a human reviewer approves **Python competency standard v2**, PathPilot:

- raises the required Python competency from **80% to 85%**,
- adds **Python Testing & Validation** as a governed Python topic,
- adds the topic to the learner roadmap as an upcoming governed requirement,
- recalculates the competency gap and authoritative adaptive decision using the existing Adaptive Decision Engine, and
- creates the normal governance audit record.

Rejecting the proposal leaves the 80% requirement and learner roadmap unchanged. AI proposal generation alone cannot apply the update.



## Recap Mode after inactivity

PathPilot now includes an opt-in retention recap for returning learners.

- A learner activity snapshot is stored through the persistence boundary with the last active timestamp and learned topic ids.
- After **7 or more inactive days**, PathPilot offers (but does not force) a recap when the learner returns.
- Choosing **Yes, start recap** creates a deterministic **5-MCQ** recap drawn from previously learned topics.
- Choosing **No, continue learning** dismisses the recap and continues the normal learner flow.
- Recap results show an overall retention score plus per-topic `WEAK`, `DEVELOPING`, or `RETAINED` status.
- Topics below 70% are surfaced as weak review areas.
- Recap results are formative only: they **do not directly change competency, evidence, prerequisites, or the adaptive roadmap**. Official competency changes still require the verification/evidence policy.

This keeps the recap feature consistent with PathPilot's rule that practice and independent assessments inform learning but do not silently become mastery evidence.

## Learner profile and role readiness

The learner dashboard now keeps role context visible alongside the adaptive learning flow.

- Student information includes learner ID, name, email and career track.
- The learner has an explicit **current role** and **target role**.
- For the demo learner, the transition is **Data Operations Trainee → Statistical Data Analyst**.
- Required skills are derived directly from the selected target role's competency requirements rather than duplicated in the UI.
- Before the initial diagnostic, the target-role skill table shows required levels while current level/gap stay **Pending**.
- After the diagnostic, PathPilot shows each required skill with current level, required level, gap and readiness status (`READY`, `DEVELOPING`, or `PRIORITY GAP`).
- Approved governance changes automatically update the displayed target-role requirements (for example Python 80→85) without altering learner evidence.

This keeps role-readiness calculation in the competency service layer and preserves the existing diagnostic and adaptive-engine boundaries.

### Learner page order
The learner experience is intentionally ordered as: Learner Profile & Role Readiness → Initial Diagnostic Assessment → Diagnostic Result → Competency/Gap → Adaptive Learning → Practice/Verification → Learning assistants → Independent Assessment. The assessment remains the explicit gate before PathPilot calculates the learner's initial competency gap.

## Residual-gap focus fix

The learner dashboard now keeps a concrete learning target whenever a competency gap remains. If every topic has cleared the weak-topic threshold but the learner is still below the role requirement, PathPilot chooses the current lowest-mastered topic for additional learning/practice instead of producing an empty `REASSESS` action.

The active learner dashboard is also competency-specific. Because the current prototype has an initial Python diagnostic, Python is the only competency shown with a diagnosed current score in the adaptive competency chart. Statistics and Data Visualization remain target-role requirements in the learner profile but display as **Not diagnosed** until a competency-specific diagnostic is available. The SQL demo dataset has been removed from this prototype while the adaptive services remain domain-independent.

## Recap Mode reliability update

Recap Mode is optional and appears after at least one learning topic has been completed and the learner returns after 7 or more inactive days. Learner activity is persisted immediately at learning completion and successful verification, rather than relying only on browser unload events. The dashboard also shows whether recap tracking is armed. Recap results remain formative and never silently change official competency, evidence, or the adaptive roadmap.

## On-demand recap

Learners who have completed at least one topic can choose **Take recap now** to launch the same five-question retention check used after seven days of inactivity. The recap remains formative and does not directly change competency or the adaptive roadmap.

## Demo scope

The current demo dataset focuses on Python, Statistics, and Data Visualization. SQL-specific demo competencies, topics, questions, learning modules, and governance controls have been removed; the adaptive architecture itself remains domain-independent.

## Learner progress display + recap reliability fix

The diagnostic result panel now distinguishes the **initial diagnostic baseline** from the learner's **current competency**. Approved mastery evidence updates the current competency and current topic mastery display, while the original diagnostic result remains visible as historical baseline evidence.

Recap Mode is offered only when the learner has a completed/verified topic with a validated question bank. The manual **Take recap now** action uses the same eligibility rules as the automatic inactivity flow, so it cannot silently do nothing for an ineligible learner.

### MCQ safety policy

PathPilot does not use unconstrained runtime AI generation for mastery-critical scoring. Topic mastery and recap checks dynamically select from larger validated topic question banks using a seeded selector. The independent 15-question assessment continues to select dynamically from an approved/published pool. This keeps question selection adaptive without making competency updates depend on unreviewed generated answers.
