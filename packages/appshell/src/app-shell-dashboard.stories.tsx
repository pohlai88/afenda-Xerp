import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import type { ApplicationShellDashboardGovernedComponents } from "./app-shell-dashboard";
import { ApplicationShellDashboardContent } from "./app-shell-dashboard";
import {
  renderDashboardStory,
} from "./_storybook/app-shell-dashboard-story.compositions";
import {
  DASHBOARD_STORY_BASE_ARGS,
  EMPTY_INVOICES_DASHBOARD_ARGS,
  EMPTY_REGIONAL_SALES_DASHBOARD_ARGS,
  FINANCE_DASHBOARD_ARGS,
  MODERN_DASHBOARD_ARGS,
} from "./_storybook/app-shell-dashboard-story.fixtures";

const meta = {
  title: "ERP/ApplicationShell/Dashboard",
  component: ApplicationShellDashboardContent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed ERP overview dashboard from `@afenda/appshell`. Composes sparkline metrics, KPI cards, revenue chart, module earnings, regional sales, transactions, payment history, accounts receivable, and optional legacy module widgets. Layout chrome uses plain HTML wrappers and `app-shell.presentation.css` (TIP-004).",
      },
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  args: DASHBOARD_STORY_BASE_ARGS,
  render: renderDashboardStory,
  argTypes: {
    dashboardLabel: {
      control: "text",
      description: "Accessible region label for the dashboard surface.",
    },
    comparisonLabel: {
      control: "text",
      description: "Shared comparison suffix for sparkline and KPI widgets.",
    },
    showLegacyWidgets: {
      control: "boolean",
      description:
        "When true, renders legacy module performance and recent orders placeholders below the invoice table.",
    },
    sparklineMetrics: { control: false },
    kpiMetrics: { control: false },
    moduleEarnings: { control: false },
    transactions: { control: false },
    regionalSales: { control: false },
    paymentHistory: { control: false },
    invoices: { control: false },
    legacyPlaceholderProps: { control: false },
  },
} satisfies Meta<typeof ApplicationShellDashboardContent>;

/** Governed primitives referenced across dashboard widgets (TIP-004 traceability). */
export type ApplicationShellDashboardStoriesGovernedComponents =
  ApplicationShellDashboardGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full ERP overview — enterprise widgets plus legacy module performance rows. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default dashboard composition: sparkline stats, KPI row, revenue chart, module earnings, regional sales, transactions, corporate card spend, legacy module widgets, and the accounts receivable table.",
      },
    },
  },
};

/** Modern layout — upgraded widgets only, without legacy placeholder sections. */
export const Modern: Story = {
  args: MODERN_DASHBOARD_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Recommended production layout after the enterprise dashboard upgrade. Hides legacy module performance and recent orders placeholders.",
      },
    },
  },
};

/** Finance close context — relabelled region and comparison copy. */
export const FinanceControlTower: Story = {
  args: FINANCE_DASHBOARD_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Finance controller review — custom dashboard label and comparison language while keeping the modern widget set.",
      },
    },
  },
};

/** Empty receivables — invoice table rich empty state. */
export const EmptyInvoices: Story = {
  args: EMPTY_INVOICES_DASHBOARD_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Accounts receivable with no rows — validates bulk actions, sorting chrome, and the governed empty state.",
      },
    },
  },
};

/** Empty regional sales — ranked list empty state and summary insights. */
export const EmptyRegionalSales: Story = {
  args: EMPTY_REGIONAL_SALES_DASHBOARD_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Regional revenue widget with no rows — validates ranked list empty state and summary insight copy.",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: MODERN_DASHBOARD_ARGS,
  globals: {
    theme: "dark",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Review dashboard widgets under dark Afenda tokens. Toggle the Theme toolbar to compare light and dark.",
      },
    },
  },
};

export const Tablet: Story = {
  args: MODERN_DASHBOARD_ARGS,
  parameters: {
    viewport: { defaultViewport: "tablet" },
    docs: {
      description: {
        story: "Responsive widget grids and sticky invoice table at tablet width.",
      },
    },
  },
};

export const Desktop: Story = {
  args: MODERN_DASHBOARD_ARGS,
  parameters: {
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        story: "Full desktop layout — multi-column widget grids and expanded table chrome.",
      },
    },
  },
};
