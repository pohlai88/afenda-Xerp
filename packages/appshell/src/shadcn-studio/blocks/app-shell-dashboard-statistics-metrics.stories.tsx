import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardStatisticsMetrics,
  type AppShellDashboardStatisticsMetricsGovernedComponents,
} from "./app-shell-dashboard-statistics-metrics";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/StatisticsMetrics",
    component: AppShellDashboardStatisticsMetrics,
  }),
  render: () => renderDashboardBlockStory(AppShellDashboardStatisticsMetrics, {}),
} satisfies Meta<typeof AppShellDashboardStatisticsMetrics>;

export type StatisticsMetricsStoriesGovernedComponents =
  AppShellDashboardStatisticsMetricsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
