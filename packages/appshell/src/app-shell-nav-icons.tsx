"use client";

import type { LucideIcon } from "lucide-react";
import {
  Factory,
  Kanban,
  LayoutDashboard,
  Receipt,
  Shield,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";

import type { AppShellNavIcon } from "./app-shell.types";

/** Closed Lucide registry for sidebar visualization (TIP-006 swap point). */
export const APP_SHELL_NAV_ICONS = {
  nexus: LayoutDashboard,
  factory: Factory,
  warehouse: Warehouse,
  sales: ShoppingCart,
  ledger: Receipt,
  people: Users,
  kanban: Kanban,
  shield: Shield,
} as const satisfies Record<AppShellNavIcon, LucideIcon>;

export function resolveAppShellNavIcon(icon: AppShellNavIcon): LucideIcon {
  return APP_SHELL_NAV_ICONS[icon];
}
