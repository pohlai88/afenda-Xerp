import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import { createDashboardBlockMeta } from "../../_storybook/dashboard-block-story.shared";
import {
  AppShellAccountSettings05,
  type AppShellAccountSettings05MemberRow,
  type AppShellAccountSettings05PendingInviteRow,
} from "./app-shell-account-settings-05";

const roleOptions = [
  { label: "Tenant admin", value: "role_admin" },
  { label: "Workspace reader", value: "role_reader" },
] as const;

const members: AppShellAccountSettings05MemberRow[] = [
  {
    email: "admin@example.com",
    id: "membership_admin",
    isAdmin: true,
    name: "Admin User",
    role: "role_admin",
  },
  {
    email: "reader@example.com",
    id: "membership_reader",
    name: "Reader User",
    role: "role_reader",
  },
];

const pendingInvites: AppShellAccountSettings05PendingInviteRow[] = [
  {
    email: "pending@example.com",
    id: "membership_pending",
    name: "Pending User",
    role: "role_reader",
  },
];

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/AccountSettings/Members05",
    component: AppShellAccountSettings05,
    args: {
      inviteSlot: null,
      members,
      pendingInvites,
      roleOptions,
      onMemberRoleChange: () => undefined,
      onPendingRemove: () => undefined,
      onPendingResend: () => undefined,
      onPendingRoleChange: () => undefined,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellAccountSettings05, args),
} satisfies Meta<typeof AppShellAccountSettings05>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MembersOnly: Story = {
  args: {
    pendingInvites: [],
  },
};

export const CompactDensity: Story = {
  decorators: [compactDensityDecorator],
};
