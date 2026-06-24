import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as invoiceTableStories from "../shadcn-studio/blocks/app-shell-dashboard-invoice-table.stories";
import * as kpiStatStories from "../shadcn-studio/blocks/app-shell-dashboard-kpi-stat.stories";
import * as moduleEarningsStories from "../shadcn-studio/blocks/app-shell-dashboard-module-earnings.stories";
import * as paymentHistoryStories from "../shadcn-studio/blocks/app-shell-dashboard-payment-history.stories";
import * as recentTransactionsStories from "../shadcn-studio/blocks/app-shell-dashboard-recent-transactions.stories";
import * as regionalSalesStories from "../shadcn-studio/blocks/app-shell-dashboard-regional-sales.stories";
import * as revenueChartStories from "../shadcn-studio/blocks/app-shell-dashboard-revenue-chart.stories";
import * as sparklineStatStories from "../shadcn-studio/blocks/app-shell-dashboard-sparkline-stat.stories";
import * as statisticsExpenseCardStories from "../shadcn-studio/blocks/app-shell-dashboard-statistics-expense-card.stories";
import * as statisticsIncomeCardStories from "../shadcn-studio/blocks/app-shell-dashboard-statistics-income-card.stories";
import * as statisticsLineTrendsStories from "../shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends.stories";
import * as statisticsMetricsStories from "../shadcn-studio/blocks/app-shell-dashboard-statistics-metrics.stories";
import {
  composePortableStories,
  composePortableStory,
} from "./setup/portable-stories";

const { Default: KpiStatDefault } = composePortableStories(kpiStatStories);
const { Default: SparklineStatDefault } =
  composePortableStories(sparklineStatStories);
const { Default: StatisticsIncomeCardDefault } = composePortableStories(
  statisticsIncomeCardStories
);
const { Default: StatisticsExpenseCardDefault } = composePortableStories(
  statisticsExpenseCardStories
);
const { Default: InvoiceTableDefault } =
  composePortableStories(invoiceTableStories);
const { Default: ModuleEarningsDefault } = composePortableStories(
  moduleEarningsStories
);
const { Default: PaymentHistoryDefault } = composePortableStories(
  paymentHistoryStories
);
const { Default: RecentTransactionsDefault } = composePortableStories(
  recentTransactionsStories
);
const { Default: RegionalSalesDefault } =
  composePortableStories(regionalSalesStories);
const { Default: RevenueChartDefault } =
  composePortableStories(revenueChartStories);
const { Default: StatisticsMetricsDefault } = composePortableStories(
  statisticsMetricsStories
);
const { Default: StatisticsLineTrendsDefault } = composePortableStories(
  statisticsLineTrendsStories
);

describe("Dashboard block stories (portable CSF)", () => {
  it("KpiStat Default renders without TIP-004 throw", () => {
    render(<KpiStatDefault />);
    expect(screen.getByText("Net income")).toBeInTheDocument();
  });

  it("SparklineStat Default renders without TIP-004 throw", () => {
    render(<SparklineStatDefault />);
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
  });

  it("StatisticsIncomeCard Default renders without TIP-004 throw", () => {
    render(<StatisticsIncomeCardDefault />);
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
  });

  it("StatisticsExpenseCard Default renders without TIP-004 throw", () => {
    render(<StatisticsExpenseCardDefault />);
    expect(screen.getByText("Operating expenses")).toBeInTheDocument();
  });

  it("KpiStat OpenTasks renders declining change as plain secondary text", () => {
    const OpenTasks = composePortableStory(kpiStatStories, "OpenTasks");
    render(<OpenTasks />);
    expect(screen.getByText("Open tasks")).toBeInTheDocument();
    expect(screen.getByText("-4.5%")).toHaveClass(
      "app-shell-studio-metric__change"
    );
  });

  it("KpiStat NetIncome renders primary accent emphasis", () => {
    const NetIncome = composePortableStory(kpiStatStories, "NetIncome");
    const { container } = render(<NetIncome />);
    expect(
      container.querySelector(
        '.app-shell-studio-metric-card[data-emphasis="primary"]'
      )
    ).not.toBeNull();
  });

  it("InvoiceTable Default renders without TIP-004 throw", () => {
    render(<InvoiceTableDefault />);
    expect(screen.getByText("Accounts receivable")).toBeInTheDocument();
  });

  it("ModuleEarnings Default renders without TIP-004 throw", () => {
    render(<ModuleEarningsDefault />);
    expect(screen.getByText("Module revenue")).toBeInTheDocument();
  });

  it("ModuleEarnings Empty renders governed empty copy", () => {
    const Empty = composePortableStory(moduleEarningsStories, "Empty");
    render(<Empty />);
    expect(screen.getByText(/No module revenue yet/i)).toBeInTheDocument();
  });

  it("ModuleEarnings DecliningModule renders plain secondary change text", () => {
    const DecliningModule = composePortableStory(
      moduleEarningsStories,
      "DecliningModule"
    );
    const { container } = render(<DecliningModule />);
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    const rowChangeValues = container.querySelectorAll(
      ".app-shell-dashboard-breakdown-metrics .app-shell-dashboard-breakdown-change-value"
    );
    expect(rowChangeValues).toHaveLength(1);
    expect(rowChangeValues[0]).toHaveTextContent("-2.1%");
  });

  it("PaymentHistory Default renders without TIP-004 throw", () => {
    render(<PaymentHistoryDefault />);
    expect(screen.getByText("Corporate card spend")).toBeInTheDocument();
  });

  it("RecentTransactions Default renders without TIP-004 throw", () => {
    render(<RecentTransactionsDefault />);
    expect(screen.getByText("Recent transactions")).toBeInTheDocument();
  });

  it("RegionalSales Default renders without TIP-004 throw", () => {
    render(<RegionalSalesDefault />);
    expect(screen.getByText("Revenue by region")).toBeInTheDocument();
  });

  it("RevenueChart Default renders without TIP-004 throw", () => {
    render(<RevenueChartDefault />);
    expect(screen.getByText("Total revenue")).toBeInTheDocument();
  });

  it("StatisticsMetrics Default renders without TIP-004 throw", () => {
    render(<StatisticsMetricsDefault />);
    expect(screen.getByText("Revenue growth")).toBeInTheDocument();
  });

  it("StatisticsLineTrends Default renders without TIP-004 throw", () => {
    render(<StatisticsLineTrendsDefault />);
    expect(screen.getByText("Daily orders")).toBeInTheDocument();
  });

  it("InvoiceTable Empty renders governed empty copy", () => {
    const Empty = composePortableStory(invoiceTableStories, "Empty");
    render(<Empty />);
    expect(screen.getByText(/No invoices yet/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Create invoice/i }).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("InvoiceTable PastDue renders overdue invoice status", () => {
    const PastDue = composePortableStory(invoiceTableStories, "PastDue");
    render(<PastDue />);
    expect(screen.getByText("Northwind Traders")).toBeInTheDocument();
    expect(
      document.querySelector(
        '.app-shell-studio-invoice-status-dot[data-status="past_due"]'
      )
    ).not.toBeNull();
    expect(
      document.querySelector(".app-shell-studio-invoice-amount-danger")
    ).toHaveTextContent("$8,600.00");
    expect(
      screen.getByText(/Overdue balances requiring collections follow-up/)
    ).toBeInTheDocument();
  });

  it("RegionalSales Empty renders governed empty copy", () => {
    const Empty = composePortableStory(regionalSalesStories, "Empty");
    render(<Empty />);
    expect(screen.getByText(/No regional revenue yet/i)).toBeInTheDocument();
  });

  it("C2: KPI and sparkline numeric cells use studio tabular-nums classes", () => {
    const { container: kpiContainer } = render(<KpiStatDefault />);
    expect(
      kpiContainer.querySelector(".app-shell-studio-metric__value")
    ).toBeInTheDocument();
    expect(
      kpiContainer.querySelector(".app-shell-studio-metric__change")
    ).toBeInTheDocument();

    const { container: sparklineContainer } = render(<SparklineStatDefault />);
    expect(
      sparklineContainer.querySelector(".app-shell-studio-sparkline__amount")
    ).toBeInTheDocument();
    expect(
      sparklineContainer.querySelector(".app-shell-studio-sparkline__change")
    ).toBeInTheDocument();

    render(<InvoiceTableDefault />);
    expect(
      document.querySelector(".app-shell-studio-invoice-amount")
    ).not.toBeNull();
  });

  it("C5: dashboard block stories import Lucide icons only", () => {
    const blockDir = join(import.meta.dirname, "../shadcn-studio/blocks");
    const blockFiles = readdirSync(blockDir).filter(
      (name) => name.endsWith(".tsx") && !name.endsWith(".stories.tsx")
    );
    const forbidden = /from\s+["'](?:react-icons|@heroicons)/;

    for (const file of blockFiles) {
      const source = readFileSync(join(blockDir, file), "utf8");
      expect(forbidden.test(source), `${file} must use lucide-react only`).toBe(
        false
      );
    }
  });

  it("C8: reference KPI and sparkline block stories exist and render", () => {
    expect(kpiStatStories.Default).toBeDefined();
    expect(sparklineStatStories.Default).toBeDefined();
    render(<KpiStatDefault />);
    render(<SparklineStatDefault />);
    expect(screen.getByText("Net income")).toBeInTheDocument();
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
  });
});
