import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardRevenueChart,
  type AppShellDashboardRevenueChartGovernedComponents,
} from "./app-shell-dashboard-revenue-chart";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/RevenueChart",
    component: AppShellDashboardRevenueChart,
  }),
  render: () => renderDashboardBlockStory(AppShellDashboardRevenueChart, {}),
} satisfies Meta<typeof AppShellDashboardRevenueChart>;

export type RevenueChartStoriesGovernedComponents =
  AppShellDashboardRevenueChartGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
