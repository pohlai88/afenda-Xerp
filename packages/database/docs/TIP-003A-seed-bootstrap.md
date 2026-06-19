# TIP-003A — Database seed and bootstrap foundation

## Status

**Status:** Done

**Scope owner:** `@afenda/database` (TIP-003A)

**Related:** TIP-003 migrations/schema, TIP-005 authorization read path

## Core principle

| Layer | Owns |
|-------|------|
| Migration (TIP-003) | Structure |
| Seed (TIP-003A) | Baseline platform data |
| Bootstrap (TIP-003A) | First usable workspace |

Production bootstrap is **explicit**, **audited**, and **idempotent**. Seeds never run from app startup.

## Commands

| Command | Profile | Purpose |
|---------|---------|---------|
| `pnpm db:seed:platform` | `platform` | Permissions, platform roles, grants, policy templates |
| `pnpm db:seed:dev` | `dev` | Platform baseline + `dev-local` workspace |
| `pnpm db:seed:test` | `test` | Platform baseline only (CI-friendly) |
| `pnpm db:seed:demo` | `demo` | Platform + `demo` workspace (blocked in production) |
| `pnpm db:bootstrap:local` | `local` | Same as `db:seed:dev` with bootstrap safety gate |
| `pnpm db:bootstrap:preview` | `preview` | Platform + `preview` workspace |
| `pnpm db:verify:seed` | verify | Read-only baseline verification |

Monorepo root aliases delegate to `@afenda/database` (same names).

Recommended local flow:

```bash
pnpm migrate
pnpm db:seed:platform
pnpm db:bootstrap:local
pnpm db:verify:seed
```

## Seed strategy

### Platform seed (all environments)

1. **Permissions** — `PLATFORM_PERMISSION_CATALOG` via `ensurePermission()` → `insertPermission()`
2. **Platform roles** — `PLATFORM_ROLE_CATALOG` via `ensureRole()` → `insertRole()`
3. **Role grants** — via `ensureRolePermissionGrant()` → `grantPermissionToRole()` only
4. **Policy templates** — `PLATFORM_POLICY_CATALOG` via `ensurePolicy()` → `insertPolicy()`

### Dev / preview / demo workspace (non-production)

Optional fixtures under `src/seeds/workspace-fixtures.ts`:

- dev tenant (`dev-local`)
- preview tenant (`preview`)
- demo tenant (`demo`) — blocked in production

Workspace seed creates tenant → company → organization → tenant role → user → membership using governed services only.

Fixture emails use `@localhost.afenda` — never real production addresses.

### Idempotency

`ensure*` helpers lookup by natural keys (permission key, role key + tenant, slug, email) before calling governed inserts. Grants use `grantPermissionToRole()` (`onConflictDoNothing`).

Repeated runs do not duplicate rows or grant audits.

### Explicit dependencies

```
permissions → roles → role_permissions → policies
platform seed → workspace fixtures (dev/preview only)
```

## Bootstrap strategy

Bootstrap commands are CLI-only entry points that compose seed profiles:

- **local** — development workspace for day-to-day ERP work
- **preview** — isolated preview tenant for deployment previews

Bootstrap does **not** create Better Auth users or auto-admin production accounts.

## Production safety

| Guard | Behavior |
|-------|----------|
| `isProductionEnvironment()` | `NODE_ENV`, `VERCEL_ENV`, or `AFENDA_ENV` = `production` |
| `assertSeedProfileAllowed()` | Blocks `dev`, `test`, `demo`, `preview` in production |
| Platform seed in production | Requires `AFENDA_SEED_CONFIRM=yes` |
| Bootstrap in production | Requires `AFENDA_BOOTSTRAP_CONFIRM=yes` |

## Governed write boundaries

| Table | Seed path |
|-------|-----------|
| `permissions` | `ensurePermission` → `insertPermission` |
| `roles` | `ensureRole` → `insertRole` |
| `role_permissions` | `ensureRolePermissionGrant` → `grantPermissionToRole` |
| `policies` | `ensurePolicy` → `insertPolicy` |
| `tenants` / `companies` / `organizations` / `users` / `memberships` | respective `ensure*` → governed services |

No direct `role_permissions` inserts outside `grantPermissionToRole()`.

## Authorization integration (TIP-005)

After `db:seed:platform`, `DatabasePermissionDataSource.getPermissionsForRole()` reads grants from `role_permissions`. Verified by:

- `packages/permissions/src/__tests__/authorization-bridge.integration.test.ts`
- `pnpm --filter @afenda/database db:verify:seed`

## Feature flags

Not seeded — no platform feature-flag table exists in TIP-003 schema.

## Tests

| Test | Purpose |
|------|---------|
| `seed-environment.test.ts` | Production safety guards |
| `seed-catalog.test.ts` | Catalog shape and fixture email policy |
| `@afenda/permissions` `seed-catalog-alignment.test.ts` | Catalog ↔ `PERMISSION_REGISTRY` parity |

## Rollback

Seeds are **non-destructive**. Rollback is operational, not automated:

1. Deactivate or archive seeded roles/memberships via governed services
2. Remove dev workspace rows manually only in disposable databases
3. Prefer `db:verify:seed` before/after changes

Never run destructive reset against shared or production databases.

## Risks

| Risk | Mitigation |
|------|------------|
| Catalog drift from `PERMISSION_REGISTRY` | Alignment test in CI |
| Accidental production demo seed | `assertSeedProfileAllowed` |
| Grant bypass | Single write path + grep audit |
| Audit noise on re-seed | Idempotent grants skip duplicate audit |

## Verdict

TIP-003A provides governed, idempotent platform seeding and explicit bootstrap commands with production guards. Safe for local/preview/test; production requires explicit confirmation.
