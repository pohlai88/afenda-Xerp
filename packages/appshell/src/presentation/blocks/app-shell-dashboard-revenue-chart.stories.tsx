import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
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
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardRevenueChart, args),
} satisfies Meta<typeof AppShellDashboardRevenueChart>;

export type RevenueChartStoriesGovernedComponents =
  AppShellDashboardRevenueChartGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "YoY stacked bars plus ascending growth area — fixture curve uses token-based 15%→0% fill.",
      },
    },
  },
};

export const EmptyBarData: Story = {
  args: { barData: [], growthData: [] },
  parameters: {
    docs: {
      description: {
        story:
          "Empty bar + growth panels with status copy — horizontal bar categorical chart.",
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
