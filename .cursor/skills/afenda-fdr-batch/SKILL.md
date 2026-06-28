---
name: afenda-fdr-batch
description: Documents invocation contract for @fdr-orchestrator parallel PAS/FDR batches. Discoverability skill — does not replace fdr-orchestrator agent.
disable-model-invocation: true
---

# Afenda FDR Batch (`/afenda-fdr-batch`)

Discoverability entry point for PAS parallel batch execution. The batch controller remains **`.cursor/agents/fdr-orchestrator.md`** — do not create a meta-orchestrator.

## When to use

- Multiple disjoint FDR slices (Research or Implementation) in one batch
- User has complete slot table and handoff blocks ready
- **Not** for pre-merge PR review — use `/afenda-ship`

## When NOT to parallelize

Stop and serialize per `fdr-orchestrator` §Shared-file serialization:

- `foundation-disposition.registry.ts` mutations → `foundation-registry-owner` only, one slot
- Shared index/matrix files → dedicated Evidence-sync slot, one owner per batch
- Same `runtimeOwner` across Implementation slots
- Same file path in two slots
- Registry-sync batch type — never parallel with Implementation on same entry

Split into phases when needed:

```
Implementation batch → Evidence-sync batch → Registry-sync (if needed)
```

## Invocation contract

Caller **must** `@fdr-orchestrator` with:

```text
Batch type : parallel | sequential | evidence-sync | registry-sync | mixed
FDR slots  :
  Slot A: FDR-ID=<fdr-NNN-slug>  Slice=<N>  Type=<Research|Implementation|Evidence-sync|Registry-sync>
  Slot B: ...
Note       : <optional>
```

If any field is missing, orchestrator emits pre-flight error — do not guess.

## Parallel implementer launch pattern

After orchestrator batch manifest PASS:

```
Task × N (parallel) → fdr-slice-implementer
  each prompt MUST include:
    - complete 9-field handoff block
    - coding-consistency-bundle read list (from .cursor/skills/coding-consistency-bundle/SKILL.md)
Wait → combined diff containment → consolidated gates → documentation-drift (if docs/matrix changed)
```

Paste into **every** implementer prompt:

1. `.cursor/skills/coding-consistency-bundle/SKILL.md` — full bundle table
2. Target slice handoff (9 fields)
3. Parent PAS §0 Agent Quick Path when cited

## Orchestrator responsibilities (not this skill)

`fdr-orchestrator` performs:

- 14 hard stops + batch manifest
- Conflict matrix (file paths, runtimeOwner, registry entry)
- Combined diff containment vs Field 3 union
- Batch Completion Summary merging §11 reports
- Consolidated gates (de-duplicated per package)
- `documentation-drift` when index/matrix/docs changed

## User routing (no meta-router)

| Intent | Entry |
| --- | --- |
| Plan slice handoff | `pas-slice-planner` → `fdr-slice-author` |
| Single slice implement | `fdr-slice-implementer` |
| Parallel batch | `@fdr-orchestrator` (this skill documents contract) |
| Registry lane edit | `foundation-registry-owner` |
| Which skill? | `/using-afenda-skills` |

## Composition

- **Invoke directly when:** user asks how to run a PAS parallel batch or needs invocation template
- **Always pair with:** `@fdr-orchestrator` for actual batch execution
- **Do not invoke from:** personas; do not replace `fdr-orchestrator.md`
