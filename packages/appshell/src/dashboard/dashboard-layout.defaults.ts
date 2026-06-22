import type { DashboardLayoutPreset } from "./dashboard-layout.contract";

export const DEFAULT_DASHBOARD_LAYOUT = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  items: [
    { i: "sparkline-revenue", x: 0, y: 0, w: 6, h: 2 },
    { i: "sparkline-expense", x: 6, y: 0, w: 6, h: 2 },
    { i: "kpi-net-income", x: 0, y: 2, w: 3, h: 2 },
    { i: "kpi-active-orders", x: 3, y: 2, w: 3, h: 2 },
    { i: "kpi-headcount", x: 6, y: 2, w: 3, h: 2 },
    { i: "kpi-open-tasks", x: 9, y: 2, w: 3, h: 2 },
    { i: "statistics-metrics", x: 0, y: 4, w: 12, h: 3 },
    { i: "statistics-line-trends", x: 0, y: 7, w: 12, h: 3 },
    { i: "revenue-chart", x: 0, y: 10, w: 12, h: 4 },
    { i: "module-earnings", x: 0, y: 14, w: 6, h: 4 },
    { i: "regional-sales", x: 6, y: 14, w: 6, h: 4 },
    { i: "recent-transactions", x: 0, y: 18, w: 6, h: 4 },
    { i: "payment-history", x: 6, y: 18, w: 6, h: 4 },
    { i: "invoice-table", x: 0, y: 22, w: 12, h: 5 },
  ],
} satisfies DashboardLayoutPreset;
