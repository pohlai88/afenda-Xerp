import { ArrowDownIcon, ArrowUpIcon, EllipsisVerticalIcon } from "lucide-react";
import type { ComponentType } from "react";

import { blockSlotDomMarkerProps } from "@/contracts/block-slot-dom-marker.contract.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

const listItems = ["Share", "Update", "Refresh"];

type Props = {
  title: string;
  transactions: {
    icon: ComponentType;
    paymentMethod: string;
    platform: string;
    amount: string;
    paymentType: string;
    iconClassName?: string;
  }[];
  className?: string;
};

const TransactionsCard = ({ title, transactions, className }: Props) => (
  <Card className={cn("gap-8", className)}>
    <CardHeader className="flex items-center justify-between">
      <span {...blockSlotDomMarkerProps("widget.title")} className="font-semibold text-lg">
        {title}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            {...blockSlotDomMarkerProps("widget.action")}
            className="size-6 rounded-full text-muted-foreground"
            size="icon"
            variant="ghost"
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">Menu</span>
          </Button>
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
    <CardContent {...blockSlotDomMarkerProps("widget.summary")} className="flex flex-1 flex-col justify-between gap-4">
      {transactions.map((transaction, index) => (
        <div className="flex items-center justify-between gap-2" key={index}>
          <div className="flex items-center justify-between gap-4">
            <Avatar className="size-10 rounded-sm">
              <AvatarFallback
                className={cn(
                  "shrink-0 rounded-sm bg-primary/10 text-primary [&>svg]:size-5",
                  transaction.iconClassName
                )}
              >
                <transaction.icon />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{transaction.paymentMethod}</span>
              <span className="text-muted-foreground text-sm">
                {transaction.platform}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-sm">
              {transaction.paymentType === "debit" ? "-" : "+"}
              {transaction.amount}
            </span>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
              {transaction.paymentType === "debit" ? (
                <ArrowDownIcon className="size-4" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default TransactionsCard;
