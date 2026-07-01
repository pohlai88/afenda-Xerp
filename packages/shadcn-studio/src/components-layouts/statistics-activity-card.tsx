"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useId } from "react";
import { Area, AreaChart, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/utils/utils";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

export type ActivityChartPoint = {
  day: string;
  sales: number;
};

export type StatisticsActivityCardProps = {
  title: string;
  amount: string;
  changePercentage: number;
  periodLabel?: string;
  chartData: readonly ActivityChartPoint[];
  className?: string;
};

const salesGrowthChartConfig = {
  sales: {
    label: "Sales",
  },
} satisfies ChartConfig;

const StatisticsActivityCard = ({
  title,
  amount,
  changePercentage,
  periodLabel = "Weekly Report",
  chartData,
  className,
}: StatisticsActivityCardProps) => {
  const titleId = useId();
  const footnoteId = useId();
  const gradientId = useId();

  return (
    <article aria-labelledby={titleId} className={className}>
      <Card className={cn("gap-4")}>
        <div className="flex items-center justify-between gap-2 px-6">
          <span
            {...blockSlotDomMarkerProps("metric.label")}
            className="font-medium"
            id={titleId}
          >
            {title}
          </span>
          <span className="text-muted-foreground text-sm">{periodLabel}</span>
        </div>
        <CardContent className="flex justify-between gap-6 max-sm:flex-col">
          <div className="flex flex-col gap-2 self-end">
            <span
              {...blockSlotDomMarkerProps("metric.value")}
              aria-describedby={footnoteId}
              className="font-semibold text-5xl"
            >
              {amount}
            </span>
            <div className="flex items-center gap-1 text-primary">
              {changePercentage > 0 ? (
                <ArrowUpIcon aria-hidden="true" className="size-4" />
              ) : (
                <ArrowDownIcon aria-hidden="true" className="size-4" />
              )}
              <span
                {...blockSlotDomMarkerProps("metric.change")}
                className="text-xs"
                id={footnoteId}
              >
                +{changePercentage}%
              </span>
            </div>
          </div>
          <div className="grow sm:pl-6">
            <ChartContainer
              className="h-36 w-full uppercase"
              config={salesGrowthChartConfig}
            >
              <AreaChart
                data={[...chartData]}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="10%"
                      stopColor="var(--primary)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="90%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  axisLine={false}
                  dataKey="day"
                  tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) => value.slice(0, 2)}
                  tickLine={false}
                  tickMargin={5.5}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={false}
                />
                <Area
                  dataKey="sales"
                  fill={`url(#${gradientId})`}
                  stackId="a"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  type="natural"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default StatisticsActivityCard;
