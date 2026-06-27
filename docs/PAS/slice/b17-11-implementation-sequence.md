# Slice B17 — Implementation Sequence (PAS-001 §11)

**Prerequisite:** Slice B16 — kernel package structure (`docs/PAS/slice/b16-6.2-package-structure.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A (sequence registry + drift gate only — no runtime behavior change)

## Purpose

Formalize PAS-001 §11 recommended kernel addition sequence as a typed governance registry with evidence paths, deferred-addition parity, prohibited path guards, and a dedicated governance gate.

## Handoff block

```
Handoff from: docs/PAS/slice/b17-11-implementation-sequence.md

1. Objective    — Implement PAS-001 §11 implementation sequence registry: eleven ordered steps with evidence paths, deferred additions list, governance gate, tests, and PAS runtime authority pointer.
2. Allowed layer— packages/kernel/src/governance/ (+ scripts/governance/check-kernel-implementation-sequence.mts, package.json, docs/PAS/)
3. Files        —
   packages/kernel/src/governance/kernel-implementation-sequence.contract.ts
   packages/kernel/src/governance/__tests__/kernel-implementation-sequence.contract.test.ts
   packages/kernel/src/governance/index.ts
   packages/kernel/src/index.ts
   scripts/governance/check-kernel-implementation-sequence.mts
   package.json
   docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md (§11)
   docs/PAS/slice/b17-11-implementation-sequence.md
4. Prohibited   — FiscalCalendarContext / CurrencyContext files; fiscal runtime in kernel; ID_FAMILIES edits; apps/erp; DB migrations; Accounting Core runtime; duplicate §11 prose outside governance contract
5. Authority    — PAS-001 §11 · kernel-authority skill · pas-prohibited-surface-scan skill
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:kernel-implementation-sequence
   pnpm quality:boundaries
   pnpm quality:architecture
7. Closes       — Missing typed §11 sequence registry; missing deferred-addition parity gate; no runtime authority pointer for §11
8. Evidence     —
   packages/kernel/src/governance/kernel-implementation-sequence.contract.ts
   packages/kernel/src/governance/__tests__/kernel-implementation-sequence.contract.test.ts
   scripts/governance/check-kernel-implementation-sequence.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Eleven ordered steps match PAS §11 recommended sequence verbatim.
2. Each step cites on-disk evidence paths — registry does not invent parallel contracts.
3. Deferred additions list matches PAS §11 “Do not add in kernel” bullets verbatim.
4. Prohibited context paths (`currency-context`, `fiscal-calendar-context`) must remain absent.
5. Registry is authority metadata only — no migrations, authorization, or audit runtime.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 11 steps registered in order | kernel-implementation-sequence.contract.test.ts |
| 2 | Deferred additions match PAS §11 | kernel-implementation-sequence.contract.test.ts |
| 3 | Evidence paths on every step | check-kernel-implementation-sequence.mts |
| 4 | Governance script gates registered | kernel-implementation-sequence.contract.test.ts |
| 5 | Prohibited deferred paths absent | check-kernel-implementation-sequence.mts |
| 6 | Public exports on `@afenda/kernel` | index.ts |
| 7 | Kernel typecheck green | pnpm --filter @afenda/kernel typecheck |

## Runtime delivered

| Surface | Path |
| --- | --- |
| Sequence registry | `governance/kernel-implementation-sequence.contract.ts` |
| Policy constants | `KERNEL_IMPLEMENTATION_SEQUENCE_POLICY` |
| Lookup helpers | `getKernelImplementationSequenceStep`, `listKernelImplementationSequenceSteps` |
| Governance gate | `pnpm check:kernel-implementation-sequence` |
| Contract tests | `governance/__tests__/kernel-implementation-sequence.contract.test.ts` |
