import { beforeEach, describe, expect, it, vi } from "vitest";

const insertUserMock = vi.hoisted(() => vi.fn());
const insertMembershipMock = vi.hoisted(() => vi.fn());
const syncAuthMirrorUserMock = vi.hoisted(() => vi.fn());
const registerAuthInvitationMock = vi.hoisted(() => vi.fn());

vi.mock("@afenda/database", () => ({
  insertMembership: insertMembershipMock,
  insertUser: insertUserMock,
}));

vi.mock("@afenda/auth", () => ({
  registerAuthInvitation: registerAuthInvitationMock,
  syncAuthMirrorUser: syncAuthMirrorUserMock,
}));

import { inviteCompanyUser } from "@/server/system-admin/invite-company-user.server";

describe("inviteCompanyUser", () => {
  beforeEach(() => {
    insertUserMock.mockReset();
    insertMembershipMock.mockReset();
    syncAuthMirrorUserMock.mockReset();
    registerAuthInvitationMock.mockReset();

    insertUserMock.mockResolvedValue({ id: "user-001" });
    insertMembershipMock.mockResolvedValue({ id: "membership-001" });
    syncAuthMirrorUserMock.mockResolvedValue({
      authUserId: "auth-user-001",
      createdAuthUser: true,
      createdIdentityLink: true,
      updatedAuthUser: false,
    });
  });

  it("provisions platform user, membership, mirror sync, and auth invitation", async () => {
    const result = await inviteCompanyUser({
      actorUserId: "actor-001",
      companyId: "company-001",
      correlationId: "corr-001",
      displayName: "Pending User",
      email: "pending@example.com",
      roleId: "role-member",
      tenantId: "tenant-001",
    });

    expect(result).toEqual({
      membershipId: "membership-001",
      userId: "user-001",
    });
    expect(syncAuthMirrorUserMock).toHaveBeenCalledWith({
      displayName: "Pending User",
      email: "pending@example.com",
      userId: "user-001",
    });
    expect(registerAuthInvitationMock).toHaveBeenCalledWith({
      audit: {
        correlationId: "corr-001",
        email: "pending@example.com",
        invitationId: "membership-001",
        platformUserId: "actor-001",
        tenantId: "tenant-001",
      },
      email: "pending@example.com",
      invitationId: "membership-001",
      platformUserId: "user-001",
      tenantId: "tenant-001",
    });
  });
});
