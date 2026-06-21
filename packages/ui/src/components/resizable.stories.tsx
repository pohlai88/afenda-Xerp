import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Building2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  FileTextIcon,
  HistoryIcon,
  LayoutGridIcon,
  PackageIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useResizablePanelRef,
} from "./resizable";
import { Separator } from "./separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// ─── Shared data ─────────────────────────────────────────────────────────────

const INVOICE_ROWS = [
  { id: "INV-001", customer: "Acme Corp", amount: 4850, status: "Paid" },
  { id: "INV-002", customer: "Globex Ltd", amount: 1200, status: "Pending" },
  { id: "INV-003", customer: "Initech", amount: 8750, status: "Overdue" },
  { id: "INV-004", customer: "Umbrella Co", amount: 3200, status: "Draft" },
] as const;

const PO_LINE_ITEMS = [
  {
    line: 1,
    sku: "SKU-4412",
    desc: "Industrial fasteners",
    qty: 500,
    unit: 0.42,
  },
  {
    line: 2,
    sku: "SKU-8820",
    desc: "Stainless bolts M8",
    qty: 200,
    unit: 1.15,
  },
  {
    line: 3,
    sku: "SKU-1190",
    desc: "Safety gloves — bulk",
    qty: 50,
    unit: 8.9,
  },
] as const;

const MODULE_LINKS = [
  { id: "finance", label: "Finance", icon: CreditCardIcon },
  { id: "procurement", label: "Procurement", icon: PackageIcon },
  { id: "inventory", label: "Inventory", icon: LayoutGridIcon },
  { id: "hr", label: "Human resources", icon: UserIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
] as const;

const AUDIT_EVENTS = [
  { actor: "Jane Doe", action: "Submitted for approval", time: "09:14" },
  { actor: "Michael Chen", action: "Approved — Dept Head", time: "11:42" },
  { actor: "Finance Bot", action: "Pending VP review", time: "Awaiting" },
] as const;

const APPROVAL_QUEUE = [
  {
    id: "PO-1042",
    title: "FastCo Industrial",
    amount: 12_450,
    priority: "High",
  },
  { id: "INV-2048", title: "Globex renewal", amount: 8750, priority: "Medium" },
  {
    id: "EXP-331",
    title: "Travel reimbursement",
    amount: 890,
    priority: "Low",
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

function ResizableFrame({
  children,
  height = "h-96",
  width = "lg",
}: {
  readonly children: ReactNode;
  readonly height?: "h-80" | "h-96";
  readonly width?: "md" | "lg" | "xl";
}) {
  return (
    <StoryFrame width={width}>
      <StoryStack
        className={`${height} overflow-hidden rounded-lg border border-border`}
      >
        {children}
      </StoryStack>
    </StoryFrame>
  );
}

function PanelShell({
  title,
  children,
  centered = false,
}: {
  readonly title?: string;
  readonly children?: ReactNode;
  readonly centered?: boolean;
}) {
  if (centered) {
    return (
      <StoryStack
        className="h-full items-center justify-center"
        gap="xs"
        padding="md"
      >
        <span className="font-semibold text-sm">{title}</span>
      </StoryStack>
    );
  }

  return (
    <StoryStack className="h-full overflow-auto" gap="sm" padding="md">
      {title ? <span className="font-semibold text-sm">{title}</span> : null}
      {children}
    </StoryStack>
  );
}

function SectionLabel({ children }: { readonly children: string }) {
  return (
    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
      {children}
    </span>
  );
}

function KeyValueRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <StoryRow justify="between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm">{value}</span>
    </StoryRow>
  );
}

function CollapsibleNavDemo() {
  const navRef = useResizablePanelRef();

  return (
    <ResizableFrame>
      <StoryStack className="h-full" gap="xs">
        <StoryRow gap="sm" padding="sm">
          <Button
            emphasis="outline"
            intent="secondary"
            onClick={() => navRef.current?.collapse()}
            presentation="icon"
            size="sm"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            emphasis="outline"
            intent="secondary"
            onClick={() => navRef.current?.expand()}
            presentation="icon"
            size="sm"
          >
            <ChevronRightIcon />
          </Button>
          <span className="text-muted-foreground text-xs">
            Collapse or expand navigation panel
          </span>
        </StoryRow>
        <ResizablePanelGroup
          className="min-h-0 flex-1"
          orientation="horizontal"
        >
          <ResizablePanel
            collapsible
            defaultSize={22}
            maxSize={30}
            minSize={12}
            panelRef={navRef}
          >
            <PanelShell title="Navigation">
              <StoryStack gap="xs">
                {MODULE_LINKS.map(({ id, label, icon: Icon }) => (
                  <StoryRow gap="sm" key={id}>
                    <Icon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    <span className="text-sm">{label}</span>
                  </StoryRow>
                ))}
              </StoryStack>
            </PanelShell>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={78}>
            <PanelShell title="Main content">
              <span className="text-muted-foreground text-sm">
                Resize the handle or use the collapse buttons above.
              </span>
            </PanelShell>
          </ResizablePanel>
        </ResizablePanelGroup>
      </StoryStack>
    </ResizableFrame>
  );
}

// ─── Resizable ───────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Resizable",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed react-resizable-panels wrapper for ERP split layouts — record detail panes, module shells, document editors, and inspector panels. Use horizontal splits for list + detail; vertical splits for grid + footer summaries.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ResizableFrame width="md">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={50}>
          <PanelShell centered title="Primary panel" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup className="h-full" orientation="vertical">
            <ResizablePanel defaultSize={25}>
              <PanelShell centered title="Secondary top" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <PanelShell centered title="Secondary bottom" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const WithHandle: Story = {
  name: "Resizable — With Handle",
  render: () => (
    <ResizableFrame width="md">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={50}>
          <PanelShell centered title="Left panel" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup className="h-full" orientation="vertical">
            <ResizablePanel defaultSize={30}>
              <PanelShell centered title="Top right" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
              <PanelShell centered title="Bottom right" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const HorizontalSplit: Story = {
  name: "Resizable — Horizontal Split",
  render: () => (
    <ResizableFrame>
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={35}>
          <PanelShell centered title="List pane" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <PanelShell centered title="Detail pane" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const VerticalSplit: Story = {
  name: "Resizable — Vertical Split",
  render: () => (
    <ResizableFrame>
      <ResizablePanelGroup className="h-full" orientation="vertical">
        <ResizablePanel defaultSize={70}>
          <PanelShell centered title="Main workspace" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <PanelShell centered title="Footer / summary" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const NestedLayouts: Story = {
  name: "Resizable — Nested Layouts",
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <PanelShell centered title="Nav" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55}>
          <PanelShell centered title="Content" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={18}>
          <PanelShell centered title="Inspector" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const MinMaxConstraints: Story = {
  name: "Resizable — Min / Max Constraints",
  parameters: {
    docs: {
      description: {
        story:
          "Use `minSize` and `maxSize` (percentage) to keep navigation readable and prevent detail panes from collapsing entirely.",
      },
    },
  },
  render: () => (
    <ResizableFrame>
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={25} maxSize={35} minSize={18}>
          <PanelShell title="Sidebar (18–35%)">
            <span className="text-muted-foreground text-xs">
              minSize 18 · maxSize 35
            </span>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={50}>
          <PanelShell title="Workspace (min 50%)">
            <span className="text-muted-foreground text-xs">
              Detail area cannot shrink below half the layout.
            </span>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const CollapsiblePanel: Story = {
  name: "Resizable — Collapsible Panel",
  render: () => <CollapsibleNavDemo />,
};

export const DefaultSizePresets: Story = {
  name: "Resizable — Default Size Presets",
  render: () => (
    <ResizableFrame>
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={40}>
          <PanelShell centered title="40% default" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <PanelShell centered title="60% default" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

// ─── ERP usage ───────────────────────────────────────────────────────────────

export const RecordDetailSplit: Story = {
  name: "ERP — Record Detail Split",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={38} minSize={28}>
          <PanelShell title="Invoices">
            <StoryStack gap="xs">
              {INVOICE_ROWS.map(({ id, customer, amount, status }) => (
                <StoryRow justify="between" key={id}>
                  <StoryStack gap="xs">
                    <span className="font-mono text-sm">{id}</span>
                    <span className="text-muted-foreground text-xs">
                      {customer}
                    </span>
                  </StoryStack>
                  <StoryStack gap="xs">
                    <Badge emphasis="soft" tone="neutral">
                      {status}
                    </Badge>
                    <span className="text-right text-sm tabular-nums">
                      {formatCurrency(amount)}
                    </span>
                  </StoryStack>
                </StoryRow>
              ))}
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={62}>
          <PanelShell title="INV-001 · Acme Corp">
            <StoryStack gap="sm">
              <KeyValueRow label="Status" value="Paid" />
              <KeyValueRow label="Amount" value={formatCurrency(4850)} />
              <KeyValueRow label="Due date" value="Jun 30, 2026" />
              <KeyValueRow label="Payment terms" value="Net 30" />
              <Separator />
              <SectionLabel>Line items</SectionLabel>
              <span className="text-muted-foreground text-sm">
                3 line items · drag the handle to widen the detail pane.
              </span>
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const ModuleNavigationShell: Story = {
  name: "ERP — Module Navigation Shell",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel collapsible defaultSize={18} minSize={12}>
          <PanelShell title="Modules">
            <StoryStack gap="sm">
              {MODULE_LINKS.map(({ id, label, icon: Icon }) => (
                <StoryRow gap="sm" key={id}>
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  <span className="text-sm">{label}</span>
                </StoryRow>
              ))}
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={82}>
          <PanelShell title="Finance · Invoices">
            <span className="text-muted-foreground text-sm">
              Main module workspace — collapse the nav by dragging the handle
              past the minimum width.
            </span>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const DocumentEditorLayout: Story = {
  name: "ERP — Document Editor Layout",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={55} minSize={40}>
          <PanelShell title="PO-1042 · Line entry">
            <StoryStack gap="sm">
              <KeyValueRow label="Vendor" value="FastCo Industrial" />
              <KeyValueRow label="Ship to" value="East warehouse" />
              <Separator />
              <SectionLabel>Lines</SectionLabel>
              {PO_LINE_ITEMS.map(({ line, desc, qty, unit }) => (
                <StoryRow justify="between" key={line}>
                  <span className="text-sm">{desc}</span>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    {qty} × {formatCurrency(unit)}
                  </span>
                </StoryRow>
              ))}
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={30}>
          <PanelShell title="Document preview">
            <StoryStack
              className="h-full rounded-md border border-border"
              gap="xs"
              padding="md"
            >
              <StoryRow align="center" gap="sm">
                <FileTextIcon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                <span className="font-medium text-sm">Purchase order PDF</span>
              </StoryRow>
              <span className="text-muted-foreground text-xs">
                Live preview updates as lines change.
              </span>
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const DataGridInspector: Story = {
  name: "ERP — Data Grid + Inspector",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame height="h-80" width="xl">
      <ResizablePanelGroup className="h-full" orientation="vertical">
        <ResizablePanel defaultSize={65} minSize={45}>
          <PanelShell title="Employee roster">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono">EMP-00142</TableCell>
                  <TableCell>Jane Doe</TableCell>
                  <TableCell>Finance</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">EMP-00208</TableCell>
                  <TableCell>Michael Chen</TableCell>
                  <TableCell>Operations</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35} minSize={20}>
          <PanelShell title="Inspector · EMP-00142">
            <StoryStack gap="xs">
              <KeyValueRow label="Role" value="Finance controller" />
              <KeyValueRow label="Manager" value="Alex Chen" />
              <KeyValueRow label="Start date" value="Mar 12, 2024" />
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const FinanceDashboard: Story = {
  name: "ERP — Finance Dashboard",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="vertical">
        <ResizablePanel defaultSize={30} minSize={22}>
          <PanelShell title="KPI strip">
            <StoryRow gap="md" wrap>
              <StoryStack gap="xs">
                <SectionLabel>Receivables</SectionLabel>
                <span className="font-semibold text-lg tabular-nums">
                  {formatCurrency(128_400)}
                </span>
              </StoryStack>
              <StoryStack gap="xs">
                <SectionLabel>Payables</SectionLabel>
                <span className="font-semibold text-lg tabular-nums">
                  {formatCurrency(84_200)}
                </span>
              </StoryStack>
              <StoryStack gap="xs">
                <SectionLabel>Cash</SectionLabel>
                <span className="font-semibold text-lg tabular-nums">
                  {formatCurrency(256_000)}
                </span>
              </StoryStack>
            </StoryRow>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <PanelShell title="Ledger activity">
            <span className="text-muted-foreground text-sm">
              Drag the horizontal handle to give more room to KPIs or the
              ledger.
            </span>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const AuditTrailPanel: Story = {
  name: "ERP — Audit Trail Panel",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={62}>
          <PanelShell title="PO-1042 · Header">
            <StoryStack gap="sm">
              <KeyValueRow label="Vendor" value="FastCo Industrial" />
              <KeyValueRow label="Total" value={formatCurrency(12_450)} />
              <KeyValueRow label="Status" value="Pending approval" />
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={38} minSize={28}>
          <PanelShell title="Audit trail">
            <StoryStack gap="sm">
              {AUDIT_EVENTS.map(({ actor, action, time }) => (
                <StoryStack gap="xs" key={`${actor}-${time}`}>
                  <StoryRow align="center" gap="sm">
                    <HistoryIcon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    <span className="font-medium text-sm">{actor}</span>
                  </StoryRow>
                  <span className="text-sm">{action}</span>
                  <span className="text-muted-foreground text-xs">{time}</span>
                </StoryStack>
              ))}
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const ProcurementPOLines: Story = {
  name: "ERP — Procurement PO Lines",
  parameters: { layout: "padded" },
  render: () => {
    const subtotal = PO_LINE_ITEMS.reduce(
      (sum, line) => sum + line.qty * line.unit,
      0
    );

    return (
      <ResizableFrame width="xl">
        <ResizablePanelGroup className="h-full" orientation="vertical">
          <ResizablePanel defaultSize={72} minSize={50}>
            <PanelShell title="Line items">
              <StoryStack gap="xs">
                {PO_LINE_ITEMS.map(({ line, sku, desc, qty, unit }) => (
                  <StoryRow justify="between" key={line}>
                    <StoryStack gap="xs">
                      <span className="font-mono text-xs">{sku}</span>
                      <span className="text-sm">{desc}</span>
                    </StoryStack>
                    <span className="text-sm tabular-nums">
                      {qty} × {formatCurrency(unit)}
                    </span>
                  </StoryRow>
                ))}
              </StoryStack>
            </PanelShell>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={28} minSize={18}>
            <PanelShell title="Totals">
              <StoryStack gap="xs">
                <KeyValueRow
                  label="Subtotal"
                  value={formatCurrency(subtotal)}
                />
                <KeyValueRow label="Freight" value={formatCurrency(120)} />
                <KeyValueRow
                  label="Tax"
                  value={formatCurrency(subtotal * 0.08)}
                />
                <Separator />
                <KeyValueRow
                  label="Grand total"
                  value={formatCurrency(subtotal + 120 + subtotal * 0.08)}
                />
              </StoryStack>
            </PanelShell>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizableFrame>
    );
  },
};

export const SettingsPanel: Story = {
  name: "ERP — Settings Panel",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={24} minSize={18}>
          <PanelShell title="Settings">
            <StoryStack gap="xs">
              <span className="text-sm">Organization</span>
              <span className="text-sm">Users &amp; roles</span>
              <span className="text-sm">Integrations</span>
              <span className="text-sm">Notifications</span>
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={76}>
          <PanelShell title="Organization profile">
            <StoryStack gap="sm">
              <KeyValueRow label="Legal name" value="Acme Global Ltd" />
              <KeyValueRow label="Tax ID" value="US-12-3456789" />
              <KeyValueRow label="Default currency" value="USD" />
              <KeyValueRow label="Fiscal year start" value="January" />
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const ReportBuilder: Story = {
  name: "ERP — Report Builder",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={32} minSize={24}>
          <PanelShell title="Filters">
            <StoryStack gap="sm">
              <KeyValueRow label="Date range" value="Q2 2026" />
              <KeyValueRow label="Department" value="All" />
              <KeyValueRow label="Status" value="Posted" />
              <Button emphasis="solid" intent="primary" size="sm">
                Run report
              </Button>
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={68}>
          <PanelShell title="Preview">
            <StoryStack
              className="h-full rounded-md border border-border border-dashed"
              gap="xs"
              padding="md"
            >
              <span className="text-muted-foreground text-sm">
                Report output renders here. Widen the filter pane to configure
                more dimensions.
              </span>
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const InventoryDetail: Story = {
  name: "ERP — Inventory Detail",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={40} minSize={30}>
          <PanelShell title="SKU-4412 · Bins">
            <StoryStack gap="xs">
              <StoryRow justify="between">
                <span className="text-sm">Zone A · Rack 12</span>
                <Badge emphasis="soft" tone="success">
                  480 on hand
                </Badge>
              </StoryRow>
              <StoryRow justify="between">
                <span className="text-sm">Zone B · Rack 03</span>
                <Badge emphasis="soft" tone="warning">
                  42 on hand
                </Badge>
              </StoryRow>
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <PanelShell title="Movement history">
            <StoryStack gap="xs">
              <KeyValueRow label="Last receipt" value="Jun 18, 2026 · +500" />
              <KeyValueRow label="Last issue" value="Jun 20, 2026 · −20" />
              <KeyValueRow label="Reorder point" value="100 EA" />
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const ApprovalQueue: Story = {
  name: "ERP — Approval Queue",
  parameters: { layout: "padded" },
  render: () => (
    <ResizableFrame width="xl">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={42} minSize={30}>
          <PanelShell title="Awaiting approval">
            <StoryStack gap="sm">
              {APPROVAL_QUEUE.map(({ id, title, amount, priority }) => (
                <StoryRow justify="between" key={id}>
                  <StoryStack gap="xs">
                    <span className="font-mono text-sm">{id}</span>
                    <span className="text-muted-foreground text-xs">
                      {title}
                    </span>
                  </StoryStack>
                  <StoryStack gap="xs">
                    <Badge
                      emphasis="soft"
                      tone={
                        priority === "High"
                          ? "danger"
                          : priority === "Medium"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {priority}
                    </Badge>
                    <span className="text-right text-sm tabular-nums">
                      {formatCurrency(amount)}
                    </span>
                  </StoryStack>
                </StoryRow>
              ))}
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={58}>
          <PanelShell title="PO-1042 · Workflow">
            <StoryStack gap="sm">
              <StoryRow align="center" gap="sm">
                <Building2Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                <span className="font-medium text-sm">FastCo Industrial</span>
              </StoryRow>
              <KeyValueRow label="Step" value="VP Finance review" />
              <KeyValueRow label="SLA" value="Due in 4 hours" />
              <StoryRow gap="sm" wrap>
                <Button emphasis="solid" intent="primary" size="sm">
                  Approve
                </Button>
                <Button emphasis="outline" intent="secondary" size="sm">
                  Request changes
                </Button>
              </StoryRow>
            </StoryStack>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Keyboard & Focus",
  parameters: {
    docs: {
      description: {
        story:
          "Separators are keyboard-focusable. Users can resize with arrow keys when the handle is focused. Prefer `withHandle` for visible affordance in dense ERP layouts.",
      },
    },
  },
  render: () => (
    <ResizableFrame>
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel defaultSize={50}>
          <PanelShell title="Focus the handle">
            <span className="text-muted-foreground text-sm">
              Tab to the resize handle, then use arrow keys to adjust panel
              sizes.
            </span>
          </PanelShell>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <PanelShell title="Accessible split">
            <span className="text-muted-foreground text-sm">
              Visible grip (`withHandle`) improves discoverability for keyboard
              and pointer users.
            </span>
          </PanelShell>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizableFrame>
  ),
};
