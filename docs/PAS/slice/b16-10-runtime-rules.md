# Slice B16 — Runtime Rules (PAS-001 §10)

**Prerequisite:** Async context propagation runtime (`packages/kernel/src/propagation/`, governance gates `check:kernel-propagation-isolation` + `check:kernel-zero-runtime-deps`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A (runtime rules registry + drift gate only — no new runtime beyond approved propagation)

## Purpose

Formalize PAS-001 §10 “Runtime Rules” as a typed governance registry with seven rule labels, one approved async propagation primitive, PAS label parity gate, aggregate `check:kernel-runtime-rules` script, and PAS §10 runtime authority pointer.

## Handoff block

```
Handoff from: docs/PAS/slice/b16-10-runtime-rules.md

1. Objective    — Formalize PAS §10 runtime rules registry: seven rules, approved async propagation primitive, parity tests, aggregate runtime-rules gate, public exports, slice doc sync, subpath export smoke fix.
2. Allowed layer— packages/kernel/src/governance/ (+ scripts/governance/, docs/PAS/, root package.json script alias)
3. Files        —
   packages/kernel/src/governance/kernel-runtime-rules.contract.ts
   packages/kernel/src/governance/__tests__/kernel-runtime-rules.contract.test.ts
   packages/kernel/src/governance/index.ts
   packages/kernel/src/index.ts
   packages/kernel/src/__tests__/subpath-exports.test.ts
   scripts/governance/check-kernel-runtime-rules.mts
   docs/PAS/slice/b16-10-runtime-rules.md
   docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md (§10 runtime authority)
   package.json (check:kernel-runtime-rules alias)
4. Prohibited   — ID_FAMILIES edits; apps/erp; packages/database; DB migrations; new external npm deps in kernel; new runtime beyond async propagation; permission evaluation; duplicate §10 bullet lists outside governance contract
5. Authority    — PAS-001 §10 · §4.11 · §12.4 · §13 · kernel-authority skill
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:kernel-runtime-rules
   pnpm check:kernel-propagation-isolation
   pnpm check:kernel-zero-runtime-deps
   pnpm check:kernel-events-wire-serializable
   pnpm quality:boundaries
7. Closes       — Missing typed §10 runtime rules registry; missing PAS §10 runtime authority pointer; subpath-exports OperatingContext type drift; no aggregate runtime-rules gate
8. Evidence     —
   packages/kernel/src/governance/kernel-runtime-rules.contract.ts
   packages/kernel/src/governance/__tests__/kernel-runtime-rules.contract.test.ts
   scripts/governance/check-kernel-runtime-rules.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Seven PAS §10 runtime rules match numbered list labels verbatim and in order.
2. Only one approved runtime primitive: async context propagation (`kernelContext.run/get/fork`).
3. Registry is authority metadata only — no database, HTTP, auth, permission evaluation, or UI runtime.
4. Aggregate CI usage runs `check:kernel-runtime-rules` alongside existing propagation/zero-deps/event gates separately (no nested pnpm calls inside the check script).
5. Everything else must remain contracts, pure helpers, or registries.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 7 rules registered | kernel-runtime-rules.contract.test.ts |
| 2 | Labels match PAS §10 verbatim | kernel-runtime-rules.contract.test.ts |
| 3 | Approved primitive references propagation paths | check-kernel-runtime-rules.mts |
| 4 | Rule id guard works | kernel-runtime-rules.contract.test.ts |
| 5 | Registry JSON-serializable | kernel-runtime-rules.contract.test.ts |
| 6 | PAS/registry parity gate | check-kernel-runtime-rules.mts |
| 7 | Public exports on `@afenda/kernel` | index.ts |
| 8 | Subpath export smoke avoids invalid OperatingContext literals | subpath-exports.test.ts |
| 9 | PAS §10 runtime authority pointer | PAS-001-KERNEL-AUTHORITY-STANDARD.md |

## Runtime delivered

| Surface | Path |
| --- | --- |
| Runtime rules registry | `governance/kernel-runtime-rules.contract.ts` |
| Policy constants | `KERNEL_RUNTIME_RULES_POLICY`, `KERNEL_RUNTIME_RULES_AUTHORITY` |
| Approved primitive registry | `KERNEL_APPROVED_RUNTIME_PRIMITIVES` |
| Lookup helpers | `getKernelRuntimeRule`, `listKernelRuntimeRules`, `isKernelRuntimeRuleId` |
| Governance gate | `pnpm check:kernel-runtime-rules` |
| Contract tests | `governance/__tests__/kernel-runtime-rules.contract.test.ts` |
