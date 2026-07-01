"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Bar, BarChart, XAxis } from "recharts";

import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import { Avatar, AvatarFallback } from "@/components-ui/avatar";
import { Button } from "@/components-ui/button";
import { Card, CardContent, CardHeader } from "@/components-ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components-ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components-ui/dropdown-menu";

import { cn } from "@/utils/utils";

const listItems = ["Share", "Update", "Refresh"];

type Props = {
  title: string;
  subTitle: string;
  statData: {
    icon: ReactNode;
    title: string;
    department: string;
    value: string;
    trend: string;
    percentage: number;
    iconClassName?: string;
  }[];
  chartData: {
    day: string;
    earning: number;
    fill: string;
  }[];
  className?: string;
};

const earningReportChartConfig = {
  earning: {
    label: "Earning",
  },
} satisfies ChartConfig;

const EarningReportCard = ({
  title,
  subTitle,
  statData,
  chartData,
  className,
}: Props) => (
  <Card className={className}>
    <CardHeader className="flex justify-between">
      <div className="flex flex-col gap-1">
        <span {...blockSlotDomMarkerProps("chart.title")} className="font-semibold text-lg">
          {title}
        </span>
        <span className="text-muted-foreground text-sm">{subTitle}</span>
      </div>
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
            {listItems.map((item, index) => (
              <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col justify-between gap-6">
      {statData.map((earning, index) => (
        <div className="flex items-center justify-between gap-2" key={index}>
          <div className="flex items-center justify-between gap-2">
            <Avatar className="size-10 rounded-sm">
              <AvatarFallback
                className={cn(
                  "shrink-0 rounded-sm bg-primary/10 text-primary *:size-5",
                  earning.iconClassName
                )}
              >
                {earning.icon}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{earning.title}</span>
              <span className="text-muted-foreground text-sm">
                {earning.department}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">{earning.value}</span>
            <div className="flex items-center gap-1">
              {earning.trend === "up" ? (
                <ChevronUpIcon className="size-4" />
              ) : (
                <ChevronDownIcon className="size-4" />
              )}
              <span className="text-sm">{earning.percentage}%</span>
            </div>
          </div>
        </div>
      ))}
      <ChartContainer
        {...blockSlotDomMarkerProps("chart.series")}
        className="h-45 w-full text-sm uppercase"
        config={earningReportChartConfig}
      >
        <BarChart
          accessibilityLayer
          barSize={36}
          data={chartData}
          margin={{
            top: 7,
            left: -4,
            right: -4,
          }}
        >
          <XAxis
            axisLine={false}
            dataKey="day"
            tick={{ fill: "var(--muted-foreground)" }}
            tickFormatter={(value) => value.slice(0, 2)}
            tickLine={false}
            tickMargin={5.5}
          />
          <ChartTooltip
            content={<ChartTooltipContent className="normal-case" hideLabel />}
          />
          <Bar dataKey="earning" radius={8} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

export default EarningReportCard;
