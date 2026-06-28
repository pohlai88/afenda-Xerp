import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardTransactions } from "../../_storybook/dashboard-block-story.fixtures";
import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardRecentTransactions,
  type AppShellDashboardRecentTransactionsGovernedComponents,
} from "./app-shell-dashboard-recent-transactions";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { AppShellDashboardTransactionRow } from "../data/app-shell.dashboard.types";

function resolveTransactions(
  predicate: (row: AppShellDashboardTransactionRow) => boolean
): readonly AppShellDashboardTransactionRow[] {
  const rows = defaultAppShellDashboardTransactions.filter(predicate);
  if (rows.length === 0) {
    throw new Error(
      "Expected at least one transaction fixture for this story."
    );
  }

  return rows;
}

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/RecentTransactions",
    component: AppShellDashboardRecentTransactions,
    args: {
      transactions: defaultAppShellDashboardTransactions,
    },
  }),
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardRecentTransactions, args),
} satisfies Meta<typeof AppShellDashboardRecentTransactions>;

export type RecentTransactionsStoriesGovernedComponents =
  AppShellDashboardRecentTransactionsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CreditsOnly: Story = {
  args: {
    transactions: resolveTransactions((row) => row.direction === "credit"),
  },
  parameters: {
    docs: {
      description: {
        story: "Credit-only postings with tabular-nums signed amounts.",
      },
    },
  },
};

export const DebitsOnly: Story = {
  args: {
    transactions: resolveTransactions((row) => row.direction === "debit"),
  },
  parameters: {
    docs: {
      description: {
        story: "Debit-only postings — net outflow summary.",
      },
    },
  },
};

export const Empty: Story = {
  args: { transactions: [] },
  parameters: {
    docs: {
      description: {
        story: "Source-empty ledger with status copy.",
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
