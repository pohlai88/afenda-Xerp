"use client";

import {
  BanknoteIcon,
  CreditCardIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { TotalOrdersCardSvg } from "../components-assets/index.js";

import ChartEarningReportBlock from "../components-layouts/chart-earning-report.js";
import ChartSalesMetricsBlock from "../components-layouts/chart-sales-metrics.js";
import ChartTotalRevenueBlock from "../components-layouts/chart-total-revenue.js";
import AddPaymentMethodDialog from "../components-layouts/dashboard-dialog-03/dialog-add-payment-method.js";
import VerifyDialog from "../components-layouts/dashboard-dialog-09/dialog-verify.js";
import DatatableInvoiceBlock from "../components-layouts/datatable-invoice.js";
import DatatableProductBlock from "../components-layouts/datatable-product.js";
import DatatableUserBlock from "../components-layouts/datatable-user.js";
import ActivityDialog from "../components-layouts/dialog-activity.js";
import SearchDialog from "../components-layouts/dialog-search.js";
import LanguageDropdown from "../components-layouts/dropdown-language.js";
import NotificationDropdown from "../components-layouts/dropdown-notification.js";
import ProfileDropdown from "../components-layouts/dropdown-profile.js";
import MenuTriggerBlock from "../components-layouts/menu-trigger.js";
import SidebarUserDropdownBlock from "../components-layouts/sidebar-user-dropdown.js";
import StatisticsActivityCardBlock from "../components-layouts/statistics-activity-card.js";
import StatisticsCard01Block from "../components-layouts/statistics-card-01.js";
import StatisticsCard02Block from "../components-layouts/statistics-card-02.js";
import StatisticsCard03Block from "../components-layouts/statistics-card-03.js";
import StatisticsCard04Block from "../components-layouts/statistics-card-04.js";
import StatisticsExpenseCardBlock from "../components-layouts/statistics-expense-card.js";
import StatisticsIncomeCardBlock from "../components-layouts/statistics-income-card.js";
import StatisticsLeadsCardBlock from "../components-layouts/statistics-leads-card.js";
import MetricTrendCardBlock from "../components-layouts/statistics-line-trends-card.js";
import StatisticsOrdersProgressCardBlock from "../components-layouts/statistics-orders-progress-card.js";
import StatisticsProfileTrafficCardBlock from "../components-layouts/statistics-profile-traffic-card.js";
import StatisticsRevenueCardBlock from "../components-layouts/statistics-revenue-card.js";
import StatisticsSalesOverviewCardBlock from "../components-layouts/statistics-sales-overview-card.js";
import StatisticsTrendCardBlock from "../components-layouts/statistics-trend-card.js";
import PaymentHistoryCard from "../components-layouts/widget-payment-history.js";
import SalesByCountryCard from "../components-layouts/widget-sales-by-countries.js";
import TotalEarningCard from "../components-layouts/widget-total-earning.js";
import TransactionsCard from "../components-layouts/widget-transactions.js";
import { Button } from "../components-ui/button.js";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "../components-ui/sidebar.js";

import {
  CHART_EARNING_DATA,
  METRIC_TREND_DATA,
  METRIC_TREND_SERIES,
  STATISTICS_TREND_DATA,
  WIDGET_PAYMENT_HISTORY,
  WIDGET_SALES_BY_COUNTRIES,
  WIDGET_TOTAL_EARNING_ROWS,
  WIDGET_TRANSACTIONS,
} from "./block-flat-story-fixtures.js";

const TRANSACTION_ICONS: Record<
  (typeof WIDGET_TRANSACTIONS)[number]["icon"],
  ComponentType
> = {
  CreditCard: CreditCardIcon,
  Wallet: WalletIcon,
  Banknote: BanknoteIcon,
};

export function StoryTriggerButton({ children }: { children: ReactNode }) {
  return (
    <Button type="button" variant="outline">
      {children}
    </Button>
  );
}

export function SidebarStorySurface({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarContent className="gap-4 p-4">
          <SidebarUserDropdownBlock />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex items-center gap-4 p-6">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export function ChartEarningReportSample() {
  return (
    <ChartEarningReportBlock
      chartData={[...CHART_EARNING_DATA]}
      statData={[
        {
          department: "Sales",
          icon: <DollarSignIcon className="size-5" />,
          percentage: 12.5,
          title: "Total sales",
          trend: "up",
          value: "$54,890",
        },
        {
          department: "Marketing",
          icon: <TrendingUpIcon className="size-5" />,
          percentage: 8.2,
          title: "Campaign ROI",
          trend: "up",
          value: "$12,430",
        },
      ]}
      subTitle="Weekly performance"
      title="Earning report"
    />
  );
}

export function ChartSalesMetricsSample() {
  return <ChartSalesMetricsBlock />;
}

export function ChartTotalRevenueSample() {
  return <ChartTotalRevenueBlock />;
}

export function DashboardDialog03Sample() {
  return (
    <AddPaymentMethodDialog
      trigger={<StoryTriggerButton>Add payment method</StoryTriggerButton>}
    />
  );
}

export function DashboardDialog09Sample() {
  return (
    <VerifyDialog
      trigger={<StoryTriggerButton>Verify account</StoryTriggerButton>}
    />
  );
}

export function DatatableInvoiceSample() {
  return (
    <DatatableInvoiceBlock
      data={[
        {
          id: "inv_preview_01",
          status: "paid",
          avatar: "",
          fallback: "AC",
          client: "Acme Corp",
          field: "Consulting",
          total: 1200,
          issuedDate: new Date("2026-01-15"),
          balance: 0,
        },
      ]}
    />
  );
}

export function DatatableUserSample() {
  return (
    <DatatableUserBlock
      data={[
        {
          id: "user_preview_01",
          avatar: "",
          fallback: "JD",
          user: "Jane Doe",
          email: "jane.doe@example.com",
          role: "admin",
          plan: "enterprise",
          status: "active",
          billing: "auto-debit",
        },
      ]}
    />
  );
}

export function DatatableProductSample() {
  return (
    <DatatableProductBlock
      data={[
        {
          id: "product_preview_01",
          productImage: "",
          product: "Studio Headphones",
          brand: "Acme Audio",
          category: "headphone",
          stock: "available",
          amount: 199,
          quantity: 42,
          status: "publish",
        },
      ]}
    />
  );
}

export function DialogActivitySample() {
  return (
    <ActivityDialog
      trigger={<StoryTriggerButton>Open activity</StoryTriggerButton>}
    />
  );
}

export function DialogSearchSample() {
  return (
    <SearchDialog
      trigger={<StoryTriggerButton>Search workspace</StoryTriggerButton>}
    />
  );
}

export function DropdownLanguageSample() {
  return (
    <LanguageDropdown
      trigger={<StoryTriggerButton>Language</StoryTriggerButton>}
    />
  );
}

export function DropdownNotificationSample() {
  return (
    <NotificationDropdown
      trigger={<StoryTriggerButton>Notifications</StoryTriggerButton>}
    />
  );
}

export function DropdownProfileSample() {
  return (
    <ProfileDropdown
      trigger={<StoryTriggerButton>Profile menu</StoryTriggerButton>}
    />
  );
}

export function MenuTriggerSample() {
  return (
    <SidebarStorySurface>
      <MenuTriggerBlock />
    </SidebarStorySurface>
  );
}

export function SidebarUserDropdownSample() {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarContent className="p-4">
          <SidebarUserDropdownBlock />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export function StatisticsActivityCardSample() {
  return <StatisticsActivityCardBlock />;
}

export function StatisticsCard01Sample() {
  return (
    <StatisticsCard01Block
      changePercentage="+12.5%"
      icon={<DollarSignIcon className="size-4" />}
      title="Total revenue"
      value="$45,231"
    />
  );
}

export function StatisticsCard02Sample() {
  return (
    <StatisticsCard02Block
      changePercentage={18}
      icon={<UsersIcon className="size-4" />}
      title="Active users"
      value="8,420"
    />
  );
}

export function StatisticsCard03Sample() {
  return (
    <StatisticsCard03Block
      badgeContent="Monthly"
      changePercentage="+6.2%"
      icon={<ShoppingCartIcon className="size-4" />}
      title="Orders"
      trend="up"
      value="1,284"
    />
  );
}

export function StatisticsCard04Sample() {
  return (
    <StatisticsCard04Block
      badgeContent="Monthly"
      changePercentage={4.8}
      svg={<TotalOrdersCardSvg />}
      title="Conversion rate"
      value="3.42%"
    />
  );
}

export function StatisticsExpenseCardSample() {
  return <StatisticsExpenseCardBlock />;
}

export function StatisticsIncomeCardSample() {
  return <StatisticsIncomeCardBlock />;
}

export function StatisticsLeadsCardSample() {
  return <StatisticsLeadsCardBlock />;
}

export function StatisticsLineTrendsCardSample() {
  return (
    <MetricTrendCardBlock
      data={[...METRIC_TREND_DATA]}
      series={[METRIC_TREND_SERIES[0], METRIC_TREND_SERIES[1]]}
      title="Weekly trends"
    />
  );
}

export function StatisticsOrdersProgressCardSample() {
  return <StatisticsOrdersProgressCardBlock />;
}

export function StatisticsProfileTrafficCardSample() {
  return <StatisticsProfileTrafficCardBlock />;
}

export function StatisticsRevenueCardSample() {
  return <StatisticsRevenueCardBlock />;
}

export function StatisticsSalesOverviewCardSample() {
  return <StatisticsSalesOverviewCardBlock />;
}

export function StatisticsTrendCardSample() {
  return (
    <StatisticsTrendCardBlock
      data={[...STATISTICS_TREND_DATA]}
      dataKey="value"
      dateKey="date"
      format="currency"
      title="Revenue trend"
    />
  );
}

export function WidgetPaymentHistorySample() {
  return (
    <PaymentHistoryCard
      paymentData={[...WIDGET_PAYMENT_HISTORY]}
      title="Payment history"
    />
  );
}

export function WidgetSalesByCountriesSample() {
  return (
    <SalesByCountryCard
      salesData={[...WIDGET_SALES_BY_COUNTRIES]}
      subTitle="Top regions this month"
      title="Sales by country"
    />
  );
}

export function WidgetTotalEarningSample() {
  return (
    <TotalEarningCard
      comparisonText="vs last month"
      earning={24_680}
      earningData={[...WIDGET_TOTAL_EARNING_ROWS]}
      percentage={12.4}
      title="Total earning"
      trend="up"
    />
  );
}

export function WidgetTransactionsSample() {
  return (
    <TransactionsCard
      title="Recent transactions"
      transactions={WIDGET_TRANSACTIONS.map((row) => ({
        ...row,
        icon: TRANSACTION_ICONS[row.icon],
      }))}
    />
  );
}

/** Multi-block dashboard preview — operator surface composition lab. */
export function DashboardBlocksPreviewSample() {
  return (
    <div className="flex min-h-screen flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl">Dashboard preview</h1>
        <p className="text-muted-foreground text-sm">
          PAS-006 multi-block composition — metrics, charts, and table fixtures.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsCard01Sample />
        <StatisticsRevenueCardSample />
        <StatisticsExpenseCardSample />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartEarningReportSample />
        <WidgetTransactionsSample />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <StatisticsTrendCardSample />
        <StatisticsSalesOverviewCardSample />
      </div>
      <DatatableInvoiceSample />
    </div>
  );
}
