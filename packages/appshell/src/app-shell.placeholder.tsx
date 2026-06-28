import { Avatar, AvatarFallback } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import {
  APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_SECTION_ID,
  APP_SHELL_PLACEHOLDER_RECENT_ORDERS_SECTION_ID,
  type AppShellPlaceholderKpiCard,
  type AppShellPlaceholderModuleRow,
  type AppShellPlaceholderOrderRow,
  type AppShellPlaceholderSparklineCard,
  type AppShellPlaceholderTrendDirection,
  DEFAULT_APP_SHELL_PLACEHOLDER_DASHBOARD_LABEL,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERIOD_LABEL,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_CAPTION,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_SPARKLINE_COMPARISON_LABEL,
  defaultAppShellPlaceholderKpiCards,
  defaultAppShellPlaceholderModules,
  defaultAppShellPlaceholderOrders,
  defaultAppShellPlaceholderSparklineCards,
  formatPlaceholderSparklineChartLabel,
} from "./presentation/data/app-shell.placeholder.data";

export type ApplicationShellPlaceholderGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar"
>;

export interface ApplicationShellPlaceholderProps {
  readonly dashboardLabel?: string;
  readonly kpiCards?: readonly AppShellPlaceholderKpiCard[];
  readonly modulePerformance?: readonly AppShellPlaceholderModuleRow[];
  readonly modulePerformanceTitle?: string;
  readonly modulePeriodLabel?: string;
  readonly recentOrders?: readonly AppShellPlaceholderOrderRow[];
  readonly recentOrdersCaption?: string;
  readonly recentOrdersTitle?: string;
  readonly showKpiSection?: boolean;
  readonly showSparklineSection?: boolean;
  readonly showWidgetSection?: boolean;
  readonly sparklineCards?: readonly AppShellPlaceholderSparklineCard[];
  readonly sparklineComparisonLabel?: string;
}

function resolvePlaceholderModuleStatusClass(progress: number): string {
  if (progress >= 75) {
    return "app-shell-placeholder-module-status-high";
  }
  if (progress >= 50) {
    return "app-shell-placeholder-module-status-mid";
  }
  return "app-shell-placeholder-module-status-low";
}

function resolvePlaceholderModuleProgressClass(progress: number): string {
  if (progress >= 75) {
    return "app-shell-placeholder-progress-fill-high";
  }
  if (progress >= 50) {
    return "app-shell-placeholder-progress-fill-mid";
  }
  return "app-shell-placeholder-progress-fill-low";
}

function SparklineSvg({
  data,
  trend,
  gradientId,
}: {
  readonly data: readonly number[];
  readonly trend: AppShellPlaceholderTrendDirection;
  readonly gradientId: string;
}) {
  const pts = [...data];
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const width = 120;
  const height = 48;

  const coords = pts.map((value, index) => {
    const x = ((index / (pts.length - 1)) * width).toFixed(1);
    const y = (height - ((value - min) / range) * (height - 4) - 2).toFixed(1);
    return `${x},${y}`;
  });

  const linePath = `M${coords.join(" L")}`;
  const fillPath = `${linePath} L${width},${height} L0,${height} Z`;
  const color =
    trend === "up"
      ? "var(--color-chart-1, var(--primary))"
      : "var(--color-chart-3, var(--destructive))";

  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%" }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="10%" stopColor={color} stopOpacity="0.15" />
          <stop offset="90%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TrendIndicator({
  trend,
}: {
  readonly trend: AppShellPlaceholderTrendDirection;
}) {
  return (
    <span aria-hidden="true">
      {trend === "up" ? (
        <ChevronUpIcon className="app-shell-placeholder-trend-icon-up" />
      ) : (
        <ChevronDownIcon className="app-shell-placeholder-trend-icon-down" />
      )}
    </span>
  );
}

function KpiStatCard({
  title,
  badge,
  value,
  trend,
  Icon,
}: AppShellPlaceholderKpiCard) {
  return (
    <div className="app-shell-placeholder-surface app-shell-placeholder-kpi-card">
      <div className="app-shell-placeholder-kpi-header">
        <span className="app-shell-placeholder-kpi-title">{title}</span>
        <span className="app-shell-placeholder-kpi-caption">{badge}</span>
      </div>

      <div className="app-shell-placeholder-kpi-value-row">
        <span className="app-shell-placeholder-kpi-value">{value}</span>
        <TrendIndicator trend={trend} />
      </div>

      <div aria-hidden="true" className="app-shell-placeholder-kpi-watermark">
        <Icon className="app-shell-placeholder-kpi-watermark-icon" />
      </div>
    </div>
  );
}

function SparklineStatCard({
  id,
  title,
  amount,
  change,
  trend,
  data,
  comparisonLabel,
}: AppShellPlaceholderSparklineCard & { readonly comparisonLabel: string }) {
  const gradientId = `app-shell-sparkline-${id}`;

  return (
    <div className="app-shell-placeholder-surface app-shell-placeholder-sparkline-card">
      <div className="app-shell-placeholder-sparkline-body">
        <div className="app-shell-placeholder-sparkline-meta">
          <div className="app-shell-placeholder-sparkline-title-group">
            <span className="app-shell-placeholder-sparkline-title">
              {title}
            </span>
            <span className="app-shell-placeholder-sparkline-amount">
              {amount}
            </span>
          </div>
          <div className="app-shell-placeholder-sparkline-change-row">
            <span className="app-shell-placeholder-sparkline-change">
              {change}
            </span>
            <span className="app-shell-placeholder-sparkline-comparison">
              {comparisonLabel}
            </span>
          </div>
        </div>

        <div
          aria-label={formatPlaceholderSparklineChartLabel(title)}
          className="app-shell-placeholder-sparkline-chart"
          role="img"
        >
          <SparklineSvg data={data} gradientId={gradientId} trend={trend} />
        </div>
      </div>
    </div>
  );
}

function OrderAmountIndicator({
  type,
}: {
  readonly type: AppShellPlaceholderOrderRow["type"];
}) {
  return (
    <div className="app-shell-placeholder-order-indicator">
      {type === "debit" ? (
        <ArrowDownIcon
          aria-hidden
          className="app-shell-placeholder-order-indicator-icon app-shell-placeholder-order-indicator-icon-debit"
        />
      ) : (
        <ArrowUpIcon
          aria-hidden
          className="app-shell-placeholder-order-indicator-icon app-shell-placeholder-order-indicator-icon-credit"
        />
      )}
    </div>
  );
}

function RecentOrdersWidget({
  orders,
  sectionId,
  title,
  caption,
}: {
  readonly orders: readonly AppShellPlaceholderOrderRow[];
  readonly sectionId: string;
  readonly title: string;
  readonly caption: string;
}) {
  return (
    <section
      aria-labelledby={sectionId}
      className="app-shell-placeholder-surface app-shell-placeholder-widget"
    >
      <div className="app-shell-placeholder-widget-header">
        <h2 className="app-shell-placeholder-widget-title" id={sectionId}>
          {title}
        </h2>
        <span className="app-shell-placeholder-widget-caption">{caption}</span>
      </div>

      <ul className="app-shell-placeholder-order-list">
        {orders.map((order) => (
          <li
            aria-label={`${order.description}, ${order.module}`}
            className="app-shell-placeholder-order-row"
            key={order.id}
          >
            <div className="app-shell-placeholder-order-main">
              <Avatar>
                <AvatarFallback>
                  <order.Icon
                    aria-hidden
                    className="app-shell-placeholder-order-indicator-icon"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="app-shell-placeholder-order-copy">
                <span className="app-shell-placeholder-order-description">
                  {order.description}
                </span>
                <span className="app-shell-placeholder-order-module">
                  {order.module}
                </span>
              </div>
            </div>

            <div className="app-shell-placeholder-order-amount-row">
              <span className="app-shell-placeholder-order-amount">
                {order.type === "debit" ? "−" : "+"}
                {order.amount}
              </span>
              <OrderAmountIndicator type={order.type} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ModulePerformanceWidget({
  modules,
  sectionId,
  title,
  periodLabel,
}: {
  readonly modules: readonly AppShellPlaceholderModuleRow[];
  readonly sectionId: string;
  readonly title: string;
  readonly periodLabel: string;
}) {
  return (
    <section
      aria-labelledby={sectionId}
      className="app-shell-placeholder-surface app-shell-placeholder-widget"
    >
      <div className="app-shell-placeholder-widget-header">
        <h2 className="app-shell-placeholder-widget-title" id={sectionId}>
          {title}
        </h2>
        <span className="app-shell-placeholder-widget-period-caption">
          {periodLabel}
        </span>
      </div>

      <ul className="app-shell-placeholder-module-list">
        {modules.map((module) => (
          <li className="app-shell-placeholder-module-row" key={module.id}>
            <div className="app-shell-placeholder-module-copy">
              <div className="app-shell-placeholder-module-header">
                <span className="app-shell-placeholder-module-name">
                  {module.name}
                </span>
                <span
                  className={`app-shell-placeholder-module-status ${resolvePlaceholderModuleStatusClass(module.progress)}`}
                >
                  {module.status}
                </span>
              </div>
              <div className="app-shell-placeholder-progress-track">
                <div
                  aria-label={`${module.name} progress: ${module.progress}%`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={module.progress}
                  className={`app-shell-placeholder-progress-fill ${resolvePlaceholderModuleProgressClass(module.progress)}`}
                  role="progressbar"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
            <span className="app-shell-placeholder-module-percent">
              {module.progress}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ApplicationShellPlaceholderContent({
  dashboardLabel = DEFAULT_APP_SHELL_PLACEHOLDER_DASHBOARD_LABEL,
  recentOrdersTitle = DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE,
  recentOrdersCaption = DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_CAPTION,
  modulePerformanceTitle = DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE,
  modulePeriodLabel = DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERIOD_LABEL,
  sparklineComparisonLabel = DEFAULT_APP_SHELL_PLACEHOLDER_SPARKLINE_COMPARISON_LABEL,
  showSparklineSection = true,
  showKpiSection = true,
  showWidgetSection = true,
  kpiCards = defaultAppShellPlaceholderKpiCards,
  sparklineCards = defaultAppShellPlaceholderSparklineCards,
  recentOrders = defaultAppShellPlaceholderOrders,
  modulePerformance = defaultAppShellPlaceholderModules,
}: ApplicationShellPlaceholderProps = {}) {
  return (
    <div
      aria-label={dashboardLabel}
      className="app-shell-placeholder-dashboard"
      role="region"
    >
      {showSparklineSection ? (
        <div className="app-shell-sparkline-grid">
          {sparklineCards.map((card) => (
            <SparklineStatCard
              comparisonLabel={sparklineComparisonLabel}
              key={card.id}
              {...card}
            />
          ))}
        </div>
      ) : null}

      {showKpiSection ? (
        <div className="app-shell-kpi-grid">
          {kpiCards.map((card) => (
            <KpiStatCard key={card.id} {...card} />
          ))}
        </div>
      ) : null}

      {showWidgetSection ? (
        <div className="app-shell-widget-grid">
          <RecentOrdersWidget
            caption={recentOrdersCaption}
            orders={recentOrders}
            sectionId={APP_SHELL_PLACEHOLDER_RECENT_ORDERS_SECTION_ID}
            title={recentOrdersTitle}
          />
          <ModulePerformanceWidget
            modules={modulePerformance}
            periodLabel={modulePeriodLabel}
            sectionId={APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_SECTION_ID}
            title={modulePerformanceTitle}
          />
        </div>
      ) : null}
    </div>
  );
}
