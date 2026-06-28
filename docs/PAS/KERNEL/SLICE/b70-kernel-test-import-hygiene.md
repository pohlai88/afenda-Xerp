# Slice B70 — Kernel Test Import Hygiene (PAS-001 §3.3)

> **Position:** Slice `12 of 12` in PAS-001 · Blueprint box: `Kernel Vocabulary`

**Prerequisite:** B69 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A — test import paths only

## Purpose

Replace @afenda/kernel self-imports in context __tests__ with relative identity/vocabulary imports per PAS-001 §3.3 — closes PAS-001 Enterprise Accepted track.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b70-kernel-test-import-hygiene.md

1. Objective    — Zero @afenda/kernel imports in context/__tests__; all context tests pass.
2. Allowed layer— packages/kernel/src/context/__tests__/** · docs/PAS/KERNEL/SLICE/**
3. Files        —
   packages/kernel/src/context/__tests__/tenant-context.test.ts
   packages/kernel/src/context/__tests__/operating-context.test.ts
   docs/PAS/KERNEL/SLICE/b70-kernel-test-import-hygiene.md
4. Prohibited   — packages/kernel production exports · apps/erp/**
5. Authority    — PAS-001 §3.3 · B16-9 frozen rule 3 · kernel-authority
6. Gates        —
   pnpm --filter @afenda/kernel test:run
7. Closes       — Closes DoD #1–#2 · PAS-001 closure (B70)
8. Evidence     —
   ripgrep: no @afenda/kernel in context/__tests__
   packages/kernel/src/context/__tests__/
9. Attestation  — Test · Maintainability
```

## Rules frozen

1. Context tests import relative paths or subpath exports — never package self-import.
2. No production export changes in this slice.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Zero @afenda/kernel in context/__tests__ | ripgrep | PAS-001 §3.3 import hygiene |
| 2 | All context tests pass | pnpm --filter @afenda/kernel test:run | PAS-001 §11 test discipline |
| 3 | PAS-001 Enterprise Accepted attestation row updated | Manual review — PAS author | PAS-001 §14 maturity exit |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | ripgrep: no @afenda/kernel in context/__tests__ |
| 2 | packages/kernel/src/context/__tests__/ |
| 3 | Manual review — PAS author |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Test import hygiene | Yes — B70 | `packages/kernel/src/context/__tests__/` |

