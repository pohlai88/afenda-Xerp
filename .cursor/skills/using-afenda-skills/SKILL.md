---
name: using-afenda-skills
description: Discovers and invokes Afenda skills, agents, and orchestrator commands. Use when starting a session or when you need to discover which skill, persona, or bundle applies to the current task. Meta-skill only — not a persona, not an orchestrator.
---

# Using Afenda Skills

## Overview

Afenda encodes engineering workflow in **skills** (how), **personas** (who), and **commands** (when). This meta-skill routes tasks to the correct entry point without loading all 57+ skills into context.

## Discovery tree

When a task arrives, identify the lane and apply the corresponding skill or agent:

```
Task arrives
├── PAS/FDR foundation work? ──────────→ pas-slice-planner → fdr-slice-implementer | fdr-orchestrator
├── Registry lane change? ───────────────→ foundation-registry-owner
├── Docs/matrix drift suspected? ────────→ documentation-drift
├── Any code edit? ──────────────────────→ coding-consistency-bundle (mandatory)
├── UI/CSS/visual? ──────────────────────→ ui-consistency-bundle (mandatory)
├── Kernel boundary? ────────────────────→ kernel-authority
├── Enterprise knowledge? ───────────────→ enterprise-knowledge
├── CSS tokens PAS-005? ─────────────────→ css-authority
├── Pre-merge review? ───────────────────→ /afenda-review command
├── Ship decision? ──────────────────────→ /afenda-ship command
└── Full frontend maturity audit? ───────→ enterprise-frontend-audit
```

## Orchestrator commands

| User intent | Entry |
| --- | --- |
| Single-perspective code review | `/afenda-review` or `@afenda-code-reviewer` |
| Go/no-go before merge | `/afenda-ship` |
| Test strategy / coverage gaps | `/afenda-test` |
| Web performance audit | `/afenda-webperf` |
| PAS parallel batch | `@fdr-orchestrator` + `/afenda-fdr-batch` |
| Which skill applies? | `/using-afenda-skills` (this skill) |
| Vibe-coding / bundle preflight audit | `@vibe-coding-violation-auditor` |

## Implementer bundles (mandatory hops)

| Bundle | When |
| --- | --- |
| `coding-consistency-bundle` | Any file edit by implementer agents |
| `ui-consistency-bundle` | UI, CSS, or visual changes |

Orchestrators (`fdr-orchestrator`, `/afenda-ship`) paste bundle read lists into implementer prompts — personas do not invoke bundles themselves when spawned `readonly: true`.

## Governing rules

From `.cursor/references/orchestration-patterns.md`:

1. **User or slash-command is the orchestrator.** Personas do not call personas.
2. **Only one endorsed fan-out pattern:** parallel independent reports → merge in main agent (like `/afenda-ship`).
3. **Sequential lifecycle** stays **user-driven** — no LLM lifecycle orchestrator.
4. **Never build:** meta-router persona, persona-chains, deep persona trees.

## Skill rules

1. Check for an applicable skill before starting work.
2. Skills are workflows, not suggestions — follow verification steps.
3. Multiple skills can apply across a lifecycle; invoke them in user-driven sequence, not via a router agent.
4. When in doubt on foundation work, read `docs/PAS/README.md` and `foundation-disposition.registry.ts` before coding.

## Quick reference — common lanes

| Lane | Skill / agent |
| --- | --- |
| Governed implementation | `afenda-governed-implementer` |
| PAS slice (handoff present) | `fdr-slice-implementer` |
| PAS batch | `fdr-orchestrator` |
| Architecture / registries | `architecture-authority` |
| SAP/Oracle red-amber gates | `enterprise-erp-standards` |
| shadcn/studio promotion | `afenda-shadcn-components` |
| Drizzle migrations | `afenda-drizzle-migration` |
| Multi-tenancy | `multi-tenancy-erp` |

## Composition

- **Invoke directly when:** session start, ambiguous task routing, or user asks "which skill applies?"
- **Invoke at:** user message or `/using-afenda-skills` — not from other personas or subagents.
- **Do not invoke from:** review personas, implementer personas, or orchestrator merge steps. Routing belongs here and in `AGENTS.md`, not in persona chains.
