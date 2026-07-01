import { PackageIcon, ShoppingCartIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

export type StatisticsSalesOverviewSide = {
  label: string;
  percentage: string;
  count: string;
};

export type StatisticsSalesOverviewCardProps = {
  title: string;
  totalValue: string;
  changePercentage: string;
  orderSide: StatisticsSalesOverviewSide;
  deliveredSide: StatisticsSalesOverviewSide;
  progressValue: number;
  className?: string;
};

const StatisticsSalesOverviewCard = ({
  title,
  totalValue,
  changePercentage,
  orderSide,
  deliveredSide,
  progressValue,
  className,
}: StatisticsSalesOverviewCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between gap-2">
        <span
          {...blockSlotDomMarkerProps("metric.label")}
          className="text-muted-foreground"
        >
          {title}
        </span>
        <span {...blockSlotDomMarkerProps("metric.change")} className="text-sm">
          {changePercentage}
        </span>
      </div>
      <span
        {...blockSlotDomMarkerProps("metric.value")}
        className="font-semibold text-2xl"
      >
        {totalValue}
      </span>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex justify-between gap-1">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <ShoppingCartIcon className="size-4 text-primary" />
            </div>
            <span>{orderSide.label}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-xl">{orderSide.percentage}</span>
            <span className="text-muted-foreground text-sm">
              {orderSide.count}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Separator className="max-h-9.25" orientation="vertical" />
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <span className="text-muted-foreground text-sm">VS</span>
          </div>
          <Separator className="max-h-9.25" orientation="vertical" />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center justify-end gap-2">
            <span>{deliveredSide.label}</span>
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <PackageIcon className="size-4 text-primary" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-medium text-xl">
              {deliveredSide.percentage}
            </span>
            <span className="text-muted-foreground text-sm">
              {deliveredSide.count}
            </span>
          </div>
        </div>
      </div>
      <Progress value={progressValue} />
    </CardContent>
  </Card>
);

export default StatisticsSalesOverviewCard;
