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
  Item,
  ItemContent,
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

function UserIdentitySummary({ identity }: { identity: AppShellIdentity }) {
  const initials = resolveInitials(identity.displayName);

  return (
    <>
      <Avatar size="sm">
        <AvatarImage alt="" src="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <ItemContent>
        <span>{identity.displayName}</span>
        <span>{identity.email}</span>
      </ItemContent>
    </>
  );
}

export function AppShellUserMenu({
  identity,
  identityAccessory,
}: AppShellUserMenuProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <UserIdentitySummary identity={identity} />
              <ChevronsUpDown aria-hidden />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
            <DropdownMenuLabel>
              <Item size="sm">
                <UserIdentitySummary identity={identity} />
              </Item>
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
