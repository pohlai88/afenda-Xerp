"use client";

import type { CSSProperties } from "react";

import { SidebarProvider } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  defaultAppShellPages,
  defaultAppShellRecipients,
} from "./shadcn-studio/data/app-shell.data";
import { ApplicationShellDashboardContent } from "./app-shell-dashboard";
import {
  resolveApplicationShellChrome,
  type ApplicationShellProps,
} from "./app-shell.types";
import { AppShellFooter } from "./app-shell-footer";
import { AppShellHeader } from "./app-shell-header";
import { AppShellSidebar } from "./app-shell-sidebar";
import {
  joinAppShellGovernedClassName,
  resolveAppShellDensityAttribute,
} from "./wiring/governance";

export type { ApplicationShellProps } from "./app-shell.types";

export type ApplicationShellGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Button" | "Collapsible" | "Sidebar"
>;

const sidebarProviderStyle: CSSProperties & Record<
  "--sidebar" | "--sidebar-width" | "--sidebar-width-icon",
  string
> = {
  "--sidebar": "var(--card)",
  "--sidebar-width": "17.5rem",
  "--sidebar-width-icon": "3.375rem",
};

export function ApplicationShell({
  children,
  identityAccessory,
  navigationPages = defaultAppShellPages,
  teamRecipients = defaultAppShellRecipients,
  ...shellProps
}: ApplicationShellProps) {
  const chrome = resolveApplicationShellChrome(shellProps);

  return (
    <div
      className={joinAppShellGovernedClassName(
        "app-shell-root",
        "root",
        { density: chrome.density }
      )}
      data-afenda-density={resolveAppShellDensityAttribute(chrome.density)}
    >
      <SidebarProvider style={sidebarProviderStyle}>
        <AppShellSidebar
          chrome={chrome}
          navigationPages={navigationPages}
          teamRecipients={teamRecipients}
        />
        <div className="app-shell-main">
          <AppShellHeader chrome={chrome} identityAccessory={identityAccessory} />
          <main className="app-shell-content">
            {children ?? <ApplicationShellDashboardContent />}
          </main>
          <AppShellFooter chrome={chrome} />
        </div>
      </SidebarProvider>
    </div>
  );
}

/** @deprecated Use `ApplicationShell` — alias kept for backward compatibility. */
export const AppShell = ApplicationShell;
