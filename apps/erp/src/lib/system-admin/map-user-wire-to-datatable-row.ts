import type { SystemAdminUserTableRow } from "@/lib/presentation/system-admin-user-table-row";
import type { SystemAdminUserRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

const TABLE_ROLES = [
  "admin",
  "author",
  "editor",
  "maintainer",
  "subscriber",
] as const satisfies readonly SystemAdminUserTableRow["role"][];

function isTableRole(
  value: string
): value is SystemAdminUserTableRow["role"] {
  return (TABLE_ROLES as readonly string[]).includes(value);
}

function mapRoleKey(roleKey: string): SystemAdminUserTableRow["role"] {
  const normalized = roleKey.trim().toLowerCase();

  if (isTableRole(normalized)) {
    return normalized;
  }

  if (normalized.includes("admin")) {
    return "admin";
  }

  if (normalized.includes("editor")) {
    return "editor";
  }

  if (normalized.includes("maintainer")) {
    return "maintainer";
  }

  if (normalized.includes("author")) {
    return "author";
  }

  return "subscriber";
}

function mapMembershipStatus(
  membershipStatus: string,
  userStatus: string
): SystemAdminUserTableRow["status"] {
  if (membershipStatus === "pending" || userStatus === "pending") {
    return "pending";
  }

  if (membershipStatus === "active" && userStatus === "active") {
    return "active";
  }

  return "inactive";
}

export function mapUserWireToDatatableRow(
  row: SystemAdminUserRowDto
): SystemAdminUserTableRow {
  return {
    email: row.email,
    id: row.userId,
    role: mapRoleKey(row.roleKey),
    status: mapMembershipStatus(row.membershipStatus, row.userStatus),
    user: row.displayName,
  };
}
