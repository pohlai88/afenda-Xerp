import type {
  LabPromotionNote,
  LabRouteLoader,
  SalesDashboardPageData,
} from "./contracts";

export const salesDashboardPromotionNote = {
  futureErpPath:
    "apps/erp/src/lib/dashboard/load-sales-dashboard-page.server.ts",
  futureDataSource: "domain-loader",
  notes:
    "Replace lab fixture data with tenant-scoped sales dashboard inputs while preserving the route and panel composition.",
} satisfies LabPromotionNote;

const demoSalesDashboardPageData = {
  title: "Sales command surface",
  description:
    "Canonical operator route proving the thin page, typed server loader, route-local panels, and promotion note boundary.",
  promotionSummary:
    "This screen promotes by swapping lab fixtures for the ERP sales domain loader, not by rewriting route composition.",
  promotion: salesDashboardPromotionNote,
  revenue: {
    title: "Gross revenue",
    amount: "RM 245,300",
    changePercentage: 18,
    periodLabel: "Last 7 operating days",
    chartData: [
      { day: "Mon", revenue: 120 },
      { day: "Tue", revenue: 148 },
      { day: "Wed", revenue: 136 },
      { day: "Thu", revenue: 194 },
      { day: "Fri", revenue: 232 },
      { day: "Sat", revenue: 185 },
      { day: "Sun", revenue: 206 },
    ],
  },
  overview: {
    title: "Order fulfilment shape",
    totalValue: "48.2K",
    changePercentage: "+6.2%",
    orderSide: {
      label: "Open orders",
      percentage: "63%",
      count: "304 active lines",
    },
    deliveredSide: {
      label: "Delivered",
      percentage: "37%",
      count: "177 closed lines",
    },
    progressValue: 63,
  },
  proof: {
    title: "Why this route is the canonical pattern",
    description:
      "The page owns route framing only. Each panel receives fully-shaped props from the server loader and no client leaf owns orchestration.",
    checklist: [
      {
        title: "Thin page boundary",
        summary:
          "The route loads a single typed payload and renders route-local panels only.",
        status: "Pass",
      },
      {
        title: "Promotion-ready contract",
        summary:
          "Future ERP integration is documented as a path note rather than implemented as a fake backend.",
        status: "Pass",
      },
      {
        title: "Client leaf containment",
        summary:
          "Interactive chart rendering stays inside imported studio blocks instead of local page logic.",
        status: "Pass",
      },
    ],
  },
} satisfies SalesDashboardPageData;

export const loadDashboardSalesPage: LabRouteLoader<
  SalesDashboardPageData
> = async () => demoSalesDashboardPageData;
