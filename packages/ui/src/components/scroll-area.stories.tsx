import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BellIcon,
  Building2Icon,
  CreditCardIcon,
  FileTextIcon,
  HistoryIcon,
  PackageIcon,
  PaperclipIcon,
  UserIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

// ─── Shared data ─────────────────────────────────────────────────────────────

const RELEASE_TAGS = Array.from(
  { length: 50 },
  (_, index) => `v1.2.0-beta.${50 - index}`
);

const MODULE_LINKS = [
  { id: "finance", label: "Finance", icon: CreditCardIcon, count: 12 },
  { id: "procurement", label: "Procurement", icon: PackageIcon, count: 5 },
  { id: "inventory", label: "Inventory", icon: Building2Icon, count: 8 },
  { id: "hr", label: "Human resources", icon: UserIcon, count: 3 },
  { id: "reports", label: "Reports", icon: FileTextIcon, count: 21 },
] as const;

const AUDIT_EVENTS = [
  {
    id: "evt-1",
    actor: "Jane Doe",
    action: "Submitted PO-1042 for approval",
    timestamp: "Jun 21, 2026 · 09:14",
  },
  {
    id: "evt-2",
    actor: "Michael Chen",
    action: "Approved — Department Head",
    timestamp: "Jun 21, 2026 · 11:42",
  },
  {
    id: "evt-3",
    actor: "Finance Bot",
    action: "Routed to VP Finance review",
    timestamp: "Jun 21, 2026 · 11:43",
  },
  {
    id: "evt-4",
    actor: "Alex Brown",
    action: "Attached vendor quote PDF",
    timestamp: "Jun 20, 2026 · 16:08",
  },
  {
    id: "evt-5",
    actor: "System",
    action: "Updated freight terms on PO-1042",
    timestamp: "Jun 20, 2026 · 14:22",
  },
  {
    id: "evt-6",
    actor: "Jane Doe",
    action: "Created PO-1042 draft",
    timestamp: "Jun 19, 2026 · 10:05",
  },
] as const;

const NOTIFICATIONS = [
  {
    id: "n-1",
    title: "Invoice INV-2048 approved",
    body: "Finance controller signed off.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n-2",
    title: "PO-1042 awaiting your review",
    body: "FastCo Industrial · $12,450",
    time: "18m ago",
    unread: true,
  },
  {
    id: "n-3",
    title: "Stock alert — SKU-4412",
    body: "Below reorder point in Zone A.",
    time: "1h ago",
    unread: false,
  },
  {
    id: "n-4",
    title: "Payroll batch posted",
    body: "June 2026 cycle completed.",
    time: "3h ago",
    unread: false,
  },
  {
    id: "n-5",
    title: "New vendor registration",
    body: "Globex Ltd pending verification.",
    time: "Yesterday",
    unread: false,
  },
] as const;

const INVOICE_RECORDS = [
  { id: "INV-001", customer: "Acme Corp", amount: 4850, status: "Paid" },
  { id: "INV-002", customer: "Globex Ltd", amount: 1200, status: "Pending" },
  { id: "INV-003", customer: "Initech", amount: 8750, status: "Overdue" },
  { id: "INV-004", customer: "Umbrella Co", amount: 3200, status: "Draft" },
  {
    id: "INV-005",
    customer: "Stark Industries",
    amount: 15_600,
    status: "Paid",
  },
  {
    id: "INV-006",
    customer: "Wayne Enterprises",
    amount: 9200,
    status: "Pending",
  },
] as const;

const FILTER_CHIPS = [
  "All",
  "Active",
  "Pending",
  "Overdue",
  "Draft",
  "Finance",
  "Operations",
  "Q2 2026",
  "My records",
  "High value",
] as const;

const PO_LINE_ITEMS = [
  { line: 1, sku: "SKU-4412", desc: "Industrial fasteners", qty: 500 },
  { line: 2, sku: "SKU-8820", desc: "Stainless bolts M8", qty: 200 },
  { line: 3, sku: "SKU-1190", desc: "Safety gloves — bulk", qty: 50 },
  { line: 4, sku: "SKU-3301", desc: "Packing tape rolls", qty: 120 },
  { line: 5, sku: "SKU-7744", desc: "Steel shelving unit", qty: 4 },
  { line: 6, sku: "SKU-9920", desc: "Forklift battery", qty: 1 },
] as const;

const WAREHOUSE_BINS = [
  { id: "bin-a12", sku: "SKU-4412", qty: 480, location: "Zone A · Rack 12" },
  { id: "bin-b03", sku: "SKU-8820", qty: 175, location: "Zone B · Rack 03" },
  { id: "bin-c07", sku: "SKU-1190", qty: 42, location: "Zone C · Rack 07" },
  { id: "bin-d11", sku: "SKU-3301", qty: 890, location: "Zone D · Rack 11" },
  { id: "bin-e02", sku: "SKU-7744", qty: 12, location: "Zone E · Rack 02" },
] as const;

const TEAM_MEMBERS = [
  {
    id: "emp-142",
    name: "Jane Doe",
    role: "Finance controller",
    dept: "Finance",
  },
  {
    id: "emp-208",
    name: "Michael Chen",
    role: "Ops manager",
    dept: "Operations",
  },
  {
    id: "emp-311",
    name: "Alex Brown",
    role: "Procurement lead",
    dept: "Procurement",
  },
  { id: "emp-415", name: "Sam Rivera", role: "HR specialist", dept: "HR" },
  {
    id: "emp-502",
    name: "Taylor Kim",
    role: "Inventory clerk",
    dept: "Inventory",
  },
] as const;

const TRANSACTIONS = [
  { id: "txn-901", desc: "Payment — Acme Corp", amount: -4850, date: "Jun 21" },
  { id: "txn-902", desc: "Receipt — Globex Ltd", amount: 1200, date: "Jun 20" },
  {
    id: "txn-903",
    desc: "Journal — Accrued freight",
    amount: -320,
    date: "Jun 20",
  },
  { id: "txn-904", desc: "Payment — Initech", amount: -8750, date: "Jun 19" },
  {
    id: "txn-905",
    desc: "Deposit — Stark Industries",
    amount: 15_600,
    date: "Jun 18",
  },
] as const;

const ATTACHMENTS = [
  { id: "att-1", name: "vendor-quote.pdf", size: "248 KB" },
  { id: "att-2", name: "packing-list.xlsx", size: "42 KB" },
  { id: "att-3", name: "inspection-photo.jpg", size: "1.2 MB" },
  { id: "att-4", name: "signed-po.pdf", size: "186 KB" },
] as const;

const KPI_METRICS = [
  { label: "Open receivables", value: "$128,400", delta: "+4.2%" },
  { label: "Outstanding payables", value: "$84,200", delta: "-1.8%" },
  { label: "Cash on hand", value: "$256,000", delta: "+0.6%" },
  { label: "POs awaiting approval", value: "14", delta: "+3" },
  { label: "Overdue invoices", value: "6", delta: "-2" },
  { label: "Stock alerts", value: "9", delta: "+1" },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

function ScrollAreaShell({
  children,
  height = "h-72",
  width = "w-full",
  state,
  frameWidth = "sm",
}: {
  readonly children: ReactNode;
  readonly height?: "h-48" | "h-64" | "h-72" | "h-80" | "h-96";
  readonly width?: "w-full" | "w-48" | "max-w-md";
  readonly state?: (typeof GOVERNED_STATES)[number];
  readonly frameWidth?: "sm" | "md" | "lg";
}) {
  return (
    <StoryFrame width={frameWidth}>
      <ScrollArea
        className={`${height} ${width} rounded-md border border-border`}
        {...(state ? { state } : {})}
      >
        {children}
      </ScrollArea>
    </StoryFrame>
  );
}

function SectionTitle({ children }: { readonly children: string }) {
  return <span className="font-medium text-sm leading-none">{children}</span>;
}

function MutedCaption({ children }: { readonly children: string }) {
  return <span className="text-muted-foreground text-xs">{children}</span>;
}

// ─── ScrollArea ──────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix ScrollArea for ERP overflow surfaces — sidebar navigation, audit logs, notification feeds, record pickers, and constrained panel bodies. Prefer ScrollArea over raw `overflow-auto` when custom scrollbars must match the design system.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ScrollAreaShell width="w-48">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Release tags</SectionTitle>
        {RELEASE_TAGS.map((tag) => (
          <StoryStack gap="sm" key={tag}>
            <span className="text-sm">{tag}</span>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const FixedHeight: Story = {
  name: "ScrollArea — Fixed Height",
  render: () => (
    <ScrollAreaShell height="h-64">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Scrollable content</SectionTitle>
        {Array.from({ length: 24 }, (_, index) => (
          <span className="text-sm" key={`row-${index}`}>
            Row {index + 1} — sample register entry
          </span>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const WithSeparators: Story = {
  name: "ScrollArea — With Separators",
  render: () => (
    <ScrollAreaShell>
      <StoryStack gap="md" padding="md">
        <SectionTitle>Version history</SectionTitle>
        {RELEASE_TAGS.slice(0, 20).map((tag) => (
          <StoryStack gap="sm" key={tag}>
            <StoryRow justify="between">
              <span className="text-sm">{tag}</span>
              <MutedCaption>Deployed</MutedCaption>
            </StoryRow>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const CompactHeight: Story = {
  name: "ScrollArea — Compact Height",
  render: () => (
    <ScrollAreaShell height="h-48" width="max-w-md">
      <StoryStack gap="xs" padding="sm">
        {INVOICE_RECORDS.map(({ id, customer }) => (
          <StoryRow justify="between" key={id}>
            <span className="font-mono text-xs">{id}</span>
            <span className="text-muted-foreground text-xs">{customer}</span>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const HorizontalContent: Story = {
  name: "ScrollArea — Horizontal Content",
  parameters: {
    docs: {
      description: {
        story:
          "Wide inline content scrolls within the viewport. The governed root mounts a vertical scrollbar by default; horizontal overflow uses native viewport scrolling.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <ScrollArea className="w-full rounded-md border border-border">
        <StoryRow className="w-max" gap="sm" padding="sm">
          {FILTER_CHIPS.map((chip) => (
            <Badge emphasis="soft" key={chip} tone="neutral">
              {chip}
            </Badge>
          ))}
        </StoryRow>
      </ScrollArea>
    </StoryFrame>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — States",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {GOVERNED_STATES.map((state) => (
          <StoryStack gap="xs" key={state}>
            <MutedCaption>{state}</MutedCaption>
            <ScrollArea
              className="h-32 w-full rounded-md border border-border"
              state={state}
            >
              <StoryStack gap="xs" padding="sm">
                {Array.from({ length: 8 }, (_, index) => (
                  <span className="text-sm" key={`${state}-${index}`}>
                    {state} row {index + 1}
                  </span>
                ))}
              </StoryStack>
            </ScrollArea>
          </StoryStack>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP usage ───────────────────────────────────────────────────────────────

export const SidebarNavigation: Story = {
  name: "ERP — Sidebar Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="sm" height="h-96" width="w-48">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Modules</SectionTitle>
        {MODULE_LINKS.map(({ id, label, icon: Icon, count }) => (
          <StoryRow justify="between" key={id}>
            <StoryRow gap="sm">
              <Icon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm">{label}</span>
            </StoryRow>
            <Badge emphasis="soft" tone="neutral">
              {count}
            </Badge>
          </StoryRow>
        ))}
        {MODULE_LINKS.map(({ id, label, icon: Icon }) => (
          <StoryRow gap="sm" key={`extra-${id}`}>
            <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {label} archive
            </span>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const AuditEventLog: Story = {
  name: "ERP — Audit Event Log",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-80">
      <StoryStack gap="md" padding="md">
        <StoryRow align="center" gap="sm">
          <HistoryIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <SectionTitle>PO-1042 audit trail</SectionTitle>
        </StoryRow>
        {AUDIT_EVENTS.map(({ id, actor, action, timestamp }) => (
          <StoryStack gap="xs" key={id}>
            <StoryRow justify="between">
              <span className="font-medium text-sm">{actor}</span>
              <MutedCaption>{timestamp}</MutedCaption>
            </StoryRow>
            <span className="text-sm">{action}</span>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const ActivityFeed: Story = {
  name: "ERP — Activity Feed",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="md" padding="md">
        <SectionTitle>Comments · PO-1042</SectionTitle>
        {AUDIT_EVENTS.slice(0, 4).map(({ id, actor, action, timestamp }) => (
          <StoryRow align="start" gap="sm" key={id}>
            <Avatar size="sm">
              <AvatarFallback>
                {actor
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <StoryRow gap="sm">
                <span className="font-medium text-sm">{actor}</span>
                <MutedCaption>{timestamp}</MutedCaption>
              </StoryRow>
              <span className="text-sm">{action}</span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const NotificationList: Story = {
  name: "ERP — Notification List",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-80">
      <StoryStack gap="sm" padding="md">
        <StoryRow align="center" gap="sm">
          <BellIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <SectionTitle>Notifications</SectionTitle>
        </StoryRow>
        {NOTIFICATIONS.map(({ id, title, body, time, unread }) => (
          <StoryStack gap="xs" key={id}>
            <StoryRow justify="between">
              <span className="font-medium text-sm">{title}</span>
              {unread ? (
                <Badge emphasis="solid" tone="info">
                  New
                </Badge>
              ) : null}
            </StoryRow>
            <span className="text-muted-foreground text-sm">{body}</span>
            <MutedCaption>{time}</MutedCaption>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const RecordPickerList: Story = {
  name: "ERP — Record Picker List",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="xs" padding="sm">
        <SectionTitle>Select invoice</SectionTitle>
        {INVOICE_RECORDS.map(({ id, customer, amount, status }) => (
          <StoryRow justify="between" key={id}>
            <StoryStack gap="xs">
              <span className="font-mono text-sm">{id}</span>
              <MutedCaption>{customer}</MutedCaption>
            </StoryStack>
            <StoryStack gap="xs">
              <Badge
                emphasis="soft"
                tone={
                  status === "Overdue"
                    ? "danger"
                    : status === "Pending"
                      ? "warning"
                      : "neutral"
                }
              >
                {status}
              </Badge>
              <span className="text-right text-sm tabular-nums">
                {formatCurrency(amount)}
              </span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const FilterChipRail: Story = {
  name: "ERP — Filter Chip Rail",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <SectionTitle>Register filters</SectionTitle>
        <ScrollArea className="w-full rounded-md border border-border">
          <StoryRow className="w-max" gap="sm" padding="sm">
            {FILTER_CHIPS.map((chip) => (
              <Badge emphasis="outline" key={chip} tone="neutral">
                {chip}
              </Badge>
            ))}
          </StoryRow>
        </ScrollArea>
      </StoryStack>
    </StoryFrame>
  ),
};

export const POLineItemsPanel: Story = {
  name: "ERP — PO Line Items Panel",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-64">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>PO-1042 lines</SectionTitle>
        {PO_LINE_ITEMS.map(({ line, sku, desc, qty }) => (
          <StoryStack gap="xs" key={line}>
            <StoryRow justify="between">
              <span className="font-mono text-xs">{sku}</span>
              <span className="text-muted-foreground text-xs">Line {line}</span>
            </StoryRow>
            <StoryRow justify="between">
              <span className="text-sm">{desc}</span>
              <span className="text-sm tabular-nums">Qty {qty}</span>
            </StoryRow>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const ApprovalQueueInbox: Story = {
  name: "ERP — Approval Queue Inbox",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Awaiting approval</SectionTitle>
        {INVOICE_RECORDS.map(({ id, customer, amount, status }) => (
          <StoryStack gap="xs" key={id}>
            <StoryRow justify="between">
              <span className="font-mono text-sm">{id}</span>
              <Badge emphasis="soft" tone="warning">
                {status}
              </Badge>
            </StoryRow>
            <StoryRow justify="between">
              <span className="text-muted-foreground text-sm">{customer}</span>
              <span className="font-medium text-sm tabular-nums">
                {formatCurrency(amount)}
              </span>
            </StoryRow>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const WarehouseBinList: Story = {
  name: "ERP — Warehouse Bin List",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-72">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Bin locations</SectionTitle>
        {WAREHOUSE_BINS.map(({ id, sku, qty, location }) => (
          <StoryRow justify="between" key={id}>
            <StoryStack gap="xs">
              <span className="font-mono text-xs">{sku}</span>
              <MutedCaption>{location}</MutedCaption>
            </StoryStack>
            <Badge emphasis="soft" tone={qty < 50 ? "warning" : "success"}>
              {qty} on hand
            </Badge>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const SettingsMenu: Story = {
  name: "ERP — Settings Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="sm" height="h-80" width="w-48">
      <StoryStack gap="xs" padding="md">
        <SectionTitle>Settings</SectionTitle>
        {[
          "Organization profile",
          "Users & roles",
          "Approval workflows",
          "Integrations",
          "API keys",
          "Webhooks",
          "Notifications",
          "Billing",
          "Audit retention",
          "Data export",
        ].map((item) => (
          <span className="text-sm" key={item}>
            {item}
          </span>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const TransactionHistory: Story = {
  name: "ERP — Transaction History",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Recent transactions</SectionTitle>
        {TRANSACTIONS.map(({ id, desc, amount, date }) => (
          <StoryRow justify="between" key={id}>
            <StoryStack gap="xs">
              <span className="text-sm">{desc}</span>
              <MutedCaption>{id}</MutedCaption>
            </StoryStack>
            <StoryStack gap="xs">
              <span
                className={
                  amount < 0
                    ? "text-destructive text-sm tabular-nums"
                    : "text-sm tabular-nums"
                }
              >
                {amount < 0 ? "−" : "+"}
                {formatCurrency(amount)}
              </span>
              <MutedCaption>{date}</MutedCaption>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const TeamMemberRoster: Story = {
  name: "ERP — Team Member Roster",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="md" padding="md">
        <SectionTitle>Assign to</SectionTitle>
        {TEAM_MEMBERS.map(({ id, name, role, dept }) => (
          <StoryRow align="center" gap="sm" key={id}>
            <Avatar size="sm">
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <span className="font-medium text-sm">{name}</span>
              <MutedCaption>{`${role} · ${dept}`}</MutedCaption>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const DocumentAttachments: Story = {
  name: "ERP — Document Attachments",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-48">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Attachments</SectionTitle>
        {ATTACHMENTS.map(({ id, name, size }) => (
          <StoryRow gap="sm" key={id}>
            <PaperclipIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <StoryStack gap="xs">
              <span className="text-sm">{name}</span>
              <MutedCaption>{size}</MutedCaption>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const KpiMetricsColumn: Story = {
  name: "ERP — KPI Metrics Column",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="sm" height="h-80" width="w-48">
      <StoryStack gap="md" padding="md">
        <SectionTitle>Today</SectionTitle>
        {KPI_METRICS.map(({ label, value, delta }) => (
          <StoryStack gap="xs" key={label}>
            <MutedCaption>{label}</MutedCaption>
            <span className="font-semibold text-lg tabular-nums">{value}</span>
            <span className="text-muted-foreground text-xs">{delta}</span>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Keyboard & Focus",
  parameters: {
    docs: {
      description: {
        story:
          "ScrollArea viewport content remains keyboard-scrollable. Pair with visible headings and list semantics in production sidebars and pickers.",
      },
    },
  },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Keyboard-scrollable list</SectionTitle>
        <span className="text-muted-foreground text-sm">
          Tab into the panel and use arrow keys or Page Up/Down when focus is
          inside the scrollable region.
        </span>
        {Array.from({ length: 16 }, (_, index) => (
          <span className="text-sm" key={`a11y-${index}`}>
            Focusable row {index + 1}
          </span>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};
