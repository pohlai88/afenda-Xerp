import { describe, expect, it } from "vitest";
import {
  resolveFeatureFlag,
  resolveFeatureFlagStrict,
} from "../flags/feature-flag-engine";
import { FEATURE_FLAG_FAIL_OPEN_DEFAULT } from "../flags/feature-flag-policy";

describe("feature flag fail-open policy", () => {
  const context = {
    tenantId: "tenant_a",
    companyId: "company_a",
    environment: "production" as const,
  };

  it("documents fail-open default for missing flags", () => {
    expect(FEATURE_FLAG_FAIL_OPEN_DEFAULT).toBe(true);
  });

  it("resolveFeatureFlag fails open when flag is missing", () => {
    expect(resolveFeatureFlag("missing_flag", [], context)).toEqual({
      key: "missing_flag",
      enabled: true,
      flag: null,
    });
  });

  it("resolveFeatureFlagStrict fails closed when flag is missing", () => {
    expect(resolveFeatureFlagStrict("missing_flag", [], context)).toEqual({
      key: "missing_flag",
      enabled: false,
      flag: null,
    });
  });
});
