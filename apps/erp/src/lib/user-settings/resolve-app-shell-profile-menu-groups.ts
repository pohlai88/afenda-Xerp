import type { AppShellProfileMenuGroup } from "@afenda/appshell";
import {
  type AppShellProfileMenuItem,
  defaultAppShellProfileAccountActions,
  defaultAppShellProfileAdminActions,
} from "@afenda/appshell";

const PROFILE_MENU_HREFS = {
  "profile-my-profile": "/settings/profile",
  "profile-preferences": "/settings/preferences",
  "profile-company-plan": "/system-admin/settings/billing",
  "profile-erp-users": "/system-admin/settings/members",
  "profile-appearance": "/settings/preferences",
  "profile-add-user": "/system-admin/settings/members",
} as const satisfies Record<string, string>;

function withProfileMenuHref(
  item: AppShellProfileMenuItem
): AppShellProfileMenuItem {
  const href = PROFILE_MENU_HREFS[item.id as keyof typeof PROFILE_MENU_HREFS];
  return href === undefined ? item : { ...item, href };
}

/** ERP profile dropdown routes — ARCH-USER-001 §5.7 entry map. */
export function resolveAppShellProfileMenuGroups(): readonly AppShellProfileMenuGroup[] {
  return [
    {
      id: "account",
      items: defaultAppShellProfileAccountActions.map(withProfileMenuHref),
    },
    {
      id: "admin",
      items: defaultAppShellProfileAdminActions.map(withProfileMenuHref),
    },
  ];
}
