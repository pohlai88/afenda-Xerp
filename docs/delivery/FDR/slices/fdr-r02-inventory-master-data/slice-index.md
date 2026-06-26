# fdr-r02-inventory-master-data — Slice index

> Parent: [`[Partially Implemented] fdr-r02-inventory-master-data.md`](../../%5BPartially%20Implemented%5D%20fdr-r02-inventory-master-data.md) · Registry: `PKGR02_INVENTORY` · Physical runtime: `@afenda/database` + `apps/erp` · Authority: ADR-0020

| Slice | Title | Status | Type |
| ---: | --- | --- | --- |
| 1 | Master-data foundation (schema + RLS + kernel wire bridge) | **Delivered** (2026-06-26) | Implementation |
| 2 | CRUD services + internal v1 API | **Delivered** (2026-06-26) | Implementation |
| 3 | ADR-0020 physical model evidence sync | **Delivered** (2026-06-27) | Evidence-sync |
| 4 | Stock runtime + internal v1 API | **Delivered** (2026-06-27) | Implementation |
| 5+ | ERP inventory admin UI (planned) | Not started | Implementation |

**Slice 4 handoff:** [`slice-04-stock-runtime-api.md`](slice-04-stock-runtime-api.md)

**Verification gates (Slice 4 Implementation):** `pnpm --filter @afenda/database typecheck` · `pnpm --filter @afenda/database test:run` · `pnpm --filter @afenda/erp typecheck` · `pnpm --filter @afenda/erp test:run -- inventory-api-errors openapi-document api-contract-registry` · `pnpm check:api-contracts` · `pnpm check:openapi-drift` · `pnpm export:api-route-catalog` · `pnpm export:openapi` · `pnpm check:database-tenant-rls-coverage` · `pnpm quality:migrations` · `pnpm quality:exports` · `pnpm check:documentation-drift`

**Verification gates (Slice 3 Evidence-sync):** `pnpm check:documentation-drift` · `pnpm check:foundation-disposition` · `pnpm check:business-master-data-scaffold` · `pnpm quality:boundaries` · `pnpm --filter @afenda/database test:run` · `pnpm --filter @afenda/kernel test:run`

**Open Complete blockers:** DoD #14 peer review (`inventory-peer-review`) · remote migration apply · ERP admin UI (Slice 5+)

**Registry sync (ADR-0020 Slice B — 2026-06-27):** `PKGR02_INVENTORY.packageName` is `@afenda/database`; `inventory-registry-packageName-drift` closed by `foundation-registry-owner`.
