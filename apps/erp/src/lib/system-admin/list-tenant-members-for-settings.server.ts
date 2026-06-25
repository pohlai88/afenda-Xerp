import type { AppShellAccountSettings05MemberRow } from "@afenda/appshell";

import { listCompanyMembersForScope } from "@/server/system-admin/list-company-members.server";

function isAdminRoleKey(roleKey: string): boolean {
  return roleKey.endsWith(".admin") || roleKey === "platform.system.admin";
}

export async function listTenantMembersForSettings(input: {
  readonly companyId: string;
  readonly tenantId: string;
}): Promise<readonly AppShellAccountSettings05MemberRow[]> {
  const memberRows = await listCompanyMembersForScope(input);

  return memberRows.map(
    (member): AppShellAccountSettings05MemberRow => ({
      email: member.email,
      id: member.membershipId,
      isAdmin: isAdminRoleKey(member.roleKey),
      name: member.displayName,
      role: member.roleId,
    })
  );
}
