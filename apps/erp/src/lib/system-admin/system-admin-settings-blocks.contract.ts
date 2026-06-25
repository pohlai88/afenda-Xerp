import type {
  AppShellAccountSettings02BrowserItem,
  AppShellAccountSettings02InboxItem,
  AppShellAccountSettings02NotificationSection,
  AppShellAccountSettings04IntegrationApp,
  AppShellAccountSettings05RoleOption,
  AppShellAccountSettings07AddOnRow,
  AppShellAccountSettings07UsageRow,
} from "@afenda/appshell";

export const SYSTEM_ADMIN_NOTIFICATION_SECTIONS: AppShellAccountSettings02NotificationSection[] =
  [
    {
      id: "users-team",
      title: "Users & team",
      items: [
        {
          id: "new-user-registrations",
          title: "New user registrations",
          description: "Be informed when a new user signs up.",
          channels: { email: true, desktop: false, app: true },
        },
        {
          id: "role-permission-changes",
          title: "Role & permission changes",
          description:
            "Receive notifications when roles or access levels change.",
          channels: { email: true, desktop: true, app: true },
        },
      ],
    },
    {
      id: "api-integrations",
      title: "API & integrations",
      items: [
        {
          id: "api-usage-limit",
          title: "API usage limit",
          description: "Get notified when API usage approaches your quota.",
          channels: { email: false, desktop: true, app: false },
        },
        {
          id: "integration-failures",
          title: "Integration failures",
          description: "Receive alerts when third-party integrations fail.",
          channels: { email: true, desktop: false, app: false },
        },
      ],
    },
  ];

export const SYSTEM_ADMIN_INBOX_PREFERENCE_ITEMS: AppShellAccountSettings02InboxItem[] =
  [
    {
      id: "daily-summary",
      label: "Daily summary",
      description: "Receive a daily summary of your inbox activity.",
      enabled: false,
    },
    {
      id: "product-updates",
      label: "Product updates",
      description:
        "Receive notifications about product updates and new features.",
      enabled: true,
    },
    {
      id: "exclusive-offers",
      label: "Exclusive offers",
      description:
        "Receive promotional offers, partner deals, and event invitations.",
      enabled: false,
    },
    {
      id: "surveys-feedback",
      label: "Surveys & feedback",
      description: "Participate in surveys and help us improve the platform.",
      enabled: false,
    },
  ];

export const SYSTEM_ADMIN_BROWSER_NOTIFICATION_ITEMS: AppShellAccountSettings02BrowserItem[] =
  [
    { id: "assigned-to-you", label: "Assigned to you", checked: true },
    { id: "unassigned", label: "Unassigned", checked: false },
    {
      id: "assigned-to-teams",
      label: "Assigned to any of your teams",
      checked: true,
    },
  ];

export const SYSTEM_ADMIN_DND_WEEK_DAYS = [
  { value: "sunday", label: "S" },
  { value: "monday", label: "M" },
  { value: "tuesday", label: "T" },
  { value: "wednesday", label: "W" },
  { value: "thursday", label: "T" },
  { value: "friday", label: "F" },
  { value: "saturday", label: "S" },
] as const;

export function buildCommunicationIntegrations(): AppShellAccountSettings04IntegrationApp[] {
  return [
    {
      id: "mail",
      name: "Mail",
      description: "Send and receive emails directly within the platform",
      connected: false,
      pricingLabel: "Free",
    },
    {
      id: "discord",
      name: "Discord",
      description: "Engage with your community and team in real time",
      connected: false,
      pricingLabel: "Free",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Collaborate and communicate in real time",
      connected: false,
      pricingLabel: "Free",
    },
  ];
}

export function buildPlanningIntegrations(): AppShellAccountSettings04IntegrationApp[] {
  return [
    {
      id: "notion",
      name: "Notion",
      description: "Sync documentation and project notes",
      connected: false,
    },
    {
      id: "asana",
      name: "Asana",
      description: "Track tasks and project milestones",
      connected: false,
    },
  ];
}

export function buildToolsIntegrations(): AppShellAccountSettings04IntegrationApp[] {
  return [
    {
      id: "github",
      name: "GitHub",
      description: "Connect repositories and deployment workflows",
      connected: false,
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows across connected apps",
      connected: false,
    },
  ];
}

export const SYSTEM_ADMIN_BILLING_USAGE_ROWS: AppShellAccountSettings07UsageRow[] =
  [
    {
      id: "storage",
      title: "Storage",
      value: 50,
      usedText: "Used 50.1 GB",
      includedText: "100 GB included",
      priceLabel: "$70",
    },
    {
      id: "api",
      title: "API requests",
      value: 30,
      usedText: "Used 30 prompts",
      includedText: "100 prompts included",
      priceLabel: "$25",
    },
  ];

export const SYSTEM_ADMIN_BILLING_ADD_ONS: AppShellAccountSettings07AddOnRow[] =
  [
    {
      id: "speed-insights",
      name: "Speed insights",
      description:
        "Detailed view of your website performance metrics for optimization.",
      priceLabel: "$10 / month per project",
      badgeLabel: "Pro",
      enabled: false,
    },
    {
      id: "observability-plus",
      name: "Observability plus",
      description:
        "Comprehensive visibility into application health and performance.",
      priceLabel: "$20 / month",
      badgeLabel: "Pro",
      enabled: false,
    },
  ];

export function mapInviteRoleOptions(
  roleOptions: readonly { readonly roleId: string; readonly roleName: string }[]
): AppShellAccountSettings05RoleOption[] {
  return roleOptions.map((option) => ({
    value: option.roleId,
    label: option.roleName,
  }));
}
