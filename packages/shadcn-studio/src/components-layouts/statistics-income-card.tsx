"use client";

import { useId } from "react";
import { Area, AreaChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

export type IncomeChartPoint = {
  date: string;
  income: number;
};

export type StatisticsIncomeCardProps = {
  title: string;
  amount: string;
  changePercentage: string;
  comparisonLabel?: string;
  chartData: readonly IncomeChartPoint[];
  className?: string;
};

const incomeChartConfig = {
  income: {
    label: "Income",
  },
} satisfies ChartConfig;

const StatisticsIncomeCard = ({
  title,
  amount,
  changePercentage,
  comparisonLabel = "vs Last month",
  chartData,
  className,
}: StatisticsIncomeCardProps) => {
  const gradientId = useId();

  return (
    <Card className={className}>
      <CardContent className="flex flex-1 items-center justify-between gap-4 pr-0">
        <div className="flex shrink-0 flex-col justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span
              {...blockSlotDomMarkerProps("metric.label")}
              className="text-muted-foreground text-sm"
            >
              {title}
            </span>
            <span
              {...blockSlotDomMarkerProps("metric.value")}
              className="font-semibold text-3xl"
            >
              {amount}
            </span>
          </div>
          <div className="flex gap-3">
            <Badge
              {...blockSlotDomMarkerProps("metric.change")}
              className="rounded-sm bg-primary/10 text-primary"
            >
              {changePercentage}
            </Badge>
            <span className="text-muted-foreground text-sm">
              {comparisonLabel}
            </span>
          </div>
        </div>
        <ChartContainer
          className="max-h-26.5 w-full max-w-70 flex-1 max-sm:max-w-35"
          config={incomeChartConfig}
        >
          <AreaChart
            data={[...chartData]}
            margin={{
              left: 4,
              right: 0,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="10%" stopColor="var(--primary)" stopOpacity={1} />
                <stop offset="90%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Area
              dataKey="income"
              fill={`url(#${gradientId})`}
              stackId="a"
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

export default StatisticsIncomeCard;
