import { describe, expect, it } from "vitest";

import { MIGRATION_GOVERNANCE_RULES } from "../../migrations/migration-governance.contract.js";
import { TENANT_RLS_COMPLETION_MIGRATION_TAG } from "../tenant-rls-coverage.contract.js";
import {
  buildTenantRlsCompletionMigrationLiveProbe,
  buildTenantRlsPolicyLiveProbeSql,
  classifyTenantRlsPolicyProbeResult,
  TENANT_RLS_LIVE_POLICY_PROBES,
} from "../tenant-rls-live-probe.contract.js";

describe("tenant-rls-live-probe.contract", () => {
  it("builds parameterized probes for every isolation policy", () => {
    expect(TENANT_RLS_LIVE_POLICY_PROBES).toHaveLength(10);

    for (const { policy, probe } of TENANT_RLS_LIVE_POLICY_PROBES) {
      expect(probe.values).toEqual([policy.tableName, policy.policyName]);
      expect(probe.text).toContain("pg_class");
      expect(probe.text).toContain("relrowsecurity = true");
      expect(probe.text).toContain("pg_policies");
      expect(probe.text).toContain("$1");
      expect(probe.text).toContain("$2");
    }
  });

  it("classifies probe rows into discriminated statuses", () => {
    const policy = TENANT_RLS_LIVE_POLICY_PROBES[0]!.policy;

    expect(
      classifyTenantRlsPolicyProbeResult(policy, {
        rls_enabled: true,
        policy_exists: true,
      })
    ).toEqual({
      status: "ok",
      tableName: policy.tableName,
      policyName: policy.policyName,
    });

    expect(
      classifyTenantRlsPolicyProbeResult(policy, {
        rls_enabled: false,
        policy_exists: false,
      }).status
    ).toBe("both-missing");

    expect(
      classifyTenantRlsPolicyProbeResult(policy, {
        rls_enabled: false,
        policy_exists: true,
      }).status
    ).toBe("rls-disabled");

    expect(
      classifyTenantRlsPolicyProbeResult(policy, {
        rls_enabled: true,
        policy_exists: false,
      }).status
    ).toBe("policy-missing");
  });

  it("aligns completion migration probe with governance contract", () => {
    const liveProbe = buildTenantRlsCompletionMigrationLiveProbe();
    const governanceProbe =
      MIGRATION_GOVERNANCE_RULES[TENANT_RLS_COMPLETION_MIGRATION_TAG]
        ?.completeProbe;

    expect(liveProbe.migrationTag).toBe(TENANT_RLS_COMPLETION_MIGRATION_TAG);
    expect(liveProbe.text.replace(/\s+/g, " ").trim()).toBe(
      governanceProbe?.replace(/\s+/g, " ").trim()
    );
  });

  it("embeds only contract constants in SQL literals", () => {
    const probe = buildTenantRlsPolicyLiveProbeSql({
      tableName: "projects",
      policyName: "projects_tenant_isolation",
    });

    expect(probe.text).toContain("public");
    expect(probe.text).not.toMatch(/\$\{|\+\s*policy/);
  });
});
