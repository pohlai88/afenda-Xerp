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
  AppShellDashboardStatisticsExpenseCard,
  type AppShellDashboardStatisticsExpenseCardGovernedComponents,
} from "./app-shell-dashboard-statistics-expense-card";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { AppShellDashboardSparklineMetric } from "../data/app-shell.dashboard.types";
import { asAppShellDashboardRowId } from "../data/app-shell.dashboard.types";

function resolveExpenseMetric(): AppShellDashboardSparklineMetric {
  const metric = defaultAppShellDashboardSparklineMetrics.find(
    (entry) => entry.id === asAppShellDashboardRowId("sparkline-expense")
  );
  if (metric === undefined) {
    throw new Error("Missing expense sparkline metric fixture.");
  }

  return metric;
}

const defaultMetric = resolveExpenseMetric();

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/StatisticsExpenseCard",
    component: AppShellDashboardStatisticsExpenseCard,
    args: {
      ...defaultMetric,
      comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    },
  }),
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardStatisticsExpenseCard, args),
} satisfies Meta<typeof AppShellDashboardStatisticsExpenseCard>;

export type StatisticsExpenseCardStoriesGovernedComponents =
  AppShellDashboardStatisticsExpenseCardGovernedComponents;

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
