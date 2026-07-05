import type {
  FinanceDashboardPageData,
  LabPromotionNote,
  LabRouteLoader,
} from "./contracts";

export const financeDashboardPromotionNote = {
  futureErpPath:
    "apps/erp/src/lib/dashboard/load-finance-dashboard-page.server.ts",
  futureDataSource: "domain-loader",
  notes:
    "Replace these fixtures with finance domain projections once ERP runtime owns the operating context and treasury inputs.",
} satisfies LabPromotionNote;

const demoFinanceDashboardPageData = {
  title: "Finance readiness view",
  description:
    "Secondary dashboard route proving the same page/load/component law after the canonical sales route is stable.",
  promotionSummary:
    "Finance keeps the same operator-shell law while its data authority moves to ERP domain inputs later.",
  promotion: financeDashboardPromotionNote,
  revenue: {
    title: "Cash position",
    amount: "RM 1.38M",
    changePercentage: 9,
    periodLabel: "Rolling close posture",
    chartData: [
      { day: "Mon", revenue: 84 },
      { day: "Tue", revenue: 110 },
      { day: "Wed", revenue: 125 },
      { day: "Thu", revenue: 117 },
      { day: "Fri", revenue: 149 },
      { day: "Sat", revenue: 143 },
      { day: "Sun", revenue: 168 },
    ],
  },
  focusAreas: [
    {
      title: "Close management",
      summary:
        "Route keeps discussion on screen density, KPI emphasis, and review sequencing rather than data plumbing.",
    },
    {
      title: "Promotion path",
      summary:
        "ERP can later source from internal loaders or BFF contracts without changing this route boundary.",
    },
    {
      title: "Rendering discipline",
      summary:
        "This remains request-dynamic to mirror future operator surfaces, not because it resolves tenant state today.",
    },
  ],
} satisfies FinanceDashboardPageData;

export const loadDashboardFinancePage: LabRouteLoader<
  FinanceDashboardPageData
> = async () => demoFinanceDashboardPageData;
