import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  Trash2Icon,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@afenda/ui";
import { mapStockButtonProps } from "@afenda/ui/governance";

import type {
  AppShellDashboardInvoiceRow,
  AppShellInvoiceStatus,
} from "../data/app-shell.dashboard.types";

export function formatInvoiceCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(amount);
}

export function formatIssuedDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function resolveStatusDotClass(status: AppShellInvoiceStatus): string {
  switch (status.kind) {
    case "paid":
      return "app-shell-dashboard-invoice-status-paid";
    case "past_due":
      return "app-shell-dashboard-invoice-status-past-due";
    case "draft":
      return "app-shell-dashboard-invoice-status-draft";
    case "downloaded":
      return "app-shell-dashboard-invoice-status-downloaded";
  }
}

function resolveStatusLabel(status: AppShellInvoiceStatus): string {
  switch (status.kind) {
    case "downloaded":
      return "Downloaded";
    case "draft":
      return "Draft";
    case "paid":
      return "Paid";
    case "past_due":
      return "Past due";
  }
}

function resolveStatusDescription(status: AppShellInvoiceStatus): string {
  switch (status.kind) {
    case "downloaded":
      return "Invoice PDF downloaded by the client";
    case "draft":
      return "Draft invoice awaiting review and send";
    case "paid":
      return "Invoice settled in full";
    case "past_due":
      return "Payment overdue — follow up required";
  }
}

function InvoiceRowActions({
  invoiceId,
  status,
}: {
  readonly invoiceId: string;
  readonly status: AppShellInvoiceStatus;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...mapStockButtonProps("ghost", "icon-sm")}
          aria-label={`More actions for invoice ${invoiceId}`}
        >
          <EllipsisVerticalIcon
            aria-hidden
            className="app-shell-dashboard-invoice-action-icon"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>Download PDF</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          {status.kind === "past_due" ? (
            <DropdownMenuItem>Send payment reminder</DropdownMenuItem>
          ) : null}
          {status.kind === "draft" ? (
            <DropdownMenuItem>Send to client</DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createAppShellDashboardInvoiceColumns(): ColumnDef<AppShellDashboardInvoiceRow>[] {
  return [
    {
      id: "select",
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all invoices on this page"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select invoice ${row.original.id}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(value === true)}
        />
      ),
      size: 50,
    },
    {
      accessorKey: "id",
      cell: ({ row }) => (
        <span className="app-shell-dashboard-invoice-id">#{row.getValue("id")}</span>
      ),
      enableSorting: true,
      header: "Invoice",
      size: 100,
    },
    {
      accessorKey: "status",
      accessorFn: (row) => row.status.kind,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="app-shell-dashboard-invoice-status-cell">
                <span
                  aria-hidden
                  className={`app-shell-dashboard-invoice-status-dot ${resolveStatusDotClass(status)}`}
                />
                <span className="app-shell-dashboard-invoice-status-label">
                  {resolveStatusLabel(status)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{resolveStatusDescription(status)}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      enableSorting: true,
      header: "Status",
      meta: { filterVariant: "select" },
      size: 140,
    },
    {
      accessorKey: "client",
      cell: ({ row }) => (
        <div className="app-shell-dashboard-invoice-client-cell">
          <Avatar size="sm">
            <AvatarImage alt={row.getValue("client")} src={row.original.avatarSrc} />
            <AvatarFallback>{row.original.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="app-shell-dashboard-invoice-client-copy">
            <span className="app-shell-dashboard-invoice-client-name">
              {row.getValue("client")}
            </span>
            <span className="app-shell-dashboard-invoice-client-field">
              {row.original.field}
            </span>
          </div>
        </div>
      ),
      enableSorting: true,
      header: "Client",
      size: 280,
    },
    {
      accessorKey: "total",
      cell: ({ row }) => (
        <span className="app-shell-dashboard-invoice-amount">
          {formatInvoiceCurrency(Number(row.getValue("total")))}
        </span>
      ),
      enableSorting: true,
      header: "Total",
    },
    {
      accessorKey: "issuedDate",
      cell: ({ row }) => {
        const date = row.getValue("issuedDate");
        if (!(date instanceof Date)) {
          return null;
        }
        return (
          <span className="app-shell-dashboard-invoice-date">{formatIssuedDate(date)}</span>
        );
      },
      enableSorting: true,
      header: "Issued",
      sortingFn: "datetime",
    },
    {
      accessorKey: "balance",
      cell: ({ row }) => {
        if (row.original.balance === 0) {
          return (
            <span className="app-shell-dashboard-invoice-balance-settled">Paid</span>
          );
        }

        const isPastDue = row.original.status.kind === "past_due";
        return (
          <span
            className={
              isPastDue
                ? "app-shell-dashboard-invoice-amount-danger"
                : "app-shell-dashboard-invoice-amount"
            }
          >
            {formatInvoiceCurrency(row.original.balance)}
          </span>
        );
      },
      enableSorting: true,
      header: "Balance",
    },
    {
      cell: ({ row }) => (
        <div className="app-shell-dashboard-invoice-actions">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                {...mapStockButtonProps("ghost", "icon-sm")}
                aria-label={`Delete invoice ${row.original.id}`}
              >
                <Trash2Icon aria-hidden className="app-shell-dashboard-invoice-action-icon" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                {...mapStockButtonProps("ghost", "icon-sm")}
                aria-label={`View invoice ${row.original.id}`}
              >
                <EyeIcon aria-hidden className="app-shell-dashboard-invoice-action-icon" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>
          <InvoiceRowActions invoiceId={row.original.id} status={row.original.status} />
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
      header: () => "Actions",
      id: "actions",
      size: 128,
    },
  ];
}

export function resolveInvoiceStatusLabelFromFilterValue(value: string): string {
  switch (value) {
    case "downloaded":
      return "Downloaded";
    case "draft":
      return "Draft";
    case "paid":
      return "Paid";
    case "past_due":
      return "Past due";
    default:
      return value;
  }
}
