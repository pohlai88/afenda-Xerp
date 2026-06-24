import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardModuleEarnings } from "../../_storybook/dashboard-block-story.fixtures";
import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardModuleEarnings,
  type AppShellDashboardModuleEarningsGovernedComponents,
} from "./app-shell-dashboard-module-earnings";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { AppShellDashboardModuleEarningRow } from "../data/app-shell.dashboard.types";

function resolveModuleEarningRows(
  predicate: (row: AppShellDashboardModuleEarningRow) => boolean
): readonly AppShellDashboardModuleEarningRow[] {
  const rows = defaultAppShellDashboardModuleEarnings.filter(predicate);
  if (rows.length === 0) {
    throw new Error(
      "Expected at least one module earnings fixture for this story."
    );
  }

  return rows;
}

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/ModuleEarnings",
    component: AppShellDashboardModuleEarnings,
    args: {
      rows: defaultAppShellDashboardModuleEarnings,
    },
  }),
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardModuleEarnings, args),
} satisfies Meta<typeof AppShellDashboardModuleEarnings>;

export type ModuleEarningsStoriesGovernedComponents =
  AppShellDashboardModuleEarningsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FinanceLeading: Story = {
  args: {
    rows: resolveModuleEarningRows((row) => row.module === "Finance"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Single top-ranked module with primary-accent leading row, share bar, and subtitle detail.",
      },
    },
  },
};

export const DecliningModule: Story = {
  args: {
    rows: resolveModuleEarningRows((row) => row.trend === "down"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Inventory module with declining QoQ change — footnote stays plain secondary, not a pill.",
      },
    },
  },
};

export const MixedPortfolio: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Full module mix with ranked rows, horizontal share bars, and weighted aggregate trend.",
      },
    },
  },
};

export const Empty: Story = {
  args: { rows: [] },
  parameters: {
    docs: {
      description: {
        story: "Source-empty breakdown with governed onboarding copy.",
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
