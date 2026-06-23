export const DEFAULT_STATISTICS_METRIC_REPORT_CAPTION = "Weekly report";

export const DEFAULT_STATISTICS_COMPONENT_10_LABEL =
  "Operations statistics overview";

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
  { month: "january", sales: 340 },
  { month: "february", sales: 200 },
  { month: "march", sales: 200 },
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
  { day: "Monday", revenue: 150 },
  { day: "Tuesday", revenue: 250 },
  { day: "Wednesday", revenue: 190 },
  { day: "Thursday", revenue: 290 },
  { day: "Friday", revenue: 220 },
  { day: "Saturday", revenue: 350 },
  { day: "Sunday", revenue: 250 },
] as const;

/** Highlight day receives full primary fill; other bars use muted primary mix. */
export const STATISTICS_REVENUE_HIGHLIGHT_DAY = "Thursday" as const;

export const STATISTICS_ACTIVITY_CHART_ARIA_LABEL = "Activity sales area trend";
export const STATISTICS_LEADS_CHART_ARIA_LABEL =
  "Generated leads horizontal bar chart";
export const STATISTICS_PROFILE_TRAFFIC_CHART_ARIA_LABEL =
  "Average profile traffic bar chart";
export const STATISTICS_REVENUE_CHART_ARIA_LABEL = "Revenue growth bar chart";

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

const MONTH_ABBREVIATIONS: Record<string, string> = {
  april: "Apr",
  august: "Aug",
  december: "Dec",
  february: "Feb",
  january: "Jan",
  july: "Jul",
  june: "Jun",
  march: "Mar",
  may: "May",
  november: "Nov",
  october: "Oct",
  september: "Sep",
};

export function formatStatisticsMonthTick(value: string): string {
  return MONTH_ABBREVIATIONS[value.toLowerCase()] ?? value.slice(0, 3);
}

/** Shared chart margins — avoid negative values that clip bars outside the card. */
export const STATISTICS_METRIC_CHART_MARGIN = {
  bottom: 0,
  left: 8,
  right: 8,
  top: 8,
} as const;
