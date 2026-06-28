# Slice B81 — Controlling Domain Vocabulary (PAS-001B §4.8 · KV-CTRL)

> **Position:** Slice `6 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B80 Delivered (procurement wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe controlling words.

## Purpose

Promote **KV-CTRL** `controlling` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/controlling/` using the 10-file module pattern; register PAS-001B-4.8-CONTROLLING; wire layout maturity and unified vocabulary gates.

Closed vocabularies: CostElementCategory, AllocationMethod, ControllingDocumentType, VarianceCategory.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b81-controlling-domain-vocabulary.md

1. Objective    — Deliver controlling kernel ERP wire vocabulary module (contracts-only) under KV-CTRL.
2. Allowed layer— packages/kernel/src/erp-domain/controlling/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/controlling/controlling-authority.contract.ts
   packages/kernel/src/erp-domain/controlling/controlling-id.contract.ts
   packages/kernel/src/erp-domain/controlling/controlling-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/controlling/controlling-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/controlling/controlling-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/controlling/controlling-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/controlling/controlling-audit-actions.contract.ts
   packages/kernel/src/erp-domain/controlling/index.ts
   packages/kernel/src/erp-domain/controlling/__tests__/controlling-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b81-controlling-domain-vocabulary.md
4. Prohibited   — cost-posting-service; allocation-engine; controlling-database-runtime · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-CTRL · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/controlling
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-CTRL delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/controlling/controlling-authority.contract.ts
   packages/kernel/src/erp-domain/controlling/__tests__/controlling-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe controlling words. It must not execute cost posting or allocation runtime.
2. CostCenterId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2).
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/controlling/`.
4. Registry id PAS-001B-4.8-CONTROLLING — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/controlling/ | Manual + layout gate | PAS-001B §4.8 · KV-CTRL |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/controlling` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for controlling | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/controlling/index.ts` |
| 2 | `packages/kernel/src/erp-domain/controlling/__tests__/controlling-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-CTRL wire module delivered | Yes — B81 | `packages/kernel/src/erp-domain/controlling/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
