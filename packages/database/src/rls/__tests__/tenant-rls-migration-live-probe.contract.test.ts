import { describe, expect, it } from "vitest";

import { MIGRATION_GOVERNANCE_RULES } from "../../migrations/migration-governance.contract.js";
import { TENANT_RLS_MIGRATION_POLICY_GROUPS } from "../tenant-rls-coverage.contract.js";
import {
  buildTenantRlsMigrationLiveProbes,
  TENANT_RLS_MIGRATION_LIVE_PROBES,
} from "../tenant-rls-migration-live-probe.contract.js";

describe("tenant-rls-migration-live-probe.contract", () => {
  it("builds a live probe for every RLS migration group", () => {
    expect(TENANT_RLS_MIGRATION_LIVE_PROBES).toHaveLength(
      TENANT_RLS_MIGRATION_POLICY_GROUPS.length
    );
  });

  it("aligns each live probe SQL with migration governance completeProbe", () => {
    for (const probe of buildTenantRlsMigrationLiveProbes()) {
      const governanceProbe =
        MIGRATION_GOVERNANCE_RULES[probe.migrationTag]?.completeProbe;

      expect(governanceProbe?.replace(/\s+/g, " ").trim()).toBe(
        probe.text.replace(/\s+/g, " ").trim()
      );
    }
  });

  it("includes commercial plans migration sentinel policy", () => {
    const commercialProbe = TENANT_RLS_MIGRATION_LIVE_PROBES.find(
      (probe) =>
        probe.migrationTag === "20260624115705_tenant_commercial_plans_rls"
    );

    expect(commercialProbe?.sentinelPolicy).toEqual(
      expect.objectContaining({
        tableName: "tenant_commercial_plans",
        policyName: "tenant_commercial_plans_tenant_isolation",
      })
    );
  });
});
