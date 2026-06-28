# Slice B103 — Document Domain Vocabulary (PAS-001B §4.8 · KV-DOC)

> **Position:** Slice `28 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B102 Delivered (assets wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — contracts-only promotion; no runtime services

**Clean Core impact:** A→A — wire vocabulary only; Kernel may describe ERP business document words.

## Purpose

Promote **KV-DOC** `document` from catalog-only to **delivered** under PAS-001B Rule 3 (one module = one slice). Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/document/` using the 10-file module pattern; register PAS-001B-4.8-DOCUMENT; wire layout maturity and unified vocabulary gates.

Closed vocabularies: DocumentClass, RetentionPolicy, DocumentLifecycleStatus, AttachmentRole.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b103-document-domain-vocabulary.md

1. Objective    — Deliver document kernel ERP wire vocabulary module (contracts-only) under KV-DOC.
2. Allowed layer— packages/kernel/src/erp-domain/document/** · packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · packages/kernel/package.json · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/document/document-authority.contract.ts
   packages/kernel/src/erp-domain/document/document-id.contract.ts
   packages/kernel/src/erp-domain/document/document-domain-vocabulary.registry.ts
   packages/kernel/src/erp-domain/document/document-domain-vocabulary.policy.ts
   packages/kernel/src/erp-domain/document/document-domain-wire-context.contract.ts
   packages/kernel/src/erp-domain/document/document-permission-vocabulary.contract.ts
   packages/kernel/src/erp-domain/document/document-audit-actions.contract.ts
   packages/kernel/src/erp-domain/document/index.ts
   packages/kernel/src/erp-domain/document/__tests__/document-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   docs/PAS/KERNEL/SLICE/b103-document-domain-vocabulary.md
4. Prohibited   — document-storage-service; cms-bridge; document-database-runtime · @afenda/database schema · ERP routes · posting runtime · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-DOC · kernel-authority · ADR-0020 business-reference Rule 2
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run src/erp-domain/document
   pnpm check:foundation-disposition
7. Closes       — Closes DoD #1–#4 · KV-DOC delivered · PAS-001B Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/document/document-authority.contract.ts
   packages/kernel/src/erp-domain/document/__tests__/document-domain-vocabulary.contract.test.ts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe ERP business document words. Not platform CMS or storage runtime.
2. Business partner IDs remain on kernel business-reference authority (PAS-001B Rule 2).
3. Module remains **contracts-only** — no Drizzle, HTTP, or posting services under `erp-domain/document/`.
4. Registry id PAS-001B-4.8-DOCUMENT — stable across PAS, tests, and layout contract.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | 10-file module pattern present under erp-domain/document/ | Manual + layout gate | PAS-001B §4.8 · KV-DOC |
| 2 | Vocabulary contract tests pass | `pnpm --filter @afenda/kernel test:run src/erp-domain/document` | PAS-001B §11 type safety |
| 3 | Layout maturity = delivered for document | `pnpm check:erp-domain-layout` | Kernel Blueprint §4 ERP Wire Catalog |
| 4 | Unified delivered vocabulary gate includes module | `pnpm check:erp-domain-delivered-vocabulary` | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `packages/kernel/src/erp-domain/document/index.ts` |
| 2 | `packages/kernel/src/erp-domain/document/__tests__/document-domain-vocabulary.contract.test.ts` |
| 3 | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| 4 | Gate output archived in B106 closure |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-DOC wire module delivered | Yes — B103 | `packages/kernel/src/erp-domain/document/` |
| Contracts-only guard | Yes | Module policy + prohibited surfaces |
