import {
  PERMISSION_REGISTRY,
  type RegisteredPermissionKey,
} from "@afenda/permissions";

export type SystemAdminSectionId =
  | "users"
  | "memberships"
  | "roles"
  | "permissions"
  | "audit"
  | "settings";

export interface SystemAdminSectionDefinition {
  readonly href: `/system-admin/${SystemAdminSectionId}`;
  readonly label: string;
  readonly readPermissionKey: RegisteredPermissionKey;
  readonly sectionId: SystemAdminSectionId;
}

export const SYSTEM_ADMIN_SECTIONS: readonly SystemAdminSectionDefinition[] = [
  {
    sectionId: "users",
    label: "Users",
    href: "/system-admin/users",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
  },
  {
    sectionId: "memberships",
    label: "Memberships",
    href: "/system-admin/memberships",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
  },
  {
    sectionId: "roles",
    label: "Roles",
    href: "/system-admin/roles",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.roles.manage,
  },
  {
    sectionId: "permissions",
    label: "Permissions",
    href: "/system-admin/permissions",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.permissions.manage,
  },
  {
    sectionId: "audit",
    label: "Audit",
    href: "/system-admin/audit",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
  },
  {
    sectionId: "settings",
    label: "Settings",
    href: "/system-admin/settings",
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.modules.manage,
  },
] satisfies readonly SystemAdminSectionDefinition[];

const systemAdminSectionIdLookup = new Set<string>(
  SYSTEM_ADMIN_SECTIONS.map((section) => section.sectionId)
);

export function isSystemAdminSectionId(
  value: string
): value is SystemAdminSectionId {
  return systemAdminSectionIdLookup.has(value);
}

export function getSystemAdminSection(
  sectionId: string
): SystemAdminSectionDefinition | undefined {
  if (!isSystemAdminSectionId(sectionId)) {
    return;
  }

  return SYSTEM_ADMIN_SECTIONS.find(
    (section) => section.sectionId === sectionId
  );
}
