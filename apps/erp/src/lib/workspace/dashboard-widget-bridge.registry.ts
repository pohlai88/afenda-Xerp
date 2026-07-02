import type { McpSeedBlockId } from "@afenda/shadcn-studio";

/** Canonical widget keys from dashboard-layout.api-contract.ts */
export const DASHBOARD_CANONICAL_WIDGET_IDS = [
  "invoice-table",
  "kpi-active-orders",
  "kpi-headcount",
  "kpi-net-income",
  "kpi-open-tasks",
  "module-earnings",
  "payment-history",
  "recent-transactions",
  "regional-sales",
  "revenue-chart",
  "sparkline-expense",
  "sparkline-revenue",
  "statistics-line-trends",
  "statistics-metrics",
] as const;

export type DashboardCanonicalWidgetId =
  (typeof DASHBOARD_CANONICAL_WIDGET_IDS)[number];

/** Legacy layout keys retained for stored layout migration. */
export const DASHBOARD_LEGACY_WIDGET_IDS = [
  "kpi-stats",
  "sparkline-stats",
] as const;

export type DashboardLegacyWidgetId =
  (typeof DASHBOARD_LEGACY_WIDGET_IDS)[number];

export type DashboardWidgetBridgeKey =
  | DashboardCanonicalWidgetId
  | DashboardLegacyWidgetId;

export interface DashboardWidgetDefaultLayoutHint {
  readonly h: number;
  readonly minH?: number;
  readonly minW?: number;
  readonly w: number;
}

export interface DashboardWidgetBridgeEntry {
  readonly bindingId?: string;
  readonly blockId: McpSeedBlockId;
  readonly defaultLayout: DashboardWidgetDefaultLayoutHint;
}

/** Tier A v1 — shipped in default workspace preset. */
export const DASHBOARD_TIER_A_V1_WIDGET_IDS = [
  "kpi-net-income",
  "revenue-chart",
  "statistics-line-trends",
  "payment-history",
  "recent-transactions",
  "invoice-table",
] as const satisfies readonly DashboardCanonicalWidgetId[];

export type DashboardTierAV1WidgetId =
  (typeof DASHBOARD_TIER_A_V1_WIDGET_IDS)[number];

const CANONICAL_BRIDGE_ENTRIES = {
  "invoice-table": {
    blockId: "datatable-invoice",
    defaultLayout: { w: 12, h: 4, minW: 6, minH: 2 },
  },
  "kpi-active-orders": {
    blockId: "statistics-orders-progress-card",
    defaultLayout: { w: 4, h: 2, minW: 2, minH: 1 },
  },
  "kpi-headcount": {
    blockId: "statistics-card-03",
    defaultLayout: { w: 3, h: 2, minW: 2, minH: 1 },
  },
  "kpi-net-income": {
    blockId: "statistics-card-01",
    defaultLayout: { w: 4, h: 2, minW: 2, minH: 1 },
  },
  "kpi-open-tasks": {
    blockId: "statistics-card-04",
    defaultLayout: { w: 3, h: 2, minW: 2, minH: 1 },
  },
  "module-earnings": {
    blockId: "widget-total-earning",
    defaultLayout: { w: 4, h: 3, minW: 3, minH: 2 },
  },
  "payment-history": {
    blockId: "widget-payment-history",
    defaultLayout: { w: 4, h: 3, minW: 3, minH: 2 },
  },
  "recent-transactions": {
    blockId: "widget-transactions",
    defaultLayout: { w: 4, h: 3, minW: 3, minH: 2 },
  },
  "regional-sales": {
    blockId: "widget-sales-by-countries",
    defaultLayout: { w: 4, h: 3, minW: 3, minH: 2 },
  },
  "revenue-chart": {
    blockId: "chart-sales-metrics",
    defaultLayout: { w: 8, h: 3, minW: 4, minH: 2 },
  },
  "sparkline-expense": {
    blockId: "statistics-expense-card",
    defaultLayout: { w: 3, h: 2, minW: 2, minH: 1 },
  },
  "sparkline-revenue": {
    blockId: "statistics-revenue-card",
    defaultLayout: { w: 3, h: 2, minW: 2, minH: 1 },
  },
  "statistics-line-trends": {
    blockId: "statistics-line-trends-card",
    defaultLayout: { w: 4, h: 2, minW: 3, minH: 1 },
  },
  "statistics-metrics": {
    blockId: "statistics-sales-overview-card",
    defaultLayout: { w: 4, h: 2, minW: 3, minH: 1 },
  },
} as const satisfies Record<
  DashboardCanonicalWidgetId,
  DashboardWidgetBridgeEntry
>;

const LEGACY_BRIDGE_ENTRIES = {
  "kpi-stats": {
    blockId: "statistics-card-01",
    defaultLayout: { w: 4, h: 2, minW: 2, minH: 1 },
  },
  "sparkline-stats": {
    blockId: "statistics-trend-card",
    defaultLayout: { w: 3, h: 2, minW: 2, minH: 1 },
  },
} as const satisfies Record<
  DashboardLegacyWidgetId,
  DashboardWidgetBridgeEntry
>;

export const DASHBOARD_WIDGET_BRIDGE_REGISTRY: Readonly<
  Record<DashboardWidgetBridgeKey, DashboardWidgetBridgeEntry>
> = {
  ...CANONICAL_BRIDGE_ENTRIES,
  ...LEGACY_BRIDGE_ENTRIES,
};

export function isDashboardWidgetBridgeKey(
  widgetKey: string
): widgetKey is DashboardWidgetBridgeKey {
  return widgetKey in DASHBOARD_WIDGET_BRIDGE_REGISTRY;
}

export function resolveDashboardWidgetBridgeEntry(
  widgetKey: string
): DashboardWidgetBridgeEntry | undefined {
  if (!isDashboardWidgetBridgeKey(widgetKey)) {
    return;
  }

  return DASHBOARD_WIDGET_BRIDGE_REGISTRY[widgetKey];
}

export function resolveDashboardWidgetBlockId(
  widgetKey: string
): McpSeedBlockId | undefined {
  return resolveDashboardWidgetBridgeEntry(widgetKey)?.blockId;
}

export function listDashboardCanonicalWidgetBridgeKeys(): readonly DashboardCanonicalWidgetId[] {
  return DASHBOARD_CANONICAL_WIDGET_IDS;
}
