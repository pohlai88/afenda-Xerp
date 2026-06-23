import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BellIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FilterIcon,
  HistoryIcon,
  PackageIcon,
  SettingsIcon,
  ShieldIcon,
  TruckIcon,
  UserIcon,
  WebhookIcon,
} from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import {
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Switch } from "./switch";

// ─── Sample data ───────────────────────────────────────────────────────────

const RELATED_ORDERS = [
  { id: "PO-2026-1184", vendor: "FastCo Industrial", total: "$12,450.00" },
  { id: "PO-2026-1172", vendor: "FastCo Industrial", total: "$8,920.00" },
  { id: "PO-2026-1098", vendor: "FastCo Industrial", total: "$3,180.00" },
] as const;

const ORDER_LINE_ITEMS = [
  {
    id: "line-1",
    sku: "SKU-4412",
    description: "Industrial fasteners (×500)",
    qty: 500,
    unit: "$0.42",
  },
  {
    id: "line-2",
    sku: "SKU-8820",
    description: "Stainless steel bolts M8 (×200)",
    qty: 200,
    unit: "$1.15",
  },
  {
    id: "line-3",
    sku: "SKU-1190",
    description: "Safety gloves — bulk pack",
    qty: 50,
    unit: "$8.90",
  },
] as const;

const AUDIT_EVENTS = [
  {
    id: "evt-1",
    actor: "Jane Doe",
    action: "Submitted for approval",
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
    action: "Pending — VP Finance review",
    timestamp: "Awaiting action",
  },
] as const;

const WAREHOUSE_BINS = [
  { id: "bin-a12", sku: "SKU-4412", qty: 480, location: "Zone A · Rack 12" },
  { id: "bin-b03", sku: "SKU-8820", qty: 175, location: "Zone B · Rack 03" },
  { id: "bin-c07", sku: "SKU-1190", qty: 42, location: "Zone C · Rack 07" },
] as const;

const COMMENT_REPLIES = [
  {
    id: "reply-1",
    author: "Alex Brown",
    initials: "AB",
    text: "Vendor confirmed delivery for Thursday.",
    time: "10:32 AM",
  },
  {
    id: "reply-2",
    author: "Jane Doe",
    initials: "JD",
    text: "Updated PO with revised freight terms.",
    time: "11:05 AM",
  },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function ChevronTrigger({
  label,
  open,
  icon: Icon,
  badge,
}: {
  readonly label: string;
  readonly open: boolean;
  readonly icon?: ComponentType<{ className?: string }>;
  readonly badge?: ReactNode;
}) {
  return (
    <StoryRow align="center" justify="between" width="full">
      <StoryRow align="center" gap="sm">
        {Icon ? (
          <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
        ) : null}
        <span>{label}</span>
        {badge}
      </StoryRow>
      <ChevronDownIcon
        aria-hidden="true"
        className={`size-4 shrink-0 motion-reduce:transition-none transition-transform ${open ? "rotate-180" : ""}`}
      />
    </StoryRow>
  );
}

function BorderedPanel({ children }: { readonly children: ReactNode }) {
  return (
    <StoryStack
      className="rounded-md border border-border"
      gap="xs"
      padding="lg"
    >
      {children}
    </StoryStack>
  );
}

function DefinitionRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <StoryRow align="center" justify="between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm tabular-nums">{value}</span>
    </StoryRow>
  );
}

function ControlledCollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <span className="text-muted-foreground text-sm">
            State: {open ? "expanded" : "collapsed"}
          </span>
          <Button
            emphasis="outline"
            intent="secondary"
            onClick={() => setOpen((value) => !value)}
            size="sm"
          >
            Toggle externally
          </Button>
        </StoryRow>
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger label="Controlled section" open={open} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <p className="text-muted-foreground text-sm">
                Parent state drives open/close. Useful for wizard steps, bulk
                actions, and programmatic panel toggles.
              </p>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryStack>
    </StoryFrame>
  );
}

function RelatedOrdersDemo() {
  const [open, setOpen] = useState(false);

  return (
    <StoryFrame width="md">
      <Collapsible onOpenChange={setOpen} open={open}>
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between" paddingX="lg">
            <span className="font-semibold text-sm">
              3 related purchase orders
            </span>
            <CollapsibleTrigger asChild>
              <Button
                aria-expanded={open}
                aria-label="Toggle related orders"
                emphasis="ghost"
                intent="secondary"
                presentation="icon"
                size="sm"
              >
                <ChevronsUpDownIcon aria-hidden="true" className="size-4" />
              </Button>
            </CollapsibleTrigger>
          </StoryRow>
          <StoryStack
            className="rounded-md border border-border font-mono text-sm tabular-nums"
            paddingX="lg"
            paddingY="sm"
          >
            {RELATED_ORDERS[0].id} · {RELATED_ORDERS[0].total}
          </StoryStack>
          <CollapsibleContent>
            <StoryStack gap="sm">
              {RELATED_ORDERS.slice(1).map((order) => (
                <StoryStack
                  className="rounded-md border border-border font-mono text-sm tabular-nums"
                  key={order.id}
                  paddingX="lg"
                  paddingY="sm"
                >
                  {order.id} · {order.total}
                </StoryStack>
              ))}
            </StoryStack>
          </CollapsibleContent>
        </StoryStack>
      </Collapsible>
    </StoryFrame>
  );
}

function AdvancedFiltersDemo() {
  const [open, setOpen] = useState(false);

  return (
    <StoryFrame width="xl">
      <Collapsible onOpenChange={setOpen} open={open}>
        <StoryStack gap="sm">
          <StoryRow
            align="center"
            className="border-border border-b"
            justify="between"
            paddingY="sm"
          >
            <span className="font-medium text-sm tabular-nums">
              Search Results (142)
            </span>
            <CollapsibleTrigger asChild>
              <Button emphasis="ghost" intent="secondary" size="sm">
                <FilterIcon aria-hidden="true" className="size-4" />
                Advanced Filters
                <ChevronDownIcon
                  aria-hidden="true"
                  className={`size-4 motion-reduce:transition-none transition-transform ${open ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
          </StoryRow>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="md">
                <StoryRow gap="sm" wrap>
                  <StoryStack className="min-w-40 flex-1" gap="xs">
                    <Label htmlFor="filter-from">From</Label>
                    <Input id="filter-from" size="sm" type="date" />
                  </StoryStack>
                  <StoryStack className="min-w-40 flex-1" gap="xs">
                    <Label htmlFor="filter-to">To</Label>
                    <Input id="filter-to" size="sm" type="date" />
                  </StoryStack>
                  <StoryStack className="min-w-40 flex-1" gap="xs">
                    <Label>Status</Label>
                    <Select defaultValue="all">
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </StoryStack>
                  <StoryStack className="min-w-40 flex-1" gap="xs">
                    <Label>Department</Label>
                    <Select defaultValue="all">
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="ops">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </StoryStack>
                </StoryRow>
                <StoryRow align="center" gap="md" wrap>
                  <StoryRow align="center" gap="sm">
                    <Checkbox defaultChecked id="filter-overdue" />
                    <Label htmlFor="filter-overdue">Overdue only</Label>
                  </StoryRow>
                  <StoryRow align="center" gap="sm">
                    <Checkbox id="filter-assigned" />
                    <Label htmlFor="filter-assigned">Assigned to me</Label>
                  </StoryRow>
                </StoryRow>
                <StoryRow gap="sm" justify="end">
                  <Button emphasis="ghost" intent="secondary" size="sm">
                    Reset
                  </Button>
                  <Button emphasis="solid" intent="primary" size="sm">
                    Apply Filters
                  </Button>
                </StoryRow>
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </StoryStack>
      </Collapsible>
    </StoryFrame>
  );
}

// ─── Collapsible ───────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI Collapsible for ERP expandable panels: advanced filters, order details, audit entries, settings sections, and inline disclosure. Supports controlled/uncontrolled state, `defaultOpen`, and `disabled`.",
      },
    },
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
      table: { defaultValue: { summary: "ready" } },
    },
  },
  args: {
    state: "ready",
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible {...args} onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger label="Playground section" open={open} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <p className="text-muted-foreground text-sm">
                Toggle with controls or click the trigger. Governed root exposes
                `data-slot=&quot;collapsible&quot;`.
              </p>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const Default: Story = {
  render: () => <RelatedOrdersDemo />,
};

export const Controlled: Story = {
  name: "Collapsible — Controlled",
  render: () => <ControlledCollapsibleDemo />,
};

export const DefaultOpen: Story = {
  name: "Collapsible — Default Open",
  render: () => (
    <StoryFrame width="md">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>
          <StoryRow align="center" justify="between" width="full">
            <StoryRow align="center" gap="sm">
              <SettingsIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              Integration settings
            </StoryRow>
            <ChevronDownIcon aria-hidden="true" className="size-4 rotate-180" />
          </StoryRow>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <BorderedPanel>
            <StoryStack gap="sm">
              <DefinitionRow
                label="Webhook URL"
                value="https://api.example.com/hooks"
              />
              <DefinitionRow
                label="Last sync"
                value="Jun 21, 2026 · 08:00 UTC"
              />
              <DefinitionRow label="Status" value="Connected" />
            </StoryStack>
          </BorderedPanel>
        </CollapsibleContent>
      </Collapsible>
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  name: "Collapsible — Disabled",
  render: () => (
    <StoryFrame width="md">
      <Collapsible disabled>
        <CollapsibleTrigger>
          <StoryRow align="center" justify="between" width="full">
            <span>Locked section</span>
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </StoryRow>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <BorderedPanel>
            <p className="text-muted-foreground text-sm">
              Content unavailable until record is approved.
            </p>
          </BorderedPanel>
        </CollapsibleContent>
      </Collapsible>
    </StoryFrame>
  ),
};

// ─── Governance probes ─────────────────────────────────────────────────────

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` and `data-state="fake"` — governed attributes must win on root, trigger, and content.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Collapsible
        data-slot="override"
        data-state="fake"
        data-testid="governance-collapsible-root"
        defaultOpen
        state="ready"
      >
        <CollapsibleTrigger data-slot="override">
          Section header
        </CollapsibleTrigger>
        <CollapsibleContent data-slot="override">
          <BorderedPanel>
            <p className="text-muted-foreground text-sm">
              Inspect root (`data-slot=&quot;collapsible&quot;`), trigger
              (`collapsible-trigger`), and content (`collapsible-content`).
            </p>
          </BorderedPanel>
        </CollapsibleContent>
      </Collapsible>
    </StoryFrame>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Reference map of emitted `data-slot` values from `primitive-registry.ts`. Internal roles `control` and `content` emit `collapsible-trigger` and `collapsible-content`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → collapsible · control → collapsible-trigger · content →
          collapsible-content
        </p>
        <Collapsible defaultOpen>
          <CollapsibleTrigger data-testid="slot-trigger">
            Inspect slot attributes
          </CollapsibleTrigger>
          <CollapsibleContent data-testid="slot-content">
            Open DevTools and verify `data-component`, `data-recipe`, and
            `data-slot` on each part.
          </CollapsibleContent>
        </Collapsible>
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
        <StoryFrame key={state} width="md">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <Collapsible defaultOpen state={state}>
            <CollapsibleTrigger>Governed collapsible probe</CollapsibleTrigger>
            <CollapsibleContent>
              Content panel for state probe — {state}
            </CollapsibleContent>
          </Collapsible>
        </StoryFrame>
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
          "Trigger is a native `button` with `aria-expanded`. Disabled collapsibles cannot expand. Verify keyboard activation (Enter/Space) and focus-visible ring on trigger.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Expanded section</CollapsibleTrigger>
          <CollapsibleContent>
            Trigger exposes `aria-expanded=&quot;true&quot;` when open.
          </CollapsibleContent>
        </Collapsible>
        <Collapsible>
          <CollapsibleTrigger>Collapsed section</CollapsibleTrigger>
          <CollapsibleContent>
            Trigger exposes `aria-expanded=&quot;false&quot;` when closed.
          </CollapsibleContent>
        </Collapsible>
        <Collapsible disabled>
          <CollapsibleTrigger>Disabled section</CollapsibleTrigger>
          <CollapsibleContent>Content unavailable while disabled.</CollapsibleContent>
        </Collapsible>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const AdvancedOptions: Story = {
  name: "ERP — Advanced Options",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger label="Advanced Options" open={open} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <p className="text-muted-foreground text-sm">
                Custom field mappings, integration webhooks, and debug mode
                settings for power users and administrators.
              </p>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const AdvancedFilters: Story = {
  name: "ERP — Advanced Filters",
  parameters: { layout: "padded" },
  render: () => <AdvancedFiltersDemo />,
};

export const OrderLineItems: Story = {
  name: "ERP — Order Line Items",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="lg">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              badge={
                <Badge emphasis="soft" size="sm" tone="neutral">
                  {ORDER_LINE_ITEMS.length}
                </Badge>
              }
              icon={ClipboardListIcon}
              label="Line Items — PO-2026-1184"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <StoryStack className="overflow-hidden rounded-md border border-border text-sm">
              <StoryRow
                className="border-border border-b bg-muted/30 font-medium text-muted-foreground text-xs"
                gap="lg"
                paddingX="lg"
                paddingY="sm"
              >
                <span className="flex-1">Description</span>
                <span className="w-16 text-right">Qty</span>
                <span className="w-20 text-right">Unit</span>
              </StoryRow>
              {ORDER_LINE_ITEMS.map((line) => (
                <StoryRow
                  className="border-border border-b last:border-0"
                  gap="lg"
                  key={line.id}
                  paddingX="lg"
                  paddingY="sm"
                >
                  <StoryStack className="flex-1" gap="xs">
                    <span>{line.description}</span>
                    <span className="text-muted-foreground text-xs">
                      {line.sku}
                    </span>
                  </StoryStack>
                  <span className="w-16 text-right text-muted-foreground tabular-nums">
                    {line.qty}
                  </span>
                  <span className="w-20 text-right font-medium tabular-nums">
                    {line.unit}
                  </span>
                </StoryRow>
              ))}
            </StoryStack>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const AuditTrailEntry: Story = {
  name: "ERP — Audit Trail Entry",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              icon={HistoryIcon}
              label="Approval workflow — 3 events"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="sm">
                {AUDIT_EVENTS.map((event) => (
                  <StoryStack gap="xs" key={event.id}>
                    <StoryRow align="center" justify="between">
                      <span className="font-medium text-sm">{event.actor}</span>
                      <span className="text-muted-foreground text-xs">
                        {event.timestamp}
                      </span>
                    </StoryRow>
                    <span className="text-muted-foreground text-sm">
                      {event.action}
                    </span>
                    <Separator />
                  </StoryStack>
                ))}
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const ShippingTracking: Story = {
  name: "ERP — Shipping & Tracking",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              badge={
                <Badge emphasis="soft" size="sm" tone="info">
                  In Transit
                </Badge>
              }
              icon={TruckIcon}
              label="Shipment SHP-8842"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="sm">
                <DefinitionRow label="Carrier" value="FedEx Freight" />
                <DefinitionRow label="Tracking No." value="7849 1234 5678" />
                <DefinitionRow label="ETA" value="Jun 24, 2026" />
                <DefinitionRow
                  label="Destination"
                  value="Warehouse B · Dock 3"
                />
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const PaymentTermsDetail: Story = {
  name: "ERP — Payment Terms",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              icon={CreditCardIcon}
              label="Payment terms — Net 30"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="sm">
                <DefinitionRow label="Terms" value="Net 30" />
                <DefinitionRow label="Due Date" value="Jul 21, 2026" />
                <DefinitionRow
                  label="Early Pay Discount"
                  value="2% if paid within 10 days"
                />
                <DefinitionRow label="Late Fee" value="1.5% per month" />
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const EmployeeEmergencyContact: Story = {
  name: "ERP — Emergency Contact",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              icon={UserIcon}
              label="Emergency contact"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="sm">
                <DefinitionRow label="Name" value="Sarah Chen" />
                <DefinitionRow label="Relationship" value="Spouse" />
                <DefinitionRow label="Phone" value="+1 (555) 234-8901" />
                <DefinitionRow label="Email" value="s.chen@example.com" />
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const WarehouseBinInventory: Story = {
  name: "ERP — Warehouse Bin Inventory",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="lg">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              badge={
                <Badge emphasis="soft" size="sm" tone="warning">
                  3 bins
                </Badge>
              }
              icon={PackageIcon}
              label="Stock by location"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <StoryStack className="overflow-hidden rounded-md border border-border text-sm">
              {WAREHOUSE_BINS.map((bin) => (
                <StoryRow
                  align="center"
                  className="border-border border-b last:border-0"
                  justify="between"
                  key={bin.id}
                  paddingX="lg"
                  paddingY="sm"
                >
                  <StoryStack gap="xs">
                    <span className="font-medium">{bin.location}</span>
                    <span className="text-muted-foreground text-xs">
                      {bin.sku}
                    </span>
                  </StoryStack>
                  <Badge emphasis="soft" size="sm" tone="neutral">
                    {bin.qty} units
                  </Badge>
                </StoryRow>
              ))}
            </StoryStack>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const IntegrationWebhooks: Story = {
  name: "ERP — Integration Webhooks",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              icon={WebhookIcon}
              label="Outbound webhooks"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="md">
                <StoryRow align="center" justify="between">
                  <StoryStack gap="xs">
                    <span className="font-medium text-sm">PO Approved</span>
                    <span className="text-muted-foreground text-xs">
                      POST https://hooks.example.com/po-approved
                    </span>
                  </StoryStack>
                  <Switch defaultChecked id="webhook-po" />
                </StoryRow>
                <StoryRow align="center" justify="between">
                  <StoryStack gap="xs">
                    <span className="font-medium text-sm">Invoice Posted</span>
                    <span className="text-muted-foreground text-xs">
                      POST https://hooks.example.com/invoice-posted
                    </span>
                  </StoryStack>
                  <Switch id="webhook-inv" />
                </StoryRow>
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const CommentReplies: Story = {
  name: "ERP — Comment Replies",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <StoryStack gap="sm">
          <StoryStack gap="xs">
            <StoryRow align="center" justify="between">
              <span className="font-medium text-sm">Maria Kim</span>
              <span className="text-muted-foreground text-xs">9:48 AM</span>
            </StoryRow>
            <p className="text-muted-foreground text-sm">
              Please confirm freight terms before final approval.
            </p>
          </StoryStack>
          <Collapsible onOpenChange={setOpen} open={open}>
            <CollapsibleTrigger asChild>
              <Button emphasis="ghost" intent="secondary" size="sm">
                {open ? "Hide" : "Show"} {COMMENT_REPLIES.length} replies
                <ChevronDownIcon
                  aria-hidden="true"
                  className={`size-4 motion-reduce:transition-none transition-transform ${open ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <StoryStack
                className="border-border border-l"
                gap="sm"
                paddingX="lg"
              >
                {COMMENT_REPLIES.map((reply) => (
                  <StoryStack gap="xs" key={reply.id}>
                    <StoryRow align="center" justify="between">
                      <span className="font-medium text-sm">
                        {reply.author}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {reply.time}
                      </span>
                    </StoryRow>
                    <span className="text-muted-foreground text-sm">
                      {reply.text}
                    </span>
                  </StoryStack>
                ))}
              </StoryStack>
            </CollapsibleContent>
          </Collapsible>
        </StoryStack>
      </StoryFrame>
    );
  },
};

export const TaxBreakdown: Story = {
  name: "ERP — Tax Breakdown",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger label="Tax breakdown — $412.50" open={open} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="sm">
                <DefinitionRow label="Subtotal" value="$8,250.00" />
                <DefinitionRow label="State tax (5%)" value="$412.50" />
                <DefinitionRow label="County tax (0%)" value="$0.00" />
                <Separator />
                <DefinitionRow label="Total tax" value="$412.50" />
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const NotificationPreferences: Story = {
  name: "ERP — Notification Preferences",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              icon={BellIcon}
              label="Email notifications"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="md">
                <StoryRow align="center" justify="between">
                  <Label htmlFor="notify-po">Purchase order approvals</Label>
                  <Switch defaultChecked id="notify-po" />
                </StoryRow>
                <StoryRow align="center" justify="between">
                  <Label htmlFor="notify-inv">Invoice due reminders</Label>
                  <Switch defaultChecked id="notify-inv" />
                </StoryRow>
                <StoryRow align="center" justify="between">
                  <Label htmlFor="notify-sys">System maintenance alerts</Label>
                  <Switch id="notify-sys" />
                </StoryRow>
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};

export const AccessRestrictions: Story = {
  name: "ERP — Access Restrictions",
  parameters: { layout: "padded" },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <StoryFrame width="md">
        <Collapsible onOpenChange={setOpen} open={open}>
          <CollapsibleTrigger>
            <ChevronTrigger
              badge={
                <Badge emphasis="soft" size="sm" tone="warning">
                  Restricted
                </Badge>
              }
              icon={ShieldIcon}
              label="Sensitive data access"
              open={open}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BorderedPanel>
              <StoryStack gap="sm">
                <p className="text-muted-foreground text-sm">
                  Payroll and compensation fields require HR Admin role. Request
                  elevated access through your manager or IT support.
                </p>
                <Button emphasis="outline" intent="secondary" size="sm">
                  Request Access
                </Button>
              </StoryStack>
            </BorderedPanel>
          </CollapsibleContent>
        </Collapsible>
      </StoryFrame>
    );
  },
};
