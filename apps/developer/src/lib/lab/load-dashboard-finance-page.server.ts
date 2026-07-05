import type { Metadata } from "next";
import type {
  FinanceDashboardPageData,
  LabPromotionNote,
  LabRouteLoader,
} from "./contracts";
import { createRouteLabMetadata } from "./create-route-lab-metadata";

export const financeDashboardPromotionNote = {
  futureErpPath:
    "apps/erp/src/lib/dashboard/load-finance-dashboard-page.server.ts",
  futureDataSource: "domain-loader",
  notes:
    "Replace these fixtures with finance domain projections once ERP runtime owns the operating context and treasury inputs.",
} satisfies LabPromotionNote;

const demoFinanceDashboardPageData = {
  canonicalHref: "/dashboard/finance",
  title: "Finance readiness view",
  description:
    "Secondary dashboard route proving the same page/load/component law after the canonical sales route is stable.",
  previewImage: {
    alt: "Finance route blueprint showing treasury KPIs, focus areas, and promotion seams in the Afenda route lab.",
    height: 720,
    src: "/dashboard-finance-blueprint.svg",
    width: 1280,
  },
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

export function createFinanceDashboardMetadata(): Metadata {
  return createRouteLabMetadata({
    canonicalHref: demoFinanceDashboardPageData.canonicalHref,
    description:
      "Secondary finance dashboard route in the Afenda route lab, proving the same page, loader, and composition law as the canonical sales route.",
    previewImage: demoFinanceDashboardPageData.previewImage,
    title: "Finance readiness view",
  });
}
