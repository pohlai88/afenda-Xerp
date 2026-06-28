# Slice B90 — Sales Domain Vocabulary (PAS-001B §4.8 · KV-SD)

> **Position:** Slice `15 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B89 Delivered (supply-chain wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe sales words.

## Purpose

Promote **KV-SD** `sales` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/sales/` using the 10-file module pattern; register PAS-001B-4.8-SALES; wire layout maturity and unified vocabulary gates.

Closed vocabularies: OrderStatus, QuoteStatus, SalesDocumentType, PricingContext.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b90-sales-domain-vocabulary.md

1. Objective    — Deliver sales kernel ERP wire vocabulary module (contracts-only) under KV-SD.
2. Allowed layer— packages/kernel/src/erp-domain/sales/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/sales/sales-authority.contract.ts
   packages/kernel/src/erp-domain/sales/sales-id.contract.ts
   packages/kernel/src/erp-domain/sales/sales-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/sales/sales-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/sales/sales-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/sales/sales-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/sales/sales-audit-actions.contract.ts
   packages/kernel/src/erp-domain/sales/index.ts
   packages/kernel/src/erp-domain/sales/__tests__/sales-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b90-sales-domain-vocabulary.md
4. Prohibited   — sales-posting-service; order-allocation-engine; sales-database-runtime · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-SD · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/sales
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-SD delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/sales/sales-authority.contract.ts
   packages/kernel/src/erp-domain/sales/__tests__/sales-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe sales words. It must not execute order fulfillment runtime.
2. CustomerId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2).
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/sales/`.
4. Registry id PAS-001B-4.8-SALES — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/sales/ | Manual + layout gate | PAS-001B §4.8 · KV-SD |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/sales` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for sales | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/sales/index.ts` |
| 2 | `packages/kernel/src/erp-domain/sales/__tests__/sales-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-SD wire module delivered | Yes — B90 | `packages/kernel/src/erp-domain/sales/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
