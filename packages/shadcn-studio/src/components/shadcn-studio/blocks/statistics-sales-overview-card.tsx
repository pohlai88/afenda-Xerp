import { PackageIcon, ShoppingCartIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const StatisticsSalesOverviewCard = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-muted-foreground">Sales Overview</span>
        <span className="text-sm">+18.2%</span>
      </div>
      <span className="font-semibold text-2xl">$38.5k</span>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex justify-between gap-1">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <ShoppingCartIcon className="size-4 text-primary" />
            </div>
            <span>Order</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-xl">62.2%</span>
            <span className="text-muted-foreground text-sm">6,440</span>
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
            <span>Delivered</span>
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <PackageIcon className="size-4 text-primary" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-medium text-xl">25.5%</span>
            <span className="text-muted-foreground text-sm">12,740</span>
          </div>
        </div>
      </div>
      <Progress value={60} />
    </CardContent>
  </Card>
);

export default StatisticsSalesOverviewCard;
