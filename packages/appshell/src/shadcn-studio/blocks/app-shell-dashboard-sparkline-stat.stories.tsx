import React from "react";
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
  AppShellDashboardSparklineStat,
  type AppShellDashboardSparklineStatGovernedComponents,
} from "./app-shell-dashboard-sparkline-stat";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { AppShellDashboardSparklineMetric } from "../data/app-shell.dashboard.types";
import { asAppShellDashboardRowId } from "../data/app-shell.dashboard.types";

function resolveSparklineMetric(
  id: AppShellDashboardSparklineMetric["id"]
): AppShellDashboardSparklineMetric {
  const metric = defaultAppShellDashboardSparklineMetrics.find(
    (entry) => entry.id === id
  );
  if (metric === undefined) {
    throw new Error(`Missing sparkline metric fixture: ${String(id)}`);
  }

  return metric;
}

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
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardSparklineStat, args),
} satisfies Meta<typeof AppShellDashboardSparklineStat>;

export type SparklineStatStoriesGovernedComponents =
  AppShellDashboardSparklineStatGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Revenue: Story = {
  args: {
    ...resolveSparklineMetric(asAppShellDashboardRowId("sparkline-revenue")),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Revenue sparkline with 15%→0% area fill and tabular-nums amount.",
      },
    },
  },
};

export const Expense: Story = {
  args: {
    ...resolveSparklineMetric(asAppShellDashboardRowId("sparkline-expense")),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
  parameters: {
    docs: {
      description: {
        story: "Expense metric uses alternate chart stroke token for contrast.",
      },
    },
  },
};

export const EmptySeries: Story = {
  args: {
    ...resolveSparklineMetric(asAppShellDashboardRowId("sparkline-revenue")),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    data: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Empty series shows governed awaiting-points placeholder.",
      },
    },
  },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
