import pg from "pg";

import { resolveMigrationDatabaseUrl } from "../src/env.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

const pool = new pg.Pool({
  connectionString: resolveMigrationDatabaseUrl(),
  max: 1,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15_000,
  query_timeout: 15_000,
});

try {
  const migrations = await pool.query<{
    id: number;
    hash: string;
    created_at: number;
  }>(
    `SELECT id, hash, created_at
     FROM drizzle.__drizzle_migrations
     ORDER BY id`
  );
  console.log("ledger count:", migrations.rowCount);
  for (const row of migrations.rows) {
    console.log(`  ${row.id} ${row.hash.slice(0, 16)}…`);
  }

  const probes = [
    ["projects", `SELECT to_regclass('public.projects') AS v`],
    ["teams", `SELECT to_regclass('public.teams') AS v`],
    [
      "memberships.project_id",
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema='public' AND table_name='memberships' AND column_name='project_id'`,
    ],
    [
      "membership_scope enum",
      `SELECT e.enumlabel FROM pg_enum e
       JOIN pg_type t ON e.enumtypid=t.oid
       WHERE t.typname='membership_scope' ORDER BY e.enumsortorder`,
    ],
    [
      "project_lifecycle_status",
      `SELECT to_regtype('public.project_lifecycle_status') AS v`,
    ],
  ] as const;

  for (const [label, sql] of probes) {
    const result = await pool.query(sql);
    console.log(`${label}:`, JSON.stringify(result.rows));
  }
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("probe failed:", message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
