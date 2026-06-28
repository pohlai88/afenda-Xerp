import type { Meta, StoryObj } from "@storybook/react";

import {
  DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  defaultAppShellDashboardKpiMetrics,
} from "../../_storybook/dashboard-block-story.fixtures";
import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardKpiStat,
  type AppShellDashboardKpiStatGovernedComponents,
} from "./app-shell-dashboard-kpi-stat";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { AppShellDashboardKpiMetric } from "../data/app-shell.dashboard.types";
import { asAppShellDashboardRowId } from "../data/app-shell.dashboard.types";

function resolveKpiMetric(
  id: AppShellDashboardKpiMetric["id"]
): AppShellDashboardKpiMetric {
  const metric = defaultAppShellDashboardKpiMetrics.find(
    (entry) => entry.id === id
  );
  if (metric === undefined) {
    throw new Error(`Missing KPI metric fixture: ${String(id)}`);
  }

  return metric;
}

const defaultMetric = defaultAppShellDashboardKpiMetrics[0];
if (defaultMetric === undefined) {
  throw new Error("Expected at least one KPI metric fixture.");
}

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/KpiStat",
    component: AppShellDashboardKpiStat,
    args: {
      ...defaultMetric,
      comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    },
  }),
  render: (args) => renderDashboardBlockStory(AppShellDashboardKpiStat, args),
} satisfies Meta<typeof AppShellDashboardKpiStat>;

export type KpiStatStoriesGovernedComponents =
  AppShellDashboardKpiStatGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NetIncome: Story = {
  args: {
    ...resolveKpiMetric(asAppShellDashboardRowId("kpi-net-income")),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
    emphasis: "primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary accent card for the lead KPI — sapphire tint on surface, border, and icon chip.",
      },
    },
  },
};

export const ActiveOrders: Story = {
  args: {
    ...resolveKpiMetric(asAppShellDashboardRowId("kpi-active-orders")),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Neutral KPI card with live badge and positive period-over-period change.",
      },
    },
  },
};

export const Headcount: Story = {
  args: {
    ...resolveKpiMetric(asAppShellDashboardRowId("kpi-headcount")),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Workforce KPI with FTE caption and tabular-nums value formatting.",
      },
    },
  },
};

export const OpenTasks: Story = {
  args: {
    ...resolveKpiMetric(asAppShellDashboardRowId("kpi-open-tasks")),
    comparisonLabel: DASHBOARD_BLOCK_STORY_COMPARISON_LABEL,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Declining metric — change footnote stays plain secondary text, not a colored pill.",
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
