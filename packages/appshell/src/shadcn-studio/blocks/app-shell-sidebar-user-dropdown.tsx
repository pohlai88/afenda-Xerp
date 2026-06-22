"use client";

import { ChevronRightIcon } from "lucide-react";

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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import type { AppShellProfileMenuItem } from "../data/app-shell.profile.data";
import {
  DEFAULT_APP_SHELL_SIDEBAR_USER_AVATAR_SRC,
  DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME,
  DEFAULT_APP_SHELL_SIDEBAR_USER_FALLBACK,
  DEFAULT_APP_SHELL_SIDEBAR_USER_MENU_LABEL,
  DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL,
  defaultAppShellSidebarUserLogoutAction,
  defaultAppShellSidebarUserMenuItems,
} from "../data/app-shell.sidebar-user.data";

const SIDEBAR_USER_MENU_LABEL_ID = "app-shell-sidebar-user-menu-label";

export type AppShellSidebarUserDropdownGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "DropdownMenu" | "Sidebar"
>;

export interface AppShellSidebarUserDropdownProps {
  readonly displayName?: string;
  readonly roleLabel?: string;
  readonly avatarSrc?: string;
  readonly avatarFallback?: string;
  readonly menuLabel?: string;
  readonly defaultOpen?: boolean;
  readonly menuItems?: readonly AppShellProfileMenuItem[];
  readonly logoutItem?: AppShellProfileMenuItem;
}

function SidebarUserMenuItemRow({ item }: { readonly item: AppShellProfileMenuItem }) {
  return (
    <DropdownMenuItem
      {...(item.variant === undefined ? {} : { variant: item.variant })}
    >
      <item.Icon aria-hidden className="app-shell-sidebar-user-menu-item-icon" />
      <span>{item.label}</span>
    </DropdownMenuItem>
  );
}

function SidebarUserMenuHeader({
  avatarFallback,
  avatarSrc,
  displayName,
  roleLabel,
}: {
  readonly displayName: string;
  readonly roleLabel: string;
  readonly avatarSrc: string;
  readonly avatarFallback: string;
}) {
  return (
    <DropdownMenuLabel>
      <div className="app-shell-sidebar-user-menu-header">
        <Avatar>
          <AvatarImage alt={displayName} src={avatarSrc} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="app-shell-sidebar-user-meta">
          <span
            className="app-shell-sidebar-user-menu-name"
            id={SIDEBAR_USER_MENU_LABEL_ID}
          >
            {displayName}
          </span>
          <span className="app-shell-sidebar-user-role">{roleLabel}</span>
        </div>
      </div>
    </DropdownMenuLabel>
  );
}

export function AppShellSidebarUserDropdown({
  displayName = DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME,
  roleLabel = DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL,
  avatarSrc = DEFAULT_APP_SHELL_SIDEBAR_USER_AVATAR_SRC,
  avatarFallback = DEFAULT_APP_SHELL_SIDEBAR_USER_FALLBACK,
  menuLabel = DEFAULT_APP_SHELL_SIDEBAR_USER_MENU_LABEL,
  defaultOpen,
  menuItems = defaultAppShellSidebarUserMenuItems,
  logoutItem = defaultAppShellSidebarUserLogoutAction,
}: AppShellSidebarUserDropdownProps) {
  const { isMobile } = useSidebar();
  const triggerLabel = `${menuLabel}: ${displayName}, ${roleLabel}`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu {...(defaultOpen === undefined ? {} : { defaultOpen })}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton aria-label={triggerLabel} size="lg">
              <Avatar>
                <AvatarImage alt={displayName} src={avatarSrc} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="app-shell-sidebar-user-trigger-copy">
                <span className="app-shell-sidebar-user-name">{displayName}</span>
                <span className="app-shell-sidebar-user-role">{roleLabel}</span>
              </div>
              <ChevronRightIcon
                aria-hidden
                className="app-shell-sidebar-user-chevron"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            aria-labelledby={SIDEBAR_USER_MENU_LABEL_ID}
            side={isMobile ? "bottom" : "right"}
            sideOffset={isMobile ? 8 : 16}
          >
            <div className="app-shell-sidebar-user-dropdown">
            <DropdownMenuGroup>
              <SidebarUserMenuHeader
                avatarFallback={avatarFallback}
                avatarSrc={avatarSrc}
                displayName={displayName}
                roleLabel={roleLabel}
              />
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup aria-label={menuLabel}>
              {menuItems.map((item) => (
                <SidebarUserMenuItemRow key={item.id} item={item} />
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <SidebarUserMenuItemRow item={logoutItem} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
