# Slice B101 — Project Domain Vocabulary (PAS-001B §4.8 · KV-PS)

> **Position:** Slice `26 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B100 Delivered (payroll wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe project words.

## Purpose

Promote **KV-PS** `project` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/project/` using the 10-file module pattern; register PAS-001B-4.8-PROJECT; wire layout maturity and unified vocabulary gates.

Closed vocabularies: ProjectStatus, TaskStatus, BillingMethod, TimesheetStatus.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b101-project-domain-vocabulary.md

1. Objective    — Deliver project kernel ERP wire vocabulary module (contracts-only) under KV-PS.
2. Allowed layer— packages/kernel/src/erp-domain/project/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/project/project-authority.contract.ts
   packages/kernel/src/erp-domain/project/project-id.contract.ts
   packages/kernel/src/erp-domain/project/project-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/project/project-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/project/project-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/project/project-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/project/project-audit-actions.contract.ts
   packages/kernel/src/erp-domain/project/index.ts
   packages/kernel/src/erp-domain/project/__tests__/project-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b101-project-domain-vocabulary.md
4. Prohibited   — project-billing-service; timesheet-posting-engine; project-database-runtime · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-PS · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/project
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-PS delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/project/project-authority.contract.ts
   packages/kernel/src/erp-domain/project/__tests__/project-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe project words. It must not execute billing or timesheet posting runtime.
2. EmployeeId and CustomerId remain on kernel business-reference authority (PAS-001B Rule 2). ProjectId here is domain-scoped.
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/project/`.
4. Registry id PAS-001B-4.8-PROJECT — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/project/ | Manual + layout gate | PAS-001B §4.8 · KV-PS |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/project` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for project | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/project/index.ts` |
| 2 | `packages/kernel/src/erp-domain/project/__tests__/project-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-PS wire module delivered | Yes — B101 | `packages/kernel/src/erp-domain/project/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
