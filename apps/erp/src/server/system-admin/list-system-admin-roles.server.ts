import { listTenantRoles, type TenantRoleListRow } from "@afenda/database";

import type { SystemAdminRoleRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

function toRoleRowDto(row: TenantRoleListRow): SystemAdminRoleRowDto {
  return {
    description: row.description,
    id: row.id,
    key: row.key,
    name: row.name,
    scope: row.scope,
    status: row.status,
    tenantId: row.tenantId,
  };
}

export async function listSystemAdminRoles(input: {
  readonly tenantId: string;
}): Promise<{ readonly roles: readonly SystemAdminRoleRowDto[] }> {
  const rows = await listTenantRoles({ tenantId: input.tenantId });

  return {
    roles: rows.map(toRoleRowDto),
  };
}
