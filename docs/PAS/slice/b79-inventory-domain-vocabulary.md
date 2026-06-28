# Slice B79 — Inventory Domain Vocabulary Promotion

**Status:** Delivered (2026-06-28)

**Objective:** Promote `inventory` from catalog-only to `delivered` under PAS-001B Rule 3 — one module, one slice. Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/inventory/` mirroring `accounting/` pattern; wire `check:inventory-domain-contracts` and package subpath export.

**Authority:** PAS-001B §2 · ADR-0020 · Rule 2 (no ProductId/WarehouseId duplication)

**Prerequisite:** B76–B78 Delivered

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B79 |
| **PAS** | PAS-001B |
| **Objective** | Deliver inventory kernel vocabulary module (contracts-only) |
| **Allowed layer** | `packages/kernel/src/erp-domain/inventory/**`, layout contract, governance gates, `packages/kernel/package.json`, PAS docs |
| **Prohibited** | Stock posting runtime, Drizzle, `@afenda/database`, `packages/inventory` recreation, other module folders |
| **Files (expected)** | inventory module (10-file pattern), `check-inventory-domain-contracts`, layout maturity update, B79 handoff |
| **Authority** | kernel-authority · PAS-001B §2 |
| **Gates** | `pnpm check:inventory-domain-contracts`, `pnpm check:erp-domain-layout`, `pnpm --filter @afenda/kernel typecheck`, `pnpm check:foundation-disposition` |

---

## Closure artifacts

- [x] `erp-domain/inventory/` — authority, ids, 4 closed vocabularies, registry, policy, wire context, permissions, audit, index, test
- [x] `inventory` maturity → `delivered` in layout contract
- [x] `@afenda/kernel/erp-domain/inventory` package.json subpath
- [x] `pnpm check:inventory-domain-contracts`
- [x] PKGR01B gates include inventory domain gate
