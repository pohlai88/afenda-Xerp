import { PERMISSION_REGISTRY } from "@afenda/permissions";

export interface SystemAdminSectionDefinition {
  readonly href: string;
  readonly label: string;
  readonly readPermissionKey: string;
  readonly sectionId: string;
}

/** Canonical System Admin navigation sections — exported for docs catalog sync. */
export const SYSTEM_ADMIN_SECTIONS = [
  {
    href: "/system-admin/users",
    label: "Users",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
    sectionId: "users",
  },
  {
    href: "/system-admin/memberships",
    label: "Memberships",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
    sectionId: "memberships",
  },
  {
    href: "/system-admin/roles",
    label: "Roles",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.roles.manage,
    sectionId: "roles",
  },
  {
    href: "/system-admin/permissions",
    label: "Permissions",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.permissions.manage,
    sectionId: "permissions",
  },
  {
    href: "/system-admin/audit",
    label: "Audit",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
    sectionId: "audit",
  },
  {
    href: "/system-admin/settings",
    label: "Settings",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.modules.manage,
    sectionId: "settings",
  },
  {
    href: "/system-admin/diagnostics",
    label: "Diagnostics",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
    sectionId: "diagnostics",
  },
] as const satisfies readonly SystemAdminSectionDefinition[];
