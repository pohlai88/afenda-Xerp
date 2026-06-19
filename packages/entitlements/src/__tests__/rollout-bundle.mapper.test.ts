import type { PlatformRolloutBundle } from "@afenda/database";
import { describe, expect, it } from "vitest";
import { mapPlatformRolloutToEvaluationData } from "../provisioning/rollout-bundle.mapper";

describe("mapPlatformRolloutToEvaluationData", () => {
  it("maps rollout rows into evaluation contracts", () => {
    const bundle: PlatformRolloutBundle = {
      loadedAt: "2026-06-20T00:00:00.000Z",
      featureFlags: [
        {
          key: "e_invoice",
          enabled: true,
          rollout: "on",
          environments: ["production", "invalid-env"],
          tenantAllowlist: [],
          companyAllowlist: [],
          killSwitchKey: "feature.e_invoice.kill_switch",
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
      ],
    };

    const mapped = mapPlatformRolloutToEvaluationData(bundle);

    expect(mapped.featureFlags).toEqual([
      {
        key: "e_invoice",
        enabled: true,
        rollout: "on",
        environments: ["production"],
        tenantAllowlist: [],
        companyAllowlist: [],
        killSwitchKey: "feature.e_invoice.kill_switch",
        metadata: {},
      },
    ]);
    expect(mapped.killSwitches[0]?.severity).toBe("critical");
  });
});
