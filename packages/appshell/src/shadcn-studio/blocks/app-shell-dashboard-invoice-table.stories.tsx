import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { defaultAppShellDashboardInvoices } from "../../_storybook/dashboard-block-story.fixtures";
import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  AppShellDashboardInvoiceTable,
  type AppShellDashboardInvoiceTableGovernedComponents,
} from "./app-shell-dashboard-invoice-table";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";

const pastDueInvoiceRows = defaultAppShellDashboardInvoices.filter(
  (row) => row.status.kind === "past_due"
);

const draftInvoiceRows = defaultAppShellDashboardInvoices.filter(
  (row) => row.status.kind === "draft"
);

const outstandingInvoiceRows = defaultAppShellDashboardInvoices.filter(
  (row) => row.balance > 0
);

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Dashboard/InvoiceTable",
    component: AppShellDashboardInvoiceTable,
    args: {
      rows: defaultAppShellDashboardInvoices,
    },
  }),
  render: (args) =>
    renderDashboardBlockStory(AppShellDashboardInvoiceTable, args),
} satisfies Meta<typeof AppShellDashboardInvoiceTable>;

export type InvoiceTableStoriesGovernedComponents =
  AppShellDashboardInvoiceTableGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PastDue: Story = {
  args: {
    rows: pastDueInvoiceRows,
    subtitle: "Overdue balances requiring collections follow-up",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Past-due status dots, danger balance text, and payment-reminder row actions.",
      },
    },
  },
};

export const DraftQueue: Story = {
  args: {
    rows: draftInvoiceRows,
    subtitle: "Draft invoices awaiting review and send",
  },
  parameters: {
    docs: {
      description: {
        story: "Draft status styling with send-to-client overflow actions.",
      },
    },
  },
};

export const OutstandingBalances: Story = {
  args: {
    rows: outstandingInvoiceRows,
    subtitle: "Open balances across active receivables",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Open balances across receivables — amount, status dot, and balance columns.",
      },
    },
  },
};

export const Empty: Story = {
  args: { rows: [] },
  parameters: {
    docs: {
      description: {
        story: "Source-empty ledger with create-invoice call to action.",
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
