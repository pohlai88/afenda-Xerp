import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardStatisticsLineTrends,
  type AppShellDashboardStatisticsLineTrendsGovernedComponents,
  type AppShellDashboardStatisticsLineTrendsProps,
} from "./app-shell-dashboard-statistics-line-trends";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/StatisticsLineTrends",
    component: AppShellDashboardStatisticsLineTrends,
  }),
  render: () =>
    renderDashboardBlockStory(AppShellDashboardStatisticsLineTrends, {}),
} satisfies Meta<AppShellDashboardStatisticsLineTrendsProps>;

export type StatisticsLineTrendsStoriesGovernedComponents =
  AppShellDashboardStatisticsLineTrendsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Line trend cards — daily orders, gross revenue, inventory movement; 15%→0% area fill.",
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
