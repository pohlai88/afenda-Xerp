# Native Skill Evaluation (`.cursor/skills/`)

Decisions recorded 2026-06-28. Vendor eval: `.cursor/skills/vendor/EVALUATION.md`.

**Decision values:** `keep` | `remove` | `human_review` | `merged`

---

## Executed removals

| Skill / agent | Decision | Reason |
| --- | --- | --- |
| `pas-slice-planner` | **remove** | Superseded by PAS; TIP lane retired |
| `pas-slice-planner-slice` | **remove** | Superseded by `pas-slice-planner` + `pas-slice-template` |
| `pas-slice-planner` / `pas-slice-planner` | **retired stub** | Redirect to `pas-slice-planner` |
| `tip-slice-implementer` | **retired stub** | Redirect to `afenda-governed-implementer` |
| `afenda-governed-implementer` / `pas-slice-planner` | **retired stub** | Redirect to `afenda-governed-implementer` |
| `afenda-orchestrator` | **retired stub** | Redirect to `afenda-orchestrator` |
| `afenda-batch` | **retired stub** | Redirect to `/afenda-batch` |
| `afenda-fumadocs` | **remove** | No effect; use `docs-editorial-design` |
| `csp` | **merged → `csp-third-party`** | Single ERP CSP skill |
| `xforge-nextjs-vercel` | **remove** | Stale `apps/app` paths; no repo wiring |
| `afenda-implementation-health` | **remove** | Merged into `@afenda-governed-implementer`; monorepo-refactor updated |

---

## Keep — generic / reference skills (user decision 2026-06-28)

Retained for coding reference even without heavy Afenda wiring:

| Skill | Status |
| --- | --- |
| `write-arch-slice` | keep (retired stub — redirect only) |
| `css-architecture` | keep |
| `frontend-tailwind-best-practices` | keep |
| `tailwindcss-v4` | keep |
| `tailwind-validator` | keep |
| `tailwind-utility-classes` | keep |
| `supabase` | keep |
| `supabase-postgres-best-practices` | keep |

---

## Keep — refactor chain

| Skill | Status |
| --- | --- |
| `afenda-monorepo-refactor` | **keep** — stabilize → `@afenda-governed-implementer` |

---

## Keep — authority + bundles

`coding-consistency-bundle`, `ui-consistency-bundle`, PAS authority skills, PAS writers, UI chain, security skills, orchestration commands (`afenda-ship`, `using-afenda-skills`, etc.).

| Skill / agent | Status | Added |
| --- | --- | --- |
| `enterprise-architecture-audit` | **keep** | 2026-06-28 — read-only full-stack platform audit |
| `enterprise-architecture-auditor` | **keep** | 2026-06-28 — phase worker agent |
| `enterprise-architecture-audit-orchestrator` | **keep** | 2026-06-28 — deterministic 8-phase audit orchestrator |

---

## Vendor evaluation (2026-06-28)

Completed — full scores in [`.cursor/skills/vendor/EVALUATION.md`](vendor/EVALUATION.md).

| Decision | Count |
| --- | ---: |
| keep | 10 |
| merge (Phase 7b) | 7 |
| drop | 7 |

Promoted references: `security-checklist.md`, `performance-checklist.md` → `.cursor/references/`.
