# ADR-0022 — PostgreSQL Split-ID Persistence Model

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda requires a persistence model that preserves PostgreSQL join performance and RLS correctness while exposing Kernel-governed canonical enterprise IDs at API and integration boundaries.

Prior platform tables used UUID v4 primary keys without a governed `enterprise_id` column. Cross-package wire contracts need stable, prefix-typed identifiers (`emp_01JZ…`) that are not suitable as relational primary keys.

Supabase/Postgres guidance (`schema-primary-keys`) recommends time-ordered UUID v7 for write-heavy primary keys and native `uuid` for foreign keys — not text `prefix_ulid` keys.

This ADR records the **database persistence layer** of the three-layer identity stack defined in [ADR-0021](./ADR-0021-canonical-enterprise-identity.md). Kernel constitution (format, registry, parser) is owned by ADR-0021; tenant human numbers are owned by [ADR-0023](./ADR-0023-tenant-human-reference-numbering.md).

---

## Decision

### Column model (every governed entity table)

| Column | Type | Role |
|--------|------|------|
| `id` | `uuid` PK, default `uuid_generate_v7()` | Internal relational identity — PK, FKs, joins |
| `enterprise_id` | `text NOT NULL` + family CHECK + unique lookup index | Kernel canonical enterprise ID |
| Human reference columns | `text` (e.g. `employee_no`) | Tenant admin numbers — see ADR-0023 |

`uuid_generate_v7()` is the preferred database default where supported by the deployed PostgreSQL/Supabase runtime. If unavailable, Architecture Authority must approve a fallback UUID v7-compatible generator before Slice C lands. The fallback must still produce native `uuid` values and must not change PK/FK column types.

### Foreign keys and lookup indexes

- All FK columns are `uuid` and reference the parent row's `id` — never `enterprise_id`.
- Example: `orders.customer_id uuid references customers(id)`.
- Tables resolved from public/API canonical IDs must provide a **unique lookup index** on `enterprise_id`.
- Tenant resolution must use `tenants.enterprise_id` only at API/session ingress, then carry the resolved `tenant_id uuid` through database operations.

### RLS

- RLS policies use `tenant_id uuid` (and other uuid scope columns).
- Resolve canonical tenant ID once at the API ingress boundary (`parseTenantId` → lookup by `tenants.enterprise_id` → session uuid).
- **`enterprise_id` is not a security boundary.** RLS policies must compare UUID scope columns against trusted session/app context values. RLS policies must not parse, regex-check, join by, or authorize directly from `enterprise_id`.

### CHECK constraints

Family-specific format enforced at the database layer:

```sql
enterprise_id text not null
  check (enterprise_id ~ '^emp_[0-9A-HJKMNP-TV-Z]{26}$')
-- unique lookup index created separately (see phased migration rule)
```

Database CHECK expressions may be generated from database-local metadata, but that metadata must be **parity-validated** against the Kernel `ID_FAMILIES` registry via `pnpm check:enterprise-id-db-parity`. Manual drift between Kernel prefix and database CHECK pattern is prohibited.

### Drizzle helpers (target: `packages/database/src/ids/`)

| Helper | Creates |
|--------|---------|
| `primaryId(name?)` | `id uuid primary key default uuid_generate_v7()` |
| `entityRefId(name)` | `uuid not null` FK reference column — no text FK support |
| `enterpriseIdColumn()` | `enterprise_id text` — no default at DB layer unless Architecture Authority approves |
| `enterpriseIdFormatCheck({ tableName, columnName?, family })` | Table-level CHECK generated from family prefix |

Keep `enterpriseIdColumn()` and `enterpriseIdFormatCheck()` separate — do not let a column helper silently imply CHECK creation. Migrations must remain explicit and readable.

Current interim implementation: `packages/database/src/ids.ts` + `packages/database/src/enterprise-id/`.

### Phased migration rule (mandatory)

Schema changes must not block production writes. Roll out in order:

1. Add nullable `enterprise_id text` column (no CHECK yet, or CHECK allowing NULL).
2. Backfill in batches using Kernel `createCanonicalId` / database generator at governed write paths.
3. Add CHECK `NOT VALID` → `VALIDATE CONSTRAINT`.
4. Create a unique index using `CREATE UNIQUE INDEX CONCURRENTLY` after backfill verification. This step must not run inside a transaction-wrapped migration. If a named unique constraint is required, attach the unique index to the constraint in a separate migration step.
5. Set `NOT NULL` after backfill verification.

Never switch PK type from uuid to text. Never add FK referencing `enterprise_id`.

### Audit / events dual-field model

When entity identity is recorded in audit or outbox payloads:

| Field | Type | Purpose |
|-------|------|---------|
| `entityId`, `tenantId` | canonical string | Wire evidence, API replay |
| `entityPk`, `tenantPk` | uuid | DB reconciliation, joins |

---

## Consequences

### Positive

- UUID v7 PKs preserve B-tree locality and join performance.
- Canonical IDs remain stable across internal PK rotation (not planned, but model allows separation).
- RLS stays on uuid tenant scope — no string parsing in policies.
- Phased migration avoids long write locks.

### Negative / trade-offs

- Two identifiers per row until all consumers migrate to parse-at-boundary.
- CHECK regex patterns must stay in parity with Kernel registry.
- Backfill requires coordinated Kernel generator + database write path.

---

## Acceptance Gate

Documentation and governance (Slice A):

- ADR recorded and cross-linked from PAS-001 §4.1.12
- Architecture doc: [`docs/PAS/KERNEL/identity/postgres-split-id-model.md`](../PAS/KERNEL/identity/postgres-split-id-model.md)

Runtime (Slice C — blocked until ADR accepted):

- Pilot tables have `enterprise_id` + UUID v7 default
- `pnpm check:enterprise-id-db-parity` exit 0
- `pnpm check:fk-uuid-only` exit 0 (when governance script lands)
- `pnpm check:rls-uuid-tenant-only` exit 0 (when governance script lands)

---

## References

- [ADR-0021 — Canonical Enterprise Identity](./ADR-0021-canonical-enterprise-identity.md)
- [ADR-0023 — Tenant Human Reference Numbering](./ADR-0023-tenant-human-reference-numbering.md)
- [PAS-001 §4.1.12](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)
- [postgres-split-id-model.md](../PAS/KERNEL/identity/postgres-split-id-model.md)
- RFC 9562 (UUID v7)
- Supabase: `schema-primary-keys`, `schema-constraints`, `security-rls-performance`
