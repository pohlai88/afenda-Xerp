import type { CompanyMemberListRow } from "@afenda/database";
import type { SystemAdminUserRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";
import { listCompanyMembersForScope } from "@/server/system-admin/list-company-members.server";

function toUserRowDto(row: CompanyMemberListRow): SystemAdminUserRowDto {
  return {
    displayName: row.displayName,
    email: row.email,
    membershipId: row.membershipId,
    membershipStatus: row.membershipStatus,
    roleId: row.roleId,
    roleKey: row.roleKey,
    roleName: row.roleName,
    userId: row.userId,
    userStatus: row.userStatus,
  };
}

export async function listSystemAdminUsers(input: {
  readonly companyId: string;
  readonly tenantId: string;
}): Promise<{ readonly users: readonly SystemAdminUserRowDto[] }> {
  const rows = await listCompanyMembersForScope({
    companyId: input.companyId,
    tenantId: input.tenantId,
  });

  return {
    users: rows.map(toUserRowDto),
  };
}
