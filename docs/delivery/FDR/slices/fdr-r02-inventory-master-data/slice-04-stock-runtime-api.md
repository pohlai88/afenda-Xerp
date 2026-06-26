# fdr-r02-inventory-master-data · Slice 4 — Stock runtime + internal v1 API

| Field | Value |
| --- | --- |
| **Parent** | [`[Partially Implemented] fdr-r02-inventory-master-data.md`](../../%5BPartially%20Implemented%5D%20fdr-r02-inventory-master-data.md) |
| **Status** | Delivered (2026-06-27) |
| **Prerequisite** | Slice 3 Delivered ✓ (2026-06-27) · ADR-0020 Accepted ✓ |
| **Slice type** | Implementation |
| **Risk class** | Medium |
| **Clean Core impact** | A→A |
| **Runtime owner** | `packages/database` + `apps/erp` |
| **Registry entry** | `PKGR02_INVENTORY` |

---

## Design (internal-guide)

**WIP on disk — harden + evidence-sync, not greenfield.** Pre-slice WIP added `stock_levels` / `stock_movements` schema, RLS migration, `stock.service.ts` (`listStockLevelsByTenant`, `recordStockMovement`), ERP routes (`GET /stock-levels`, `POST /stock-movements`), governed contracts (8 inventory contracts total), OpenAPI + route-catalog snapshots, and `inventory.stock.adjust` permission. Slice 3 gate log recorded **5 pre-existing `@afenda/database` test failures** from this WIP (orphan migration journal alignment, RLS probe drift, `index.test` stock table exports).

This slice delivers **authorized** stock movement runtime per registry prohibition waiver (`do-not-implement-stock-movements-without-fdr-slice` — this slice is the authorization). Implementer must:

1. **Fix failing database gates** — migration governance journal parity for `20260626183200_inventory_stock_rls`, RLS coverage probe counts, `index.test` platform table registry.
2. **Harden `stock.service.ts`** — non-negative QOH guard on issue movements (and any delta that would drive QOH below zero); introduce `StockInsufficientQuantityError` (or equivalent) exported from `@afenda/database`; keep transaction + audit semantics.
3. **Fix unsound ERP typing** — `createInventoryStockMovement` catch path must not imply `undefined` return (remove redundant try/catch or ensure `mapInventoryServiceError` exhausts via `never`; prefer letting service errors bubble to handler).
4. **Add `stock.service.test.ts`** — happy paths (receipt, list levels) + error paths (product/warehouse not found, scope mismatch, insufficient quantity); mock DB per `member-invitation.service.test.ts` pattern.
5. **API boundary** — serializable Zod DTOs remain authoritative in `inventory.api-contract.ts`; add validation refinements if needed (decimal string shape, movement-type sign rules); map new stock errors in `inventory-api-errors.server.ts` + tests.
6. **Permission review** — `GET /stock-levels` currently uses `inventory.product.read`; document decision in contract description (retain product.read — no `inventory.stock.read` key exists) or escalate to permissions slice if new key required.
7. **Evidence-sync** — refresh parent FDR §Runtime evidence, §Remaining gaps (`inventory-stock-runtime` close), slice index, `fdr-status-index`, `afenda-runtime-truth-matrix`; add §Impact analysis to parent FDR (missing today — additive exports only).
8. **Do not edit** `foundation-disposition.registry.ts` (delegate `packageName` drift to `foundation-registry-owner`).

**One Integration slice** — dual physical runtime (`@afenda/database` persistence + `apps/erp` HTTP) per FDR Scope Slices 1–2 precedent and ADR-0020.

---

## Slice discovery (audit record)

| Field | Value |
| --- | --- |
| FDR doc | `docs/delivery/FDR/[Partially Implemented] fdr-r02-inventory-master-data.md` |
| FDR ID | `fdr-r02-inventory-master-data` |
| Registry entry ID | `PKGR02_INVENTORY` |
| Slice number | 4 |
| Previous slice status | Delivered (Slice 3 — Evidence-sync 2026-06-27) |
| Slice type | Implementation |
| Risk class | Medium |
| Clean Core impact | A→A |
| Runtime owner | `packages/database` · `apps/erp` |
| Owning package | `@afenda/database` (persistence/services) · `@afenda/erp` (internal v1 API) |
| Deliverables rows covered | Scope Out-of-scope reversal (stock movements + QOH); §Runtime evidence stock rows; internal v1 REST stock routes; OpenAPI + route catalog; RLS stock policy groups; permission `inventory.stock.adjust` |
| Remaining gaps closed | `inventory-stock-runtime` |
| Enterprise gates touched | G1 contract stability (`check:api-contracts`); G2 test coverage (stock.service + API error mapping); G5 namespace (`quality:boundaries`, `check:business-master-data-scaffold`); tenant RLS (`check:database-tenant-rls-coverage`); migrations (`quality:migrations`); documentation drift; exports (`quality:exports`) |

> **§Deliverables table note:** Parent FDR uses Scope + §Runtime evidence as deliverables equivalent (Slice 3 precedent); no formal §Deliverables table — not a hard-stop blocker.

---

## Handoff block

```
Handoff from: docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-04-stock-runtime-api.md

1. Objective    — Harden pre-slice WIP stock runtime in @afenda/database (QOH guard, service tests, migration/RLS gate fixes) and apps/erp internal v1 stock-levels GET + stock-movements POST (typing, error mapping, contract permission review); refresh OpenAPI/route-catalog snapshots; close inventory-stock-runtime with FDR/matrix/index evidence-sync; do not edit foundation-disposition.registry.ts.
2. Allowed layer— packages/database + apps/erp (PKGR02_INVENTORY physical runtime — Integration per FDR Scope Slices 1–2)
3. Files        —
   packages/database/src/schema/stock-level.schema.ts
   packages/database/src/schema/stock-movement.schema.ts
   packages/database/src/schema/index.ts
   packages/database/src/migrations/20260626183108_amusing_liz_osborn.sql
   packages/database/src/migrations/20260626183200_inventory_stock_rls.sql
   packages/database/src/migrations/meta/_journal.json
   packages/database/src/migrations/meta/20260626183108_snapshot.json
   packages/database/src/migrations/migration-governance.contract.ts
   packages/database/src/stock/stock.service.ts
   packages/database/src/stock/stock.contract.ts
   packages/database/src/stock/stock-movement-type.contract.ts
   packages/database/src/stock/__tests__/stock.contract.test.ts
   packages/database/src/stock/__tests__/stock.service.test.ts
   packages/database/src/public-api.ts
   packages/database/src/__tests__/index.test.ts
   packages/database/src/__tests__/migration-governance.contract.test.ts
   packages/database/src/rls/tenant-rls-coverage.contract.ts
   packages/database/src/rls/tenant-rls-schema-parity.contract.ts
   packages/database/src/rls/__tests__/tenant-rls-coverage.contract.test.ts
   apps/erp/src/app/api/internal/v1/inventory/stock-levels/route.ts
   apps/erp/src/app/api/internal/v1/inventory/stock-movements/route.ts
   apps/erp/src/server/inventory/inventory-stock.server.ts
   apps/erp/src/server/inventory/inventory-api-errors.server.ts
   apps/erp/src/server/inventory/__tests__/inventory-api-errors.server.test.ts
   apps/erp/src/server/api/contracts/inventory/inventory.contract.ts
   apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts
   apps/erp/src/server/api/contracts/api-contract-registry.ts
   apps/erp/src/server/api/contracts/api-route-catalog.snapshot.json
   apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json
   apps/erp/src/server/api/__tests__/api-contract-registry.test.ts
   apps/erp/src/server/api/__tests__/openapi-document.test.ts
   docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-04-stock-runtime-api.md
   docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-index.md
   docs/delivery/FDR/[Partially Implemented] fdr-r02-inventory-master-data.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — foundation-disposition.registry.ts edits (delegate inventory-registry-packageName-drift to foundation-registry-owner); do-not-recreate-packages-inventory; do-not-create-central-master-data-hub; do-not-import-inventory-from-kernel; hand-edited migration SQL (drizzle-kit generate only per afenda-drizzle-migration); FDR filename promotion to [Complete] (blocked on inventory-peer-review DoD #14); packages/inventory/**; @afenda/accounting runtime (ADR-0010)
5. Authority    — ADR-0020 · ADR-0019 (partial) · ADR-0014 · ADR-0016 · PKGR02_INVENTORY
6. Gates        —
   pnpm --filter @afenda/database typecheck
   pnpm --filter @afenda/database test:run
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run -- inventory-api-errors openapi-document api-contract-registry
   pnpm check:api-contracts
   pnpm check:openapi-drift
   pnpm export:api-route-catalog
   pnpm export:openapi
   pnpm check:database-tenant-rls-coverage
   pnpm quality:migrations
   pnpm check:business-master-data-scaffold
   pnpm quality:boundaries
   pnpm quality:exports
   pnpm check:documentation-drift
7. Closes       — inventory-stock-runtime; §Runtime evidence rows (stock schema, service, RLS, internal API stock routes, OpenAPI); Scope stock-out-of-scope reversal (Slice 4 delivery); parent §Remaining gaps inventory-stock-runtime row; matrix inventory row blocker shrink (stock runtime implemented)
8. Evidence     —
   packages/database/src/schema/stock-level.schema.ts
   packages/database/src/schema/stock-movement.schema.ts
   packages/database/src/migrations/20260626183108_amusing_liz_osborn.sql
   packages/database/src/migrations/20260626183200_inventory_stock_rls.sql
   packages/database/src/stock/stock.service.ts
   packages/database/src/stock/__tests__/stock.service.test.ts
   packages/database/src/stock/__tests__/stock.contract.test.ts
   packages/database/src/rls/tenant-rls-coverage.contract.ts
   apps/erp/src/app/api/internal/v1/inventory/stock-levels/route.ts
   apps/erp/src/app/api/internal/v1/inventory/stock-movements/route.ts
   apps/erp/src/server/inventory/inventory-stock.server.ts
   apps/erp/src/server/inventory/inventory-api-errors.server.ts
   apps/erp/src/server/inventory/__tests__/inventory-api-errors.server.test.ts
   apps/erp/src/server/api/contracts/inventory/inventory.contract.ts
   apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts
   apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json
   apps/erp/src/server/api/contracts/api-route-catalog.snapshot.json
   docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-04-stock-runtime-api.md
9. Attestation  — Contract (8 inventory governed routes + Zod DTOs + OpenAPI/catalog snapshots); Test (stock.service happy/error paths + inventory API error mapping); Observability (audit on stock movement via insertAuditEvent inventory.stock.adjust); Security (tenant RLS on stock_levels/stock_movements + RBAC inventory.stock_adjust + non-negative QOH guard); Documentation (FDR/matrix/index evidence-sync + §Impact analysis addition)
```

---

## FDR doc edits required (`fdr-slice-implementer`)

Apply to `docs/delivery/FDR/[Partially Implemented] fdr-r02-inventory-master-data.md`:

1. **Scope:** Move stock movements / QOH from "Out of scope (Slice 4+)" to **In scope (Slice 4 — Delivered YYYY-MM-DD)** with bullet list matching §Runtime evidence stock rows.
2. **§Runtime evidence:** Add rows:
   - Stock level schema · `packages/database/src/schema/stock-level.schema.ts`
   - Stock movement schema · `packages/database/src/schema/stock-movement.schema.ts`
   - Stock migration · `20260626183108_amusing_liz_osborn.sql`
   - Stock RLS · `20260626183200_inventory_stock_rls.sql` · `TENANT_RLS_INVENTORY_STOCK_POLICIES` (2 policy groups)
   - Stock service · `packages/database/src/stock/stock.service.ts`
   - Stock service tests · `packages/database/src/stock/__tests__/stock.service.test.ts`
   - Stock internal API · `stock-levels/route.ts` · `stock-movements/route.ts`
   - Governed contracts count · **8** inventory contracts (includes stock-levels GET + stock-movements POST)
3. **§Remaining gaps:** Close `inventory-stock-runtime` (remove row or mark closed). Fix erroneous Target `Delivered 2026-06-27` on that row if still present — stock was not delivered in Slice 3.
4. **§Slices:** Add `### Slice 4 — Stock runtime + internal v1 API` with Status `Delivered (YYYY-MM-DD)` after delivery; link this handoff file.
5. **§Impact analysis (new section):**

   | Consumer | Import surface | Breaking change? | Clean Core impact |
   | --- | --- | --- | --- |
   | `apps/erp` | `@afenda/database` stock service exports + internal v1 routes | No — additive `internal-stable` routes; new error classes additive | A→A |
   | `@afenda/permissions` | `inventory.stock_adjust` (existing seed) | No | A→A |
   | Future domain packages | Stock wire reads via internal API only — no `@afenda/inventory` package | N/A | — |

   **Backward compatibility:** WIP already registered routes in `API_CONTRACTS`; this slice hardens behavior (QOH guard) without path/method changes. New `StockInsufficientQuantityError` (or chosen name) is additive export — map to API `conflict` or `validation_failed` consistently in `inventory-api-errors.server.ts`.

6. **§Enterprise benchmark qualification / §Verdict:** Note Slice 4 stock runtime delivered; ERP UI still deferred.
7. **Baseline gate log:** Add Slice 4 gate table with exit codes 0.
8. **Do NOT:** Rename to `[Complete]`; mark DoD #14 `[x]`; edit registry TS.

---

## `fdr-status-index.md` edits required

1. **§FDR register row 34:** Update notes — `Slices 1–3 ✓ · Slice 4 stock runtime ✓ (YYYY-MM-DD)`.
2. **§PKG-R02 section:** Stock runtime implemented; list 8 governed inventory API contracts.

---

## `afenda-runtime-truth-matrix.md` edits required

1. **Inventory master data row:** Update blockers — remove `inventory-stock-runtime`; note stock QOH + movement API implemented (Slice 4).
2. **Business master data authority row:** Update PKG-R02 note — stock runtime delivered (Slice 4).

---

## DoD rows this slice closes

| # | Criterion | Gate | Notes |
| --- | --- | --- | --- |
| — | Stock movement + QOH persistence with tenant RLS | `pnpm check:database-tenant-rls-coverage` + migration governance tests | 2 stock tables + 2 RLS policies |
| — | Stock service unit tests (happy + error) | `pnpm --filter @afenda/database test:run` | `stock.service.test.ts` required |
| — | Internal v1 stock API governed + OpenAPI | `pnpm check:api-contracts` + `pnpm export:openapi` | 8 inventory contracts |
| — | Non-negative QOH on issue movements | `stock.service.test.ts` insufficient-quantity case | `StockInsufficientQuantityError` → API mapped |
| — | ERP typing sound (no silent undefined on mutation) | `pnpm --filter @afenda/erp typecheck` | `inventory-stock.server.ts` |
| — | Documentation matches runtime | `pnpm check:documentation-drift` | FDR + matrix + index |

**Explicitly not closed:** `inventory-erp-ui` · `inventory-peer-review` (DoD #14) · `inventory-remote-migration`

---

## Known debt

- `inventory-registry-packageName-drift` — **Closed 2026-06-27** — disposition `packageName` is `@afenda/database`; PKG-R02 slot retains retired `@afenda/inventory` in package-registry only.
- `inventory-peer-review` — DoD #14 Architecture Authority PR before `[Complete]`.
- `GET /stock-levels` permission uses `inventory.product.read` — no dedicated stock read key; document rationale or open follow-up permissions FDR slice.
- Slice 3 gate log: `pnpm check:documentation-drift` exit 1 pre-existing (`dependency-snapshot-fingerprint-drift`) — not introduced by Slice 4 unless architecture docs edited; record exit code in Slice 4 gate log.

---

## WIP defect checklist (implementer verification)

| Defect | Location | Required fix |
| --- | --- | --- |
| Catch path may not return | `inventory-stock.server.ts` `createInventoryStockMovement` | Remove try/catch or ensure `never` exhausts; typecheck must pass without `undefined` union on return |
| No service tests | `packages/database/src/stock/` | Add `stock.service.test.ts` |
| No non-negative QOH guard | `stock.service.ts` `recordStockMovement` | Reject issue (and any delta) that would drive QOH &lt; 0 before commit |
| Database test failures (5) | migration journal / RLS probes / `index.test` | Align governance + coverage with live migrations |
| §Remaining gaps erroneous "Delivered" on stock | parent FDR | Fix on evidence-sync |

---

## Slice 4 gate log (2026-06-27)

| Gate | Exit | Notes |
| --- | ---: | --- |
| `pnpm --filter @afenda/database typecheck` | 0 | |
| `pnpm --filter @afenda/database test:run` | 0 | 231 passed (includes `stock.service.test.ts` 6 cases) |
| `pnpm --filter @afenda/erp typecheck` | 0 | `inventory-stock.server.ts` — `.catch(mapInventoryServiceError)` exhausts via `never` |
| `pnpm --filter @afenda/erp test:run -- inventory-api-errors openapi-document api-contract-registry` | 0 | 38 passed |
| `pnpm check:api-contracts` | 0 | |
| `pnpm check:openapi-drift` | 0 | |
| `pnpm export:api-route-catalog` | 0 | |
| `pnpm export:openapi` | 0 | |
| `pnpm check:database-tenant-rls-coverage` | 0 | Static contract — `TENANT_RLS_INVENTORY_STOCK_POLICIES` (2 policies) |
| `pnpm quality:migrations` | 1 | Live RLS probe — migrations not applied to target DB (`inventory-remote-migration`) |
| `pnpm check:business-master-data-scaffold` | 0 | |
| `pnpm quality:boundaries` | 0 | |
| `pnpm quality:exports` | 1 | Pre-existing `packages/testing` export drift — out of slice §3 scope |
| `pnpm check:documentation-drift` | 0 | |

**Closes:** `inventory-stock-runtime` · stock Scope reversal · parent §Runtime evidence stock rows · matrix blocker shrink.

**Delivered artifacts:** `StockInsufficientQuantityError` → API `409 conflict` · non-negative QOH guard in `assertSufficientQuantityOnHand` · `stock.service.test.ts` (receipt, list, product/warehouse not found, scope mismatch, insufficient quantity).
