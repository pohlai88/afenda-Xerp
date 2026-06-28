"use client";

import {
  Button,
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
  TooltipProvider,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type {
  Column,
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
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FileSearchIcon,
  SearchIcon,
} from "lucide-react";
import { useId, useMemo, useState } from "react";

import {
  DEFAULT_APP_SHELL_DASHBOARD_INVOICE_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_INVOICES_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_INVOICES_TITLE,
  defaultAppShellDashboardInvoices,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardInvoiceRow,
  AppShellDashboardOverflowMenuItem,
} from "../data/app-shell.dashboard.types";
import {
  createAppShellDashboardInvoiceColumns,
  formatInvoiceCurrency,
  resolveInvoiceStatusLabelFromFilterValue,
} from "./app-shell-dashboard-invoice-table.columns";
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
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
  readonly rows?: readonly AppShellDashboardInvoiceRow[];
  readonly subtitle?: string;
  readonly title?: string;
}

const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

function computeInvoiceMetrics(rows: readonly AppShellDashboardInvoiceRow[]) {
  const outstanding = rows.reduce((sum, row) => sum + row.balance, 0);
  const pastDueCount = rows.filter(
    (row) => row.status.kind === "past_due"
  ).length;

  return {
    outstanding,
    pastDueCount,
    totalCount: rows.length,
  };
}

export function AppShellDashboardInvoiceTable({
  rows = defaultAppShellDashboardInvoices,
  title = DEFAULT_APP_SHELL_DASHBOARD_INVOICES_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_INVOICES_SUBTITLE,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_INVOICE_OVERFLOW_ITEMS,
}: AppShellDashboardInvoiceTableProps) {
  const titleId = useId();
  const pageSizeId = useId();
  const columns = useMemo(() => createAppShellDashboardInvoiceColumns(), []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: "issuedDate" },
  ]);
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
  const isSourceEmpty = rows.length === 0;

  const { pages, showLeftEllipsis, showRightEllipsis } = useDashboardPagination(
    {
      boundaryCount: 1,
      currentPage: table.getState().pagination.pageIndex + 1,
      siblingCount: 1,
      totalPages: table.getPageCount(),
    }
  );

  const pageStart =
    filteredCount === 0
      ? 0
      : table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
        1;
  const pageEnd = Math.min(
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
      table.getState().pagination.pageSize,
    filteredCount
  );

  return (
    <TooltipProvider>
      <div className="app-shell-dashboard-widget app-shell-studio-invoice-widget">
        <div className="app-shell-studio-invoice-shell">
          <div className="app-shell-studio-invoice-header">
            <div className="app-shell-studio-invoice-heading">
              <h2 className="app-shell-studio-invoice-title" id={titleId}>
                {title}
              </h2>
              <p className="app-shell-studio-invoice-subtitle">{subtitle}</p>
              <div className="app-shell-studio-invoice-metrics">
                <span className="app-shell-studio-invoice-metric">
                  <span>{sourceMetrics.totalCount} open</span>
                </span>
                <span className="app-shell-studio-invoice-metric">
                  Outstanding
                  <span className="app-shell-studio-invoice-metric-value">
                    {formatInvoiceCurrency(sourceMetrics.outstanding)}
                  </span>
                </span>
                {sourceMetrics.pastDueCount > 0 ? (
                  <span className="app-shell-studio-invoice-metric">
                    Past due
                    <span className="app-shell-studio-invoice-metric-value app-shell-studio-invoice-metric-value-danger">
                      {sourceMetrics.pastDueCount}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
            <AppShellDashboardOverflowMenu
              items={overflowItems}
              menuLabel="Invoice table actions"
            />
          </div>

          {selectedCount > 0 ? (
            <div className="app-shell-studio-invoice-bulk-bar" role="status">
              <span className="app-shell-studio-invoice-bulk-copy">
                {selectedCount} invoice{selectedCount === 1 ? "" : "s"} selected
              </span>
              <div className="app-shell-studio-invoice-bulk-actions">
                <Button
                  emphasis="outline"
                  intent="primary"
                  presentation="default"
                  size="sm"
                >
                  Export selected
                </Button>
                <Button
                  emphasis="outline"
                  intent="primary"
                  presentation="default"
                  size="sm"
                >
                  Mark paid
                </Button>
                <Button
                  emphasis="ghost"
                  intent="quiet"
                  onClick={() => table.resetRowSelection()}
                  presentation="default"
                  size="sm"
                >
                  Clear selection
                </Button>
              </div>
            </div>
          ) : null}

          <div className="app-shell-studio-invoice-toolbar">
            <div className="app-shell-studio-invoice-toolbar-primary">
              <div className="app-shell-studio-invoice-page-size">
                <Label htmlFor={pageSizeId}>Show</Label>
                <Select
                  onValueChange={(value) => table.setPageSize(Number(value))}
                  value={table.getState().pagination.pageSize.toString()}
                >
                  <SelectTrigger id={pageSizeId}>
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
              <Button
                emphasis="solid"
                intent="primary"
                presentation="default"
                size="md"
              >
                Create invoice
              </Button>
            </div>
            <div className="app-shell-studio-invoice-toolbar-filters">
              {clientColumn === undefined ? null : (
                <InvoiceColumnFilter column={clientColumn} />
              )}
              {statusColumn === undefined ? null : (
                <InvoiceColumnFilter column={statusColumn} />
              )}
            </div>
          </div>

          <div
            aria-labelledby={titleId}
            className="app-shell-studio-invoice-table-scroll"
            role="region"
          >
            <Table>
              <caption className="sr-only">
                {title}: sortable invoice ledger with client, status, balance,
                and row actions
              </caption>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <button
                            aria-label={`Sort by ${String(header.column.columnDef.header ?? "column")}`}
                            className="app-shell-studio-invoice-sort-trigger"
                            onClick={header.column.getToggleSortingHandler()}
                            type="button"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUpIcon
                                aria-hidden
                                className="app-shell-studio-invoice-sort-icon"
                              />
                            ) : null}
                            {header.column.getIsSorted() === "desc" ? (
                              <ChevronDownIcon
                                aria-hidden
                                className="app-shell-studio-invoice-sort-icon"
                              />
                            ) : null}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
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
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="app-shell-studio-invoice-empty">
                        <FileSearchIcon
                          aria-hidden
                          className="app-shell-studio-invoice-empty-icon"
                        />
                        {isSourceEmpty ? (
                          <>
                            <span className="app-shell-studio-invoice-empty-title">
                              No invoices yet
                            </span>
                            <span className="app-shell-studio-invoice-empty-copy">
                              Create an invoice to start tracking receivables in
                              this workspace.
                            </span>
                            <Button
                              emphasis="solid"
                              intent="primary"
                              presentation="default"
                              size="sm"
                            >
                              Create invoice
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="app-shell-studio-invoice-empty-title">
                              No invoices match your filters
                            </span>
                            <span className="app-shell-studio-invoice-empty-copy">
                              Adjust client or status filters, or create a new
                              invoice to get started.
                            </span>
                            {hasActiveFilters ? (
                              <Button
                                emphasis="outline"
                                intent="primary"
                                onClick={() => table.resetColumnFilters()}
                                presentation="default"
                                size="sm"
                              >
                                Clear filters
                              </Button>
                            ) : null}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="app-shell-studio-invoice-footer">
            <p aria-live="polite" className="app-shell-studio-invoice-summary">
              {filteredCount === 0
                ? "No entries to display"
                : `Showing ${pageStart}–${pageEnd} of ${filteredCount} filtered (${sourceMetrics.totalCount} total)`}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    aria-label="Go to previous page"
                    disabled={!table.getCanPreviousPage()}
                    emphasis="ghost"
                    intent="quiet"
                    onClick={() => table.previousPage()}
                    presentation="default"
                    size="md"
                  >
                    <ChevronLeftIcon
                      aria-hidden
                      className="app-shell-studio-invoice-nav-icon"
                    />
                    Previous
                  </Button>
                </PaginationItem>
                {showLeftEllipsis ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                {pages.map((page) => {
                  const isActive =
                    page === table.getState().pagination.pageIndex + 1;
                  return (
                    <PaginationItem key={page}>
                      <Button
                        aria-current={isActive ? "page" : undefined}
                        aria-label={`Go to page ${page}`}
                        emphasis={isActive ? "solid" : "ghost"}
                        intent={isActive ? "primary" : "quiet"}
                        onClick={() => table.setPageIndex(page - 1)}
                        presentation="icon"
                        size="sm"
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
                    aria-label="Go to next page"
                    disabled={!table.getCanNextPage()}
                    emphasis="ghost"
                    intent="quiet"
                    onClick={() => table.nextPage()}
                    presentation="default"
                    size="md"
                  >
                    Next
                    <ChevronRightIcon
                      aria-hidden
                      className="app-shell-studio-invoice-nav-icon"
                    />
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

function InvoiceColumnFilter({
  column,
}: {
  readonly column: Column<AppShellDashboardInvoiceRow>;
}) {
  const fieldId = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === "string"
      ? column.columnDef.header
      : "Column";

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === "range") {
      return [] as readonly string[];
    }

    const values = Array.from(column.getFacetedUniqueValues().keys());
    const flattenedValues = values.reduce<readonly string[]>(
      (accumulator, current) => {
        if (Array.isArray(current)) {
          return [...accumulator, ...current.map(String)];
        }
        return [...accumulator, String(current)];
      },
      []
    );

    return Array.from(new Set(flattenedValues)).sort();
  }, [column, filterVariant]);

  if (filterVariant === "select") {
    return (
      <div className="app-shell-studio-invoice-filter">
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
                {resolveInvoiceStatusLabelFromFilterValue(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="app-shell-studio-invoice-filter">
      <Label htmlFor={`${fieldId}-input`}>{columnHeader}</Label>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon
            aria-hidden
            className="app-shell-studio-invoice-search-icon"
          />
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
