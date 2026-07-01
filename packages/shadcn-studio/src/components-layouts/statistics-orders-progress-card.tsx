import { EllipsisVerticalIcon } from "lucide-react";

import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import { Badge } from "@/components-ui/badge";
import { Button } from "@/components-ui/button";
import { Card, CardContent, CardHeader } from "@/components-ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components-ui/dropdown-menu";
import { Progress } from "@/components-ui/progress";

import { cn } from "@/utils/utils";

const listItems = ["Share", "Update", "Refresh"];

const StatisticsOrdersProgressCard = ({
  className,
}: {
  className?: string;
}) => (
  <Card className={cn("gap-6", className)}>
    <CardHeader className="flex w-full items-center justify-between">
      <span {...blockSlotDomMarkerProps("metric.label")} className="font-medium text-xl">
        Statistics
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              className="size-6 rounded-full text-muted-foreground"
              size="icon"
              variant="ghost"
            />
          }
        >
          <EllipsisVerticalIcon />
          <span className="sr-only">Edit menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {listItems.map((item, index) => (
              <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Order placed</span>
          <Badge {...blockSlotDomMarkerProps("metric.change")} className="rounded-sm bg-primary/10 text-primary">
            +11
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span {...blockSlotDomMarkerProps("metric.value")}>12 New orders</span>
            <span>85%</span>
          </div>
          <Progress value={85} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Order Delivered</span>
          <Badge className="rounded-sm bg-primary/10 text-primary">-4</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>8 New orders</span>
            <span>85%</span>
          </div>
          <Progress value={85} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatisticsOrdersProgressCard;
