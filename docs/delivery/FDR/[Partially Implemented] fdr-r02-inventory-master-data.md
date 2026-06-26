# fdr-r02-inventory-master-data — Inventory Master Data (Product + Warehouse)

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-r02-inventory-master-data` |
| **Registry entry ID** | `PKGR02_INVENTORY` |
| **Package** | `@afenda/database` + `apps/erp` (physical) · Inventory domain (PKG-R02) |
| **Authority** | ADR-0020 · ADR-0019 (partial — package activation superseded) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — ARCH-MD-001 domain sequence P0 |
| **Enterprise readiness** | **28/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | MM master data · WM org · SAP namespace |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts).

| Field | Value |
| --- | --- |
| id | `PKGR02_INVENTORY` |
| packageId | PKG-R02 |
| packageName | `@afenda/database` |
| domain | `inventory-master-data` |
| lane | green-lane |
| authority | ADR-0020 |
| runtimeOwner | `packages/database` |
| gates | `pnpm --filter @afenda/database test:run`; `pnpm --filter @afenda/kernel test:run`; `pnpm quality:boundaries` |
| prohibited | `do-not-create-central-master-data-hub`; `do-not-recreate-packages-inventory`; `do-not-implement-stock-movements-without-fdr-slice` |
| allowedAgents | `inventory-agent`; `foundation-registry-owner`; `fdr-slice-implementer` |

## Package ownership

Per [ADR-0020](../../adr/ADR-0020-master-data-authority-consolidation.md) §Domain owner versus physical implementation owner — Inventory Authority (domain) is separate from physical persistence/API wiring:

| Package | Role | Path |
| --- | --- | --- |
| `@afenda/kernel` | Wire refs + natural-key policy registry | `packages/kernel/src/contracts/business-master-data/` |
| `@afenda/database` | Schemas, RLS, CRUD, conflict mapping | `product.schema.ts` · `warehouse.schema.ts` · `product/` · `warehouse/` services |
| `apps/erp` | Internal v1 API + future UI composition | `apps/erp/src/app/api/internal/v1/inventory/` |
| ~~`@afenda/inventory`~~ | **Retired** — ADR-0020; `packages/inventory/` forbidden | — |

## Purpose

Deliver **master-data-foundation** runtime for Product and Warehouse per [ADR-0019](../../adr/ADR-0019-inventory-domain-master-data-activation.md), [ADR-0020](../../adr/ADR-0020-master-data-authority-consolidation.md), and [ARCH-MD-001](../../ARCH/[Partially%20Implemented]%20ARCH-MD-001-master-data-enterprise.md) — first domain in MD sequence. **Domain ownership** (Inventory Authority) is separate from **physical implementation** (`@afenda/database` persistence + `apps/erp` API). Kernel remains `authority_only`; wire refs live in `@afenda/kernel`; database package owns persistence; ERP app owns HTTP wiring.

Authority: ADR-0014 · ADR-0016 · ADR-0019 · ADR-0020 · `fdr-010-master-data-authority` (paired kernel FDR).

## Scope

**In scope (Slice 1 — Delivered 2026-06-26)**

> **Historical footnote:** Slice 1 originally scaffolded `packages/inventory/` per ADR-0019. ADR-0020 (Accepted 2026-06-27) retires that path — canonical evidence is kernel wire bridge + database schema. Slice 1 deliverables preserved; paths updated below.

- Kernel wire bridge (`ProductWireReference`, `WarehouseWireReference`)
- Drizzle `products` + `warehouses` tables with natural-key uniqueness
- Tenant RLS on new tables
- Registry promotion PKGR02_INVENTORY

**Out of scope (future slices)**

- ERP inventory admin UI (Server Actions, settings panels)
- Import of `@afenda/inventory` from `@afenda/kernel` (package retired)

**In scope (Slice 4 — Delivered 2026-06-27)**

- Stock level + stock movement Drizzle schemas and migrations
- Tenant RLS on `stock_levels` and `stock_movements`
- `recordStockMovement` / `listStockLevelsByTenant` with non-negative QOH guard
- Internal v1 REST routes: `/api/internal/v1/inventory/stock-levels` · `/stock-movements`
- OpenAPI + route catalog (8 governed inventory contracts total)

**In scope (Slice 2 — Delivered 2026-06-26)**

- Product + warehouse CRUD services in `@afenda/database`
- Inventory permission keys (`inventory.product_*`, `inventory.warehouse_*`)
- Internal v1 REST routes: `/api/internal/v1/inventory/products` · `/warehouses`
- OpenAPI + route catalog snapshot refresh

## §Runtime evidence

| Artifact | Path | Proof |
| --- | --- | --- |
| ADR | `docs/adr/ADR-0020-master-data-authority-consolidation.md` | Accepted 2026-06-27 |
| ADR (historical) | `docs/adr/ADR-0019-inventory-domain-master-data-activation.md` | Superseded by ADR-0020 physical model |
| Kernel wire refs | `packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts` | `ProductWireReference`, `WarehouseWireReference` |
| Scaffold policy | `packages/kernel/src/contracts/business-master-data/business-master-data-scaffold.policy.ts` | `packages/inventory` in `BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS` |
| Persistence ownership | `packages/kernel/src/contracts/business-master-data/business-master-data-shared-package.policy.ts` | `reservedPackageId: "@afenda/database"` for product + warehouse |
| Product schema | `packages/database/src/schema/product.schema.ts` | SKU unique per tenant |
| Warehouse schema | `packages/database/src/schema/warehouse.schema.ts` | Code unique per tenant+company |
| Migration | `20260626165831_wandering_nitro.sql` | drizzle-kit generate |
| RLS | `20260626170000_inventory_master_data_rls.sql` | tenant-rls-coverage registry |
| Product CRUD | `packages/database/src/product/product.service.ts` | insert/update/list/find + audit |
| Warehouse CRUD | `packages/database/src/warehouse/warehouse.service.ts` | insert/update/list/find + audit |
| Permissions | `packages/permissions` + `platform-permissions.catalog.ts` | seed-catalog-alignment |
| Internal API | `apps/erp/src/app/api/internal/v1/inventory/` | 8 governed contracts (products, warehouses, stock) |
| OpenAPI | `afenda-internal-v1.openapi.json` | export:openapi exit 0 |
| Natural-key conflicts | `postgres-error.contract.ts` + `ProductSkuConflictError` / `WarehouseCodeConflictError` | API `409 conflict` |
| Stock level schema | `packages/database/src/schema/stock-level.schema.ts` | QOH snapshot per product + warehouse |
| Stock movement schema | `packages/database/src/schema/stock-movement.schema.ts` | receipt · issue · adjustment audit trail |
| Stock migration | `20260626183108_amusing_liz_osborn.sql` | drizzle-kit generate |
| Stock RLS | `20260626183200_inventory_stock_rls.sql` | `TENANT_RLS_INVENTORY_STOCK_POLICIES` (2 policies) |
| Stock service | `packages/database/src/stock/stock.service.ts` | transaction + audit + QOH guard |
| Stock service tests | `packages/database/src/stock/__tests__/stock.service.test.ts` | happy + error paths |
| Stock internal API | `stock-levels/route.ts` · `stock-movements/route.ts` | `inventory.product.read` · `inventory.stock.adjust` |

### Baseline gate log (Slice 1 — 2026-06-26; gates updated 2026-06-27 per ADR-0020)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/database test:run` | 0 | A |
| `pnpm --filter @afenda/kernel test:run` | 0 | A (scaffold policy) |
| `pnpm --filter @afenda/database typecheck` | 0 | A |
| `pnpm check:business-master-data-scaffold` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

## §Remaining gaps

| Gap ID | Description | Lane | Owner | Target |
| --- | --- | --- | --- | --- |
| `inventory-erp-ui` | ERP admin UI for product/warehouse/stock | amber | apps/erp | Slice 5+ |
| `inventory-peer-review` | DoD #14 Architecture Authority PR | — | Human | Before `[Complete]` |
| `inventory-remote-migration` | Apply migrations in target Supabase env | — | Ops | Before production CRUD |

## Slices

### Slice 1 — Master-data foundation (contracts + schema + RLS)

**Status:** Delivered (2026-06-26)  
**Prerequisite:** ARCH-MD-001 Slice 3 ADR + registry promotion  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** A→A

### Slice 2 — CRUD services + internal v1 API

**Status:** Delivered (2026-06-26)  
**Prerequisite:** Slice 1 Delivered ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** A→A

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/database test:run` | 0 | A |
| `pnpm --filter @afenda/permissions test:run` | 0 | A |
| `pnpm --filter erp typecheck` | 0 | A |
| `pnpm --filter erp test:run` (API contract subset) | 0 | A |
| `pnpm export:api-route-catalog` | 0 | A |
| `pnpm export:openapi` | 0 | A |
| Natural-key duplicate SKU/code | API `409 conflict` (not `500`) | A |

### Slice 3 — ADR-0020 physical model evidence sync

**Status:** Complete (Evidence-sync 2026-06-27)  
**Prerequisite:** Slice 2 Delivered ✓ · ADR-0020 Accepted ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A  
**Handoff:** [`slice-03-adr-0020-evidence-sync.md`](slices/fdr-r02-inventory-master-data/slice-03-adr-0020-evidence-sync.md)

### Slice 4 — Stock runtime + internal v1 API

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 3 Delivered ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** A→A  
**Handoff:** [`slice-04-stock-runtime-api.md`](slices/fdr-r02-inventory-master-data/slice-04-stock-runtime-api.md)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/database test:run` | 0 | A |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm check:api-contracts` | 0 | A |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm quality:migrations` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

## §Impact analysis

| Consumer | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | `@afenda/database` stock service exports + internal v1 routes | No — additive `internal-stable` routes; new error classes additive | A→A |
| `@afenda/permissions` | `inventory.stock_adjust` (existing seed) | No | A→A |
| Future domain packages | Stock reads via internal API only — no `@afenda/inventory` package | N/A | — |

**Backward compatibility:** Stock routes were registered in WIP before hardening; paths and methods unchanged. `StockInsufficientQuantityError` is additive — mapped to API `409 conflict`.

## §Enterprise benchmark qualification

**Partially Implemented — enterprise 9.5 candidate at 29/30 audit-adjusted ceiling.** Slices 1–4 delivered (master data CRUD + stock runtime + ADR-0020 evidence sync). DoD #14 peer review remains open; ERP admin UI deferred Slice 5+.

## Verdict

**Partially Implemented** — product + warehouse master data and stock movement/QOH runtime delivered (`@afenda/database` + `apps/erp`). ADR-0020 physical model documented. Not **Complete — enterprise 9.5 accepted** until DoD #14 peer review, remote migration apply, and waiver reconfirmation at PR merge.
