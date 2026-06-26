import { describe, expect, it } from "vitest";

import {
  TENANT_RLS_ISOLATION_POLICIES,
  TENANT_RLS_MIGRATION_POLICY_GROUPS,
} from "../tenant-rls-coverage.contract.js";
import {
  collectTenantRlsRegistryInvariantViolations,
  expectedPolicyKindForTable,
  TENANT_RLS_ACTOR_ISOLATION_TABLES,
} from "../tenant-rls-registry-invariants.contract.js";
import { TENANT_SCOPED_TABLE_NAMES } from "../tenant-rls-schema-parity.contract.js";

describe("tenant-rls-registry-invariants.contract", () => {
  it("passes for the canonical registry", () => {
    expect(collectTenantRlsRegistryInvariantViolations()).toEqual([]);
  });

  it("requires one registry row per tenant-scoped table", () => {
    expect(TENANT_RLS_ISOLATION_POLICIES.length).toBe(
      TENANT_SCOPED_TABLE_NAMES.length
    );
    expect(TENANT_RLS_MIGRATION_POLICY_GROUPS.length).toBe(6);
  });

  it("documents memberships as the sole actor-isolation table", () => {
    expect(TENANT_RLS_ACTOR_ISOLATION_TABLES).toEqual(["memberships"]);
    expect(expectedPolicyKindForTable("memberships")).toBe("actor_isolation");
    expect(expectedPolicyKindForTable("companies")).toBe("tenant_isolation");
  });

  it("flags policy kind drift", () => {
    const drifted = TENANT_RLS_ISOLATION_POLICIES.map((row) =>
      row.tableName === "memberships"
        ? { ...row, kind: "tenant_isolation" as const }
        : row
    );

    expect(
      collectTenantRlsRegistryInvariantViolations(drifted).some(
        (v) =>
          v.rule === "policy-kind-mismatch" && v.tableName === "memberships"
      )
    ).toBe(true);
  });

  it("maps schema parity gaps to schema-parity-gap invariant violations", () => {
    const incompleteRegistry = TENANT_RLS_ISOLATION_POLICIES.filter(
      (row) => row.tableName !== "memberships"
    );

    const violations =
      collectTenantRlsRegistryInvariantViolations(incompleteRegistry);

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: "schema-parity-gap",
          tableName: "memberships",
        }),
      ])
    );
  });
});
