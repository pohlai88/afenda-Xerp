import type {
  AppShellNavIconId,
  AppShellNavItemSerializable,
  ManifestModuleId,
  ManifestNavProjectionInput,
} from "../contracts/navigation.contract.js";
import {
  isManifestModuleId,
  MANIFEST_MODULE_IDS,
  MANIFEST_MODULE_NAV_ICON_MAP,
} from "../contracts/navigation.contract.js";
import type { AppShellMenuItem } from "../shadcn-studio/data/app-shell.data";
import { resolveAppShellNavIcon } from "../shadcn-studio/data/app-shell.data";

export type {
  ManifestModuleId,
  ManifestNavModuleEntry,
} from "../contracts/navigation.contract.js";

export type BuildNavFromManifestInput = ManifestNavProjectionInput;

export { isManifestModuleId, MANIFEST_MODULE_IDS };

export function resolveManifestModuleNavIcon(
  moduleId: ManifestModuleId
): AppShellNavIconId {
  return MANIFEST_MODULE_NAV_ICON_MAP[moduleId];
}

export function hasManifestModuleAccess(
  permissionKey: string,
  grantedPermissionKeys: ReadonlySet<string>
): boolean {
  return grantedPermissionKeys.has(permissionKey);
}

export function buildManifestNavigation(
  input: ManifestNavProjectionInput
): readonly AppShellNavItemSerializable[] {
  return input.modules
    .filter((entry) =>
      hasManifestModuleAccess(entry.permissionKey, input.grantedPermissionKeys)
    )
    .map((entry) => {
      const base = {
        icon: resolveManifestModuleNavIcon(entry.moduleId),
        label: entry.label,
        href: entry.routePath,
      } as const;

      const withBadge =
        entry.badge === undefined ? base : { ...base, badge: entry.badge };

      const withActive =
        input.activeRoutePath === undefined
          ? withBadge
          : { ...withBadge, active: entry.routePath === input.activeRoutePath };

      return withActive;
    });
}

export function hydrateManifestNavigation(
  items: readonly AppShellNavItemSerializable[]
): readonly AppShellMenuItem[] {
  return items.map((item) => {
    if ("items" in item && item.items !== undefined) {
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
      ...(item.badge === undefined ? {} : { badge: item.badge }),
      ...(item.active === true ? { active: true } : {}),
    };
  });
}

export function buildHydratedManifestNavigation(
  input: ManifestNavProjectionInput
): readonly AppShellMenuItem[] {
  return hydrateManifestNavigation(buildManifestNavigation(input));
}
