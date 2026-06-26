# ADR-0019 — Inventory Domain Master Data Activation (PKG-R02)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-26 |
| **Owner** | Architecture Authority + Inventory Authority |
| **Supersedes** | — |
| **Superseded by** | [ADR-0020](ADR-0020-master-data-authority-consolidation.md) — **Decision item 1 only** (PKG-R02 filesystem package activation at `packages/inventory/`). Database schemas, RLS, CRUD services, ERP internal v1 API routes, and natural-key enforcement remain valid. |

---

## Context

[ARCH-MD-001](../ARCH/[Partially%20Implemented]%20ARCH-MD-001-master-data-enterprise.md) locks business master data ownership in `@afenda/kernel` (`authority_only`) and assigns **Product** and **Warehouse** to `@afenda/inventory` (PKG-R02). TIP-008B / `fdr-010-master-data-authority` frozen wire references (`ProductWireReference`, `WarehouseWireReference`) and natural keys (`sku`, `warehouseCode`).

`packages/inventory/` is blocked by `business-master-data-scaffold.policy.ts` until ADR + registry promotion. There is **no** central `@afenda/master-data` hub — domain-owned packages only (ARCH-MD-001 §6.6).

Related: ADR-0014, ADR-0015 (contracts-only pattern reference), ADR-0016, ARCH-MD-001, `fdr-010-master-data-authority`, future `fdr-r02-inventory`.

---

## Decision

1. **Activate PKG-R02 filesystem package** `@afenda/inventory` at `packages/inventory/` with lifecycle **`master-data-foundation`** until a future ADR accepts stock-movement runtime.
2. **Permitted in master-data-foundation phase:**
   - Serializable TypeScript contracts aligned to kernel wire references and ARCH-MD-001 §5.5 business keys
   - Authority barrel public API (`@afenda/inventory`)
   - Drizzle schemas + migrations in `@afenda/database` for `products` and `warehouses` tables (tenant catalog SKU; tenant+company warehouse code)
   - Tenant RLS defense-in-depth on new tables
   - Registry promotion: PKG-R02 `planned` → `active` in architecture-authority + human registries
   - Contract tests proving JSON serializability and kernel wire parity
3. **Prohibited until separate ADR / FDR slice:**
   - Stock movements, reservations, valuation, or quantity-on-hand services
   - ERP inventory module routes, Server Actions, or UI
   - `@afenda/database` runtime dependency **inside** `@afenda/inventory` (schemas stay in database package)
   - Import of `@afenda/inventory` from `@afenda/kernel`
   - Central master-data hub package or cross-domain MD persistence in kernel
4. **Allowed runtime dependencies for `@afenda/inventory` (master-data-foundation):**
   - `@afenda/kernel` — consume business master data wire references and branded IDs only
   - `@afenda/typescript-config` — dev tooling
5. **Scaffold unblock:** Remove `packages/inventory` from `BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS`; keep CRM, HRM, procurement blocked until their ADRs.

---

## Consequences

### Positive

- First domain MD runtime under ARCH-MD-001 sequence (inventory before CRM/procurement/HRM).
- Product SKU and warehouse code uniqueness enforced at database layer per kernel authority.
- Clear stop rule before stock-movement complexity.

### Negative / trade-offs

- Two-step activation (master-data ADR, then stock-runtime ADR) adds process overhead.
- `@afenda/database` schema ownership coordinated with inventory domain contracts.

---

## Acceptance Gate

ARCH-MD-001 Slice 3 + `fdr-r02-inventory` Slice 1 complete when all pass:

- `pnpm --filter @afenda/inventory typecheck`
- `pnpm --filter @afenda/inventory test:run`
- `pnpm --filter @afenda/database typecheck`
- `pnpm --filter @afenda/kernel test:run` (scaffold policy tests updated)
- `pnpm check:business-master-data-scaffold`
- `pnpm check:foundation-disposition`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

---

## References

- ADR-0014 — Foundation Disposition Registry
- ADR-0015 — Accounting Domain Contracts-Only Activation (pattern reference)
- ADR-0016 — FDR Delivery Authority
- ARCH-MD-001 — Master Data Enterprise Architecture
- `fdr-010-master-data-authority` — kernel authority paired FDR
- `fdr-r02-inventory` — domain delivery FDR
