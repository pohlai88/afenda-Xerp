"use client";

import { useState } from "react";

import { Area, AreaChart, Tooltip } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

import { cn } from "@/lib/utils";

export type TrendFormat = "number" | "compact" | "currency";

export type StatisticsTrendCardProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  title: string;
  data: T[];
  dateKey: keyof T;
  dataKey: keyof T;
  format?: TrendFormat;
  className?: string;
};

function fmt(v: number, format: TrendFormat = "number"): string {
  const abs = Math.abs(v);

  if (format === "currency") {
    if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1000) return `$${(v / 1000).toFixed(1)}K`;

    return `$${v.toLocaleString()}`;
  }

  if (format === "compact") {
    if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1000) return `${(v / 1000).toFixed(1)}K`;

    return v.toLocaleString();
  }

  return v.toLocaleString();
}

const StatisticsTrendCard = <T extends Record<string, unknown>>({
  title,
  data,
  dateKey,
  dataKey,
  format = "number",
  className,
}: StatisticsTrendCardProps<T>) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const idx = activeIndex ?? Math.max(0, data.length - 1);
  const point = data[idx];
  const firstRow = data[0];

  if (!(point && firstRow)) {
    return null;
  }

  const firstVal = firstRow[dataKey] as number;
  const currVal = point[dataKey] as number;
  const dateLabel = point[dateKey] as string;
  const changePct = ((currVal - firstVal) / firstVal) * 100;
  const changeAbs = currVal - firstVal;
  const isPositive = changePct >= 0;

  const gradientId = `fill-trend-${String(dataKey)}`;

  const chartConfig = {
    [dataKey as string]: { label: title },
  } satisfies ChartConfig;

  return (
    <Card className={className}>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-sm">{title}</span>
        <span className="font-bold text-3xl tracking-tight">
          {fmt(currVal, format)}
        </span>
        <div className="flex items-center justify-between pb-2">
          <span className="text-muted-foreground text-sm">On {dateLabel}</span>
          <span
            className={cn(
              "font-medium text-sm tabular-nums",
              isPositive ? "text-emerald-600" : "text-red-500"
            )}
          >
            {isPositive ? "+" : ""}
            {changePct.toFixed(1)}% ({isPositive ? "+" : "-"}
            {fmt(Math.abs(changeAbs), format)})
          </span>
        </div>

        <ChartContainer className="h-28 w-full" config={chartConfig}>
          <AreaChart
            data={data}
            margin={{ top: 4, left: 5, right: 5, bottom: 0 }}
            onMouseLeave={() => setActiveIndex(null)}
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex != null) {
                setActiveIndex(Number(state.activeTooltipIndex));
              }
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.25}
                />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={() => null}
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            />
            <Area
              dataKey={dataKey as string}
              dot={false}
              fill={`url(#${gradientId})`}
              stroke="var(--primary)"
              strokeWidth={2}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StatisticsTrendCard;
