# Afenda Skills Catalog

Machine-readable index for agents and humans. **Do not load this entire file into context** — use [`using-afenda-skills/SKILL.md`](using-afenda-skills/SKILL.md) for routing.

**Cursor compliance:** [Rules vs skills](https://cursor.com/learn/customizing-agents) — rules (`.cursor/rules/`) are always-on and minimal; skills load on-demand via `description`, `paths`, or explicit `/skill-name`. Do not duplicate the same instruction in both.

**Naming:** directory name = YAML `name` (lowercase hyphens). See [Naming standard](#naming-standard) below.

---

## How to route

1. User message or `/using-afenda-skills` → read meta-skill discovery tree
2. Any implementer code edit → `coding-consistency-bundle` (mandatory)
3. Editorial / Swiss Noir / Verdant / not ordinary → `afenda-editorial-bundle` (+ `coding-consistency-bundle` for edits)
   - Login lab quality gates → [using-afenda-skills/reference/editorial-login-quality.md](using-afenda-skills/reference/editorial-login-quality.md)
   - Vendor phase overlay → [using-afenda-skills/reference/vendor-lifecycle-bridge.md](using-afenda-skills/reference/vendor-lifecycle-bridge.md)
4. ERP UI/CSS (non-editorial) → `afenda-presentation-atlas` → `shadcn-studio` + `afenda-presentation-quality` + PAS-006 (ADR-0027)
5. Full inventory → this file

---

## Meta and bundles

| Skill | Class | `paths` | Trigger | Gates |
| --- | --- | --- | --- | --- |
| `using-afenda-skills` | Meta | — | Session start, "which skill applies?" | — |
| `coding-consistency-bundle` | Bundle | `packages/**`, `apps/**`, `scripts/**` | Any implementer file edit | Phase 0 + bundle preflight |
| `afenda-editorial-bundle` | Bundle | presentation-lab, storybook noir, swiss/verdant CSS | Editorial UI code edit | Auto-route via `paths` + trigger phrases; stacks on coding-consistency-bundle |

`coding-consistency-bundle`: `disable-model-invocation: true` — explicit attach or slash only.

`afenda-editorial-bundle`: **auto-invokes** when `paths` match or editorial trigger terms appear with a code edit (no `disable-model-invocation`).

`afenda-presentation-promotion`: `disable-model-invocation: true` — explicit promote/wire only.

**Removed (ADR-0027 · 2026-07-02):** `ui-consistency-bundle`, `govern-primitive`, `css-authority`, `afenda-shadcn-components`, `afenda-ui-quality`, `enterprise-frontend-audit` — replacement map in [NATIVE-EVALUATION.md](NATIVE-EVALUATION.md).

---

## Commands (explicit invoke)

| Skill | Slash | Class | Trigger |
| --- | --- | --- | --- |
| `afenda-ship` | `/afenda-ship` | Command | Pre-merge go/no-go |
| `afenda-review` | `/afenda-review` | Command | Single-perspective review |
| `afenda-test` | `/afenda-test` | Command | Test strategy / coverage |
| `afenda-batch` | `/afenda-batch` | Command | PAS parallel batch manifest |
| `afenda-governance-audit-repair` | `/afenda-governance-audit-repair` | Command | Governance audit + identical-finding repair loop |
| `pas-kernel-audit-orchestrator` | `/pas-kernel-audit-orchestrator` | Command | PAS-001 / 001A / 001B AUD-XX catalog wave audit + repair |
| `afenda-webperf` | `/afenda-webperf` | Command | Web performance audit |

All commands: `disable-model-invocation: true`.

---

## Define / Plan

| Skill | Class | `paths` | Trigger |
| --- | --- | --- | --- |
| `pas-slice-planner` | PAS | `docs/PAS/**`, `packages/architecture-authority/**` | PAS slice planning, handoffs |
| `pas-codebase-bridge` | PAS | `docs/PAS/**`, `packages/**` | PAS ↔ codebase alignment |
| `pas-prohibited-surface-scan` | PAS | `packages/**`, `docs/PAS/**` | Prohibited surface audit |
| vendor `interview-me` | Vendor | — | Underspecified request |
| vendor `idea-refine` | Vendor | — | Rough idea before PAS slice |

---

## Build — Authority (PAS constitutional)

| Skill | Class | `paths` | Trigger | Gates |
| --- | --- | --- | --- | --- |
| `architecture-authority` | Authority | `packages/architecture-authority/**`, `packages/architecture-authority/src/data/foundation-disposition.registry.ts` | Registries, layer rules, disposition | `pnpm quality:architecture` |
| `kernel-authority` | Authority | `packages/kernel/**`, `docs/PAS/PAS-001*.md` | Kernel boundary | kernel gates |
| `accounting-standards-authority` | Authority | `packages/accounting-standards/**`, `docs/PAS/ACCOUNTING-STANDARDS/**` | Accounting standards | — |
| `shadcn-studio` | Authority | `packages/shadcn-studio/**`, `docs/PAS/PRESENTATION/**`, `apps/erp/**` | PAS-006 ERP presentation (ADR-0027) | `pnpm check:downstream-integration` |
| `enterprise-knowledge` | Enterprise | `packages/enterprise-knowledge/**`, `docs/PAS/ENTERPRISE-KNOWLEDGE/**` | Knowledge atoms, PAS-004 | `pnpm check:knowledge-conformance` |
| `enterprise-erp-standards` | Enterprise | `packages/**`, `apps/erp/**` | SAP/Oracle red-amber gates | — |

**Removed authority (ADR-0027):** `css-authority`, `shadcn-studio-authority` (PAS-005A doc path), `govern-primitive` — use `shadcn-studio` + `afenda-tailwind` + PAS-006 docs.

---

## Build — UI / CSS / Design (ERP — ADR-0027)

| Skill | Class | `paths` | Trigger | Gates |
| --- | --- | --- | --- | --- |
| `shadcn-studio` | UI MCP | `packages/shadcn-studio/**`, `apps/erp/**`, `apps/storybook/**` | MCP install, blocks, ERP wiring | `pnpm --filter @afenda/shadcn-studio typecheck`, `pnpm check:studio-metadata-binding` |
| `afenda-primitive-contract` | UI authority | `packages/shadcn-studio/src/components-ui/**` | Primitive contract + M1–M10 mismatch E0 · `pnpm studio:shadcn` | `pnpm check:studio-primitive-contracts` |
| `afenda-react-surface-quality` | UI review | `apps/erp/**`, `packages/shadcn-studio/**` | ERP React/TS B→A→T scan · refactor proof | `pnpm typecheck`, `pnpm test:interaction` |
| `afenda-presentation-quality` | UI composer | `apps/erp/**`, `packages/shadcn-studio/**` | PAS-006 gate bundle · Phase 1 CSS doctrine · replaces retired ui-consistency-bundle | PAS-006 gates (see skill) |
| `afenda-tailwind` | Afenda domain | `**/*.css`, `apps/erp/**`, `packages/shadcn-studio/**` | PAS-006 Phase 1 Tailwind · import-only globals.css | `pnpm quality:css`, `pnpm check:downstream-integration` |
| `afenda-shadcn-performance` | Afenda domain | `apps/erp/**`, `packages/shadcn-studio/**`, `apps/storybook/**` | Bundle, lazy-load, CVA, Tailwind JIT + React perf synergy | `pnpm --filter @afenda/erp analyze`, typecheck, build |
| `afenda-primitive-contract` | Afenda domain | `packages/shadcn-studio/src/components-ui/**` | 2-file contract + adapter; mismatch frame; no shadcn overwrite | `pnpm check:studio-primitive-contracts` |
| `afenda-react-surface-quality` | Afenda domain | `apps/erp/**`, studio blocks | B/A/C/T React/TS scan for ERP surfaces | typecheck, `pnpm test:interaction` |
| `package-css-dist-sync` | UI infra | `packages/shadcn-studio/src/styles/**` | shadcn-studio CSS dist sync | `pnpm check:package-css-dist-sync` |
| `afenda-storybook` | UI | `apps/storybook/**` | shadcn-studio Storybook lab | `pnpm --filter @afenda/storybook storybook:build` |
| `afenda-presentation-atlas` | Reference | `packages/shadcn-studio/**`, `apps/storybook/**` | `@afenda/shadcn-studio` design system map — primitives, blocks, exports | — |
| `afenda-editorial-lab` | UI authority | `packages/shadcn-studio/docs/**`, `storybook/**`, presentation-lab presets | Swiss Noir, Verdant Milk, editorial, cinematic, noir, not ordinary | Read SSOT + [reference/pattern-and-doctrine.md](afenda-editorial-lab/reference/pattern-and-doctrine.md) |
| `afenda-editorial-compose` | UI workflow | `packages/shadcn-studio/src/storybook/**`, noir CSS, presentation-lab stories | Governed editorial implementation after lab skill | Preview URL mandatory · [reference/workflow-templates.md](afenda-editorial-compose/reference/workflow-templates.md) |
| `afenda-presentation-promotion` | UI workflow | `apps/erp/**`, `components-auth-shell/**`, auth registries | Explicit promote / wire ERP sign-in only | Stage C gates · [reference/stage-checklists.md](afenda-presentation-promotion/reference/stage-checklists.md) |
| `docs-editorial-design` | Docs UI (planned) | `apps/docs/**` | Fumadocs prose editorial — **not ERP UI**; ERP editorial = `afenda-editorial-lab` | — |
| MCP quarantine inbox | Workflow | `packages/shadcn-studio/src/components-quarantine/**` | Raw MCP/CLI landing — promote per PAS-006B before ERP export | — |

---

## Build — ERP domain

| Skill | Class | `paths` | Trigger |
| --- | --- | --- | --- |
| `multi-tenancy-erp` | ERP | `packages/kernel/**`, `packages/database/**`, `apps/erp/**` | Tenant context, RLS |
| `afenda-nextjs-best-practice` | ERP | `apps/erp/**`, `apps/docs/**` | Module-first App Router, force-dynamic modules, manifest surfaces, MCP |
| `rbac-erp` | ERP | `packages/permissions/**`, `apps/erp/**` | RBAC, grants |
| `better-auth-erp` | ERP | `apps/erp/**`, `packages/auth/**` | Better Auth integration |
| `csp-third-party` | ERP security | `apps/erp/src/proxy.ts`, `apps/erp/src/lib/security/**` | CSP, third-party scripts |
| `server-action-security` | ERP security | `apps/erp/**` | Server actions, auth |
| `pino-erp-logger` | ERP ops | `apps/erp/**`, `packages/observability/**` | Structured logging |
| `afenda-openapi` | ERP API | `apps/erp/src/server/api/**` | OpenAPI contracts |
| `platform-api-contract` | Platform | `apps/erp/src/server/**`, `packages/**/contracts/**` | API contract shape |

---

## Build — Platform / cross-cutting

| Skill | Class | `paths` | Trigger |
| --- | --- | --- | --- |
| `afenda-coding-session` | Session | — (via bundle) | Implementer execution contract |
| `afenda-drizzle-migration` | Afenda domain | `packages/database/**`, `**/drizzle/**` | Drizzle migrations |
| `afenda-docs-writing` | Docs | `docs/**` | PAS/ADR prose |
| `monorepo-discipline` | Platform | `packages/**`, `pnpm-workspace.yaml`, `turbo.json` | Package scaffold, boundaries |
| `env-var-governance` | Platform | `apps/erp/**`, `**/.env*` | Env vars, secrets |
| `platform-error-handling` | Platform | `packages/**`, `apps/**` | Error taxonomy |
| `platform-type-safety` | Platform | `**/*.{ts,tsx}` | TypeScript discipline |
| `platform-schema-validation` | Platform | `**/*.{ts,tsx}` | Zod schemas |
| `platform-test-coverage` | Platform | `**/*.{test,spec}.{ts,tsx}` | Coverage gaps |
| `platform-observability-usage` | Platform | `packages/observability/**`, `apps/erp/**` | Logs, metrics |
| `platform-cross-boundary-anti-pattern-scan` | Platform | `packages/**` | Cross-package anti-patterns |
| `afenda-monorepo-refactor` | Refactor | `packages/**` | Stabilize → implementer |
| `afenda-repo-housekeeping` | Refactor | `knip.jsonc`, `packages/**`, `apps/**` | Knip audit → Slice D delegate |

---

## Verify / Review / Ship

| Skill | Class | `paths` | Trigger |
| --- | --- | --- | --- |
| `afenda-test` | Command | — | `/afenda-test` |
| `enterprise-architecture-audit` | Audit | — | Full platform audit (read-only) |
| `afenda-governance-audit-repair` | Audit+Repair | `packages/**`, `apps/**`, `docs/PAS/**` | Governance audit loop until PASS |
| `pas-kernel-audit-orchestrator` | Audit+Repair | `docs/PAS/KERNEL/audit/**`, `packages/kernel/**` | PAS-001 / 001A / 001B AUD-XX catalog waves |
| vendor `test-driven-development` | Vendor | — | TDD / Prove-It (wired in `/afenda-test`) |
| vendor `code-review-and-quality` | Vendor | — | Five-axis review (wired in `/afenda-review`) |
| vendor `security-and-hardening` | Vendor | — | Security audit persona |
| vendor `performance-optimization` | Vendor | — | Wired in `/afenda-webperf` |
| vendor `shipping-and-launch` | Vendor | — | Wired in `/afenda-ship` |

---

## Reference (on-demand only)

| Skill | Class | Notes |
| --- | --- | --- |
| `css-architecture` | Reference | BEM/SMACSS patterns; not Afenda authority |
| `supabase` | Reference | Supabase OSS; use when touching Supabase |
| `supabase-postgres-best-practices` | Reference | Postgres via Supabase lens |

Install OSS skills via `npx skills find <query>` — add to `vendor/` only after [`vendor/EVALUATION.md`](vendor/EVALUATION.md) scoring. Never copy OSS into native root without eval.

---

## Personas (not skills)

Personas live in [`.cursor/agents/`](../agents/) — orchestration layer, not skill workflows:

| Persona | When |
| --- | --- |
| `@afenda-governed-implementer` | Governed PAS implementation |
| `@afenda-orchestrator` | PAS parallel batches |
| `@foundation-registry-owner` | Registry mutations |
| `@afenda-code-reviewer` | Pre-merge review |
| `/afenda-ship` fan-out personas | See `afenda-ship` skill |

---

## Naming standard

| Class | Pattern | `disable-model-invocation` | `paths` |
| --- | --- | --- | --- |
| Meta | `using-*` | `true` | omit |
| Bundle | `*-bundle` | `true` | implementer globs |
| Command | `afenda-*` (matches slash) | `true` | omit |
| Authority | `*-authority` | omit or `false` | package + PAS doc globs |
| PAS | `pas-*` | `true` | `docs/PAS/**` |
| Afenda domain | `afenda-*` | usually `true` | lane globs |
| ERP | `*-erp` | `true` | `apps/erp/**`, domain packages |
| Enterprise | `enterprise-*` | `true` | scope globs |
| Platform | `platform-*` | `true` | broad globs |
| Reference | catalog-tagged (`afenda-presentation-atlas`, …) | `true` | optional scope globs |

**Platform skills** use the `platform-*` prefix (2026-06-29 rename from unprefixed cross-cutting skills).

**Anatomy:** SKILL.md under 500 lines; `reference/` for depth; `scripts/` for validators. Test descriptions in a fresh chat (YAML frontmatter only).

**Migration:** Run `/migrate-to-skills` once to audit eligible rules — do not migrate the five `alwaysApply: true` session rules or path-scoped `.mdc` files.

---

## Shared references (not skills)

| File | Purpose |
| --- | --- |
| [`.cursor/references/orchestration-patterns.md`](../references/orchestration-patterns.md) | Fan-out, persona rules |
| [`.cursor/references/security-checklist.md`](../references/security-checklist.md) | Security review |
| [`.cursor/references/performance-checklist.md`](../references/performance-checklist.md) | Performance review |

---

Last updated: 2026-06-29 — platform-* renames, rule trim, Verification anatomy on bundles/commands.
