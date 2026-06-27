# Slice B16 — Kernel Contract Rules (PAS-001 §9)

**Prerequisite:** Slice B16 — kernel prohibited ownership (`docs/PAS/slice/b16-5-kernel-prohibited-ownership.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A (governance policy + drift gate only — no runtime behavior change)

## Purpose

Enforce PAS-001 §9 kernel contract rules through a typed policy registry, automated governance gate, contract tests, and retirement of duplicate platform-id contract paths.

## Handoff block

```
Handoff from: docs/PAS/slice/b16-9-kernel-contract-rules.md

1. Objective    — Enforce PAS-001 §9 via kernel-contract-rules.policy.ts, governance gate check:kernel-contract-rules, tests, and cleanup of kernel contract violations (retired platform-id paths, duplicate shims, import side effects).
2. Allowed layer— packages/kernel/**, scripts/governance/**, docs/PAS/slice/b16-9-kernel-contract-rules.md, package.json (gate script only), docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md (§9 cross-ref only if needed)
3. Files        —
   docs/PAS/slice/b16-9-kernel-contract-rules.md
   packages/kernel/src/governance/kernel-contract-rules.policy.ts
   packages/kernel/src/governance/index.ts
   packages/kernel/src/governance/__tests__/kernel-contract-rules.policy.test.ts
   packages/kernel/src/index.ts
   scripts/governance/check-kernel-contract-rules.mts
   scripts/governance/__tests__/check-kernel-contract-rules.test.ts
4. Prohibited   — apps/erp/**; packages/database/** migrations; Accounting Core runtime; new npm deps in kernel; packages/ui/**; Slice C database schema work; reintroducing brandRequiredId/brandOptionalId exports
5. Authority    — PAS-001 §9 · kernel-authority skill · ADR-0021
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:kernel-contract-rules
   pnpm check:kernel-identity-surface
   pnpm check:kernel-zero-runtime-deps
   pnpm quality:boundaries
   pnpm quality:architecture
7. Closes       — Missing unified PAS §9 enforcement gate and policy; retired platform-id path drift
8. Evidence     —
   packages/kernel/src/governance/kernel-contract-rules.policy.ts
   packages/kernel/src/governance/__tests__/kernel-contract-rules.policy.test.ts
   scripts/governance/check-kernel-contract-rules.mts
   scripts/governance/__tests__/check-kernel-contract-rules.test.ts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. All 13 PAS §9 contract rules are registered in `KERNEL_CONTRACT_RULES` with stable ids and PAS rule numbers.
2. Retired `contracts/platform-id*.ts` paths must stay absent — identity authority lives under `packages/kernel/src/identity/`.
3. Kernel sources must not self-import `@afenda/kernel`.
4. `*.contract.ts` object properties use `readonly` (excluding methods, index signatures, enums, primitive type aliases).
5. Contract and identity modules must not execute I/O or time side effects at import time.
6. Delegated rules map to existing gates (identity surface, zero-runtime-deps, events wire, context surface) — no duplicate enforcement.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 13 PAS §9 rules registered | kernel-contract-rules.policy.test.ts |
| 2 | Rule descriptions match PAS §9 | kernel-contract-rules.policy.test.ts |
| 3 | Delegated gate mapping documented | kernel-contract-rules.policy.test.ts |
| 4 | Retired platform-id paths absent | check-kernel-contract-rules.mts |
| 5 | No @afenda/kernel self-imports | check-kernel-contract-rules.mts |
| 6 | Contract readonly enforcement | check-kernel-contract-rules.mts |
| 7 | No import-time side effects in contracts/identity | check-kernel-contract-rules.mts |
| 8 | Public exports on `@afenda/kernel` | index.ts |
| 9 | Kernel typecheck green | pnpm --filter @afenda/kernel typecheck |

## Runtime delivered

| Surface | Path |
| --- | --- |
| Contract rules policy | `governance/kernel-contract-rules.policy.ts` |
| Policy constants | `KERNEL_CONTRACT_RULES`, `KERNEL_CONTRACT_RULES_POLICY` |
| Lookup helpers | `getKernelContractRule`, `listKernelContractRules` |
| Governance gate | `pnpm check:kernel-contract-rules` |
| Contract tests | `governance/__tests__/kernel-contract-rules.policy.test.ts` |
| Gate tests | `scripts/governance/__tests__/check-kernel-contract-rules.test.ts` |

## Delegated enforcement map

| PAS §9 rule | Primary gate |
| --- | --- |
| 1 TypeScript strict mode | `pnpm --filter @afenda/kernel typecheck` |
| 2 No project-internal imports | `pnpm check:kernel-contract-rules` |
| 3 JSON-serializable wire shape | `pnpm check:kernel-events-wire-serializable` |
| 4 Branded IDs | `pnpm check:kernel-identity-surface` |
| 5 readonly object properties | `pnpm check:kernel-contract-rules` |
| 6 Explicit null for absent context | `pnpm check:kernel-context-surface` |
| 7 No silent tenant/company/org fallback | `pnpm check:kernel-context-surface` |
| 8 No untyped string for governed IDs | `pnpm check:kernel-identity-surface` |
| 9 No hidden business logic | `pnpm check:kernel-prohibited-ownership` |
| 10 No side effects during import | `pnpm check:kernel-contract-rules` |
| 11 No duplicated contract pattern | `pnpm check:kernel-contract-rules` |
| 12 No greenfield brand/error replacement | `pnpm check:kernel-identity-surface` |
| 13 No incompatible doc stubs | Documentation review |
