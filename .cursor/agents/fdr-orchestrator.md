---
name: fdr-orchestrator
description: "RETIRED (2026-06-28): Renamed to afenda-orchestrator. Use @afenda-orchestrator + /afenda-batch for parallel PAS slice batches."
---

# FDR Orchestrator — RETIRED

**This agent is retired.** FDR delivery orchestration was superseded by PAS batch orchestration (2026-06-27).

Use instead:

- [`afenda-orchestrator`](afenda-orchestrator.md) — parallel PAS slice batch controller
- [`.cursor/skills/afenda-batch/SKILL.md`](../skills/afenda-batch/SKILL.md) — invocation contract (`/afenda-batch`)
- [`.cursor/skills/pas-slice-planner/SKILL.md`](../skills/pas-slice-planner/SKILL.md) — slice discovery and handoff validation
- [`docs/PAS/pas-status-index.md`](../../docs/PAS/pas-status-index.md) — canonical slice closure registry

Do not invoke this agent for new work.
