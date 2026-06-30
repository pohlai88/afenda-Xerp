# Slice B17 — Transaction-Date Edition Resolution (PAS-003 §4.3 · E10)

> **Position:** Extension slice 18 · Blueprint box: Accounting standards authority

**Prerequisite:** B3 delivered

**Status:** Delivered (2026-06-30)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — version registry + validation engine

## Purpose

Resolve applicable authority edition from `transactionDate` using version registry effective windows (Domain NS E10 / I3).

**Implementation target:** `policy/transaction-date-edition-resolution.policy.ts` · validation report fields

## Handoff block

```
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b17-transaction-date-edition-resolution.md

1. Objective    — Resolve cited authority edition from transactionDate via version registry.
2. Allowed layer— packages/accounting-standards/**
3. Files        —
   packages/accounting-standards/src/policy/transaction-date-edition-resolution.policy.ts
   packages/accounting-standards/src/rules/posting-validation-input.contract.ts
   packages/accounting-standards/src/rules/posting-validation-report.contract.ts
   packages/accounting-standards/src/rules/posting-validation-engine.ts
   packages/accounting-standards/src/standards/standard-version.registry.ts
4. Prohibited   — journal posting · ledger mutation
5. Authority    — PAS-003 §4.3 · accounting-standards-north-star E10
6. Gates        —
   pnpm --filter @afenda/accounting-standards typecheck
   pnpm --filter @afenda/accounting-standards test:run
7. Closes       — E10 effective-date edition resolution
8. Evidence     — IFRS 16 2019/2026 edition resolution tests
9. Attestation  — Contract · Test
```
