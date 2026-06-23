import React from "react";
import { DENSITIES, GOVERNED_STATES, SIZES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import {
  governedTableStoryProps,
  type RenderStory,
} from "./_storybook/story-types";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DataTable } from "./data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { StatusIndicator } from "./status-indicator";

// ─── Types & sample data ───────────────────────────────────────────────────

type InvoiceStatus = "draft" | "pending" | "approved" | "overdue" | "paid";

interface Invoice {
  readonly amount: number;
  readonly dueDate: string;
  readonly id: string;
  readonly status: InvoiceStatus;
  readonly vendor: string;
}

interface PurchaseOrder {
  readonly id: string;
  readonly items: number;
  readonly requestedBy: string;
  readonly status: "open" | "approved" | "received" | "closed";
  readonly total: number;
  readonly vendor: string;
}

interface Employee {
  readonly department: string;
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly status: "active" | "on-leave" | "terminated";
}

interface InventoryItem {
  readonly location: string;
  readonly name: string;
  readonly qty: number;
  readonly reorderLevel: number;
  readonly sku: string;
}

interface Vendor {
  readonly category: string;
  readonly id: string;
  readonly name: string;
  readonly rating: "preferred" | "standard" | "review";
  readonly terms: string;
}

interface JournalEntry {
  readonly account: string;
  readonly credit: number;
  readonly debit: number;
  readonly description: string;
  readonly id: string;
  readonly period: string;
}

interface ExpenseClaim {
  readonly amount: number;
  readonly category: string;
  readonly employee: string;
  readonly id: string;
  readonly status: "submitted" | "approved" | "rejected" | "paid";
  readonly submittedOn: string;
}

interface ReceivableRow {
  readonly current: number;
  readonly customer: string;
  readonly days30: number;
  readonly days60: number;
  readonly days90: number;
  readonly total: number;
}

interface Shipment {
  readonly carrier: string;
  readonly destination: string;
  readonly eta: string;
  readonly id: string;
  readonly status: "pending" | "in-transit" | "delivered" | "exception";
}

interface ApprovalItem {
  readonly amount: number;
  readonly id: string;
  readonly priority: "low" | "normal" | "high";
  readonly requester: string;
  readonly submitted: string;
  readonly type: string;
}

interface AuditLogEntry {
  readonly action: string;
  readonly actor: string;
  readonly id: string;
  readonly resource: string;
  readonly timestamp: string;
}

const INVOICES: Invoice[] = [
  {
    id: "INV-2026-0042",
    vendor: "Acme Software Ltd.",
    amount: 4850,
    status: "pending",
    dueDate: "Jul 15, 2026",
  },
  {
    id: "INV-2026-0038",
    vendor: "FastCo Industrial",
    amount: 12_450,
    status: "approved",
    dueDate: "Jul 1, 2026",
  },
  {
    id: "INV-2026-0031",
    vendor: "Northwind Supplies",
    amount: 2180,
    status: "overdue",
    dueDate: "Jun 10, 2026",
  },
  {
    id: "INV-2026-0029",
    vendor: "Global Freight Co.",
    amount: 890,
    status: "paid",
    dueDate: "Jun 5, 2026",
  },
  {
    id: "INV-2026-0024",
    vendor: "TechParts GmbH",
    amount: 6720,
    status: "draft",
    dueDate: "Aug 2, 2026",
  },
  {
    id: "INV-2026-0019",
    vendor: "Office Essentials Inc.",
    amount: 340,
    status: "pending",
    dueDate: "Jul 22, 2026",
  },
  {
    id: "INV-2026-0015",
    vendor: "SecureNet Services",
    amount: 9600,
    status: "approved",
    dueDate: "Jul 8, 2026",
  },
  {
    id: "INV-2026-0011",
    vendor: "BuildRight Materials",
    amount: 1575,
    status: "overdue",
    dueDate: "May 28, 2026",
  },
];

const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "PO-2026-1184",
    vendor: "FastCo Industrial",
    items: 12,
    total: 12_450,
    status: "approved",
    requestedBy: "Jane Doe",
  },
  {
    id: "PO-2026-1172",
    vendor: "Northwind Supplies",
    items: 5,
    total: 8920,
    status: "open",
    requestedBy: "Alex Brown",
  },
  {
    id: "PO-2026-1160",
    vendor: "BuildRight Materials",
    items: 8,
    total: 6340,
    status: "received",
    requestedBy: "Sam Chen",
  },
  {
    id: "PO-2026-1148",
    vendor: "TechParts GmbH",
    items: 3,
    total: 2100,
    status: "closed",
    requestedBy: "Maria Kim",
  },
];

const EMPLOYEES: Employee[] = [
  {
    id: "EMP-1042",
    name: "Jane Doe",
    department: "Finance",
    email: "jane.doe@company.com",
    status: "active",
  },
  {
    id: "EMP-1038",
    name: "Alex Brown",
    department: "Operations",
    email: "alex.brown@company.com",
    status: "active",
  },
  {
    id: "EMP-1029",
    name: "Sam Chen",
    department: "HR",
    email: "sam.chen@company.com",
    status: "on-leave",
  },
  {
    id: "EMP-1015",
    name: "Maria Kim",
    department: "Executive",
    email: "maria.kim@company.com",
    status: "active",
  },
];

const INVENTORY: InventoryItem[] = [
  {
    sku: "SKU-4412",
    name: "Industrial Fasteners Kit",
    qty: 480,
    location: "Zone A · Rack 12",
    reorderLevel: 200,
  },
  {
    sku: "SKU-8820",
    name: "Stainless Steel Bolts M8",
    qty: 42,
    location: "Zone B · Rack 03",
    reorderLevel: 150,
  },
  {
    sku: "SKU-1190",
    name: "Safety Gloves — Bulk Pack",
    qty: 890,
    location: "Zone C · Rack 07",
    reorderLevel: 300,
  },
  {
    sku: "SKU-3309",
    name: "Hydraulic Pump Assembly",
    qty: 8,
    location: "Zone A · Rack 04",
    reorderLevel: 10,
  },
];

const VENDORS: Vendor[] = [
  {
    id: "VND-001",
    name: "FastCo Industrial",
    category: "Manufacturing",
    terms: "Net 30",
    rating: "preferred",
  },
  {
    id: "VND-002",
    name: "Northwind Supplies",
    category: "Office Supplies",
    terms: "Net 15",
    rating: "standard",
  },
  {
    id: "VND-003",
    name: "Global Freight Co.",
    category: "Logistics",
    terms: "Net 45",
    rating: "review",
  },
];

const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "JE-2026-8842",
    account: "6100 · Office Expenses",
    description: "Q2 software subscriptions",
    debit: 4850,
    credit: 0,
    period: "Jun 2026",
  },
  {
    id: "JE-2026-8841",
    account: "2000 · Accounts Payable",
    description: "Invoice accrual — Acme Software",
    debit: 0,
    credit: 4850,
    period: "Jun 2026",
  },
  {
    id: "JE-2026-8839",
    account: "1200 · Inventory Asset",
    description: "PO receipt — FastCo Industrial",
    debit: 12_450,
    credit: 0,
    period: "Jun 2026",
  },
];

const EXPENSE_CLAIMS: ExpenseClaim[] = [
  {
    id: "EXP-2026-0421",
    employee: "Jane Doe",
    category: "Travel",
    amount: 842.5,
    status: "submitted",
    submittedOn: "Jun 20, 2026",
  },
  {
    id: "EXP-2026-0418",
    employee: "Alex Brown",
    category: "Meals",
    amount: 124.8,
    status: "approved",
    submittedOn: "Jun 18, 2026",
  },
  {
    id: "EXP-2026-0412",
    employee: "Sam Chen",
    category: "Equipment",
    amount: 1299,
    status: "rejected",
    submittedOn: "Jun 15, 2026",
  },
];

const RECEIVABLES: ReceivableRow[] = [
  {
    customer: "Contoso Ltd.",
    current: 12_400,
    days30: 3200,
    days60: 0,
    days90: 0,
    total: 15_600,
  },
  {
    customer: "Fabrikam Inc.",
    current: 0,
    days30: 8900,
    days60: 2100,
    days90: 500,
    total: 11_500,
  },
  {
    customer: "Adventure Works",
    current: 5600,
    days30: 0,
    days60: 0,
    days90: 1800,
    total: 7400,
  },
];

const SHIPMENTS: Shipment[] = [
  {
    id: "SHP-8842",
    carrier: "FedEx Freight",
    destination: "Warehouse B · Dock 3",
    eta: "Jun 24, 2026",
    status: "in-transit",
  },
  {
    id: "SHP-8839",
    carrier: "DHL Express",
    destination: "HQ Receiving",
    eta: "Jun 22, 2026",
    status: "delivered",
  },
  {
    id: "SHP-8831",
    carrier: "UPS Ground",
    destination: "Remote Office — Austin",
    eta: "Jun 26, 2026",
    status: "exception",
  },
];

const APPROVAL_QUEUE: ApprovalItem[] = [
  {
    id: "PO-2026-1184",
    type: "Purchase Order",
    requester: "Jane Doe",
    amount: 12_450,
    submitted: "Jun 21, 2026",
    priority: "high",
  },
  {
    id: "INV-2026-0042",
    type: "Invoice",
    requester: "Finance Bot",
    amount: 4850,
    submitted: "Jun 21, 2026",
    priority: "normal",
  },
  {
    id: "EXP-2026-0421",
    type: "Expense Claim",
    requester: "Jane Doe",
    amount: 842.5,
    submitted: "Jun 20, 2026",
    priority: "low",
  },
];

const AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "AUD-9912",
    actor: "Jane Doe",
    action: "Approved purchase order",
    resource: "PO-2026-1184",
    timestamp: "Jun 21, 2026 · 11:42",
  },
  {
    id: "AUD-9911",
    actor: "Alex Brown",
    action: "Updated inventory count",
    resource: "SKU-4412",
    timestamp: "Jun 21, 2026 · 10:18",
  },
  {
    id: "AUD-9910",
    actor: "System",
    action: "Posted journal entry",
    resource: "JE-2026-8842",
    timestamp: "Jun 21, 2026 · 08:00",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function invoiceStatusTone(
  status: InvoiceStatus
): "success" | "warning" | "danger" | "neutral" | "info" {
  if (status === "approved" || status === "paid") {
    return "success";
  }
  if (status === "pending") {
    return "warning";
  }
  if (status === "overdue") {
    return "danger";
  }
  return "neutral";
}

function invoiceStatusLabel(status: InvoiceStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function StatusCell({
  label,
  tone,
}: {
  readonly label: string;
  readonly tone: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  return <StatusIndicator tone={tone}>{label}</StatusIndicator>;
}

function SortableHeader<TData>({
  column,
  label,
  align = "start",
}: {
  readonly column: Column<TData, unknown>;
  readonly label: string;
  readonly align?: "start" | "end";
}) {
  return (
    <StoryRow align="center" justify={align === "end" ? "end" : "start"}>
      <Button
        emphasis="ghost"
        intent="secondary"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        size="sm"
      >
        {label}
        <ArrowUpDownIcon aria-hidden="true" className="size-4" />
      </Button>
    </StoryRow>
  );
}

function RecordActionsMenu({ recordId }: { readonly recordId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Actions for ${recordId}`}
          emphasis="ghost"
          intent="quiet"
          presentation="icon"
          size="sm"
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{recordId}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <EyeIcon aria-hidden="true" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EditIcon aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon aria-hidden="true" />
          Copy ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

const invoiceColumnsBasic: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "Invoice",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusCell
        label={invoiceStatusLabel(row.original.status)}
        tone={invoiceStatusTone(row.original.status)}
      />
    ),
  },
  {
    accessorKey: "amount",
    header: () => <span className="text-right">Amount</span>,
    cell: ({ row }) => (
      <StoryRow justify="end">
        <span className="font-medium tabular-nums">
          {formatCurrency(row.original.amount)}
        </span>
      </StoryRow>
    ),
  },
];

function buildInvoiceColumns(options?: {
  readonly sortable?: boolean;
  readonly selectable?: boolean;
  readonly actions?: boolean;
}): ColumnDef<Invoice>[] {
  const columns: ColumnDef<Invoice>[] = [];

  if (options?.selectable) {
    columns.push(createSelectColumn<Invoice>());
  }

  columns.push(
    {
      accessorKey: "id",
      header: "Invoice",
      cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "vendor",
      header: options?.sortable
        ? ({ column }) => <SortableHeader column={column} label="Vendor" />
        : "Vendor",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusCell
          label={invoiceStatusLabel(row.original.status)}
          tone={invoiceStatusTone(row.original.status)}
        />
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "amount",
      header: options?.sortable
        ? ({ column }) => (
            <SortableHeader align="end" column={column} label="Amount" />
          )
        : () => <span className="text-right">Amount</span>,
      cell: ({ row }) => (
        <StoryRow justify="end">
          <span className="font-medium tabular-nums">
            {formatCurrency(row.original.amount)}
          </span>
        </StoryRow>
      ),
    }
  );

  if (options?.actions) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => <RecordActionsMenu recordId={row.original.id} />,
    });
  }

  return columns;
}

function DataTableToolbar<TData>({
  table,
  filterColumnId,
  filterPlaceholder = "Filter…",
  children,
}: {
  readonly table: ReturnType<typeof useReactTable<TData>>;
  readonly filterColumnId?: string;
  readonly filterPlaceholder?: string;
  readonly children?: ReactNode;
}) {
  return (
    <StoryRow align="center" justify="between" wrap>
      <StoryRow align="center" gap="sm" wrap>
        {filterColumnId ? (
          <div className="max-w-sm">
            <Input
              onChange={(event) =>
                table
                  .getColumn(filterColumnId)
                  ?.setFilterValue(event.target.value)
              }
              placeholder={filterPlaceholder}
              size="sm"
              value={
                (table.getColumn(filterColumnId)?.getFilterValue() as string) ??
                ""
              }
            />
          </div>
        ) : null}
        {children}
      </StoryRow>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Columns
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                key={column.id}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryRow>
  );
}

function DataTablePaginationFooter<TData>({
  table,
}: {
  readonly table: ReturnType<typeof useReactTable<TData>>;
}) {
  return (
    <StoryRow align="center" justify="between" wrap>
      <span className="text-muted-foreground text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </span>
      <StoryRow align="center" gap="sm">
        <Button
          disabled={!table.getCanPreviousPage()}
          emphasis="outline"
          intent="secondary"
          onClick={() => table.previousPage()}
          size="sm"
        >
          Previous
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          emphasis="outline"
          intent="secondary"
          onClick={() => table.nextPage()}
          size="sm"
        >
          Next
        </Button>
      </StoryRow>
    </StoryRow>
  );
}

function DataTableShell({
  children,
  footer,
  header,
  width = "xl",
}: {
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly header?: ReactNode;
  readonly width?: "md" | "lg" | "xl";
}) {
  return (
    <StoryFrame width={width}>
      <StoryStack gap="md">
        {header}
        {children}
        {footer}
      </StoryStack>
    </StoryFrame>
  );
}

function useDataTable<TData>(options: {
  readonly data: TData[];
  readonly columns: ColumnDef<TData>[];
  readonly pageSize?: number;
  readonly enableSelection?: boolean;
  readonly enableSorting?: boolean;
  readonly enableFiltering?: boolean;
  readonly enablePagination?: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  return useReactTable({
    data: options.data,
    columns: options.columns,
    ...(options.enableSorting ? { onSortingChange: setSorting } : {}),
    ...(options.enableFiltering
      ? { onColumnFiltersChange: setColumnFilters }
      : {}),
    onColumnVisibilityChange: setColumnVisibility,
    ...(options.enableSelection
      ? { onRowSelectionChange: setRowSelection }
      : {}),
    getCoreRowModel: getCoreRowModel(),
    ...(options.enablePagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    ...(options.enableSorting
      ? { getSortedRowModel: getSortedRowModel() }
      : {}),
    ...(options.enableFiltering
      ? { getFilteredRowModel: getFilteredRowModel() }
      : {}),
    initialState: {
      pagination: { pageSize: options.pageSize ?? 5 },
    },
    state: {
      columnVisibility,
      ...(options.enableSorting ? { sorting } : {}),
      ...(options.enableFiltering ? { columnFilters } : {}),
      ...(options.enableSelection ? { rowSelection } : {}),
    },
  });
}

function SimpleDataTable<TData>({
  columns,
  data,
  emptyMessage,
  width = "xl",
}: {
  readonly columns: ColumnDef<TData>[];
  readonly data: TData[];
  readonly emptyMessage?: string;
  readonly width?: "md" | "lg" | "xl";
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTableShell width={width}>
      <DataTable table={table} {...(emptyMessage ? { emptyMessage } : {})} />
    </DataTableShell>
  );
}

function DataTableStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  const table = useReactTable({
    data: INVOICES.slice(0, 2),
    columns: invoiceColumnsBasic,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <StoryFrame width="xl">
      <p className="font-mono text-muted-foreground text-xs">
        state=&quot;{state}&quot;
      </p>
      <DataTable state={state} table={table} />
    </StoryFrame>
  );
}

function GovernanceDataAuthorityDemo() {
  const table = useReactTable({
    data: INVOICES.slice(0, 2),
    columns: invoiceColumnsBasic,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTableShell width="xl">
      <DataTable
        data-component="Override"
        data-slot="override"
        data-testid="governance-data-table-root"
        table={table}
      />
    </DataTableShell>
  );
}

function GovernanceAccessibilityDemo() {
  const columns = useMemo(() => buildInvoiceColumns({ sortable: true }), []);
  const table = useDataTable({
    columns,
    data: [],
    enableSorting: true,
  });

  return (
    <DataTableShell width="xl">
      <DataTable emptyMessage="No invoices match your filters." table={table} />
    </DataTableShell>
  );
}

function InvoicePlaygroundDemo({
  density,
  size,
  state,
}: {
  readonly density?: (typeof DENSITIES)[number];
  readonly size?: (typeof SIZES)[number];
  readonly state?: (typeof GOVERNED_STATES)[number];
}) {
  const table = useReactTable({
    data: INVOICES.slice(0, 4),
    columns: invoiceColumnsBasic,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTableShell width="xl">
      <DataTable density={density} size={size} state={state} table={table} />
    </DataTableShell>
  );
}

// ─── DataTable ─────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed TanStack Table wrapper for ERP list views. Renders sortable columns, row selection, filtering, pagination, and empty states via `useReactTable` + column definitions. Pair with toolbar and pagination footer patterns in stories.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
      table: { defaultValue: { summary: "ready" } },
    },
    density: {
      control: "select",
      options: [...DENSITIES],
      description: "Table density passed to governed Table primitive",
    },
    size: {
      control: "select",
      options: [...SIZES],
      description: "Table size passed to governed Table primitive",
    },
  },
  args: {
    state: "ready",
  },
} satisfies Meta;

export default meta;
type Story = RenderStory<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <InvoicePlaygroundDemo {...governedTableStoryProps(args)} />
  ),
};

export const Default: Story = {
  render: () => (
    <SimpleDataTable
      columns={invoiceColumnsBasic}
      data={INVOICES.slice(0, 5)}
    />
  ),
};

export const EmptyState: Story = {
  name: "DataTable — Empty State",
  render: () => (
    <SimpleDataTable
      columns={invoiceColumnsBasic}
      data={[]}
      emptyMessage="No invoices found."
    />
  ),
};

export const RowSelection: Story = {
  name: "DataTable — Row Selection",
  render: () => {
    const columns = useMemo(
      () => buildInvoiceColumns({ selectable: true, actions: true }),
      []
    );
    const table = useDataTable({
      columns,
      data: INVOICES.slice(0, 6),
      enableSelection: true,
    });

    return (
      <DataTableShell
        footer={<DataTablePaginationFooter table={table} />}
        width="xl"
      >
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};

export const SortableColumns: Story = {
  name: "DataTable — Sortable Columns",
  render: () => {
    const columns = useMemo(() => buildInvoiceColumns({ sortable: true }), []);
    const table = useDataTable({
      columns,
      data: INVOICES,
      enableSorting: true,
    });

    return (
      <DataTableShell width="xl">
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};

export const ColumnVisibility: Story = {
  name: "DataTable — Column Visibility",
  render: () => {
    const columns = useMemo(
      () => buildInvoiceColumns({ sortable: true, actions: true }),
      []
    );
    const table = useDataTable({
      columns,
      data: INVOICES,
      enableSorting: true,
    });

    return (
      <DataTableShell header={<DataTableToolbar table={table} />} width="xl">
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};

export const FilteredSearch: Story = {
  name: "DataTable — Filtered Search",
  render: () => {
    const columns = useMemo(() => buildInvoiceColumns({ sortable: true }), []);
    const table = useDataTable({
      columns,
      data: INVOICES,
      enableFiltering: true,
      enableSorting: true,
    });

    return (
      <DataTableShell
        header={
          <DataTableToolbar
            filterColumnId="vendor"
            filterPlaceholder="Filter vendors…"
            table={table}
          />
        }
        width="xl"
      >
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};

export const Paginated: Story = {
  name: "DataTable — Pagination",
  render: () => {
    const columns = useMemo(
      () => buildInvoiceColumns({ sortable: true, actions: true }),
      []
    );
    const table = useDataTable({
      columns,
      data: INVOICES,
      enablePagination: true,
      enableSorting: true,
      pageSize: 4,
    });

    return (
      <DataTableShell
        footer={<DataTablePaginationFooter table={table} />}
        width="xl"
      >
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};

// ─── Governance probes ─────────────────────────────────────────────────────

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` and `data-component="Override"` — governed values (`data-slot="data-table"`, `data-component="DataTable"`, `data-recipe="table"`) must win on the root wrapper.',
      },
    },
  },
  render: () => <GovernanceDataAuthorityDemo />,
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "DataTable owns `root → data-table` and empty placeholder `icon → data-table-empty-cell`. Row/cell slots come from the governed Table primitive (`table`, `table-cell`, etc.).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → data-table · icon → data-table-empty-cell · (delegated) table →
          table · cell → table-cell
        </p>
        <SimpleDataTable
          columns={invoiceColumnsBasic}
          data={[]}
          emptyMessage="Inspect empty-cell slot attributes"
          width="md"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <DataTableStateProbe key={state} state={state} />
      ))}
    </StoryStack>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Native `<table>` semantics preserved via governed Table. Empty state uses `role="status"` for screen reader announcement. Sortable headers use native `<button>` triggers.',
      },
    },
  },
  render: () => <GovernanceAccessibilityDemo />,
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const InvoiceRegister: Story = {
  name: "ERP — Invoice Register",
  parameters: { layout: "padded" },
  render: () => {
    const columns = useMemo(
      () =>
        buildInvoiceColumns({
          actions: true,
          selectable: true,
          sortable: true,
        }),
      []
    );
    const table = useDataTable({
      columns,
      data: INVOICES,
      enableFiltering: true,
      enablePagination: true,
      enableSelection: true,
      enableSorting: true,
      pageSize: 5,
    });

    return (
      <DataTableShell
        footer={<DataTablePaginationFooter table={table} />}
        header={
          <StoryStack gap="sm">
            <StoryRow align="center" justify="between" wrap>
              <StoryStack gap="xs">
                <span className="font-medium text-sm">Accounts Payable</span>
                <span className="text-muted-foreground text-xs">
                  Invoice register · {INVOICES.length} records
                </span>
              </StoryStack>
              <Button emphasis="solid" intent="primary" size="sm">
                New Invoice
              </Button>
            </StoryRow>
            <DataTableToolbar
              filterColumnId="vendor"
              filterPlaceholder="Search vendor…"
              table={table}
            />
          </StoryStack>
        }
        width="xl"
      >
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};

export const PurchaseOrders: Story = {
  name: "ERP — Purchase Orders",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<PurchaseOrder>[] = [
      { accessorKey: "id", header: "PO Number" },
      { accessorKey: "vendor", header: "Vendor" },
      { accessorKey: "requestedBy", header: "Requested By" },
      {
        accessorKey: "items",
        header: () => <span className="text-right">Items</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">{row.original.items}</span>
          </StoryRow>
        ),
      },
      {
        accessorKey: "total",
        header: () => <span className="text-right">Total</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="font-medium tabular-nums">
              {formatCurrency(row.original.total)}
            </span>
          </StoryRow>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const tone =
            row.original.status === "approved" ||
            row.original.status === "closed"
              ? "success"
              : row.original.status === "open"
                ? "warning"
                : "info";
          return <StatusCell label={row.original.status} tone={tone} />;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <RecordActionsMenu recordId={row.original.id} />,
      },
    ];

    return <SimpleDataTable columns={columns} data={PURCHASE_ORDERS} />;
  },
};

export const EmployeeDirectory: Story = {
  name: "ERP — Employee Directory",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<Employee>[] = [
      { accessorKey: "id", header: "Employee ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const tone =
            row.original.status === "active"
              ? "success"
              : row.original.status === "on-leave"
                ? "warning"
                : "neutral";
          return <StatusCell label={row.original.status} tone={tone} />;
        },
      },
    ];

    return <SimpleDataTable columns={columns} data={EMPLOYEES} />;
  },
};

export const InventoryStock: Story = {
  name: "ERP — Inventory Stock List",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<InventoryItem>[] = [
      { accessorKey: "sku", header: "SKU" },
      { accessorKey: "name", header: "Product" },
      { accessorKey: "location", header: "Location" },
      {
        accessorKey: "qty",
        header: () => <span className="text-right">On Hand</span>,
        cell: ({ row }) => {
          const lowStock = row.original.qty <= row.original.reorderLevel;
          return (
            <StoryRow align="center" gap="sm" justify="end">
              <span className="tabular-nums">{row.original.qty}</span>
              {lowStock ? <StatusCell label="Low" tone="warning" /> : null}
            </StoryRow>
          );
        },
      },
      {
        accessorKey: "reorderLevel",
        header: () => <span className="text-right">Reorder At</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">{row.original.reorderLevel}</span>
          </StoryRow>
        ),
      },
    ];

    return <SimpleDataTable columns={columns} data={INVENTORY} width="lg" />;
  },
};

export const VendorMaster: Story = {
  name: "ERP — Vendor Master",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<Vendor>[] = [
      { accessorKey: "id", header: "Vendor ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "terms", header: "Payment Terms" },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
          const tone =
            row.original.rating === "preferred"
              ? "success"
              : row.original.rating === "review"
                ? "warning"
                : "neutral";
          return <StatusCell label={row.original.rating} tone={tone} />;
        },
      },
    ];

    return <SimpleDataTable columns={columns} data={VENDORS} />;
  },
};

export const GLJournalEntries: Story = {
  name: "ERP — GL Journal Entries",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<JournalEntry>[] = [
      { accessorKey: "id", header: "Entry" },
      { accessorKey: "account", header: "Account" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "period", header: "Period" },
      {
        accessorKey: "debit",
        header: () => <span className="text-right">Debit</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">
              {row.original.debit > 0
                ? formatCurrency(row.original.debit)
                : "—"}
            </span>
          </StoryRow>
        ),
      },
      {
        accessorKey: "credit",
        header: () => <span className="text-right">Credit</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">
              {row.original.credit > 0
                ? formatCurrency(row.original.credit)
                : "—"}
            </span>
          </StoryRow>
        ),
      },
    ];

    return (
      <SimpleDataTable columns={columns} data={JOURNAL_ENTRIES} width="xl" />
    );
  },
};

export const ExpenseClaims: Story = {
  name: "ERP — Expense Claims",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<ExpenseClaim>[] = [
      { accessorKey: "id", header: "Claim" },
      { accessorKey: "employee", header: "Employee" },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "amount",
        header: () => <span className="text-right">Amount</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="font-medium tabular-nums">
              {formatCurrency(row.original.amount)}
            </span>
          </StoryRow>
        ),
      },
      { accessorKey: "submittedOn", header: "Submitted" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const tone =
            row.original.status === "approved" || row.original.status === "paid"
              ? "success"
              : row.original.status === "rejected"
                ? "danger"
                : "warning";
          return <StatusCell label={row.original.status} tone={tone} />;
        },
      },
    ];

    return (
      <SimpleDataTable columns={columns} data={EXPENSE_CLAIMS} width="lg" />
    );
  },
};

export const ReceivableAging: Story = {
  name: "ERP — Accounts Receivable Aging",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<ReceivableRow>[] = [
      { accessorKey: "customer", header: "Customer" },
      {
        accessorKey: "current",
        header: () => <span className="text-right">Current</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">
              {formatCurrency(row.original.current)}
            </span>
          </StoryRow>
        ),
      },
      {
        accessorKey: "days30",
        header: () => <span className="text-right">1–30 Days</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">
              {formatCurrency(row.original.days30)}
            </span>
          </StoryRow>
        ),
      },
      {
        accessorKey: "days60",
        header: () => <span className="text-right">31–60 Days</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">
              {formatCurrency(row.original.days60)}
            </span>
          </StoryRow>
        ),
      },
      {
        accessorKey: "days90",
        header: () => <span className="text-right">61–90 Days</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="tabular-nums">
              {formatCurrency(row.original.days90)}
            </span>
          </StoryRow>
        ),
      },
      {
        accessorKey: "total",
        header: () => <span className="text-right">Total</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="font-medium tabular-nums">
              {formatCurrency(row.original.total)}
            </span>
          </StoryRow>
        ),
      },
    ];

    return <SimpleDataTable columns={columns} data={RECEIVABLES} width="xl" />;
  },
};

export const ShipmentTracking: Story = {
  name: "ERP — Shipment Tracking",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<Shipment>[] = [
      { accessorKey: "id", header: "Shipment" },
      { accessorKey: "carrier", header: "Carrier" },
      { accessorKey: "destination", header: "Destination" },
      { accessorKey: "eta", header: "ETA" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const tone =
            row.original.status === "delivered"
              ? "success"
              : row.original.status === "in-transit"
                ? "info"
                : row.original.status === "exception"
                  ? "danger"
                  : "warning";
          return <StatusCell label={row.original.status} tone={tone} />;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <RecordActionsMenu recordId={row.original.id} />,
      },
    ];

    return <SimpleDataTable columns={columns} data={SHIPMENTS} width="lg" />;
  },
};

export const ApprovalQueue: Story = {
  name: "ERP — Approval Queue",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<ApprovalItem>[] = [
      createSelectColumn<ApprovalItem>(),
      { accessorKey: "id", header: "Record" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "requester", header: "Requester" },
      {
        accessorKey: "amount",
        header: () => <span className="text-right">Amount</span>,
        cell: ({ row }) => (
          <StoryRow justify="end">
            <span className="font-medium tabular-nums">
              {formatCurrency(row.original.amount)}
            </span>
          </StoryRow>
        ),
      },
      { accessorKey: "submitted", header: "Submitted" },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const tone =
            row.original.priority === "high"
              ? "danger"
              : row.original.priority === "normal"
                ? "info"
                : "neutral";
          return <StatusCell label={row.original.priority} tone={tone} />;
        },
      },
    ];

    const table = useDataTable({
      columns,
      data: APPROVAL_QUEUE,
      enableSelection: true,
    });

    return (
      <DataTableShell
        footer={
          <StoryRow gap="sm" justify="end">
            <Button emphasis="outline" intent="secondary" size="sm">
              Reject Selected
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              Approve Selected
            </Button>
          </StoryRow>
        }
        header={
          <StoryRow align="center" justify="between">
            <span className="font-medium text-sm">Pending Approvals</span>
            <Badge emphasis="soft" size="sm" tone="warning">
              {APPROVAL_QUEUE.length} items
            </Badge>
          </StoryRow>
        }
        width="xl"
      >
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};

export const AuditLog: Story = {
  name: "ERP — Audit Log",
  parameters: { layout: "padded" },
  render: () => {
    const columns: ColumnDef<AuditLogEntry>[] = [
      { accessorKey: "timestamp", header: "Timestamp" },
      { accessorKey: "actor", header: "Actor" },
      { accessorKey: "action", header: "Action" },
      { accessorKey: "resource", header: "Resource" },
      {
        id: "actions",
        cell: ({ row }) => <RecordActionsMenu recordId={row.original.id} />,
      },
    ];

    const table = useReactTable({
      data: AUDIT_LOG,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataTableShell
        header={
          <StoryStack gap="xs">
            <span className="font-medium text-sm">System Audit Log</span>
            <span className="text-muted-foreground text-xs">
              Immutable activity trail for compliance review
            </span>
          </StoryStack>
        }
        width="xl"
      >
        <DataTable emptyMessage="No audit events recorded." table={table} />
      </DataTableShell>
    );
  },
};

export const PaginatedWithPageSize: Story = {
  name: "ERP — Pagination + Page Size",
  parameters: { layout: "padded" },
  render: () => {
    const columns = useMemo(() => buildInvoiceColumns({ sortable: true }), []);
    const table = useDataTable({
      columns,
      data: INVOICES,
      enablePagination: true,
      enableSorting: true,
      pageSize: 3,
    });

    return (
      <DataTableShell
        footer={
          <StoryRow align="center" justify="between" wrap>
            <StoryRow align="center" gap="sm">
              <span className="text-muted-foreground text-xs">
                Rows per page
              </span>
              <Select
                defaultValue="3"
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <div className="w-20">
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </StoryRow>
            <DataTablePaginationFooter table={table} />
          </StoryRow>
        }
        width="xl"
      >
        <DataTable table={table} />
      </DataTableShell>
    );
  },
};
