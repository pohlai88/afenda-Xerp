"use client";

import { ChartNoAxesCombinedIcon, CirclePercentIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Bar, BarChart, Label, Pie, PieChart } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

export type SalesMetricsMetric = {
  icon: ReactNode;
  title: string;
  value: string;
};

export type SalesMetricsPiePoint = {
  month: string;
  sales: number;
  fill: string;
};

export type SalesMetricsBarPoint = {
  date: string;
  sales: number;
};

export type ChartSalesMetricsProps = {
  title: string;
  company: {
    logoUrl: string;
    name: string;
    email: string;
  };
  metrics: readonly SalesMetricsMetric[];
  revenueGoalTitle: string;
  revenuePieData: readonly SalesMetricsPiePoint[];
  revenueCenterValue: string;
  revenueCenterLabel: string;
  planCompletedLabel: string;
  planCompletedPercent: string;
  salesPlanTitle: string;
  salesPlanPercentage: number;
  salesPlanDescription: string;
  salesBarChartData: readonly SalesMetricsBarPoint[];
  className?: string;
};

const salesChartConfig = {
  sales: {
    label: "Sales",
  },
} satisfies ChartConfig;

const revenueChartConfig = {
  sales: {
    label: "Sales",
  },
  january: {
    label: "January",
    color: "var(--primary)",
  },
  february: {
    label: "February",
    color: "color-mix(in oklab, var(--primary) 60%, transparent)",
  },
  march: {
    label: "March",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
} satisfies ChartConfig;

const SalesMetricsCard = ({
  title,
  company,
  metrics,
  revenueGoalTitle,
  revenuePieData,
  revenueCenterValue,
  revenueCenterLabel,
  planCompletedLabel,
  planCompletedPercent,
  salesPlanTitle,
  salesPlanPercentage,
  salesPlanDescription,
  salesBarChartData,
  className,
}: ChartSalesMetricsProps) => (
  <Card className={className}>
    <CardContent className="space-y-4">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-7 lg:col-span-3">
          <span
            {...blockSlotDomMarkerProps("chart.title")}
            className="font-semibold text-lg"
          >
            {title}
          </span>
          <div
            {...blockSlotDomMarkerProps("chart.legend")}
            className="flex items-center gap-3"
          >
            <img
              alt=""
              className="size-10.5 rounded-lg"
              src={company.logoUrl}
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xl">{company.name}</span>
              <span className="text-muted-foreground text-sm">
                {company.email}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                className="flex items-center gap-3 rounded-md border px-4 py-2"
                key={metric.title}
              >
                <Avatar className="size-8.5 rounded-sm">
                  <AvatarFallback className="shrink-0 rounded-sm bg-primary/10 text-primary">
                    {metric.icon}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-muted-foreground text-sm">
                    {metric.title}
                  </span>
                  <span className="font-medium text-lg">{metric.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card className="gap-4 py-4 shadow-none lg:col-span-2">
          <CardHeader className="gap-1">
            <CardTitle className="font-semibold text-lg">
              {revenueGoalTitle}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <ChartContainer
              className="h-38.5 w-full"
              config={revenueChartConfig}
            >
              <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={false}
                />
                <Pie
                  data={[...revenuePieData]}
                  dataKey="sales"
                  endAngle={660}
                  innerRadius={58}
                  nameKey="month"
                  outerRadius={75}
                  paddingAngle={2}
                  startAngle={300}
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
                              className="fill-card-foreground font-medium text-lg"
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 12}
                            >
                              {revenueCenterValue}
                            </tspan>
                            <tspan
                              className="fill-muted-foreground text-sm"
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 19}
                            >
                              {revenueCenterLabel}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex items-center justify-between">
              <span className="text-xl">{planCompletedLabel}</span>
              <span className="font-medium text-2xl">
                {planCompletedPercent}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-none">
        <CardContent className="grid gap-4 px-4 lg:grid-cols-5">
          <div className="flex flex-col justify-center gap-6">
            <span className="font-semibold text-lg">{salesPlanTitle}</span>
            <span className="max-lg:5xl text-6xl">{salesPlanPercentage}%</span>
            <span className="text-muted-foreground text-sm">
              {salesPlanDescription}
            </span>
          </div>
          <div className="flex flex-col gap-6 text-lg md:col-span-4">
            <span className="font-medium">Cohort analysis indicators</span>
            <span className="text-wrap text-muted-foreground">
              Analyzes the behaviour of a group of users who joined a
              product/service at the same time. over a certain period.
            </span>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <ChartNoAxesCombinedIcon className="size-6" />
                <span className="font-medium text-lg">Open Statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <CirclePercentIcon className="size-6" />
                <span className="font-medium text-lg">Percentage Change</span>
              </div>
            </div>

            <ChartContainer
              {...blockSlotDomMarkerProps("chart.series")}
              className="h-7.75 w-full"
              config={salesChartConfig}
            >
              <BarChart
                accessibilityLayer
                data={[...salesBarChartData]}
                margin={{
                  left: 0,
                  right: 0,
                }}
                maxBarSize={16}
              >
                <Bar
                  background={{
                    fill: "color-mix(in oklab, var(--primary) 10%, transparent)",
                    radius: 12,
                  }}
                  dataKey="sales"
                  fill="var(--primary)"
                  radius={12}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </CardContent>
  </Card>
);

export default SalesMetricsCard;
