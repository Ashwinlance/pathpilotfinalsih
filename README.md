# PathPilot

**AI-Powered Competency Intelligence & Adaptive Learning Platform**

PathPilot is a from-scratch prototype that demonstrates a closed adaptive competency loop:

**Diagnose → Gap → Prerequisite → Adapt → Learn → Verify → Evidence → Update → Recalculate → Next Action**

It is intentionally **not** a generic LMS. Its main job is to explain what a learner knows, what they are missing, why they are missing it, and what should happen next.

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
5. Mark learning complete.
6. Run the deterministic verification.
7. A passing verification creates approved evidence.
8. Competency moves **48 → 62**.
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
