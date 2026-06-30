import type { DatatableUserRow } from "@afenda/shadcn-studio";

import type { SystemAdminUserRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

const DATATABLE_ROLES = [
  "admin",
  "author",
  "editor",
  "maintainer",
  "subscriber",
] as const satisfies readonly DatatableUserRow["role"][];

function isDatatableRole(value: string): value is DatatableUserRow["role"] {
  return (DATATABLE_ROLES as readonly string[]).includes(value);
}

function mapRoleKey(roleKey: string): DatatableUserRow["role"] {
  const normalized = roleKey.trim().toLowerCase();

  if (isDatatableRole(normalized)) {
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
): DatatableUserRow["status"] {
  if (membershipStatus === "pending" || userStatus === "pending") {
    return "pending";
  }

  if (membershipStatus === "active" && userStatus === "active") {
    return "active";
  }

  return "inactive";
}

function buildAvatarFallback(displayName: string): string {
  const parts = displayName
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length >= 2) {
    const first = parts[0]?.at(0) ?? "";
    const second = parts[1]?.at(0) ?? "";
    return `${first}${second}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}

export function mapUserWireToDatatableRow(
  row: SystemAdminUserRowDto
): DatatableUserRow {
  return {
    id: row.userId,
    avatar: "",
    fallback: buildAvatarFallback(row.displayName),
    user: row.displayName,
    email: row.email,
    role: mapRoleKey(row.roleKey),
    plan: "team",
    billing: "auto-debit",
    status: mapMembershipStatus(row.membershipStatus, row.userStatus),
  };
}
