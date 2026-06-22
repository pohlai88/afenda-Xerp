import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardPaymentHistory } from "../../_storybook/dashboard-block-story.fixtures";
import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardPaymentHistory,
  type AppShellDashboardPaymentHistoryGovernedComponents,
} from "./app-shell-dashboard-payment-history";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/PaymentHistory",
    component: AppShellDashboardPaymentHistory,
    args: {
      rows: defaultAppShellDashboardPaymentHistory,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellDashboardPaymentHistory, args),
} satisfies Meta<typeof AppShellDashboardPaymentHistory>;

export type PaymentHistoryStoriesGovernedComponents =
  AppShellDashboardPaymentHistoryGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { rows: [] },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
