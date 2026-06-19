import pg from "pg";

import { resolveMigrationDatabaseUrl } from "../src/env.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

const url = resolveMigrationDatabaseUrl();

const pool = new pg.Pool({
  connectionString: url,
  max: 1,
  ssl: { rejectUnauthorized: false },
});

try {
  const count = await pool.query(
    "SELECT COUNT(*)::int AS count FROM drizzle.__drizzle_migrations"
  );
  const tables = await pool.query(
    `SELECT to_regclass('public.tenants') AS tenants,
            to_regclass('public.users') AS users,
            to_regclass('public.audit_events') AS audit_events,
            to_regclass('public.auth_user') AS auth_user,
            to_regclass('public.auth_identity_links') AS auth_identity_links`
  );

  console.log(
    JSON.stringify({
      migrationCount: count.rows[0]?.count,
      tenants: Boolean(tables.rows[0]?.tenants),
      users: Boolean(tables.rows[0]?.users),
      auditEvents: Boolean(tables.rows[0]?.audit_events),
      authUser: Boolean(tables.rows[0]?.auth_user),
      authIdentityLinks: Boolean(tables.rows[0]?.auth_identity_links),
      host: new URL(url).hostname,
    })
  );
} finally {
  await pool.end();
}
