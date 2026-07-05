"use client";

import {
  ChevronRightIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  resolveUserProfileAvatarFallback,
  resolveUserProfileAvatarImageSrc,
} from "./user-profile-avatar.js";

export interface SidebarUserDropdownProps {
  readonly avatarFallback?: string;
  readonly avatarPresetId?: string;
  readonly avatarUrl?: string;
  readonly displayName?: string;
  readonly roleLabel?: string;
}

const SidebarUserDropdown = ({
  avatarFallback,
  avatarPresetId = DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  avatarUrl,
  displayName = "Operator",
  roleLabel = "Workspace user",
}: SidebarUserDropdownProps) => {
  const { isMobile } = useSidebar();
  const resolvedFallback = resolveUserProfileAvatarFallback(
    displayName,
    avatarFallback
  );
  const resolvedAvatarUrl = resolveUserProfileAvatarImageSrc({
    ...(avatarUrl === undefined ? {} : { customImageUrl: avatarUrl }),
    presetId: avatarPresetId,
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <Avatar className="rounded-lg">
              {resolvedAvatarUrl ? (
                <AvatarImage alt={displayName} src={resolvedAvatarUrl} />
              ) : null}
              <AvatarFallback className="rounded-lg">
                {resolvedFallback}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs">{roleLabel}</span>
            </div>
            <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 max-lg:rotate-270 [[data-state=open]>&]:rotate-90 lg:[[data-state=open]>&]:-rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[var(--anchor-width,14rem)] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={isMobile ? 8 : 16}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="rounded-lg">
                  {resolvedAvatarUrl ? (
                    <AvatarImage alt={displayName} src={resolvedAvatarUrl} />
                  ) : null}
                  <AvatarFallback className="rounded-lg">
                    {resolvedFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{roleLabel}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UsersIcon />
                Manage Team
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarUserDropdown;
