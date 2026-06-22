import type { Meta, StoryObj } from "@storybook/react";

import {
  DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  defaultAppShellDashboardSparklineMetrics,
} from "../../_storybook/dashboard-block-story.fixtures";
import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardSparklineStat,
  type AppShellDashboardSparklineStatGovernedComponents,
} from "./app-shell-dashboard-sparkline-stat";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const defaultMetric = defaultAppShellDashboardSparklineMetrics[0];
if (defaultMetric === undefined) {
  throw new Error("Expected at least one sparkline metric fixture.");
}

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/SparklineStat",
    component: AppShellDashboardSparklineStat,
    args: {
      ...defaultMetric,
      comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellDashboardSparklineStat, args),
} satisfies Meta<typeof AppShellDashboardSparklineStat>;

export type SparklineStatStoriesGovernedComponents =
  AppShellDashboardSparklineStatGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Revenue: Story = {
  args: {
    ...defaultAppShellDashboardSparklineMetrics.find(
      (metric) => metric.id === "sparkline-revenue"
    ),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
};

export const Expense: Story = {
  args: {
    ...defaultAppShellDashboardSparklineMetrics.find(
      (metric) => metric.id === "sparkline-expense"
    ),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
