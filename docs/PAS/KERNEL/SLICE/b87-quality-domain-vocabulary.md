# Slice B87 — Quality Domain Vocabulary (PAS-001B §4.8 · KV-QM)

> **Position:** Slice `12 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B86 Delivered (manufacturing wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe quality words.

## Purpose

Promote **KV-QM** `quality` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/quality/` using the 10-file module pattern; register PAS-001B-4.8-QUALITY; wire layout maturity and unified vocabulary gates.

Closed vocabularies: InspectionResultStatus, QualityNotificationPriority, InspectionType, DispositionCode.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b87-quality-domain-vocabulary.md

1. Objective    — Deliver quality kernel ERP wire vocabulary module (contracts-only) under KV-QM.
2. Allowed layer— packages/kernel/src/erp-domain/quality/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/quality/quality-authority.contract.ts
   packages/kernel/src/erp-domain/quality/quality-id.contract.ts
   packages/kernel/src/erp-domain/quality/quality-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/quality/quality-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/quality/quality-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/quality/quality-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/quality/quality-audit-actions.contract.ts
   packages/kernel/src/erp-domain/quality/index.ts
   packages/kernel/src/erp-domain/quality/__tests__/quality-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b87-quality-domain-vocabulary.md
4. Prohibited   — quality-posting-service; inspection-engine; quality-database-runtime · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-QM · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/quality
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-QM delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/quality/quality-authority.contract.ts
   packages/kernel/src/erp-domain/quality/__tests__/quality-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe quality words. It must not execute inspection posting runtime.
2. ProductId remains on kernel business-reference authority (PAS-001B Rule 2).
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/quality/`.
4. Registry id PAS-001B-4.8-QUALITY — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/quality/ | Manual + layout gate | PAS-001B §4.8 · KV-QM |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/quality` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for quality | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/quality/index.ts` |
| 2 | `packages/kernel/src/erp-domain/quality/__tests__/quality-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-QM wire module delivered | Yes — B87 | `packages/kernel/src/erp-domain/quality/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
