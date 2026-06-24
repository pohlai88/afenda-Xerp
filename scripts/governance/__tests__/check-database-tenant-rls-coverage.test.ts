import { describe, expect, it, vi } from "vitest";

vi.mock(
  "../../../packages/database/src/rls/tenant-rls-registry-invariants.contract.ts",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("../../../packages/database/src/rls/tenant-rls-registry-invariants.contract.ts")
      >();
    return {
      ...actual,
      collectTenantRlsRegistryInvariantViolations: vi.fn(
        actual.collectTenantRlsRegistryInvariantViolations
      ),
    };
  }
);

import { collectTenantRlsRegistryInvariantViolations } from "../../../packages/database/src/rls/tenant-rls-registry-invariants.contract.ts";
import { checkDatabaseTenantRlsCoverage } from "../check-database-tenant-rls-coverage.mts";

describe("check-database-tenant-rls-coverage script", () => {
  it("passes when migrations, registry, and schema parity align", () => {
    expect(checkDatabaseTenantRlsCoverage()).toEqual([]);
  });

  it("maps schema-parity-gap invariant violations to gate output", () => {
    vi.mocked(collectTenantRlsRegistryInvariantViolations).mockReturnValueOnce([
      {
        rule: "schema-parity-gap",
        tableName: "audit_events",
        message:
          "Tenant-scoped table audit_events is missing from TENANT_RLS_ISOLATION_POLICIES",
      },
    ]);

    expect(checkDatabaseTenantRlsCoverage()).toEqual([
      {
        rule: "schema-parity-gap",
        file: "packages/database/src/rls/tenant-rls-registry-invariants.contract.ts",
        message:
          "Tenant-scoped table audit_events is missing from TENANT_RLS_ISOLATION_POLICIES",
      },
    ]);
  });
});
