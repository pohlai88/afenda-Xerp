# Tenant Human Reference Model

| Field | Value |
|-------|-------|
| **Authority** | [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md) · [PAS-001 §4.1.13](../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md) |
| **Implementation** | Domain FDRs (HRM, CRM, Inventory) — Slice F |
| **Status** | Accepted — architecture record (Slice A) |

---

## Purpose

Defines tenant-defined human reference numbers — administrative labels distinct from Kernel canonical enterprise IDs and PostgreSQL uuid primary keys.

System Admin owns tenant configuration surfaces for human reference policies. The owning domain module owns allocation, validation, and lifecycle semantics. Kernel may classify scopes only; Kernel must not allocate or generate human references.

---

## Identity comparison

| | Internal PK | Canonical enterprise ID | Tenant human reference |
|---|-------------|-------------------------|------------------------|
| Example | `018f9f8c-…` | `emp_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD` | `EMP-000123` |
| Owner | Database | Kernel | Domain / System Admin |
| PK / FK | Yes (uuid) | No | **Never** |
| RLS boundary | Yes (uuid scope) | No | **Never** |
| Cross-package wire | Internal only | Yes | No |

---

## Governed columns

| Scope | Column | Example | Uniqueness |
|-------|--------|---------|------------|
| Employee | `employee_no` | `EMP-000123` | `(tenant_id, employee_no)` |
| Customer | `customer_no` | `CUST-000456` | `(tenant_id, customer_no)` |
| Supplier | `supplier_no` | `SUP-000789` | `(tenant_id, supplier_no)` |
| Product | `sku` | `LETTUCE-ROMAINE-001` | `(tenant_id, sku)` |
| Asset | `asset_no` | `FA-2026-00001` | `(tenant_id, asset_no)` |
| Document | `document_type`, `document_no` | `INV-2026-000001` | `(tenant_id, document_type, document_no)` |
| Warehouse | `warehouse_code` | `WH-KL-01` | `(tenant_id, warehouse_code)` |

Formats may vary by tenant policy within domain validation rules.

---

## PostgreSQL pattern

```sql
employee_no text not null,

constraint employees_tenant_employee_no_unique
  unique (tenant_id, employee_no)
```

- No Kernel CHECK regex on human columns.
- Composite unique always includes `tenant_id`.
- FKs between entities use uuid PK columns only.

Tenant-scoped uniqueness is the platform default. A domain FDR may narrow uniqueness to company, organization, warehouse, project, or document-type scope only when explicitly approved and documented. Human reference uniqueness must always include tenant scope directly or indirectly.

Target helper: `packages/database/src/ids/tenant-human-reference-column.ts` (Slice C) — text column only; no sequence allocation logic.

---

## Kernel boundary

Kernel classifies scopes and governance rules in `identity/tenant-human-reference/` (Slice B) but **does not generate** human numbers.

Prohibited in Kernel:

- `createEmployeeNo()`, `nextCustomerNo()`, `allocateDocumentNo()`, or any sequence allocation
- Human numbers in cross-package wire contracts
- Human numbers in `ID_FAMILIES` registry

---

## Sequence strategy (domain)

`tenant_number_sequences` uses tenant/scope rows with row-level locking (`FOR UPDATE`) in short transactions.

Sequence allocation must be atomic, tenant-scoped, and idempotency-aware at the command boundary. Allocation should occur in the same transaction as record creation unless a future ADR/FDR approves a reservation model.

Human reference sequences are monotonic within tenant/scope but not guaranteed gapless unless a domain-specific statutory requirement explicitly requires gapless numbering.

Owned by domain modules — not Kernel, not `@afenda/database` core identity module.

---

## Integration rules

| Surface | Rule |
|---------|------|
| Admin UI | Display human number; resolve to uuid/`enterprise_id` for actions |
| API external | Use canonical `enterprise_id` as system identity; include human references only as display/search attributes |
| Import CSV | Map human number → lookup within tenant scope → uuid PK for writes |
| Search | Tenant-scoped index on human column — not global |

External APIs must use canonical `enterprise_id` as system identity. Human references may be included as display/search attributes but must not be the primary identity key in cross-package or integration contracts.

---

## Prohibited

- Human number as primary key
- FK referencing human number
- RLS on human number pattern
- Global unique on human number without `tenant_id`
- Replacing `EmployeeId` with `employee_no` in Kernel exports
- Kernel generator or allocation functions for human references

---

## Slice F acceptance (minimum)

```bash
pnpm check:tenant-human-reference-uniqueness
pnpm check:no-human-reference-fk
pnpm check:no-human-reference-rls
pnpm check:no-kernel-human-number-generation
```

Minimum proof: human reference columns are text only; every unique constraint includes tenant scope; document references use `tenant_id + document_type + document_no`; no human reference column is PK or FK target; no RLS on human columns; Kernel exports classification only; external APIs use canonical `enterprise_id` as system identity; sequence allocation is atomic and idempotency-aware.

---

## Governance principle

> Human references are for people. Canonical enterprise IDs are for systems. UUIDs are for the database.

---

## References

- [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md)
- [postgres-split-id-model.md](./postgres-split-id-model.md)
- [canonical-enterprise-id-constitution.md](./canonical-enterprise-id-constitution.md)
