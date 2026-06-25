import { beforeEach, describe, expect, it, vi } from "vitest";

const listTenantMembersMock = vi.hoisted(() => vi.fn());
const listPendingInvitesMock = vi.hoisted(() => vi.fn());
const findMembershipByIdMock = vi.hoisted(() => vi.fn());

vi.mock("../list-tenant-members-for-settings.server", () => ({
  listTenantMembersForSettings: listTenantMembersMock,
}));

vi.mock("@afenda/auth", () => ({
  listPendingAuthInvitationsForTenant: listPendingInvitesMock,
}));

vi.mock("@afenda/database", () => ({
  findMembershipById: findMembershipByIdMock,
}));

import { resolveMembersSettings } from "../resolve-members-settings.server";

describe("resolveMembersSettings", () => {
  beforeEach(() => {
    listTenantMembersMock.mockReset();
    listPendingInvitesMock.mockReset();
    findMembershipByIdMock.mockReset();
  });

  it("maps live members and pending invites into settings view model rows", async () => {
    listTenantMembersMock.mockResolvedValue([
      {
        email: "alex@example.com",
        id: "membership-001",
        isAdmin: true,
        name: "Alex Admin",
        role: "role-admin",
      },
      {
        email: "member@example.com",
        id: "membership-002",
        isAdmin: false,
        name: "Member User",
        role: "role-member",
      },
    ]);
    listPendingInvitesMock.mockReturnValue([
      {
        email: "pending@example.com",
        invitationId: "membership-pending-001",
      },
    ]);
    findMembershipByIdMock.mockResolvedValue({
      companyId: "company-001",
      id: "membership-pending-001",
      roleId: "role-member",
      tenantId: "tenant-001",
      userId: "user-pending-001",
    });

    const viewModel = await resolveMembersSettings({
      companyId: "company-001",
      tenantId: "tenant-001",
    });

    expect(listTenantMembersMock).toHaveBeenCalledWith({
      companyId: "company-001",
      tenantId: "tenant-001",
    });
    expect(viewModel.members).toEqual([
      {
        email: "alex@example.com",
        id: "membership-001",
        isAdmin: true,
        name: "Alex Admin",
        role: "role-admin",
      },
      {
        email: "member@example.com",
        id: "membership-002",
        isAdmin: false,
        name: "Member User",
        role: "role-member",
      },
    ]);
    expect(viewModel.pendingInvites).toEqual([
      {
        email: "pending@example.com",
        id: "membership-pending-001",
        name: "pending",
        role: "role-member",
      },
    ]);
  });
});
