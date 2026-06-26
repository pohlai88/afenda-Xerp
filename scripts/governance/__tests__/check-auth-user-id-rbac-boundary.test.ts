import { describe, expect, it } from "vitest";

import { checkAuthUserIdRbacBoundary } from "../check-auth-user-id-rbac-boundary.mts";

describe("check-auth-user-id-rbac-boundary script", () => {
  it("passes on the current repository state", () => {
    expect(checkAuthUserIdRbacBoundary()).toEqual([]);
  });
});
