// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import type {
  AppShellNavGroupWire,
  AppShellOperatingContextWire,
} from "../../types/studio";
import { IconMark } from "../assets/IconMark";
import { ThemeToggle } from "../shared/ThemeToggle";
import { AdmincnNav } from "./AdmincnNav";
import { AppShell } from "./AppShell";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export interface AdmincnShellProps {
  readonly brandLabel?: string;
  readonly children: ReactNode;
  readonly navGroups: readonly AppShellNavGroupWire[];
  readonly operatingContext: AppShellOperatingContextWire;
}

export function AdmincnShell({
  brandLabel = "Afenda ERP",
  children,
  navGroups,
  operatingContext,
}: AdmincnShellProps) {
  return (
    <AppShell>
      <Sidebar className="gap-6">
        <div className="flex items-center gap-3 border-border border-b pb-4">
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
            <IconMark className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm">{brandLabel}</p>
            <p className="truncate text-muted-foreground text-xs">
              {operatingContext.workspaceLabel}
            </p>
          </div>
        </div>
        <AdmincnNav groups={navGroups} />
        <div className="mt-auto rounded-md border border-border bg-muted/40 p-3">
          <p className="font-medium text-sm">{operatingContext.tenantLabel}</p>
          <p className="text-muted-foreground text-xs">
            {operatingContext.legalEntityLabel}
          </p>
        </div>
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Topbar>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">
              {operatingContext.workspaceLabel}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              {operatingContext.tenantLabel}
            </p>
          </div>
          <ThemeToggle
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 font-medium text-sm",
              "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            label="Toggle presentation theme"
          />
        </Topbar>
        <main className="flex flex-1 flex-col gap-6">{children}</main>
      </div>
    </AppShell>
  );
}
