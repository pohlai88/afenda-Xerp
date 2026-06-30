"use client";

import {
  ErpDashboardShell,
  type ErpNavGroupWire,
  type ErpShellOperatingContextWire,
} from "@afenda/shadcn-studio";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo } from "react";

export interface ErpProtectedShellProps {
  readonly children: ReactNode;
  readonly navGroups: readonly ErpNavGroupWire[];
  readonly operatingContext: ErpShellOperatingContextWire;
}

function annotateActiveNavGroups(
  groups: readonly ErpNavGroupWire[],
  pathname: string
): ErpNavGroupWire[] {
  return groups.map((group) => ({
    label: group.label,
    items: group.items.map((item) => ({
      ...item,
      isActive: pathname === item.href || pathname.startsWith(`${item.href}/`),
    })),
  }));
}

export function ErpProtectedShell({
  children,
  navGroups,
  operatingContext,
}: ErpProtectedShellProps) {
  const pathname = usePathname();
  const activeNavGroups = useMemo(
    () => annotateActiveNavGroups(navGroups, pathname),
    [navGroups, pathname]
  );

  return (
    <ErpDashboardShell
      navGroups={activeNavGroups}
      operatingContext={operatingContext}
    >
      {children}
    </ErpDashboardShell>
  );
}
