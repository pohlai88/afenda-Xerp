"use client";

import type { CSSProperties } from "react";

import { SidebarProvider, TooltipProvider } from "@afenda/ui";

import { AppShellFooter } from "./app-shell-footer";
import { AppShellHeader } from "./app-shell-header";
import { AppShellSidebar } from "./app-shell-sidebar";
import {
  type AppShellProps,
  DEFAULT_NAV_ITEMS,
  DEFAULT_WORKSPACE_CONTEXT,
} from "./app-shell.types";

export function AppShell({
  activeItemId,
  children,
  commandItems,
  contextSwitcherCompact,
  contextSwitcherState,
  currentPathname,
  identity,
  identityAccessory: _identityAccessory,
  navItems = DEFAULT_NAV_ITEMS,
  onContextSwitchRequest,
  workspace = DEFAULT_WORKSPACE_CONTEXT,
}: AppShellProps) {
  return (
    <div className="bg-muted before:bg-primary relative flex min-h-dvh w-full before:fixed before:inset-x-0 before:top-0 before:h-105">
      <div className="min-h-dvh w-full">
      <SidebarProvider
        style={
          {
            "--sidebar": "var(--card)",
            "--sidebar-width": "17.5rem",
            "--sidebar-width-icon": "3.375rem",
          } as CSSProperties
        }
      >
        <TooltipProvider delayDuration={0}>
          <a href="#app-shell-main">Skip to content</a>
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
            {...(onContextSwitchRequest === undefined
              ? {}
              : { onContextSwitchRequest })}
            items={navItems}
            workspace={workspace}
          />
          <div className="z-1 flex flex-1 flex-col py-6">
            <AppShellHeader
              {...(commandItems === undefined ? {} : { commandItems })}
              {...(contextSwitcherCompact === undefined
                ? {}
                : { contextSwitcherCompact })}
              {...(contextSwitcherState === undefined
                ? {}
                : { contextSwitcherState })}
              {...(identity === undefined ? {} : { identity })}
              {...(onContextSwitchRequest === undefined
                ? {}
                : { onContextSwitchRequest })}
              workspace={workspace}
            />
            <main
              className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6"
              id="app-shell-main"
            >
              {children}
            </main>
            <AppShellFooter />
          </div>
        </TooltipProvider>
      </SidebarProvider>
      </div>
    </div>
  );
}
