"use client";

import type { CSSProperties } from "react";

import {
  SidebarInset,
  SidebarProvider,
  TooltipProvider,
} from "@afenda/ui";
import { cn } from "@afenda/ui/lib/utils";

import {
  type AppShellProps,
  DEFAULT_NAV_ITEMS,
  DEFAULT_WORKSPACE_CONTEXT,
} from "./app-shell.types";
import { AppShellHeader } from "./app-shell-header";
import { AppShellSidebar } from "./app-shell-sidebar";

export function AppShell({
  activeItemId,
  children,
  commandItems,
  contextSwitcherCompact,
  contextSwitcherState,
  currentPathname,
  identity,
  identityAccessory,
  navItems = DEFAULT_NAV_ITEMS,
  onContextSwitchRequest,
  workspace = DEFAULT_WORKSPACE_CONTEXT,
}: AppShellProps) {
  return (
    <SidebarProvider
      className="min-h-svh w-full"
      style={
        {
          "--sidebar-width": "16rem",
        } as CSSProperties
      }
    >
      <TooltipProvider delayDuration={0}>
        <a
          className={cn(
            "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50",
            "focus:rounded-md focus:border-2 focus:border-background focus:bg-foreground",
            "focus:px-3 focus:py-2 focus:text-sm focus:text-background focus:no-underline"
          )}
          href="#app-shell-main"
        >
          Skip to content
        </a>
        <AppShellSidebar
          {...(activeItemId === undefined ? {} : { activeItemId })}
          {...(contextSwitcherCompact === undefined
            ? {}
            : { contextSwitcherCompact })}
          {...(contextSwitcherState === undefined
            ? {}
            : { contextSwitcherState })}
          {...(currentPathname === undefined ? {} : { currentPathname })}
          {...(identity === undefined ? {} : { identity })}
          {...(identityAccessory === undefined ? {} : { identityAccessory })}
          {...(onContextSwitchRequest === undefined
            ? {}
            : { onContextSwitchRequest })}
          items={navItems}
          workspace={workspace}
        />
        <SidebarInset className="flex min-h-svh flex-col">
          <AppShellHeader
            {...(commandItems === undefined ? {} : { commandItems })}
          />
          <main
            className="flex flex-1 flex-col overflow-auto"
            id="app-shell-main"
          >
            {children}
          </main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
