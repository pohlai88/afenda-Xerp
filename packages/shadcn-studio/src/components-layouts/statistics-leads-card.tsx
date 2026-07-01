"use client";

import { useId } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

// Lead chart data
const leadChartData = [
  { month: "january", sales: 340, fill: "var(--color-january)" },
  { month: "february", sales: 200, fill: "var(--color-february)" },
  { month: "march", sales: 200, fill: "var(--color-march)" },
];

const leadChartConfig = {
  sales: {
    label: "Sales",
  },
  january: {
    label: "January",
    color: "color-mix(in oklab, var(--primary) 60%, transparent)",
  },
  february: {
    label: "February",
    color: "var(--primary)",
  },
  march: {
    label: "March",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
} satisfies ChartConfig;

const StatisticsCardData = {
  title: "Generated leads",
  amount: "4,350",
  changePercentage: 18.2,
  children: (
    <>
      <ChartContainer className="h-37.5 w-full px-4.5" config={leadChartConfig}>
        <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <ChartTooltip
            content={<ChartTooltipContent hideLabel />}
            cursor={false}
          />
          <Pie
            data={leadChartData}
            dataKey="sales"
            innerRadius={55}
            nameKey="month"
            outerRadius={75}
            paddingAngle={3}
            strokeWidth={20}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      dominantBaseline="middle"
                      textAnchor="middle"
                      x={viewBox.cx}
                      y={viewBox.cy}
                    >
                      <tspan
                        className="fill-foreground font-medium text-xl"
                        x={viewBox.cx}
                        y={viewBox.cy}
                      >
                        $23K
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </>
  ),
};

const StatisticsLeadCard = ({ className }: { className?: string }) => {
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
              <span
                {...blockSlotDomMarkerProps("metric.change")}
                className="text-primary text-sm"
                id={footnoteId}
              >
                +{StatisticsCardData.changePercentage}%
              </span>
            </div>
          </div>
          <div className="h-37.5 sm:pl-6">{StatisticsCardData.children}</div>
        </CardContent>
      </Card>
    </article>
  );
};

export default StatisticsLeadCard;
