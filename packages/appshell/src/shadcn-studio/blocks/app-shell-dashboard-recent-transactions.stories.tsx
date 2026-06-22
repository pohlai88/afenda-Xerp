import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardTransactions } from "../../_storybook/dashboard-block-story.fixtures";
import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardRecentTransactions,
  type AppShellDashboardRecentTransactionsGovernedComponents,
} from "./app-shell-dashboard-recent-transactions";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/RecentTransactions",
    component: AppShellDashboardRecentTransactions,
    args: {
      transactions: defaultAppShellDashboardTransactions,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellDashboardRecentTransactions, args),
} satisfies Meta<typeof AppShellDashboardRecentTransactions>;

export type RecentTransactionsStoriesGovernedComponents =
  AppShellDashboardRecentTransactionsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { transactions: [] },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
