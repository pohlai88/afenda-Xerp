"use client";

import { PaletteIcon } from "lucide-react";
import type { ReactNode } from "react";
import NotificationDropdownBlock from "@/components/shadcn-studio/dropdown-notification.js";
import MenuTriggerBlock from "@/components/shadcn-studio/menu-trigger.js";
import SidebarUserDropdownBlock from "@/components/shadcn-studio/sidebar-user-dropdown.js";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import type {
  AppShellNavGroupWire,
  AppShellOperatingContextWire,
} from "../meta-contracts/app-shell.contract.js";
import { useSettings } from "../theme/settings-context.js";
import { ThemeCustomizer } from "../theme/theme-customizer.js";
import { AppShellNav } from "./app-shell-nav.js";
import {
  mapSidebarVariant,
  resolveSidebarProviderDefaultOpen,
} from "./map-sidebar-from-settings.js";

export interface AppShellProps {
  readonly brandLabel?: string;
  readonly children: ReactNode;
  readonly navGroups: readonly AppShellNavGroupWire[];
  readonly operatingContext: AppShellOperatingContextWire;
}

export function AppShell({
  brandLabel = "Afenda ERP",
  children,
  navGroups,
  operatingContext,
}: AppShellProps) {
  const { settings } = useSettings();
  const sidebarVariant = mapSidebarVariant(settings.sidebarVariant);

  return (
    <SidebarProvider defaultOpen={resolveSidebarProviderDefaultOpen(settings)}>
      <Sidebar
        collapsible={settings.sidebarCollapsible}
        variant={sidebarVariant}
      >
        <SidebarHeader className="border-sidebar-border border-b px-4 py-3">
          <p className="truncate font-semibold text-sm">{brandLabel}</p>
          <p className="truncate text-muted-foreground text-xs">
            {operatingContext.workspaceLabel}
          </p>
        </SidebarHeader>
        <SidebarContent>
          <AppShellNav groups={navGroups} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarUserDropdownBlock />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <MenuTriggerBlock />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate font-medium text-sm">
              {operatingContext.tenantLabel}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              {operatingContext.legalEntityLabel}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <NotificationDropdownBlock
              trigger={
                <Button size="icon-sm" type="button" variant="ghost">
                  <span className="sr-only">Notifications</span>
                  <span
                    aria-hidden
                    className="size-2 rounded-full bg-primary"
                  />
                </Button>
              }
            />
            <Popover>
              <PopoverTrigger
                render={
                  <Button size="icon-sm" type="button" variant="ghost">
                    <PaletteIcon className="size-4" />
                    <span className="sr-only">Theme customizer</span>
                  </Button>
                }
              />
              <PopoverContent align="end" className="w-auto p-0">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <div
          className={
            settings.layout === "compact"
              ? "flex flex-1 flex-col gap-4 p-4"
              : "flex flex-1 flex-col gap-6 p-6"
          }
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
