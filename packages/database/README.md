# Afenda Database (`@afenda/database`)

Platform database foundation for Afenda ERP using **Supabase-compatible PostgreSQL** and **Drizzle ORM**.

This package owns schema definitions, migrations, connection helpers, and platform identity tables. It does **not** implement authentication flows, permission enforcement, or business modules.

## Prerequisites

- Node.js 22+
- pnpm 9+
- A Supabase project (or any PostgreSQL 15+ instance)

## Configure `DATABASE_URL`

Afenda builds Supabase Postgres URLs from:

| Source | Variable | Purpose |
|--------|----------|---------|
| `.env.config` | `NEXT_PUBLIC_SUPABASE_URL` | Project ref (`https://[ref].supabase.co`) |
| `.env.config` | `SUPABASE_DB_REGION` | Pooler region (e.g. `ap-southeast-2`) |
| `.env.config` | `SUPABASE_DB_POOLER_HOST` | Full shared pooler host from Connect UI |
| `.env.secret` | `SUPABASE_DB_PASSWORD` | Database password |

# Optional explicit Postgres overrides in `.env.secret`:

| Variable | Connection method | Port | Use for |
|----------|-------------------|------|---------|
| `DATABASE_URL` | Explicit override | varies | App runtime when set |
| `DATABASE_URL_DEDICATED` | Dedicated pooler (default) | 6543 | Dashboard “Dedicated Pooler” URI |
| `DATABASE_URL_DIRECT` | Direct Postgres | 5432 | Legacy direct host migrations |
| `DATABASE_URL_TRANSACTION` | Shared transaction pooler (app default) | 6543 | Dashboard Shared Pooler → Transaction |
| `DATABASE_URL_SESSION` | Shared session pooler | 5432 | Migrations / long-lived backends |

If overrides are omitted, `@afenda/database` defaults to the **shared transaction pooler** (`postgres.[ref]` @ `SUPABASE_DB_POOLER_HOST:6543`).

```typescript
import {
  buildSupabaseDatabaseUrl,
  getDedicatedDatabaseUrl,
  getDirectDatabaseUrl,
  getSessionDatabaseUrl,
  getTransactionDatabaseUrl,
} from "@afenda/database";

const appUrl = getTransactionDatabaseUrl();
const sessionUrl = getSessionDatabaseUrl();
const dedicatedUrl = getDedicatedDatabaseUrl();
const directUrl = getDirectDatabaseUrl();
const customUrl = buildSupabaseDatabaseUrl("session");
```

Copy host/port/method from Supabase Dashboard → **Connect**. Never commit real passwords.

## Scripts

From the monorepo root:

```bash
pnpm db:generate
pnpm migrate
pnpm --filter @afenda/database db:studio
```

Or with explicit filter:

```bash
pnpm --filter @afenda/database db:generate
pnpm --filter @afenda/database db:migrate
pnpm --filter @afenda/database db:studio
```

| Script | Purpose |
|--------|---------|
| `db:generate` | Generate SQL migrations from schema changes (no live DB required) |
| `db:migrate` / `pnpm migrate` | Repair journal drift, then apply pending migrations |
| `db:repair-journal` | Rewrite `drizzle.__drizzle_migrations` to match applied schema |
| `db:repair-journal:check` | Fail if journal drift is detected (CI-friendly) |
| `db:migration-status` | JSON summary: migration count + platform table presence |
| `db:migration-hashes` | Compare journal SHA-256 hashes vs database ledger |
| `db:compare-migrations` | Print host, row counts, and recent journal tags |
| `db:url-hints` | Print resolved migration URL host/port (no secrets) |
| `db:studio` | Open Drizzle Studio against your database |

### Migration workflow

1. Edit schema files under `src/schema/`.
2. Run `db:generate` to create a new migration in `src/migrations/`.
3. Review the generated SQL.
4. Run `pnpm env:sync` so `packages/database/.env` is current.
5. Run `pnpm migrate` against your Supabase/Postgres instance.

`db:migrate` runs `scripts/repair-drizzle-journal.mjs` first (borrowed from legacy Xforge). It probes applied schema (e.g. `public.tenants`) and rewrites the Drizzle ledger when the database and `src/migrations/meta/_journal.json` drift.

**Do not** run destructive reset commands against shared or production databases.

## Platform tables

| Table | Purpose |
|-------|---------|
| `tenants` | Top-level tenant identity |
| `companies` | Legal entities within a tenant |
| `organizations` | Org hierarchy within a company |
| `users` | Platform user identity (not auth provider tables) |
| `memberships` | User ↔ tenant/company/org role assignments |
| `roles` | Role definitions by scope |
| `permissions` | Global permission catalog |
| `policies` | Allow/deny policy definitions |
| `audit_events` | Immutable audit trail |

## Usage

```typescript
import { createDb, tenants } from "@afenda/database";

const db = createDb();

const rows = await db.select().from(tenants);
```

## Testing

Unit tests do not require a live database:

```bash
pnpm --filter @afenda/database test
```

## Out of scope (TIP-003)

- Better Auth / Supabase Auth tables
- Permission enforcement middleware
- Business module schemas (accounting, HRM, CRM, MRP, inventory, AI)
- Seed data or production fixtures
