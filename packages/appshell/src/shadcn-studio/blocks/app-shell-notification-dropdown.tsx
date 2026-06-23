import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@afenda/ui";
import {
  type GovernedUiComponentName,
  mapStockButtonProps,
} from "@afenda/ui/governance";
import { LinkIcon, SettingsIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  type AppShellNotificationActor,
  type AppShellNotificationItem,
  countUnreadAppShellNotifications,
  DEFAULT_APP_SHELL_NOTIFICATION_GENERAL_LIST_LABEL,
  DEFAULT_APP_SHELL_NOTIFICATION_GENERAL_TAB_LABEL,
  DEFAULT_APP_SHELL_NOTIFICATION_INBOX_LIST_LABEL,
  DEFAULT_APP_SHELL_NOTIFICATION_INBOX_TAB_LABEL,
  DEFAULT_APP_SHELL_NOTIFICATION_MENU_LABEL,
  DEFAULT_APP_SHELL_NOTIFICATION_SETTINGS_LABEL,
  defaultAppShellGeneralNotifications,
  defaultAppShellInboxNotifications,
} from "../data/app-shell.notification.data";

const DEFAULT_SETTINGS_HREF = "#";

export type AppShellNotificationDropdownGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Button" | "DropdownMenu" | "Tabs"
>;

export interface AppShellNotificationDropdownProps {
  readonly align?: "start" | "center" | "end";
  readonly defaultOpen?: boolean;
  readonly defaultTab?: "general" | "inbox";
  readonly generalItems?: readonly AppShellNotificationItem[];
  readonly generalTabLabel?: string;
  readonly inboxItems?: readonly AppShellNotificationItem[];
  readonly inboxTabLabel?: string;
  readonly menuLabel?: string;
  readonly settingsHref?: string;
  readonly settingsLabel?: string;
  readonly trigger: ReactNode;
  readonly unreadCount?: number;
}

function NotificationActorAvatar({
  actor,
}: {
  readonly actor: AppShellNotificationActor;
}) {
  return (
    <Avatar>
      <AvatarImage alt={actor.name} src={actor.avatarSrc} />
      <AvatarFallback>{actor.fallback}</AvatarFallback>
    </Avatar>
  );
}

function NotificationUnreadDot({ visible }: { readonly visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="app-shell-notification-item-unread-dot"
    />
  );
}

function NotificationDismissControl({
  visible,
}: {
  readonly visible: boolean;
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="app-shell-notification-dismiss">
      <XIcon aria-hidden className="app-shell-notification-dismiss-icon" />
      <div aria-hidden className="app-shell-notification-dismiss-marker" />
    </div>
  );
}

function NotificationApprovalActions() {
  return (
    <div className="app-shell-notification-approval-actions">
      <Button {...mapStockButtonProps("secondary", "sm")} type="button">
        Decline
      </Button>
      <Button {...mapStockButtonProps("default", "sm")} type="button">
        Accept
      </Button>
    </div>
  );
}

function NotificationAttachmentLink({
  href,
  label,
}: {
  readonly href: string;
  readonly label: string;
}) {
  return (
    <a className="app-shell-notification-attachment-link" href={href}>
      <LinkIcon
        aria-hidden
        className="app-shell-notification-attachment-icon"
      />
      <span>{label}</span>
    </a>
  );
}

function NotificationRowContent({
  item,
}: {
  readonly item: AppShellNotificationItem;
}) {
  return (
    <>
      <div className="app-shell-notification-row-copy">
        <span className="app-shell-notification-row-title">{item.title}</span>
        <div className="app-shell-notification-row-meta">
          <time
            className="app-shell-notification-row-time"
            dateTime={item.occurredAt}
          >
            {item.relativeTime}
          </time>
          <NotificationUnreadDot visible={item.unread === true} />
          <span className="app-shell-notification-row-category">
            {item.category}
          </span>
        </div>
        {item.kind === "approval" ? <NotificationApprovalActions /> : null}
        {item.kind === "attachment" ? (
          <NotificationAttachmentLink
            href={item.attachmentHref ?? DEFAULT_SETTINGS_HREF}
            label={item.attachmentLabel}
          />
        ) : null}
      </div>
      <NotificationDismissControl visible={item.dismissible === true} />
    </>
  );
}

function NotificationList({
  items,
  listLabel,
}: {
  readonly items: readonly AppShellNotificationItem[];
  readonly listLabel: string;
}) {
  if (items.length === 0) {
    return (
      <p className="app-shell-notification-empty" role="status">
        No notifications in this tab.
      </p>
    );
  }

  return (
    <ul aria-label={listLabel} className="list-none">
      {items.map((item, index) => (
        <li key={item.id}>
          <DropdownMenuItem aria-label={`${item.title} — ${item.category}`}>
            <NotificationActorAvatar actor={item.actor} />
            <div className="app-shell-notification-row-body">
              <NotificationRowContent item={item} />
            </div>
          </DropdownMenuItem>
          {index < items.length - 1 ? <DropdownMenuSeparator /> : null}
        </li>
      ))}
    </ul>
  );
}

function NotificationMenuHeader({
  menuLabel,
  unreadCount,
  inboxTabLabel,
  generalTabLabel,
  settingsHref,
  settingsLabel,
}: {
  readonly menuLabel: string;
  readonly unreadCount: number;
  readonly inboxTabLabel: string;
  readonly generalTabLabel: string;
  readonly settingsHref: string;
  readonly settingsLabel: string;
}) {
  const unreadBadgeLabel = unreadCount === 1 ? "1 new" : `${unreadCount} new`;

  return (
    <DropdownMenuLabel>
      <div className="app-shell-notification-menu-header">
        <div className="app-shell-notification-menu-title-row">
          <span
            className="app-shell-notification-menu-title"
            id="app-shell-notification-menu-label"
          >
            {menuLabel}
          </span>
          {unreadCount > 0 ? (
            <Badge emphasis="soft" tone="neutral">
              {unreadBadgeLabel}
            </Badge>
          ) : null}
        </div>
        <div className="app-shell-notification-menu-tabs-row">
          <TabsList variant="line">
            <TabsTrigger value="inbox">{inboxTabLabel}</TabsTrigger>
            <TabsTrigger value="general">{generalTabLabel}</TabsTrigger>
          </TabsList>
          <a
            aria-label={settingsLabel}
            className="app-shell-notification-settings-link"
            href={settingsHref}
          >
            <SettingsIcon
              aria-hidden
              className="app-shell-notification-settings-icon"
            />
          </a>
        </div>
      </div>
    </DropdownMenuLabel>
  );
}

export function AppShellNotificationDropdown({
  trigger,
  defaultOpen,
  align = "end",
  inboxItems = defaultAppShellInboxNotifications,
  generalItems = defaultAppShellGeneralNotifications,
  unreadCount,
  menuLabel = DEFAULT_APP_SHELL_NOTIFICATION_MENU_LABEL,
  inboxTabLabel = DEFAULT_APP_SHELL_NOTIFICATION_INBOX_TAB_LABEL,
  generalTabLabel = DEFAULT_APP_SHELL_NOTIFICATION_GENERAL_TAB_LABEL,
  settingsHref = DEFAULT_SETTINGS_HREF,
  settingsLabel = DEFAULT_APP_SHELL_NOTIFICATION_SETTINGS_LABEL,
  defaultTab = "inbox",
}: AppShellNotificationDropdownProps) {
  const resolvedUnreadCount =
    unreadCount ??
    countUnreadAppShellNotifications(inboxItems) +
      countUnreadAppShellNotifications(generalItems);

  return (
    <DropdownMenu {...(defaultOpen === undefined ? {} : { defaultOpen })}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <div className="app-shell-notification-dropdown">
          <Tabs defaultValue={defaultTab}>
            <NotificationMenuHeader
              generalTabLabel={generalTabLabel}
              inboxTabLabel={inboxTabLabel}
              menuLabel={menuLabel}
              settingsHref={settingsHref}
              settingsLabel={settingsLabel}
              unreadCount={resolvedUnreadCount}
            />

            <DropdownMenuSeparator />

            <TabsContent value="inbox">
              <NotificationList
                items={inboxItems}
                listLabel={DEFAULT_APP_SHELL_NOTIFICATION_INBOX_LIST_LABEL}
              />
            </TabsContent>

            <TabsContent value="general">
              <NotificationList
                items={generalItems}
                listLabel={DEFAULT_APP_SHELL_NOTIFICATION_GENERAL_LIST_LABEL}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
