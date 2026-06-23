export interface AppShellNotificationActor {
  readonly name: string;
  readonly avatarSrc: string;
  readonly fallback: string;
}

interface AppShellNotificationItemBase {
  readonly id: string;
  readonly actor: AppShellNotificationActor;
  readonly title: string;
  readonly relativeTime: string;
  readonly occurredAt: string;
  readonly category: string;
  readonly unread?: boolean;
  readonly dismissible?: boolean;
}

export interface AppShellNotificationSimpleItem extends AppShellNotificationItemBase {
  readonly kind: "simple";
}

export interface AppShellNotificationApprovalItem extends AppShellNotificationItemBase {
  readonly kind: "approval";
}

export interface AppShellNotificationAttachmentItem extends AppShellNotificationItemBase {
  readonly kind: "attachment";
  readonly attachmentLabel: string;
  readonly attachmentHref?: string;
}

export type AppShellNotificationItem =
  | AppShellNotificationSimpleItem
  | AppShellNotificationApprovalItem
  | AppShellNotificationAttachmentItem;

const inboxNotificationSource = [
  {
    id: "notification-ap-batch",
    kind: "approval",
    actor: {
      name: "Jordan Rivera",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
      fallback: "JR",
    },
    title: "AP invoice batch requires your approval",
    relativeTime: "12 minutes ago",
    occurredAt: "2026-06-21T09:55:00Z",
    category: "Accounts payable",
    unread: true,
  },
  {
    id: "notification-bom-comment",
    kind: "simple",
    actor: {
      name: "Sam Chen",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
      fallback: "SC",
    },
    title: "Commented on manufacturing BOM redesign",
    relativeTime: "27 minutes ago",
    occurredAt: "2026-06-21T09:40:00Z",
    category: "Manufacturing",
    unread: true,
    dismissible: true,
  },
  {
    id: "notification-po-request",
    kind: "approval",
    actor: {
      name: "Taylor Kim",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
      fallback: "TK",
    },
    title: "Purchase order #PO-4412 needs approval",
    relativeTime: "2 hours ago",
    occurredAt: "2026-06-21T08:07:00Z",
    category: "Procurement",
    unread: true,
  },
  {
    id: "notification-q2-workbook",
    kind: "attachment",
    actor: {
      name: "Alex Morgan",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
      fallback: "AM",
    },
    title: "Attached the Q2 close workbook",
    relativeTime: "6 hours ago",
    occurredAt: "2026-06-21T04:07:00Z",
    category: "Finance",
    attachmentLabel: "q2-close-workbook.xlsx",
    attachmentHref: "#",
  },
] satisfies readonly AppShellNotificationItem[];

const generalNotificationSource = [
  {
    id: "notification-maintenance",
    kind: "simple",
    actor: {
      name: "System",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png",
      fallback: "SY",
    },
    title: "Scheduled maintenance window this Saturday",
    relativeTime: "39 minutes ago",
    occurredAt: "2026-06-21T09:28:00Z",
    category: "Platform",
    unread: true,
    dismissible: true,
  },
  {
    id: "notification-audit-export",
    kind: "attachment",
    actor: {
      name: "Riley Patel",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
      fallback: "RP",
    },
    title: "Shared the monthly audit export",
    relativeTime: "3 hours ago",
    occurredAt: "2026-06-21T07:07:00Z",
    category: "Compliance",
    attachmentLabel: "audit-export-june.zip",
    attachmentHref: "#",
  },
  {
    id: "notification-phase2-reminder",
    kind: "simple",
    actor: {
      name: "Casey Park",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
      fallback: "CP",
    },
    title: "ERP Phase 2 rollout checkpoint tomorrow",
    relativeTime: "5 hours ago",
    occurredAt: "2026-06-21T05:07:00Z",
    category: "Projects",
    dismissible: true,
  },
  {
    id: "notification-hr-policy",
    kind: "approval",
    actor: {
      name: "Jordan Rivera",
      avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
      fallback: "JR",
    },
    title: "HR policy update requires acknowledgement",
    relativeTime: "8 hours ago",
    occurredAt: "2026-06-21T02:07:00Z",
    category: "Human resources",
  },
] satisfies readonly AppShellNotificationItem[];

export const defaultAppShellInboxNotifications: readonly AppShellNotificationItem[] =
  inboxNotificationSource;

export const defaultAppShellGeneralNotifications: readonly AppShellNotificationItem[] =
  generalNotificationSource;

export function countUnreadAppShellNotifications(
  items: readonly AppShellNotificationItem[]
): number {
  return items.filter((item) => item.unread === true).length;
}

export function countDefaultAppShellUnreadNotifications(): number {
  return (
    countUnreadAppShellNotifications(defaultAppShellInboxNotifications) +
    countUnreadAppShellNotifications(defaultAppShellGeneralNotifications)
  );
}

export const DEFAULT_APP_SHELL_NOTIFICATION_MENU_LABEL = "Notifications";
export const DEFAULT_APP_SHELL_NOTIFICATION_INBOX_TAB_LABEL = "Inbox";
export const DEFAULT_APP_SHELL_NOTIFICATION_GENERAL_TAB_LABEL = "General";
export const DEFAULT_APP_SHELL_NOTIFICATION_INBOX_LIST_LABEL = "Inbox notifications";
export const DEFAULT_APP_SHELL_NOTIFICATION_GENERAL_LIST_LABEL = "General notifications";
export const DEFAULT_APP_SHELL_NOTIFICATION_SETTINGS_LABEL = "Notification settings";
