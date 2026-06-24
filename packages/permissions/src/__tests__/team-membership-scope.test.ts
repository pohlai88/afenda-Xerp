import { describe, expect, it } from "vitest";

import {
  type MembershipContract,
  resolvePermissionScopeContext,
  selectNarrowestMatchingMembership,
} from "../scope/index.js";

const TENANT_ID = "tenant-001";
const TEAM_A = "team-a";
const TEAM_B = "team-b";
const COMPANY_A = "company-a";
const ORG_A = "org-a";
const ROLE_ID = "role-001";

function teamMembership(teamId: string): MembershipContract {
  return {
    id: "membership-team",
    tenantId: TENANT_ID,
    userId: "user-1",
    roleId: ROLE_ID,
    scopeType: "team",
    status: "active",
    teamId,
    entityGroupId: null,
    companyId: null,
    organizationId: null,
    projectId: null,
  };
}

describe("team membership scope", () => {
  it("selects team membership when team boundary matches", () => {
    const selected = selectNarrowestMatchingMembership(
      [teamMembership(TEAM_A)],
      {
        teamId: TEAM_A,
        companyId: COMPANY_A,
        organizationId: ORG_A,
      }
    );

    expect(selected?.scopeType).toBe("team");
  });

  it("denies team membership when team boundary mismatches", () => {
    const selected = selectNarrowestMatchingMembership(
      [teamMembership(TEAM_A)],
      {
        teamId: TEAM_B,
        companyId: COMPANY_A,
        organizationId: null,
      }
    );

    expect(selected).toBeNull();
  });

  it("prefers team membership over organization when both match", () => {
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
      [orgMembership, teamMembership(TEAM_A)],
      {
        teamId: TEAM_A,
        companyId: COMPANY_A,
        organizationId: ORG_A,
      }
    );

    expect(selected?.scopeType).toBe("team");
  });

  it("resolves permission scope with team grant type", () => {
    const permissionScope = resolvePermissionScopeContext({
      companyId: COMPANY_A,
      membership: teamMembership(TEAM_A),
      organizationId: ORG_A,
      projectId: null,
      roleScope: "tenant",
      teamId: TEAM_A,
    });

    expect(permissionScope.grantScopeType).toBe("team");
    expect(permissionScope.teamId).toBe(TEAM_A);
    expect(permissionScope.companyId).toBe(COMPANY_A);
  });
});
