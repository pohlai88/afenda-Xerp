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
  {
    key: catalogKey("workspace", "dashboard_read"),
    name: "Read workspace dashboard",
    description: "Read workspace dashboard layout and widgets.",
  },
  {
    key: catalogKey("workspace", "dashboard_write"),
    name: "Write workspace dashboard",
    description: "Update or reset workspace dashboard layout.",
  },
  {
    key: catalogKey("finance", "invoices_read"),
    name: "Read invoices",
    description: "Read accounts receivable invoice widgets and tables.",
  },
  {
    key: catalogKey("finance", "cards_read"),
    name: "Read corporate cards",
    description: "Read corporate card spend and payment history widgets.",
  },
  {
    key: catalogKey("finance", "transactions_read"),
    name: "Read transactions",
    description: "Read recent finance transaction activity widgets.",
  },
  {
    key: catalogKey("dashboard", "module_earnings"),
    name: "View module earnings",
    description: "View module earnings breakdown dashboard widgets.",
  },
  {
    key: catalogKey("dashboard", "regional_sales"),
    name: "View regional sales",
    description: "View regional sales breakdown dashboard widgets.",
  },
] as const satisfies readonly PlatformPermissionCatalogEntry[];

export const PLATFORM_PERMISSION_KEYS = PLATFORM_PERMISSION_CATALOG.map(
  (entry) => entry.key
);

export function listPlatformPermissionCatalogKeys(): readonly PermissionKey[] {
  return PLATFORM_PERMISSION_KEYS;
}
