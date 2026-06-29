import { describe, expect, it } from "vitest";

import { mapPlatformLifecycleStatusToTenantSaasLifecyclePhase } from "../map-tenant-saas-lifecycle-phase";

describe("mapPlatformLifecycleStatusToTenantSaasLifecyclePhase", () => {
  it("maps active platform status to active SaaS phase", () => {
    expect(mapPlatformLifecycleStatusToTenantSaasLifecyclePhase("active")).toBe(
      "active"
    );
  });

  it("maps suspended platform status to suspended SaaS phase", () => {
    expect(
      mapPlatformLifecycleStatusToTenantSaasLifecyclePhase("suspended")
    ).toBe("suspended");
  });

  it("maps archived platform status to offboarded SaaS phase", () => {
    expect(
      mapPlatformLifecycleStatusToTenantSaasLifecyclePhase("archived")
    ).toBe("offboarded");
  });
});
