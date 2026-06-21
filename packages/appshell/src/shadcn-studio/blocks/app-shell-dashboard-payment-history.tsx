import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_TITLE,
  defaultAppShellDashboardPaymentHistory,
} from "../data/app-shell.dashboard.data";
import type { AppShellDashboardPaymentHistoryRow } from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardPaymentHistoryGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Table"
>;

export interface AppShellDashboardPaymentHistoryProps {
  readonly title?: string;
  readonly rows?: readonly AppShellDashboardPaymentHistoryRow[];
  readonly overflowItems?: readonly string[];
}

export function AppShellDashboardPaymentHistory({
  title = DEFAULT_APP_SHELL_DASHBOARD_PAYMENT_HISTORY_TITLE,
  rows = defaultAppShellDashboardPaymentHistory,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardPaymentHistoryProps) {
  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-widget-header">
          <span className="app-shell-dashboard-widget-title">{title}</span>
          <AppShellDashboardOverflowMenu items={overflowItems} />
        </div>
        <div className="app-shell-dashboard-payment-table-frame">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="app-shell-dashboard-payment-card-cell">
                      <div className="app-shell-dashboard-payment-brand-frame">
                        <img alt={row.brandIconAlt} src={row.brandIconSrc} />
                      </div>
                      <div className="app-shell-dashboard-payment-card-copy">
                        <span className="app-shell-dashboard-payment-card-number">
                          *{row.cardNumber}
                        </span>
                        <span className="app-shell-dashboard-payment-card-type">
                          {row.cardType}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="app-shell-dashboard-payment-date">{row.date}</span>
                  </TableCell>
                  <TableCell>
                    <div className="app-shell-dashboard-payment-spend-cell">
                      <span className="app-shell-dashboard-payment-spend">-${row.spend}</span>
                      <span className="app-shell-dashboard-payment-remaining">
                        ${row.remaining}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
