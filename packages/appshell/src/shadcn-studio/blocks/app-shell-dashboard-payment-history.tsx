import {
  Badge,
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
import type { GovernedBadgeProps, GovernedUiComponentName } from "@afenda/ui/governance";

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
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardPaymentHistoryGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Card" | "Progress" | "Separator" | "Table"
>;

export interface AppShellDashboardPaymentHistoryProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly comparisonText?: string;
  readonly rows?: readonly AppShellDashboardPaymentHistoryRow[];
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
}

function parseAmount(value: string): number {
  return Number.parseFloat(value.replaceAll(",", ""));
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function computeUtilization(spend: string, remaining: string): number {
  const spent = parseAmount(spend);
  const left = parseAmount(remaining);
  const limit = spent + left;

  if (limit <= 0) {
    return 0;
  }

  return Math.round((spent / limit) * 100);
}

function resolveUtilizationBadgeTone(
  utilization: number
): NonNullable<GovernedBadgeProps["tone"]> {
  if (utilization >= 85) {
    return "danger";
  }

  if (utilization >= 60) {
    return "neutral";
  }

  return "success";
}

function computeTotalSpend(rows: readonly AppShellDashboardPaymentHistoryRow[]): number {
  return rows.reduce((total, row) => total + parseAmount(row.spend), 0);
}

function PaymentHistoryRow({ row }: { readonly row: AppShellDashboardPaymentHistoryRow }) {
  const utilization = computeUtilization(row.spend, row.remaining);
  const utilizationLabel = `${row.cardType} utilized ${utilization}% of limit`;

  return (
    <TableRow>
      <TableCell>
        <div className="app-shell-dashboard-payment-card-cell">
          <div className="app-shell-dashboard-payment-brand-frame">
            <img alt={row.brandIconAlt} height={28} src={row.brandIconSrc} width={28} />
          </div>
          <div className="app-shell-dashboard-payment-card-copy">
            <span className="app-shell-dashboard-payment-card-number">
              •••• {row.cardNumber}
            </span>
            <span className="app-shell-dashboard-payment-card-type">{row.cardType}</span>
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
              -{formatCurrency(parseAmount(row.spend))}
            </span>
            <Badge emphasis="soft" tone={resolveUtilizationBadgeTone(utilization)}>
              {utilization}%
            </Badge>
          </div>
          <span className="app-shell-dashboard-payment-remaining">
            {formatCurrency(parseAmount(row.remaining))} remaining
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
  const summaryId = "app-shell-dashboard-payment-history-summary";
  const totalSpend = computeTotalSpend(rows);
  const activeCardsLabel =
    rows.length === 1 ? "1 active card" : `${rows.length} active cards`;

  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-widget-header app-shell-dashboard-widget-header-stacked">
          <div className="app-shell-dashboard-widget-heading">
            <span className="app-shell-dashboard-widget-title">{title}</span>
            <span className="app-shell-dashboard-widget-subtitle">{subtitle}</span>
          </div>
          <AppShellDashboardOverflowMenu items={overflowItems} />
        </div>

        <div className="app-shell-dashboard-widget-body">
          <section
            aria-labelledby={summaryId}
            className="app-shell-dashboard-payment-summary"
          >
            <div className="app-shell-dashboard-payment-total-row">
              <span className="app-shell-dashboard-payment-total" id={summaryId}>
                {formatCurrency(totalSpend)}
              </span>
              <Badge emphasis="soft" tone="neutral">
                {activeCardsLabel}
              </Badge>
            </div>
            <span className="app-shell-dashboard-payment-comparison">{comparisonText}</span>
          </section>

          <Separator />

          {rows.length === 0 ? (
            <p className="app-shell-dashboard-payment-empty">No corporate card activity yet.</p>
          ) : (
            <div className="app-shell-dashboard-payment-table-frame">
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
    </div>
  );
}
