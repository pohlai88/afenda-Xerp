import { describe, expect, it } from "vitest";

import {
  checkPermission,
  isMembershipActive,
  type MembershipContract,
  membershipMatchesGrantScope,
  PERMISSION_REGISTRY,
  PERMISSIONS_SCOPE_GRANTS_MODULES,
  type RoleScope,
  requirePermission,
  resolvePermissionScopeContext,
  resolveScopedMembership,
} from "../index.js";

describe("@afenda/permissions root export backward compatibility", () => {
  it("preserves registry and enforcement entry points", () => {
    expect(typeof PERMISSION_REGISTRY).toBe("object");
    expect(typeof checkPermission).toBe("function");
    expect(typeof requirePermission).toBe("function");
    expect(typeof resolveScopedMembership).toBe("function");
    expect(typeof resolvePermissionScopeContext).toBe("function");
    expect(typeof membershipMatchesGrantScope).toBe("function");
    expect(typeof isMembershipActive).toBe("function");
  });

  it("preserves scope/grants surface registry on root barrel", () => {
    expect(
      PERMISSIONS_SCOPE_GRANTS_MODULES.map((module) => module.directory)
    ).toEqual(["scope", "grants"]);
  });

  it("preserves serializable membership and role scope types", () => {
    const membership: MembershipContract = {
      id: "membership-001",
      tenantId: "tenant-001",
      companyId: "company-001",
      entityGroupId: null,
      organizationId: null,
      projectId: null,
      teamId: null,
      roleId: "role-001",
      scopeType: "company",
      status: "active",
      userId: "user-001",
    };

    const roleScope: RoleScope = "company";

    expect(JSON.parse(JSON.stringify({ membership, roleScope }))).toEqual({
      membership,
      roleScope,
    });
  });
});
