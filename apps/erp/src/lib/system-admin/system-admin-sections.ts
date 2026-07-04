import { PERMISSION_REGISTRY } from "@afenda/permissions";

import { SYSTEM_ADMIN_NAV_LABELS } from "../navigation/operator-nav-label.registry";

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
    label: SYSTEM_ADMIN_NAV_LABELS.users.label,
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
    sectionId: "users",
  },
  {
    href: "/system-admin/memberships",
    label: SYSTEM_ADMIN_NAV_LABELS.memberships.label,
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
    sectionId: "memberships",
  },
  {
    href: "/system-admin/roles",
    label: SYSTEM_ADMIN_NAV_LABELS.roles.label,
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.roles.manage,
    sectionId: "roles",
  },
  {
    href: "/system-admin/permissions",
    label: SYSTEM_ADMIN_NAV_LABELS.permissions.label,
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.permissions.manage,
    sectionId: "permissions",
  },
  {
    href: "/system-admin/audit",
    label: SYSTEM_ADMIN_NAV_LABELS.audit.label,
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
    sectionId: "audit",
  },
  {
    href: "/system-admin/settings",
    label: SYSTEM_ADMIN_NAV_LABELS.settings.label,
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.modules.manage,
    sectionId: "settings",
  },
  {
    href: "/system-admin/diagnostics",
    label: SYSTEM_ADMIN_NAV_LABELS.diagnostics.label,
    readPermissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
    sectionId: "diagnostics",
  },
] as const satisfies readonly SystemAdminSectionDefinition[];
