# Slice P06-002 — Relational Inventory Registry Scaffold (PAS-006B)

> **Position:** Slice `2 of 10` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-001 Delivered

**Status:** Delivered (2026-06-29)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — registry scaffold only; no ERP route wiring

## Purpose

Introduce relational presentation inventory scaffold: block lifecycle states (NS §8.1), `PresentationInventoryEntry` discriminated union, and parity-derived registry seed per PAS-006B §4.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-002-relational-inventory-scaffold.md

1. Objective    — Deliver presentation inventory registry scaffold with block lifecycle and parity-derived entries.
2. Allowed layer— packages/shadcn-studio only
3. Files        —
   packages/shadcn-studio/src/registry/block-lifecycle.ts
   packages/shadcn-studio/src/registry/presentation-inventory.registry.ts
   packages/shadcn-studio/src/registry/build-presentation-inventory-from-parity.ts
   packages/shadcn-studio/src/__tests__/presentation-inventory.registry.test.ts
   packages/shadcn-studio/src/index.ts
4. Prohibited   — @afenda/kernel import · apps/erp · foundation-disposition.registry.ts · Acceptance Record (006C)
5. Authority    — PAS-006B §4 · ADR-0027 · shadcn-studio skill
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
7. Closes       — Closes DoD #1–#4 · PAS-006B P06-002 · NS §3.1 inventory layers (partial)
8. Evidence     —
   packages/shadcn-studio/src/registry/presentation-inventory.registry.ts
   packages/shadcn-studio/src/__tests__/presentation-inventory.registry.test.ts
   packages/shadcn-studio/src/registry/block-lifecycle.ts
   packages/shadcn-studio/src/index.ts
9. Attestation  — Contract · Test · Governance
```

## Rules frozen

1. All inventory entries JSON-serializable · readonly · no import side effects.
2. Blocks start at lifecycle `imported` — no skip to `accepted`.
3. No kernel imports in `@afenda/shadcn-studio`.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Block lifecycle union + transition validator | `presentation-inventory.registry.test.ts` | NS §8.1 |
| 2 | Parity blocks appear as presentation-block entries | `presentation-inventory.registry.test.ts` | PAS-006B §4 |
| 3 | Theme preset layer entries seeded | `presentation-inventory.registry.test.ts` | NS §3.1 |
| 4 | Public barrel exports inventory types | `pnpm --filter @afenda/shadcn-studio typecheck` | PAS-006A barrel |

**Field 8 evidence map:**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/shadcn-studio/src/registry/block-lifecycle.ts |
| 2 | packages/shadcn-studio/src/__tests__/presentation-inventory.registry.test.ts |
| 3 | packages/shadcn-studio/src/registry/build-presentation-inventory-from-parity.ts |
| 4 | packages/shadcn-studio/src/index.ts |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Relational inventory scaffold | Yes — P06-002 | `packages/shadcn-studio/src/registry/presentation-inventory.registry.ts` |
