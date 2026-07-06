import type { SystemAdminRoleTableRow } from "@/lib/presentation/system-admin-role-table-row";
import type { SystemAdminRoleRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

function mapRoleStatus(status: string): SystemAdminRoleTableRow["status"] {
  const normalized = status.toLowerCase();

  if (normalized === "inactive" || normalized === "disabled") {
    return "inactive";
  }

  if (normalized === "pending") {
    return "pending";
  }

  return "active";
}

export function mapRoleWireToTableRow(
  role: SystemAdminRoleRowDto
): SystemAdminRoleTableRow {
  return {
    id: role.id,
    key: role.key,
    name: role.name,
    scope: role.scope,
    status: mapRoleStatus(role.status),
  };
}
