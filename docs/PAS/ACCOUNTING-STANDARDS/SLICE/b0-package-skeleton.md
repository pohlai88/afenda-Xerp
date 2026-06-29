# Slice B0 — Package Skeleton (PAS-003 §6)

> **Position:** Slice 1 of 17 in PAS-003 · Blueprint box: Accounting standards authority

**Prerequisite:** PAS-003 accepted

**Status:** Delivered (2026-06-29)

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A — skeleton only

## Purpose

Deliver @afenda/accounting-standards package skeleton: fingerprint export, architecture boundary test, tombstone pointers.

**Implementation target:** packages/accounting-standards scaffold (delivered)

## Handoff block

```
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b0-package-skeleton.md

1. Objective    — Deliver @afenda/accounting-standards package skeleton: fingerprint export, architecture boundary test, tombstone pointers.
2. Allowed layer— packages/accounting-standards/** · docs/PAS/ACCOUNTING-STANDARDS/** (governance slices only)
3. Files        —
   packages/accounting-standards/package.json
   packages/accounting-standards/src/index.ts
   packages/accounting-standards/src/__tests__/architecture-boundary.test.ts
   packages/accounting-standards/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md
   packages/accounting-standards/PAS-003-ACCOUNTING-STANDARDS-TREE.md
4. Prohibited   — standards registries · validation engine · kernel edits · foundation-disposition.registry.ts
5. Authority    — PAS-003 §6 · accounting-standards-authority
6. Gates        —
   pnpm --filter @afenda/accounting-standards typecheck
   pnpm --filter @afenda/accounting-standards test:run
   pnpm quality:architecture
   pnpm architecture:cycles
   pnpm architecture:drift
   pnpm quality:boundaries
7. Closes       — B0 package skeleton · PAS-003 §6.0 tree
8. Evidence     —
   packages/accounting-standards/src/index.ts
   packages/accounting-standards/src/__tests__/architecture-boundary.test.ts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate | Traces to |
| --- | --- | --- | --- |
| 1 | Slice handoff + PAS §12 sync | file read | PAS-003 §6 |
| 2 | Implementation matches PAS §4 contract | typecheck + test:run | PAS-003 authority surface |
| 3 | No prohibited surfaces introduced | quality:boundaries | PAS-003 §5 |

