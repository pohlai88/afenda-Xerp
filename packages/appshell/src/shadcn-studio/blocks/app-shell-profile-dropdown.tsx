import type { ReactNode } from "react";
import { Fragment } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_PROFILE_AVATAR_SRC,
  DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME,
  DEFAULT_APP_SHELL_PROFILE_EMAIL,
  DEFAULT_APP_SHELL_PROFILE_FALLBACK,
  defaultAppShellProfileLogoutAction,
  defaultAppShellProfileMenuGroups,
  type AppShellProfileMenuGroup,
  type AppShellProfileMenuItem,
} from "../data/app-shell.profile.data";

const PROFILE_MENU_LABEL_ID = "app-shell-profile-menu-label";
const PROFILE_ONLINE_STATUS_ID = "app-shell-profile-online-status";
const DEFAULT_ONLINE_STATUS_LABEL = "Online";

export type AppShellProfileDropdownGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "DropdownMenu"
>;

export interface AppShellProfileDropdownProps {
  readonly trigger: ReactNode;
  readonly defaultOpen?: boolean;
  readonly align?: "start" | "center" | "end";
  readonly displayName?: string;
  readonly email?: string;
  readonly avatarSrc?: string;
  readonly avatarFallback?: string;
  readonly menuGroups?: readonly AppShellProfileMenuGroup[];
  readonly logoutItem?: AppShellProfileMenuItem;
  readonly showOnlineIndicator?: boolean;
  readonly onlineStatusLabel?: string;
}

function ProfileOnlineIndicator() {
  return (
    <span
      aria-hidden
      className="app-shell-profile-online-indicator"
    />
  );
}

function ProfileMenuHeader({
  displayName,
  email,
  avatarFallback,
  avatarSrc,
  showOnlineIndicator,
  onlineStatusLabel,
}: {
  readonly displayName: string;
  readonly email: string;
  readonly avatarFallback: string;
  readonly avatarSrc: string;
  readonly showOnlineIndicator: boolean;
  readonly onlineStatusLabel: string;
}) {
  return (
    <DropdownMenuLabel>
      <div className="app-shell-profile-dropdown-header">
        {showOnlineIndicator ? (
          <span className="sr-only" id={PROFILE_ONLINE_STATUS_ID}>
            {onlineStatusLabel}
          </span>
        ) : null}
        <div className="relative">
          <Avatar size="lg">
            <AvatarImage alt={displayName} src={avatarSrc} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          {showOnlineIndicator ? <ProfileOnlineIndicator /> : null}
        </div>
        <div className="app-shell-profile-dropdown-identity">
          <span
            aria-describedby={
              showOnlineIndicator ? PROFILE_ONLINE_STATUS_ID : undefined
            }
            className="app-shell-profile-dropdown-name"
            id={PROFILE_MENU_LABEL_ID}
          >
            {displayName}
          </span>
          <span className="app-shell-profile-dropdown-email">{email}</span>
        </div>
      </div>
    </DropdownMenuLabel>
  );
}

function ProfileMenuItemRow({ item }: { readonly item: AppShellProfileMenuItem }) {
  return (
    <DropdownMenuItem
      {...(item.variant === undefined ? {} : { variant: item.variant })}
    >
      <item.Icon aria-hidden className="app-shell-profile-menu-item-icon" />
      <span>{item.label}</span>
    </DropdownMenuItem>
  );
}

function ProfileMenuGroupSection({
  group,
}: {
  readonly group: AppShellProfileMenuGroup;
}) {
  return (
    <DropdownMenuGroup aria-label={group.id}>
      {group.items.map((item) => (
        <ProfileMenuItemRow key={item.id} item={item} />
      ))}
    </DropdownMenuGroup>
  );
}

export function AppShellProfileDropdown({
  trigger,
  defaultOpen,
  align = "end",
  displayName = DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME,
  email = DEFAULT_APP_SHELL_PROFILE_EMAIL,
  avatarSrc = DEFAULT_APP_SHELL_PROFILE_AVATAR_SRC,
  avatarFallback = DEFAULT_APP_SHELL_PROFILE_FALLBACK,
  menuGroups = defaultAppShellProfileMenuGroups,
  logoutItem = defaultAppShellProfileLogoutAction,
  showOnlineIndicator = true,
  onlineStatusLabel = DEFAULT_ONLINE_STATUS_LABEL,
}: AppShellProfileDropdownProps) {
  return (
    <DropdownMenu {...(defaultOpen === undefined ? {} : { defaultOpen })}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <div className="app-shell-profile-dropdown">
          <ProfileMenuHeader
            avatarFallback={avatarFallback}
            avatarSrc={avatarSrc}
            displayName={displayName}
            email={email}
            onlineStatusLabel={onlineStatusLabel}
            showOnlineIndicator={showOnlineIndicator}
          />

          <DropdownMenuSeparator />

          {menuGroups.map((group) => (
            <Fragment key={group.id}>
              <ProfileMenuGroupSection group={group} />
              <DropdownMenuSeparator />
            </Fragment>
          ))}

          <ProfileMenuItemRow item={logoutItem} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
