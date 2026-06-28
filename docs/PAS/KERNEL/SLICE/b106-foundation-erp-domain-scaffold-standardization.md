# Slice B106 — Foundation ERP Domain Scaffold Standardization (PAS-001B §2 · KV-ACCT · KV-INV)

> **Position:** Slice `31 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B81–B105 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** High

**Clean Core impact:** A→B — re-scaffold foundation modules to catalog scaffold (justified)

## Purpose

Close structural drift between hand-built foundation modules (accounting, inventory) and governed scaffold pattern. Re-scaffold from foundation specs while preserving ADR-0020 cross-refs and fiscal ID quarantine.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b106-foundation-erp-domain-scaffold-standardization.md

1. Objective    — Re-scaffold accounting + inventory to match catalog scaffold contract; all foundation gates green.
2. Allowed layer— packages/kernel/src/erp-domain/accounting/** · packages/kernel/src/erp-domain/inventory/** · scripts/governance/erp-domain-foundation-module-specs.mts · docs/PAS/KERNEL/**
3. Files        —
   scripts/governance/erp-domain-foundation-module-specs.mts
   scripts/governance/scaffold-foundation-erp-domain-modules.mts
   packages/kernel/src/erp-domain/accounting/
   packages/kernel/src/erp-domain/inventory/
   docs/PAS/KERNEL/SLICE/b106-foundation-erp-domain-scaffold-standardization.md
4. Prohibited   — @afenda/database schema · ERP routes · posting services · batch re-scaffold of B81+ modules
5. Authority    — PAS-001B §2 · Rule 2 · ADR-0020 · kernel-authority
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm check:accounting-domain-contracts
   pnpm check:inventory-domain-contracts
   pnpm --filter @afenda/kernel test:run src/erp-domain
   pnpm check:documentation-drift
7. Closes       — Closes DoD #1–#4 · PAS-001B Enterprise Accepted closure
8. Evidence     —
   packages/kernel/src/erp-domain/accounting/accounting-authority.contract.ts
   packages/kernel/src/erp-domain/inventory/inventory-authority.contract.ts
   scripts/governance/scaffold-foundation-erp-domain-modules.mts
   Gate output: all §13 gates
9. Attestation  — Contract · Test · Governance · Documentation · Maintainability
```

## Rules frozen

1. ACCOUNTING_REGISTRY_ID = PKG-R01; INVENTORY_REGISTRY_ID = PKGR02_INVENTORY preserved.
2. FiscalCalendarId/FiscalPeriodId remain forbidden platform floor branded ids.
3. Do not re-scaffold B81+ catalog modules in this slice.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Foundation modules match scaffold contract | pnpm check:erp-domain-delivered-vocabulary | PAS-001B §2 foundation standardization |
| 2 | Legacy domain gates retained green | pnpm check:accounting-domain-contracts · check:inventory-domain-contracts | PAS-001B §11 · KV-ACCT · KV-INV |
| 3 | 178+ erp-domain tests pass | pnpm --filter @afenda/kernel test:run src/erp-domain | PAS-001B §11 type safety |
| 4 | PAS-001B doc + status index synced | pnpm check:documentation-drift | PAS-001B §14 maturity exit |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/kernel/src/erp-domain/accounting/accounting-authority.contract.ts |
| 2 | packages/kernel/src/erp-domain/inventory/inventory-authority.contract.ts |
| 3 | scripts/governance/scaffold-foundation-erp-domain-modules.mts |
| 4 | Gate output: all §13 gates |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Foundation scaffold parity | Yes — B106 | `scripts/governance/scaffold-foundation-erp-domain-modules.mts` |

