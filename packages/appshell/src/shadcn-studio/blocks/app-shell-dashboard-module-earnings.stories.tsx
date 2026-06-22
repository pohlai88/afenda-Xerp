import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardModuleEarnings } from "../../_storybook/dashboard-block-story.fixtures";
import { compactDensityDecorator, renderDashboardBlockStory } from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardModuleEarnings,
  type AppShellDashboardModuleEarningsGovernedComponents,
} from "./app-shell-dashboard-module-earnings";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/ModuleEarnings",
    component: AppShellDashboardModuleEarnings,
    args: {
      rows: defaultAppShellDashboardModuleEarnings,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellDashboardModuleEarnings, args),
} satisfies Meta<typeof AppShellDashboardModuleEarnings>;

export type ModuleEarningsStoriesGovernedComponents =
  AppShellDashboardModuleEarningsGovernedComponents;

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
