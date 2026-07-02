import type { LabMetricIconKey } from "./dashboard-sales.fixtures";

export interface LabTotalRevenueBarPointWire {
  readonly amt: number;
  readonly name: string;
  readonly pv: number;
  readonly uv: number;
}

export interface LabTotalRevenueGrowthPointWire {
  readonly date: string;
  readonly fill: string;
  readonly revenue: number;
}

export interface LabTotalRevenueYearSummaryWire {
  readonly amount: string;
  readonly iconKey: "circle-dollar" | "wallet";
  readonly year: string;
}

export interface LabFinanceMetricCardWire {
  readonly changePercentage: string;
  readonly changePercentValue?: number;
  readonly iconKey: LabMetricIconKey;
  readonly id: string;
  readonly title: string;
  readonly value: string;
}

export const financeDashboardFixtures = {
  title: "Finance dashboard",
  metricCards: [
    {
      id: "income",
      iconKey: "dollar",
      title: "Income this month",
      value: "$5,280",
      changePercentage: "+12.2%",
    },
    {
      id: "expense",
      iconKey: "trend",
      title: "Expense this month",
      value: "$4,120",
      changePercentage: "-12.2%",
      changePercentValue: -12.2,
    },
    {
      id: "profit",
      iconKey: "dollar",
      title: "Net profit",
      value: "$1,160",
      changePercentage: "+8.4%",
    },
    {
      id: "runway",
      iconKey: "users",
      title: "Cash runway",
      value: "14 mo",
      changePercentage: "+1 mo",
      changePercentValue: 1,
    },
  ] as const satisfies readonly LabFinanceMetricCardWire[],
  totalRevenue: {
    title: "Total Revenue",
    barChartData: [
      { name: "January", uv: -13, pv: 21, amt: 2210 },
      { name: "February", uv: -16, pv: 10, amt: 2290 },
      { name: "March", uv: -14, pv: 13, amt: 2210 },
      { name: "April", uv: -10, pv: 12, amt: 2500 },
      { name: "May", uv: -17, pv: 20, amt: 2100 },
      { name: "June", uv: -13, pv: 12, amt: 2100 },
      { name: "July", uv: -12, pv: 15, amt: 2100 },
    ] as const satisfies readonly LabTotalRevenueBarPointWire[],
    growthPieData: [
      { date: "2023-11-30", revenue: 20, fill: "var(--primary)" },
      { date: "2023-12-12", revenue: 20, fill: "var(--primary)" },
      {
        date: "2023-12-12",
        revenue: 20,
        fill: "color-mix(in oklab, var(--primary) 60%, var(--background))",
      },
      {
        date: "2023-12-12",
        revenue: 20,
        fill: "color-mix(in oklab, var(--primary) 30%, var(--background))",
      },
    ] as const satisfies readonly LabTotalRevenueGrowthPointWire[],
    growthCenterValue: "78%",
    growthCenterLabel: "Growth",
    growthFootnote: "62% Company Growth",
    yearSummaries: [
      { year: "2024", amount: "$32.5K", iconKey: "circle-dollar" },
      { year: "2023", amount: "$41.2K", iconKey: "wallet" },
    ] as const satisfies readonly LabTotalRevenueYearSummaryWire[],
  },
} as const;

export type FinanceDashboardFixtures = typeof financeDashboardFixtures;
