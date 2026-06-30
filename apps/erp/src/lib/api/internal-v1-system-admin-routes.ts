/** Canonical internal v1 system-admin REST paths — consumer SSOT for HTTP clients. */
export const INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_PATH =
  "/api/internal/v1/system-admin/user-invitations" as const;

export const INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIP_ROLE_ASSIGNMENTS_PATH =
  "/api/internal/v1/system-admin/membership-role-assignments" as const;

export const INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_OPERATION_ID =
  "internal.v1.system-admin.user-invitations.post" as const;

export const INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIP_ROLE_ASSIGNMENTS_OPERATION_ID =
  "internal.v1.system-admin.membership-role-assignments.post" as const;

/** @deprecated Sunset 2027-06-30 — use {@link INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_PATH}. */
export const DEPRECATED_INTERNAL_V1_SYSTEM_ADMIN_USERS_INVITE_PATH =
  "/api/internal/v1/system-admin/users/invite" as const;

/** @deprecated Sunset 2027-06-30 — use {@link INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIP_ROLE_ASSIGNMENTS_PATH}. */
export const DEPRECATED_INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIPS_ROLE_PATH =
  "/api/internal/v1/system-admin/memberships/role" as const;
