"use client";

import dynamic from "next/dynamic";

function ChartSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading chart"
      className="afenda-chart-skeleton"
    />
  );
}

const lazyChartOptions = {
  loading: ChartSkeleton,
  ssr: false,
} as const;

type AreaChartComponent = typeof import("recharts")["AreaChart"];
type AreaComponent = typeof import("recharts")["Area"];
type BarChartComponent = typeof import("recharts")["BarChart"];
type BarComponent = typeof import("recharts")["Bar"];
type CartesianGridComponent = typeof import("recharts")["CartesianGrid"];
type CellComponent = typeof import("recharts")["Cell"];
type LineChartComponent = typeof import("recharts")["LineChart"];
type LineComponent = typeof import("recharts")["Line"];
type XAxisComponent = typeof import("recharts")["XAxis"];
type YAxisComponent = typeof import("recharts")["YAxis"];

export const LazyArea = dynamic(
  () => import("recharts").then((module) => ({ default: module.Area })),
  lazyChartOptions
) as AreaComponent;

export const LazyAreaChart = dynamic(
  () => import("recharts").then((module) => ({ default: module.AreaChart })),
  lazyChartOptions
) as AreaChartComponent;

export const LazyBar = dynamic(
  () => import("recharts").then((module) => ({ default: module.Bar })),
  lazyChartOptions
) as BarComponent;

export const LazyBarChart = dynamic(
  () => import("recharts").then((module) => ({ default: module.BarChart })),
  lazyChartOptions
) as BarChartComponent;

export const LazyCartesianGrid = dynamic(
  () =>
    import("recharts").then((module) => ({ default: module.CartesianGrid })),
  lazyChartOptions
) as CartesianGridComponent;

export const LazyCell = dynamic(
  () => import("recharts").then((module) => ({ default: module.Cell })),
  lazyChartOptions
) as CellComponent;

export const LazyLine = dynamic(
  () => import("recharts").then((module) => ({ default: module.Line })),
  lazyChartOptions
) as LineComponent;

export const LazyLineChart = dynamic(
  () => import("recharts").then((module) => ({ default: module.LineChart })),
  lazyChartOptions
) as LineChartComponent;

export const LazyXAxis = dynamic(
  () => import("recharts").then((module) => ({ default: module.XAxis })),
  lazyChartOptions
) as XAxisComponent;

export const LazyYAxis = dynamic(
  () => import("recharts").then((module) => ({ default: module.YAxis })),
  lazyChartOptions
) as YAxisComponent;
