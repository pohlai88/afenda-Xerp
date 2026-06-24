import { describe, expect, it } from "vitest";

import {
  ACTIVE_ROUTE_PATH_HEADER,
  ORGANIZATION_SLUG_PATH_HINT_HEADER,
  TENANT_SLUG_HEADER,
} from "@/lib/context/context.constants";
import { resolveWorkspacePathRouting } from "@/lib/context/tenant-domain";

describe("tenant path routing headers", () => {
  it("documents header contract for tenant-only subdomain resolution", () => {
    expect(TENANT_SLUG_HEADER).toBe("x-tenant-slug");
    expect(ORGANIZATION_SLUG_PATH_HINT_HEADER).toBe(
      "x-organization-slug-path-hint"
    );
    expect(ACTIVE_ROUTE_PATH_HEADER).toBe("x-active-route-path");
  });

  it("does not treat organization path as tenant authority", () => {
    const routing = resolveWorkspacePathRouting("/o/dev-hq/dashboard");

    expect(routing.tenantSlugFromPath).toBeNull();
    expect(routing.organizationSlugHint).toBe("dev-hq");
    expect(routing.pathname).toBe("/dashboard");
  });
});
