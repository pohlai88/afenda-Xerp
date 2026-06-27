# Slice B16-7 — Kernel Decision Matrix (PAS-001 §7)

**Prerequisite:** Slice B16-5 — kernel prohibited ownership (`docs/PAS/slice/b16-5-kernel-prohibited-ownership.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A (authority registry + drift gate only — no runtime behavior change)

## Purpose

Formalize PAS-001 §7 “Decision Matrix” as a typed governance registry with question/yesOutcome/belongsInKernel parity, lookup helpers, PAS table drift gate, and runtime authority pointer.

## Handoff block

```
Handoff from: docs/PAS/slice/b16-7-decision-matrix.md

1. Objective    — Codify PAS §7 Decision Matrix as typed kernel governance registry: 20 rows with question/yesOutcome/belongsInKernel parity, lookup helpers, JSON-serializable tests, PAS parity gate script, slice doc, PAS §7 runtime authority pointer.
2. Allowed layer— packages/kernel/src/governance/ (+ scripts/governance/, docs/PAS/)
3. Files        —
   packages/kernel/src/governance/kernel-decision-matrix.contract.ts
   packages/kernel/src/governance/__tests__/kernel-decision-matrix.contract.test.ts
   packages/kernel/src/governance/index.ts
   packages/kernel/src/index.ts
   scripts/governance/check-kernel-decision-matrix.mts
   docs/PAS/slice/b16-7-decision-matrix.md
   docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md (§7 runtime authority)
   package.json (check:kernel-decision-matrix gate only)
4. Prohibited   — ID_FAMILIES registry edits; apps/erp runtime; DB migrations; Accounting Core runtime; duplicate §7 table outside governance contract; permission evaluation logic; external npm deps in kernel
5. Authority    — PAS-001 §7 · kernel-authority skill · pas-prohibited-surface-scan skill
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:kernel-decision-matrix
   pnpm quality:boundaries
   pnpm quality:architecture
7. Closes       — Missing typed §7 decision matrix registry; no PAS table parity gate; no runtime authority pointer for §7
8. Evidence     —
   packages/kernel/src/governance/kernel-decision-matrix.contract.ts
   packages/kernel/src/governance/__tests__/kernel-decision-matrix.contract.test.ts
   scripts/governance/check-kernel-decision-matrix.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. PAS §7 decision matrix contains exactly 20 rows in `KERNEL_DECISION_MATRIX_ROWS`.
2. Registry question, yesOutcome, and belongsInKernel values must match PAS-001 §7 table verbatim and in order.
3. `belongsInKernel` uses `true`, `false`, or `"id-only"` (for “Yes, as ID only”).
4. `kernelOwnsBoundaryConcern` returns true when belongsInKernel is `true` or `"id-only"`.
5. Registry is authority metadata only — no permission evaluation, persistence, or domain runtime logic.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 20 rows registered | kernel-decision-matrix.contract.test.ts |
| 2 | Questions match PAS §7 verbatim | kernel-decision-matrix.contract.test.ts |
| 3 | Yes outcomes match PAS §7 verbatim | kernel-decision-matrix.contract.test.ts |
| 4 | Belongs-in-kernel verdicts match PAS §7 | kernel-decision-matrix.contract.test.ts |
| 5 | Row id guard works | kernel-decision-matrix.contract.test.ts |
| 6 | kernelOwnsBoundaryConcern helper works | kernel-decision-matrix.contract.test.ts |
| 7 | Registry JSON-serializable | kernel-decision-matrix.contract.test.ts |
| 8 | PAS/registry parity gate | check-kernel-decision-matrix.mts |
| 9 | Public exports on `@afenda/kernel` | index.ts |
| 10 | Kernel typecheck green | pnpm --filter @afenda/kernel typecheck |

## Runtime delivered

| Surface | Path |
| --- | --- |
| Decision matrix registry | `governance/kernel-decision-matrix.contract.ts` |
| Policy constants | `KERNEL_DECISION_MATRIX_POLICY` |
| Lookup helpers | `getKernelDecisionMatrixRow`, `listKernelDecisionMatrixRows`, `kernelOwnsBoundaryConcern` |
| Governance gate | `pnpm check:kernel-decision-matrix` |
| Contract tests | `governance/__tests__/kernel-decision-matrix.contract.test.ts` |
