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
UI/CSS/visual (ERP)? ───→ shadcn-studio + PAS-006 (ADR-0027)
Kernel boundary? ─────────→ kernel-authority
Enterprise knowledge? ────→ enterprise-knowledge
Drizzle migrations? ──────→ afenda-drizzle-migration
Multi-tenancy? ───────────→ multi-tenancy-erp
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
Adversarial review? ──────→ vendor doubt-driven-development
Deprecation? ─────────────→ vendor deprecation-and-migration
Browser DevTools? ────────→ vendor browser-testing-with-devtools
Platform audit? ──────────→ enterprise-architecture-audit + orchestrator
```

## Mandatory bundles

| Bundle | When |
| --- | --- |
| `coding-consistency-bundle` | Any implementer file edit |
| `ui-consistency-bundle` | UI, CSS, or visual changes |

Orchestrators paste bundle read lists into implementer prompts — personas do not invoke bundles when `readonly: true`.

## Commands

| Intent | Entry |
| --- | --- |
| Code review | `/afenda-review` or `@afenda-code-reviewer` |
| Ship | `/afenda-ship` |
| Tests | `/afenda-test` |
| Web perf | `/afenda-webperf` |
| PAS batch | `@afenda-orchestrator` + `/afenda-batch` |
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
| Tailwind v4 | `afenda-tailwind` |
| SAP/Oracle gates | `enterprise-erp-standards` |
| shadcn promotion | `afenda-shadcn-components` |
| Accessibility | `afenda-accessibility` |

Full inventory: [README.md](README.md).
