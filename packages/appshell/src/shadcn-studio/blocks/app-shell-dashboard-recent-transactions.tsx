import { Avatar, AvatarFallback, Card, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_COMPARISON,
  DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_TITLE,
  defaultAppShellDashboardTransactions,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardOverflowMenuItem,
  AppShellDashboardTransactionRow,
  AppShellTransactionDirection,
} from "../data/app-shell.dashboard.types";
import {
  formatDashboardCurrency,
  parseDashboardAmount,
} from "./app-shell-dashboard-breakdown.utils";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardRecentTransactionsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Card" | "Separator"
>;

export interface AppShellDashboardRecentTransactionsProps {
  readonly comparisonText?: string;
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
  readonly subtitle?: string;
  readonly title?: string;
  readonly transactions?: readonly AppShellDashboardTransactionRow[];
}

interface TransactionTotals {
  readonly credits: number;
  readonly debits: number;
  readonly net: number;
}

function formatSignedAmount(
  direction: AppShellTransactionDirection,
  amount: string
): string {
  const prefix = direction === "credit" ? "+" : "-";
  return `${prefix}${formatDashboardCurrency(parseDashboardAmount(amount))}`;
}

function formatNetFlow(net: number): string {
  const prefix = net > 0 ? "+" : net < 0 ? "-" : "";
  return `${prefix}${formatDashboardCurrency(Math.abs(net))}`;
}

function computeTransactionTotals(
  transactions: readonly AppShellDashboardTransactionRow[]
): TransactionTotals {
  return transactions.reduce<TransactionTotals>(
    (totals, transaction) => {
      const amount = parseDashboardAmount(transaction.amount);

      if (transaction.direction === "credit") {
        return {
          credits: totals.credits + amount,
          debits: totals.debits,
          net: totals.net + amount,
        };
      }

      return {
        credits: totals.credits,
        debits: totals.debits + amount,
        net: totals.net - amount,
      };
    },
    { credits: 0, debits: 0, net: 0 }
  );
}

function TransactionRow({
  transaction,
}: {
  readonly transaction: AppShellDashboardTransactionRow;
}) {
  const rowLabel = `${transaction.paymentMethod}, ${transaction.module}, ${formatSignedAmount(transaction.direction, transaction.amount)}`;

  return (
    <li aria-label={rowLabel} className="app-shell-dashboard-transaction-row">
      <div className="app-shell-dashboard-transaction-main">
        <Avatar>
          <AvatarFallback>
            <div className="app-shell-dashboard-transaction-icon-frame">
              <transaction.Icon
                aria-hidden
                className="app-shell-dashboard-transaction-icon"
              />
            </div>
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
      <span
        className={
          transaction.direction === "credit"
            ? "app-shell-dashboard-transaction-amount app-shell-dashboard-transaction-amount-credit"
            : "app-shell-dashboard-transaction-amount app-shell-dashboard-transaction-amount-debit"
        }
      >
        {formatSignedAmount(transaction.direction, transaction.amount)}
      </span>
    </li>
  );
}

export function AppShellDashboardRecentTransactions({
  title = DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_SUBTITLE,
  comparisonText = DEFAULT_APP_SHELL_DASHBOARD_TRANSACTIONS_COMPARISON,
  transactions = defaultAppShellDashboardTransactions,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardRecentTransactionsProps) {
  const titleId = useId();
  const summaryId = useId();
  const listLabelId = useId();
  const { credits, debits, net } = computeTransactionTotals(transactions);
  const postingsLabel =
    transactions.length === 1 ? "1 posting" : `${transactions.length} postings`;

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
            menuLabel="Recent transactions actions"
          />
        </div>

        <div className="app-shell-dashboard-widget-body">
          <section
            aria-labelledby={summaryId}
            className="app-shell-dashboard-transaction-summary"
          >
            <div className="app-shell-dashboard-transaction-total-row">
              <span
                className="app-shell-dashboard-transaction-total"
                id={summaryId}
              >
                {formatNetFlow(net)}
              </span>
              <span className="app-shell-dashboard-transaction-postings">
                {postingsLabel}
              </span>
            </div>
            <div className="app-shell-dashboard-transaction-flow-row">
              <span className="app-shell-dashboard-transaction-flow-item">
                In {formatDashboardCurrency(credits)}
              </span>
              <span
                aria-hidden="true"
                className="app-shell-dashboard-transaction-flow-divider"
              >
                ·
              </span>
              <span className="app-shell-dashboard-transaction-flow-item">
                Out {formatDashboardCurrency(debits)}
              </span>
            </div>
            <span className="app-shell-dashboard-transaction-comparison">
              {comparisonText}
            </span>
          </section>

          <Separator />

          {transactions.length === 0 ? (
            <p className="app-shell-dashboard-transaction-empty" role="status">
              No ledger activity yet.
            </p>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="app-shell-dashboard-transaction-list-header"
              >
                <span>Transaction</span>
                <span>Amount</span>
              </div>
              <span className="sr-only" id={listLabelId}>
                Recent ledger postings
              </span>
              <ul
                aria-labelledby={`${summaryId} ${listLabelId}`}
                className="app-shell-dashboard-transaction-list"
              >
                {transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
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
