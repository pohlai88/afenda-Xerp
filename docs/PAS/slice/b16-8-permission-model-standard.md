# Slice B16-8 — Permission Model Standard (PAS-001 §8)

**Prerequisite:** Slice B15-4.9 — Policy decision vocabulary (`docs/PAS/slice/b15-4.9-policy-decision-vocabulary.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A (vocabulary registry + wire-safe descriptor guard; no grant-scope or registry renames)

## Purpose

Codify PAS §8 permission model vocabulary as typed kernel registry data:

1. Const arrays with derived types for `PermissionAction` (10 literals) and `PermissionModelScope` (9 literals).
2. `PERMISSION_MODEL_PATTERN` documenting `module × action × scope`.
3. Grant-scope alias map for model words that differ from `PERMISSION_GRANT_SCOPE_TYPES`.
4. Type guards, non-throwing narrow helpers, authority/ownership metadata, and wire-safe `PermissionModelDescriptor`.
5. Comprehensive contract tests and public `@afenda/kernel` + `@afenda/kernel/permission` exports.

Distinct from `PERMISSION_GRANT_SCOPE_TYPES` in `context/` — grant scope words serve membership/RLS boundaries (TIP-007 transitional); PAS §8 scope vocabulary governs the permission model pattern only.

## Frozen rules (PAS §8)

1. Kernel owns permission model vocabulary (actions, scopes, pattern metadata).
2. `@afenda/permissions` owns registry and checks.
3. Database owns role/permission storage.
4. ERP owns route/action enforcement.
5. API governance owns HTTP error mapping.
6. Kernel must not implement permission evaluation, registry membership, HTTP mapping, ERP enforcement, or DB persistence.
7. Kernel must not rename or replace `PERMISSION_GRANT_SCOPE_TYPES` in this slice.

## Handoff block

```
Handoff from: docs/PAS/slice/b16-8-permission-model-standard.md

1. Objective    — Codify PAS §8 permission model vocabulary as typed kernel registry data: action/scope const arrays, pattern constant, grant-scope aliases, type guards, wire-safe PermissionModelDescriptor, authority metadata, comprehensive tests, slice doc.
2. Allowed layer— packages/kernel/src/permission/ + kernel tests + PAS slice doc + kernel package.json subpath export only
3. Files        —
   docs/PAS/slice/b16-8-permission-model-standard.md (CREATE)
   packages/kernel/src/permission/permission-action.contract.ts (CREATE)
   packages/kernel/src/permission/permission-model-scope.contract.ts (CREATE)
   packages/kernel/src/permission/permission-model.contract.ts (CREATE)
   packages/kernel/src/permission/permission-vocabulary.contract.ts (CREATE)
   packages/kernel/src/permission/index.ts (CREATE)
   packages/kernel/src/permission/__tests__/permission-vocabulary.contract.test.ts (CREATE)
   packages/kernel/src/__tests__/permission-model-vocabulary.test.ts (CREATE)
   packages/kernel/src/index.ts (MODIFY)
   packages/kernel/package.json (MODIFY)
   packages/kernel/src/__tests__/subpath-exports.test.ts (MODIFY)
   packages/kernel/src/context/permission-grant-vocabulary.contract.ts (MODIFY)
4. Prohibited   — permission evaluation logic; @afenda/permissions imports; apps/erp; packages/database; HTTP status mapping; renaming PERMISSION_GRANT_SCOPE_TYPES; breaking rename of existing permission registry keys; external npm deps
5. Authority    — PAS-001 §8 · kernel-authority skill
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:boundaries
   pnpm quality:architecture
7. Closes       — Missing PAS slice doc for §8; no canonical action/scope vocabulary separate from grant-scope words
8. Evidence     —
   packages/kernel/src/permission/__tests__/permission-vocabulary.contract.test.ts
   packages/kernel/src/__tests__/permission-model-vocabulary.test.ts
9. Attestation  — Contract · Test · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | `PERMISSION_ACTIONS` length locked at 10 with PAS literals | `permission-vocabulary.contract.test.ts` |
| 2 | `PERMISSION_MODEL_SCOPES` length locked at 9 with PAS literals | `permission-vocabulary.contract.test.ts` |
| 3 | Every registry entry passes its type guard | `permission-vocabulary.contract.test.ts` |
| 4 | Invalid strings rejected by guards and get helpers | `permission-vocabulary.contract.test.ts` |
| 5 | `PERMISSION_MODEL_PATTERN` equals PAS §8 pattern | `permission-vocabulary.contract.test.ts` |
| 6 | `isPermissionModelDescriptor` accepts valid wire objects, rejects malformed | `permission-vocabulary.contract.test.ts` |
| 7 | JSON round-trip for actions, scopes, and sample descriptors | `permission-model-vocabulary.test.ts` + contract tests |
| 8 | `PERMISSION_VOCABULARY_AUTHORITY` equals PAS-001 §8 | `permission-vocabulary.contract.test.ts` |
| 9 | `PERMISSION_VOCABULARY_OWNERSHIP` matches PAS ownership table | `permission-vocabulary.contract.test.ts` |
| 10 | Public exports include registry, guards, and descriptor guard | `subpath-exports.test.ts` |
| 11 | Kernel typecheck green | `pnpm --filter @afenda/kernel typecheck` |
| 12 | No evaluation logic or prohibited imports | `pnpm quality:boundaries` |

## Risk register

| Risk | Status | Mitigation |
| --- | --- | --- |
| Confusion with `PERMISSION_GRANT_SCOPE_TYPES` | Medium | Separate module path; doc comment on grant vocabulary; `PERMISSION_MODEL_SCOPE_GRANT_ALIASES` |
| Consumers still use bare string literals | Accepted | Registry + guards provide canonical source; no breaking type rename |
| Evaluation logic added to kernel permission module | Low | Ownership table + prohibited paths in handoff |
