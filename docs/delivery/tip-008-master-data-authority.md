# TIP-008 — Master Data Authority

Status: **Not started**

## Purpose

Establish canonical ownership for ERP master data entities before any business domain package is created. Prevents duplicate Customer, Product, Employee, and Warehouse definitions across accounting, inventory, HRM, and CRM.

## Scope

**In scope**

- Master data authority contract map
- Canonical entity ownership (create, read, approve, audit)
- Identity rules (keys, uniqueness, tenant/company scope)
- Reserved domain package alignment (PKG-R01–R05)

**Out of scope**

- Domain implementation (TIP-013+)
- Database migrations for business tables
- UI surfaces (TIP-UI-04/05)

## Contracts (planned)

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

## Deliverables (planned)

- `packages/kernel/src/contracts/master-data/` (or dedicated `@afenda/master-data` if ADR approves)
- Cross-domain reference rules (inter-domain deps prohibited without ADR)
- Contract tests + registry update if new package approved

## Acceptance gate

ERP master data ownership is established per ADR-0001. No domain may invent parallel canonical entities.

## Verdict

Not started.
