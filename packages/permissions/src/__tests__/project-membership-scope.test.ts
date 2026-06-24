import { describe, expect, it } from "vitest";

import {
  type MembershipContract,
  resolvePermissionScopeContext,
  selectNarrowestMatchingMembership,
} from "../scope/index.js";

const TENANT_ID = "tenant-001";
const PROJECT_A = "project-a";
const PROJECT_B = "project-b";
const COMPANY_A = "company-a";
const ORG_A = "org-a";
const ROLE_ID = "role-001";

function projectMembership(projectId: string): MembershipContract {
  return {
    id: "membership-project",
    tenantId: TENANT_ID,
    userId: "user-1",
    roleId: ROLE_ID,
    scopeType: "project",
    status: "active",
    projectId,
    entityGroupId: null,
    companyId: null,
    organizationId: null,
    teamId: null,
  };
}

describe("project membership scope", () => {
  it("selects project membership when project boundary matches", () => {
    const selected = selectNarrowestMatchingMembership(
      [projectMembership(PROJECT_A)],
      {
        projectId: PROJECT_A,
        companyId: COMPANY_A,
        organizationId: ORG_A,
      }
    );

    expect(selected?.scopeType).toBe("project");
  });

  it("denies project membership when project boundary mismatches", () => {
    const selected = selectNarrowestMatchingMembership(
      [projectMembership(PROJECT_A)],
      {
        projectId: PROJECT_B,
        companyId: COMPANY_A,
        organizationId: null,
      }
    );

    expect(selected).toBeNull();
  });

  it("prefers project membership over organization when both match", () => {
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
      [orgMembership, projectMembership(PROJECT_A)],
      {
        projectId: PROJECT_A,
        companyId: COMPANY_A,
        organizationId: ORG_A,
      }
    );

    expect(selected?.scopeType).toBe("project");
  });

  it("resolves permission scope with project grant type", () => {
    const permissionScope = resolvePermissionScopeContext({
      companyId: COMPANY_A,
      membership: projectMembership(PROJECT_A),
      organizationId: ORG_A,
      projectId: PROJECT_A,
      roleScope: "tenant",
      teamId: null,
    });

    expect(permissionScope.grantScopeType).toBe("project");
    expect(permissionScope.projectId).toBe(PROJECT_A);
    expect(permissionScope.companyId).toBe(COMPANY_A);
  });
});
