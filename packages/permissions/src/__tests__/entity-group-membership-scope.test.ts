import { describe, expect, it } from "vitest";

import { PERMISSION_REGISTRY } from "../grants/permission.contract.js";
import {
  type MembershipContract,
  resolvePermissionScopeContext,
  resolveScopedMembership,
  selectNarrowestMatchingMembership,
} from "../scope/index.js";

const TENANT_ID = "tenant-001";
const GROUP_A = "group-a";
const GROUP_B = "group-b";
const COMPANY_A = "company-a";
const COMPANY_B = "company-b";
const ORG_A = "org-a";
const ROLE_ID = "role-001";

function entityGroupMembership(entityGroupId: string): MembershipContract {
  return {
    id: "membership-entity-group",
    tenantId: TENANT_ID,
    userId: "user-1",
    roleId: ROLE_ID,
    scopeType: "entity_group",
    status: "active",
    entityGroupId,
    companyId: null,
    organizationId: null,
    projectId: null,
    teamId: null,
  };
}

describe("entity_group membership scope", () => {
  it("selects entity_group membership when legal entity group matches", () => {
    const selected = selectNarrowestMatchingMembership(
      [entityGroupMembership(GROUP_A)],
      {
        entityGroupId: GROUP_A,
        companyId: COMPANY_A,
        organizationId: ORG_A,
      }
    );

    expect(selected?.scopeType).toBe("entity_group");
  });

  it("denies entity_group membership when group boundary mismatches", () => {
    const selected = selectNarrowestMatchingMembership(
      [entityGroupMembership(GROUP_A)],
      {
        entityGroupId: GROUP_B,
        companyId: COMPANY_B,
        organizationId: null,
      }
    );

    expect(selected).toBeNull();
  });

  it("prefers organization membership over entity_group when both match", () => {
    const orgMembership: MembershipContract = {
      id: "membership-org",
      tenantId: TENANT_ID,
      userId: "user-1",
      roleId: ROLE_ID,
      scopeType: "organization",
      status: "active",
      entityGroupId: null,
      companyId: COMPANY_A,
      organizationId: ORG_A,
      projectId: null,
      teamId: null,
    };

    const selected = selectNarrowestMatchingMembership(
      [entityGroupMembership(GROUP_A), orgMembership],
      {
        entityGroupId: GROUP_A,
        companyId: COMPANY_A,
        organizationId: ORG_A,
      }
    );

    expect(selected?.scopeType).toBe("organization");
  });

  it("resolves permission scope with accessed legal entity for entity_group grants", () => {
    const permissionScope = resolvePermissionScopeContext({
      companyId: COMPANY_A,
      entityGroupId: GROUP_A,
      membership: entityGroupMembership(GROUP_A),
      organizationId: ORG_A,
      projectId: null,
      roleScope: "tenant",
      teamId: null,
    });

    expect(permissionScope.grantScopeType).toBe("entity_group");
    expect(permissionScope.entityGroupId).toBe(GROUP_A);
    expect(permissionScope.companyId).toBe(COMPANY_A);
    expect(permissionScope.organizationId).toBe(ORG_A);
  });

  it("denies scoped membership resolution when entity group boundary mismatches", () => {
    const resolution = resolveScopedMembership(
      [entityGroupMembership(GROUP_A)],
      {
        tenantId: TENANT_ID,
        entityGroupId: GROUP_B,
        companyId: COMPANY_B,
      },
      (_code, partial) => ({
        allowed: false as const,
        code: "company_mismatch" as const,
        decision: {
          actorId: "user-1",
          tenantId: TENANT_ID,
          companyId: COMPANY_B,
          entityGroupId: GROUP_B,
          organizationId: null,
          workspaceId: null,
          membershipId: partial.membershipId,
          roleId: partial.roleId,
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          action: "manage",
          targetType: null,
          targetId: null,
          result: partial.result,
          reason: partial.reason,
          correlationId: "corr-001",
          evaluatedAt: new Date().toISOString(),
        },
      })
    );

    expect(resolution.outcome).toBe("denied");
    if (resolution.outcome === "denied") {
      expect(resolution.result.decision.reason).toContain("entity group scope");
    }
  });
});
