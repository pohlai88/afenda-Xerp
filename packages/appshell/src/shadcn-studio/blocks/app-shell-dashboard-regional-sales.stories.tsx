import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardRegionalSales } from "../../_storybook/dashboard-block-story.fixtures";
import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardRegionalSales,
  type AppShellDashboardRegionalSalesGovernedComponents,
} from "./app-shell-dashboard-regional-sales";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/RegionalSales",
    component: AppShellDashboardRegionalSales,
    args: {
      rows: defaultAppShellDashboardRegionalSales,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellDashboardRegionalSales, args),
} satisfies Meta<typeof AppShellDashboardRegionalSales>;

export type RegionalSalesStoriesGovernedComponents =
  AppShellDashboardRegionalSalesGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { rows: [] },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
