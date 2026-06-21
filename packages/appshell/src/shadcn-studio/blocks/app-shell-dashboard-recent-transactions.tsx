import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Avatar, AvatarFallback, Card } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_TITLE,
  defaultAppShellDashboardTransactions,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardTransactionRow,
  AppShellTransactionDirection,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardRecentTransactionsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Card"
>;

export interface AppShellDashboardRecentTransactionsProps {
  readonly title?: string;
  readonly transactions?: readonly AppShellDashboardTransactionRow[];
  readonly overflowItems?: readonly string[];
}

function TransactionDirectionIndicator({
  direction,
}: {
  readonly direction: AppShellTransactionDirection;
}) {
  return (
    <div className="app-shell-dashboard-transaction-indicator">
      {direction === "debit" ? (
        <ArrowDownIcon
          aria-hidden
          className="app-shell-dashboard-transaction-indicator-icon app-shell-dashboard-transaction-indicator-icon-debit"
        />
      ) : (
        <ArrowUpIcon
          aria-hidden
          className="app-shell-dashboard-transaction-indicator-icon app-shell-dashboard-transaction-indicator-icon-credit"
        />
      )}
    </div>
  );
}

export function AppShellDashboardRecentTransactions({
  title = DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_TITLE,
  transactions = defaultAppShellDashboardTransactions,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardRecentTransactionsProps) {
  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-widget-header">
          <span className="app-shell-dashboard-widget-title">{title}</span>
          <AppShellDashboardOverflowMenu items={overflowItems} />
        </div>
        <ul className="app-shell-dashboard-transaction-list">
          {transactions.map((transaction) => (
            <li className="app-shell-dashboard-transaction-row" key={transaction.id}>
              <div className="app-shell-dashboard-transaction-main">
                <Avatar>
                  <AvatarFallback>
                    <transaction.Icon aria-hidden className="app-shell-dashboard-transaction-icon" />
                  </AvatarFallback>
                </Avatar>
                <div className="app-shell-dashboard-transaction-copy">
                  <span className="app-shell-dashboard-transaction-title">
                    {transaction.paymentMethod}
                  </span>
                  <span className="app-shell-dashboard-transaction-subtitle">
                    {transaction.module}
                  </span>
                </div>
              </div>
              <div className="app-shell-dashboard-transaction-amount-row">
                <span className="app-shell-dashboard-transaction-amount">
                  {transaction.direction === "debit" ? "-" : "+"}
                  {transaction.amount}
                </span>
                <TransactionDirectionIndicator direction={transaction.direction} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
