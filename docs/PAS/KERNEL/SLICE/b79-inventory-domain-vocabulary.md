# Slice B79 — Inventory Domain Vocabulary (PAS-001B §4.8 · KV-INV)

> **Position:** Slice `4 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B78 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — contracts-only wire promotion

## Purpose

Promote KV-INV inventory from catalog-only to delivered under PAS-001B Rule 3 — first individual module promotion after audit closure.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b79-inventory-domain-vocabulary.md

1. Objective    — Deliver inventory kernel ERP wire vocabulary module (contracts-only).
2. Allowed layer— packages/kernel/src/erp-domain/inventory/** · governance gates · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/erp-domain/inventory/inventory-authority.contract.ts
   packages/kernel/src/erp-domain/inventory/__tests__/inventory-domain-vocabulary.contract.test.ts
   scripts/governance/check-inventory-domain-contracts.mts
   docs/PAS/KERNEL/SLICE/b79-inventory-domain-vocabulary.md
4. Prohibited   — Stock posting runtime · @afenda/database · packages/inventory recreation · other erp-domain modules
5. Authority    — PAS-001B §4.8 · KV-INV · kernel-authority · ADR-0020 Rule 2
6. Gates        —
   pnpm check:inventory-domain-contracts
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
7. Closes       — Closes DoD #1–#4 · KV-INV delivered
8. Evidence     —
   packages/kernel/src/erp-domain/inventory/index.ts
   scripts/governance/check-inventory-domain-contracts.mts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel describes inventory words only — no stock posting runtime.
2. ProductId/WarehouseId remain business-reference authority (Rule 2).
3. Module remains contracts-only.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Inventory 10-file module pattern present | pnpm check:inventory-domain-contracts | PAS-001B §4.8 · KV-INV |
| 2 | Layout maturity = delivered for inventory | pnpm check:erp-domain-layout | Kernel Blueprint §4 |
| 3 | Vocabulary tests pass | pnpm --filter @afenda/kernel test:run src/erp-domain/inventory | PAS-001B §11 |
| 4 | Unified vocabulary gate includes inventory | pnpm check:erp-domain-delivered-vocabulary | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/kernel/src/erp-domain/inventory/index.ts |
| 2 | scripts/governance/check-inventory-domain-contracts.mts |
| 3 | packages/kernel/src/erp-domain/erp-domain-layout.contract.ts |
| 4 | Gate output: check:erp-domain-delivered-vocabulary |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-INV wire module | Yes — B79 | `packages/kernel/src/erp-domain/inventory/` |

