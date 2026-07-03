---
name: using-afenda-skills
description: Discovers and invokes Afenda skills, agents, and orchestrator commands. Use when starting a session, when you need to discover which skill or bundle applies, or when the user asks which skill to use. Meta-skill only — not a persona, not an orchestrator.
disable-model-invocation: true
---

# Using Afenda Skills

## Rules vs skills (Cursor)

| | Rules (`.cursor/rules/`) | Skills (`.cursor/skills/`) |
| --- | --- | --- |
| Loaded | Every matching conversation | When relevant, `paths` match, or `/skill-name` |
| Purpose | Always-on conventions (short) | Multi-step workflows |
| Best for | Phase 0 announce, orchestration bans | PAS authority, bundles, gates |

**Do not duplicate** the same instruction in a rule and a skill — rules win on conflict. Full catalog: [README.md](README.md).

**Vendor meta-skill:** In this repo, `/using-afenda-skills` **supersedes** vendor `using-agent-skills` for routing. Vendor phase skills still apply for generic workflow — see [reference/vendor-lifecycle-bridge.md](reference/vendor-lifecycle-bridge.md).

## Skill classes

| Class | Pattern | Invoke |
| --- | --- | --- |
| Meta | `using-*` | `/using-afenda-skills` |
| Bundle | `*-bundle` | Attach or name explicitly |
| Command | `afenda-*` | `/afenda-ship`, `/afenda-review`, … |
| Authority | `*-authority` | Auto via `paths` or Read skill |
| PAS / domain | `pas-*`, `afenda-*`, `*-erp` | `paths` + description |

## Phase discovery (Afenda + vendor)

### Define / Plan

```
Underspecified? ──────────→ vendor interview-me
Rough idea? ──────────────→ vendor idea-refine
Editorial / noir / not ordinary concept? → idea-refine THEN afenda-editorial-lab (SSOT read) before compose
PAS foundation slice? ────→ pas-slice-planner → @afenda-governed-implementer | @afenda-orchestrator
Registry lane change? ────→ @foundation-registry-owner
Docs/matrix drift? ───────→ @documentation-drift
Governance doc author? ───→ kernel-authority/reference/* templates + pas-slice-planner (slice)
Governance doc audit? ────→ @documentation-drift + pas-codebase-bridge + pas-prohibited-surface-scan
SKILL regen from PAS? ────→ kernel-authority/reference/pas-skill-template.md + enterprise-knowledge (vocab)
```

### Build

```
Any code edit? ───────────→ coding-consistency-bundle (mandatory)
Editorial / cinematic / not ordinary UI? → afenda-editorial-bundle (stacks on coding-consistency-bundle)
Promote lab pattern to ERP? ─→ afenda-presentation-promotion (explicit trigger; included in editorial bundle row 6)
Design system inventory? ─→ afenda-presentation-atlas (read-only · /afenda-presentation-atlas)
UI/CSS/visual (ERP, non-editorial)? → afenda-presentation-quality + shadcn-studio (PAS-006 · ADR-0027)
Storybook agentic rebuild / pilot catalog? → afenda-storybook-agentic-setup + afenda-storybook
MCP block / CLI install? ─→ shadcn-studio (`/cui` `/rui`) → `components-quarantine/` first → promotion pipeline ([`components-quarantine/README.md`](../../../packages/shadcn-studio/src/components-quarantine/README.md))
components-ui primitive? ─→ afenda-primitive-contract + ui-primitive-mismatch-frame rule (+ studio:shadcn — no overwrite)
ERP React/TS refactor? ───→ afenda-react-surface-quality (B→A→T scan)
ERP bundle / lazy-load / perf? → afenda-shadcn-performance (+ /afenda-webperf for audit)
Kernel boundary? ─────────→ kernel-authority
Dead code / Knip / housekeeping? → afenda-repo-housekeeping (removal → afenda-monorepo-refactor Slice D)
Enterprise knowledge? ────→ enterprise-knowledge
Drizzle migrations? ──────→ afenda-drizzle-migration
Multi-tenancy? ───────────→ multi-tenancy-erp
Next.js / App Router / BFF? → erp-module-foundation-authority FIRST, then afenda-nextjs-best-practice
  Module layout / force-dynamic / _components → reference/erp-module-frontend-layout.md
  Route lab (@afenda/developer)? → afenda-nextjs-best-practice reference/developer-route-lab-parity.md — **ERP production parity**; auth/spine/BFF/deploy **only** exclusions — never “lab lite”
  Runtime verify → next-devtools MCP get_routes + get_errors (ERP 3000 · developer 3002)
Library API uncertain? ───→ Context7 MCP (resolve ID → query docs)
```

### Verify / Review / Ship

```
Tests / coverage? ────────→ /afenda-test (+ vendor test-driven-development)
Accessibility audit? ───→ vendor `web-accessibility` (+ Storybook addon-a11y on changed stories)
Editorial login / Auth Login Lab verify? → Storybook MCP preview URL + [editorial-login-quality.md](reference/editorial-login-quality.md) checklist
Pre-merge review? ────────→ /afenda-review
Ship go/no-go? ───────────→ /afenda-ship
Web perf audit? ──────────→ /afenda-webperf
PAS parallel batch? ──────→ @afenda-orchestrator + /afenda-batch
Governance audit + fix? ──→ /afenda-governance-audit-repair (or @afenda-orchestrator batch type governance-audit-repair)
PAS-001 / 001A / 001B catalog audit? → /pas-kernel-audit-orchestrator (or @afenda-orchestrator batch type pas-kernel-audit-catalog)
Adversarial review? ──────→ vendor doubt-driven-development
Deprecation? ─────────────→ vendor deprecation-and-migration
Browser DevTools? ────────→ vendor browser-testing-with-devtools
Platform audit? ──────────→ enterprise-architecture-audit + orchestrator
```

## Mandatory bundles

| Bundle | When |
| --- | --- |
| `coding-consistency-bundle` | Any implementer file edit |
| `afenda-editorial-bundle` | Editorial / Swiss Noir / Verdant / Presentation Lab / not ordinary UI code edits (stacks on coding-consistency-bundle) |
| `afenda-presentation-quality` + `shadcn-studio` | ERP UI, CSS, Storybook, or `@afenda/shadcn-studio` changes (non-editorial Phase 1) |
| `afenda-presentation-promotion` | Explicit lab → auth-shell → ERP promotion only (row 6 inside editorial bundle when triggered) |
| `afenda-primitive-contract` | `packages/shadcn-studio/src/components/ui/**` edits or shadcn primitive install |
| `afenda-react-surface-quality` | ERP React refactor, AI TSX review, perf/structure/a11y before merge |
| `afenda-tailwind` | ERP `globals.css`, theme CSS, Tailwind `className` edits |
| `afenda-shadcn-performance` | Bundle size, `next/dynamic`, CVA trim, lazy-load, perf regression on studio/ERP UI |

**Removed (ADR-0027 · 2026-07-02):** `ui-consistency-bundle`, `govern-primitive`, `css-authority`, `afenda-shadcn-components`, `afenda-ui-quality`, `enterprise-frontend-audit` — use PAS-006 replacements in [NATIVE-EVALUATION.md](../NATIVE-EVALUATION.md). Do not attach retired skills for ERP frontend work.

Orchestrators paste bundle read lists into implementer prompts — personas do not invoke bundles when `readonly: true`.

## Commands

| Intent | Entry |
| --- | --- |
| Code review | `/afenda-review` or `@afenda-code-reviewer` |
| Ship | `/afenda-ship` |
| Tests | `/afenda-test` |
| Web perf | `/afenda-webperf` |
| PAS batch | `@afenda-orchestrator` + `/afenda-batch` |
| Governance audit repair loop | `/afenda-governance-audit-repair` or `@afenda-orchestrator` + `governance-audit-repair` |
| PAS kernel catalog audit (001 / 001A / 001B) | `/pas-kernel-audit-orchestrator` or `@afenda-orchestrator` + `pas-kernel-audit-catalog` |
| Which skill? | `/using-afenda-skills` |

## OSS fallback

When no native skill matches:

```bash
npx skills find <query>
```

Install only into `vendor/` after [EVALUATION.md](../vendor/EVALUATION.md) scoring. Never drop OSS skills into native root.

## Orchestration (hard stops)

From [orchestration-patterns.md](../references/orchestration-patterns.md):

1. User or slash-command orchestrates — personas do not call personas
2. Only endorsed fan-out: parallel reports → merge (`/afenda-ship`)
3. No meta-router persona or persona chains

## Quick lanes

| Lane | Entry |
| --- | --- |
| Governed implementation | `@afenda-governed-implementer` |
| Architecture / registries | `architecture-authority` |
| `@afenda/shadcn-studio` inventory / imports | `afenda-presentation-atlas` |
| ERP presentation (ADR-0027) | `afenda-presentation-quality` + `shadcn-studio` |
| Storybook agentic pilot / lab reset | `afenda-storybook-agentic-setup` + `afenda-storybook` |
| Route lab (`apps/developer`) | `afenda-nextjs-best-practice` + [developer-route-lab-parity](../afenda-nextjs-best-practice/reference/developer-route-lab-parity.md) — ERP-parity frontend; auth/spine only |
| Tailwind v4 / Phase 1 CSS (ERP) | `afenda-tailwind` |
| shadcn bundle / lazy-load / perf | `afenda-shadcn-performance` |
| SAP/Oracle gates | `enterprise-erp-standards` |
| Accessibility | vendor `web-accessibility` |
| MCP quarantine → promotion | [`components-quarantine/README.md`](../../../packages/shadcn-studio/src/components-quarantine/README.md) + `shadcn-studio` · `pnpm studio:quarantine` · `pnpm studio:promote` |
| Editorial / Swiss Noir / Verdant / not ordinary | `afenda-editorial-bundle` (or `/afenda-editorial-bundle`) |
| Lab → ERP auth promotion | `afenda-presentation-promotion` (explicit trigger only) |

## Editorial interface routing

Route **before** generic UI/CSS/shadcn skills when editorial terms appear.

| User request contains | Required skill route |
| --- | --- |
| Swiss Noir, Verdant Milk Noir | `afenda-editorial-bundle` |
| editorial, cinematic, noir, **not ordinary**, control room, verification chamber | same |
| identity vault, ghost hero, floating jewel, gold hairline | same |
| Presentation Lab, Auth Login Lab | same |
| login page pattern (editorial) | same — not shadcn `/iui` as aesthetic source of truth |
| promote to ERP, wire sign-in, production auth pattern | `afenda-presentation-promotion` |
| stock shadcn block install only | `shadcn-studio` |
| ERP Phase 1 default surface (non-editorial) | `afenda-presentation-quality` + `shadcn-studio` |

When editorial terms appear, `/iui` may inform structure but **cannot** be the aesthetic source of truth. Do not install or route raw OSS `frontend-design` skills for Afenda editorial work.

**Do not merge** editorial skills into `afenda-presentation-quality`.

**Removed ERP UI skills (2026-07-02):** `govern-primitive`, `ui-consistency-bundle`, `afenda-shadcn-components`, `afenda-ui-quality` — use `afenda-presentation-quality` + `shadcn-studio` + active `afenda-tailwind`. Skill removal map: [NATIVE-EVALUATION.md](../NATIVE-EVALUATION.md).

## Editorial quality gates (login + lab)

After routing to `afenda-editorial-bundle`, apply [reference/editorial-login-quality.md](reference/editorial-login-quality.md):

1. **Pattern ID bridge** — registry ID (`verdant-milk-identity-vault`) ≠ contract slug (`verdant-milk-noir`); state both in Phase 0.
2. **Stage discipline** — lab login = `A-lab`; ERP `/sign-in` stays `login-page-04` until `C-erp` + explicit promotion.
3. **Confusion stops** — copy v1 vs v2, OAuth gap, dual CSS import — stop and name; see reference backlog table.
4. **Verify** — Storybook preview evidence (URL or MCP `preview-stories`) + contract tests + css-dist sync when noir CSS changes.

Full editorial lifecycle map: [reference/vendor-lifecycle-bridge.md](reference/vendor-lifecycle-bridge.md).

Full inventory: [README.md](README.md).
