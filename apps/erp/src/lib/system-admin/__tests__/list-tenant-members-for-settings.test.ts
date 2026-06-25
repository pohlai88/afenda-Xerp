import { beforeEach, describe, expect, it, vi } from "vitest";

const listCompanyMembersForScopeMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/system-admin/list-company-members.server", () => ({
  listCompanyMembersForScope: listCompanyMembersForScopeMock,
}));

import { listTenantMembersForSettings } from "../list-tenant-members-for-settings.server";

describe("listTenantMembersForSettings", () => {
  beforeEach(() => {
    listCompanyMembersForScopeMock.mockReset();
  });

  it("maps company members into AppShell member rows with admin detection", async () => {
    listCompanyMembersForScopeMock.mockResolvedValue([
      {
        displayName: "Alex Admin",
        email: "alex@example.com",
        membershipId: "membership-001",
        membershipStatus: "active",
        roleId: "role-admin",
        roleKey: "platform.company.admin",
        roleName: "Company Admin",
        userId: "user-001",
        userStatus: "active",
      },
      {
        displayName: "Member User",
        email: "member@example.com",
        membershipId: "membership-002",
        membershipStatus: "active",
        roleId: "role-member",
        roleKey: "platform.company.member",
        roleName: "Member",
        userId: "user-002",
        userStatus: "active",
      },
    ]);

    const rows = await listTenantMembersForSettings({
      companyId: "company-001",
      tenantId: "tenant-001",
    });

    expect(listCompanyMembersForScopeMock).toHaveBeenCalledWith({
      companyId: "company-001",
      tenantId: "tenant-001",
    });
    expect(rows).toEqual([
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
  });
});
