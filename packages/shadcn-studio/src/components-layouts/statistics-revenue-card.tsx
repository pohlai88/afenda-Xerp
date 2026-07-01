"use client";

import { useId } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

export type RevenueChartPoint = {
  day: string;
  revenue: number;
  fill?: string;
};

export type StatisticsRevenueCardProps = {
  title: string;
  amount: string;
  changePercentage: number;
  periodLabel?: string;
  chartData: readonly RevenueChartPoint[];
  className?: string;
};

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
  },
} satisfies ChartConfig;

const StatisticsRevenueCard = ({
  title,
  amount,
  changePercentage,
  periodLabel = "Weekly Report",
  chartData,
  className,
}: StatisticsRevenueCardProps) => {
  const titleId = useId();
  const footnoteId = useId();

  return (
    <article aria-labelledby={titleId} className={className}>
      <Card>
        <CardContent className="flex justify-between gap-6 max-sm:flex-col sm:items-center">
          <div className="flex shrink-0 grow flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span
                {...blockSlotDomMarkerProps("metric.label")}
                className="font-semibold"
                id={titleId}
              >
                {title}
              </span>
              <span className="text-muted-foreground text-sm">
                {periodLabel}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span
                {...blockSlotDomMarkerProps("metric.value")}
                aria-describedby={footnoteId}
                className="font-semibold text-2xl"
              >
                {amount}
              </span>
              <Badge
                {...blockSlotDomMarkerProps("metric.change")}
                className="rounded-sm bg-primary/10 text-primary"
                id={footnoteId}
              >
                +{changePercentage}%
              </Badge>
            </div>
          </div>
          <div className="h-37.5 sm:pl-6">
            <ChartContainer className="size-full" config={revenueChartConfig}>
              <BarChart
                accessibilityLayer
                barSize={12}
                data={[...chartData]}
                margin={{
                  left: -8,
                  right: -8,
                }}
              >
                <XAxis
                  axisLine={false}
                  dataKey="day"
                  tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) => value.slice(0, 1)}
                  tickLine={false}
                  tickMargin={5.5}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={false}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={12} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default StatisticsRevenueCard;
