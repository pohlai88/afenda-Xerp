"use client";

import { useId, useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FileSearchIcon,
  MailIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@afenda/ui";
import {
  mapStockButtonProps,
  type GovernedBadgeProps,
  type GovernedUiComponentName,
} from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_INVOICE_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_INVOICES_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_INVOICES_TITLE,
  defaultAppShellDashboardInvoices,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardInvoiceRow,
  AppShellDashboardOverflowMenuItem,
  AppShellInvoiceStatus,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";
import { useDashboardPagination } from "./app-shell-dashboard-pagination";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "range" | "select" | "text";
  }
}

export type AppShellDashboardInvoiceTableGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Avatar"
  | "Badge"
  | "Button"
  | "Checkbox"
  | "DropdownMenu"
  | "InputGroup"
  | "Label"
  | "Pagination"
  | "Select"
  | "Table"
  | "Tooltip"
  | "TooltipProvider"
>;

export interface AppShellDashboardInvoiceTableProps {
  readonly rows?: readonly AppShellDashboardInvoiceRow[];
  readonly title?: string;
  readonly subtitle?: string;
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
}

const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(amount);
}

function formatIssuedDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function resolveStatusTone(
  status: AppShellInvoiceStatus
): NonNullable<GovernedBadgeProps["tone"]> {
  switch (status.kind) {
    case "paid":
      return "success";
    case "past_due":
      return "danger";
    case "draft":
      return "warning";
    case "downloaded":
      return "info";
  }
}

function resolveStatusClass(status: AppShellInvoiceStatus): string {
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

function resolveStatusIcon(status: AppShellInvoiceStatus) {
  switch (status.kind) {
    case "downloaded":
      return <DownloadIcon aria-hidden className="app-shell-dashboard-invoice-status-icon" />;
    case "draft":
      return <MailIcon aria-hidden className="app-shell-dashboard-invoice-status-icon" />;
    case "paid":
      return <CheckIcon aria-hidden className="app-shell-dashboard-invoice-status-icon" />;
    case "past_due":
      return (
        <AlertTriangleIcon aria-hidden className="app-shell-dashboard-invoice-status-icon" />
      );
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

function computeInvoiceMetrics(rows: readonly AppShellDashboardInvoiceRow[]) {
  const outstanding = rows.reduce((sum, row) => sum + row.balance, 0);
  const pastDueCount = rows.filter((row) => row.status.kind === "past_due").length;

  return {
    outstanding,
    pastDueCount,
    totalCount: rows.length,
  };
}

function createInvoiceColumns(): ColumnDef<AppShellDashboardInvoiceRow>[] {
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
                <div className={resolveStatusClass(status)}>
                  <Avatar size="sm">
                    <AvatarFallback>{resolveStatusIcon(status)}</AvatarFallback>
                  </Avatar>
                </div>
                <Badge
                  emphasis="soft"
                  tone={resolveStatusTone(status)}
                >
                  <span className="app-shell-dashboard-invoice-status-label">
                    {resolveStatusLabel(status)}
                  </span>
                </Badge>
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
          {formatCurrency(Number(row.getValue("total")))}
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
            <Badge emphasis="soft" tone={resolveStatusTone({ kind: "paid" })}>
              Paid
            </Badge>
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
            {formatCurrency(row.original.balance)}
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

export function AppShellDashboardInvoiceTable({
  rows = defaultAppShellDashboardInvoices,
  title = DEFAULT_APP_SHELL_DASHBOARD_INVOICES_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_INVOICES_SUBTITLE,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_INVOICE_OVERFLOW_ITEMS,
}: AppShellDashboardInvoiceTableProps) {
  const columns = useMemo(() => createInvoiceColumns(), []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: "issuedDate" }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const tableData = useMemo(() => [...rows], [rows]);
  const sourceMetrics = useMemo(() => computeInvoiceMetrics(rows), [rows]);

  const table = useReactTable({
    columns,
    data: tableData,
    enableRowSelection: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: { columnFilters, pagination, rowSelection, sorting },
  });

  const clientColumn = table.getColumn("client");
  const statusColumn = table.getColumn("status");
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const hasActiveFilters = columnFilters.length > 0;

  const { pages, showLeftEllipsis, showRightEllipsis } = useDashboardPagination({
    boundaryCount: 1,
    currentPage: table.getState().pagination.pageIndex + 1,
    siblingCount: 1,
    totalPages: table.getPageCount(),
  });

  const pageStart =
    filteredCount === 0
      ? 0
      : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const pageEnd = Math.min(
    table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
      table.getState().pagination.pageSize,
    filteredCount
  );

  return (
    <TooltipProvider>
      <div className="app-shell-dashboard-widget app-shell-dashboard-invoice-widget">
        <div className="app-shell-dashboard-invoice-shell">
          <div className="app-shell-dashboard-invoice-header">
            <div className="app-shell-dashboard-invoice-heading">
              <h2 className="app-shell-dashboard-invoice-title">{title}</h2>
              <p className="app-shell-dashboard-invoice-subtitle">{subtitle}</p>
              <div className="app-shell-dashboard-invoice-metrics">
                <span className="app-shell-dashboard-invoice-metric">
                  <span>{sourceMetrics.totalCount} open</span>
                </span>
                <span className="app-shell-dashboard-invoice-metric">
                  Outstanding
                  <span className="app-shell-dashboard-invoice-metric-value">
                    {formatCurrency(sourceMetrics.outstanding)}
                  </span>
                </span>
                {sourceMetrics.pastDueCount > 0 ? (
                  <span className="app-shell-dashboard-invoice-metric">
                    Past due
                    <span className="app-shell-dashboard-invoice-metric-value app-shell-dashboard-invoice-metric-value-danger">
                      {sourceMetrics.pastDueCount}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
            <AppShellDashboardOverflowMenu items={overflowItems} menuLabel="Invoice table actions" />
          </div>

          {selectedCount > 0 ? (
            <div className="app-shell-dashboard-invoice-bulk-bar" role="status">
              <span className="app-shell-dashboard-invoice-bulk-copy">
                {selectedCount} invoice{selectedCount === 1 ? "" : "s"} selected
              </span>
              <div className="app-shell-dashboard-invoice-bulk-actions">
                <Button {...mapStockButtonProps("outline", "sm")}>Export selected</Button>
                <Button {...mapStockButtonProps("outline", "sm")}>Mark paid</Button>
                <Button
                  {...mapStockButtonProps("ghost", "sm")}
                  onClick={() => table.resetRowSelection()}
                >
                  Clear selection
                </Button>
              </div>
            </div>
          ) : null}

          <div className="app-shell-dashboard-invoice-toolbar">
            <div className="app-shell-dashboard-invoice-toolbar-primary">
              <div className="app-shell-dashboard-invoice-page-size">
                <Label htmlFor="app-shell-dashboard-invoice-page-size">Show</Label>
                <Select
                  onValueChange={(value) => table.setPageSize(Number(value))}
                  value={table.getState().pagination.pageSize.toString()}
                >
                  <SelectTrigger id="app-shell-dashboard-invoice-page-size">
                    <SelectValue placeholder="Select number of results" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button {...mapStockButtonProps("default", "default")}>Create invoice</Button>
            </div>
            <div className="app-shell-dashboard-invoice-toolbar-filters">
              {clientColumn !== undefined ? <InvoiceColumnFilter column={clientColumn} /> : null}
              {statusColumn !== undefined ? <InvoiceColumnFilter column={statusColumn} /> : null}
            </div>
          </div>

          <div className="app-shell-dashboard-invoice-table-scroll">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <button
                            aria-label={`Sort by ${String(header.column.columnDef.header ?? "column")}`}
                            className="app-shell-dashboard-invoice-sort-trigger"
                            onClick={header.column.getToggleSortingHandler()}
                            type="button"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUpIcon
                                aria-hidden
                                className="app-shell-dashboard-invoice-sort-icon"
                              />
                            ) : null}
                            {header.column.getIsSorted() === "desc" ? (
                              <ChevronDownIcon
                                aria-hidden
                                className="app-shell-dashboard-invoice-sort-icon"
                              />
                            ) : null}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="app-shell-dashboard-invoice-empty">
                        <FileSearchIcon
                          aria-hidden
                          className="app-shell-dashboard-invoice-empty-icon"
                        />
                        <span className="app-shell-dashboard-invoice-empty-title">
                          No invoices match your filters
                        </span>
                        <span className="app-shell-dashboard-invoice-empty-copy">
                          Adjust client or status filters, or create a new invoice to get started.
                        </span>
                        {hasActiveFilters ? (
                          <Button
                            {...mapStockButtonProps("outline", "sm")}
                            onClick={() => table.resetColumnFilters()}
                          >
                            Clear filters
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="app-shell-dashboard-invoice-footer">
            <p aria-live="polite" className="app-shell-dashboard-invoice-summary">
              {filteredCount === 0
                ? "No entries to display"
                : `Showing ${pageStart}–${pageEnd} of ${filteredCount} filtered (${sourceMetrics.totalCount} total)`}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    {...mapStockButtonProps("ghost", "default")}
                    aria-label="Go to previous page"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                  >
                    <ChevronLeftIcon aria-hidden className="app-shell-dashboard-invoice-nav-icon" />
                    Previous
                  </Button>
                </PaginationItem>
                {showLeftEllipsis ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                {pages.map((page) => {
                  const isActive = page === table.getState().pagination.pageIndex + 1;
                  return (
                    <PaginationItem key={page}>
                      <Button
                        {...mapStockButtonProps(isActive ? "default" : "ghost", "icon-sm")}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => table.setPageIndex(page - 1)}
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  );
                })}
                {showRightEllipsis ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <Button
                    {...mapStockButtonProps("ghost", "default")}
                    aria-label="Go to next page"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                  >
                    Next
                    <ChevronRightIcon aria-hidden className="app-shell-dashboard-invoice-nav-icon" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function InvoiceColumnFilter({ column }: { readonly column: Column<AppShellDashboardInvoiceRow> }) {
  const fieldId = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === "string" ? column.columnDef.header : "Column";

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === "range") {
      return [] as readonly string[];
    }

    const values = Array.from(column.getFacetedUniqueValues().keys());
    const flattenedValues = values.reduce<readonly string[]>((accumulator, current) => {
      if (Array.isArray(current)) {
        return [...accumulator, ...current.map(String)];
      }
      return [...accumulator, String(current)];
    }, []);

    return Array.from(new Set(flattenedValues)).sort();
  }, [column, filterVariant]);

  if (filterVariant === "select") {
    return (
      <div className="app-shell-dashboard-invoice-filter">
        <Label htmlFor={`${fieldId}-select`}>{columnHeader}</Label>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}
          value={columnFilterValue?.toString() ?? "all"}
        >
          <SelectTrigger id={`${fieldId}-select`}>
            <SelectValue placeholder={`Select ${columnHeader.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={value} value={value}>
                {resolveStatusLabelFromFilterValue(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="app-shell-dashboard-invoice-filter">
      <Label htmlFor={`${fieldId}-input`}>{columnHeader}</Label>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon aria-hidden className="app-shell-dashboard-invoice-search-icon" />
        </InputGroupAddon>
        <InputGroupInput
          id={`${fieldId}-input`}
          onChange={(event) => column.setFilterValue(event.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="search"
          value={typeof columnFilterValue === "string" ? columnFilterValue : ""}
        />
      </InputGroup>
    </div>
  );
}

function resolveStatusLabelFromFilterValue(value: string): string {
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
