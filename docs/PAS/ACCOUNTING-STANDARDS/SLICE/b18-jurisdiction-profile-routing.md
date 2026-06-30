# Slice B18 — Jurisdiction Profile Routing (PAS-003 §4.4 · E8)

**Prerequisite:** B13 delivered

**Status:** Delivered (2026-06-30)

**Type:** Implementation

## Purpose

Entity jurisdiction registry + profile routing integration (Domain NS E8).

**Implementation target:** `routing/jurisdiction-profile.registry.ts` · engine jurisdiction routes

## Handoff block

```
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b18-jurisdiction-profile-routing.md

1. Objective    — Jurisdiction profile registry + statutory route extensions.
2. Allowed layer— packages/accounting-standards/**
3. Files        — routing/jurisdiction-profile.* · posting-validation-engine.ts
4. Prohibited   — parallel book posting runtime
5. Authority    — PAS-003 §4.4 · NS E8
6. Gates        — accounting-standards typecheck + test:run
7. Closes       — E8 jurisdiction + parallel book model
8. Evidence     — jurisdiction-profile-routing.test.ts
9. Attestation  — Contract · Test
```
