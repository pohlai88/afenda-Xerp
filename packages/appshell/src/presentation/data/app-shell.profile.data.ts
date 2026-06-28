import {
  CirclePlusIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  SquarePenIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { ComponentType } from "react";

export interface AppShellProfileMenuItem {
  readonly href?: string;
  readonly Icon: ComponentType<{ readonly className?: string }>;
  readonly id: string;
  readonly label: string;
  readonly variant?: "destructive";
}

export interface AppShellProfileMenuGroup {
  readonly id: string;
  readonly items: readonly AppShellProfileMenuItem[];
}

export const DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME = "Alex Morgan";
export const DEFAULT_APP_SHELL_PROFILE_EMAIL = "alex.morgan@afenda.com";
export const DEFAULT_APP_SHELL_PROFILE_AVATAR_SRC =
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png";
export const DEFAULT_APP_SHELL_PROFILE_FALLBACK = "AM";

const accountActionsSource = [
  {
    id: "profile-my-profile",
    label: "My profile",
    Icon: UserIcon,
  },
  {
    id: "profile-preferences",
    label: "Preferences",
    Icon: SettingsIcon,
  },
  {
    id: "profile-company-plan",
    label: "Company plan",
    Icon: CreditCardIcon,
  },
] satisfies readonly AppShellProfileMenuItem[];

const adminActionsSource = [
  {
    id: "profile-erp-users",
    label: "ERP users",
    Icon: UsersIcon,
  },
  {
    id: "profile-appearance",
    label: "Appearance",
    Icon: SquarePenIcon,
  },
  {
    id: "profile-add-user",
    label: "Add user",
    Icon: CirclePlusIcon,
  },
] satisfies readonly AppShellProfileMenuItem[];

export const defaultAppShellProfileAccountActions: readonly AppShellProfileMenuItem[] =
  accountActionsSource;

export const defaultAppShellProfileAdminActions: readonly AppShellProfileMenuItem[] =
  adminActionsSource;

export const defaultAppShellProfileLogoutAction: AppShellProfileMenuItem = {
  id: "profile-sign-out",
  label: "Sign out",
  Icon: LogOutIcon,
  variant: "destructive",
};

export const defaultAppShellProfileMenuGroups: readonly AppShellProfileMenuGroup[] =
  [
    { id: "account", items: defaultAppShellProfileAccountActions },
    { id: "admin", items: defaultAppShellProfileAdminActions },
  ];
