"use client";

import {
  type AppShellNavGroupWire,
  type AppShellOperatingContextWire,
  resolveShell,
} from "@afenda/shadcn-studio";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { resolveShellSlugFromPathname } from "@/lib/presentation/resolve-shell-slug";

export interface AppProtectedShellProps {
  readonly children: ReactNode;
  readonly navGroups: readonly AppShellNavGroupWire[];
  readonly operatingContext: AppShellOperatingContextWire;
}

function annotateActiveNavGroups(
  groups: readonly AppShellNavGroupWire[],
  pathname: string
): AppShellNavGroupWire[] {
  return groups.map((group) => ({
    label: group.label,
    items: group.items.map((item) => ({
      ...item,
      isActive: pathname === item.href || pathname.startsWith(`${item.href}/`),
    })),
  }));
}

export function AppProtectedShell({
  children,
  navGroups,
  operatingContext,
}: AppProtectedShellProps) {
  const pathname = usePathname();
  const activeNavGroups = useMemo(
    () => annotateActiveNavGroups(navGroups, pathname),
    [navGroups, pathname]
  );
  const shellSlug = resolveShellSlugFromPathname(pathname);
  const Shell = resolveShell(shellSlug);

  return (
    <Shell navGroups={activeNavGroups} operatingContext={operatingContext}>
      {children}
    </Shell>
  );
}
