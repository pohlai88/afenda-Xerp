# Slice B70 — Kernel Test Import Hygiene (PAS-001 §3.3)

**Prerequisite:** Slice B69 — Wire triad gate (`b69-kernel-context-wire-triad-gate.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A — test import paths only

## Handoff block

```
Handoff from: docs/PAS/slice/b70-kernel-test-import-hygiene.md

1. Objective    — Replace @afenda/kernel self-imports in context __tests__ with relative identity/vocabulary imports (PAS §3.3 / B16-9 rule 3 spirit).
2. Allowed layer— packages/kernel/src/context/__tests__/** · docs/PAS/slice/b70-kernel-test-import-hygiene.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md (remaining_slices header)
3. Files        —
   packages/kernel/src/context/__tests__/tenant-context.test.ts
   packages/kernel/src/context/__tests__/team-context.test.ts
   packages/kernel/src/context/__tests__/project-context.test.ts
   packages/kernel/src/context/__tests__/entity-group-context.test.ts
   packages/kernel/src/context/__tests__/organization-unit-context.test.ts
   packages/kernel/src/context/__tests__/permission-scope-context.test.ts
   packages/kernel/src/context/__tests__/operating-context.test.ts
   docs/PAS/slice/b70-kernel-test-import-hygiene.md
4. Prohibited   — packages/kernel/src/** production exports · apps/erp/**
5. Authority    — PAS-001 §3.3 · B16-9 frozen rule 3
6. Gates        — pnpm --filter @afenda/kernel test:run
7. Closes       — G5 test self-import drift
8. Evidence     — ripgrep: no @afenda/kernel in context/__tests__
9. Attestation  — Test · Maintainability
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Zero @afenda/kernel imports in context/__tests__ | ripgrep |
| 2 | All context tests pass | test:run |
