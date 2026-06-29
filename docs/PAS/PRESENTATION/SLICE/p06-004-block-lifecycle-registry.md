# Slice P06-004 — Block Lifecycle State in Registry (PAS-006B)

> **Position:** Slice `4 of 10` · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-003 Delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Medium

## Purpose

Enforce block lifecycle transitions in registry mutations and add governance gate `check:studio-inventory-lifecycle` per PAS-006B §4.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-004-block-lifecycle-registry.md

1. Objective    — Registry lifecycle mutation API + check:studio-inventory-lifecycle gate.
2. Allowed layer— packages/shadcn-studio · scripts/governance (gate only)
3. Files        —
   packages/shadcn-studio/src/registry/block-lifecycle-mutation.ts
   packages/shadcn-studio/src/__tests__/block-lifecycle-mutation.test.ts
   scripts/governance/check-studio-inventory-lifecycle.mjs
   package.json
   packages/shadcn-studio/src/index.ts
4. Prohibited   — ERP routes · Acceptance Record sealing · kernel import
5. Authority    — PAS-006B §3 · NS §8.1
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm check:studio-inventory-lifecycle
7. Closes       — Closes DoD #1–#3
8. Evidence     —
   packages/shadcn-studio/src/registry/block-lifecycle-mutation.ts
   scripts/governance/check-studio-inventory-lifecycle.mjs
9. Attestation  — Contract · Test · Governance
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Invalid lifecycle skips rejected | `block-lifecycle-mutation.test.ts` |
| 2 | Governance gate fails on drift | `pnpm check:studio-inventory-lifecycle` |
| 3 | Registry entries remain serializable | `presentation-inventory.registry.test.ts` |
