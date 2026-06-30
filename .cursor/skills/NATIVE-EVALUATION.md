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
| `write-arch-slice` | **remove** | Deprecated; superseded by PAS slice workflow (`pas-slice-planner`, `afenda-governed-implementer`) |
| `afenda-batch` | **remove** | Deprecated; superseded by `/afenda-batch` + `@afenda-orchestrator` |
| `afenda-css-tailwind-stylelint` | **merged → `afenda-tailwind`** | Consolidated Afenda Tailwind authority |
| `tailwindcss-v4` | **merged → `afenda-tailwind`** | v4 API moved to `reference/v4-api.md` |
| `tailwind-validator` | **merged → `afenda-tailwind`** | Script at `scripts/validate-tailwind-v4.py` |
| `frontend-tailwind-best-practices` | **remove** | Stale patterns (`v-stack`, wrong paths); not Afenda-aligned |
| `tailwind-utility-classes` | **remove** | Generic v3 tutorial; conflicts with governed UI |
| `error-handling` | **rename → `platform-error-handling`** | Platform class prefix (2026-06-29) |
| `type-safety` | **rename → `platform-type-safety`** | Platform class prefix (2026-06-29) |
| `schema-validation` | **rename → `platform-schema-validation`** | Platform class prefix (2026-06-29) |
| `test-coverage` | **rename → `platform-test-coverage`** | Platform class prefix (2026-06-29) |
| `observability-usage` | **rename → `platform-observability-usage`** | Platform class prefix (2026-06-29) |
| `cross-boundary-anti-pattern-scan` | **rename → `platform-cross-boundary-anti-pattern-scan`** | Platform class prefix (2026-06-29) |
| `api-contract` | **rename → `platform-api-contract`** | Platform class prefix (2026-06-29) |
| `afenda-css-tailwind-stylelint` | **remove** (re-run) | Stale copy; merged into `afenda-tailwind` |

---

## Keep — generic / reference skills (user decision 2026-06-28)

Retained for coding reference even without heavy Afenda wiring:

| Skill | Status |
| --- | --- |
| `css-architecture` | keep |
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
| `afenda-tailwind` | **keep** | 2026-06-29 consolidated; **reinstated PAS-006 Phase 1** 2026-06-30 (replaces retired legacy-ui copy) |
| `afenda-presentation-quality` | **keep** | 2026-06-30 — PAS-006 composer; Phase 1 CSS doctrine; replaces ui-consistency-bundle |
| `enterprise-architecture-audit` | **keep** | 2026-06-28 — read-only full-stack platform audit |
| `enterprise-architecture-auditor` | **keep** | 2026-06-28 — phase worker agent |
| `enterprise-architecture-audit-orchestrator` | **keep** | 2026-06-28 — deterministic 8-phase audit orchestrator |
| `afenda-governance-audit-repair` | **keep** | 2026-06-30 — governance audit + cluster repair loop; orchestrator batch type |

---

## Vendor evaluation (2026-06-28)

Completed — full scores in [`.cursor/skills/vendor/EVALUATION.md`](vendor/EVALUATION.md).

| Decision | Count |
| --- | ---: |
| keep | 10 |
| merge (Phase 7b) | 7 |
| drop | 7 |

Promoted references: `security-checklist.md`, `performance-checklist.md` → `.cursor/references/`.

---

## Cursor-aligned catalog (2026-06-29)

Restructure executed per [`.cursor/skills/README.md`](README.md) and [`.cursor/rules/skills-routing.mdc`](../rules/skills-routing.mdc).

### Rules vs skills

| Layer | Location | Role |
| --- | --- | --- |
| Rules | `.cursor/rules/` | Always-on, short conventions |
| Skills | `.cursor/skills/` | On-demand workflows via `description`, `paths`, or `/skill-name` |
| Personas | `.cursor/agents/` | Who — not skill workflows |
| References | `.cursor/references/` | Checklists promoted from vendor eval |

Meta router: `using-afenda-skills` (`disable-model-invocation: true`). Do not duplicate bundle Phase 0 text in rules.

### Naming classes

| Class | Pattern | `paths` | `disable-model-invocation` |
| --- | --- | --- | --- |
| Meta | `using-*` | omit | `true` |
| Bundle | `*-bundle` | implementer globs | `true` |
| Command | `afenda-ship`, `afenda-review`, … | omit | `true` |
| Authority | `*-authority` | package + PAS doc globs | omit (auto via paths) |
| PAS | `pas-*` | `docs/PAS/**` | usually `true` |
| Afenda domain | `afenda-*` | lane globs | usually `true` |
| ERP | `*-erp` | `apps/erp/**` + domain packages | `true` |
| Enterprise | `enterprise-*` | scope globs | `true` |
| Platform | `platform-*` | broad globs | `true` |
| Reference | catalog-tagged | omit | `true` |

**Filesystem:** flat `.cursor/skills/<name>/` — no physical nesting (100+ hardcoded paths).

### `paths` frontmatter policy

- Added to authority, PAS, domain, ERP, and platform skills (2026-06-29 batch).
- Omitted on meta, bundles, commands, and reference skills (`supabase`, `css-architecture`).
- Authority skills: removed redundant `disable-model-invocation: false` so path-scoped discovery works.

### `/migrate-to-skills` audit

Not run as a Cursor command — manual audit instead:

- **Keep as rules:** `afenda-coding-session.mdc`, `agent-orchestration.mdc`, `agent-discipline.mdc`, `agent-multi-file.mdc`, path-scoped `.mdc` (governed-ui, CSP, etc.).
- **New rule from audit:** `skills-routing.mdc` (globs: `.cursor/skills/**/SKILL.md`).
- **Do not migrate:** always-on session rules into skills (would duplicate Phase 0).

### Deferred (optional)

- Trim `afenda-coding-session.mdc` to link-only vs skill body — **done 2026-06-29**
- Platform skill renames — **done 2026-06-29** (`platform-*` prefix)
- Anatomy pass: Verification sections on all bundles/commands — **done 2026-06-29**

