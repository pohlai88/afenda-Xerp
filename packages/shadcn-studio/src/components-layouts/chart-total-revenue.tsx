"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/utils";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

export type TotalRevenueBarPoint = {
  name: string;
  uv: number;
  pv: number;
  amt: number;
};

export type TotalRevenueGrowthPoint = {
  date: string;
  revenue: number;
  fill: string;
};

export type TotalRevenueYearSummary = {
  icon: ReactNode;
  year: string;
  amount: string;
};

export type ChartTotalRevenueProps = {
  title: string;
  menuItems?: readonly string[];
  barChartData: readonly TotalRevenueBarPoint[];
  growthPieData: readonly TotalRevenueGrowthPoint[];
  growthCenterValue: string;
  growthCenterLabel: string;
  growthFootnote: string;
  yearSummaries: readonly TotalRevenueYearSummary[];
  className?: string;
};

const totalEarningChartConfig = {
  uv: {
    label: "2023",
    color: "color-mix(in oklab, var(--primary) 20%, var(--background))",
  },
  pv: {
    label: "2024",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const growthChartConfig = {
  revenue: {
    label: "Revenue",
  },
} satisfies ChartConfig;

const TotalRevenueCard = ({
  title,
  menuItems = ["Share", "Update", "Refresh"],
  barChartData,
  growthPieData,
  growthCenterValue,
  growthCenterLabel,
  growthFootnote,
  yearSummaries,
  className,
}: ChartTotalRevenueProps) => (
  <Card className={cn("grid lg:grid-cols-5", className)}>
    <div className="flex flex-col gap-4 max-lg:border-b max-lg:pb-6 lg:col-span-3 lg:border-r">
      <CardHeader className="flex justify-between">
        <span
          {...blockSlotDomMarkerProps("chart.title")}
          className="font-semibold text-lg"
        >
          {title}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                {...blockSlotDomMarkerProps("chart.legend")}
                className="size-6 rounded-full text-muted-foreground"
                size="icon"
                variant="ghost"
              />
            }
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {menuItems.map((item) => (
                <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 max-[475px]:mx-auto lg:pr-10">
        <ChartContainer
          {...blockSlotDomMarkerProps("chart.series")}
          className="h-full min-h-55 w-full max-[475px]:max-w-73 lg:min-h-75"
          config={totalEarningChartConfig}
        >
          <BarChart
            barSize={12}
            data={[...barChartData]}
            margin={{
              left: -25,
            }}
            stackOffset="sign"
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="6"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="name"
              tick={{ fontSize: "14", fill: "var(--muted-foreground)" }}
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              domain={[-20, 30]}
              tick={{ fill: "var(--muted-foreground)" }}
              tickFormatter={(value) => value}
              tickLine={false}
              tickMargin={8}
              ticks={[-20, -10, 0, 10, 20, 30]}
            />
            <ChartLegend
              className="justify-start px-6 pb-6 text-muted-foreground [&_div>div]:rounded-full"
              content={<ChartLegendContent />}
              verticalAlign="top"
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Bar
              dataKey="pv"
              fill="var(--color-pv)"
              radius={[12, 12, 0, 0]}
              stackId="stack"
            />
            <Bar
              dataKey="uv"
              fill="var(--color-uv)"
              radius={[12, 12, 0, 0]}
              stackId="stack"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
    <div className="flex flex-col justify-between gap-8 lg:col-span-2">
      <CardHeader className="flex justify-center">
        <Select>
          <SelectTrigger className="w-35 [&>svg]:opacity-100" size="sm">
            <SelectValue placeholder="Report" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Revenue</SelectItem>
              <SelectItem value="banana">Expenses</SelectItem>
              <SelectItem value="blueberry">Profit</SelectItem>
              <SelectItem value="grapes">Loss</SelectItem>
              <SelectItem value="pineapple">Net Income</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-8 lg:pl-0">
        <div className="space-y-8 pt-6 text-center">
          <ChartContainer
            className="h-40 w-full sm:h-45"
            config={growthChartConfig}
          >
            <PieChart margin={{ top: 0, bottom: -20 }}>
              <Pie
                data={[...growthPieData]}
                dataKey="revenue"
                endAngle={220}
                innerRadius={60}
                nameKey="date"
                outerRadius={85}
                paddingAngle={5}
                startAngle={0}
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
                            className="fill-card-foreground font-semibold text-2xl"
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 3}
                          >
                            {growthCenterValue}
                          </tspan>
                          <tspan
                            className="fill-muted-foreground text-sm"
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                          >
                            {growthCenterLabel}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <span className="text-muted-foreground text-sm">
            {growthFootnote}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 md:max-lg:gap-0">
          {yearSummaries.map((item) => (
            <div className="flex items-center gap-2 p-2" key={item.year}>
              <Avatar className="size-10 rounded-sm">
                <AvatarFallback className="shrink-0 rounded-sm bg-primary/10 text-primary">
                  {item.icon}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-sm">
                  {item.year}
                </span>
                <span className="font-medium">{item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  </Card>
);

export default TotalRevenueCard;
