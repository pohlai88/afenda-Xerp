import { describe, expect, it } from "vitest";

import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import { DEV_WORKSPACE_API_SCOPE } from "@/lib/workspace/dev-workspace-scope";

import { buildWorkspaceScopeHeaders } from "../api-scope-headers.client";

describe("buildWorkspaceScopeHeaders", () => {
  it("sends tenant slug for server operating-context resolution", () => {
    expect(buildWorkspaceScopeHeaders(DEV_WORKSPACE_API_SCOPE)).toEqual({
      [TENANT_SLUG_HEADER]: "dev-local",
      "x-afenda-company-slug": "dev-company",
      "x-afenda-organization-slug": "dev-hq",
    });
  });
});
