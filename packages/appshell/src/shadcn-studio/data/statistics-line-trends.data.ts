import type { StatisticsLineTrendsCardProps } from "../blocks/statistics-line-trends-card";

const ordersTrendData = [
  { time: "Mon", ThisWeek: 320, LastWeek: 260 },
  { time: "Tue", ThisWeek: 410, LastWeek: 300 },
  { time: "Wed", ThisWeek: 390, LastWeek: 340 },
  { time: "Thu", ThisWeek: 480, LastWeek: 370 },
  { time: "Fri", ThisWeek: 560, LastWeek: 420 },
  { time: "Sat", ThisWeek: 610, LastWeek: 490 },
  { time: "Sun", ThisWeek: 574, LastWeek: 455 },
] as const satisfies StatisticsLineTrendsCardProps["data"];

const revenueTrendData = [
  { time: "Mon", ThisWeek: 14_200, LastWeek: 11_800 },
  { time: "Tue", ThisWeek: 18_600, LastWeek: 13_500 },
  { time: "Wed", ThisWeek: 17_300, LastWeek: 15_200 },
  { time: "Thu", ThisWeek: 21_400, LastWeek: 16_800 },
  { time: "Fri", ThisWeek: 24_900, LastWeek: 19_300 },
  { time: "Sat", ThisWeek: 27_100, LastWeek: 21_600 },
  { time: "Sun", ThisWeek: 25_840, LastWeek: 20_470 },
] as const satisfies StatisticsLineTrendsCardProps["data"];

const inventoryTrendData = [
  { time: "Mon", Inbound: 890, Outbound: 740 },
  { time: "Tue", Inbound: 1020, Outbound: 860 },
  { time: "Wed", Inbound: 960, Outbound: 920 },
  { time: "Thu", Inbound: 1140, Outbound: 980 },
  { time: "Fri", Inbound: 1280, Outbound: 1150 },
  { time: "Sat", Inbound: 1350, Outbound: 1240 },
  { time: "Sun", Inbound: 1310, Outbound: 1190 },
] as const satisfies StatisticsLineTrendsCardProps["data"];

export const defaultStatisticsLineTrendsCards = [
  {
    title: "Orders",
    series: [
      { key: "ThisWeek", label: "This week", value: 574, color: "var(--chart-1)" },
      { key: "LastWeek", label: "Last week", value: 455, color: "var(--chart-2)" },
    ],
    data: ordersTrendData,
  },
  {
    title: "Gross revenue",
    series: [
      { key: "ThisWeek", label: "This week", value: 25_840, color: "var(--chart-3)" },
      { key: "LastWeek", label: "Last week", value: 20_470, color: "var(--chart-4)" },
    ],
    data: revenueTrendData,
  },
  {
    title: "Inventory movement",
    series: [
      { key: "Inbound", label: "Inbound", value: 1310, color: "var(--chart-2)" },
      { key: "Outbound", label: "Outbound", value: 1190, color: "var(--chart-5)" },
    ],
    data: inventoryTrendData,
  },
] as const satisfies readonly StatisticsLineTrendsCardProps[];

export const DEFAULT_STATISTICS_LINE_TRENDS_LABEL = "Operations trend metrics";

/** Shared chart margins for line trend cards. */
export const STATISTICS_LINE_TRENDS_CHART_MARGIN = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 4,
} as const;
