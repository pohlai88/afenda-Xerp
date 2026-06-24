import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TENANT_RLS_COMMERCIAL_PLANS_MIGRATION_TAG,
  TENANT_RLS_COMPLETION_MIGRATION_TAG,
  TENANT_RLS_FOUNDATION_MIGRATION_TAG,
  TENANT_RLS_ISOLATION_POLICIES,
  TENANT_RLS_MIGRATION_POLICY_GROUPS,
} from "../tenant-rls-coverage.contract";
import { collectTenantRlsRegistryInvariantViolations } from "../tenant-rls-registry-invariants.contract";
import { collectTenantRlsSchemaParityGaps } from "../tenant-rls-schema-parity.contract";

describe("tenant-rls-coverage.contract", () => {
  it("lists every tenant isolation policy in its owning migration", () => {
    for (const {
      migrationTag,
      policies,
    } of TENANT_RLS_MIGRATION_POLICY_GROUPS) {
      const migrationPath = join(
        import.meta.dirname,
        "../../migrations",
        `${migrationTag}.sql`
      );
      const migrationSql = readFileSync(migrationPath, "utf8");

      for (const { tableName, policyName } of policies) {
        expect(migrationSql).toContain(
          `CREATE POLICY "${policyName}" ON "${tableName}"`
        );
      }
    }
  });

  it("covers foundation, completion, and commercial-plans migrations", () => {
    const tags = new Set(
      TENANT_RLS_ISOLATION_POLICIES.map((row) => row.migrationTag)
    );
    expect(tags).toEqual(
      new Set([
        TENANT_RLS_FOUNDATION_MIGRATION_TAG,
        TENANT_RLS_COMPLETION_MIGRATION_TAG,
        TENANT_RLS_COMMERCIAL_PLANS_MIGRATION_TAG,
      ])
    );
  });
});

describe("tenant-rls-schema-parity.contract", () => {
  it("has no registry/schema drift for tenant-scoped tables", () => {
    expect(collectTenantRlsSchemaParityGaps()).toEqual([]);
  });
});

describe("tenant-rls-coverage.contract parity", () => {
  it("registry invariants pass via coverage gate contract", () => {
    expect(collectTenantRlsRegistryInvariantViolations()).toEqual([]);
  });
});
