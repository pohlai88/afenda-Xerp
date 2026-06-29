# Slice B80 — Procurement Domain Vocabulary (PAS-001B §4.8 · KV-PROC)

> **Position:** Slice `5 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B79 Delivered (inventory wire)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — contracts-only wire promotion

## Purpose

Promote KV-PROC `procurement` from catalog-only to delivered under PAS-001B Rule 3 — one module, one slice. No legacy handoff existed; this composed slice is SSOT.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b80-procurement-domain-vocabulary.md

1. Objective    — Deliver procurement kernel ERP wire vocabulary module (contracts-only) under KV-PROC.
2. Allowed layer— packages/kernel/src/erp-domain/procurement/** · erp-domain-layout.contract.ts · governance gates
3. Files        —
   packages/kernel/src/erp-domain/procurement/procurement-authority.contract.ts
   packages/kernel/src/erp-domain/procurement/__tests__/procurement-domain-vocabulary.contract.test.ts
   scripts/governance/check-procurement-domain-contracts.mts
   docs/PAS/KERNEL/SLICE/b80-procurement-domain-vocabulary.md
4. Prohibited   — purchase-order posting runtime · @afenda/database · packages/procurement recreation
5. Authority    — PAS-001B §4.8 · KV-PROC · kernel-authority · ADR-0020 Rule 2
6. Gates        —
   pnpm check:procurement-domain-contracts
   pnpm check:erp-domain-layout
   pnpm check:erp-domain-delivered-vocabulary
   pnpm --filter @afenda/kernel typecheck
7. Closes       — Closes DoD #1–#4 · KV-PROC delivered · Rule 3
8. Evidence     —
   packages/kernel/src/erp-domain/procurement/index.ts
   scripts/governance/check-procurement-domain-contracts.mts
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   Gate output: check:erp-domain-delivered-vocabulary
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel may describe procurement words — must not execute PO posting runtime.
2. `SupplierId` remains on kernel business-reference authority (Rule 2) — not promoted to domain branded IDs.
3. Module remains contracts-only under erp-domain/procurement/.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Procurement 10-file module pattern present | pnpm check:procurement-domain-contracts | PAS-001B §4.8 · KV-PROC |
| 2 | Layout maturity = delivered for procurement | pnpm check:erp-domain-layout | Kernel Blueprint §4 |
| 3 | Vocabulary tests pass | pnpm --filter @afenda/kernel test:run src/erp-domain/procurement | PAS-001B §11 |
| 4 | Unified vocabulary gate includes procurement | pnpm check:erp-domain-delivered-vocabulary | PAS-001B §13 · Rule 3 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/kernel/src/erp-domain/procurement/index.ts |
| 2 | scripts/governance/check-procurement-domain-contracts.mts |
| 3 | packages/kernel/src/erp-domain/erp-domain-layout.contract.ts |
| 4 | Gate output: check:erp-domain-delivered-vocabulary |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| KV-PROC wire module | Yes — B80 | `packages/kernel/src/erp-domain/procurement/` |

## Foundation gap audit (runtime readiness)

Wire vocabulary delivery (this slice) is **not** procurement business runtime. Enterprise readiness gap audit:

- [Procurement Runtime Foundation Gap Report](../audit/procurement-foundation-gap-report.md) (PAS-PROC-FDN-AUDIT-001 · 2026-06-30)
- Proposed foundation slices: ERP-PROC-FDN-001 through ERP-PROC-FDN-009

