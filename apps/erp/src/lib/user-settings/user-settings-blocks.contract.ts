import type {
  AppShellAccountSettings02BrowserItem,
  AppShellAccountSettings02InboxItem,
  AppShellAccountSettings02NotificationSection,
} from "@afenda/appshell";
import type { UserNotificationsPreferences } from "@afenda/database";

/** Personal activity notifications — distinct from tenant admin "Users & team" copy. */
export const USER_NOTIFICATION_SECTIONS: AppShellAccountSettings02NotificationSection[] =
  [
    {
      id: "your-activity",
      title: "Your activity",
      items: [
        {
          id: "tasks-assigned",
          title: "Tasks assigned to you",
          description: "Get notified when a task is assigned to you.",
          channels: { email: true, desktop: true, app: true },
        },
        {
          id: "mentions",
          title: "Mentions",
          description: "Receive alerts when someone mentions you in a comment.",
          channels: { email: true, desktop: true, app: true },
        },
        {
          id: "approvals",
          title: "Approval requests",
          description: "Be notified when an item needs your approval.",
          channels: { email: true, desktop: false, app: true },
        },
      ],
    },
    {
      id: "digests",
      title: "Digests",
      items: [
        {
          id: "daily-summary",
          title: "Daily summary",
          description: "A once-daily digest of activity relevant to you.",
          channels: { email: true, desktop: false, app: false },
        },
        {
          id: "product-updates",
          title: "Product updates",
          description: "Release notes and feature announcements.",
          channels: { email: false, desktop: false, app: true },
        },
      ],
    },
  ];

export const USER_INBOX_PREFERENCE_ITEMS: AppShellAccountSettings02InboxItem[] =
  [
    {
      id: "inbox-daily-summary",
      label: "Daily summary",
      description: "Receive a daily summary of your inbox activity.",
      enabled: false,
    },
    {
      id: "inbox-product-updates",
      label: "Product updates",
      description:
        "Receive notifications about product updates and new features.",
      enabled: true,
    },
    {
      id: "inbox-team-activity",
      label: "Team activity",
      description: "Highlights from teams and projects you follow.",
      enabled: false,
    },
  ];

export const USER_BROWSER_NOTIFICATION_ITEMS: AppShellAccountSettings02BrowserItem[] =
  [
    { id: "browser-assigned-to-you", label: "Assigned to you", checked: true },
    {
      id: "browser-mentions",
      label: "Mentions and replies",
      checked: true,
    },
    {
      id: "browser-deadline-reminders",
      label: "Deadline reminders",
      checked: false,
    },
  ];

export const USER_DND_WEEK_DAYS = [
  { value: "sunday", label: "S" },
  { value: "monday", label: "M" },
  { value: "tuesday", label: "T" },
  { value: "wednesday", label: "W" },
  { value: "thursday", label: "T" },
  { value: "friday", label: "F" },
  { value: "saturday", label: "S" },
] satisfies ReadonlyArray<{ readonly value: string; readonly label: string }>;

export function buildDefaultUserNotificationsSettings(): UserNotificationsPreferences {
  return {
    sections: USER_NOTIFICATION_SECTIONS.map((section) => ({
      id: section.id,
      title: section.title,
      items: section.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? "",
        channels: { ...item.channels },
      })),
    })),
    inboxItems: USER_INBOX_PREFERENCE_ITEMS.map((item) => ({ ...item })),
    browserItems: USER_BROWSER_NOTIFICATION_ITEMS.map((item) => ({ ...item })),
    playSoundOnBlink: false,
    dndEnabled: false,
    fromTime: "22:00",
    toTime: "07:00",
    daysOff: ["saturday", "sunday"],
  };
}
