import { type Brand, brandRequiredId } from "@afenda/kernel";
import type { ComponentType } from "react";

/** Branded invoice identifier — brand at the data boundary only. */
export type AppShellInvoiceId = Brand<string, "AppShellInvoiceId">;

/** Branded dashboard row identifier for list keys and aria labels. */
export type AppShellDashboardRowId = Brand<string, "AppShellDashboardRowId">;

/** Brand a trusted invoice id at the data boundary (fixtures, API mappers). */
export function asAppShellInvoiceId(value: string): AppShellInvoiceId {
  return brandRequiredId(value, "AppShellInvoiceId");
}

/** Brand a trusted dashboard row id at the data boundary (fixtures, API mappers). */
export function asAppShellDashboardRowId(
  value: string
): AppShellDashboardRowId {
  return brandRequiredId(value, "AppShellDashboardRowId");
}

export type AppShellTrendDirection = "down" | "up";

export type AppShellDashboardOverflowMenuSection = "primary" | "secondary";

export interface AppShellDashboardOverflowMenuItem {
  readonly Icon: ComponentType<{ readonly className?: string }>;
  readonly id: string;
  readonly label: string;
  readonly section?: AppShellDashboardOverflowMenuSection;
  readonly shortcut?: string;
  readonly variant?: "destructive";
}

export type AppShellTransactionDirection = "credit" | "debit";

export type AppShellInvoiceStatus =
  | { readonly kind: "downloaded" }
  | { readonly kind: "draft" }
  | { readonly kind: "paid" }
  | { readonly kind: "past_due" };

export interface AppShellDashboardSparklinePoint {
  readonly date: string;
  readonly value: number;
}

export interface AppShellDashboardSparklineMetric {
  readonly amount: string;
  readonly changeLabel: string;
  readonly data: readonly AppShellDashboardSparklinePoint[];
  readonly id: AppShellDashboardRowId;
  readonly metricKey: "expense" | "revenue";
  readonly title: string;
  readonly trend: AppShellTrendDirection;
}

export interface AppShellDashboardKpiMetric {
  readonly badge: string;
  readonly changePercentage: number;
  readonly Icon: ComponentType<{ readonly className?: string }>;
  readonly id: AppShellDashboardRowId;
  readonly title: string;
  readonly value: string;
}

export interface AppShellDashboardModuleEarningRow {
  readonly amount: string;
  readonly changeLabel: string;
  readonly iconAlt: string;
  readonly iconSrc: string;
  readonly id: AppShellDashboardRowId;
  readonly module: string;
  readonly progress: number;
  readonly subtitle: string;
  readonly trend: AppShellTrendDirection;
}

export interface AppShellDashboardTransactionRow {
  readonly amount: string;
  readonly direction: AppShellTransactionDirection;
  readonly Icon: ComponentType<{ readonly className?: string }>;
  readonly id: AppShellDashboardRowId;
  readonly module: string;
  readonly paymentMethod: string;
}

export interface AppShellDashboardRegionalSalesRow {
  readonly amount: string;
  readonly changeLabel: string;
  readonly flagAlt: string;
  readonly flagSrc: string;
  readonly id: AppShellDashboardRowId;
  readonly region: string;
  readonly trend: AppShellTrendDirection;
}

export interface AppShellDashboardPaymentHistoryRow {
  readonly brandIconAlt: string;
  readonly brandIconSrc: string;
  readonly cardNumber: string;
  readonly cardType: string;
  readonly date: string;
  readonly id: AppShellDashboardRowId;
  readonly remaining: string;
  readonly spend: string;
}

export interface AppShellDashboardInvoiceRow {
  readonly avatarFallback: string;
  readonly avatarSrc: string;
  readonly balance: number;
  readonly client: string;
  readonly field: string;
  readonly id: AppShellInvoiceId;
  /**
   * Client-side date for sorting and display. Wire/API boundaries should use
   * ISO 8601 strings and map to `Date` before passing rows to the table.
   */
  readonly issuedDate: Date;
  readonly status: AppShellInvoiceStatus;
  readonly total: number;
}

export interface AppShellDashboardRevenueBarPoint {
  readonly currentYear: number;
  readonly name: string;
  readonly priorYear: number;
}

export interface AppShellDashboardRevenueGrowthSlice {
  readonly date: string;
  readonly revenue: number;
}

export interface AppShellDashboardRevenueYearSummary {
  readonly amount: string;
  readonly Icon: ComponentType<{ readonly className?: string }>;
  readonly id: AppShellDashboardRowId;
  readonly year: string;
}
