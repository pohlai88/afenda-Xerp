"use client";

import {
  AdmincnShell,
  type AppShellNavGroupWire,
  type AppShellOperatingContextWire,
} from "@afenda/shadcn-studio";
import { SettingsProvider } from "@afenda/shadcn-studio/theme";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface LabShellProps {
  readonly children: ReactNode;
  readonly navGroups: readonly AppShellNavGroupWire[];
  readonly operatingContext: AppShellOperatingContextWire;
}

export function LabShell({
  children,
  navGroups,
  operatingContext,
}: LabShellProps) {
  const pathname = usePathname();

  const activeNavGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive:
        item.href === pathname ||
        (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
    })),
  }));

  return (
    <>
      <header className="lab-demo-banner flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
        <div className="space-y-1">
          <h2 className="font-semibold text-base">Afenda Route Lab</h2>
          <p>
            <strong>Sandbox route lab.</strong> Promotion-ready composition
            only; runtime authority remains in ERP.
          </p>
        </div>
        <p className="text-slate-300">No auth · No BFF · No tenant runtime</p>
      </header>
      <SettingsProvider>
        <AdmincnShell
          brandLabel="Afenda Route Lab"
          navGroups={activeNavGroups}
          operatingContext={operatingContext}
        >
          {children}
        </AdmincnShell>
      </SettingsProvider>
    </>
  );
}
