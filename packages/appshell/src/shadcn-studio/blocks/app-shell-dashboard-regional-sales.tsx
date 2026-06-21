import { useId, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon, Globe2Icon } from "lucide-react";

import { Badge, Card, Progress, Separator } from "@afenda/ui";
import type { GovernedBadgeProps, GovernedUiComponentName } from "@afenda/ui/governance";

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
  AppShellTrendDirection,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardRegionalSalesGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Card" | "Progress" | "Separator"
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

export interface RegionalSalesAggregateTrend {
  readonly label: string;
  readonly trend: AppShellTrendDirection;
}

export interface RegionalSalesSummary {
  readonly totalSales: number;
  readonly aggregateTrend: RegionalSalesAggregateTrend;
  readonly topRegion: { readonly name: string; readonly share: number } | null;
  readonly growingCount: number;
  readonly decliningCount: number;
}

export function parseRegionalAmount(value: string): number {
  return Number.parseFloat(value.replaceAll(/[$,]/g, ""));
}

export function formatRegionalCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function computeTotalRegionalSales(
  rows: readonly AppShellDashboardRegionalSalesRow[]
): number {
  return rows.reduce((total, row) => total + parseRegionalAmount(row.amount), 0);
}

export function computeRegionalShare(amount: string, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((parseRegionalAmount(amount) / total) * 100);
}

function parseChangeLabel(changeLabel: string): number {
  return Number.parseFloat(changeLabel.replaceAll(/[%+]/g, ""));
}

export function computeWeightedRegionalTrend(
  rows: readonly AppShellDashboardRegionalSalesRow[]
): RegionalSalesAggregateTrend {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const row of rows) {
    const weight = parseRegionalAmount(row.amount);
    weightedSum += parseChangeLabel(row.changeLabel) * weight;
    totalWeight += weight;
  }

  if (totalWeight <= 0) {
    return { label: "0%", trend: "up" };
  }

  const average = weightedSum / totalWeight;
  const prefix = average > 0 ? "+" : "";

  return {
    label: `${prefix}${average.toFixed(1)}%`,
    trend: average >= 0 ? "up" : "down",
  };
}

export function buildRankedRegionalSalesRows(
  rows: readonly AppShellDashboardRegionalSalesRow[]
): readonly RankedRegionalSalesRow[] {
  const totalSales = computeTotalRegionalSales(rows);

  return [...rows]
    .map((row) => ({
      rank: 0,
      row,
      share: computeRegionalShare(row.amount, totalSales),
    }))
    .sort((left, right) => {
      const amountDelta = parseRegionalAmount(right.row.amount) - parseRegionalAmount(left.row.amount);
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
    aggregateTrend: computeWeightedRegionalTrend(rows),
    decliningCount: rows.filter((row) => row.trend === "down").length,
    growingCount: rows.filter((row) => row.trend === "up").length,
    topRegion: topEntry
      ? { name: topEntry.row.region, share: topEntry.share }
      : null,
    totalSales: computeTotalRegionalSales(rows),
  };
}

function resolveTrendBadgeTone(
  trend: AppShellTrendDirection
): NonNullable<GovernedBadgeProps["tone"]> {
  return trend === "up" ? "success" : "danger";
}

function TrendIndicator({ trend }: { readonly trend: AppShellTrendDirection }) {
  return trend === "up" ? (
    <ChevronUpIcon aria-hidden className="app-shell-dashboard-trend-icon-up" />
  ) : (
    <ChevronDownIcon aria-hidden className="app-shell-dashboard-trend-icon-down" />
  );
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
  const shareLabel = `${row.region} represents ${share}% of ${formatRegionalCurrency(total)} consolidated revenue`;
  const rowClassName =
    rank === 1
      ? "app-shell-dashboard-regional-row app-shell-dashboard-regional-row-leading"
      : "app-shell-dashboard-regional-row";

  return (
    <li
      aria-label={`Rank ${rank}, ${row.region}, ${row.amount}, ${row.changeLabel} change`}
      className={rowClassName}
    >
      <div className="app-shell-dashboard-regional-row-main">
        <span aria-hidden className="app-shell-dashboard-regional-rank">
          {rank}
        </span>
        <div className="app-shell-dashboard-regional-flag-frame">
          <img alt={row.flagAlt} height={40} loading="lazy" src={row.flagSrc} width={40} />
        </div>
        <div className="app-shell-dashboard-regional-copy">
          <span className="app-shell-dashboard-regional-name">{row.region}</span>
          <span className="app-shell-dashboard-regional-amount">{row.amount}</span>
          <div className="app-shell-dashboard-regional-share-frame">
            <Progress aria-label={shareLabel} value={share} />
          </div>
        </div>
      </div>
      <div className="app-shell-dashboard-regional-metrics">
        <div className="app-shell-dashboard-regional-change-row">
          <Badge emphasis="soft" tone={resolveTrendBadgeTone(row.trend)}>
            {row.changeLabel}
          </Badge>
          <span className="app-shell-dashboard-regional-trend">
            <TrendIndicator trend={row.trend} />
            <span className="sr-only">
              {row.trend === "up" ? "Trending up" : "Trending down"}
            </span>
          </span>
        </div>
        <span className="app-shell-dashboard-regional-share">{share}% mix</span>
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
            className="app-shell-dashboard-regional-summary"
          >
            <div className="app-shell-dashboard-regional-total-row">
              <span className="app-shell-dashboard-regional-total" id={summaryId}>
                {formatRegionalCurrency(summary.totalSales)}
              </span>
              <Badge
                emphasis="soft"
                tone={resolveTrendBadgeTone(summary.aggregateTrend.trend)}
              >
                {summary.aggregateTrend.label}
              </Badge>
              <Badge emphasis="soft" tone="neutral">
                {regionCountLabel}
              </Badge>
            </div>
            <div className="app-shell-dashboard-regional-insights-row">
              <span className="app-shell-dashboard-regional-insight">{insightsLabel}</span>
              <span aria-hidden className="app-shell-dashboard-regional-insight-divider">
                ·
              </span>
              <span className="app-shell-dashboard-regional-insight">
                {summary.growingCount} growing
              </span>
              <span aria-hidden className="app-shell-dashboard-regional-insight-divider">
                ·
              </span>
              <span className="app-shell-dashboard-regional-insight">
                {summary.decliningCount} declining
              </span>
            </div>
            <span className="app-shell-dashboard-regional-comparison">{comparisonText}</span>
          </section>

          <Separator />

          {rows.length === 0 ? (
            <div className="app-shell-dashboard-regional-empty">
              <Globe2Icon aria-hidden className="app-shell-dashboard-regional-empty-icon" />
              <span className="app-shell-dashboard-regional-empty-title">
                No regional revenue yet
              </span>
              <span className="app-shell-dashboard-regional-empty-copy">
                Connect subsidiary ledgers or import regional rollups to populate this view.
              </span>
            </div>
          ) : (
            <>
              <div aria-hidden="true" className="app-shell-dashboard-regional-list-header">
                <span>Region · revenue mix</span>
                <span>QoQ change</span>
              </div>
              <ul
                aria-labelledby={summaryId}
                className="app-shell-dashboard-regional-list"
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
