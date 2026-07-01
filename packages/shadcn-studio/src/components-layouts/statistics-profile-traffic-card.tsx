"use client";

import { useId } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/utils/utils";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

// Profile traffic chart data
const profileTrafficChartData = [
  { index: "01", traffic: 150 },
  { index: "02", traffic: 250 },
  { index: "03", traffic: 190 },
  { index: "04", traffic: 290 },
  { index: "05", traffic: 220 },
  { index: "06", traffic: 350 },
  { index: "07", traffic: 250 },
];

const profileTrafficChartConfig = {
  traffic: {
    label: "Traffic",
  },
} satisfies ChartConfig;

const StatisticsCardData = {
  title: "Average profile traffic",
  amount: "2.84k",
  changePercentage: 15,
  children: (
    <>
      <ChartContainer
        className="h-28.75 w-full px-2.75"
        config={profileTrafficChartConfig}
      >
        <BarChart
          accessibilityLayer
          barSize={12}
          data={profileTrafficChartData}
          margin={{
            left: -8,
            right: -8,
          }}
        >
          <XAxis
            axisLine={false}
            dataKey="index"
            tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
            tickFormatter={(value) => value.slice(0, 3)}
            tickLine={false}
            tickMargin={10}
          />
          <ChartTooltip
            content={<ChartTooltipContent hideLabel />}
            cursor={false}
          />
          <Bar dataKey="traffic" fill="var(--primary)" radius={12} />
        </BarChart>
      </ChartContainer>
    </>
  ),
};

const StatisticsProfileTrafficCard = ({
  className,
}: {
  className?: string;
}) => {
  const titleId = useId();
  const footnoteId = useId();

  return (
    <article aria-labelledby={titleId} className={className}>
      <Card className={cn("gap-6")}>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span
              {...blockSlotDomMarkerProps("metric.label")}
              className="font-semibold"
              id={titleId}
            >
              {StatisticsCardData.title}
            </span>
            <span className="text-muted-foreground text-sm">Weekly Report</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span
                {...blockSlotDomMarkerProps("metric.value")}
                aria-describedby={footnoteId}
                className="font-semibold text-2xl"
              >
                {StatisticsCardData.amount}
              </span>
              <span
                {...blockSlotDomMarkerProps("metric.change")}
                className="text-primary text-sm"
                id={footnoteId}
              >
                +{StatisticsCardData.changePercentage}%
              </span>
            </div>
          </div>
          {StatisticsCardData.children}
        </CardContent>
      </Card>
    </article>
  );
};

export default StatisticsProfileTrafficCard;
