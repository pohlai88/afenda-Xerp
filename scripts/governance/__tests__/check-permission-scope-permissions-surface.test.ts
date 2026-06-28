import { describe, expect, it } from "vitest";

import { checkPermissionScopePermissionsSurface } from "../check-permission-scope-permissions-surface.mts";

describe("check-permission-scope-permissions-surface script", () => {
  it("passes on the current repository state", () => {
    expect(checkPermissionScopePermissionsSurface()).toEqual([]);
  });
});
