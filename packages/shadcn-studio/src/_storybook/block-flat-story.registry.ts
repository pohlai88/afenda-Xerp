import type { ComponentType } from "react";

import {
  ChartEarningReportSample,
  ChartSalesMetricsSample,
  ChartTotalRevenueSample,
  DashboardDialog03Sample,
  DashboardDialog09Sample,
  DatatableInvoiceSample,
  DatatableProductSample,
  DatatableUserSample,
  DialogActivitySample,
  DialogSearchSample,
  DropdownLanguageSample,
  DropdownNotificationSample,
  DropdownProfileSample,
  MenuTriggerSample,
  SidebarUserDropdownSample,
  StatisticsActivityCardSample,
  StatisticsCard01Sample,
  StatisticsCard02Sample,
  StatisticsCard03Sample,
  StatisticsCard04Sample,
  StatisticsExpenseCardSample,
  StatisticsIncomeCardSample,
  StatisticsLeadsCardSample,
  StatisticsLineTrendsCardSample,
  StatisticsOrdersProgressCardSample,
  StatisticsProfileTrafficCardSample,
  StatisticsRevenueCardSample,
  StatisticsSalesOverviewCardSample,
  StatisticsTrendCardSample,
  WidgetPaymentHistorySample,
  WidgetSalesByCountriesSample,
  WidgetTotalEarningSample,
  WidgetTransactionsSample,
} from "./block-flat-story.compositions.js";

export type FlatBlockStoryLayout = "centered" | "fullscreen" | "padded";

export interface FlatBlockStoryEntry {
  readonly layout: FlatBlockStoryLayout;
  readonly sample: ComponentType;
  readonly slug: string;
  readonly storyName: string;
}

/** Curated flat-block story registry — sync with block-story-manifest.generated.json manualStoryRequired. */
export const FLAT_BLOCK_STORY_REGISTRY = [
  {
    slug: "chart-earning-report",
    storyName: "ChartEarningReport",
    sample: ChartEarningReportSample,
    layout: "centered",
  },
  {
    slug: "chart-sales-metrics",
    storyName: "ChartSalesMetrics",
    sample: ChartSalesMetricsSample,
    layout: "centered",
  },
  {
    slug: "chart-total-revenue",
    storyName: "ChartTotalRevenue",
    sample: ChartTotalRevenueSample,
    layout: "centered",
  },
  {
    slug: "dashboard-dialog-03",
    storyName: "DashboardDialog03",
    sample: DashboardDialog03Sample,
    layout: "centered",
  },
  {
    slug: "dashboard-dialog-09",
    storyName: "DashboardDialog09",
    sample: DashboardDialog09Sample,
    layout: "centered",
  },
  {
    slug: "datatable-invoice",
    storyName: "DatatableInvoice",
    sample: DatatableInvoiceSample,
    layout: "fullscreen",
  },
  {
    slug: "datatable-user",
    storyName: "DatatableUser",
    sample: DatatableUserSample,
    layout: "fullscreen",
  },
  {
    slug: "datatable-product",
    storyName: "DatatableProduct",
    sample: DatatableProductSample,
    layout: "fullscreen",
  },
  {
    slug: "dialog-activity",
    storyName: "DialogActivity",
    sample: DialogActivitySample,
    layout: "centered",
  },
  {
    slug: "dialog-search",
    storyName: "DialogSearch",
    sample: DialogSearchSample,
    layout: "centered",
  },
  {
    slug: "dropdown-language",
    storyName: "DropdownLanguage",
    sample: DropdownLanguageSample,
    layout: "centered",
  },
  {
    slug: "dropdown-notification",
    storyName: "DropdownNotification",
    sample: DropdownNotificationSample,
    layout: "centered",
  },
  {
    slug: "dropdown-profile",
    storyName: "DropdownProfile",
    sample: DropdownProfileSample,
    layout: "centered",
  },
  {
    slug: "menu-trigger",
    storyName: "MenuTrigger",
    sample: MenuTriggerSample,
    layout: "fullscreen",
  },
  {
    slug: "sidebar-user-dropdown",
    storyName: "SidebarUserDropdown",
    sample: SidebarUserDropdownSample,
    layout: "padded",
  },
  {
    slug: "statistics-activity-card",
    storyName: "StatisticsActivityCard",
    sample: StatisticsActivityCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-card-01",
    storyName: "StatisticsCard01",
    sample: StatisticsCard01Sample,
    layout: "centered",
  },
  {
    slug: "statistics-card-02",
    storyName: "StatisticsCard02",
    sample: StatisticsCard02Sample,
    layout: "centered",
  },
  {
    slug: "statistics-card-03",
    storyName: "StatisticsCard03",
    sample: StatisticsCard03Sample,
    layout: "centered",
  },
  {
    slug: "statistics-card-04",
    storyName: "StatisticsCard04",
    sample: StatisticsCard04Sample,
    layout: "centered",
  },
  {
    slug: "statistics-expense-card",
    storyName: "StatisticsExpenseCard",
    sample: StatisticsExpenseCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-income-card",
    storyName: "StatisticsIncomeCard",
    sample: StatisticsIncomeCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-leads-card",
    storyName: "StatisticsLeadsCard",
    sample: StatisticsLeadsCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-line-trends-card",
    storyName: "StatisticsLineTrendsCard",
    sample: StatisticsLineTrendsCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-orders-progress-card",
    storyName: "StatisticsOrdersProgressCard",
    sample: StatisticsOrdersProgressCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-profile-traffic-card",
    storyName: "StatisticsProfileTrafficCard",
    sample: StatisticsProfileTrafficCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-revenue-card",
    storyName: "StatisticsRevenueCard",
    sample: StatisticsRevenueCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-sales-overview-card",
    storyName: "StatisticsSalesOverviewCard",
    sample: StatisticsSalesOverviewCardSample,
    layout: "centered",
  },
  {
    slug: "statistics-trend-card",
    storyName: "StatisticsTrendCard",
    sample: StatisticsTrendCardSample,
    layout: "centered",
  },
  {
    slug: "widget-payment-history",
    storyName: "WidgetPaymentHistory",
    sample: WidgetPaymentHistorySample,
    layout: "centered",
  },
  {
    slug: "widget-sales-by-countries",
    storyName: "WidgetSalesByCountries",
    sample: WidgetSalesByCountriesSample,
    layout: "centered",
  },
  {
    slug: "widget-total-earning",
    storyName: "WidgetTotalEarning",
    sample: WidgetTotalEarningSample,
    layout: "centered",
  },
  {
    slug: "widget-transactions",
    storyName: "WidgetTransactions",
    sample: WidgetTransactionsSample,
    layout: "centered",
  },
] as const satisfies readonly FlatBlockStoryEntry[];
