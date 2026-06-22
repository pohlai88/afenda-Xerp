export const DEFAULT_STATISTICS_METRIC_REPORT_CAPTION = "Weekly report";

export const DEFAULT_STATISTICS_COMPONENT_10_LABEL = "Operations statistics overview";

export const statisticsActivitySalesData = [
  { day: "Monday", sales: 260 },
  { day: "Tuesday", sales: 380 },
  { day: "Wednesday", sales: 250 },
  { day: "Thursday", sales: 580 },
  { day: "Friday", sales: 370 },
  { day: "Saturday", sales: 420 },
  { day: "Sunday", sales: 300 },
] as const;

export const statisticsLeadChartData = [
  { month: "january", sales: 340, fill: "var(--color-january)" },
  { month: "february", sales: 200, fill: "var(--color-february)" },
  { month: "march", sales: 200, fill: "var(--color-march)" },
] as const;

export const statisticsProfileTrafficData = [
  { index: "01", traffic: 150 },
  { index: "02", traffic: 250 },
  { index: "03", traffic: 190 },
  { index: "04", traffic: 290 },
  { index: "05", traffic: 220 },
  { index: "06", traffic: 350 },
  { index: "07", traffic: 250 },
] as const;

export const statisticsRevenueBarData = [
  {
    day: "Monday",
    revenue: 150,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Tuesday",
    revenue: 250,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Wednesday",
    revenue: 190,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  { day: "Thursday", revenue: 290 },
  {
    day: "Friday",
    revenue: 220,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Saturday",
    revenue: 350,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Sunday",
    revenue: 250,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
] as const;

export const STATISTICS_LEAD_CENTER_LABEL = "$23K";

const WEEKDAY_ABBREVIATIONS: Record<string, string> = {
  Friday: "Fr",
  Monday: "Mo",
  Saturday: "Sa",
  Sunday: "Su",
  Thursday: "Th",
  Tuesday: "Tu",
  Wednesday: "We",
};

export function formatStatisticsWeekdayTick(value: string): string {
  return WEEKDAY_ABBREVIATIONS[value] ?? value.slice(0, 2);
}

/** Shared chart margins — avoid negative values that clip bars outside the card. */
export const STATISTICS_METRIC_CHART_MARGIN = {
  bottom: 0,
  left: 8,
  right: 8,
  top: 8,
} as const;
