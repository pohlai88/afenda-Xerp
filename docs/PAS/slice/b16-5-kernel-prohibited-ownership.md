# Slice B16 — Kernel Prohibited Ownership (PAS-001 §5)

**Prerequisite:** Slice B3 — three-layer identity stack (`docs/PAS/slice/b3-4.1.1-three-layer-stack.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A (authority registry + drift gate only — no runtime behavior change)

## Purpose

Formalize PAS-001 §5 “What Kernel Must Never Own” as a typed governance registry with owner mapping, PAS label parity tests, forbidden-import scan in kernel sources, and a dedicated governance gate.

## Handoff block

```
Handoff from: docs/PAS/slice/b16-5-kernel-prohibited-ownership.md

1. Objective    — Formalize PAS §5 prohibited ownership registry: typed concerns, owner mapping, parity tests, forbidden-import gate, public exports, slice doc sync.
2. Allowed layer— packages/kernel/src/governance/ (+ scripts/governance/, docs/PAS/)
3. Files        —
   packages/kernel/src/governance/kernel-prohibited-ownership.contract.ts
   packages/kernel/src/governance/index.ts
   packages/kernel/src/governance/__tests__/kernel-prohibited-ownership.contract.test.ts
   packages/kernel/src/index.ts
   packages/kernel/package.json
   scripts/governance/check-kernel-prohibited-ownership.mts
   docs/PAS/slice/b16-5-kernel-prohibited-ownership.md
   docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md (§5 runtime authority)
4. Prohibited   — ID_FAMILIES registry edits; apps/erp runtime; DB migrations; Accounting Core runtime; duplicate §5 bullet lists outside governance contract; external npm deps in kernel
5. Authority    — PAS-001 §5 · kernel-authority skill · pas-prohibited-surface-scan skill
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:kernel-prohibited-ownership
   pnpm check:kernel-zero-runtime-deps
   pnpm quality:boundaries
   pnpm quality:architecture
7. Closes       — Missing typed §5 prohibited ownership registry; missing PAS label parity gate; no runtime authority pointer for §5
8. Evidence     —
   packages/kernel/src/governance/kernel-prohibited-ownership.contract.ts
   packages/kernel/src/governance/__tests__/kernel-prohibited-ownership.contract.test.ts
   scripts/governance/check-kernel-prohibited-ownership.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel must never own the 38 PAS §5 concerns listed in `KERNEL_PROHIBITED_OWNERSHIP_CONCERNS`.
2. Registry labels must match PAS-001 §5 bullet text verbatim and in order.
3. Each concern maps to an explicit non-kernel owner package or layer.
4. Kernel sources must not import `drizzle-orm`, `@afenda/database`, `react`, `react-dom`, or `next/*`.
5. Registry is authority metadata only — no domain runtime, persistence, or evaluation logic.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 38 concerns registered | kernel-prohibited-ownership.contract.test.ts |
| 2 | Labels match PAS §5 verbatim | kernel-prohibited-ownership.contract.test.ts |
| 3 | Categories and owners populated | kernel-prohibited-ownership.contract.test.ts |
| 4 | Concern id guard works | kernel-prohibited-ownership.contract.test.ts |
| 5 | Registry JSON-serializable | kernel-prohibited-ownership.contract.test.ts |
| 6 | PAS/registry parity gate | check-kernel-prohibited-ownership.mts |
| 7 | Forbidden kernel imports absent | check-kernel-prohibited-ownership.mts |
| 8 | Public exports on `@afenda/kernel` | index.ts |
| 9 | Kernel typecheck green | pnpm --filter @afenda/kernel typecheck |

## Runtime delivered

| Surface | Path |
| --- | --- |
| Prohibited ownership registry | `governance/kernel-prohibited-ownership.contract.ts` |
| Policy constants | `KERNEL_PROHIBITED_OWNERSHIP_POLICY` |
| Lookup helpers | `getKernelProhibitedOwnershipConcern`, `listKernelProhibitedOwnershipConcerns` |
| Governance gate | `pnpm check:kernel-prohibited-ownership` |
| Contract tests | `governance/__tests__/kernel-prohibited-ownership.contract.test.ts` |
