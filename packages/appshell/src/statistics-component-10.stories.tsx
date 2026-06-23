import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "./_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardStatisticsMetrics,
  type AppShellDashboardStatisticsMetricsGovernedComponents,
} from "./shadcn-studio/blocks/app-shell-dashboard-statistics-metrics";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
  dashboardBlockStoryParameters,
} from "./_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Statistics/Component 10",
    component: AppShellDashboardStatisticsMetrics,
  }),
  render: () => renderDashboardBlockStory(AppShellDashboardStatisticsMetrics, {}),
  parameters: {
    ...dashboardBlockStoryParameters,
    docs: {
      description: {
        component:
          "Production dashboard widget wrapping shadcn/studio `statistics-component-10` — revenue, leads, activity, and profile traffic metric cards with embedded charts.",
      },
    },
  },
} satisfies Meta<typeof AppShellDashboardStatisticsMetrics>;

export type StatisticsComponent10StoriesGovernedComponents =
  AppShellDashboardStatisticsMetricsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

/** Alias of Blocks/Dashboard/StatisticsMetrics — kept for sidebar continuity. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Four-card grid from `statistics-component-10.data` — Thursday revenue peak, weekday tick abbreviations.",
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
