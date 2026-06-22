import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "./_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardStatisticsLineTrends,
  type AppShellDashboardStatisticsLineTrendsGovernedComponents,
  type AppShellDashboardStatisticsLineTrendsProps,
} from "./shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
  dashboardBlockStoryParameters,
} from "./_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Statistics/Line Trends",
    component: AppShellDashboardStatisticsLineTrends,
  }),
  render: () => renderDashboardBlockStory(AppShellDashboardStatisticsLineTrends, {}),
  parameters: {
    ...dashboardBlockStoryParameters,
    docs: {
      description: {
        component:
          "Production dashboard widget wrapping shadcn/studio `statistics-component-21` — dual-series metric cards with inline totals and compact line charts.",
      },
    },
  },
} satisfies Meta<AppShellDashboardStatisticsLineTrendsProps>;

export type StatisticsLineTrendsStoriesGovernedComponents =
  AppShellDashboardStatisticsLineTrendsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

/** Alias of Blocks/Dashboard/StatisticsLineTrends — kept for sidebar continuity. */
export const Default: Story = {};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
