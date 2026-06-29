# PostgreSQL Split-ID Model

| Field | Value |
|-------|-------|
| **Authority** | [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md) · [PAS-001 §4.1.12](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) |
| **Implementation** | `packages/database/src/ids/` (Slice C) |
| **Status** | Accepted — architecture record (Slice A) |

---

## Purpose

Records how Afenda maps Kernel canonical enterprise IDs onto PostgreSQL without using text IDs as primary or foreign keys.

---

## Column contract

Every **new** governed entity table uses the final-state contract below. **Existing** tables must reach this state through the phased migration flow.

```sql
id uuid primary key default uuid_generate_v7(),

enterprise_id text not null,
  constraint employees_enterprise_id_format_check
    check (enterprise_id ~ '^emp_[0-9A-HJKMNP-TV-Z]{26}$')
-- unique lookup index created separately; see phased migration
```

For new governed entity tables, `enterprise_id` may be created as `text not null` with CHECK and unique index from the first migration. For existing tables, the phased migration below is mandatory.

CHECK constraints must be named deterministically using `<table>_enterprise_id_format_check`. Unique indexes must be named deterministically using `<table>_enterprise_id_unique_idx` unless an existing approved naming convention applies.

| Column | Role |
|--------|------|
| `id` | PK, all FKs, joins, RLS |
| `enterprise_id` | Kernel canonical string for API, audit, events, wire |

Column name is always `enterprise_id` on entity tables. FK columns stay explicit uuid refs (`orders.customer_id uuid → customers.id`).

`uuid_generate_v7()` is the preferred default. If unavailable in local, CI, staging, or production PostgreSQL/Supabase runtime, Architecture Authority must approve a native-uuid fallback before Slice C lands. The fallback must not change PK/FK column types.

---

## Rules

1. **PK:** `uuid` with `uuid_generate_v7()` default — not serial, not text. If `uuid_generate_v7()` is unavailable in any deployed PostgreSQL/Supabase runtime, Architecture Authority must approve a native-uuid fallback before Slice C lands. The fallback must not change PK/FK column types and must not introduce text primary keys.
2. **FK:** Reference parent `id uuid` — never `enterprise_id text`.
3. **UNIQUE:** Global unique lookup index on `enterprise_id` per table (enterprise IDs are globally unique by construction).
4. **CHECK:** Family-specific regex from Kernel registry; nullable during backfill phase only. Database metadata must be parity-validated against Kernel — manual drift is prohibited.
5. **RLS:** Policies compare UUID scope columns, especially `tenant_id uuid`, against trusted session/app context. Resolve `ten_*` once at API ingress, then carry the resolved UUID through database operations.
6. **Security:** `enterprise_id` is **not** an RLS boundary. Policies must not parse, regex-check, join by, or authorize directly from `enterprise_id`.

---

## Drizzle helpers

Target module: `packages/database/src/ids/`

| Export | Behavior |
|--------|----------|
| `primaryId(name?)` | uuid PK + v7 default |
| `entityRefId(name)` | uuid not null FK reference column — no text FK support |
| `enterpriseIdColumn()` | `enterprise_id text` — no default at DB layer unless Architecture Authority approves |
| `enterpriseIdFormatCheck({ tableName, columnName?, family })` | Named table-level CHECK generated from family prefix |

Keep `enterpriseIdColumn()` and `enterpriseIdFormatCheck()` separate — do not let a column helper silently imply CHECK creation. Migrations must remain explicit and readable.

Interim: `packages/database/src/ids.ts` + `packages/database/src/enterprise-id/`.

Parity gate: `pnpm check:enterprise-id-db-parity` (Kernel registry ↔ database patterns).

---

## Phased migration (mandatory)

Do not block writes with a single destructive migration.

| Phase | Action |
|-------|--------|
| 1 | Add nullable `enterprise_id text` |
| 2 | Backfill batches via Kernel/database generator at write path |
| 3 | `ADD CONSTRAINT … CHECK … NOT VALID` then `VALIDATE CONSTRAINT` |
| 4 | `CREATE UNIQUE INDEX CONCURRENTLY` after backfill verification. This phase must not run inside a transaction-wrapped migration. If the migration runner wraps migrations by default, use the approved non-transactional migration path. If a named unique constraint is required, attach the unique index to the constraint in a separate migration step. |
| 5 | `ALTER COLUMN enterprise_id SET NOT NULL` |

Migration helpers (target): `packages/database/src/migrations/helpers/add-enterprise-id-*.sql.ts`

---

## Audit dual-field model

| Payload field | Storage type | Use |
|---------------|--------------|-----|
| `entityId`, `tenantId` | canonical string | Wire, human evidence |
| `entityPk`, `tenantPk` | uuid | DB reconciliation |

The `*Id` suffix in audit/outbox payloads means canonical enterprise ID; the `*Pk` suffix means PostgreSQL UUID primary key.

---

## Prohibited

- Text canonical ID as primary key
- Foreign key to `enterprise_id`
- Separate prefix column alongside `enterprise_id`
- RLS parsing `ten_*` or other prefix strings; RLS based on `enterprise_id` pattern matching
- Application-generated UUID primary keys unless explicitly approved by Architecture Authority for a bounded migration/import case
- Hiding CHECK generation inside `enterpriseIdColumn()` — use `enterpriseIdFormatCheck()` explicitly

---

## Slice C acceptance (minimum)

```bash
pnpm check:enterprise-id-db-parity
pnpm check:fk-uuid-only
pnpm check:rls-uuid-tenant-only
```

Minimum proof: `primaryId()` centralizes UUID v7 PK default; `entityRefId()` produces UUID FK columns only; `enterprise_id` is never PK or FK; every governed table has deterministic CHECK naming; CHECK patterns match Kernel registry; existing-table migrations follow nullable → backfill → NOT VALID CHECK → VALIDATE → CONCURRENT UNIQUE INDEX → NOT NULL; concurrent index migrations are not transaction-wrapped; audit/outbox uses `*Id` for canonical strings and `*Pk` for UUIDs.

---

## Governance principle

> Use UUIDs for relational truth. Use canonical enterprise IDs for boundary truth. Never make text identity carry database security or relational integrity.

---

## References

- [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md)
- [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md)
- [canonical-enterprise-id-constitution.md](./canonical-enterprise-id-constitution.md)
- Supabase: `schema-primary-keys`, `schema-constraints`, `security-rls-performance`
