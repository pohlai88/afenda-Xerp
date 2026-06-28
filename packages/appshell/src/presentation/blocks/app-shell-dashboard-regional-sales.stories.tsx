import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardRegionalSales } from "../../_storybook/dashboard-block-story.fixtures";
import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardRegionalSales,
  type AppShellDashboardRegionalSalesGovernedComponents,
} from "./app-shell-dashboard-regional-sales";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { AppShellDashboardRegionalSalesRow } from "../data/app-shell.dashboard.types";

function resolveRegionalSalesRows(
  predicate: (row: AppShellDashboardRegionalSalesRow) => boolean
): readonly AppShellDashboardRegionalSalesRow[] {
  const rows = defaultAppShellDashboardRegionalSales.filter(predicate);
  if (rows.length === 0) {
    throw new Error(
      "Expected at least one regional sales fixture for this story."
    );
  }

  return rows;
}

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/RegionalSales",
    component: AppShellDashboardRegionalSales,
    args: {
      rows: defaultAppShellDashboardRegionalSales,
    },
  }),
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardRegionalSales, args),
} satisfies Meta<typeof AppShellDashboardRegionalSales>;

export type RegionalSalesStoriesGovernedComponents =
  AppShellDashboardRegionalSalesGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TopRegion: Story = {
  args: {
    rows: resolveRegionalSalesRows((row) => row.region === "North America"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Single top region with primary-accent leading row and share bar.",
      },
    },
  },
};

export const DecliningRegion: Story = {
  args: {
    rows: resolveRegionalSalesRows((row) => row.trend === "down"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Declining QoQ change — plain secondary footnote, not colored pill.",
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
