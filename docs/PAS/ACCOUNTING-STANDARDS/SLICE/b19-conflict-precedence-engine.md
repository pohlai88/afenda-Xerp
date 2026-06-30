# Slice B19 — Conflict Precedence Engine (PAS-003 §4.6 · E9)

**Prerequisite:** B6–B7 delivered

**Status:** Delivered (2026-06-30)

**Type:** Implementation

## Purpose

§5.2 conflict precedence detection and escalation in validation engine (Domain NS E9).

**Implementation target:** `policy/conflict-precedence.policy.ts` · engine aggregation

## Handoff block

```
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b19-conflict-precedence-engine.md

1. Objective    — Detect authority precedence conflicts and emit escalation results.
2. Allowed layer— packages/accounting-standards/**
3. Files        — policy/conflict-precedence.policy.ts · posting-validation-engine.ts
4. Prohibited   — silent lowest-precedence pick
5. Authority    — PAS-003 §4.6 · NS §5.2
6. Gates        — accounting-standards typecheck + test:run
7. Closes       — E9 conflict precedence model
8. Evidence     — conflict-precedence.test.ts
9. Attestation  — Contract · Test
```
