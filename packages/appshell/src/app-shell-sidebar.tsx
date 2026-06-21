"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import {
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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
  SidebarRail,
  SidebarTrigger,
} from "@afenda/ui";
import { ChevronRight } from "lucide-react";

import { AppShellContextSwitcher } from "./app-shell-context-switcher";
import { resolveAppShellNavIcon } from "./app-shell-nav-icons";
import { AppShellUserMenu } from "./app-shell-user-menu";
import {
  type AppShellContextSwitcherState,
  type AppShellIdentity,
  type AppShellNavItem,
  type AppShellNavItemId,
  type AppShellWorkspaceContext,
  filterVisibleAppShellNavItems,
  groupAppShellNavItemsByKind,
  isAppShellNavItemNavigable,
  resolveAppShellActiveNavItemId,
  resolveAppShellNavBadgeLabel,
  resolveAppShellNavItemState,
} from "./app-shell.types";

export interface AppShellSidebarProps {
  readonly activeItemId?: AppShellNavItemId;
  readonly contextSwitcherCompact?: boolean;
  readonly contextSwitcherState?: AppShellContextSwitcherState;
  readonly currentPathname?: string;
  readonly identity?: AppShellIdentity;
  readonly identityAccessory?: ReactNode;
  readonly items: readonly AppShellNavItem[];
  readonly onContextSwitchRequest?: () => void;
  readonly workspace: AppShellWorkspaceContext;
}

const ERP_MODULE_NAV_HEADING_ID = "erp-module-navigation";

type AppShellNavResolutionProps = {
  readonly activeItemId?: AppShellNavItemId;
  readonly currentPathname?: string;
  readonly item: AppShellNavItem;
  readonly items: readonly AppShellNavItem[];
};

function resolveNavContextProps({
  activeItemId,
  currentPathname,
  item,
  items,
}: AppShellNavResolutionProps) {
  return {
    item,
    items,
    ...(activeItemId === undefined ? {} : { activeItemId }),
    ...(currentPathname === undefined ? {} : { currentPathname }),
  };
}

function resolveNavTooltip(
  item: Pick<AppShellNavItem, "description" | "label" | "state">
): string | undefined {
  if (item.description) {
    return item.description;
  }

  const state = resolveAppShellNavItemState(item);

  if (state === "coming-soon") {
    return `${item.label} is coming soon`;
  }

  if (state === "disabled") {
    return `${item.label} is currently unavailable`;
  }

  return item.label;
}

function AppShellNavItemBadge({ item }: { item: AppShellNavItem }) {
  const state = resolveAppShellNavItemState(item);

  if (item.badgeLabel) {
    return (
      <SidebarMenuBadge>
        <span className="sr-only">
          {resolveAppShellNavBadgeLabel(item.badgeLabel)}
        </span>
        <span aria-hidden="true">{item.badgeLabel}</span>
      </SidebarMenuBadge>
    );
  }

  if (state === "coming-soon") {
    return (
      <SidebarMenuBadge>
        <span className="sr-only">{item.label} coming soon</span>
        <span aria-hidden="true">Soon</span>
      </SidebarMenuBadge>
    );
  }

  return null;
}

function AppShellNavLinkContent({ item }: { item: AppShellNavItem }) {
  const Icon = resolveAppShellNavIcon(item.icon);
  const state = resolveAppShellNavItemState(item);

  return (
    <>
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{item.label}</span>
      <AppShellNavItemBadge item={item} />
      {state === "disabled" ? (
        <Badge emphasis="outline" size="sm" tone="neutral">
          Off
        </Badge>
      ) : null}
    </>
  );
}

function AppShellNavMenuItem({
  activeItemId,
  currentPathname,
  item,
  items,
}: {
  activeItemId?: AppShellNavItemId;
  currentPathname?: string;
  item: AppShellNavItem;
  items: readonly AppShellNavItem[];
}) {
  const isActive = resolveAppShellActiveNavItemId(items, {
    ...(activeItemId === undefined ? {} : { activeItemId }),
    ...(currentPathname === undefined ? {} : { currentPathname }),
  }) === item.id;
  const childItems = filterVisibleAppShellNavItems(item.children ?? []);
  const hasChildren = childItems.length > 0;
  const isNavigable = isAppShellNavItemNavigable(item);
  const tooltip = resolveNavTooltip(item);

  if (hasChildren) {
    return (
      <SidebarMenuItem
        data-nav-kind={item.kind}
        data-nav-order={item.order}
      >
        <Collapsible
          className="group/collapsible"
          defaultOpen={isActive}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isActive} tooltip={tooltip}>
              <AppShellNavLinkContent item={item} />
              <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {childItems.map((child) => (
                <AppShellNavSubMenuItem
                  {...resolveNavContextProps({
                    item: child,
                    items,
                    ...(activeItemId === undefined ? {} : { activeItemId }),
                    ...(currentPathname === undefined
                      ? {}
                      : { currentPathname }),
                  })}
                  key={child.id}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem data-nav-kind={item.kind} data-nav-order={item.order}>
      <SidebarMenuButton
        {...(isNavigable ? { asChild: true } : {})}
        disabled={!isNavigable}
        isActive={isActive}
        tooltip={tooltip}
      >
        {isNavigable ? (
          <Link
            aria-current={isActive ? "page" : undefined}
            href={item.href}
            title={item.description}
          >
            <AppShellNavLinkContent item={item} />
          </Link>
        ) : (
          <AppShellNavLinkContent item={item} />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AppShellNavSubMenuItem({
  activeItemId,
  currentPathname,
  item,
  items,
}: {
  activeItemId?: AppShellNavItemId;
  currentPathname?: string;
  item: AppShellNavItem;
  items: readonly AppShellNavItem[];
}) {
  const isActive =
    resolveAppShellActiveNavItemId(items, {
      ...(activeItemId === undefined ? {} : { activeItemId }),
      ...(currentPathname === undefined ? {} : { currentPathname }),
    }) === item.id;
  const isNavigable = isAppShellNavItemNavigable(item);
  const tooltip = resolveNavTooltip(item);

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        {...(isNavigable ? { asChild: true } : {})}
        aria-disabled={isNavigable ? undefined : true}
        isActive={isActive}
      >
        {isNavigable ? (
          <Link
            aria-current={isActive ? "page" : undefined}
            href={item.href}
            title={tooltip}
          >
            <span className="truncate">{item.label}</span>
          </Link>
        ) : (
          <span className="truncate">{item.label}</span>
        )}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function AppShellSidebar({
  items,
  activeItemId,
  currentPathname,
  workspace,
  contextSwitcherCompact = true,
  contextSwitcherState,
  identity,
  identityAccessory,
  onContextSwitchRequest,
}: AppShellSidebarProps) {
  const navGroups = groupAppShellNavItemsByKind(items);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-2 px-1">
            <SidebarTrigger />
            <Link
              aria-label="Afenda ERP home"
              className="truncate font-semibold tracking-tight"
              href="/"
            >
              Afenda ERP
            </Link>
          </div>
          <AppShellContextSwitcher
            compact={contextSwitcherCompact}
            {...(onContextSwitchRequest === undefined
              ? {}
              : { onSwitchRequest: onContextSwitchRequest })}
            {...(contextSwitcherState === undefined
              ? {}
              : { state: contextSwitcherState })}
            workspace={workspace}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-labelledby={ERP_MODULE_NAV_HEADING_ID}>
          <h2 className="sr-only" id={ERP_MODULE_NAV_HEADING_ID}>
            ERP modules
          </h2>
          {navGroups.map((group) => (
            <SidebarGroup key={group.kind}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <AppShellNavMenuItem
                      {...resolveNavContextProps({
                        item,
                        items,
                        ...(activeItemId === undefined ? {} : { activeItemId }),
                        ...(currentPathname === undefined
                          ? {}
                          : { currentPathname }),
                      })}
                      key={item.id}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      {identity ? (
        <SidebarFooter>
          <AppShellUserMenu
            identity={identity}
            {...(identityAccessory === undefined
              ? {}
              : { identityAccessory })}
          />
        </SidebarFooter>
      ) : null}

      <SidebarRail />
    </Sidebar>
  );
}
