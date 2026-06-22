import { useId, useMemo } from "react";
import { Globe2Icon } from "lucide-react";

import { Card, Progress, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_COMPARISON,
  DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_TITLE,
  defaultAppShellDashboardRegionalSales,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardOverflowMenuItem,
  AppShellDashboardRegionalSalesRow,
} from "../data/app-shell.dashboard.types";
import {
  computeDashboardShare,
  computeWeightedDashboardTrend,
  formatDashboardCurrency,
  parseDashboardAmount,
  TrendIndicator,
  type DashboardBreakdownAggregateTrend,
} from "./app-shell-dashboard-breakdown.utils";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardRegionalSalesGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Progress" | "Separator"
>;

export interface AppShellDashboardRegionalSalesProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly comparisonText?: string;
  readonly rows?: readonly AppShellDashboardRegionalSalesRow[];
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
}

export interface RankedRegionalSalesRow {
  readonly row: AppShellDashboardRegionalSalesRow;
  readonly rank: number;
  readonly share: number;
}

export interface RegionalSalesSummary {
  readonly totalSales: number;
  readonly aggregateTrend: DashboardBreakdownAggregateTrend;
  readonly topRegion: { readonly name: string; readonly share: number } | null;
  readonly growingCount: number;
  readonly decliningCount: number;
}

export function computeTotalRegionalSales(
  rows: readonly AppShellDashboardRegionalSalesRow[]
): number {
  return rows.reduce((total, row) => total + parseDashboardAmount(row.amount), 0);
}

export function buildRankedRegionalSalesRows(
  rows: readonly AppShellDashboardRegionalSalesRow[]
): readonly RankedRegionalSalesRow[] {
  const totalSales = computeTotalRegionalSales(rows);

  return [...rows]
    .map((row) => ({
      rank: 0,
      row,
      share: computeDashboardShare(row.amount, totalSales),
    }))
    .sort((left, right) => {
      const amountDelta =
        parseDashboardAmount(right.row.amount) - parseDashboardAmount(left.row.amount);
      if (amountDelta !== 0) {
        return amountDelta;
      }

      return left.row.region.localeCompare(right.row.region);
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

export function buildRegionalSalesSummary(
  rows: readonly AppShellDashboardRegionalSalesRow[]
): RegionalSalesSummary {
  const rankedRows = buildRankedRegionalSalesRows(rows);
  const topEntry = rankedRows[0];

  return {
    aggregateTrend: computeWeightedDashboardTrend(rows),
    decliningCount: rows.filter((row) => row.trend === "down").length,
    growingCount: rows.filter((row) => row.trend === "up").length,
    topRegion: topEntry
      ? { name: topEntry.row.region, share: topEntry.share }
      : null,
    totalSales: computeTotalRegionalSales(rows),
  };
}

function RegionalSalesRow({
  rank,
  row,
  share,
  total,
}: {
  readonly rank: number;
  readonly row: AppShellDashboardRegionalSalesRow;
  readonly share: number;
  readonly total: number;
}) {
  const shareLabel = `${row.region} represents ${share}% of ${formatDashboardCurrency(total)} consolidated revenue`;
  const rowClassName =
    rank === 1
      ? "app-shell-dashboard-breakdown-row app-shell-dashboard-breakdown-row-leading"
      : "app-shell-dashboard-breakdown-row";

  return (
    <li
      aria-label={`Rank ${rank}, ${row.region}, ${row.amount}, ${row.changeLabel} change`}
      className={rowClassName}
    >
      <div className="app-shell-dashboard-breakdown-row-main">
        <span aria-hidden className="app-shell-dashboard-breakdown-rank">
          {rank}
        </span>
        <div className="app-shell-dashboard-breakdown-icon-frame">
          <img alt={row.flagAlt} height={40} loading="lazy" src={row.flagSrc} width={40} />
        </div>
        <div className="app-shell-dashboard-breakdown-copy">
          <span className="app-shell-dashboard-breakdown-name">{row.region}</span>
          <span className="app-shell-dashboard-breakdown-amount">{row.amount}</span>
          <div className="app-shell-dashboard-breakdown-share-frame">
            <Progress aria-label={shareLabel} value={share} />
          </div>
        </div>
      </div>
      <div className="app-shell-dashboard-breakdown-metrics">
        <div className="app-shell-dashboard-breakdown-change-row">
          <span className="app-shell-dashboard-breakdown-change-value">{row.changeLabel}</span>
          <span className="app-shell-dashboard-breakdown-trend">
            <TrendIndicator trend={row.trend} />
            <span className="sr-only">
              {row.trend === "up" ? "Trending up" : "Trending down"}
            </span>
          </span>
        </div>
        <span className="app-shell-dashboard-breakdown-share">{share}% mix</span>
      </div>
    </li>
  );
}

export function AppShellDashboardRegionalSales({
  title = DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_SUBTITLE,
  comparisonText = DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_COMPARISON,
  rows = defaultAppShellDashboardRegionalSales,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardRegionalSalesProps) {
  const summaryId = useId();
  const listId = useId();
  const summary = useMemo(() => buildRegionalSalesSummary(rows), [rows]);
  const rankedRows = useMemo(() => buildRankedRegionalSalesRows(rows), [rows]);
  const regionCountLabel =
    rows.length === 1 ? "1 active region" : `${rows.length} active regions`;

  const insightsLabel = summary.topRegion
    ? `Top region ${summary.topRegion.name} at ${summary.topRegion.share}% mix`
    : "No regional mix available";

  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-widget-header app-shell-dashboard-widget-header-stacked">
          <div className="app-shell-dashboard-widget-heading">
            <h2 className="app-shell-dashboard-widget-title">{title}</h2>
            <p className="app-shell-dashboard-widget-subtitle">{subtitle}</p>
          </div>
          <AppShellDashboardOverflowMenu
            items={overflowItems}
            menuLabel="Regional sales actions"
          />
        </div>

        <div className="app-shell-dashboard-widget-body">
          <section
            aria-labelledby={summaryId}
            className="app-shell-dashboard-breakdown-summary"
          >
            <div className="app-shell-dashboard-breakdown-total-row">
              <span className="app-shell-dashboard-breakdown-total" id={summaryId}>
                {formatDashboardCurrency(summary.totalSales)}
              </span>
              <span className="app-shell-dashboard-breakdown-change-value">
                {summary.aggregateTrend.label}
              </span>
              <span className="app-shell-dashboard-breakdown-meta">{regionCountLabel}</span>
            </div>
            <div className="app-shell-dashboard-breakdown-insights-row">
              <span className="app-shell-dashboard-breakdown-insight">{insightsLabel}</span>
              <span aria-hidden className="app-shell-dashboard-breakdown-insight-divider">
                ·
              </span>
              <span className="app-shell-dashboard-breakdown-insight">
                {summary.growingCount} growing
              </span>
              <span aria-hidden className="app-shell-dashboard-breakdown-insight-divider">
                ·
              </span>
              <span className="app-shell-dashboard-breakdown-insight">
                {summary.decliningCount} declining
              </span>
            </div>
            <span className="app-shell-dashboard-breakdown-comparison">{comparisonText}</span>
          </section>

          <Separator />

          {rows.length === 0 ? (
            <div className="app-shell-dashboard-breakdown-empty">
              <Globe2Icon aria-hidden className="app-shell-dashboard-breakdown-empty-icon" />
              <span className="app-shell-dashboard-breakdown-empty-title">
                No regional revenue yet
              </span>
              <span className="app-shell-dashboard-breakdown-empty-copy">
                Connect subsidiary ledgers or import regional rollups to populate this view.
              </span>
            </div>
          ) : (
            <>
              <div aria-hidden="true" className="app-shell-dashboard-breakdown-list-header">
                <span>Region · revenue mix</span>
                <span>QoQ change</span>
              </div>
              <ul
                aria-labelledby={summaryId}
                className="app-shell-dashboard-breakdown-list"
                id={listId}
              >
                {rankedRows.map((entry) => (
                  <RegionalSalesRow
                    key={entry.row.id}
                    rank={entry.rank}
                    row={entry.row}
                    share={entry.share}
                    total={summary.totalSales}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
