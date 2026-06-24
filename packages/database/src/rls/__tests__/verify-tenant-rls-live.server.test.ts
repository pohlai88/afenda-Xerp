import { describe, expect, it } from "vitest";

import { TENANT_RLS_ISOLATION_POLICIES } from "../tenant-rls-coverage.contract.js";
import { TENANT_RLS_MIGRATION_LIVE_PROBES } from "../tenant-rls-migration-live-probe.contract.js";
import {
  isLiveTenantRlsVerificationAvailable,
  type PgQueryable,
  verifyTenantRlsLive,
} from "../verify-tenant-rls-live.server.js";

const POLICY_PROBE_COUNT = TENANT_RLS_ISOLATION_POLICIES.length;
const MIGRATION_PROBE_COUNT = TENANT_RLS_MIGRATION_LIVE_PROBES.length;

function createMockPool(responses: Record<string, unknown>[]): PgQueryable {
  let callIndex = 0;

  return {
    query: async <T extends Record<string, unknown>>() => {
      const row = responses[callIndex];
      callIndex += 1;
      return { rows: row ? [row as T] : [] };
    },
  };
}

describe("verify-tenant-rls-live.server", () => {
  it("reports no violations when every probe passes", async () => {
    const okRow = { rls_enabled: true, policy_exists: true };
    const pool = createMockPool([
      ...Array.from({ length: POLICY_PROBE_COUNT }, () => okRow),
      ...Array.from({ length: MIGRATION_PROBE_COUNT }, () => ({ ok: true })),
    ]);

    await expect(verifyTenantRlsLive(pool)).resolves.toEqual([]);
  });

  it("collects RLS and policy violations from probe rows", async () => {
    const pool = createMockPool([
      { rls_enabled: false, policy_exists: true },
      ...Array.from({ length: POLICY_PROBE_COUNT - 1 }, () => ({
        rls_enabled: true,
        policy_exists: true,
      })),
      ...Array.from({ length: MIGRATION_PROBE_COUNT }, () => ({ ok: true })),
    ]);

    const violations = await verifyTenantRlsLive(pool);

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: "rls-disabled",
          tableName: "companies",
          policyName: "companies_tenant_isolation",
        }),
      ])
    );
  });

  it("flags migration live probe failure including commercial plans tag", async () => {
    const okRow = { rls_enabled: true, policy_exists: true };
    const lastMigrationProbe =
      TENANT_RLS_MIGRATION_LIVE_PROBES[MIGRATION_PROBE_COUNT - 1]!;

    const pool = createMockPool([
      ...Array.from({ length: POLICY_PROBE_COUNT }, () => okRow),
      ...Array.from({ length: MIGRATION_PROBE_COUNT - 1 }, () => ({
        ok: true,
      })),
      { ok: false },
    ]);

    const violations = await verifyTenantRlsLive(pool);

    expect(violations).toEqual([
      expect.objectContaining({
        rule: "migration-probe-failed",
        tableName: lastMigrationProbe.migrationTag,
        policyName: lastMigrationProbe.sentinelPolicy.policyName,
      }),
    ]);
  });

  it("detects migration database URL availability from env", () => {
    const original = { ...process.env };

    try {
      delete process.env["DATABASE_URL_DIRECT"];
      delete process.env["DATABASE_URL_DEDICATED"];
      delete process.env["DATABASE_URL_SESSION"];
      delete process.env["SUPABASE_DB_PASSWORD"];
      delete process.env["NEXT_PUBLIC_SUPABASE_URL"];

      expect(isLiveTenantRlsVerificationAvailable(process.env)).toBe(false);
    } finally {
      process.env = original;
    }
  });
});
