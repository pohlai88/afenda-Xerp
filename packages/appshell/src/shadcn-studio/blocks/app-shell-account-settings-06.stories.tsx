import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import { createDashboardBlockMeta } from "../../_storybook/dashboard-block-story.shared";
import {
  AppShellAccountSettings06,
  type AppShellAccountSettings06GovernedComponents,
} from "./app-shell-account-settings-06";

const defaultSessions = [
  {
    id: "sess_current",
    issuedAtLabel: "Signed in today at 10:45 AM",
    ipAddress: "203.0.113.28",
    userAgent: "Chrome on macOS",
    isCurrent: true,
  },
  {
    id: "sess_other",
    issuedAtLabel: "Signed in yesterday at 9:12 AM",
    ipAddress: "198.51.100.34",
    userAgent: "Safari on iOS",
    isCurrent: false,
  },
] as const;

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/AccountSettings/Security06",
    component: AppShellAccountSettings06,
    args: {
      mfaPolicyRequired: true,
      userMfaEnabled: false,
      sessions: defaultSessions,
      onMfaPolicyChange: () => undefined,
      onEnableUserMfa: () => undefined,
      onRevokeSession: () => undefined,
      onRevokeOtherSessions: () => undefined,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellAccountSettings06, args),
} satisfies Meta<typeof AppShellAccountSettings06>;

export type AccountSettings06StoriesGovernedComponents =
  AppShellAccountSettings06GovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MfaEnrolled: Story = {
  args: {
    userMfaEnabled: true,
    onDisableUserMfa: () => undefined,
  },
};

export const PolicyOptional: Story = {
  args: {
    mfaPolicyRequired: false,
  },
};

export const CompactDensity: Story = {
  decorators: [compactDensityDecorator],
};
