"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";

import { blockSlotDomMarkerProps } from "@/contracts/block-slot-dom-marker.contract.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

const days = [5, 10, 20, 30];

// Statistics card data type
export type StatisticsCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  changePercentage: number;
  className?: string;
  iconClassName?: string;
};

const StatisticsCard = ({
  icon,
  title,
  value,
  changePercentage,
  className,
  iconClassName,
}: StatisticsCardProps) => {
  const [selectedDays, setSelectedDays] = useState(days.at(-1) ?? 30);

  return (
    <Card
      className={cn(
        "justify-between gap-3 bg-radial-[at_150%_90%] from-primary/20 to-60% to-card",
        className
      )}
    >
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarFallback
              className={cn(
                "size-7 shrink-0 bg-primary/10 text-primary [&>svg]:size-3.5",
                iconClassName
              )}
            >
              {icon}
            </AvatarFallback>
          </Avatar>
          <span {...blockSlotDomMarkerProps("metric.label")} className="text-sm">
            {title}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-sm px-2 py-1.5">
            <span className="max-w-[17ch] truncate text-sm leading-none">
              {selectedDays} Days
            </span>
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {days.map((day) => (
              <DropdownMenuItem key={day} onClick={() => setSelectedDays(day)}>
                <span className="text-sm">{day} Days</span>
                {selectedDays === day && <CheckIcon className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <span {...blockSlotDomMarkerProps("metric.value")} className="font-semibold text-2xl">
          {value}
        </span>
        <Badge {...blockSlotDomMarkerProps("metric.change")} className="bg-primary/10 text-primary">
          {changePercentage > 0 ? (
            <TrendingUpIcon className="size-3" />
          ) : (
            <TrendingDownIcon className="size-3" />
          )}
          {changePercentage}%
        </Badge>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
