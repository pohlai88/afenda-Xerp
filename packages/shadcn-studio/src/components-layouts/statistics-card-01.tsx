import type { ReactNode } from "react";

import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import { Card, CardContent, CardHeader } from "@/components-ui/card";

import { cn } from "@/utils/utils";

// Statistics card data type
type StatisticsCardProps = {
  icon: ReactNode;
  value: string;
  title: string;
  changePercentage: string;
  className?: string;
};

const StatisticsCard = ({
  icon,
  value,
  title,
  changePercentage,
  className,
}: StatisticsCardProps) => (
  <Card className={cn("gap-4", className)}>
    <CardHeader className="flex items-center">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <span {...blockSlotDomMarkerProps("metric.value")} className="text-2xl">
        {value}
      </span>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <span {...blockSlotDomMarkerProps("metric.label")} className="font-semibold">
        {title}
      </span>
      <p {...blockSlotDomMarkerProps("metric.change")} className="space-x-2">
        <span className="text-sm">{changePercentage}</span>
        <span className="text-muted-foreground text-sm">than last week</span>
      </p>
    </CardContent>
  </Card>
);

export default StatisticsCard;
