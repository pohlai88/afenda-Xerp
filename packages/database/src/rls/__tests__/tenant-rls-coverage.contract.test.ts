import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TENANT_RLS_COMPLETION_MIGRATION_TAG,
  TENANT_RLS_ISOLATION_POLICIES,
} from "../tenant-rls-coverage.contract";

describe("tenant-rls-coverage.contract", () => {
  it("lists every tenant isolation policy in the completion migration", () => {
    const migrationPath = join(
      import.meta.dirname,
      "../../migrations",
      `${TENANT_RLS_COMPLETION_MIGRATION_TAG}.sql`
    );
    const migrationSql = readFileSync(migrationPath, "utf8");

    for (const { tableName, policyName } of TENANT_RLS_ISOLATION_POLICIES) {
      expect(migrationSql).toContain(
        `CREATE POLICY "${policyName}" ON "${tableName}"`
      );
    }
  });
});
