# Slice B86 — Manufacturing Domain Vocabulary (PAS-001B §4.8 · KV-MFG)

> **Position:** Slice `11 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B85 Delivered (intercompany wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe manufacturing words.

## Purpose

Promote **KV-MFG** `manufacturing` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/manufacturing/` using the 10-file module pattern; register PAS-001B-4.8-MANUFACTURING; wire layout maturity and unified vocabulary gates.

Closed vocabularies: ProductionOrderStatus, ManufacturingOrderType, CapacityPlanningMethod, ShopFloorEventType.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b86-manufacturing-domain-vocabulary.md

1. Objective    — Deliver manufacturing kernel ERP wire vocabulary module (contracts-only) under KV-MFG.
2. Allowed layer— packages/kernel/src/erp-domain/manufacturing/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/manufacturing/manufacturing-authority.contract.ts
   packages/kernel/src/erp-domain/manufacturing/manufacturing-id.contract.ts
   packages/kernel/src/erp-domain/manufacturing/manufacturing-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/manufacturing/manufacturing-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/manufacturing/manufacturing-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/manufacturing/manufacturing-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/manufacturing/manufacturing-audit-actions.contract.ts
   packages/kernel/src/erp-domain/manufacturing/index.ts
   packages/kernel/src/erp-domain/manufacturing/__tests__/manufacturing-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b86-manufacturing-domain-vocabulary.md
4. Prohibited   — production-posting-service; mrp-engine; manufacturing-database-runtime · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-MFG · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/manufacturing
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-MFG delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/manufacturing/manufacturing-authority.contract.ts
   packages/kernel/src/erp-domain/manufacturing/__tests__/manufacturing-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe manufacturing words. It must not execute production posting runtime.
2. ProductId and WarehouseId remain on kernel business-reference authority (PAS-001B Rule 2).
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/manufacturing/`.
4. Registry id PAS-001B-4.8-MANUFACTURING — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/manufacturing/ | Manual + layout gate | PAS-001B §4.8 · KV-MFG |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/manufacturing` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for manufacturing | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/manufacturing/index.ts` |
| 2 | `packages/kernel/src/erp-domain/manufacturing/__tests__/manufacturing-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-MFG wire module delivered | Yes — B86 | `packages/kernel/src/erp-domain/manufacturing/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
