# Slice B83 — Tax Domain Vocabulary (PAS-001B §4.8 · KV-TAX)

> **Position:** Slice `8 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B82 Delivered (treasury wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe tax words.

## Purpose

Promote **KV-TAX** `tax` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/tax/` using the 10-file module pattern; register PAS-001B-4.8-TAX; wire layout maturity and unified vocabulary gates.

Closed vocabularies: TaxJurisdictionScope, TaxCalculationMethod, TaxDocumentStatus, WithholdingType.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b83-tax-domain-vocabulary.md

1. Objective    — Deliver tax kernel ERP wire vocabulary module (contracts-only) under KV-TAX.
2. Allowed layer— packages/kernel/src/erp-domain/tax/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/tax/tax-authority.contract.ts
   packages/kernel/src/erp-domain/tax/tax-id.contract.ts
   packages/kernel/src/erp-domain/tax/tax-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/tax/tax-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/tax/tax-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/tax/tax-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/tax/tax-audit-actions.contract.ts
   packages/kernel/src/erp-domain/tax/index.ts
   packages/kernel/src/erp-domain/tax/__tests__/tax-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b83-tax-domain-vocabulary.md
4. Prohibited   — tax-filing-service; tax-database-runtime; withholding-posting-engine · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-TAX · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/tax
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-TAX delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/tax/tax-authority.contract.ts
   packages/kernel/src/erp-domain/tax/__tests__/tax-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe tax words. It must not execute tax filing or determination runtime.
2. TaxJurisdictionId remains on kernel business-reference authority (PAS-001B Rule 2).
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/tax/`.
4. Registry id PAS-001B-4.8-TAX — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/tax/ | Manual + layout gate | PAS-001B §4.8 · KV-TAX |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/tax` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for tax | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/tax/index.ts` |
| 2 | `packages/kernel/src/erp-domain/tax/__tests__/tax-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-TAX wire module delivered | Yes — B83 | `packages/kernel/src/erp-domain/tax/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
