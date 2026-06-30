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
  ErpNavGroupWire,
  ErpNavItemWire,
} from "../../contracts/erp-shell.contract.js";

export interface ErpShellNavProps {
  readonly groups: readonly ErpNavGroupWire[];
}

function ErpShellNavItem({ item }: { item: ErpNavItemWire }) {
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

export function ErpShellNav({ groups }: ErpShellNavProps) {
  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <ErpShellNavItem item={item} key={item.href} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
