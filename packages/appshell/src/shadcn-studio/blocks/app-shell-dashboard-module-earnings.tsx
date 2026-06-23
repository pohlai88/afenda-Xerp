import { Card, Progress, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { LayersIcon } from "lucide-react";
import { useId, useMemo } from "react";

import {
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_COMPARISON,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TITLE,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TOTAL,
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  defaultAppShellDashboardModuleEarnings,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardModuleEarningRow,
  AppShellDashboardOverflowMenuItem,
} from "../data/app-shell.dashboard.types";
import {
  computeDashboardShare,
  computeWeightedDashboardTrend,
  type DashboardBreakdownAggregateTrend,
  formatDashboardCurrency,
  parseDashboardAmount,
  TrendIndicator,
} from "./app-shell-dashboard-breakdown.utils";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardModuleEarningsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Progress" | "Separator"
>;

export interface AppShellDashboardModuleEarningsProps {
  readonly comparisonText?: string;
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
  readonly rows?: readonly AppShellDashboardModuleEarningRow[];
  readonly subtitle?: string;
  readonly title?: string;
  readonly total?: number;
}

export interface RankedModuleEarningRow {
  readonly rank: number;
  readonly row: AppShellDashboardModuleEarningRow;
  readonly share: number;
}

export interface ModuleEarningsSummary {
  readonly aggregateTrend: DashboardBreakdownAggregateTrend;
  readonly decliningCount: number;
  readonly growingCount: number;
  readonly topModule: { readonly name: string; readonly share: number } | null;
  readonly totalRevenue: number;
}

export function computeTotalModuleEarnings(
  rows: readonly AppShellDashboardModuleEarningRow[]
): number {
  return rows.reduce(
    (total, row) => total + parseDashboardAmount(row.amount),
    0
  );
}

export function buildRankedModuleEarningRows(
  rows: readonly AppShellDashboardModuleEarningRow[]
): readonly RankedModuleEarningRow[] {
  const totalRevenue = computeTotalModuleEarnings(rows);

  return [...rows]
    .map((row) => ({
      rank: 0,
      row,
      share: computeDashboardShare(row.amount, totalRevenue),
    }))
    .sort((left, right) => {
      const amountDelta =
        parseDashboardAmount(right.row.amount) -
        parseDashboardAmount(left.row.amount);
      if (amountDelta !== 0) {
        return amountDelta;
      }

      return left.row.module.localeCompare(right.row.module);
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

export function buildModuleEarningsSummary(
  rows: readonly AppShellDashboardModuleEarningRow[],
  totalOverride?: number
): ModuleEarningsSummary {
  const rankedRows = buildRankedModuleEarningRows(rows);
  const topEntry = rankedRows[0];
  const computedTotal = computeTotalModuleEarnings(rows);

  return {
    aggregateTrend: computeWeightedDashboardTrend(rows),
    decliningCount: rows.filter((row) => row.trend === "down").length,
    growingCount: rows.filter((row) => row.trend === "up").length,
    topModule: topEntry
      ? { name: topEntry.row.module, share: topEntry.share }
      : null,
    totalRevenue: totalOverride ?? computedTotal,
  };
}

function ModuleEarningRow({
  rank,
  row,
  share,
  total,
}: {
  readonly rank: number;
  readonly row: AppShellDashboardModuleEarningRow;
  readonly share: number;
  readonly total: number;
}) {
  const shareLabel = `${row.module} represents ${share}% of ${formatDashboardCurrency(total)} module revenue`;
  const rowClassName =
    rank === 1
      ? "app-shell-dashboard-breakdown-row app-shell-dashboard-breakdown-row-leading"
      : "app-shell-dashboard-breakdown-row";

  return (
    <li
      aria-label={`Rank ${rank}, ${row.module}, ${row.amount}, ${row.changeLabel} change`}
      className={rowClassName}
    >
      <div className="app-shell-dashboard-breakdown-row-main">
        <span aria-hidden className="app-shell-dashboard-breakdown-rank">
          {rank}
        </span>
        <div className="app-shell-dashboard-breakdown-icon-frame">
          <img
            alt={row.iconAlt}
            height={40}
            loading="lazy"
            src={row.iconSrc}
            width={40}
          />
        </div>
        <div className="app-shell-dashboard-breakdown-copy">
          <span className="app-shell-dashboard-breakdown-name">
            {row.module}
          </span>
          <span className="app-shell-dashboard-breakdown-amount">
            {row.amount}
          </span>
          <span className="app-shell-dashboard-breakdown-detail">
            {row.subtitle}
          </span>
          <div className="app-shell-dashboard-breakdown-share-frame">
            <Progress aria-label={shareLabel} value={share} />
          </div>
        </div>
      </div>
      <div className="app-shell-dashboard-breakdown-metrics">
        <div className="app-shell-dashboard-breakdown-change-row">
          <span className="app-shell-dashboard-breakdown-change-value">
            {row.changeLabel}
          </span>
          <span className="app-shell-dashboard-breakdown-trend">
            <TrendIndicator trend={row.trend} />
          </span>
        </div>
        <span className="app-shell-dashboard-breakdown-share">
          {share}% mix
        </span>
      </div>
    </li>
  );
}

export function AppShellDashboardModuleEarnings({
  title = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_SUBTITLE,
  total = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TOTAL,
  comparisonText = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_COMPARISON,
  rows = defaultAppShellDashboardModuleEarnings,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardModuleEarningsProps) {
  const titleId = useId();
  const summaryId = useId();
  const listLabelId = useId();
  const summary = useMemo(
    () => buildModuleEarningsSummary(rows, total),
    [rows, total]
  );
  const rankedRows = useMemo(() => buildRankedModuleEarningRows(rows), [rows]);
  const moduleCountLabel =
    rows.length === 1 ? "1 active module" : `${rows.length} active modules`;

  const insightsLabel = summary.topModule
    ? `Top module ${summary.topModule.name} at ${summary.topModule.share}% mix`
    : "No module mix available";

  return (
    <article aria-labelledby={titleId} className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-widget-header app-shell-dashboard-widget-header-stacked">
          <div className="app-shell-dashboard-widget-heading">
            <h2 className="app-shell-dashboard-widget-title" id={titleId}>
              {title}
            </h2>
            <p className="app-shell-dashboard-widget-subtitle">{subtitle}</p>
          </div>
          <AppShellDashboardOverflowMenu
            items={overflowItems}
            menuLabel="Module revenue actions"
          />
        </div>

        <div className="app-shell-dashboard-widget-body">
          <section
            aria-labelledby={summaryId}
            className="app-shell-dashboard-breakdown-summary"
          >
            <div className="app-shell-dashboard-breakdown-total-row">
              <span
                className="app-shell-dashboard-breakdown-total"
                id={summaryId}
              >
                {formatDashboardCurrency(summary.totalRevenue)}
              </span>
              <span className="app-shell-dashboard-breakdown-change-value">
                {summary.aggregateTrend.label}
              </span>
              <span className="app-shell-dashboard-breakdown-meta">
                {moduleCountLabel}
              </span>
            </div>
            <div className="app-shell-dashboard-breakdown-insights-row">
              <span className="app-shell-dashboard-breakdown-insight">
                {insightsLabel}
              </span>
              <span
                aria-hidden
                className="app-shell-dashboard-breakdown-insight-divider"
              >
                ·
              </span>
              <span className="app-shell-dashboard-breakdown-insight">
                {summary.growingCount} growing
              </span>
              <span
                aria-hidden
                className="app-shell-dashboard-breakdown-insight-divider"
              >
                ·
              </span>
              <span className="app-shell-dashboard-breakdown-insight">
                {summary.decliningCount} declining
              </span>
            </div>
            <span className="app-shell-dashboard-breakdown-comparison">
              {comparisonText}
            </span>
          </section>

          <Separator />

          {rows.length === 0 ? (
            <div className="app-shell-dashboard-breakdown-empty" role="status">
              <LayersIcon
                aria-hidden
                className="app-shell-dashboard-breakdown-empty-icon"
              />
              <span className="app-shell-dashboard-breakdown-empty-title">
                No module revenue yet
              </span>
              <span className="app-shell-dashboard-breakdown-empty-copy">
                Connect business units or import module rollups to populate this
                view.
              </span>
            </div>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="app-shell-dashboard-breakdown-list-header"
              >
                <span>Module · revenue mix</span>
                <span>QoQ change</span>
              </div>
              <span className="sr-only" id={listLabelId}>
                Module revenue breakdown ranked by amount
              </span>
              <ul
                aria-labelledby={`${summaryId} ${listLabelId}`}
                className="app-shell-dashboard-breakdown-list"
              >
                {rankedRows.map((entry) => (
                  <ModuleEarningRow
                    key={entry.row.id}
                    rank={entry.rank}
                    row={entry.row}
                    share={entry.share}
                    total={summary.totalRevenue}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      </Card>
    </article>
  );
}
