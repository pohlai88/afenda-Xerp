/**
 * ADR-0001 AppShell navigation authority — manifest module ids, serializable nav items,
 * and permission metadata for host-injected manifest projection.
 *
 * Must stay aligned with `@afenda/entitlements` `ErpModuleId` (validated in navigation tests).
 */

export const APPSHELL_NAV_ICON_IDS = [
  "bar-chart-3",
  "book-open",
  "boxes",
  "building",
  "clipboard-list",
  "dashboard",
  "folder-open",
  "settings",
  "shopping-bag",
  "users",
] as const;

export type AppShellNavIconId = (typeof APPSHELL_NAV_ICON_IDS)[number];

export const MANIFEST_MODULE_IDS = [
  "accounting",
  "ai_copilot",
  "hrm",
  "inventory",
  "manufacturing",
  "mrp",
  "sales",
  "workspace",
] as const;

export type ManifestModuleId = (typeof MANIFEST_MODULE_IDS)[number];

const manifestModuleIdLookup = new Set<string>(MANIFEST_MODULE_IDS);

const navIconIdLookup = new Set<string>(APPSHELL_NAV_ICON_IDS);

export function isManifestModuleId(value: string): value is ManifestModuleId {
  return manifestModuleIdLookup.has(value);
}

export function isAppShellNavIconId(value: string): value is AppShellNavIconId {
  return navIconIdLookup.has(value);
}

export interface AppShellNavSubItemSerializable {
  readonly badge?: string;
  readonly href: string;
  readonly label: string;
}

/**
 * Serializable navigation item — safe for server→client boundaries.
 * Host hydrates `icon` via {@link AppShellNavIconId} at the client boundary.
 */
export type AppShellNavItemSerializable = {
  readonly icon: AppShellNavIconId;
  readonly label: string;
} & (
  | {
      readonly active?: boolean;
      readonly badge?: string;
      readonly href: string;
      readonly items?: never;
    }
  | {
      readonly badge?: never;
      readonly href?: never;
      readonly items: readonly AppShellNavSubItemSerializable[];
    }
);

/** Host-injected manifest row — permission key evaluated outside AppShell. */
export interface ManifestNavModuleEntry {
  readonly badge?: string;
  readonly label: string;
  readonly moduleId: ManifestModuleId;
  readonly permissionKey: string;
  readonly routePath: string;
}

/** Input for manifest→nav projection (RBAC filter applied by host before or during build). */
export interface ManifestNavProjectionInput {
  readonly activeRoutePath?: string;
  readonly grantedPermissionKeys: ReadonlySet<string>;
  readonly modules: readonly ManifestNavModuleEntry[];
}

/** Default manifest module → nav icon mapping (frozen contract). */
export const MANIFEST_MODULE_NAV_ICON_MAP = {
  workspace: "dashboard",
  accounting: "bar-chart-3",
  hrm: "users",
  inventory: "boxes",
  manufacturing: "building",
  mrp: "building",
  sales: "shopping-bag",
  ai_copilot: "book-open",
} as const satisfies Record<ManifestModuleId, AppShellNavIconId>;
