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
| `db:migrate` / `pnpm migrate` / `pnpm migrate:deploy` | Validate journal (offline), repair ledger drift, apply migrations |
| `db:validate-journal` | Offline check only (runs before `test`; also runs inside `db:migrate` via repair) |
| `db:repair-journal` | Rewrite `drizzle.__drizzle_migrations` to match applied schema |
| `db:repair-journal:check` | Fail if ledger drift is detected (CI when `DATABASE_URL` is set) |
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
5. Run `pnpm migrate` (or `pnpm migrate:deploy` — same command).

`db:migrate` runs `repair-drizzle-journal.ts` then `drizzle-kit migrate`. The repair step validates the checked-in journal offline, probes applied schema, auto-repairs ledger drift (including DB-only hashes not in the journal), then Drizzle applies pending SQL.

Do not apply `src/migrations/*.sql` manually or run `drizzle-kit migrate` outside this workflow.

**Do not** run destructive reset commands against shared or production databases.

## Governed ISO registries

Company writes validate country (`ISO 3166-1 alpha-2`) and currency (`ISO 4217`) codes against a **governed active subset** in `src/company/iso-codes.ts` — not the full ISO publications.

To onboard a new code:

1. Verify the code against the official ISO publication.
2. Append the uppercase code to `ISO3166_ALPHA2_COUNTRY_CODES` or `ISO4217_CURRENCY_CODES`.
3. Add or update a case in `src/__tests__/iso-codes.test.ts`.
4. Run `pnpm --filter @afenda/database test` (includes `validateIsoRegistryIntegrity()`).

Required business codes (`GOVERNED_ISO_REQUIRED_*`) must remain in the registry. `assertValidIsoRegistry()` fails CI when sets contain duplicates, invalid formats, or missing required codes.

Format-only validation (`isIso3166Alpha2Format` / `isIso4217CurrencyFormat`) is separate from governed registry membership.

## Package entrypoints

| Import | Purpose |
|--------|---------|
| `@afenda/database` | Full platform API (`src/public-api.ts` aggregate) |
| `@afenda/database/env` | Connection URL helpers only |
| `@afenda/database/schema` | Drizzle schema tables and enums |

`pnpm install` runs `prepare` → `build` so `dist/` exists for workspace dependents. Monorepo `typecheck` depends on `^build` via Turbo.

## Platform tables

| Table | Purpose |
|-------|---------|
| `tenants` | Hard platform isolation boundary (writes via tenant service; slug normalized; no hard delete) |
| `companies` | Legal/business entity within a tenant (writes via `insertCompany()` / `updateCompany()`) |
| `organizations` | Operating hierarchy within a company (writes via organization service; tree validated) |
| `users` | Platform actor identity (writes via user service; not Better Auth login) |
| `memberships` | Authority grants (writes via membership service; explicit `scopeType`) |
| `roles` | Authority templates by scope (writes via role service; dot-case keys; no hard delete) |
| `permissions` | Global capability catalog (writes via `permission/permission.service.ts`) |
| `role_permissions` | Role-to-capability grants (writes via `grantPermissionToRole()` only) |
| `policies` | Authority decision templates (writes via policy service; governed condition JSON; priority-ordered evaluation) |
| `audit_events` | Append-only execution evidence ledger (writes via `insertAuditEvent()` only) |

### Better Auth tables (login identity boundary)

| Table | Purpose |
|-------|---------|
| `auth_user` | Better Auth login identity (not platform `users`) |
| `auth_session` | Session tokens |
| `auth_account` | Provider credentials (sensitive fields adapter-only) |
| `auth_verification` | Verification tokens |
| `auth_identity_links` | Maps `auth_user.id` → platform `users.id` |

**Golden rule:** Better Auth proves login. Afenda decides authority. Never use `auth_user.id` as `actorUserId`.

## Usage

```typescript
import { createDb, insertAuditEvent, tenants } from "@afenda/database";

const db = createDb();

const rows = await db.select().from(tenants);

await insertAuditEvent({
  actorType: "user",
  actorUserId: "...",
  module: "platform",
  action: "membership.create",
  targetType: "membership",
  targetId: "...",
  result: "success",
  correlationId: "corr-001",
  permission: "system_admin.users_manage",
});
```

**Audit writes:** use `insertAuditEvent()` only (runtime-validated). Module layout:

| File | Purpose |
|------|---------|
| `schema/audit.schema.ts` | Drizzle table (Postgres shape) |
| `audit/audit-event.contract.ts` | Types and constants |
| `audit/audit-event.validation.ts` | Zod + metadata sanitizer |
| `audit/audit-event.builder.ts` | Pure row builder |
| `audit/audit.writer.ts` | Append-only insert |

Do not insert, update, or delete `audit_events` from feature modules.

**Tenant writes:** use `insertTenant()` / `updateTenant()` / `archiveTenant()` only. Slugs are normalized to lowercase kebab-case; status controls workspace access; do not hard-delete tenants.

**Role writes:** use `insertRole()` / `updateRole()` / `archiveRole()` only. Keys are canonical dot-case (e.g. `finance.approver`); `scope` must match `tenantId`; role key/scope/tenant are immutable after create; archive only when no memberships reference the role.

**Policy writes:** use `insertPolicy()` / `updatePolicy()` / `archivePolicy()` only. Keys are canonical dot-case; `scope` must match `tenantId`; condition JSON is validated in `policy.validation.ts`; lower `priority` wins during evaluation; do not hard-delete policies.

**Permission catalog writes:** use `insertPermission()` / `updatePermission()` only. Keys must match `{domain}.{action}` via `permission-key.contract.ts`; key/domain/action are immutable after create.

**Role-permission grants:** use `grantPermissionToRole()` only. Grants are idempotent; audit `role.permission.grant` is written on first grant only. Tenant-scoped roles require matching `tenantId`; platform roles require `tenantId: null`.

**Company writes:** use `insertCompany()` / `updateCompany()` only. Slugs are normalized to lowercase kebab-case; country/currency must be governed ISO codes. Tenant → company FK uses `ON DELETE restrict`.

**Organization writes:** use `insertOrganization()` / `updateOrganization()` / `deleteOrganization()` only. Parent must share tenant/company; hierarchy must stay acyclic; slugs are company-unique and normalized.

**Membership writes:** use `insertMembership()` / `updateMembership()` / `deactivateMembership()` only. Explicit `scopeType` required; duplicate grants blocked per scope; use status changes instead of hard delete.

**User writes:** use `insertUser()` / `updateUser()` / `deactivateUser()` only. Email is normalized before write; `users.id` is the platform actor — never `auth_user.id`.

## Testing

Unit tests do not require a live database:

```bash
pnpm --filter @afenda/database test
```

Seed and bootstrap (TIP-003A):

```bash
pnpm migrate
pnpm --filter @afenda/database db:seed:platform
pnpm --filter @afenda/database db:bootstrap:local
pnpm --filter @afenda/database db:verify:seed
```

See `docs/TIP-003A-seed-bootstrap.md` for profiles, safety rules, and production confirmation env vars.

## Out of scope (TIP-003)

- Better Auth / Supabase Auth tables
- Permission enforcement middleware
- Business module schemas (accounting, HRM, CRM, MRP, inventory, AI)
