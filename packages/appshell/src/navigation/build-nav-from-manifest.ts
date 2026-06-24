import type {
  AppShellMenuItem,
  AppShellNavIconId,
  AppShellNavItemSerializable,
} from "../shadcn-studio/data/app-shell.data";
import { resolveAppShellNavIcon } from "../shadcn-studio/data/app-shell.data";

/**
 * Governed ERP module identifiers — must stay aligned with
 * `@afenda/entitlements` `ErpModuleId` (validated in navigation tests).
 */
export type ManifestModuleId =
  | "accounting"
  | "ai_copilot"
  | "hrm"
  | "inventory"
  | "manufacturing"
  | "mrp"
  | "sales"
  | "workspace";

export interface ManifestNavModuleEntry {
  readonly label: string;
  readonly moduleId: ManifestModuleId;
  readonly permissionKey: string;
  readonly routePath: string;
}

export interface BuildNavFromManifestInput {
  readonly grantedPermissionKeys: ReadonlySet<string>;
  readonly modules: readonly ManifestNavModuleEntry[];
}

const MODULE_NAV_ICON = {
  workspace: "dashboard",
  accounting: "bar-chart-3",
  hrm: "users",
  inventory: "boxes",
  manufacturing: "building",
  mrp: "building",
  sales: "shopping-bag",
  ai_copilot: "book-open",
} satisfies Record<ManifestModuleId, AppShellNavIconId>;

const manifestModuleIdLookup = new Set<string>(Object.keys(MODULE_NAV_ICON));

/** Governed module ids — keep aligned with `@afenda/entitlements` `ErpModuleId`. */
export const MANIFEST_MODULE_IDS = Object.freeze(
  Object.keys(MODULE_NAV_ICON) as ManifestModuleId[]
);

export function isManifestModuleId(value: string): value is ManifestModuleId {
  return manifestModuleIdLookup.has(value);
}

export function resolveManifestModuleNavIcon(
  moduleId: ManifestModuleId
): AppShellNavIconId {
  return MODULE_NAV_ICON[moduleId];
}

export function hasManifestModuleAccess(
  permissionKey: string,
  grantedPermissionKeys: ReadonlySet<string>
): boolean {
  return grantedPermissionKeys.has(permissionKey);
}

export function buildManifestNavigation(
  input: BuildNavFromManifestInput
): readonly AppShellNavItemSerializable[] {
  return input.modules
    .filter((entry) =>
      hasManifestModuleAccess(entry.permissionKey, input.grantedPermissionKeys)
    )
    .map((entry) => ({
      icon: resolveManifestModuleNavIcon(entry.moduleId),
      label: entry.label,
      href: entry.routePath,
    }));
}

export function hydrateManifestNavigation(
  items: readonly AppShellNavItemSerializable[]
): readonly AppShellMenuItem[] {
  return items.map((item) => {
    if ("items" in item) {
      return {
        icon: resolveAppShellNavIcon(item.icon),
        label: item.label,
        items: item.items,
      };
    }

    return {
      icon: resolveAppShellNavIcon(item.icon),
      label: item.label,
      href: item.href,
    };
  });
}

export function buildHydratedManifestNavigation(
  input: BuildNavFromManifestInput
): readonly AppShellMenuItem[] {
  return hydrateManifestNavigation(buildManifestNavigation(input));
}
