---
name: afenda-drizzle-migration
description: Governs Drizzle ORM schema changes and migration generation for the @afenda/database package. Use whenever a schema file in packages/database/src/schema/ is added or modified, or when generating, applying, or repairing migrations. Enforces the governance contract (migration-governance.contract.ts) and journal integrity automatically.
---

# Afenda Drizzle Migration Governance

**Auto-triggers when:** any `packages/database/src/schema/*.schema.ts` is changed, a new migration is generated, or `db:generate` / `db:migrate` commands are requested.

## Schema Mutation Checklist

Copy and track progress every time a schema file changes:

```
Migration Governance Checklist:
- [ ] 1. Schema change authored in packages/database/src/schema/
- [ ] 2. drizzle-kit generate run — new .sql + journal entry produced
- [ ] 3. Governance rule added to migration-governance.contract.ts
- [ ] 4. Journal validated (db:validate-journal passes)
- [ ] 5. Acceptance gates passed (typecheck + test)
```

## Step 1 — Author Schema Change

Edit only `packages/database/src/schema/*.schema.ts` (or `ids.ts`, `timestamps.ts`).  
The `schema/index.ts` barrel must import + export every new table/enum.

**Column naming:** always provide explicit snake_case column names in `pgTable`:

```ts
// Correct — explicit column name
userId: text("user_id").notNull()

// Wrong — relying on implicit casing
userId: text().notNull()
```

## Step 2 — Generate Migration

```bash
# From repo root
pnpm db:generate
# Or scoped
pnpm --filter @afenda/database db:generate
```

This produces:
- `packages/database/src/migrations/<timestamp>_<slug>.sql`
- Updated `packages/database/src/migrations/meta/_journal.json`

**Never hand-edit SQL migration files.** If a migration needs custom SQL, generate an empty migration:

```bash
pnpm --filter @afenda/database db:generate -- --custom --name=my_custom_step
```

## Step 3 — Add Governance Rule (MANDATORY)

Every new journal tag **must** have a corresponding entry in:

```
packages/database/src/migrations/migration-governance.contract.ts
```

The `migration-governance.contract.test.ts` test enforces this — it fails if any journal entry is missing a rule.

### Rule Template

```ts
"<timestamp>_<slug>": {
  // SQL returning `{ ok: boolean }` — true when migration is fully applied
  completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = '<table>'
        AND column_name = '<key_column>'
    ) AS ok`,

  // SQL returning `{ partial: boolean }` — true when partial artifacts exist
  // Use `SELECT false AS partial` if the migration is atomic / safe to retry
  partialProbe: "SELECT false AS partial",

  // Idempotent cleanup SQL to run before retrying a failed partial migration
  // Must be non-empty when partialProbe is non-trivial
  partialCleanup: [],
},
```

### Common completeProbe patterns

| What changed | completeProbe pattern |
|---|---|
| New table created | `SELECT to_regclass('public.<table>') IS NOT NULL AS ok` |
| New column added | `EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='<t>' AND column_name='<c>')` |
| New RLS policy | `EXISTS (SELECT 1 FROM pg_policies WHERE tablename='<t>' AND policyname='<p>')` |
| New enum value | `EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid=t.oid WHERE t.typname='<enum>' AND e.enumlabel='<val>')` |

### partialProbe + partialCleanup (required when migration touches enums or new tables)

Enum `ADD VALUE` cannot run inside a transaction — if the migration dies mid-way, orphan enum values or partial tables remain. Provide cleanup:

```ts
partialProbe: `
  SELECT (
    to_regtype('public.<enum_type>') IS NOT NULL
    OR to_regclass('public.<table>') IS NOT NULL
  ) AS partial`,
partialCleanup: [
  `DROP TABLE IF EXISTS "<table>" CASCADE`,
  `DROP TYPE IF EXISTS "public"."<enum_type>"`,
],
```

## Step 4 — Validate Journal

```bash
pnpm --filter @afenda/database db:validate-journal
```

Checks: no duplicate tags, no missing SQL, no orphan SQL files, correct `idx` sequence.  
This runs automatically as `pretest` before every test run.

## Step 5 — Acceptance Gates

```bash
pnpm --filter @afenda/database typecheck
pnpm --filter @afenda/database test:run
```

The `migration-governance.contract.test.ts` will fail if Step 3 was skipped.

## drizzle.config.ts — Canonical Settings

Location: `packages/database/drizzle.config.ts`  
Root delegate: `drizzle.config.ts` (re-exports the above)

**Do not change these without Architecture Authority:**

| Option | Value | Reason |
|---|---|---|
| `migrations.table` | `"__drizzle_migrations"` | Pinned to match fallback apply script |
| `migrations.schema` | `"drizzle"` | Pinned to match fallback apply script |
| `migrations.prefix` | `"timestamp"` | All existing migrations use timestamp prefix |
| `schemaFilter` | `["public"]` | Excludes Supabase-managed `auth`/`storage`/`drizzle` schemas |
| `entities.roles.provider` | `"supabase"` | Prevents role-management DDL on managed clusters |
| `breakpoints` | `true` | Required for statement-by-statement fallback apply |
| `strict` | `true` | Prevents silent destructive migrations |

To suppress verbose output locally: `DRIZZLE_VERBOSE=0 pnpm db:generate`

## Migration Apply Flow

```
pnpm db:migrate
 ├─ scripts/repair-drizzle-journal.ts   (repairs ledger drift)
 └─ scripts/apply-pending-migrations.ts
      ├─ drizzle-kit migrate (primary)
      └─ apply-sql-migrations-fallback.ts (fallback: statement-by-statement)
           └─ Queries drizzle.__drizzle_migrations by SHA-256 hash
```

**Never run `drizzle-kit push`** — this project uses migration files only. `push` bypasses the journal, the governance contract, and the fallback apply path.

## Repair Workflow (Journal Drift)

If the Drizzle ledger and journal get out of sync:

```bash
pnpm --filter @afenda/database db:repair-journal:check   # dry-run first
pnpm --filter @afenda/database db:repair-journal         # apply repair
pnpm --filter @afenda/database db:validate-journal       # confirm clean
```

## Schema File Conventions

- One domain per file: `<domain>.schema.ts`
- All ID columns from `../ids.ts` helpers (`primaryId()`, `tenantIdRef()`, etc.)
- All timestamps from `../timestamps.ts` (`createdAtColumn()`, `updatedAtColumn()`)
- Enums exported from `../database.types.ts`, imported into schema files
- Table exported as a `const` matching the domain name (`export const memberships = pgTable(...)`)
- Register every new table in `schema/index.ts` `platformSchema` object and re-export it

## Anti-patterns

- Never edit `.sql` migration files by hand
- Never run `drizzle-kit push`
- Never commit a new schema table without a corresponding governance rule
- Never add columns to existing tables without running `db:generate` first
- Never use implicit column names — always pass the explicit `"snake_case"` string
