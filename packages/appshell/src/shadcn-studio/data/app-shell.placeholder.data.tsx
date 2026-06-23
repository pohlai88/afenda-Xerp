import type { ComponentType } from "react";
import {
  BarChart3Icon,
  BriefcaseIcon,
  DollarSignIcon,
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

export const DEFAULT_APP_SHELL_PLACEHOLDER_DASHBOARD_LABEL = "ERP overview dashboard";
export const DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE = "Recent orders";
export const DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_CAPTION = "Last 5 entries";
export const DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE = "Module performance";
export const DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERIOD_LABEL = "FY2026 Q2";
export const DEFAULT_APP_SHELL_PLACEHOLDER_SPARKLINE_COMPARISON_LABEL = "vs last month";

export const APP_SHELL_PLACEHOLDER_RECENT_ORDERS_SECTION_ID =
  "app-shell-placeholder-recent-orders-title";
export const APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_SECTION_ID =
  "app-shell-placeholder-module-performance-title";

/** Accessible sparkline chart label — pairs with `role="img"` in placeholder renderer. */
export function formatPlaceholderSparklineChartLabel(title: string): string {
  return `${title} sparkline trend`;
}

export type AppShellPlaceholderTrendDirection = "down" | "up";

export interface AppShellPlaceholderKpiCard {
  readonly id: string;
  readonly title: string;
  readonly badge: string;
  readonly value: string;
  readonly trend: AppShellPlaceholderTrendDirection;
  readonly Icon: ComponentType<{ readonly className?: string }>;
}

export interface AppShellPlaceholderSparklineCard {
  readonly id: string;
  readonly title: string;
  readonly amount: string;
  readonly change: string;
  readonly trend: AppShellPlaceholderTrendDirection;
  readonly data: readonly number[];
}

export interface AppShellPlaceholderOrderRow {
  readonly id: string;
  readonly module: string;
  readonly description: string;
  readonly amount: string;
  readonly type: "credit" | "debit";
  readonly Icon: ComponentType<{ readonly className?: string }>;
}

export interface AppShellPlaceholderModuleRow {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly progress: number;
}

const expenseSparkline = [
  290, 360, 360, 360, 400, 550, 590, 500, 450, 460, 400, 350, 320, 300,
] as const satisfies readonly number[];

const revenueSparkline = [
  190, 285, 420, 280, 250, 500, 550, 300, 420, 380, 480, 520, 490, 540,
] as const satisfies readonly number[];

const placeholderKpiSource = [
  {
    id: "kpi-net-income",
    title: "Net income",
    badge: "Q2 FY2026",
    value: "$159,380",
    trend: "up",
    Icon: TrendingUpIcon,
  },
  {
    id: "kpi-active-orders",
    title: "Active orders",
    badge: "Live",
    value: "1,284",
    trend: "up",
    Icon: ShoppingCartIcon,
  },
  {
    id: "kpi-headcount",
    title: "Headcount",
    badge: "FTE",
    value: "247",
    trend: "up",
    Icon: UsersIcon,
  },
  {
    id: "kpi-open-tasks",
    title: "Open tasks",
    badge: "This week",
    value: "38",
    trend: "down",
    Icon: BriefcaseIcon,
  },
] as const satisfies readonly AppShellPlaceholderKpiCard[];

const placeholderSparklineSource = [
  {
    id: "sparkline-revenue",
    title: "Total revenue",
    amount: "$248,720",
    change: "+14.2%",
    trend: "up",
    data: revenueSparkline,
  },
  {
    id: "sparkline-expenses",
    title: "Operating expenses",
    amount: "$89,340",
    change: "-8.6%",
    trend: "down",
    data: expenseSparkline,
  },
] as const satisfies readonly AppShellPlaceholderSparklineCard[];

const placeholderOrdersSource = [
  {
    id: "ord-1",
    module: "Finance",
    description: "AP Invoice #8821",
    amount: "$12,400",
    type: "debit",
    Icon: DollarSignIcon,
  },
  {
    id: "ord-2",
    module: "Inventory",
    description: "Stock PO #4401",
    amount: "$8,760",
    type: "debit",
    Icon: PackageIcon,
  },
  {
    id: "ord-3",
    module: "Sales",
    description: "SO #2290 — Acme Corp",
    amount: "$24,500",
    type: "credit",
    Icon: ShoppingCartIcon,
  },
  {
    id: "ord-4",
    module: "HR",
    description: "Payroll Run Jun 2026",
    amount: "$91,200",
    type: "debit",
    Icon: UsersIcon,
  },
  {
    id: "ord-5",
    module: "Projects",
    description: "Milestone #7 — ERP Phase 2",
    amount: "$42,000",
    type: "credit",
    Icon: BarChart3Icon,
  },
] as const satisfies readonly AppShellPlaceholderOrderRow[];

const placeholderModulesSource = [
  { id: "module-finance", name: "Finance", status: "On track", progress: 82 },
  { id: "module-hr", name: "Human Resources", status: "On track", progress: 74 },
  { id: "module-inventory", name: "Inventory", status: "At risk", progress: 55 },
  { id: "module-sales", name: "Sales & CRM", status: "On track", progress: 91 },
  {
    id: "module-manufacturing",
    name: "Manufacturing",
    status: "Behind",
    progress: 38,
  },
] as const satisfies readonly AppShellPlaceholderModuleRow[];

export const defaultAppShellPlaceholderKpiCards: readonly AppShellPlaceholderKpiCard[] =
  placeholderKpiSource;

export const defaultAppShellPlaceholderSparklineCards: readonly AppShellPlaceholderSparklineCard[] =
  placeholderSparklineSource;

export const defaultAppShellPlaceholderOrders: readonly AppShellPlaceholderOrderRow[] =
  placeholderOrdersSource;

export const defaultAppShellPlaceholderModules: readonly AppShellPlaceholderModuleRow[] =
  placeholderModulesSource;
