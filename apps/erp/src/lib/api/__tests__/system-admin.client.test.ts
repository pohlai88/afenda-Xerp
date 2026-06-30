import { describe, expect, it, vi } from "vitest";

import {
  INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIP_ROLE_ASSIGNMENTS_PATH,
  INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_PATH,
} from "../internal-v1-system-admin-routes";
import {
  createSystemAdminMembershipRoleAssignment,
  createSystemAdminUserInvitation,
} from "../system-admin.client";

const scope = {
  companyId: "company-1",
  companySlug: "acme",
  organizationId: "org-1",
  organizationSlug: "hq",
  tenantSlug: "acme",
  workspaceId: "workspace-1",
};

describe("system-admin.client", () => {
  it("posts user invitations to the canonical route", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { membershipId: "m-1", userId: "u-1" },
          meta: { correlationId: "c-1", requestId: "r-1", timestamp: "t" },
          ok: true,
        }),
        { status: 201 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await createSystemAdminUserInvitation(scope, {
      displayName: "Jordan Lee",
      email: "jordan@example.com",
      roleId: "role-1",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_PATH,
      expect.objectContaining({ method: "POST" })
    );
    expect(result).toEqual({ membershipId: "m-1", userId: "u-1" });

    vi.unstubAllGlobals();
  });

  it("posts membership role assignments to the canonical route", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { membershipId: "m-1", roleId: "role-2" },
          meta: { correlationId: "c-1", requestId: "r-1", timestamp: "t" },
          ok: true,
        }),
        { status: 201 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await createSystemAdminMembershipRoleAssignment(scope, {
      companyId: "company-1",
      membershipId: "m-1",
      roleId: "role-2",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIP_ROLE_ASSIGNMENTS_PATH,
      expect.objectContaining({ method: "POST" })
    );
    expect(result).toEqual({ membershipId: "m-1", roleId: "role-2" });

    vi.unstubAllGlobals();
  });
});
