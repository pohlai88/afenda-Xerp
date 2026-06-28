import { AppShellDashboardKpiStat } from "../presentation/blocks/app-shell-dashboard-kpi-stat";
import {
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  defaultAppShellDashboardKpiMetrics,
  defaultAppShellDashboardSparklineMetrics,
} from "../presentation/data/app-shell.dashboard.data";
import { AppShellDashboardStatisticsExpenseCard } from "../presentation/wrappers/dashboard/statistics-expense-card.wrapper";
import { AppShellDashboardStatisticsIncomeCard } from "../presentation/wrappers/dashboard/statistics-income-card.wrapper";
import type {
  DashboardKpiWidgetId,
  DashboardSparklineWidgetId,
  DashboardWidgetDefinition,
} from "./dashboard-widget.contract";

const comparisonLabel = DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL;

const SPARKLINE_WIDGET_SIZING = {
  minW: 3,
  minH: 2,
  defaultW: 6,
  defaultH: 2,
  maxW: 9,
  maxH: 4,
} as const;

const KPI_WIDGET_SIZING = {
  minW: 3,
  minH: 2,
  defaultW: 3,
  defaultH: 2,
  maxW: 6,
  maxH: 4,
} as const;

function isSparklineWidgetId(
  value: string
): value is DashboardSparklineWidgetId {
  return value === "sparkline-revenue" || value === "sparkline-expense";
}

function isKpiWidgetId(value: string): value is DashboardKpiWidgetId {
  return (
    value === "kpi-net-income" ||
    value === "kpi-active-orders" ||
    value === "kpi-headcount" ||
    value === "kpi-open-tasks"
  );
}

export function createSparklineMetricWidgetDefinitions(): DashboardWidgetDefinition[] {
  return defaultAppShellDashboardSparklineMetrics.flatMap((metric) => {
    const widgetId = metric.id;
    if (!isSparklineWidgetId(widgetId)) {
      return [];
    }

    return [
      {
        id: widgetId,
        title: metric.title,
        description: `${metric.title} sparkline metric card.`,
        category: "kpi",
        ...SPARKLINE_WIDGET_SIZING,
        render: (_context) => {
          const SparklineCard =
            widgetId === "sparkline-revenue"
              ? AppShellDashboardStatisticsIncomeCard
              : AppShellDashboardStatisticsExpenseCard;

          return (
            <SparklineCard comparisonLabel={comparisonLabel} {...metric} />
          );
        },
      },
    ];
  });
}

export function createKpiMetricWidgetDefinitions(): DashboardWidgetDefinition[] {
  return defaultAppShellDashboardKpiMetrics.flatMap((metric) => {
    const widgetId = metric.id;
    if (!isKpiWidgetId(widgetId)) {
      return [];
    }

    return [
      {
        id: widgetId,
        title: metric.title,
        description: `${metric.title} KPI card with period caption and trend footnote.`,
        category: "kpi",
        ...KPI_WIDGET_SIZING,
        render: (_context) => (
          <AppShellDashboardKpiStat
            comparisonLabel={comparisonLabel}
            emphasis={widgetId === "kpi-net-income" ? "primary" : "default"}
            {...metric}
          />
        ),
      },
    ];
  });
}
