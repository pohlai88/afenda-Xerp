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

export type ProfileTrafficChartPoint = {
  index: string;
  traffic: number;
};

export type StatisticsProfileTrafficCardProps = {
  title: string;
  amount: string;
  changePercentage: number;
  periodLabel?: string;
  chartData: readonly ProfileTrafficChartPoint[];
  className?: string;
};

const profileTrafficChartConfig = {
  traffic: {
    label: "Traffic",
  },
} satisfies ChartConfig;

const StatisticsProfileTrafficCard = ({
  title,
  amount,
  changePercentage,
  periodLabel = "Weekly Report",
  chartData,
  className,
}: StatisticsProfileTrafficCardProps) => {
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
              {title}
            </span>
            <span className="text-muted-foreground text-sm">{periodLabel}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span
                {...blockSlotDomMarkerProps("metric.value")}
                aria-describedby={footnoteId}
                className="font-semibold text-2xl"
              >
                {amount}
              </span>
              <span
                {...blockSlotDomMarkerProps("metric.change")}
                className="text-primary text-sm"
                id={footnoteId}
              >
                +{changePercentage}%
              </span>
            </div>
          </div>
          <ChartContainer
            className="h-28.75 w-full px-2.75"
            config={profileTrafficChartConfig}
          >
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
        </CardContent>
      </Card>
    </article>
  );
};

export default StatisticsProfileTrafficCard;
