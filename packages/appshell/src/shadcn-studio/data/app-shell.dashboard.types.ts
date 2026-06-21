import type { ComponentType } from "react";

type Brand<T, B extends string> = T & { readonly _brand: B };

/** Branded invoice identifier — brand at the data boundary only. */
export type AppShellInvoiceId = Brand<string, "AppShellInvoiceId">;

/** Branded dashboard row identifier for list keys and aria labels. */
export type AppShellDashboardRowId = Brand<string, "AppShellDashboardRowId">;

export function asAppShellInvoiceId(value: string): AppShellInvoiceId {
  return value as AppShellInvoiceId;
}

export function asAppShellDashboardRowId(value: string): AppShellDashboardRowId {
  return value as AppShellDashboardRowId;
}

export type AppShellTrendDirection = "down" | "up";

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
  readonly id: AppShellDashboardRowId;
  readonly metricKey: "expense" | "revenue";
  readonly title: string;
  readonly amount: string;
  readonly changeLabel: string;
  readonly trend: AppShellTrendDirection;
  readonly data: readonly AppShellDashboardSparklinePoint[];
}

export interface AppShellDashboardKpiMetric {
  readonly id: AppShellDashboardRowId;
  readonly title: string;
  readonly badge: string;
  readonly value: string;
  readonly changePercentage: number;
  readonly Icon: ComponentType<{ readonly className?: string }>;
}

export interface AppShellDashboardModuleEarningRow {
  readonly id: AppShellDashboardRowId;
  readonly module: string;
  readonly subtitle: string;
  readonly amount: string;
  readonly progress: number;
  readonly iconSrc: string;
  readonly iconAlt: string;
}

export interface AppShellDashboardTransactionRow {
  readonly id: AppShellDashboardRowId;
  readonly paymentMethod: string;
  readonly module: string;
  readonly amount: string;
  readonly direction: AppShellTransactionDirection;
  readonly Icon: ComponentType<{ readonly className?: string }>;
}

export interface AppShellDashboardRegionalSalesRow {
  readonly id: AppShellDashboardRowId;
  readonly region: string;
  readonly amount: string;
  readonly changeLabel: string;
  readonly trend: AppShellTrendDirection;
  readonly flagSrc: string;
  readonly flagAlt: string;
}

export interface AppShellDashboardPaymentHistoryRow {
  readonly id: AppShellDashboardRowId;
  readonly cardNumber: string;
  readonly cardType: string;
  readonly date: string;
  readonly spend: string;
  readonly remaining: string;
  readonly brandIconSrc: string;
  readonly brandIconAlt: string;
}

export interface AppShellDashboardInvoiceRow {
  readonly id: AppShellInvoiceId;
  readonly status: AppShellInvoiceStatus;
  readonly avatarSrc: string;
  readonly avatarFallback: string;
  readonly client: string;
  readonly field: string;
  readonly total: number;
  readonly issuedDate: Date;
  readonly balance: number;
}

export interface AppShellDashboardRevenueBarPoint {
  readonly name: string;
  readonly priorYear: number;
  readonly currentYear: number;
}

export interface AppShellDashboardRevenueGrowthSlice {
  readonly date: string;
  readonly revenue: number;
}
