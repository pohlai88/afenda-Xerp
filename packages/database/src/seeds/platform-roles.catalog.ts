import type { RoleScope } from "../database.types.js";
import type { PermissionKey } from "../permission-key.contract.js";
import { createPermissionKey } from "../permission-key.contract.js";
import { listPlatformPermissionCatalogKeys } from "./platform-permissions.catalog.js";

export interface PlatformRoleCatalogEntry {
  readonly description: string | null;
  readonly key: string;
  readonly name: string;
  readonly permissionKeys: readonly PermissionKey[];
  readonly scope: RoleScope;
  readonly tenantId: string | null;
}

const ALL_PLATFORM_PERMISSIONS = listPlatformPermissionCatalogKeys();

const SYSTEM_ADMIN_PERMISSIONS = ALL_PLATFORM_PERMISSIONS.filter((key) =>
  key.startsWith("system_admin.")
);

/** Platform-scoped authority templates seeded for every environment. */
export const PLATFORM_ROLE_CATALOG = [
  {
    key: "platform.system.admin",
    name: "Platform System Admin",
    description: "Full platform administration capabilities.",
    scope: "platform",
    tenantId: null,
    permissionKeys: SYSTEM_ADMIN_PERMISSIONS,
  },
] as const satisfies readonly PlatformRoleCatalogEntry[];

export interface TenantRoleCatalogEntry {
  readonly description: string | null;
  readonly key: string;
  readonly name: string;
  readonly permissionKeys: readonly PermissionKey[];
  readonly scope: "tenant";
}

/** Tenant-scoped roles seeded for dev/test/demo workspaces only. */
export const DEV_TENANT_ROLE_CATALOG = [
  {
    key: "tenant.admin",
    name: "Tenant Admin",
    description: "Tenant-wide administration for development workspaces.",
    scope: "tenant",
    permissionKeys: ALL_PLATFORM_PERMISSIONS,
  },
  {
    key: "tenant.workspace_reader",
    name: "Workspace Reader",
    description:
      "Workspace dashboard access only — used for manifest RBAC E2E denial paths.",
    scope: "tenant",
    permissionKeys: [createPermissionKey("workspace", "dashboard_read")],
  },
] as const satisfies readonly TenantRoleCatalogEntry[];
