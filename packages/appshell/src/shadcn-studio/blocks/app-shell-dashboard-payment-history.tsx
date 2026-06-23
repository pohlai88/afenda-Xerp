import {
  Card,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_COMPARISON,
  DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_TITLE,
  defaultAppShellDashboardPaymentHistory,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardOverflowMenuItem,
  AppShellDashboardPaymentHistoryRow,
} from "../data/app-shell.dashboard.types";
import {
  formatDashboardCurrency,
  parseDashboardAmount,
} from "./app-shell-dashboard-breakdown.utils";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardPaymentHistoryGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Progress" | "Separator" | "Table"
>;

export interface AppShellDashboardPaymentHistoryProps {
  readonly comparisonText?: string;
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
  readonly rows?: readonly AppShellDashboardPaymentHistoryRow[];
  readonly subtitle?: string;
  readonly title?: string;
}

function computeUtilization(spend: string, remaining: string): number {
  const spent = parseDashboardAmount(spend);
  const left = parseDashboardAmount(remaining);
  const limit = spent + left;

  if (limit <= 0) {
    return 0;
  }

  return Math.round((spent / limit) * 100);
}

function resolveUtilizationDotClass(utilization: number): string {
  if (utilization >= 85) {
    return "app-shell-dashboard-payment-utilization-dot app-shell-dashboard-payment-utilization-dot--high";
  }

  if (utilization >= 60) {
    return "app-shell-dashboard-payment-utilization-dot app-shell-dashboard-payment-utilization-dot--mid";
  }

  return "app-shell-dashboard-payment-utilization-dot app-shell-dashboard-payment-utilization-dot--low";
}

function computeTotalSpend(
  rows: readonly AppShellDashboardPaymentHistoryRow[]
): number {
  return rows.reduce(
    (total, row) => total + parseDashboardAmount(row.spend),
    0
  );
}

function PaymentHistoryRow({
  row,
}: {
  readonly row: AppShellDashboardPaymentHistoryRow;
}) {
  const utilization = computeUtilization(row.spend, row.remaining);
  const utilizationLabel = `${row.cardType} utilized ${utilization}% of limit`;

  return (
    <TableRow>
      <TableCell>
        <div className="app-shell-dashboard-payment-card-cell">
          <div className="app-shell-dashboard-payment-brand-frame">
            <img
              alt={row.brandIconAlt}
              height={28}
              src={row.brandIconSrc}
              width={28}
            />
          </div>
          <div className="app-shell-dashboard-payment-card-copy">
            <span className="app-shell-dashboard-payment-card-number">
              •••• {row.cardNumber}
            </span>
            <span className="app-shell-dashboard-payment-card-type">
              {row.cardType}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <time className="app-shell-dashboard-payment-date" dateTime={row.date}>
          {row.date}
        </time>
      </TableCell>
      <TableCell>
        <div className="app-shell-dashboard-payment-spend-cell">
          <div className="app-shell-dashboard-payment-spend-row">
            <span className="app-shell-dashboard-payment-spend">
              -{formatDashboardCurrency(parseDashboardAmount(row.spend))}
            </span>
            <div className="app-shell-dashboard-payment-utilization-row">
              <span
                aria-label={utilizationLabel}
                className="app-shell-dashboard-payment-utilization-indicator"
                role="img"
              >
                <span
                  aria-hidden
                  className={resolveUtilizationDotClass(utilization)}
                />
                <span
                  aria-hidden
                  className="app-shell-dashboard-payment-utilization-label"
                >
                  {utilization}%
                </span>
              </span>
            </div>
          </div>
          <span className="app-shell-dashboard-payment-remaining">
            {formatDashboardCurrency(parseDashboardAmount(row.remaining))}{" "}
            remaining
          </span>
          <div className="app-shell-dashboard-payment-utilization-frame">
            <Progress aria-label={utilizationLabel} value={utilization} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AppShellDashboardPaymentHistory({
  title = DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_SUBTITLE,
  comparisonText = DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_COMPARISON,
  rows = defaultAppShellDashboardPaymentHistory,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardPaymentHistoryProps) {
  const titleId = useId();
  const summaryId = useId();
  const totalSpend = computeTotalSpend(rows);
  const activeCardsLabel =
    rows.length === 1 ? "1 active card" : `${rows.length} active cards`;

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
            menuLabel="Corporate card spend actions"
          />
        </div>

        <div className="app-shell-dashboard-widget-body">
          <section
            aria-labelledby={summaryId}
            className="app-shell-dashboard-payment-summary"
          >
            <div className="app-shell-dashboard-payment-total-row">
              <span
                className="app-shell-dashboard-payment-total"
                id={summaryId}
              >
                {formatDashboardCurrency(totalSpend)}
              </span>
              <span className="app-shell-dashboard-payment-postings">
                {activeCardsLabel}
              </span>
            </div>
            <span className="app-shell-dashboard-payment-comparison">
              {comparisonText}
            </span>
          </section>

          <Separator />

          {rows.length === 0 ? (
            <p className="app-shell-dashboard-payment-empty" role="status">
              No corporate card activity yet.
            </p>
          ) : (
            <div
              aria-labelledby={titleId}
              className="app-shell-dashboard-payment-table-frame"
              role="region"
            >
              <Table>
                <caption className="sr-only">
                  Corporate card spend by program
                </caption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Card</TableHead>
                    <TableHead scope="col">Date</TableHead>
                    <TableHead scope="col">Spend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <PaymentHistoryRow key={row.id} row={row} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </article>
  );
}
