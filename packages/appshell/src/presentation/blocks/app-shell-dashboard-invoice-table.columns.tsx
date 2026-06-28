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
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon, EyeIcon, Trash2Icon } from "lucide-react";

import type {
  AppShellDashboardInvoiceRow,
  AppShellInvoiceStatus,
} from "../data/app-shell.dashboard.types";

const INVOICE_STATUS_LABELS = {
  downloaded: "Downloaded",
  draft: "Draft",
  paid: "Paid",
  past_due: "Past due",
} as const satisfies Record<AppShellInvoiceStatus["kind"], string>;

const INVOICE_STATUS_DESCRIPTIONS = {
  downloaded: "Invoice PDF downloaded by the client",
  draft: "Draft invoice awaiting review and send",
  paid: "Invoice settled in full",
  past_due: "Payment overdue — follow up required",
} as const satisfies Record<AppShellInvoiceStatus["kind"], string>;

export type AppShellDashboardInvoiceTableColumnsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Button" | "Checkbox" | "DropdownMenu" | "Tooltip"
>;

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

function resolveStatusLabel(status: AppShellInvoiceStatus): string {
  return INVOICE_STATUS_LABELS[status.kind];
}

function resolveStatusDescription(status: AppShellInvoiceStatus): string {
  return INVOICE_STATUS_DESCRIPTIONS[status.kind];
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
          aria-label={`More actions for invoice ${invoiceId}`}
          emphasis="ghost"
          intent="quiet"
          presentation="icon"
          size="sm"
          type="button"
        >
          <EllipsisVerticalIcon
            aria-hidden
            className="app-shell-studio-invoice-action-icon"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <div className="app-shell-studio-invoice-row-actions-menu">
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
        </div>
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
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(value === true)
          }
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
        <span className="app-shell-studio-invoice-id">
          #{row.getValue("id")}
        </span>
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
              <button
                aria-label={`${resolveStatusLabel(status)}. ${resolveStatusDescription(status)}`}
                className="app-shell-studio-invoice-status-cell"
                type="button"
              >
                <span
                  aria-hidden
                  className="app-shell-studio-invoice-status-dot"
                  data-status={status.kind}
                />
                <span className="app-shell-studio-invoice-status-label">
                  {resolveStatusLabel(status)}
                </span>
              </button>
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
        <div className="app-shell-studio-invoice-client-cell">
          <Avatar size="sm">
            <AvatarImage
              alt={row.getValue("client")}
              src={row.original.avatarSrc}
            />
            <AvatarFallback>{row.original.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="app-shell-studio-invoice-client-copy">
            <span className="app-shell-studio-invoice-client-name">
              {row.getValue("client")}
            </span>
            <span className="app-shell-studio-invoice-client-field">
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
        <span className="app-shell-studio-invoice-amount">
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
          <span className="app-shell-studio-invoice-date">
            {formatIssuedDate(date)}
          </span>
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
            <span className="app-shell-studio-invoice-balance-settled">
              Paid
            </span>
          );
        }

        const isPastDue = row.original.status.kind === "past_due";
        return (
          <span
            className={
              isPastDue
                ? "app-shell-studio-invoice-amount-danger"
                : "app-shell-studio-invoice-amount"
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
        <div className="app-shell-studio-invoice-actions">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={`Delete invoice ${row.original.id}`}
                emphasis="ghost"
                intent="quiet"
                presentation="icon"
                size="sm"
                type="button"
              >
                <Trash2Icon
                  aria-hidden
                  className="app-shell-studio-invoice-action-icon"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={`View invoice ${row.original.id}`}
                emphasis="ghost"
                intent="quiet"
                presentation="icon"
                size="sm"
                type="button"
              >
                <EyeIcon
                  aria-hidden
                  className="app-shell-studio-invoice-action-icon"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>
          <InvoiceRowActions
            invoiceId={row.original.id}
            status={row.original.status}
          />
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

export function resolveInvoiceStatusLabelFromFilterValue(
  value: string
): string {
  if (value in INVOICE_STATUS_LABELS) {
    return INVOICE_STATUS_LABELS[value as AppShellInvoiceStatus["kind"]];
  }

  return value;
}
