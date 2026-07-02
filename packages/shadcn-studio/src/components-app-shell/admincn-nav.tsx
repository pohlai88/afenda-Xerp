"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type {
  AppShellNavGroupWire,
  AppShellNavItemWire,
} from "../meta-contracts/app-shell.contract.js";

export interface AdmincnNavProps {
  readonly groups: readonly AppShellNavGroupWire[];
}

function AdmincnNavItem({ item }: { item: AppShellNavItemWire }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={item.isActive === true}
        render={<a href={item.href} />}
      >
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AdmincnNav({ groups }: AdmincnNavProps) {
  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <AdmincnNavItem item={item} key={item.href} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
