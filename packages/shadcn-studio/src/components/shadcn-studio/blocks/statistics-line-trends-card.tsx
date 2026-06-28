"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { cn } from "@/lib/utils";

// Types

type TrendSeries = {
  key: string;
  label: string;
  value: number;
  color: string;
};

export type MetricTrendCardProps = {
  title: string;
  series: [TrendSeries, TrendSeries];
  data: Record<string, string | number>[];
  className?: string;
};

// Component

const MetricTrendCard = ({
  title,
  series,
  data,
  className,
}: MetricTrendCardProps) => {
  const chartConfig: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }])
  );

  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader className="grid-rows-none">
        <CardTitle className="font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 max-sm:flex-col sm:items-center">
          <div className="flex gap-4 max-sm:justify-between sm:flex-col">
            {series.map((data, index) => (
              <div className="flex items-center gap-2" key={index}>
                <div
                  className="h-9 w-1 rounded-sm"
                  style={{ backgroundColor: data.color }}
                />
                <div>
                  <p className="text-muted-foreground text-xs">{data.label}</p>
                  <p className="font-semibold text-2xl">
                    {data.value.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ChartContainer className="h-28 min-w-0 flex-1" config={chartConfig}>
            <LineChart
              data={data}
              margin={{ top: 4, left: 0, right: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="time"
                interval="preserveStartEnd"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickLine={false}
                tickMargin={6}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
              />
              {series.map((s) => (
                <Line
                  activeDot={{ r: 3 }}
                  dataKey={s.key}
                  dot={false}
                  key={s.key}
                  stroke={`var(--color-${s.key})`}
                  strokeWidth={2}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricTrendCard;
