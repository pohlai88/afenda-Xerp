import type { Meta, StoryObj } from "@storybook/react";

import {
  DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  defaultAppShellDashboardKpiMetrics,
} from "../../_storybook/dashboard-block-story.fixtures";
import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardKpiStat,
  type AppShellDashboardKpiStatGovernedComponents,
} from "./app-shell-dashboard-kpi-stat";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const defaultMetric = defaultAppShellDashboardKpiMetrics[0];
if (defaultMetric === undefined) {
  throw new Error("Expected at least one KPI metric fixture.");
}

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/KpiStat",
    component: AppShellDashboardKpiStat,
    args: {
      ...defaultMetric,
      comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellDashboardKpiStat, args),
} satisfies Meta<typeof AppShellDashboardKpiStat>;

export type KpiStatStoriesGovernedComponents = AppShellDashboardKpiStatGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NetIncome: Story = {
  args: {
    ...defaultAppShellDashboardKpiMetrics.find((metric) => metric.id === "kpi-net-income"),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
};

export const ActiveOrders: Story = {
  args: {
    ...defaultAppShellDashboardKpiMetrics.find((metric) => metric.id === "kpi-active-orders"),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
};

export const Headcount: Story = {
  args: {
    ...defaultAppShellDashboardKpiMetrics.find((metric) => metric.id === "kpi-headcount"),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
};

export const OpenTasks: Story = {
  args: {
    ...defaultAppShellDashboardKpiMetrics.find((metric) => metric.id === "kpi-open-tasks"),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
