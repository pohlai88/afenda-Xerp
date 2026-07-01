import { EllipsisVerticalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils/utils";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

export type OrderProgressSection = {
  label: string;
  badgeValue: string;
  detailLabel: string;
  progressValue: number;
};

export type StatisticsOrdersProgressCardProps = {
  title: string;
  menuItems?: readonly string[];
  sections: readonly [OrderProgressSection, OrderProgressSection];
  className?: string;
};

const StatisticsOrdersProgressCard = ({
  title,
  menuItems = ["Share", "Update", "Refresh"],
  sections,
  className,
}: StatisticsOrdersProgressCardProps) => (
  <Card className={cn("gap-6", className)}>
    <CardHeader className="flex w-full items-center justify-between">
      <span
        {...blockSlotDomMarkerProps("metric.label")}
        className="font-medium text-xl"
      >
        {title}
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
            {menuItems.map((item) => (
              <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
    <CardContent className="space-y-6">
      {sections.map((section, index) => (
        <div className="space-y-3" key={section.label}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{section.label}</span>
            <Badge
              {...(index === 0 ? blockSlotDomMarkerProps("metric.change") : {})}
              className="rounded-sm bg-primary/10 text-primary"
            >
              {section.badgeValue}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <span
                {...(index === 0
                  ? blockSlotDomMarkerProps("metric.value")
                  : {})}
              >
                {section.detailLabel}
              </span>
              <span>{section.progressValue}%</span>
            </div>
            <Progress value={section.progressValue} />
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default StatisticsOrdersProgressCard;
