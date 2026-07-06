import type { SystemAdminMembershipTableRow } from "@/lib/presentation/system-admin-membership-table-row";
import type { SystemAdminUserTableRole } from "@/lib/presentation/system-admin-user-table-row";
import type { SystemAdminMembershipRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

const TABLE_ROLES = [
  "admin",
  "author",
  "editor",
  "maintainer",
  "subscriber",
] as const satisfies readonly SystemAdminUserTableRole[];

function isTableRole(value: string): value is SystemAdminUserTableRole {
  return (TABLE_ROLES as readonly string[]).includes(value);
}

function mapMembershipRole(value: string): SystemAdminUserTableRole {
  const normalized = value.toLowerCase();

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

function normalizeStatus(value: string): SystemAdminMembershipTableRow["status"] {
  const status = value.toLowerCase();

  if (status === "inactive" || status === "revoked") {
    return "inactive";
  }

  if (status === "pending") {
    return "pending";
  }

  return "active";
}

function mapMembershipProfileText(value: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    return "Membership";
  }

  return normalized;
}

export function mapMembershipWireToTableRow(
  membership: SystemAdminMembershipRowDto
): SystemAdminMembershipTableRow {
  const normalizedKey = membership.roleKey.trim().toLowerCase();
  const role = isTableRole(normalizedKey)
    ? normalizedKey
    : mapMembershipRole(membership.roleName);

  return {
    email: membership.email,
    id: membership.membershipId,
    role,
    status: normalizeStatus(membership.membershipStatus),
    user: mapMembershipProfileText(membership.displayName),
  };
}
