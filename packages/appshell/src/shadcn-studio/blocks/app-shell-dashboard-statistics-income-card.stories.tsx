import type { Meta, StoryObj } from "@storybook/react";

import {
  DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  defaultAppShellDashboardSparklineMetrics,
} from "../../_storybook/dashboard-block-story.fixtures";
import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardStatisticsIncomeCard,
  type AppShellDashboardStatisticsIncomeCardGovernedComponents,
} from "./app-shell-dashboard-statistics-income-card";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { AppShellDashboardSparklineMetric } from "../data/app-shell.dashboard.types";
import { asAppShellDashboardRowId } from "../data/app-shell.dashboard.types";

function resolveIncomeMetric(): AppShellDashboardSparklineMetric {
  const metric = defaultAppShellDashboardSparklineMetrics.find(
    (entry) => entry.id === asAppShellDashboardRowId("sparkline-revenue")
  );
  if (metric === undefined) {
    throw new Error("Missing income sparkline metric fixture.");
  }

  return metric;
}

const defaultMetric = resolveIncomeMetric();

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/StatisticsIncomeCard",
    component: AppShellDashboardStatisticsIncomeCard,
    args: {
      ...defaultMetric,
      comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    },
  }),
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardStatisticsIncomeCard, args),
} satisfies Meta<typeof AppShellDashboardStatisticsIncomeCard>;

export type StatisticsIncomeCardStoriesGovernedComponents =
  AppShellDashboardStatisticsIncomeCardGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptySeries: Story = {
  args: {
    ...defaultMetric,
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    data: [],
  },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
