# Slice P06-003 — Block Slot & Block Data Contracts (PAS-006B)

> **Position:** Slice `3 of 10` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-002 Delivered

**Status:** Delivered (2026-06-29)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A

## Purpose

Add block slot registry and wire-safe block data contract surfaces per PAS-006B §4 — slot map + serializable field/column/action shapes.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-003-block-slot-data-contracts.md

1. Objective    — Deliver block slot registry and block data contract wire types for presentation blocks.
2. Allowed layer— packages/shadcn-studio only
3. Files        —
   packages/shadcn-studio/src/registry/block-slot.registry.ts
   packages/shadcn-studio/src/contracts/block-data-contract.ts
   packages/shadcn-studio/src/__tests__/block-slot.registry.test.ts
   packages/shadcn-studio/src/__tests__/block-data-contract.test.ts
   packages/shadcn-studio/src/index.ts
4. Prohibited   — @afenda/kernel · metadata schema persistence · ERP routes · Acceptance Record sealing
5. Authority    — PAS-006B §4 · Presentation NS §3.1 slot + block data contract layers
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
7. Closes       — Closes DoD #1–#3 · PAS-006B P06-003
8. Evidence     —
   packages/shadcn-studio/src/registry/block-slot.registry.ts
   packages/shadcn-studio/src/contracts/block-data-contract.ts
   packages/shadcn-studio/src/__tests__/block-slot.registry.test.ts
9. Attestation  — Contract · Test
```

## Rules frozen

1. Slot ids stable across block versions unless ADR amends.
2. Block data contracts are wire descriptors only — no ORM or Zod runtime deps.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Slot registry covers seeded MCP blocks | `block-slot.registry.test.ts` | NS §3.1 block-slot |
| 2 | Block data contract JSON-serializable | `block-data-contract.test.ts` | PAS-006B §4 |
| 3 | Barrel exports slot + contract types | `pnpm --filter @afenda/shadcn-studio typecheck` | PAS-006A |

**Field 8 evidence map:**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/shadcn-studio/src/registry/block-slot.registry.ts |
| 2 | packages/shadcn-studio/src/contracts/block-data-contract.ts |
| 3 | packages/shadcn-studio/src/index.ts |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Block slot registry | Yes — P06-003 | `packages/shadcn-studio/src/registry/block-slot.registry.ts` |
| Block data contracts | Yes — P06-003 | `packages/shadcn-studio/src/contracts/block-data-contract.ts` |

