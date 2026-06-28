# ADR-0023 — Tenant Human Reference Numbering

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

ERP operators work with human-meaningful reference numbers: `EMP-000123`, `CUST-000456`, `FA-2026-00001`, `INV-2026-000001`, `LETTUCE-ROMAINE-001`.

These are **not** Kernel canonical enterprise IDs (`emp_01JZ…`). They are tenant-configured administrative labels for search, print, and day-to-day operations.

Without an explicit ADR, teams may conflate human numbers with system identity — using them as primary keys, foreign keys, or RLS boundaries.

This ADR defines the third layer of the identity stack alongside [ADR-0021](./ADR-0021-canonical-enterprise-identity.md) (Kernel canonical ID) and [ADR-0022](./ADR-0022-postgres-split-id-persistence-model.md) (PostgreSQL uuid PK).

---

## Decision

System Admin owns tenant configuration surfaces for human reference policies. The owning domain module owns allocation, validation, and lifecycle semantics. Kernel may define governance classification shapes only; Kernel must not generate or allocate human references.

### Three-way distinction

| Identifier | Example | Owner | May be PK/FK/RLS? |
|------------|---------|-------|-------------------|
| Internal PK | `018f9f8c-…` (uuid) | `@afenda/database` | PK, FK, RLS — yes |
| Canonical enterprise ID | `emp_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD` | `@afenda/kernel` | Wire + `enterprise_id` column — not PK/FK |
| Tenant human reference | `EMP-000123` | Domain / System Admin | **Never** PK, FK, or RLS boundary |

### Governed human reference columns

| Scope | Column | Example format | Uniqueness |
|-------|--------|----------------|------------|
| Employee | `employee_no` | `EMP-000123` | `unique (tenant_id, employee_no)` |
| Customer | `customer_no` | `CUST-000456` | `unique (tenant_id, customer_no)` |
| Supplier | `supplier_no` | `SUP-000789` | `unique (tenant_id, supplier_no)` |
| Product | `sku` | `LETTUCE-ROMAINE-001` | `unique (tenant_id, sku)` |
| Asset | `asset_no` | `FA-2026-00001` | `unique (tenant_id, asset_no)` |
| Document | `document_type`, `document_no` | `INV-2026-000001` | `unique (tenant_id, document_type, document_no)` |
| Warehouse | `warehouse_code` | `WH-KL-01` | `unique (tenant_id, warehouse_code)` |

Formats may be tenant-configurable within domain policy bounds. Uniqueness is always **tenant-scoped** — never global on the human number alone.

Tenant-scoped uniqueness is the platform default. A domain FDR may narrow uniqueness to company, organization, warehouse, or document-type scope only when explicitly approved and documented. Human reference uniqueness must always include tenant scope directly or indirectly.

### Kernel boundary

Kernel **does not**:

- Generate tenant human reference numbers
- Export `createEmployeeNo()` or equivalent
- Include human numbers in cross-package wire contracts
- Parse human numbers through the enterprise ID parser

Kernel **may** define classification types for governance scripts (`TenantHumanReferenceScope`, policy shapes) in `packages/kernel/src/identity/tenant-human-reference/` — Slice B.

### Sequence allocation (domain ownership)

Tenant-scoped sequences use `tenant_number_sequences` with `FOR UPDATE` in short transactions. Implementation belongs to domain FDRs (HRM, CRM, Inventory) — not Kernel.

Sequence allocation must be atomic, tenant-scoped, and idempotency-aware at the command boundary. Allocation should occur in the same transaction as record creation unless an approved reservation model is introduced by a future ADR/FDR.

Human reference sequences are monotonic within tenant/scope but not guaranteed gapless unless a domain-specific statutory requirement explicitly requires gapless numbering.

### PostgreSQL rules

```sql
employee_no text not null,

constraint employees_tenant_employee_no_unique
  unique (tenant_id, employee_no)
```

- Human reference columns are `text` — no Kernel CHECK regex.
- Foreign keys between business entities use uuid PK columns only.
- Imports/exports may display human numbers; system integration must resolve to canonical `enterprise_id` or uuid PK at the boundary.

### Prohibited

- Human number as primary key
- FK referencing human number columns
- RLS policy predicated on human number pattern matching
- Replacing Kernel `EmployeeId` with `employee_no` in cross-package contracts
- Global `unique (employee_no)` without `tenant_id`

---

## Consequences

### Positive

- Clear separation: immutable system identity vs tenant admin labels
- Tenants can customize numbering schemes without Kernel registry changes
- uuid PK/FK integrity preserved

### Negative / trade-offs

- Every user-facing search must resolve human number → uuid or `enterprise_id`
- Duplicate human numbers across tenants are allowed by design
- Domain modules must implement sequence policy consistently

---

## Acceptance Gate

Documentation (Slice A):

- ADR recorded and cross-linked from PAS-001 §4.1.13
- Architecture doc: [`docs/architecture/identity/tenant-human-reference-model.md`](../architecture/identity/tenant-human-reference-model.md)

Runtime (Slice F — domain FDRs):

- Entity tables include tenant-scoped human columns + composite unique constraints
- `pnpm check:tenant-human-reference-uniqueness` exit 0
- `pnpm check:no-human-reference-fk` exit 0 (when governance script lands)
- `pnpm check:no-human-reference-rls` exit 0 (when governance script lands)
- `pnpm check:no-kernel-human-number-generation` exit 0 (when governance script lands)
- No Kernel exports for human number generation

Minimum runtime proof:

1. `employee_no` unique by `tenant_id`
2. `customer_no` unique by `tenant_id`
3. `document_no` unique by `tenant_id` + `document_type`
4. No FK references human number columns
5. No RLS policy uses human number columns
6. Kernel exports no `create*No` / `next*No` functions

---

## References

- [ADR-0021 — Canonical Enterprise Identity](./ADR-0021-canonical-enterprise-identity.md)
- [ADR-0022 — PostgreSQL Split-ID Persistence Model](./ADR-0022-postgres-split-id-persistence-model.md)
- [PAS-001 §4.1.13](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)
- [tenant-human-reference-model.md](../architecture/identity/tenant-human-reference-model.md)
