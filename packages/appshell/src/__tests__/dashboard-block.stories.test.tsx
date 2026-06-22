import { composePortableStories, composePortableStory } from "./setup/portable-stories";
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
import * as statisticsLineTrendsStories from "../shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends.stories";
import * as statisticsMetricsStories from "../shadcn-studio/blocks/app-shell-dashboard-statistics-metrics.stories";

const { Default: KpiStatDefault } = composePortableStories(kpiStatStories);
const { Default: SparklineStatDefault } = composePortableStories(sparklineStatStories);
const { Default: InvoiceTableDefault } = composePortableStories(invoiceTableStories);
const { Default: ModuleEarningsDefault } = composePortableStories(moduleEarningsStories);
const { Default: PaymentHistoryDefault } = composePortableStories(paymentHistoryStories);
const { Default: RecentTransactionsDefault } = composePortableStories(recentTransactionsStories);
const { Default: RegionalSalesDefault } = composePortableStories(regionalSalesStories);
const { Default: RevenueChartDefault } = composePortableStories(revenueChartStories);
const { Default: StatisticsMetricsDefault } = composePortableStories(statisticsMetricsStories);
const { Default: StatisticsLineTrendsDefault } = composePortableStories(statisticsLineTrendsStories);

describe("Dashboard block stories (portable CSF)", () => {
  it("KpiStat Default renders without TIP-004 throw", () => {
    render(<KpiStatDefault />);
    expect(screen.getByText("Net income")).toBeInTheDocument();
  });

  it("SparklineStat Default renders without TIP-004 throw", () => {
    render(<SparklineStatDefault />);
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
  });

  it("InvoiceTable Default renders without TIP-004 throw", () => {
    render(<InvoiceTableDefault />);
    expect(screen.getByText("Accounts receivable")).toBeInTheDocument();
  });

  it("ModuleEarnings Default renders without TIP-004 throw", () => {
    render(<ModuleEarningsDefault />);
    expect(screen.getByText("Module revenue")).toBeInTheDocument();
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
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  it("InvoiceTable Empty renders governed empty copy", () => {
    const Empty = composePortableStory(invoiceTableStories, "Empty");
    render(<Empty />);
    expect(screen.getByText(/No invoices match your filters/i)).toBeInTheDocument();
  });

  it("RegionalSales Empty renders governed empty copy", () => {
    const Empty = composePortableStory(regionalSalesStories, "Empty");
    render(<Empty />);
    expect(screen.getByText(/No regional revenue yet/i)).toBeInTheDocument();
  });
});
