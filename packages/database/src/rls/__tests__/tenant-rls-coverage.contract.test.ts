import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TENANT_RLS_COMMERCIAL_PLANS_MIGRATION_TAG,
  TENANT_RLS_COMPLETION_MIGRATION_TAG,
  TENANT_RLS_FOUNDATION_MIGRATION_TAG,
  TENANT_RLS_ISOLATION_POLICIES,
  TENANT_RLS_MIGRATION_POLICY_GROUPS,
  TENANT_RLS_TENANT_SETTINGS_MIGRATION_TAG,
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

  it("covers foundation, completion, commercial-plans, and tenant-settings migrations", () => {
    const tags = new Set(
      TENANT_RLS_ISOLATION_POLICIES.map((row) => row.migrationTag)
    );
    expect(tags).toEqual(
      new Set([
        TENANT_RLS_FOUNDATION_MIGRATION_TAG,
        TENANT_RLS_COMPLETION_MIGRATION_TAG,
        TENANT_RLS_COMMERCIAL_PLANS_MIGRATION_TAG,
        TENANT_RLS_TENANT_SETTINGS_MIGRATION_TAG,
      ])
    );
  });
});

describe("tenant-rls-schema-parity.contract", () => {
  it("has no registry/schema drift for tenant-scoped tables", () => {
    expect(collectTenantRlsSchemaParityGaps()).toEqual([]);
  });

  it("reports registry-missing-table when a tenant-scoped table lacks a registry row", () => {
    const incompleteRegistry = TENANT_RLS_ISOLATION_POLICIES.filter(
      (row) => row.tableName !== "audit_events"
    );

    expect(collectTenantRlsSchemaParityGaps(incompleteRegistry)).toEqual([
      { kind: "registry-missing-table", tableName: "audit_events" },
    ]);
  });

  it("reports schema-missing-table when the registry lists an unknown table", () => {
    const orphanRegistry = [
      ...TENANT_RLS_ISOLATION_POLICIES,
      {
        tableName: "synthetic_orphan_table",
        policyName: "synthetic_orphan_table_tenant_isolation",
        kind: "tenant_isolation" as const,
        migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
      },
    ];

    expect(collectTenantRlsSchemaParityGaps(orphanRegistry)).toEqual([
      { kind: "schema-missing-table", tableName: "synthetic_orphan_table" },
    ]);
  });
});

describe("tenant-rls-coverage.contract parity", () => {
  it("registry invariants pass via coverage gate contract", () => {
    expect(collectTenantRlsRegistryInvariantViolations()).toEqual([]);
  });

  it("surfaces schema-parity-gap when registry omits a tenant-scoped table", () => {
    const incompleteRegistry = TENANT_RLS_ISOLATION_POLICIES.filter(
      (row) => row.tableName !== "companies"
    );

    expect(
      collectTenantRlsRegistryInvariantViolations(incompleteRegistry)
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: "schema-parity-gap",
          tableName: "companies",
          message: expect.stringContaining(
            "companies is missing from TENANT_RLS_ISOLATION_POLICIES"
          ),
        }),
      ])
    );
  });
});
