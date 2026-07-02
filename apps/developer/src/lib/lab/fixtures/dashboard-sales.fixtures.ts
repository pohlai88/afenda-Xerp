export type LabMetricIconKey = "dollar" | "users" | "cart" | "trend";

export interface LabMetricCardWire {
  readonly changePercentage: string;
  readonly changePercentValue?: number;
  readonly iconKey: LabMetricIconKey;
  readonly id: string;
  readonly title: string;
  readonly value: string;
}

export interface LabSalesMetricsPiePointWire {
  readonly fill: string;
  readonly month: string;
  readonly sales: number;
}

export interface LabSalesMetricsBarPointWire {
  readonly date: string;
  readonly sales: number;
}

export interface LabSalesMetricsMetricWire {
  readonly iconKey: LabMetricIconKey;
  readonly title: string;
  readonly value: string;
}

export const salesMetricsPieData = [
  { month: "january", sales: 340, fill: "var(--color-january)" },
  { month: "february", sales: 200, fill: "var(--color-february)" },
  { month: "march", sales: 200, fill: "var(--color-march)" },
] as const satisfies readonly LabSalesMetricsPiePointWire[];

function buildSalesPlanBarData(
  salesPlanPercentage: number,
  totalBars = 24
): LabSalesMetricsBarPointWire[] {
  const filledBars = Math.round((salesPlanPercentage * totalBars) / 100);
  const date = new Date(2025, 5, 15);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return Array.from({ length: totalBars }, (_, index) => ({
    date: formattedDate,
    sales: index < filledBars ? 315 : 0.0001,
  }));
}

export const salesDashboardFixtures = {
  title: "Sales dashboard",
  metricCards: [
    {
      id: "revenue",
      iconKey: "dollar",
      title: "Total revenue",
      value: "$45,231",
      changePercentage: "+12.5%",
    },
    {
      id: "users",
      iconKey: "users",
      title: "Active users",
      value: "8,420",
      changePercentage: "+18%",
      changePercentValue: 18,
    },
    {
      id: "orders",
      iconKey: "cart",
      title: "Orders",
      value: "1,284",
      changePercentage: "+6.2%",
    },
    {
      id: "conversion",
      iconKey: "trend",
      title: "Conversion rate",
      value: "3.42%",
      changePercentage: "+4.8%",
      changePercentValue: 4.8,
    },
  ] as const satisfies readonly LabMetricCardWire[],
  salesMetrics: {
    title: "Sales metrics",
    company: {
      email: "sandy@company.com",
      logoUrl: "https://cdn.shadcnstudio.com/ss-assets/logo/logo-square.png",
      name: "Sandy's Company",
    },
    metrics: [
      { iconKey: "trend", title: "Sales trend", value: "$11,548" },
      { iconKey: "dollar", title: "Discount offers", value: "$1,326" },
      { iconKey: "dollar", title: "Net profit", value: "$17,356" },
      { iconKey: "cart", title: "Total orders", value: "248" },
    ] as const satisfies readonly LabSalesMetricsMetricWire[],
    revenueGoalTitle: "Revenue goal",
    revenuePieData: salesMetricsPieData,
    revenueCenterValue: "256.24",
    revenueCenterLabel: "Total Profit",
    planCompletedLabel: "Plan completed",
    planCompletedPercent: "56%",
    salesPlanTitle: "Sales plan",
    salesPlanPercentage: 54,
    salesPlanDescription: "Percentage profit from total sales",
    salesBarChartData: buildSalesPlanBarData(54),
  },
} as const;

export type SalesDashboardFixtures = typeof salesDashboardFixtures;
