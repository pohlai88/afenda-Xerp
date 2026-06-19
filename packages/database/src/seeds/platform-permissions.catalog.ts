import {
  createPermissionKey,
  type PermissionKey,
} from "../permission-key.contract.js";

export interface PlatformPermissionCatalogEntry {
  readonly description: string;
  readonly key: PermissionKey;
  readonly name: string;
}

function catalogKey(domain: string, action: string): PermissionKey {
  return createPermissionKey(domain, action);
}

/**
 * Platform permission catalog for TIP-003A seeds.
 *
 * Must stay aligned with `@afenda/permissions` `PERMISSION_REGISTRY`.
 * Verified by `@afenda/permissions` seed-catalog-alignment test.
 */
export const PLATFORM_PERMISSION_CATALOG = [
  {
    key: catalogKey("system_admin", "users_read"),
    name: "Read platform users",
    description: "View platform user records within authorized scope.",
  },
  {
    key: catalogKey("system_admin", "users_manage"),
    name: "Manage platform users",
    description: "Create and update platform user records.",
  },
  {
    key: catalogKey("system_admin", "roles_manage"),
    name: "Manage roles",
    description: "Create and update authority role templates.",
  },
  {
    key: catalogKey("system_admin", "permissions_manage"),
    name: "Manage permissions",
    description: "Manage the global permission catalog.",
  },
  {
    key: catalogKey("system_admin", "modules_manage"),
    name: "Manage modules",
    description: "Enable and configure platform modules.",
  },
  {
    key: catalogKey("accounting", "journal_read"),
    name: "Read journals",
    description: "Read accounting journal entries.",
  },
  {
    key: catalogKey("accounting", "journal_post"),
    name: "Post journals",
    description: "Post accounting journal entries.",
  },
  {
    key: catalogKey("inventory", "stock_adjust"),
    name: "Adjust stock",
    description: "Adjust inventory stock levels.",
  },
  {
    key: catalogKey("hr", "employee_read"),
    name: "Read employees",
    description: "Read employee records.",
  },
] as const satisfies readonly PlatformPermissionCatalogEntry[];

export const PLATFORM_PERMISSION_KEYS = PLATFORM_PERMISSION_CATALOG.map(
  (entry) => entry.key
);

export function listPlatformPermissionCatalogKeys(): readonly PermissionKey[] {
  return PLATFORM_PERMISSION_KEYS;
}
