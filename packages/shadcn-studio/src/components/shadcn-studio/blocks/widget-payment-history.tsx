import { EllipsisVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

const listItems = ["Share", "Update", "Refresh"];

type Props = {
  title: string;
  paymentData: {
    img: string;
    imgWidth: string;
    cardNumber: string;
    cardType: string;
    date: string;
    spend: string;
    remaining: string;
  }[];
  className?: string;
};

const PaymentHistoryCard = ({ title, paymentData, className }: Props) => (
  <Card className={cn("justify-between gap-2.5", className)}>
    <CardHeader className="flex items-center justify-between">
      <span className="font-semibold text-lg">{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
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
    <CardContent className="px-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Card</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="pr-6 text-end">Spend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentData.map((payment, index) => (
            <TableRow className="border-none" key={index}>
              <TableCell className="pl-6 first:pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-10.5 items-center justify-center rounded-sm bg-muted">
                    <img
                      alt={payment.cardType}
                      className={payment.imgWidth}
                      src={payment.img}
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-base">
                      *{payment.cardNumber}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {payment.cardType}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {payment.date}
              </TableCell>
              <TableCell className="pr-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm">-${payment.spend}</span>
                  <span className="text-muted-foreground text-xs">
                    ${payment.remaining}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default PaymentHistoryCard;
