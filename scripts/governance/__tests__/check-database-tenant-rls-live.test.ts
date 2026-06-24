import { describe, expect, it, vi } from "vitest";

vi.mock("../check-database-tenant-rls-coverage.mts", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("../check-database-tenant-rls-coverage.mts")
    >();
  return {
    ...actual,
    checkDatabaseTenantRlsCoverage: vi.fn(
      actual.checkDatabaseTenantRlsCoverage
    ),
  };
});

import { checkDatabaseTenantRlsCoverage } from "../check-database-tenant-rls-coverage.mts";
import { checkDatabaseTenantRlsLive } from "../check-database-tenant-rls-live.mts";

describe("check-database-tenant-rls-live script", () => {
  it("passes artifact coverage and skips or passes live verification", async () => {
    const result = await checkDatabaseTenantRlsLive();

    expect(["skipped", "passed"]).toContain(result.kind);
    if (result.kind === "skipped") {
      expect(result.reason).toBe("migration database URL unavailable");
    }
  });

  it("fails fast when artifact coverage is broken", async () => {
    vi.mocked(checkDatabaseTenantRlsCoverage).mockReturnValueOnce([
      {
        rule: "rls-policy-missing",
        file: "packages/database/src/migrations/example.sql",
        message: "missing policy",
      },
    ]);

    await expect(checkDatabaseTenantRlsLive()).resolves.toEqual({
      kind: "coverage-failed",
      violations: [
        {
          rule: "rls-policy-missing",
          file: "packages/database/src/migrations/example.sql",
          message: "missing policy",
        },
      ],
    });
  });
});
