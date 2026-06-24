import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { hasDatabaseUrl, resolveMigrationDatabaseUrl } from "../../env.js";
import { verifyTenantRlsLive } from "../verify-tenant-rls-live.server.js";

const LIVE_DB_TEST_ENV = "AFENDA_LIVE_DB_TEST";
const LIVE_DB_TEST_CONFIRM = "yes";

function isLiveDatabaseTestEnabled(): boolean {
  return (
    process.env[LIVE_DB_TEST_ENV]?.trim().toLowerCase() ===
      LIVE_DB_TEST_CONFIRM && hasDatabaseUrl()
  );
}

describe.runIf(isLiveDatabaseTestEnabled())(
  "tenant RLS live verification (live database)",
  () => {
    let pool: pg.Pool;

    beforeAll(() => {
      pool = new pg.Pool({
        connectionString: resolveMigrationDatabaseUrl(),
        max: 1,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15_000,
        query_timeout: 15_000,
      });
    });

    afterAll(async () => {
      await pool.end();
    });

    it("verifies tenant isolation policies are applied in Postgres", async () => {
      const violations = await verifyTenantRlsLive(pool);
      expect(violations).toEqual([]);
    });
  }
);
