import { describe, expect, it } from "vitest";

import {
  isLiveTenantRlsVerificationAvailable,
  type PgQueryable,
  verifyTenantRlsLive,
} from "../verify-tenant-rls-live.server.js";

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
      ...Array.from({ length: 10 }, () => okRow),
      { ok: true },
    ]);

    await expect(verifyTenantRlsLive(pool)).resolves.toEqual([]);
  });

  it("collects RLS and policy violations from probe rows", async () => {
    const pool = createMockPool([
      { rls_enabled: false, policy_exists: true },
      ...Array.from({ length: 9 }, () => ({
        rls_enabled: true,
        policy_exists: true,
      })),
      { ok: true },
    ]);

    const violations = await verifyTenantRlsLive(pool);

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: "rls-disabled",
          tableName: "audit_events",
          policyName: "audit_events_tenant_isolation",
        }),
      ])
    );
  });

  it("flags migration completion probe failure", async () => {
    const okRow = { rls_enabled: true, policy_exists: true };
    const pool = createMockPool([
      ...Array.from({ length: 10 }, () => okRow),
      { ok: false },
    ]);

    const violations = await verifyTenantRlsLive(pool);

    expect(violations).toEqual([
      expect.objectContaining({
        rule: "migration-probe-failed",
        tableName: "projects",
        policyName: "projects_tenant_isolation",
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
