# ADR-0020 — Master Data Authority Consolidation

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Owner** | Architecture Authority |
| **Supersedes** | ADR-0019 §Decision item 1 (PKG-R02 filesystem package activation); ADR-0015 §Decision item 1 (PKG-R01 filesystem package activation) |
| **Superseded by** | — |

---

## Context

Afenda master data governance evolved through ARCH-MD-001, TIP-008B, ADR-0015, and ADR-0019. A recurring pattern emerged: **filesystem packages created to hold contracts that kernel already owns**, with zero runtime consumers and duplicated wire-reference shapes.

Evidence as of 2026-06-27:

| Artifact | Runtime consumers | Role |
| --- | --- | --- |
| `@afenda/kernel` — `ProductWireReference`, `WarehouseWireReference`, `BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY` | Database, ERP, governance scripts | Platform reference + wire contracts |
| `@afenda/database` — `products` / `warehouses` schemas, CRUD services, RLS, conflict mapping | ERP internal v1 API | Business master data persistence |
| `apps/erp` — `/api/internal/v1/inventory/products`, `/warehouses` | Client apps | API routes + permission-gated wiring |
| `@afenda/inventory` (`packages/inventory/`) | **None** | Duplicates kernel wire refs + ceremonial lifecycle constants |
| `@afenda/accounting` (`packages/accounting/`) | **None** | Vocabulary-only; no ledger runtime |

Prior wording in ARCH-MD-001 §5.2 ("one owning domain package per entity type") and ADR-0019 Decision item 1 ("activate PKG-R02 filesystem package") encouraged **package-first** ownership. That produced ceremony without runtime value.

This ADR replaces package-first master data ownership with a **contract-first, layer-owned** model:

- **Platform Reference Data** and thin **wire reference contracts** → `@afenda/kernel`
- **Business Master Data** records, lifecycle, CRUD → business domain (physically implemented in `@afenda/database` + `apps/erp` today for Product/Warehouse)
- **Domain Configuration Data** → module-owned; not auto-promoted to kernel

Related: ADR-0014, ADR-0015, ADR-0016, ADR-0019, ARCH-MD-001, `fdr-010-master-data-authority`, `fdr-r02-inventory`.

---

## Decision

### Taxonomy (canonical vocabulary)

Afenda distinguishes three data categories. These terms replace ambiguous "master data" usage in new docs and ADRs.

#### 1. Platform Reference Data

Kernel-owned when it defines **global interpretation rules** used across all modules, tenants, companies, APIs, UI surfaces, and audit/runtime behavior.

Examples:

- Tenant / company / entity identity shape
- Wire reference contract shape (`ProductWireReference`, `WarehouseWireReference`)
- Natural-key **policy** contracts (field names, identity scopes, uniqueness rules in authority registry)
- Generic cross-platform status vocabulary when shared by every module (future; evaluate per ADR)
- Locale, timezone policy, rounding mode, decimal precision, currency code shape (future platform contracts)

#### 2. Business Master Data

Domain-owned when the record has a **business lifecycle**, operational owner, validation rules, workflow, persistence, and UI.

| Entity | Business domain owner | Current physical implementation |
| --- | --- | --- |
| Product | Inventory | `@afenda/database` + `apps/erp` |
| Warehouse | Inventory | `@afenda/database` + `apps/erp` |
| Employee | HRM | Not yet implemented |
| Customer | CRM | Not yet implemented |
| Supplier | Procurement | Not yet implemented |
| Chart of Accounts | Accounting | Not yet implemented (contracts-only phase) |

Kernel may expose a **thin cross-domain wire reference** so other modules can point at a business record safely. Kernel does **not** own the business record, lifecycle, CRUD, schema, or UI.

Example:

```text
EmployeeRecord      → HRM owns (future: database + ERP)
EmployeeWireRef     → Kernel may own (cross-domain pointer shape)
EmployeeSalaryInfo  → HRM / Payroll owns
```

#### 3. Domain Configuration Data

Module-owned settings and enumerations that configure domain behavior but are not shared platform records.

Examples: HRM leave types, inventory lot-control policies, procurement payment terms, CRM customer segments, accounting fiscal-period settings.

**Promotion rule:** A module-specific concept enters kernel only when **two or more domains** need a stable wire reference to it. Until then it stays in `@afenda/database` or `apps/erp` feature composition.

---

### Domain owner versus physical implementation owner

| Concept | Domain owner (business) | Physical owner (today) |
| --- | --- | --- |
| Product master data | Inventory Authority | `@afenda/database` (schema/CRUD/RLS) + `apps/erp` (API) |
| Warehouse master data | Inventory Authority | `@afenda/database` + `apps/erp` |
| Product wire reference | Platform (cross-domain pointer) | `@afenda/kernel` |
| Natural-key policy (SKU scope, field names) | Platform registry | `@afenda/kernel` (`BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY`) |
| Natural-key enforcement (unique indexes, conflict errors) | Inventory domain | `@afenda/database` services |
| Domain lifecycle status (`draft` / `active` / `inactive` on products) | Inventory domain | `@afenda/database` (`MASTER_DATA_RECORD_STATUSES` near schema) |

Domain ownership answers **who decides business rules**. Physical ownership answers **where code lives today**. They are not always the same package — and that is acceptable when layers stay clean.

---

### Classification test

```text
Does it have a business owner, lifecycle, workflow, validation, CRUD, or UI?
  YES → Business Master Data (domain-owned; database + ERP implement)
  NO  → Does it affect every module or define shared interpretation across Afenda?
          YES → Platform Reference Data (@afenda/kernel)
          NO  → Domain Configuration Data (module-owned; do not auto-promote)
```

---

### Twelve numbered decisions

1. **Taxonomy is canonical.** Platform Reference Data, Business Master Data, and Domain Configuration Data are the official Afenda terms. Do not call Employee, Product, Customer, or Supplier "kernel master data." Call them **business-module master data with kernel wire reference contracts**.

2. **Kernel owns Platform Reference Data and thin wire reference contracts only.** `ProductWireReference`, `WarehouseWireReference`, `BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY`, identity scope rules, and natural-key **policy** contracts remain in `@afenda/kernel`. Kernel does **not** own business records, domain lifecycle enums tied to one module's schema, CRUD, Drizzle tables, HTTP routes, or UI.

3. **Business Master Data belongs to its business domain.** Product and Warehouse are Inventory-domain records. Employee is HRM. Customer is CRM. Supplier is Procurement. The domain controls lifecycle, validation, and operational semantics even when persistence is implemented in `@afenda/database`.

4. **`@afenda/database` owns persistence for implemented business master data.** Schemas, RLS, CRUD services (`insertProduct`, `updateWarehouse`, etc.), natural-key **enforcement** (unique indexes, `ProductSkuConflictError`, `WarehouseCodeConflictError`), and audit module integration (`module: "inventory"`) — all database authority. Generic status vocabulary may live near schema; domain-specific lifecycle status belongs with the owning domain's database module, not in a ceremonial package.

5. **`apps/erp` owns HTTP wiring and app composition.** Internal v1 API routes (`/api/internal/v1/inventory/products`, `/warehouses`), permission-gated handlers, OpenAPI contracts, and future UI composition folders (`apps/erp/src/features/inventory/` when needed) — application authority. ERP does not redefine kernel wire contracts or duplicate database CRUD.

6. **No ceremonial packages.** A new npm package may be introduced only when it owns **reusable runtime behavior** consumed by more than one app or package. Duplicating kernel wire references in a separate package is prohibited. `@afenda/master-data` hub remains prohibited.

7. **`packages/inventory` is a retirement candidate.** The Inventory **domain** does not disappear. The **package** retires because it duplicates kernel wire contracts and has **zero runtime consumers**. Unique content (`MasterDataRecordStatus` duplicate, lifecycle phase constants) consolidates into `@afenda/database` (near schema) or is deleted. Retirement is a separate implementation slice after this ADR.

8. **`packages/accounting` is a consolidation candidate.** Cross-domain accounting vocabulary that is genuinely platform-wide may move to `packages/kernel/src/contracts/accounting-domain/` in a future slice. Purely accounting-runtime vocabulary stays deferred until TIP-015+ ADR. The mandatory separate filesystem package for contracts-only activation is superseded.

9. **ADR-0019 partial supersession.** **Superseded:** Decision item 1 (activate `@afenda/inventory` filesystem package at `packages/inventory/`). **Remains valid:** Drizzle schemas for `products` and `warehouses`, tenant RLS, natural-key uniqueness at DB layer, registry promotion evidence, contract-test intent (relocated to kernel/database), stock-runtime prohibitions until separate ADR/FDR slice.

10. **ADR-0015 partial supersession.** **Superseded:** Decision item 1 (activate `@afenda/accounting` filesystem package at `packages/accounting/`). **Remains valid:** Contracts-only phase prohibitions on ledger/posting runtime, permission vocabulary alignment, governance prohibition tests, bridge-rule intent (relocated to kernel accounting-domain folder when implemented).

11. **`packages/crm`, `packages/hrm`, `packages/procurement` remain blocked.** `BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS` and scaffold guards stay enforced. Future ADRs may grant **real reusable runtime ownership** — not filesystem packages created solely to hold wire contracts kernel already provides.

12. **Kernel internal folder shape is by contract authority category, not ERP module.** Target layout (implementation slice — not this ADR):

    ```text
    packages/kernel/src/contracts/
      platform/                  (exists)
      business-master-data/      (exists — wire refs, authority registry; rename optional)
      accounting-domain/         (future — cross-domain accounting vocabulary only)
    ```

    No `features/inventory`, `features/crm`, or module-shaped subfolders inside kernel.

---

## Consequences

### Positive

- Removes 80% of future confusion between "kernel master data" and "business module master data."
- Retires zero-consumer ceremony packages without losing Inventory domain ownership.
- Preserves all valid DB/RLS/CRUD/API work from fdr-r02 Slice 1–2.
- Clean Core: one wire contract source (kernel), one persistence source (database), one HTTP source (ERP).

### Negative / trade-offs

- ARCH-MD-001 §5.2 "one owning domain package per entity" requires amendment in a follow-up ARCH slice — not in this docs-only ADR.
- ~~Registry TypeScript files still reference `@afenda/inventory` until `foundation-registry-owner` implementation slice.~~ **Closed (2026-06-27):** ADR-0020 Migration Slice B — `PKGR02_INVENTORY.packageName` is `@afenda/database` in `foundation-disposition.registry.ts`; FDR/index views synced.
- `packages/inventory` and `packages/accounting` remain on disk until retirement slice — agents must not treat them as canonical authority.

---

## Migration plan (implementation slices — not this ADR)

| Phase | Scope | Owner |
| --- | --- | --- |
| **Slice A (this ADR)** | Accept ADR-0020; update ADR-0019/0015 headers | Architecture Authority |
| **Slice B** | Retire `packages/inventory`; move `MasterDataRecordStatus` canonical home to `@afenda/database`; update kernel authority registry `reservedPackageId` for product/warehouse to reflect database persistence owner | `foundation-registry-owner` + implementer |
| **Slice C** | Consolidate or retire `packages/accounting`; cross-domain vocab → `kernel/contracts/accounting-domain/` | Architecture + Accounting Authority |
| **Slice D** | Amend ARCH-MD-001 §5.2 package-first rule; sync FDR evidence rows | documentation-drift |
| **Slice E** | Optional kernel folder rename `business-master-data/` → clearer authority-category names | Kernel authority |

No code moves in Slice A.

---

## Rollback plan

| Risk | Rollback |
| --- | --- |
| ADR-0020 accepted prematurely | Mark ADR-0020 **Deprecated**; restore ADR-0019/0015 header `Superseded by: —`; no code rollback required |
| Slice B breaks gates after inventory deletion | Re-add `packages/inventory` from git history; restore scaffold policy entry removal — **no schema or API rollback** |
| Registry mutation causes drift | `foundation-registry-owner` reverts fingerprint; disposition registry restored from prior commit |

Database schemas, RLS policies, ERP inventory API routes, and conflict-mapping services are **not rolled back** by this ADR — they remain valid regardless.

---

## Acceptance Gate

ADR-0020 Slice A (docs-only) complete when all pass:

```bash
pnpm check:documentation-drift
pnpm quality:boundaries
pnpm check:foundation-disposition
```

Implementation Slice B additional gates (future):

```bash
pnpm --filter @afenda/kernel test:run
pnpm --filter @afenda/database test:run
pnpm check:business-master-data-scaffold
pnpm quality:architecture
```

---

## References

- ADR-0014 — Foundation Disposition Registry
- ADR-0015 — Accounting Domain Contracts-Only Activation (partially superseded — package activation clause)
- ADR-0016 — FDR Delivery Authority
- ADR-0019 — Inventory Domain Master Data Activation (partially superseded — package activation clause)
- ARCH-MD-001 — Master Data Enterprise Architecture (§5.2 amendment deferred)
- `fdr-010-master-data-authority` — kernel authority paired FDR
- `fdr-r02-inventory` — product/warehouse runtime (database + ERP; not `@afenda/inventory` package)
