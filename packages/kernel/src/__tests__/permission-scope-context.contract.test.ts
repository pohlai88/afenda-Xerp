import { describe, expect, it } from "vitest";

import {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isPermissionGrantScopeType,
  PERMISSION_GRANT_SCOPE_TYPES,
} from "../context/permission-grant-vocabulary.contract.js";
import type {
  assertPermissionScopeContextJsonSerializable,
  PermissionScopeContext,
} from "../context/permission-scope-context.contract.js";

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

describe("@afenda/kernel permission scope contracts (Slice 8)", () => {
  it("keeps grant scope vocabulary separate from resolved scope shape", () => {
    expect(PERMISSION_GRANT_SCOPE_TYPES).toContain("tenant");
    expect(PERMISSION_GRANT_SCOPE_TYPES).toContain("consolidation_view");
    expect(isPermissionGrantScopeType("company")).toBe(true);
    expect(isPermissionGrantScopeType("invalid")).toBe(false);
  });

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
