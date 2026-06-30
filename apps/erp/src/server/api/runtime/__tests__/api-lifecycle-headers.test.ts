import { describe, expect, it } from "vitest";

import { systemAdminMembershipRolePostContract } from "@/server/api/contracts/system-admin/system-admin.contract";

import { buildDeprecatedRouteLifecycleHeaders } from "../api-lifecycle-headers";

describe("api-lifecycle-headers", () => {
  it("emits Deprecation, Sunset, and successor Link for deprecated routes", () => {
    const headers = buildDeprecatedRouteLifecycleHeaders(
      systemAdminMembershipRolePostContract
    );

    expect(headers.Deprecation).toBe("true");
    expect(headers.Sunset).toBe("Wed, 30 Jun 2027 23:59:59 GMT");
    expect(headers.Link).toBe(
      '</api/internal/v1/system-admin/membership-role-assignments>; rel="successor-version"'
    );
  });

  it("returns no headers for active routes", () => {
    expect(
      buildDeprecatedRouteLifecycleHeaders({
        lifecycle: "active",
      })
    ).toEqual({});
  });
});
