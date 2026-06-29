"use client";

import { useId } from "react";
import { Bar, BarChart, XAxis } from "recharts";

import { blockSlotDomMarkerProps } from "@/contracts/block-slot-dom-marker.contract.js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Revenue chart data
const revenueChartData = [
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
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
  },
} satisfies ChartConfig;

const StatisticsCardData = {
  title: "Revenue growth",
  amount: "$3,234",
  changePercentage: 15,
  children: (
    <>
      <ChartContainer className="size-full" config={revenueChartConfig}>
        <BarChart
          accessibilityLayer
          barSize={12}
          data={revenueChartData}
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
    </>
  ),
};

const StatisticsRevenueCard = ({ className }: { className?: string }) => {
  const titleId = useId();
  const footnoteId = useId();

  return (
    <article
      aria-labelledby={titleId}
      className={className}
    >
      <Card>
        <CardContent className="flex justify-between gap-6 max-sm:flex-col sm:items-center">
          <div className="flex shrink-0 grow flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span {...blockSlotDomMarkerProps("metric.label")} className="font-semibold" id={titleId}>
                {StatisticsCardData.title}
              </span>
              <span className="text-muted-foreground text-sm">
                Weekly Report
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span
                {...blockSlotDomMarkerProps("metric.value")}
                aria-describedby={footnoteId}
                className="font-semibold text-2xl"
              >
                {StatisticsCardData.amount}
              </span>
              <Badge
                {...blockSlotDomMarkerProps("metric.change")}
                className="rounded-sm bg-primary/10 text-primary"
                id={footnoteId}
              >
                +{StatisticsCardData.changePercentage}%
              </Badge>
            </div>
          </div>
          <div className="h-37.5 sm:pl-6">{StatisticsCardData.children}</div>
        </CardContent>
      </Card>
    </article>
  );
};

export default StatisticsRevenueCard;
