import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import type { AppShellProfileMenuItem } from "./app-shell.profile.data";
import {
  DEFAULT_APP_SHELL_PROFILE_AVATAR_SRC,
  DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME,
  DEFAULT_APP_SHELL_PROFILE_FALLBACK,
} from "./app-shell.profile.data";

export const DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME =
  DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME;
export const DEFAULT_APP_SHELL_SIDEBAR_USER_AVATAR_SRC =
  DEFAULT_APP_SHELL_PROFILE_AVATAR_SRC;
export const DEFAULT_APP_SHELL_SIDEBAR_USER_FALLBACK =
  DEFAULT_APP_SHELL_PROFILE_FALLBACK;
export const DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL = "Operations admin";
export const DEFAULT_APP_SHELL_SIDEBAR_USER_MENU_LABEL = "Account menu";

const menuItemsSource = [
  {
    id: "sidebar-my-account",
    label: "My account",
    Icon: UserIcon,
  },
  {
    id: "sidebar-settings",
    label: "Workspace settings",
    Icon: SettingsIcon,
  },
  {
    id: "sidebar-billing",
    label: "Billing & plans",
    Icon: CreditCardIcon,
  },
  {
    id: "sidebar-team",
    label: "Manage team",
    Icon: UsersIcon,
  },
] satisfies readonly AppShellProfileMenuItem[];

export const defaultAppShellSidebarUserMenuItems: readonly AppShellProfileMenuItem[] =
  menuItemsSource;

export const defaultAppShellSidebarUserLogoutAction: AppShellProfileMenuItem = {
  id: "sidebar-sign-out",
  label: "Sign out",
  Icon: LogOutIcon,
  variant: "destructive",
};
