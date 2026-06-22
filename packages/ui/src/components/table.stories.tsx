import { DENSITIES, GOVERNED_STATES, SIZES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EditIcon,
  EyeIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Checkbox } from "./checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// ─── Shared data ─────────────────────────────────────────────────────────────

const INVOICES = [
  {
    id: "INV-2026-0042",
    vendor: "Acme Supplies Ltd.",
    amount: 24_850,
    due: "2026-07-15",
    status: "Awaiting payment",
    tone: "warning" as const,
  },
  {
    id: "INV-2026-0038",
    vendor: "Global Parts Inc.",
    amount: 8920,
    due: "2026-06-28",
    status: "Approved",
    tone: "info" as const,
  },
  {
    id: "INV-2026-0031",
    vendor: "Northwind Traders",
    amount: 15_400,
    due: "2026-06-10",
    status: "Paid",
    tone: "success" as const,
  },
  {
    id: "INV-2026-0024",
    vendor: "Contoso Ltd.",
    amount: 6200,
    due: "2026-05-30",
    status: "Overdue",
    tone: "danger" as const,
  },
] as const;

const EMPLOYEES = [
  {
    id: "EMP-1024",
    name: "Jane Doe",
    department: "Finance",
    email: "jane.doe@corp.com",
    status: "Active",
    tone: "success" as const,
  },
  {
    id: "EMP-2048",
    name: "Alex Brown",
    department: "Operations",
    email: "alex.brown@corp.com",
    status: "Active",
    tone: "success" as const,
  },
  {
    id: "EMP-3072",
    name: "Sam Chen",
    department: "HR",
    email: "sam.chen@corp.com",
    status: "On leave",
    tone: "warning" as const,
  },
] as const;

const PURCHASE_ORDERS = [
  {
    id: "PO-2026-1184",
    vendor: "Acme Supplies",
    amount: 12_400,
    status: "Pending approval",
    tone: "warning" as const,
  },
  {
    id: "PO-2026-1172",
    vendor: "Global Parts",
    amount: 7800,
    status: "Approved",
    tone: "success" as const,
  },
  {
    id: "PO-2026-1160",
    vendor: "Northwind Traders",
    amount: 21_500,
    status: "Draft",
    tone: "neutral" as const,
  },
] as const;

const INVENTORY_ROWS = [
  {
    sku: "SKU-8842",
    name: "Industrial fasteners",
    onHand: 1240,
    reorder: 500,
    tone: "success" as const,
  },
  {
    sku: "SKU-7710",
    name: "Safety gloves",
    onHand: 180,
    reorder: 200,
    tone: "warning" as const,
  },
  {
    sku: "SKU-5521",
    name: "Hydraulic fluid",
    onHand: 0,
    reorder: 100,
    tone: "danger" as const,
  },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function TableShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      {children}
    </div>
  );
}

function StatusCell({
  label,
  tone,
}: {
  readonly label: string;
  readonly tone: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  return (
    <Badge emphasis="soft" size="sm" tone={tone}>
      {label}
    </Badge>
  );
}

function SortableHeader({
  label,
  sort,
}: {
  readonly label: string;
  readonly sort?: "asc" | "desc" | "none";
}) {
  const Icon =
    sort === "asc"
      ? ArrowUpIcon
      : sort === "desc"
        ? ArrowDownIcon
        : ArrowUpDownIcon;

  return (
    <StoryRow align="center" gap="xs">
      <span>{label}</span>
      <Icon
        aria-hidden="true"
        className={
          sort === undefined || sort === "none"
            ? "size-3.5 text-muted-foreground"
            : "size-3.5"
        }
      />
    </StoryRow>
  );
}

function SelectableInvoiceTableComponent() {
  const [selected, setSelected] = useState<string[]>(["INV-2026-0042"]);

  const allIds = INVOICES.map((row) => row.id);
  const allSelected = selected.length === allIds.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleAll = () => {
    setSelected(allSelected ? [] : [...allIds]);
  };

  const toggleRow = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <StoryFrame width="xl">
      <StoryStack gap="sm">
        <StoryRow justify="between">
          <span className="text-muted-foreground text-sm">
            {selected.length} of {allIds.length} selected
          </span>
          <Button
            disabled={selected.length === 0}
            emphasis="outline"
            intent="secondary"
            size="sm"
          >
            Bulk export
          </Button>
        </StoryRow>
        <TableShell>
          <Table size="sm">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="w-10">
                  <Checkbox
                    aria-label="Select all invoices"
                    checked={someSelected ? "indeterminate" : allSelected}
                    onCheckedChange={toggleAll}
                  />
                </div>
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>
                  <div className="text-right">Amount</div>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${row.id}`}
                      checked={selected.includes(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{row.id}</span>
                  </TableCell>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>
                    <span className="text-right tabular-nums">
                    {formatCurrency(row.amount)}
                  </span>
                  </TableCell>
                  <TableCell>
                    <StatusCell label={row.status} tone={row.tone} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableShell>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Table ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed semantic table for ERP list views, rosters, and line-item grids. Supports `density`, `size`, and governed `state` on the root. Compose with `TableCaption` for accessible titles, numeric `tabular-nums` cells, status badges, row selection checkboxes, and pagination footers (see Primitives/Pagination).",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: [...DENSITIES],
      table: { defaultValue: { summary: "standard" } },
    },
    size: {
      control: "select",
      options: [...SIZES],
      table: { defaultValue: { summary: "sm" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
  args: {
    density: "standard",
    size: "sm",
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="xl">
      <Table {...args}>
        <TableCaption>Team members in current workspace</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Name</TableHead>
            <TableHead scope="col">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { id: "1", name: "Jane Doe", role: "Finance Admin" },
            { id: "2", name: "Alex Brown", role: "Operations Manager" },
            { id: "3", name: "Sam Chen", role: "HR Specialist" },
          ].map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>3 members</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </StoryFrame>
  ),
};

export const Compact: Story = {
  name: "Table — Compact Density",
  args: { density: "compact", size: "sm" },
  render: (args) => (
    <StoryFrame width="xl">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>
              <div className="text-right">On hand</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVENTORY_ROWS.map((row) => (
            <TableRow key={row.sku}>
              <TableCell>
                <span className="font-mono text-sm">{row.sku}</span>
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <span className="text-right tabular-nums">
                {row.onHand}
              </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const Comfortable: Story = {
  name: "Table — Comfortable Density",
  args: { density: "comfortable", size: "md" },
  render: (args) => (
    <StoryFrame width="xl">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {EMPLOYEES.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>
                <StatusCell label={row.status} tone={row.tone} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

// ─── Governance ────────────────────────────────────────────────────────────

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="xl">
          <span className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </span>
          <Table size="sm" state={state}>
            <TableHeader>
              <TableRow>
                <TableHead>Record</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV-2026-0042</TableCell>
                <TableCell>Probe row</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          'Use `TableCaption` for table title, `scope="col"` on headers, and semantic `th`/`td`. Pair actions with `aria-label` on icon buttons.',
      },
    },
  },
  render: () => (
    <StoryFrame width="xl">
      <Table size="sm">
        <TableCaption>Open invoices — sorted by due date</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Invoice</TableHead>
            <TableHead scope="col">Vendor</TableHead>
            <TableHead scope="col">
              <div className="text-right">
              Amount
            </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVOICES.slice(0, 2).map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <span className="font-mono text-sm">{row.id}</span>
              </TableCell>
              <TableCell>{row.vendor}</TableCell>
              <TableCell>
                <span className="text-right tabular-nums">
                {formatCurrency(row.amount)}
              </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const AllDensities: Story = {
  name: "Matrix — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      {DENSITIES.map((density) => (
        <StoryStack gap="xs" key={density}>
          <span className="font-mono text-muted-foreground text-xs">
            density=&quot;{density}&quot;
          </span>
          <Table density={density} size="sm">
            <TableHeader>
              <TableRow>
                <TableHead>PO</TableHead>
                <TableHead>Vendor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <span className="font-mono text-sm">PO-1184</span>
                </TableCell>
                <TableCell>Acme Supplies</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StoryStack>
      ))}
    </StoryStack>
  ),
};

export const AllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      {SIZES.map((size) => (
        <StoryStack gap="xs" key={size}>
          <span className="font-mono text-muted-foreground text-xs">
            size=&quot;{size}&quot;
          </span>
          <Table size={size}>
            <TableHeader>
              <TableRow>
                <TableHead>Record</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV-0042</TableCell>
                <TableCell>
                  <span className="tabular-nums">
                  {formatCurrency(24_850)}
                </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StoryStack>
      ))}
    </StoryStack>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const InvoiceList: Story = {
  name: "ERP — Invoice List",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableCaption>Accounts payable — open invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader label="Invoice" sort="asc" />
              </TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>
                <SortableHeader label="Due date" sort="none" />
              </TableHead>
              <TableHead>
                <div className="text-right">
                <SortableHeader label="Amount" sort="desc" />
              </div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className="font-mono text-sm">{row.id}</span>
                </TableCell>
                <TableCell>{row.vendor}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                  {row.due}
                </span>
                </TableCell>
                <TableCell>
                  <span className="text-right font-medium tabular-nums">
                  {formatCurrency(row.amount)}
                </span>
                </TableCell>
                <TableCell>
                  <StatusCell label={row.status} tone={row.tone} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>4 invoices shown</TableCell>
              <TableCell>
                <span className="text-right font-semibold tabular-nums">
                {formatCurrency(
                  INVOICES.reduce((sum, row) => sum + row.amount, 0)
                )}
              </span>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const EmployeeRoster: Story = {
  name: "ERP — Employee Roster",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EMPLOYEES.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <StoryRow align="center" gap="sm">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {row.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{row.name}</span>
                  </StoryRow>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{row.id}</span>
                </TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                  {row.email}
                </span>
                </TableCell>
                <TableCell>
                  <StatusCell label={row.status} tone={row.tone} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                {EMPLOYEES.length} employees · Finance org unit
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const PurchaseOrderList: Story = {
  name: "ERP — Purchase Order List",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>PO number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>
                <div className="text-right">Total</div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PURCHASE_ORDERS.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className="font-mono text-sm">{row.id}</span>
                </TableCell>
                <TableCell>{row.vendor}</TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {formatCurrency(row.amount)}
                </span>
                </TableCell>
                <TableCell>
                  <StatusCell label={row.status} tone={row.tone} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const InventoryStockLevels: Story = {
  name: "ERP — Inventory Stock Levels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table density="compact" size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>
                <div className="text-right">On hand</div>
              </TableHead>
              <TableHead>
                <div className="text-right">Reorder pt.</div>
              </TableHead>
              <TableHead>Stock level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVENTORY_ROWS.map((row) => (
              <TableRow key={row.sku}>
                <TableCell>
                  <span className="font-mono text-sm">{row.sku}</span>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {row.onHand.toLocaleString()}
                </span>
                </TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {row.reorder}
                </span>
                </TableCell>
                <TableCell>
                  <StatusCell
                    label={
                      row.tone === "success"
                        ? "Healthy"
                        : row.tone === "warning"
                          ? "Low stock"
                          : "Out of stock"
                    }
                    tone={row.tone}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const ApprovalQueue: Story = {
  name: "ERP — Approval Queue",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Record</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted by</TableHead>
              <TableHead>
                <div className="text-right">Amount</div>
              </TableHead>
              <TableHead>SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "EXP-2026-042",
                type: "Expense",
                submitter: "Alex Brown",
                amount: 1240,
                sla: "Due today",
                tone: "warning" as const,
              },
              {
                id: "PO-2026-1184",
                type: "Purchase order",
                submitter: "Jane Doe",
                amount: 12_400,
                sla: "2 days left",
                tone: "info" as const,
              },
              {
                id: "INV-2026-0038",
                type: "Invoice",
                submitter: "Sam Chen",
                amount: 8920,
                sla: "Overdue",
                tone: "danger" as const,
              },
            ].map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className="font-mono text-sm">{row.id}</span>
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.submitter}</TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {formatCurrency(row.amount)}
                </span>
                </TableCell>
                <TableCell>
                  <Badge emphasis="outline" size="sm" tone={row.tone}>
                    {row.sla}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const SelectableRows: Story = {
  name: "ERP — Selectable Rows",
  parameters: { layout: "padded" },
  render: () => <SelectableInvoiceTableComponent />,
};

export const RowActionsColumn: Story = {
  name: "ERP — Row Actions Column",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>PO number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="text-right">Actions</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PURCHASE_ORDERS.slice(0, 2).map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className="font-mono text-sm">{row.id}</span>
                </TableCell>
                <TableCell>{row.vendor}</TableCell>
                <TableCell>
                  <StatusCell label={row.status} tone={row.tone} />
                </TableCell>
                <TableCell>
                  <div className="text-right">
                  <StoryRow gap="xs" justify="end">
                    <ButtonGroup>
                      <Button
                        aria-label={`View ${row.id}`}
                        emphasis="ghost"
                        intent="quiet"
                        presentation="icon"
                        size="sm"
                      >
                        <EyeIcon />
                      </Button>
                      <Button
                        aria-label={`Edit ${row.id}`}
                        emphasis="ghost"
                        intent="quiet"
                        presentation="icon"
                        size="sm"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        aria-label={`Delete ${row.id}`}
                        emphasis="ghost"
                        intent="destructive"
                        presentation="icon"
                        size="sm"
                      >
                        <Trash2Icon />
                      </Button>
                    </ButtonGroup>
                    <Button
                      aria-label={`More actions for ${row.id}`}
                      emphasis="ghost"
                      intent="quiet"
                      presentation="icon"
                      size="sm"
                    >
                      <MoreHorizontalIcon />
                    </Button>
                  </StoryRow>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const LineItemsGrid: Story = {
  name: "ERP — Line Items Grid",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table density="compact" size="sm">
          <TableCaption>PO-2026-1184 line items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Line</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <div className="text-right">Qty</div>
              </TableHead>
              <TableHead>
                <div className="text-right">Unit price</div>
              </TableHead>
              <TableHead>
                <div className="text-right">Line total</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { line: 1, desc: "Industrial fasteners", qty: 500, unit: 12 },
              { line: 2, desc: "Safety gloves", qty: 200, unit: 9 },
              { line: 3, desc: "Packing tape (rolls)", qty: 80, unit: 4.5 },
            ].map((row) => (
              <TableRow key={row.line}>
                <TableCell>
                  <span className="tabular-nums">{row.line}</span>
                </TableCell>
                <TableCell>{row.desc}</TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {row.qty}
                </span>
                </TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {formatCurrency(row.unit)}
                </span>
                </TableCell>
                <TableCell>
                  <span className="text-right font-medium tabular-nums">
                  {formatCurrency(row.qty * row.unit)}
                </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Subtotal</TableCell>
              <TableCell>
                <span className="text-right font-semibold tabular-nums">
                {formatCurrency(500 * 12 + 200 * 9 + 80 * 4.5)}
              </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const ExpenseReportLines: Story = {
  name: "ERP — Expense Report Lines",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <div className="text-right">Amount</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                date: "Jun 18",
                category: "Travel",
                desc: "Flight SFO → NYC",
                amount: 420,
              },
              {
                date: "Jun 18",
                category: "Meals",
                desc: "Client dinner",
                amount: 186,
              },
              {
                date: "Jun 19",
                category: "Lodging",
                desc: "Hotel — 2 nights",
                amount: 574,
              },
            ].map((row) => (
              <TableRow key={row.desc}>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                  {row.date}
                </span>
                </TableCell>
                <TableCell>
                  <Badge emphasis="outline" size="sm" tone="neutral">
                    {row.category}
                  </Badge>
                </TableCell>
                <TableCell>{row.desc}</TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {formatCurrency(row.amount)}
                </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total reimbursement</TableCell>
              <TableCell>
                <span className="text-right font-semibold tabular-nums">
                {formatCurrency(1180)}
              </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const AuditTrailTable: Story = {
  name: "ERP — Audit Trail Table",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table density="compact" size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Field</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                time: "Jun 21, 14:32",
                actor: "Jane Doe",
                action: "Updated",
                field: "Amount → $24,850",
              },
              {
                time: "Jun 20, 09:15",
                actor: "System",
                action: "Synced",
                field: "Vendor master record",
              },
              {
                time: "Jun 18, 16:40",
                actor: "Alex Brown",
                action: "Created",
                field: "INV-2026-0042",
              },
            ].map((row) => (
              <TableRow key={row.time}>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                  {row.time}
                </span>
                </TableCell>
                <TableCell>{row.actor}</TableCell>
                <TableCell>
                  <Badge emphasis="soft" size="sm" tone="info">
                    {row.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{row.field}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const TimesheetEntries: Story = {
  name: "ERP — Timesheet Entries",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>
                <div className="text-right">Hours</div>
              </TableHead>
              <TableHead>
                <div className="text-right">Billable</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                project: "PRJ-210",
                task: "Implementation",
                hours: 6.5,
                billable: true,
              },
              {
                project: "PRJ-210",
                task: "Client meeting",
                hours: 2,
                billable: true,
              },
              {
                project: "INT-001",
                task: "Training",
                hours: 1.5,
                billable: false,
              },
            ].map((row) => (
              <TableRow key={`${row.project}-${row.task}`}>
                <TableCell>
                  <span className="font-mono text-sm">
                  {row.project}
                </span>
                </TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {row.hours.toFixed(1)}
                </span>
                </TableCell>
                <TableCell>
                  <div className="text-right">
                  <Badge
                    emphasis="soft"
                    size="sm"
                    tone={row.billable ? "success" : "neutral"}
                  >
                    {row.billable ? "Yes" : "No"}
                  </Badge>
                </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Week total</TableCell>
              <TableCell>
                <span className="text-right font-semibold tabular-nums">
                10.0
              </span>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const MultiCurrencyColumns: Story = {
  name: "ERP — Multi-Currency Columns",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>
                <div className="text-right">Amount</div>
              </TableHead>
              <TableHead>
                <div className="text-right">USD equivalent</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "INV-EU-012",
                currency: "EUR",
                amount: "€18,200",
                usd: 19_840,
              },
              {
                id: "INV-SG-008",
                currency: "SGD",
                amount: "S$42,500",
                usd: 31_200,
              },
              {
                id: "INV-US-042",
                currency: "USD",
                amount: "$24,850",
                usd: 24_850,
              },
            ].map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className="font-mono text-sm">{row.id}</span>
                </TableCell>
                <TableCell>{row.currency}</TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {row.amount}
                </span>
                </TableCell>
                <TableCell>
                  <span className="text-right tabular-nums">
                  {formatCurrency(row.usd)}
                </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const EmptyResults: Story = {
  name: "ERP — Empty Results",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableCaption>No matching purchase orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>PO number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3}>
                <div className="text-center text-muted-foreground text-sm">
                  <StoryStack padding="lg">
                    No records match your filters. Adjust filters or clear search.
                  </StoryStack>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const LoadingState: Story = {
  name: "ERP — Loading State",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="xs">
        <TableShell>
          <Table size="sm" state="loading">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>
                  <div className="text-right">Amount</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.slice(0, 2).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{row.id}</span>
                  </TableCell>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>
                    <span className="text-right tabular-nums">
                    {formatCurrency(row.amount)}
                  </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableShell>
        <span className="text-muted-foreground text-xs">
          `state=&quot;loading&quot;` on `Table` — pair with skeleton rows in
          app views.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PaginationIntegration: Story = {
  name: "ERP — Pagination Integration",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Table body shows a page slice; footer summarizes range. Full interactive example in Primitives/Pagination.",
      },
    },
  },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <TableShell>
          <Table size="sm">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div className="text-right">Amount</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{row.id}</span>
                  </TableCell>
                  <TableCell>
                    <StatusCell label={row.status} tone={row.tone} />
                  </TableCell>
                  <TableCell>
                    <span className="text-right tabular-nums">
                    {formatCurrency(row.amount)}
                  </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableShell>
        <StoryRow align="center" justify="between" wrap>
          <span className="text-muted-foreground text-sm">
            Showing 1–4 of 284 invoices
          </span>
          <StoryRow gap="xs">
            <Button disabled emphasis="outline" intent="secondary" size="sm">
              Previous
            </Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              Next
            </Button>
          </StoryRow>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SemanticRowStates: Story = {
  name: "Token — Semantic Row States",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Hover and selected row states driven by `--afenda-table-row-hover` and `--afenda-table-row-selected` tokens. Toggle Theme to verify dark-mode values. Row border uses `--afenda-table-row-border`; header uses `--afenda-table-header-foreground` and `--afenda-table-header-background` (footer).",
      },
    },
  },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Row state</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>INV-2026-0042</TableCell>
              <TableCell>Acme Supplies Ltd.</TableCell>
              <TableCell>
                <Badge emphasis="soft" size="sm" tone="info">
                  selected
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV-2026-0038</TableCell>
              <TableCell>Global Parts Inc.</TableCell>
              <TableCell>
                <Badge emphasis="soft" size="sm" tone="neutral">
                  default (hover me)
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV-2026-0031</TableCell>
              <TableCell>Northwind Traders</TableCell>
              <TableCell>
                <Badge emphasis="soft" size="sm" tone="neutral">
                  default (hover me)
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Footer — header background token</TableCell>
              <TableCell>3 rows</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};

export const TableVsBadgeStatus: Story = {
  name: "ERP — Table vs Badge Status Column",
  parameters: {
    docs: {
      description: {
        story:
          "Status columns use `Badge` with governed tones. See Primitives/Badge for status vocabulary and SLA indicators.",
      },
    },
  },
  render: () => (
    <StoryFrame width="xl">
      <TableShell>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Record</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <span className="font-mono text-sm">PO-1184</span>
              </TableCell>
              <TableCell>
                <StatusCell label="Pending approval" tone="warning" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableShell>
    </StoryFrame>
  ),
};
