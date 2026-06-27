import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { PlatformRolloutBundle } from "@afenda/database";
import { describe, expect, it, vi } from "vitest";

import {
  createModuleRouteOperatingContext,
  MODULE_ROUTE_TEST_COMPANY_ID,
  MODULE_ROUTE_TEST_TENANT_ID,
} from "@/lib/modules/__tests__/module-route-test-fixtures";
import {
  evaluateRolloutFlagFromResolved,
  resolveRolloutFlagsFromOperatingContext,
  toFeatureFlagContextFromOperatingContext,
} from "../resolve-rollout-flags.server";

const resolverSource = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../resolve-rollout-flags.server.ts"
  ),
  "utf8"
);

const testRolloutBundle: PlatformRolloutBundle = {
  loadedAt: "2026-06-25T00:00:00.000Z",
  featureFlags: [
    {
      key: "e_invoice",
      enabled: true,
      rollout: "on",
      environments: ["development", "test", "production"],
      tenantAllowlist: [MODULE_ROUTE_TEST_TENANT_ID],
      companyAllowlist: [],
      killSwitchKey: "feature.e_invoice.kill_switch",
      metadata: {},
    },
    {
      key: "forecasting",
      enabled: true,
      rollout: "limited",
      environments: ["development", "test", "production"],
      tenantAllowlist: ["ten_01ARZ3NDEKTSV4RRFFQ69G5FBV"],
      companyAllowlist: [],
      killSwitchKey: "feature.forecasting.kill_switch",
      metadata: {},
    },
  ],
  killSwitches: [
    {
      key: "feature.e_invoice.kill_switch",
      active: false,
      severity: "critical",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
    {
      key: "feature.forecasting.kill_switch",
      active: false,
      severity: "standard",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
  ],
};

describe("resolveRolloutFlagsFromOperatingContext integration", () => {
  it("evaluates rollout flags through @afenda/feature-flags facade", async () => {
    const operatingContext = createModuleRouteOperatingContext();
    const loadBundle = vi.fn(async () => testRolloutBundle);

    const resolved = await resolveRolloutFlagsFromOperatingContext(
      operatingContext,
      {
        environment: "test",
        loadBundle,
      }
    );

    expect(loadBundle).toHaveBeenCalledOnce();
    expect(resolved.evaluationData.featureFlags).toHaveLength(2);
    expect(resolved.decisions["e_invoice"]).toEqual({
      allowed: true,
      key: "e_invoice",
      flag: expect.objectContaining({ key: "e_invoice" }),
    });

    const denied = evaluateRolloutFlagFromResolved(resolved, "forecasting");
    expect(denied).toEqual({
      allowed: false,
      key: "forecasting",
      reason: "tenant_excluded",
    });
  });

  it("builds FeatureFlagContext from operating context tenant and company scope", () => {
    const operatingContext = createModuleRouteOperatingContext();

    expect(
      toFeatureFlagContextFromOperatingContext(operatingContext, "test")
    ).toEqual({
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      companyId: MODULE_ROUTE_TEST_COMPANY_ID,
      environment: "test",
    });
  });

  it("does not import entitlements feature-flag-engine directly", () => {
    expect(resolverSource).toContain("@afenda/feature-flags");
    expect(resolverSource).toContain("mapPlatformRolloutToEvaluationData");
    expect(resolverSource).not.toContain("feature-flag-engine");
    expect(resolverSource).not.toMatch(/resolveFeatureFlag[^S]/);
  });
});
