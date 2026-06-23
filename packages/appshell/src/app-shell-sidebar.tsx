import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Logo,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { ChevronRightIcon } from "lucide-react";

import type { ApplicationShellResolvedChrome } from "./app-shell.types";
import { AppShellSidebarUserDropdown } from "./shadcn-studio/blocks/app-shell-sidebar-user-dropdown";
import type {
  AppShellMenuItem,
  AppShellRecipientItem,
} from "./shadcn-studio/data/app-shell.data";
import { joinAppShellGovernedClassName } from "./wiring/governance";

export type AppShellSidebarGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Collapsible" | "Sidebar"
>;

interface AppShellSidebarProps {
  readonly chrome: ApplicationShellResolvedChrome;
  readonly navigationPages: readonly AppShellMenuItem[];
  readonly teamRecipients: readonly AppShellRecipientItem[];
}

export function AppShellSidebar({
  chrome,
  navigationPages,
  teamRecipients,
}: AppShellSidebarProps) {
  return (
    <div
      className={joinAppShellGovernedClassName(
        "app-shell-sidebar-frame",
        "sidebar",
        { density: chrome.density }
      )}
    >
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg">
                <a className="app-shell-brand-link" href="#">
                  <Logo className="app-shell-brand-logo" />
                  <span className="app-shell-brand-name">
                    {chrome.brandName}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{chrome.navigationLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationPages.map((item) =>
                  item.items ? (
                    <Collapsible key={item.label}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild>
                            <a className="app-shell-nav-trigger" href="#">
                              {item.icon}
                              <span>{item.label}</span>
                              <ChevronRightIcon
                                aria-hidden
                                className="app-shell-nav-chevron"
                              />
                            </a>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.label}>
                                <SidebarMenuSubButton asChild>
                                  <a
                                    className={joinAppShellGovernedClassName(
                                      "app-shell-nav-sub-link",
                                      "navigation-item",
                                      { density: chrome.density }
                                    )}
                                    href={subItem.href}
                                  >
                                    {subItem.label}
                                    {subItem.badge === undefined ? null : (
                                      <Badge emphasis="soft" tone="info">
                                        {subItem.badge}
                                      </Badge>
                                    )}
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <a className="app-shell-nav-link" href={item.href}>
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                      {"href" in item && item.badge !== undefined ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>{chrome.teamLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {teamRecipients.map((member) => (
                  <SidebarMenuItem key={member.name}>
                    <SidebarMenuButton asChild>
                      <a className="app-shell-team-link" href={member.href}>
                        <span className="app-shell-recipient-avatar">
                          <Avatar size="sm">
                            <AvatarImage
                              alt={member.name}
                              src={member.avatarSrc}
                            />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </span>
                        <span>{member.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <AppShellSidebarUserDropdown
            avatarFallback={chrome.avatarFallback}
            avatarSrc={chrome.avatarSrc}
            displayName={chrome.userName}
            roleLabel={chrome.roleLabel}
          />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
