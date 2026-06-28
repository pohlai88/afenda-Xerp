# Slice B13 — Reporting Context Profile Routing (PAS-003 §4.4)

> **Position:** Slice 14 of 17 in PAS-003 · Blueprint box: Accounting standards authority

**Prerequisite:** B3–B4 delivered

**Status:** Not started

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — contracts-only package

## Purpose

Extend process routing for reporting context profiles per Domain NS §3.4 / B13.

**Implementation target:** routing registry profile keys

## Handoff block

`
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b13-reporting-context-profile-routing.md

1. Objective    — Extend process routing for reporting context profiles per Domain NS §3.4 / B13.
2. Allowed layer— packages/accounting-standards/** · docs/PAS/ACCOUNTING-STANDARDS/** (governance slices only)
3. Files        —
   packages/accounting-standards/src/routing/
4. Prohibited   — parallel book posting runtime
5. Authority    — PAS-003 §4.4 · accounting-standards-north-star §3.4
6. Gates        —
   pnpm --filter @afenda/accounting-standards typecheck
   pnpm --filter @afenda/accounting-standards test:run
   pnpm quality:architecture
   pnpm architecture:cycles
   pnpm architecture:drift
   pnpm quality:boundaries
7. Closes       — B13 parallel-book routing extension
8. Evidence     —
   (after delivery) routing registry extensions
9. Attestation  — Contract · Test
`

## DoD

| # | Criterion | Gate | Traces to |
| --- | --- | --- | --- |
| 1 | Slice handoff + PAS §12 sync | file read | PAS-003 §4.4 |
| 2 | Implementation matches PAS §4 contract | typecheck + test:run | PAS-003 authority surface |
| 3 | No prohibited surfaces introduced | quality:boundaries | PAS-003 §5 |
