import type { TenantEntitlementBundle } from "@afenda/database";
import { describe, expect, it } from "vitest";
import { mapDatabaseBundleToEvaluationData } from "../provisioning/database-bundle.mapper";

const TENANT_ID = "00000000-0000-4000-8000-000000000100";

describe("mapDatabaseBundleToEvaluationData", () => {
  it("maps persisted grants into evaluation contracts", () => {
    const bundle: TenantEntitlementBundle = {
      tenantId: TENANT_ID,
      planTemplateId: "pro",
      loadedAt: "2026-06-20T00:00:00.000Z",
      entitlements: [
        {
          tenantId: TENANT_ID,
          companyId: null,
          key: "module.accounting.enabled",
          type: "module",
          scope: "tenant",
          environment: null,
          enabled: true,
          metadata: { source: "provision" },
        },
      ],
      usageLimits: [
        {
          tenantId: TENANT_ID,
          key: "users.max",
          scope: "tenant",
          period: "instant",
          maximum: 50,
          used: 3,
          unit: "users",
        },
        {
          tenantId: TENANT_ID,
          key: "unknown.limit",
          scope: "tenant",
          period: "monthly",
          maximum: 1,
          used: 0,
          unit: "units",
        },
      ],
    };

    const mapped = mapDatabaseBundleToEvaluationData(bundle);

    expect(mapped.entitlements).toEqual([
      {
        key: "module.accounting.enabled",
        type: "module",
        enabled: true,
        scope: "tenant",
        tenantId: TENANT_ID,
        companyId: null,
        environment: null,
        metadata: { source: "provision" },
      },
    ]);
    expect(mapped.usageLimits).toEqual([
      {
        key: "users.max",
        scope: "tenant",
        period: "instant",
        maximum: 50,
        used: 3,
        unit: "users",
      },
    ]);
  });
});
