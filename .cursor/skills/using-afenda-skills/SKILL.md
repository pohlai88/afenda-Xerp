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
Design system inventory? ─→ afenda-presentation-atlas (read-only · /afenda-presentation-atlas)
UI/CSS/visual (ERP)? ───→ afenda-presentation-quality + shadcn-studio (PAS-006 · ADR-0027)
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
  Runtime verify → next-devtools MCP get_routes + get_errors (port 3000)
Library API uncertain? ───→ Context7 MCP (resolve ID → query docs)
```

### Verify / Review / Ship

```
Tests / coverage? ────────→ /afenda-test (+ vendor test-driven-development)
Accessibility audit? ───→ afenda-accessibility (+ Storybook addon-a11y on changed stories)
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
| `afenda-presentation-quality` + `shadcn-studio` | ERP UI, CSS, Storybook, or `@afenda/shadcn-studio` changes |
| `afenda-primitive-contract` | `packages/shadcn-studio/src/components/ui/**` edits or shadcn primitive install |
| `afenda-react-surface-quality` | ERP React refactor, AI TSX review, perf/structure/a11y before merge |
| `afenda-tailwind` | ERP `globals.css`, theme CSS, Tailwind `className` edits |
| `afenda-shadcn-performance` | Bundle size, `next/dynamic`, CVA trim, lazy-load, perf regression on studio/ERP UI |

**Retired for ERP (ADR-0027):** `ui-consistency-bundle`, `govern-primitive`, `css-authority`, `afenda-shadcn-components` — archived under `.cursor/skills/_retired/legacy-ui/`. Do not attach for ERP frontend work.

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
| Tailwind v4 / Phase 1 CSS (ERP) | `afenda-tailwind` |
| shadcn bundle / lazy-load / perf | `afenda-shadcn-performance` |
| SAP/Oracle gates | `enterprise-erp-standards` |
| Accessibility | `afenda-accessibility` |

**Retired for ERP UI:** `govern-primitive`, `ui-consistency-bundle`, `afenda-shadcn-components`, legacy `afenda-tailwind` under `_retired/legacy-ui/` — use `afenda-presentation-quality` + `shadcn-studio` + active `afenda-tailwind` instead.

Full inventory: [README.md](README.md).
