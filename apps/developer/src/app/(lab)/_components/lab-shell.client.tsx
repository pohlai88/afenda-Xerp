"use client";

import {
  AdmincnShell,
  type AppShellNavGroupWire,
  type AppShellOperatingContextWire,
} from "@afenda/shadcn-studio";
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
      <div className="lab-demo-banner flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
        <p>
          <strong>Sandbox route lab.</strong> Promotion-ready composition only;
          runtime authority remains in ERP.
        </p>
        <p className="text-slate-300">No auth · No BFF · No tenant runtime</p>
      </div>
      <AdmincnShell
        brandLabel="Afenda Route Lab"
        navGroups={activeNavGroups}
        operatingContext={operatingContext}
      >
        {children}
      </AdmincnShell>
    </>
  );
}
