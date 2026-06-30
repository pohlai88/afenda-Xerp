import {
  listPermissionCatalog,
  type PermissionCatalogListRow,
} from "@afenda/database";

import type { SystemAdminPermissionRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

function toPermissionRowDto(
  row: PermissionCatalogListRow
): SystemAdminPermissionRowDto {
  return {
    action: row.action,
    description: row.description,
    domain: row.domain,
    id: row.id,
    key: row.key,
    name: row.name,
  };
}

export async function listSystemAdminPermissions(): Promise<{
  readonly permissions: readonly SystemAdminPermissionRowDto[];
}> {
  const rows = await listPermissionCatalog();

  return {
    permissions: rows.map(toPermissionRowDto),
  };
}
