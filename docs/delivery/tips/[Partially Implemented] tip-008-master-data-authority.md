# TIP-008 — Master Data Authority

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** (split scope) |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **ADR** | ADR-0011 — multi-level company model is foundational |

This TIP is split into two scopes. **Do not mark TIP-008 Complete until both slices pass their gates.**

---

## TIP-008A — Enterprise Hierarchy Authority

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Runtime evidence** | Entity group + ownership interest schemas, kernel contexts, ERP resolver |
| **Delivery evidence** | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) |

| Artifact | Path | Proven |
| --- | --- | --- |
| Entity groups schema | `packages/database/src/schema/entity-group.schema.ts` | Yes |
| Ownership interest schema | `packages/database/src/schema/legal-entity-ownership.schema.ts` | Yes |
| Kernel contexts | `packages/kernel/src/context/entity-group-context.contract.ts`, `ownership-interest-context.contract.ts` | Yes |
| Consolidation scope (non-accounting) | `consolidation-scope-context.contract.ts` + stub resolver | Partial |
| Consolidation arithmetic | — | **Correctly absent** (ADR-0010) |

**Remaining gap:** Consolidation scope resolution (non-accounting) + formal TIP-008A sign-off checklist.

---

## TIP-008B — Business Master Data Authority

| Field | Value |
| --- | --- |
| **Status** | **Documented Only** |
| **Runtime evidence** | None — no Customer, Product, Employee, Warehouse canonical contracts |

## Purpose (TIP-008B)

Establish canonical ownership for ERP **business** master data entities before any business domain package is created. Prevents duplicate Customer, Product, Employee, and Warehouse definitions across accounting, inventory, HRM, and CRM.

## Scope (TIP-008B)

**In scope**

- Master data authority contract map
- Canonical entity ownership (create, read, approve, audit)
- Identity rules (keys, uniqueness, tenant/company scope)
- Reserved domain package alignment (PKG-R01–R05)

**Out of scope**

- Domain implementation (TIP-013+)
- Database migrations for business tables
- UI surfaces (TIP-UI-04/05)

## Contracts (planned — TIP-008B)

| Entity | Owning domain (planned) |
| --- | --- |
| Customer | CRM Authority → `@afenda/crm` |
| Supplier | Procurement Authority → `@afenda/procurement` |
| Product | Inventory Authority → `@afenda/inventory` |
| Employee | HRM Authority → `@afenda/hrm` |
| Warehouse | Inventory Authority |
| Asset | Platform / TPM (TBD via ADR) |
| Project | PM domain (TIP-030) |
| Document | Platform document service (TBD via ADR) |

## Depends on

- TIP-007 ERP Platform Authority

## Blocks

- TIP-013 Accounting Core Contracts (master data references)
- All domain package creation (PKG-R01–R05)

## Verdict

| Slice | Verdict |
| --- | --- |
| TIP-008A Enterprise hierarchy | **Partially Implemented** |
| TIP-008B Business master data | **Documented Only** — not started |
