# Slice B16 — Cross-Representation Routing (PAS-003 §4.4)

> **Position:** Slice 17 of 17 in PAS-003 · Blueprint box: Accounting standards authority

**Prerequisite:** B4 · B13 delivered

**Status:** Not started

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — contracts-only package

## Purpose

Implement cross-representation routing keys per Domain NS §3.6.

**Implementation target:** routing registry

## Handoff block

`
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b16-cross-representation-routing.md

1. Objective    — Implement cross-representation routing keys per Domain NS §3.6.
2. Allowed layer— packages/accounting-standards/** · docs/PAS/ACCOUNTING-STANDARDS/** (governance slices only)
3. Files        —
   packages/accounting-standards/src/routing/standard-process-routing.registry.ts
4. Prohibited   — XBRL generation runtime
5. Authority    — PAS-003 §4.4 · NS §3.6
6. Gates        —
   pnpm --filter @afenda/accounting-standards typecheck
   pnpm --filter @afenda/accounting-standards test:run
   pnpm quality:architecture
   pnpm architecture:cycles
   pnpm architecture:drift
   pnpm quality:boundaries
7. Closes       — B16 cross-representation routing
8. Evidence     —
   (after delivery) routing registry cross-rep keys
9. Attestation  — Contract · Test
`

## DoD

| # | Criterion | Gate | Traces to |
| --- | --- | --- | --- |
| 1 | Slice handoff + PAS §12 sync | file read | PAS-003 §4.4 |
| 2 | Implementation matches PAS §4 contract | typecheck + test:run | PAS-003 authority surface |
| 3 | No prohibited surfaces introduced | quality:boundaries | PAS-003 §5 |
