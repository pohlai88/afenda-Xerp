"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@afenda/ui";
import { ChevronsUpDown } from "lucide-react";

import type { AppShellIdentity } from "./app-shell.types";

export interface AppShellUserMenuProps {
  readonly identity: AppShellIdentity;
  readonly identityAccessory?: ReactNode;
}

function resolveInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "?";
  }

  const first = parts[0]?.[0] ?? "";
  const last = parts.at(-1)?.[0] ?? "";

  return `${first}${last}`.toUpperCase();
}

export function AppShellUserMenu({
  identity,
  identityAccessory,
}: AppShellUserMenuProps) {
  const initials = resolveInitials(identity.displayName);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar size="sm">
                <AvatarImage alt="" src="" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {identity.displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {identity.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar size="sm">
                  <AvatarImage alt="" src="" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {identity.displayName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {identity.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {identityAccessory ? (
              <DropdownMenuItem asChild>{identityAccessory}</DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
