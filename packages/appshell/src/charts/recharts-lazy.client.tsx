"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function ChartSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading chart"
      className="afenda-chart-skeleton"
    />
  );
}

type RechartsModule = typeof import("recharts");

type AreaChartComponent = RechartsModule["AreaChart"];
type AreaComponent = RechartsModule["Area"];
type BarChartComponent = RechartsModule["BarChart"];
type BarComponent = RechartsModule["Bar"];
type CartesianGridComponent = RechartsModule["CartesianGrid"];
type CellComponent = RechartsModule["Cell"];
type LineChartComponent = RechartsModule["LineChart"];
type LineComponent = RechartsModule["Line"];
type XAxisComponent = RechartsModule["XAxis"];
type YAxisComponent = RechartsModule["YAxis"];

function lazyRechartsComponent<T>(selector: (module: RechartsModule) => T): T {
  const loader = () =>
    import("recharts").then((module) => ({
      default: selector(module) as ComponentType,
    }));

  return dynamic(loader, {
    loading: ChartSkeleton,
    ssr: false,
  }) as unknown as T;
}

export const LazyArea = lazyRechartsComponent<AreaComponent>(
  (module) => module.Area
);

export const LazyAreaChart = lazyRechartsComponent<AreaChartComponent>(
  (module) => module.AreaChart
);

export const LazyBar = lazyRechartsComponent<BarComponent>(
  (module) => module.Bar
);

export const LazyBarChart = lazyRechartsComponent<BarChartComponent>(
  (module) => module.BarChart
);

export const LazyCartesianGrid = lazyRechartsComponent<CartesianGridComponent>(
  (module) => module.CartesianGrid
);

export const LazyCell = lazyRechartsComponent<CellComponent>(
  (module) => module.Cell
);

export const LazyLine = lazyRechartsComponent<LineComponent>(
  (module) => module.Line
);

export const LazyLineChart = lazyRechartsComponent<LineChartComponent>(
  (module) => module.LineChart
);

export const LazyXAxis = lazyRechartsComponent<XAxisComponent>(
  (module) => module.XAxis
);

export const LazyYAxis = lazyRechartsComponent<YAxisComponent>(
  (module) => module.YAxis
);
