# Slice B69 — Kernel Context Wire Triad Gate (PAS-001 §9)

> **Position:** Slice `11 of 12` in PAS-001 · Blueprint box: `Kernel Vocabulary`

**Prerequisite:** B68 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — governance gate for context wire triads

## Purpose

Add check:kernel-context-wire-triad gate verifying every wireIngress context in context-registry has contract/assert/parser triad on disk.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b69-kernel-context-wire-triad-gate.md

1. Objective    — Machine-enforce context wire triad completeness across context-registry.
2. Allowed layer— scripts/governance/check-kernel-context-wire-triad.mts · packages/kernel/src/context/**
3. Files        —
   scripts/governance/check-kernel-context-wire-triad.mts
   packages/kernel/src/context/context-registry.ts
   docs/PAS/KERNEL/SLICE/b69-kernel-context-wire-triad-gate.md
4. Prohibited   — apps/erp/** · new context types without PAS amendment slice
5. Authority    — PAS-001 §9 rule 14 · kernel-authority
6. Gates        —
   pnpm check:kernel-context-wire-triad
   pnpm quality:kernel-context-surface
7. Closes       — Closes DoD #1–#3 · context wire triad gate
8. Evidence     —
   scripts/governance/check-kernel-context-wire-triad.mts
   packages/kernel/src/context/context-registry.ts
   Gate output archived in B70/B75 docs
9. Attestation  — Governance · Test
```

## Rules frozen

1. Every wireIngress:true registry entry must have triad files.
2. Gate fails closed when triad file missing or export mismatch.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Wire triad gate passes on mainline | pnpm check:kernel-context-wire-triad | PAS-001 §9 · Kernel NS context EFR |
| 2 | Context surface quality gate green | pnpm quality:kernel-context-surface | PAS-001 §13 |
| 3 | PAS-001 §9 rule 14 no longer deferred | Manual review — PAS author | PAS-001 §14 maturity |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | scripts/governance/check-kernel-context-wire-triad.mts |
| 2 | packages/kernel/src/context/context-registry.ts |
| 3 | Gate output archived in B70/B75 docs |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Context wire triad gate | Yes — B69 | `scripts/governance/check-kernel-context-wire-triad.mts` |

