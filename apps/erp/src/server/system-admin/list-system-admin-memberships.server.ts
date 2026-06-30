import type { CompanyMemberListRow } from "@afenda/database";

import type { SystemAdminMembershipRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

import { listCompanyMembersForScope } from "./list-company-members.server";

function toMembershipRowDto(
  row: CompanyMemberListRow
): SystemAdminMembershipRowDto {
  return {
    displayName: row.displayName,
    email: row.email,
    membershipId: row.membershipId,
    membershipStatus: row.membershipStatus,
    roleId: row.roleId,
    roleKey: row.roleKey,
    roleName: row.roleName,
    userId: row.userId,
  };
}

export async function listSystemAdminMemberships(input: {
  readonly companyId: string;
  readonly tenantId: string;
}): Promise<{ readonly memberships: readonly SystemAdminMembershipRowDto[] }> {
  const rows = await listCompanyMembersForScope({
    companyId: input.companyId,
    tenantId: input.tenantId,
  });

  return {
    memberships: rows.map(toMembershipRowDto),
  };
}
