import {
  BarChart3Icon,
  BookOpenIcon,
  BoxesIcon,
  BuildingIcon,
  ClipboardListIcon,
  FolderOpenIcon,
  HomeIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactElement } from "react";
import type {
  AppShellNavIconId,
  AppShellNavSubItemSerializable,
} from "../../contracts/navigation.contract.js";

export type {
  AppShellNavIconId,
  AppShellNavItemSerializable,
} from "../../contracts/navigation.contract.js";

export type AppShellMenuSubItem = AppShellNavSubItemSerializable;

export type AppShellMenuItem = {
  readonly icon: ReactElement;
  readonly label: string;
} & (
  | {
      readonly active?: boolean;
      readonly href: string;
      readonly badge?: string;
      readonly items?: never;
    }
  | {
      readonly href?: never;
      readonly badge?: never;
      readonly items: readonly AppShellMenuSubItem[];
    }
);

export interface AppShellRecipientItem {
  readonly avatarSrc: string;
  readonly href: string;
  readonly name: string;
}

const erpNavSource = [
  {
    icon: <HomeIcon aria-hidden />,
    label: "Dashboard",
    href: "#",
  },
  {
    icon: <BarChart3Icon aria-hidden />,
    label: "Finance",
    items: [
      { label: "General Ledger", href: "#" },
      { label: "Accounts Payable", href: "#" },
      { label: "Accounts Receivable", href: "#" },
      { label: "Cash Management", href: "#" },
    ] satisfies readonly AppShellMenuSubItem[],
  },
  {
    icon: <UsersIcon aria-hidden />,
    label: "Human Resources",
    items: [
      { label: "Employee Directory", href: "#" },
      { label: "Payroll", href: "#" },
      { label: "Time & Attendance", href: "#" },
    ] satisfies readonly AppShellMenuSubItem[],
  },
  {
    icon: <BoxesIcon aria-hidden />,
    label: "Inventory",
    items: [
      { label: "Stock Overview", href: "#" },
      { label: "Purchase Orders", href: "#" },
      { label: "Suppliers", href: "#" },
    ] satisfies readonly AppShellMenuSubItem[],
  },
  {
    icon: <BuildingIcon aria-hidden />,
    label: "Manufacturing",
    items: [
      { label: "Production Orders", href: "#" },
      { label: "Bill of Materials", href: "#" },
      { label: "Work Centres", href: "#" },
    ] satisfies readonly AppShellMenuSubItem[],
  },
  {
    icon: <ShoppingBagIcon aria-hidden />,
    label: "Sales & CRM",
    items: [
      { label: "Customers", href: "#" },
      { label: "Opportunities", href: "#" },
      { label: "Sales Orders", href: "#" },
    ] satisfies readonly AppShellMenuSubItem[],
  },
  {
    icon: <FolderOpenIcon aria-hidden />,
    label: "Projects",
    items: [
      { label: "Project List", href: "#" },
      { label: "Milestones", href: "#" },
      { label: "Time Logs", href: "#" },
    ] satisfies readonly AppShellMenuSubItem[],
  },
  {
    icon: <ClipboardListIcon aria-hidden />,
    label: "Procurement",
    href: "#",
  },
  {
    icon: <BookOpenIcon aria-hidden />,
    label: "Reports",
    href: "#",
  },
  {
    icon: <SettingsIcon aria-hidden />,
    label: "System Admin",
    items: [
      { label: "Users & Roles", href: "#" },
      { label: "Permissions", href: "#" },
      { label: "Audit Log", href: "#" },
    ] satisfies readonly AppShellMenuSubItem[],
  },
] satisfies readonly AppShellMenuItem[];

export const defaultAppShellPages: readonly AppShellMenuItem[] = erpNavSource;

const erpTeamSource = [
  {
    name: "Alex Morgan",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    href: "#",
  },
  {
    name: "Sam Chen",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
    href: "#",
  },
  {
    name: "Jordan Rivera",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    href: "#",
  },
  {
    name: "Taylor Kim",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    href: "#",
  },
  {
    name: "Casey Park",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
    href: "#",
  },
] satisfies readonly AppShellRecipientItem[];

export const defaultAppShellRecipients: readonly AppShellRecipientItem[] =
  erpTeamSource;

// ── Serializable nav (RSC boundary safe) ──────────────────────────────────────
// AppShellMenuItem uses ReactElement icons and cannot cross a server→client
// boundary. The serializable variant identifies icons by stable string id,
// letting server layouts pass navigation data through props without a JSX
// payload. Call resolveAppShellNavIcon at the client boundary to hydrate.

const NAV_ICON_MAP = {
  "bar-chart-3": <BarChart3Icon aria-hidden />,
  "book-open": <BookOpenIcon aria-hidden />,
  boxes: <BoxesIcon aria-hidden />,
  building: <BuildingIcon aria-hidden />,
  "clipboard-list": <ClipboardListIcon aria-hidden />,
  dashboard: <HomeIcon aria-hidden />,
  "folder-open": <FolderOpenIcon aria-hidden />,
  settings: <SettingsIcon aria-hidden />,
  "shopping-bag": <ShoppingBagIcon aria-hidden />,
  users: <UsersIcon aria-hidden />,
} satisfies Record<AppShellNavIconId, ReactElement>;

/** Resolves a serializable nav icon id to a `ReactElement` at the client boundary. */
export function resolveAppShellNavIcon(id: AppShellNavIconId): ReactElement {
  return NAV_ICON_MAP[id];
}

export type AppShellActivityTagTone =
  | "danger"
  | "info"
  | "neutral"
  | "success"
  | "warning";

export interface AppShellActivityActor {
  readonly avatarSrc: string;
  readonly fallback: string;
  readonly name: string;
}

interface AppShellActivityItemBase {
  /** Sentence fragment after the actor name (e.g. "mentioned you in Q2 budget review"). */
  readonly action: string;
  readonly actor: AppShellActivityActor;
  readonly id: string;
  /** ISO-8601 instant for `<time>` semantics. */
  readonly occurredAt: string;
  readonly relativeTime: string;
}

export interface AppShellActivitySimpleItem extends AppShellActivityItemBase {
  readonly kind: "simple";
}

export interface AppShellActivityMentionItem extends AppShellActivityItemBase {
  readonly kind: "mention";
  readonly quote: string;
}

export interface AppShellActivityFileInlineItem
  extends AppShellActivityItemBase {
  /** Document link target. Defaults to `#` in the feed renderer when omitted. */
  readonly fileHref?: string;
  readonly fileName: string;
  readonly kind: "file-inline";
  readonly thumbnailAlt: string;
  readonly thumbnailSrc: string;
}

export interface AppShellActivityFileCardItem extends AppShellActivityItemBase {
  /** Document link target. Defaults to `#` in the feed renderer when omitted. */
  readonly fileHref?: string;
  readonly fileName: string;
  readonly kind: "file-card";
  readonly thumbnailAlt: string;
  readonly thumbnailSrc: string;
}

export interface AppShellActivityTag {
  readonly label: string;
  readonly tone: AppShellActivityTagTone;
}

export interface AppShellActivityTagsItem extends AppShellActivityItemBase {
  readonly kind: "tags";
  readonly tags: readonly AppShellActivityTag[];
}

export type AppShellActivityItem =
  | AppShellActivitySimpleItem
  | AppShellActivityMentionItem
  | AppShellActivityFileInlineItem
  | AppShellActivityFileCardItem
  | AppShellActivityTagsItem;

const erpActivitySource = [
  {
    id: "activity-q2-budget-mention",
    kind: "mention",
    actor: {
      name: "Alex Morgan",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
      fallback: "AM",
    },
    action: "mentioned you in Q2 budget review",
    relativeTime: "18 mins ago",
    occurredAt: "2026-06-21T09:35:00Z",
    quote:
      "@Finance team — please review the revised GL mapping before we lock the Q2 close.",
  },
  {
    id: "activity-ap-invoices-file",
    kind: "file-inline",
    actor: {
      name: "Jordan Rivera",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
      fallback: "JR",
    },
    action: "invites you to review a file",
    relativeTime: "39 mins ago",
    occurredAt: "2026-06-21T09:04:00Z",
    fileName: "ap-invoices-june.pdf",
    fileHref: "#",
    thumbnailSrc:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-14.png",
    thumbnailAlt: "AP invoices PDF preview",
  },
  {
    id: "activity-bom-design-preview",
    kind: "file-card",
    actor: {
      name: "Sam Chen",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
      fallback: "SC",
    },
    action: "wants to view your manufacturing BOM redesign",
    relativeTime: "1 hour ago",
    occurredAt: "2026-06-21T08:53:00Z",
    fileName: "BOM-redesign-v3.fig",
    fileHref: "#",
    thumbnailSrc:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-13.png",
    thumbnailAlt: "BOM redesign design file preview",
  },
  {
    id: "activity-warehouse-layout",
    kind: "simple",
    actor: {
      name: "Taylor Kim",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
      fallback: "TK",
    },
    action: "invites you to review the warehouse layout update",
    relativeTime: "3 hours ago",
    occurredAt: "2026-06-21T07:53:00Z",
  },
  {
    id: "activity-erp-phase2-tags",
    kind: "tags",
    actor: {
      name: "Casey Park",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
      fallback: "CP",
    },
    action: "added tags to ERP Phase 2 rollout",
    relativeTime: "8 hours ago",
    occurredAt: "2026-06-21T02:53:00Z",
    tags: [
      { label: "Manufacturing", tone: "info" },
      { label: "Go-live", tone: "info" },
      { label: "Cutover", tone: "warning" },
    ],
  },
  {
    id: "activity-audit-export",
    kind: "simple",
    actor: {
      name: "Riley Patel",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
      fallback: "RP",
    },
    action: "shared the monthly audit export",
    relativeTime: "10 hours ago",
    occurredAt: "2026-06-21T00:53:00Z",
  },
] satisfies readonly AppShellActivityItem[];

export const defaultAppShellActivities: readonly AppShellActivityItem[] =
  erpActivitySource;
