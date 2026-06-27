import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import type {
  assertPermissionScopeContextJsonSerializable,
  PermissionScopeContext,
} from "../permission-scope-context.contract.js";

type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

type _PermissionScopeJsonGuard = assertPermissionScopeContextJsonSerializable;
type _AssertPermissionScopeJsonGuard = AssertEqual<
  _PermissionScopeJsonGuard,
  true
>;

describe("@afenda/permissions permission scope context (K5)", () => {
  it("accepts a JSON-serializable resolved scope sample", () => {
    const scope: PermissionScopeContext = {
      grantScopeType: "company",
      tenantId: "tenant-1",
      entityGroupId: null,
      companyId: "company-1",
      organizationId: null,
      teamId: null,
      projectId: null,
      membershipId: "membership-1",
      roleId: "role-1",
      elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
    };

    expect(scope.membershipId).toBe("membership-1");
    expect(JSON.parse(JSON.stringify(scope))).toEqual(scope);
  });
});
