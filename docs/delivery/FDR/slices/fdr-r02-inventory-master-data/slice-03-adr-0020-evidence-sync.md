# fdr-r02-inventory-master-data · Slice 3 — ADR-0020 physical model evidence sync

| Field | Value |
| --- | --- |
| **Parent** | [`[Partially Implemented] fdr-r02-inventory-master-data.md`](../../%5BPartially%20Implemented%5D%20fdr-r02-inventory-master-data.md) |
| **Status** | Delivered (2026-06-27) |
| **Prerequisite** | Slice 2 Delivered ✓ (2026-06-26) · ADR-0020 Accepted ✓ (2026-06-27) |
| **Slice type** | Evidence-sync |
| **Risk class** | Low |
| **Clean Core impact** | A→A |
| **Runtime owner** | `packages/database` + `apps/erp` (read-only verification) |
| **Registry entry** | `PKGR02_INVENTORY` |

---

## Design (internal-guide)

Parent FDR prose, `fdr-status-index.md`, and `afenda-runtime-truth-matrix.md` still describe `@afenda/inventory` / `packages/inventory/` as the runtime owner. ADR-0020 (Accepted 2026-06-27) and live registry evidence (`PKGR02_INVENTORY.runtimeOwner = packages/database`, `authority = ADR-0020`) establish the physical model: **kernel wire refs** (`@afenda/kernel`) + **persistence/CRUD** (`@afenda/database`) + **HTTP wiring** (`apps/erp`). `packages/inventory/` does not exist on disk; scaffold policy forbids recreation.

This slice reconciles documentation only — no stock movements, no registry mutation, no source edits unless a verification gate fails.

---

## Slice discovery (audit record)

| Field | Value |
| --- | --- |
| FDR doc | `docs/delivery/FDR/[Partially Implemented] fdr-r02-inventory-master-data.md` |
| FDR ID | `fdr-r02-inventory-master-data` |
| Registry entry ID | `PKGR02_INVENTORY` |
| Slice number | 3 |
| Previous slice status | Delivered (Slice 2 — 2026-06-26) |
| Slice type | Evidence-sync |
| Risk class | Low |
| Clean Core impact | A→A |
| Runtime owner | `packages/database` · `apps/erp` |
| Owning package | `@afenda/database` (persistence) · `@afenda/erp` (API) |
| Deliverables rows covered | §Runtime evidence accuracy; §Package ownership; §Registry link snapshot; §Remaining gaps re-target; slice index |
| Remaining gaps closed | `inventory-adr0020-doc-drift` (add to §Remaining gaps if absent, then close on delivery) |
| Enterprise gates touched | G0 documentation drift; G5 namespace governance (`check:foundation-disposition`); scaffold guard (`check:business-master-data-scaffold`); G1 contract stability (inventory API routes unchanged) |

---

## Handoff block

```
Handoff from: docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-03-adr-0020-evidence-sync.md

1. Objective    — Reconcile fdr-r02 FDR, fdr-status-index, and afenda-runtime-truth-matrix with ADR-0020 physical implementation model (@afenda/database persistence + apps/erp API + @afenda/kernel wire refs); retire stale @afenda/inventory / packages/inventory prose; re-target inventory-stock-runtime to Slice 4+; close inventory-adr0020-doc-drift; do not implement stock movements or edit foundation-disposition.registry.ts.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-03-adr-0020-evidence-sync.md
   docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-index.md
   docs/delivery/FDR/[Partially Implemented] fdr-r02-inventory-master-data.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — foundation-disposition.registry.ts edits (delegate packageName drift to foundation-registry-owner Slice B per ADR-0020); packages/** source edits; apps/** source edits unless a verification gate fails; do-not-recreate-packages-inventory; do-not-create-central-master-data-hub; do-not-implement-stock-movements-without-fdr-slice; do-not-import-inventory-from-kernel; FDR filename promotion to [Complete] (blocked on inventory-peer-review / DoD #14)
5. Authority    — ADR-0020 · ADR-0019 (partial — package activation superseded) · ADR-0014 · ADR-0016 · PKGR02_INVENTORY
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm check:business-master-data-scaffold
   pnpm quality:boundaries
   pnpm --filter @afenda/database test:run
   pnpm --filter @afenda/kernel test:run
7. Closes       — inventory-adr0020-doc-drift; §Runtime evidence rows (replace packages/inventory paths with database/kernel/erp paths); inventory-stock-runtime Target column re-target to fdr-r02 Slice 4+ (gap stays open)
8. Evidence     —
   docs/adr/ADR-0020-master-data-authority-consolidation.md
   packages/database/src/schema/product.schema.ts
   packages/database/src/schema/warehouse.schema.ts
   packages/database/src/product/product.service.ts
   packages/database/src/warehouse/warehouse.service.ts
   apps/erp/src/app/api/internal/v1/inventory/products/route.ts
   apps/erp/src/app/api/internal/v1/inventory/warehouses/route.ts
   packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts
   packages/kernel/src/contracts/business-master-data/business-master-data-scaffold.policy.ts
   packages/kernel/src/contracts/business-master-data/business-master-data-shared-package.policy.ts
   packages/kernel/src/__tests__/business-master-data-scaffold.policy.test.ts
   packages/kernel/src/__tests__/business-master-data-shared-package.policy.test.ts
   docs/delivery/FDR/slices/fdr-r02-inventory-master-data/slice-03-adr-0020-evidence-sync.md
9. Attestation  — Documentation (FDR + index + matrix sync); Contract (kernel authority registry reservedPackageId @afenda/database verified); Maintainability (stale package references removed from delivery authority)
```

---

## FDR doc edits required (`fdr-slice-implementer`)

Apply these edits to `docs/delivery/FDR/[Partially Implemented] fdr-r02-inventory-master-data.md`:

1. **Header table — Package row:** Change `@afenda/inventory` (PKG-R02) to `@afenda/database` + `apps/erp` (physical) · Inventory domain (PKG-R02). Add **Authority** row cite: ADR-0020.
2. **§Registry link snapshot:** Replace stale `runtimeOwner: packages/inventory` and `@afenda/inventory` gates with note: *Read-only snapshot may lag registry TS — live `PKGR02_INVENTORY` authority is ADR-0020; `runtimeOwner` is `packages/database`; `packageName` still `@afenda/inventory` until registry-sync slice (known debt).*
3. **§Package ownership table:** Rewrite per ADR-0020 §Domain owner versus physical implementation owner:

   | Package | Role | Path |
   | --- | --- | --- |
   | `@afenda/kernel` | Wire refs + natural-key policy registry | `packages/kernel/src/contracts/business-master-data/` |
   | `@afenda/database` | Schemas, RLS, CRUD, conflict mapping | `product.schema.ts` · `warehouse.schema.ts` · `product/` · `warehouse/` services |
   | `apps/erp` | Internal v1 API + future UI composition | `apps/erp/src/app/api/internal/v1/inventory/` |
   | ~~`@afenda/inventory`~~ | **Retired** — ADR-0020; `packages/inventory/` forbidden | — |

4. **Purpose:** Add ADR-0020 to authority list; state domain ownership (Inventory Authority) is separate from physical implementation (`@afenda/database` + `apps/erp`).
5. **Scope Slice 1 note:** Add historical footnote: Slice 1 originally scaffolded `packages/inventory/`; ADR-0020 retires that path — canonical evidence is kernel wire bridge + database schema (Slice 1 deliverables preserved, paths updated).
6. **§Runtime evidence:** Remove rows pointing to `packages/inventory/src/contracts/` and `packages/inventory/src/bridge/`. Replace with:
   - Kernel wire refs: `packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts` (`ProductWireReference`, `WarehouseWireReference`)
   - Scaffold policy: `packages/kernel/src/contracts/business-master-data/business-master-data-scaffold.policy.ts` (`packages/inventory` in `BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS`)
   - Persistence ownership: `business-master-data-shared-package.policy.ts` (`reservedPackageId: "@afenda/database"` for product + warehouse)
7. **Baseline gate log (Slice 1):** Replace `pnpm --filter @afenda/inventory typecheck` / `test:run` with `pnpm --filter @afenda/database test:run` and `pnpm --filter @afenda/kernel test:run` (scaffold policy). Record 2026-06-27 verification exit codes.
8. **§Remaining gaps:** Add row `inventory-adr0020-doc-drift` (if authoring before close): *FDR/index/matrix cite retired @afenda/inventory model* — close on Slice 3 delivery. Change `inventory-stock-runtime` Target from `fdr-r02 Slice 3+` to **`fdr-r02 Slice 4+`**. Add row `inventory-registry-packageName-drift`: *registry `packageName` still `@afenda/inventory`* — Owner: `foundation-registry-owner` · Target: ADR-0020 Slice B.
9. **§Slices:** Add `### Slice 3 — ADR-0020 physical model evidence sync` with Status `Complete (Evidence-sync YYYY-MM-DD)` after delivery; link this handoff file.
10. **§Enterprise benchmark qualification / §Verdict:** Replace "stock runtime deferred to Slice 3+" with **Slice 4+**; note Slice 3 ADR-0020 evidence sync.
11. **Do NOT:** Rename FDR to `[Complete]`; mark DoD #14 `[x]`; edit `foundation-disposition.registry.ts`.

---

## `fdr-status-index.md` edits required

1. **§FDR register row 34:** Update notes from `Slice 1 ✓` to `Slices 1–2 ✓ · Slice 3 ADR-0020 evidence-sync pending/delivered`. Add footnote: physical runtime `@afenda/database` + `apps/erp` per ADR-0020; registry `packageName` drift noted.
2. **§PKG-R02 section header:** Change `@afenda/inventory` to `@afenda/database` + `apps/erp` (PKG-R02 Inventory domain). Update status notes: Slices 1–2 ✓ · ADR-0020 aligned (post Slice 3).

---

## `afenda-runtime-truth-matrix.md` edits required

1. **Business master data authority row (line ~36):** Change blocker "Domain PKG-R02–R05 runtime not started" to **"PKG-R02 product/warehouse CRUD + internal v1 API implemented (fdr-r02 Slices 1–2); stock runtime deferred Slice 4+"**. Add ADR-0020 + fdr-r02 Slice 3 evidence-sync reference.
2. **Add runtime row** (after business master data authority or in domain section):

   | **Inventory master data (Product + Warehouse)** | `packages/database/src/product/` · `warehouse/` · `apps/erp/src/app/api/internal/v1/inventory/` | `fdr-r02-inventory-master-data` **Partially Implemented** · Slices 1–2 ✓ · Slice 3 ADR-0020 evidence-sync | **implemented** (master data CRUD + API) | ADR-0020 physical model; kernel wire refs; 6 governed API contracts; natural-key 409 conflicts | `inventory-stock-runtime` · `inventory-erp-ui` · `inventory-peer-review` · `inventory-remote-migration` | Maintain |

3. **§Package filesystem inventory:** Confirm `@afenda/inventory` is **not listed** (packages/inventory absent on disk). Do not add it.

---

## DoD rows this slice closes

| # | Criterion | Gate | Notes |
| --- | --- | --- | --- |
| — | Runtime evidence paths match live codebase | file exists + gates exit 0 | Reconcile §Runtime evidence table |
| — | Documentation matches runtime (SOLMAN) | `pnpm check:documentation-drift` | Primary slice gate |
| — | Scaffold guards enforce ADR-0020 retirement | `pnpm check:business-master-data-scaffold` | `packages/inventory` forbidden |
| — | Registry disposition check passes | `pnpm check:foundation-disposition` | Read-only; no registry edit |

**Explicitly not closed by this slice:** DoD #14 (`inventory-peer-review`); `inventory-stock-runtime`; `inventory-erp-ui`; `inventory-remote-migration`; `inventory-registry-packageName-drift`.

---

## Known debt

- `inventory-registry-packageName-drift` — `foundation-disposition.registry.ts` still has `packageName: "@afenda/inventory"` while `runtimeOwner: packages/database`. ADR-0020 Migration Slice B → `foundation-registry-owner`.
- `inventory-stock-runtime` — deferred to **Slice 4+** (Implementation); prohibited until dedicated FDR slice handoff.
- `inventory-peer-review` — DoD #14 Architecture Authority PR remains operator before `[Complete]`.
- FDR lacks formal §Deliverables table — Scope + §Runtime evidence serve equivalent role; consider fdr-author amendment (non-blocking for Slice 3).

---

## Slice 3 gate log (2026-06-27)

| Gate | Exit | Notes |
| --- | ---: | --- |
| `pnpm check:documentation-drift` | 1 | **Pre-existing** — `dependency-snapshot-fingerprint-drift` (`ARCH-BASELINE-2026-06-27-v2` stale in 5 architecture docs); not introduced by Slice 3 (no architecture registry files edited) |
| `pnpm check:foundation-disposition` | 0 | PASS |
| `pnpm check:business-master-data-scaffold` | 0 | PASS — `packages/inventory` forbidden |
| `pnpm quality:boundaries` | 0 | PASS (22 workspaces) |
| `pnpm --filter @afenda/database test:run` | 1 | **Pre-existing WIP** — 5 failures from in-flight stock schema (`stockLevels`/`stockMovements`, orphan `20260626183200_inventory_stock_rls.sql`, RLS probe count drift); Slice 4+ scope — not introduced by docs-only Slice 3 |
| `pnpm --filter @afenda/kernel test:run` | 0 | PASS (94 tests) — scaffold + shared-package policy verified |

**Gap closed:** `inventory-adr0020-doc-drift`  
**Gaps re-targeted:** `inventory-stock-runtime` → Slice 4+  
**Known debt retained:** `inventory-registry-packageName-drift` · `inventory-peer-review` (DoD #14)
