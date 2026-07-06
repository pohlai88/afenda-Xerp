import type { SystemAdminPermissionTableRow } from "@/lib/presentation/system-admin-permission-table-row";
import type { SystemAdminPermissionRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export function mapPermissionWireToTableRow(
  permission: SystemAdminPermissionRowDto
): SystemAdminPermissionTableRow {
  return {
    action: permission.action,
    domain: permission.domain,
    id: permission.id,
    key: permission.key,
    name: permission.name,
  };
}
