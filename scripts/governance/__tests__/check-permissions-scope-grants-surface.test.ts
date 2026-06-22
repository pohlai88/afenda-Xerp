import { describe, expect, it } from "vitest";

import { checkPermissionsScopeGrantsSurface } from "../check-permissions-scope-grants-surface.mts";

describe("check-permissions-scope-grants-surface script", () => {
  it("passes on the current repository state", () => {
    expect(checkPermissionsScopeGrantsSurface()).toEqual([]);
  });
});
