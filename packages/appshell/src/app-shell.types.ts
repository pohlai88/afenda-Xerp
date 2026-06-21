import type { ReactNode } from "react";

/** Core shell destinations (platform spine, not business modules). */
export type AppShellCoreNavItemId = "nexus" | "system-admin";

/** Business module destinations (owned by domain packages in later TIPs). */
export type AppShellModuleNavItemId =
  | "manufacturing"
  | "inventory"
  | "sales"
  | "accounting"
  | "hrm"
  | "projects";

/** Stable sidebar identifier — union prevents ad-hoc module id drift. */
export type AppShellNavItemId = AppShellCoreNavItemId | AppShellModuleNavItemId;

/** Closed icon set for sidebar visualization (no arbitrary React nodes). */
export type AppShellNavIcon =
  | "nexus"
  | "factory"
  | "warehouse"
  | "sales"
  | "ledger"
  | "people"
  | "kanban"
  | "shield";

/** Who owns the nav entry in the shell taxonomy. */
export type AppShellNavItemKind = "core" | "module" | "admin" | "workspace";

/** Lifecycle / interaction state for visualization and rendering rules. */
export type AppShellNavItemState =
  | "ready"
  | "disabled"
  | "coming-soon"
  | "hidden";

/** Attention tone for badges, labels, and future design-system mapping. */
export type AppShellNavItemTone =
  | "neutral"
  | "attention"
  | "warning"
  | "critical";

/**
 * Governed navigation contract for the ERP shell.
 * Permission keys are metadata only until TIP-005 enforcement lands.
 */
export interface AppShellNavItem {
  readonly badgeLabel?: string;
  readonly children?: readonly AppShellNavItem[];
  readonly description?: string;
  readonly href: string;
  readonly icon: AppShellNavIcon;
  readonly id: AppShellNavItemId;
  readonly kind: AppShellNavItemKind;
  readonly label: string;
  readonly order: number;
  readonly permission?: string;
  readonly state?: AppShellNavItemState;
  readonly tone?: AppShellNavItemTone;
}

/** Grouped navigation slice rendered inside a sidebar section. */
export interface AppShellNavGroup {
  readonly items: readonly AppShellNavItem[];
  readonly kind: AppShellNavItemKind;
  readonly label: string;
}

/** Display labels for governed nav groups in the shell sidebar. */
export const APP_SHELL_NAV_GROUP_LABELS = {
  core: "Platform",
  workspace: "Workspace",
  module: "Modules",
  admin: "Administration",
} as const satisfies Record<AppShellNavItemKind, string>;

const APP_SHELL_NAV_GROUP_ORDER: readonly AppShellNavItemKind[] = [
  "core",
  "workspace",
  "module",
  "admin",
];

/** Workspace execution context (IDs) with display labels. */
export interface AppShellWorkspaceContext {
  readonly companyId: string;
  readonly companyLabel: string;
  readonly organizationId: string;
  readonly organizationLabel: string;
  readonly tenantId: string;
  readonly tenantLabel: string;
}

/** Lifecycle state for workspace context switching (TIP-004 wiring slot). */
export type AppShellContextSwitcherState =
  | "ready"
  | "loading"
  | "error"
  | "forbidden"
  | "disabled";

/** Stable command-center action identifiers. */
export type AppShellCommandItemId = "command-center";

/** Lifecycle state for header command actions. */
export type AppShellCommandItemState = "ready" | "disabled" | "coming-soon";

/** Command surface taxonomy for TIP-007 Cmd+K evolution. */
export type AppShellCommandItemKind = "action" | "link" | "search" | "shortcut";

/**
 * Governed command-center item contract (metadata only until TIP-007 wiring).
 */
export interface AppShellCommandItem {
  readonly description?: string;
  readonly group?: string;
  readonly href?: string;
  readonly id: AppShellCommandItemId | (string & {});
  readonly keyboardShortcut?: string;
  readonly kind?: AppShellCommandItemKind;
  readonly label: string;
  readonly order: number;
  readonly permission?: string;
  readonly state?: AppShellCommandItemState;
}

/** Props for the main content region. */
export interface AppShellMainProps {
  children?: ReactNode;
  description: string;
  title: string;
}

export interface AppShellIdentity {
  readonly displayName: string;
  readonly email: string;
  readonly userId: string;
}

/** Root shell layout props. */
export interface AppShellProps {
  activeItemId?: AppShellNavItemId;
  children: ReactNode;
  commandItems?: readonly AppShellCommandItem[];
  readonly contextSwitcherCompact?: boolean;
  readonly contextSwitcherState?: AppShellContextSwitcherState;
  currentPathname?: string;
  readonly identity?: AppShellIdentity;
  readonly identityAccessory?: ReactNode;
  navItems?: readonly AppShellNavItem[];
  readonly onContextSwitchRequest?: () => void;
  /** Demo default only — production apps must pass real workspace context. */
  workspace?: AppShellWorkspaceContext;
}

/** Default placeholder navigation — governed metadata, static routes. */
export const DEFAULT_NAV_ITEMS = [
  {
    id: "nexus",
    label: "Nexus",
    href: "/",
    icon: "nexus",
    kind: "core",
    order: 10,
    state: "ready",
    description: "Platform overview and workspace entry",
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    href: "/manufacturing",
    icon: "factory",
    kind: "module",
    order: 20,
    state: "coming-soon",
    description: "Manufacturing module placeholder",
    permission: "module.manufacturing.access",
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "/inventory",
    icon: "warehouse",
    kind: "module",
    order: 30,
    state: "coming-soon",
    permission: "module.inventory.access",
  },
  {
    id: "sales",
    label: "Sales",
    href: "/sales",
    icon: "sales",
    kind: "module",
    order: 40,
    state: "coming-soon",
    permission: "module.sales.access",
  },
  {
    id: "accounting",
    label: "Accounting",
    href: "/accounting",
    icon: "ledger",
    kind: "module",
    order: 50,
    state: "coming-soon",
    permission: "module.accounting.access",
  },
  {
    id: "hrm",
    label: "HRM",
    href: "/hrm",
    icon: "people",
    kind: "module",
    order: 60,
    state: "coming-soon",
    permission: "module.hrm.access",
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    icon: "kanban",
    kind: "module",
    order: 70,
    state: "coming-soon",
    permission: "module.projects.access",
  },
  {
    id: "system-admin",
    label: "System Admin",
    href: "/system-admin",
    icon: "shield",
    kind: "admin",
    order: 80,
    state: "coming-soon",
    permission: "platform.admin.access",
  },
] as const satisfies readonly AppShellNavItem[];

/** Default placeholder command-center items for TIP-002 demo shell. */
export const DEFAULT_COMMAND_ITEMS = [
  {
    id: "command-center",
    label: "Command center",
    description: "Global search and workspace commands",
    kind: "search",
    keyboardShortcut: "⌘K",
    order: 10,
    state: "coming-soon",
  },
] as const satisfies readonly AppShellCommandItem[];

/** Default static workspace context for TIP-002 demo shell only. */
export const DEFAULT_WORKSPACE_CONTEXT = {
  tenantId: "tenant-demo",
  tenantLabel: "Demo Tenant",
  companyId: "company-demo",
  companyLabel: "Demo Company",
  organizationId: "org-demo",
  organizationLabel: "Demo Organization",
} as const satisfies AppShellWorkspaceContext;

/** Resolve effective nav state (defaults to ready). */
export function resolveAppShellNavItemState(
  item: Pick<AppShellNavItem, "state">
): AppShellNavItemState {
  return item.state ?? "ready";
}

/** Items visible in the shell sidebar (hidden entries are omitted). */
export function filterVisibleAppShellNavItems(
  items: readonly AppShellNavItem[]
): AppShellNavItem[] {
  return items
    .filter((item) => resolveAppShellNavItemState(item) !== "hidden")
    .sort((left, right) => left.order - right.order);
}

/** Group visible nav items by kind for sidebar section rendering. */
export function groupAppShellNavItemsByKind(
  items: readonly AppShellNavItem[]
): AppShellNavGroup[] {
  const visibleItems = filterVisibleAppShellNavItems(items);

  return APP_SHELL_NAV_GROUP_ORDER.flatMap((kind) => {
    const groupItems = visibleItems.filter((item) => item.kind === kind);

    if (groupItems.length === 0) {
      return [];
    }

    return [
      {
        kind,
        label: APP_SHELL_NAV_GROUP_LABELS[kind],
        items: groupItems,
      },
    ];
  });
}

/** Whether a nav item should render as an interactive route link. */
export function isAppShellNavItemNavigable(
  item: Pick<AppShellNavItem, "href" | "state">
): boolean {
  return resolveAppShellNavItemState(item) === "ready" && Boolean(item.href);
}

function pathnameMatchesNavHref(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Resolve active nav item from explicit id or current route (id wins). */
export function resolveAppShellActiveNavItemId(
  items: readonly AppShellNavItem[],
  options: {
    activeItemId?: AppShellNavItemId;
    currentPathname?: string;
  }
): AppShellNavItemId | undefined {
  if (options.activeItemId) {
    return options.activeItemId;
  }

  const pathname = options.currentPathname;
  if (!pathname) {
    return;
  }

  const candidates = filterVisibleAppShellNavItems(items).filter((item) =>
    pathnameMatchesNavHref(pathname, item.href)
  );

  if (candidates.length === 0) {
    return;
  }

  return candidates.sort(
    (left, right) => right.href.length - left.href.length
  )[0]?.id;
}

/** Accessible label for optional nav badge text. */
export function resolveAppShellNavBadgeLabel(badgeLabel: string): string {
  return `${badgeLabel} items`;
}

/** Resolve effective command item state (defaults to ready). */
export function resolveAppShellCommandItemState(
  item: Pick<AppShellCommandItem, "state">
): AppShellCommandItemState {
  return item.state ?? "ready";
}

/** Whether a command item should render as an interactive route link. */
export function isAppShellCommandItemNavigable(
  item: Pick<AppShellCommandItem, "href" | "state">
): item is AppShellCommandItem & { href: string } {
  return (
    resolveAppShellCommandItemState(item) === "ready" && Boolean(item.href)
  );
}

/** Tooltip copy explaining command availability. */
export function resolveAppShellCommandItemTitle(
  item: Pick<AppShellCommandItem, "description" | "label" | "state">
): string | undefined {
  if (item.description) {
    return item.description;
  }

  const state = resolveAppShellCommandItemState(item);

  if (state === "coming-soon") {
    return `${item.label} is coming soon`;
  }

  if (state === "disabled") {
    return `${item.label} is currently unavailable`;
  }

  return;
}

/** Visible command-center items sorted by order. */
export function sortAppShellCommandItems(
  items: readonly AppShellCommandItem[]
): AppShellCommandItem[] {
  return [...items].sort((left, right) => left.order - right.order);
}

/** Resolve effective context switcher state (defaults to ready). */
export function resolveAppShellContextSwitcherState(
  state?: AppShellContextSwitcherState
): AppShellContextSwitcherState {
  return state ?? "ready";
}

/** Status copy for non-ready context switcher states. */
export function resolveAppShellContextSwitcherStatusMessage(
  state: AppShellContextSwitcherState
): string | undefined {
  switch (state) {
    case "loading":
      return "Loading workspace context";
    case "error":
      return "Workspace context unavailable";
    case "forbidden":
      return "Workspace access restricted";
    case "disabled":
      return "Workspace switching disabled";
    default:
      return;
  }
}
