import {
  BellIcon,
  type LucideIcon,
  MailIcon,
  MessageSquareIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";

export interface ListNotificationSetting {
  readonly defaultChecked?: boolean;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly id: string;
  readonly title: string;
}

export const LIST_NOTIFICATION_SETTINGS: readonly ListNotificationSetting[] = [
  {
    id: "approval-push",
    title: "Approval push alerts",
    description: "Notify on device when PO or invoice approvals are pending",
    icon: BellIcon,
  },
  {
    id: "audit-email",
    title: "Audit digest email",
    description: "Weekly system-admin audit event summary to your work inbox",
    icon: MailIcon,
    defaultChecked: true,
  },
  {
    id: "workflow-sms",
    title: "Critical workflow SMS",
    description: "SMS for high-priority execution spine failures only",
    icon: MessageSquareIcon,
    defaultChecked: true,
  },
  {
    id: "context-visibility",
    title: "Operating context visibility",
    description: "Show your active legal entity context to tenant admins",
    icon: ShieldIcon,
  },
];

export const LIST_NOTIFICATIONS_USER_SETTING: ListNotificationSetting = {
  id: "profile-visibility",
  title: "Profile visibility",
  description: "Control who can see your ERP user profile in directory search",
  icon: UserIcon,
};
