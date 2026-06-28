# Slice B96 — Service Domain Vocabulary (PAS-001B §4.8 · KV-SVC)

> **Position:** Slice `21 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B95 Delivered (pos wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe service case words.

## Purpose

Promote **KV-SVC** `service` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/service/` using the 10-file module pattern; register PAS-001B-4.8-SERVICE; wire layout maturity and unified vocabulary gates.

Closed vocabularies: CaseStatus, CasePriority, ServiceLevel, ResolutionType.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b96-service-domain-vocabulary.md

1. Objective    — Deliver service kernel ERP wire vocabulary module (contracts-only) under KV-SVC.
2. Allowed layer— packages/kernel/src/erp-domain/service/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/service/service-authority.contract.ts
   packages/kernel/src/erp-domain/service/service-id.contract.ts
   packages/kernel/src/erp-domain/service/service-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/service/service-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/service/service-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/service/service-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/service/service-audit-actions.contract.ts
   packages/kernel/src/erp-domain/service/index.ts
   packages/kernel/src/erp-domain/service/__tests__/service-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b96-service-domain-vocabulary.md
4. Prohibited   — service-dispatch-service; sla-engine; service-database-runtime · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-SVC · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/service
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-SVC delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/service/service-authority.contract.ts
   packages/kernel/src/erp-domain/service/__tests__/service-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe service case words. It must not execute field dispatch runtime.
2. CustomerId remains on kernel business-reference authority (PAS-001B Rule 2).
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/service/`.
4. Registry id PAS-001B-4.8-SERVICE — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/service/ | Manual + layout gate | PAS-001B §4.8 · KV-SVC |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/service` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for service | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/service/index.ts` |
| 2 | `packages/kernel/src/erp-domain/service/__tests__/service-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-SVC wire module delivered | Yes — B96 | `packages/kernel/src/erp-domain/service/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
