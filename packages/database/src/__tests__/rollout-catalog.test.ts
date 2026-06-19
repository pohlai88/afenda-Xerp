import { describe, expect, it } from "vitest";
import { PLATFORM_FEATURE_FLAG_CATALOG } from "../seeds/platform-rollout.catalog.js";

describe("platform rollout catalog", () => {
  it("registers kill switch keys for every feature flag", () => {
    for (const flag of PLATFORM_FEATURE_FLAG_CATALOG) {
      if (flag.killSwitchKey) {
        expect(flag.killSwitchKey.length).toBeGreaterThan(0);
      }
    }
  });

  it("uses unique feature flag keys", () => {
    const keys = PLATFORM_FEATURE_FLAG_CATALOG.map((entry) => entry.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
