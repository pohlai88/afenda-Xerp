import { describe, expect, it } from "vitest";

import {
  toMembershipContract,
  toPermissionKeys,
  toPlatformUserContract,
  toPolicyContract,
  toRoleContract,
  toTenantContract,
} from "../database/contract-mappers";
import { PERMISSION_REGISTRY } from "../permission.contract";

describe("database contract mappers", () => {
  it("maps membership rows to authorization contracts", () => {
    expect(
      toMembershipContract({
        id: "membership-001",
        tenantId: "tenant-001",
        companyId: "company-001",
        organizationId: null,
        userId: "user-001",
        roleId: "role-001",
        scopeType: "company",
        status: "active",
      })
    ).toEqual({
      id: "membership-001",
      tenantId: "tenant-001",
      companyId: "company-001",
      organizationId: null,
      userId: "user-001",
      roleId: "role-001",
      scopeType: "company",
      status: "active",
    });
  });

  it("maps role, tenant, and user rows to authorization contracts", () => {
    expect(
      toRoleContract({
        id: "role-001",
        tenantId: "tenant-001",
        key: "tenant.admin",
        name: "Tenant Admin",
        description: null,
        scope: "tenant",
        status: "active",
      })
    ).toMatchObject({ key: "tenant.admin", scope: "tenant" });

    expect(
      toTenantContract({
        id: "tenant-001",
        slug: "acme",
        name: "Acme",
        status: "active",
      })
    ).toMatchObject({ slug: "acme" });

    expect(
      toPlatformUserContract({
        id: "user-001",
        email: "actor@example.com",
        displayName: "Actor",
        status: "active",
      })
    ).toMatchObject({ email: "actor@example.com" });
  });

  it("parses policy rows and permission keys at the boundary", () => {
    const policy = toPolicyContract({
      id: "policy-001",
      tenantId: "tenant-001",
      key: "approval.journal.read",
      name: "Journal read approval",
      description: null,
      scope: "tenant",
      effect: "allow",
      priority: 100,
      condition: {
        version: 1,
        match: {
          permissionKey: PERMISSION_REGISTRY.accounting.journal.read,
        },
        gateDecision: "require_approval",
      },
      status: "active",
    });

    expect(policy.condition.gateDecision).toBe("require_approval");
    expect(
      toPermissionKeys([{ key: PERMISSION_REGISTRY.systemAdmin.users.manage }])
    ).toEqual([PERMISSION_REGISTRY.systemAdmin.users.manage]);
  });
});
