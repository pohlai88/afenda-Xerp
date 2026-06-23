import {
  BarChart3Icon,
  BriefcaseIcon,
  CircleDollarSignIcon,
  Columns3Icon,
  DollarSignIcon,
  DownloadIcon,
  FileDownIcon,
  PackageIcon,
  RefreshCwIcon,
  Settings2Icon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import {
  asAppShellDashboardRowId,
  asAppShellInvoiceId,
  type AppShellDashboardInvoiceRow,
  type AppShellDashboardKpiMetric,
  type AppShellDashboardOverflowMenuItem,
  type AppShellDashboardModuleEarningRow,
  type AppShellDashboardPaymentHistoryRow,
  type AppShellDashboardRegionalSalesRow,
  type AppShellDashboardRevenueBarPoint,
  type AppShellDashboardRevenueGrowthSlice,
  type AppShellDashboardRevenueYearSummary,
  type AppShellDashboardSparklineMetric,
  type AppShellDashboardTransactionRow,
  type AppShellTrendDirection,
} from "./app-shell.dashboard.types";

export const DEFAULT_APP_SHELL_DASHBOARD_LABEL = "ERP overview dashboard";
export const DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL = "vs last month";
export const DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TITLE = "Module revenue";
export const DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_SUBTITLE =
  "FY2026 Q2 · consolidated by business unit";
export const DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_COMPARISON =
  "Compared to Q1 FY2026";
export const DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_TITLE = "Recent transactions";
export const DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_SUBTITLE =
  "Jun 2026 · cross-module ledger activity";
export const DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_COMPARISON =
  "Net flow across AP, AR, payroll, and inventory";
export const DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_TITLE = "Revenue by region";
export const DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_SUBTITLE =
  "FY2026 Q2 · consolidated";
export const DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_COMPARISON =
  "Weighted change vs Q1 FY2026";
export const DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_TITLE = "Corporate card spend";
export const DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_SUBTITLE =
  "FY2026 Q2 · corporate card programs";
export const DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_COMPARISON =
  "Spend vs allocated limits · current billing cycle";
export const DEFAULT_APP_SHELL_DASHBOARD_INVOICES_TITLE = "Accounts receivable";
export const DEFAULT_APP_SHELL_DASHBOARD_INVOICES_SUBTITLE =
  "Open invoices across all business units";
const dashboardInvoiceOverflowItemsSource = [
  {
    id: "invoice-export-csv",
    label: "Export CSV",
    Icon: FileDownIcon,
    shortcut: "⌘⇧E",
    section: "primary",
  },
  {
    id: "invoice-refresh",
    label: "Refresh",
    Icon: RefreshCwIcon,
    shortcut: "⌘R",
    section: "primary",
  },
  {
    id: "invoice-configure-columns",
    label: "Configure columns",
    Icon: Columns3Icon,
    section: "secondary",
  },
] as const satisfies readonly AppShellDashboardOverflowMenuItem[];

export const DEFAULT_APP_SHELL_DASHBOARD_INVOICE_OVERFLOW_ITEMS: readonly AppShellDashboardOverflowMenuItem[] =
  dashboardInvoiceOverflowItemsSource;

export const DEFAULT_APP_SHELL_DASHBOARD_REVENUE_TITLE = "Total revenue";
export const DEFAULT_APP_SHELL_DASHBOARD_REVENUE_SUBTITLE =
  "FY2026 · monthly YoY variance by period";
export const DEFAULT_APP_SHELL_DASHBOARD_REVENUE_COMPARISON =
  "Stacked bars compare current fiscal year against prior-year baseline";
export const DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_LABEL = "78%";
export const DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_CAPTION = "62% company growth";

const dashboardOverflowItemsSource = [
  {
    id: "widget-export",
    label: "Export",
    Icon: DownloadIcon,
    shortcut: "⌘E",
    section: "primary",
  },
  {
    id: "widget-refresh",
    label: "Refresh",
    Icon: RefreshCwIcon,
    shortcut: "⌘R",
    section: "primary",
  },
  {
    id: "widget-configure",
    label: "Configure",
    Icon: Settings2Icon,
    section: "secondary",
  },
] as const satisfies readonly AppShellDashboardOverflowMenuItem[];

export const DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS: readonly AppShellDashboardOverflowMenuItem[] =
  dashboardOverflowItemsSource;

const revenueSparklineSource = [
  { date: "2026-05-24", value: 190 },
  { date: "2026-05-25", value: 285 },
  { date: "2026-05-26", value: 420 },
  { date: "2026-05-27", value: 280 },
  { date: "2026-05-28", value: 250 },
  { date: "2026-05-29", value: 500 },
  { date: "2026-05-30", value: 550 },
  { date: "2026-05-31", value: 300 },
] as const satisfies AppShellDashboardSparklineMetric["data"];

const expenseSparklineSource = [
  { date: "2026-05-14", value: 290 },
  { date: "2026-05-15", value: 360 },
  { date: "2026-05-16", value: 360 },
  { date: "2026-05-17", value: 360 },
  { date: "2026-05-18", value: 400 },
  { date: "2026-05-19", value: 550 },
  { date: "2026-05-20", value: 590 },
  { date: "2026-05-21", value: 500 },
  { date: "2026-05-22", value: 450 },
  { date: "2026-05-23", value: 460 },
  { date: "2026-05-24", value: 400 },
  { date: "2026-05-25", value: 350 },
  { date: "2026-05-26", value: 320 },
  { date: "2026-05-27", value: 300 },
] as const satisfies AppShellDashboardSparklineMetric["data"];

const sparklineMetricsSource = [
  {
    id: asAppShellDashboardRowId("sparkline-revenue"),
    metricKey: "revenue",
    title: "Revenue this month",
    amount: "$248,720",
    changeLabel: "+14.2%",
    trend: "up",
    data: revenueSparklineSource,
  },
  {
    id: asAppShellDashboardRowId("sparkline-expense"),
    metricKey: "expense",
    title: "Operating expenses",
    amount: "$89,340",
    changeLabel: "-8.6%",
    trend: "down",
    data: expenseSparklineSource,
  },
] as const satisfies readonly AppShellDashboardSparklineMetric[];

const kpiMetricsSource = [
  {
    id: asAppShellDashboardRowId("kpi-net-income"),
    title: "Net income",
    badge: "Q2 FY2026",
    value: "$159,380",
    changePercentage: 12.4,
    Icon: TrendingUpIcon,
  },
  {
    id: asAppShellDashboardRowId("kpi-active-orders"),
    title: "Active orders",
    badge: "Live",
    value: "1,284",
    changePercentage: 6.8,
    Icon: ShoppingCartIcon,
  },
  {
    id: asAppShellDashboardRowId("kpi-headcount"),
    title: "Headcount",
    badge: "FTE",
    value: "247",
    changePercentage: 2.1,
    Icon: UsersIcon,
  },
  {
    id: asAppShellDashboardRowId("kpi-open-tasks"),
    title: "Open tasks",
    badge: "This week",
    value: "38",
    changePercentage: -4.5,
    Icon: BriefcaseIcon,
  },
] as const satisfies readonly AppShellDashboardKpiMetric[];

const moduleEarningsSource = [
  {
    id: asAppShellDashboardRowId("earning-finance"),
    module: "Finance",
    subtitle: "GL · AP · AR",
    amount: "$84,200",
    progress: 82,
    changeLabel: "+14.2%",
    trend: "up",
    iconSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    iconAlt: "Finance module",
  },
  {
    id: asAppShellDashboardRowId("earning-sales"),
    module: "Sales & CRM",
    subtitle: "Pipeline · Orders",
    amount: "$62,480",
    progress: 74,
    changeLabel: "+8.3%",
    trend: "up",
    iconSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png",
    iconAlt: "Sales module",
  },
  {
    id: asAppShellDashboardRowId("earning-inventory"),
    module: "Inventory",
    subtitle: "Stock · Warehouses",
    amount: "$41,960",
    progress: 58,
    changeLabel: "-2.1%",
    trend: "down",
    iconSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
    iconAlt: "Inventory module",
  },
] as const satisfies readonly AppShellDashboardModuleEarningRow[];

const transactionsSource = [
  {
    id: asAppShellDashboardRowId("txn-ap"),
    paymentMethod: "AP Invoice #8821",
    module: "Finance",
    amount: "$12,400",
    direction: "debit",
    Icon: DollarSignIcon,
  },
  {
    id: asAppShellDashboardRowId("txn-po"),
    paymentMethod: "Stock PO #4401",
    module: "Inventory",
    amount: "$8,760",
    direction: "debit",
    Icon: PackageIcon,
  },
  {
    id: asAppShellDashboardRowId("txn-so"),
    paymentMethod: "SO #2290 — Acme Corp",
    module: "Sales",
    amount: "$24,500",
    direction: "credit",
    Icon: ShoppingCartIcon,
  },
  {
    id: asAppShellDashboardRowId("txn-payroll"),
    paymentMethod: "Payroll run Jun 2026",
    module: "Human Resources",
    amount: "$91,200",
    direction: "debit",
    Icon: UsersIcon,
  },
  {
    id: asAppShellDashboardRowId("txn-project"),
    paymentMethod: "Milestone #7 — ERP Phase 2",
    module: "Projects",
    amount: "$42,000",
    direction: "credit",
    Icon: BarChart3Icon,
  },
] as const satisfies readonly AppShellDashboardTransactionRow[];

const regionalSalesSource = [
  {
    id: asAppShellDashboardRowId("region-na"),
    region: "North America",
    amount: "$112,400",
    changeLabel: "+18.4%",
    trend: "up",
    flagSrc:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=80&q=80",
    flagAlt: "North America region",
  },
  {
    id: asAppShellDashboardRowId("region-emea"),
    region: "EMEA",
    amount: "$78,920",
    changeLabel: "+9.1%",
    trend: "up",
    flagSrc:
      "https://images.unsplash.com/photo-1467269209830-ffa6ec839bec?auto=format&fit=crop&w=80&q=80",
    flagAlt: "EMEA region",
  },
  {
    id: asAppShellDashboardRowId("region-apac"),
    region: "APAC",
    amount: "$54,300",
    changeLabel: "-3.2%",
    trend: "down",
    flagSrc:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=80&q=80",
    flagAlt: "APAC region",
  },
  {
    id: asAppShellDashboardRowId("region-latam"),
    region: "LATAM",
    amount: "$31,100",
    changeLabel: "+5.7%",
    trend: "up",
    flagSrc:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=80&q=80",
    flagAlt: "LATAM region",
  },
] as const satisfies readonly AppShellDashboardRegionalSalesRow[];

const paymentHistorySource = [
  {
    id: asAppShellDashboardRowId("card-visa"),
    cardNumber: "4392",
    cardType: "Visa Corporate",
    date: "Jun 12, 2026",
    spend: "2,480",
    remaining: "17,520",
    brandIconSrc:
      "https://cdn.shadcnstudio.com/ss-assets/icon/icon-card-visa.png",
    brandIconAlt: "Visa",
  },
  {
    id: asAppShellDashboardRowId("card-amex"),
    cardNumber: "1184",
    cardType: "Amex Business",
    date: "Jun 10, 2026",
    spend: "980",
    remaining: "9,020",
    brandIconSrc:
      "https://cdn.shadcnstudio.com/ss-assets/icon/icon-card-amex.png",
    brandIconAlt: "American Express",
  },
  {
    id: asAppShellDashboardRowId("card-mastercard"),
    cardNumber: "7720",
    cardType: "Mastercard Fleet",
    date: "Jun 08, 2026",
    spend: "1,240",
    remaining: "8,760",
    brandIconSrc:
      "https://cdn.shadcnstudio.com/ss-assets/icon/icon-card-mastercard.png",
    brandIconAlt: "Mastercard",
  },
] as const satisfies readonly AppShellDashboardPaymentHistoryRow[];

const revenueBarSource = [
  { name: "January", priorYear: -13, currentYear: 21 },
  { name: "February", priorYear: -16, currentYear: 10 },
  { name: "March", priorYear: -14, currentYear: 13 },
  { name: "April", priorYear: -10, currentYear: 12 },
  { name: "May", priorYear: -17, currentYear: 20 },
  { name: "June", priorYear: -13, currentYear: 12 },
  { name: "July", priorYear: -12, currentYear: 15 },
] as const satisfies readonly AppShellDashboardRevenueBarPoint[];

const revenueGrowthSource = [
  { date: "2026-01-30", revenue: 12 },
  { date: "2026-02-12", revenue: 18 },
  { date: "2026-03-20", revenue: 22 },
  { date: "2026-04-12", revenue: 28 },
  { date: "2026-05-12", revenue: 35 },
  { date: "2026-06-01", revenue: 42 },
] as const satisfies readonly AppShellDashboardRevenueGrowthSlice[];

const revenueYearSummariesSource = [
  {
    id: asAppShellDashboardRowId("revenue-fy2026"),
    year: "FY2026",
    amount: "$248.7K",
    Icon: CircleDollarSignIcon,
  },
  {
    id: asAppShellDashboardRowId("revenue-fy2025"),
    year: "FY2025",
    amount: "$212.4K",
    Icon: WalletIcon,
  },
] as const satisfies readonly AppShellDashboardRevenueYearSummary[];

const invoiceRowsSource = [
  {
    id: asAppShellInvoiceId("5092"),
    status: { kind: "paid" },
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    avatarFallback: "AC",
    client: "Acme Manufacturing",
    field: "Net 30 · PO #8821",
    total: 12400,
    issuedDate: new Date("2026-06-01T00:00:00.000Z"),
    balance: 0,
  },
  {
    id: asAppShellInvoiceId("5093"),
    status: { kind: "past_due" },
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
    avatarFallback: "NT",
    client: "Northwind Traders",
    field: "Net 15 · SO #2290",
    total: 8600,
    issuedDate: new Date("2026-05-18T00:00:00.000Z"),
    balance: 8600,
  },
  {
    id: asAppShellInvoiceId("5094"),
    status: { kind: "draft" },
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png",
    avatarFallback: "GL",
    client: "Globex Logistics",
    field: "Milestone billing",
    total: 42000,
    issuedDate: new Date("2026-06-10T00:00:00.000Z"),
    balance: 42000,
  },
  {
    id: asAppShellInvoiceId("5095"),
    status: { kind: "downloaded" },
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png",
    avatarFallback: "ST",
    client: "Stark Industries",
    field: "Annual support",
    total: 24500,
    issuedDate: new Date("2026-06-08T00:00:00.000Z"),
    balance: 24500,
  },
  {
    id: asAppShellInvoiceId("5096"),
    status: { kind: "paid" },
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-18.png",
    avatarFallback: "IN",
    client: "Initech Services",
    field: "Consulting retainer",
    total: 9800,
    issuedDate: new Date("2026-05-28T00:00:00.000Z"),
    balance: 0,
  },
  {
    id: asAppShellInvoiceId("5097"),
    status: { kind: "draft" },
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    avatarFallback: "UM",
    client: "Umbrella Corp",
    field: "Phase 2 rollout",
    total: 67200,
    issuedDate: new Date("2026-06-12T00:00:00.000Z"),
    balance: 67200,
  },
] as const satisfies readonly AppShellDashboardInvoiceRow[];

export const defaultAppShellDashboardSparklineMetrics: readonly AppShellDashboardSparklineMetric[] =
  sparklineMetricsSource;

export const defaultAppShellDashboardKpiMetrics: readonly AppShellDashboardKpiMetric[] =
  kpiMetricsSource;

export const defaultAppShellDashboardModuleEarnings: readonly AppShellDashboardModuleEarningRow[] =
  moduleEarningsSource;

export const defaultAppShellDashboardTransactions: readonly AppShellDashboardTransactionRow[] =
  transactionsSource;

export const defaultAppShellDashboardRegionalSales: readonly AppShellDashboardRegionalSalesRow[] =
  regionalSalesSource;

export const defaultAppShellDashboardPaymentHistory: readonly AppShellDashboardPaymentHistoryRow[] =
  paymentHistorySource;

export const defaultAppShellDashboardRevenueBars: readonly AppShellDashboardRevenueBarPoint[] =
  revenueBarSource;

export const defaultAppShellDashboardRevenueGrowthSlices: readonly AppShellDashboardRevenueGrowthSlice[] =
  revenueGrowthSource;

export const defaultAppShellDashboardRevenueYearSummaries: readonly AppShellDashboardRevenueYearSummary[] =
  revenueYearSummariesSource;

export const defaultAppShellDashboardInvoices: readonly AppShellDashboardInvoiceRow[] =
  invoiceRowsSource;

export const DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TOTAL = 188640;

/** Shared chart margins for dashboard sparkline stat cards. */
export const APP_SHELL_DASHBOARD_SPARKLINE_CHART_MARGIN = {
  bottom: 0,
  left: 4,
  right: 0,
  top: 4,
} as const;
