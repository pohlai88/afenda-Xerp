---
name: afenda-batch
description: Documents invocation contract for @afenda-orchestrator parallel PAS slice batches. Discoverability skill — does not replace afenda-orchestrator agent.
disable-model-invocation: true
---

# Afenda Batch (`/afenda-batch`)

Discoverability entry point for PAS parallel batch execution. The batch controller is **`.cursor/agents/afenda-orchestrator.md`** — do not create a meta-orchestrator.

## When to use

- Multiple disjoint PAS slices (Research or Implementation) in one batch
- User has complete slot table and handoff blocks ready
- **Not** for pre-merge PR review — use `/afenda-ship`

## When NOT to parallelize

Stop and serialize per `afenda-orchestrator` §Shared-file serialization:

- `foundation-disposition.registry.ts` mutations → `foundation-registry-owner` only, one slot
- Shared index/matrix files → dedicated Evidence-sync slot, one owner per batch
- Same `runtimeOwner` across Implementation slots
- Same file path in two slots
- Registry-sync batch type — never parallel with Implementation on same entry

Split into phases when needed:

```text
Implementation batch → Evidence-sync batch → Registry-sync (if needed)
```

## Invocation contract

Caller **must** `@afenda-orchestrator` with:

```text
Batch type : parallel | sequential | evidence-sync | registry-sync | mixed
PAS slots  :
  Slot A: Slice-ID=<bNN-slug>  Slice=<N>  Type=<Research|Implementation|Evidence-sync|Registry-sync>
  Slot B: ...
Note       : <optional>
```

If any field is missing, orchestrator emits pre-flight error — do not guess.

## Parallel implementer launch pattern

After orchestrator batch manifest PASS:

```text
Task × N (parallel) → afenda-governed-implementer
  each prompt MUST include:
    - complete 9-field handoff block from docs/PAS/CSS-AUTHORITY/SLICE/
    - coding-consistency-bundle read list (from .cursor/skills/coding-consistency-bundle/SKILL.md)
Wait → combined diff containment → consolidated gates → documentation-drift (if docs/matrix changed)
```

Paste into **every** implementer prompt:

1. `.cursor/skills/coding-consistency-bundle/SKILL.md` — full bundle table
2. Target slice handoff (9 fields)
3. Parent PAS §0 Agent Quick Path when cited

## Orchestrator responsibilities (not this skill)

`afenda-orchestrator` performs:

- 14 hard stops + batch manifest
- Conflict matrix (file paths, runtimeOwner, registry entry)
- Combined diff containment vs Field 3 union
- Batch Completion Summary merging §11 reports
- Consolidated gates (de-duplicated per package)
- `documentation-drift` when index/matrix/docs changed

## User routing (no meta-router)

| Intent | Entry |
| --- | --- |
| Plan slice handoff | `pas-slice-planner` |
| Single slice implement | `afenda-governed-implementer` |
| Parallel batch | `@afenda-orchestrator` (this skill documents contract) |
| Registry lane edit | `foundation-registry-owner` |
| Which skill? | `/using-afenda-skills` |

## Composition

- **Invoke directly when:** user asks how to run a PAS parallel batch or needs invocation template
- **Always pair with:** `@afenda-orchestrator` for actual batch execution
- **Do not invoke from:** personas; do not replace `afenda-orchestrator.md`

---

## Verification

Batch contract satisfied when caller provides complete slot table; actual execution verified by `@afenda-orchestrator` Batch Completion Summary (manifest PASS, combined diff containment, consolidated gates).
