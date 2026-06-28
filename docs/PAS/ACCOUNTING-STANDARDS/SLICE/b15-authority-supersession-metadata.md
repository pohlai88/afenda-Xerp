# Slice B15 — Authority Supersession Metadata (PAS-003 §4.3)

> **Position:** Slice 16 of 17 in PAS-003 · Blueprint box: Accounting standards authority

**Prerequisite:** B3 delivered

**Status:** Not started

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — contracts-only package

## Purpose

Add authority instrument and supersession metadata to version registry.

**Implementation target:** standard-version.registry.ts

## Handoff block

`
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b15-authority-supersession-metadata.md

1. Objective    — Add authority instrument and supersession metadata to version registry.
2. Allowed layer— packages/accounting-standards/** · docs/PAS/ACCOUNTING-STANDARDS/** (governance slices only)
3. Files        —
   packages/accounting-standards/src/standards/standard-version.registry.ts
4. Prohibited   — legal advice sign-off
5. Authority    — PAS-003 §4.3 · NS §3.5
6. Gates        —
   pnpm --filter @afenda/accounting-standards typecheck
   pnpm --filter @afenda/accounting-standards test:run
   pnpm quality:architecture
   pnpm architecture:cycles
   pnpm architecture:drift
   pnpm quality:boundaries
7. Closes       — B15 supersession metadata
8. Evidence     —
   (after delivery) version registry fields
9. Attestation  — Contract
`

## DoD

| # | Criterion | Gate | Traces to |
| --- | --- | --- | --- |
| 1 | Slice handoff + PAS §12 sync | file read | PAS-003 §4.3 |
| 2 | Implementation matches PAS §4 contract | typecheck + test:run | PAS-003 authority surface |
| 3 | No prohibited surfaces introduced | quality:boundaries | PAS-003 §5 |
