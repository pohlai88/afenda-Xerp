import type { ReactNode } from "react";

/** Stable module identifiers for ERP sidebar navigation. */
export type AppShellNavItemId =
  | "nexus"
  | "manufacturing"
  | "inventory"
  | "sales"
  | "accounting"
  | "hrm"
  | "projects"
  | "system-admin";

/** Placeholder navigation item for the ERP sidebar. */
export interface AppShellNavItem {
  disabled?: boolean;
  href?: string;
  id: AppShellNavItemId;
  label: string;
}

/** Static workspace context placeholders (TIP-004+ will replace with real data). */
export interface AppShellWorkspaceContext {
  readonly company: string;
  readonly organization: string;
  readonly tenant: string;
}

/** Props for the main content region. */
export interface AppShellMainProps {
  children?: ReactNode;
  description: string;
  title: string;
}

/** Root shell layout props. */
export interface AppShellProps {
  activeItemId?: AppShellNavItemId;
  children: ReactNode;
  navItems?: readonly AppShellNavItem[];
  workspace?: AppShellWorkspaceContext;
}

/** Default placeholder navigation shown in TIP-002. */
export const DEFAULT_NAV_ITEMS = [
  { id: "nexus", label: "Nexus" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "inventory", label: "Inventory" },
  { id: "sales", label: "Sales" },
  { id: "accounting", label: "Accounting" },
  { id: "hrm", label: "HRM" },
  { id: "projects", label: "Projects" },
  { id: "system-admin", label: "System Admin" },
] as const satisfies readonly AppShellNavItem[];

/** Default static workspace context for TIP-002. */
export const DEFAULT_WORKSPACE_CONTEXT = {
  tenant: "Demo Tenant",
  company: "Demo Company",
  organization: "Demo Organization",
} as const satisfies AppShellWorkspaceContext;
