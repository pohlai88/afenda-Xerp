import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GOVERNED_STATES } from "@afenda/ui/governance";
import {
  ActivityIcon,
  Building2Icon,
  CreditCardIcon,
  FileTextIcon,
  HistoryIcon,
  LayoutGridIcon,
  ListIcon,
  LockIcon,
  PackageIcon,
  SettingsIcon,
  ShieldIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack, StoryCaption } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import { Separator } from "./separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

// ─── Shared data ─────────────────────────────────────────────────────────────

const PO_LINE_ITEMS = [
  { line: 1, desc: "Industrial fasteners", qty: 500, unit: 12 },
  { line: 2, desc: "Safety gloves", qty: 200, unit: 9 },
  { line: 3, desc: "Packing tape (rolls)", qty: 80, unit: 4.5 },
] as const;

const AUDIT_EVENTS = [
  {
    actor: "Jane Doe",
    action: "Submitted for approval",
    time: "Jun 21, 2026 · 09:14",
    tone: "info" as const,
  },
  {
    actor: "Michael Chen",
    action: "Approved — Department Head",
    time: "Jun 21, 2026 · 11:42",
    tone: "success" as const,
  },
  {
    actor: "System",
    action: "Vendor quote attached",
    time: "Jun 20, 2026 · 16:08",
    tone: "neutral" as const,
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

function DefinitionRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <StoryRow justify="between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </StoryRow>
  );
}

function MetadataGrid({
  items,
}: {
  readonly items: readonly (readonly [string, string])[];
}) {
  return (
    <StoryRow gap="lg" wrap>
      {items.map(([label, value]) => (
        <StoryStack className="min-w-36 flex-1" gap="xs" key={label}>
          <span className="text-muted-foreground text-xs">{label}</span>
          <span className="font-medium text-sm">{value}</span>
        </StoryStack>
      ))}
    </StoryRow>
  );
}

function TabPlaceholder({ children }: { readonly children: string }) {
  return (
    <StoryStack paddingY="md">
      <span className="text-muted-foreground text-sm">{children}</span>
    </StoryStack>
  );
}

function ControlledTabsComponent() {
  const [tab, setTab] = useState("summary");

  return (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <StoryRow justify="between">
          <span className="text-muted-foreground text-sm">
            Active tab: <span className="font-mono">{tab}</span>
          </span>
          <Button
            emphasis="outline"
            intent="secondary"
            onClick={() => setTab("approvals")}
            size="sm"
          >
            Jump to approvals
          </Button>
        </StoryRow>
        <Tabs onValueChange={setTab} value={tab}>
          <TabsList variant="line">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="line-items">Line items</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="summary">
            <TabPlaceholder>INV-2026-0042 summary panel</TabPlaceholder>
          </TabsContent>
          <TabsContent value="line-items">
            <TabPlaceholder>12 line items on this invoice</TabPlaceholder>
          </TabsContent>
          <TabsContent value="approvals">
            <TabPlaceholder>Pending manager approval</TabPlaceholder>
          </TabsContent>
        </Tabs>
      </StoryStack>
    </StoryFrame>
  );
}

function TabsStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryRow align="center" gap="md">
      <StoryCaption>{state}</StoryCaption>
      <StoryFrame width="md">
        <Tabs defaultValue="overview" state={state}>
          <TabsList aria-label={`Tabs state ${state}`}>
            <TabsTrigger value="overview">Overview ({state})</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <TabPlaceholder>Panel for {state}</TabPlaceholder>
          </TabsContent>
        </Tabs>
      </StoryFrame>
    </StoryRow>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI Tabs for ERP record detail views, module settings, and view switching. `TabsList` supports `default` (pill) and `line` (underline) variants. Pair triggers with `Badge` for counts; use `disabled` for permission-gated sections.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      table: { defaultValue: { summary: "horizontal" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
  args: {
    orientation: "horizontal",
    state: "ready",
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground & governance probes ──────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <StoryFrame width="lg">
      <Tabs {...args} defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <TabPlaceholder>Overview content</TabPlaceholder>
        </TabsContent>
        <TabsContent value="details">
          <TabPlaceholder>Details content</TabPlaceholder>
        </TabsContent>
        <TabsContent value="history">
          <TabPlaceholder>History content</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` on root, list, trigger, and content — governed attributes must win. Canonical `orientation` and `state` win over consumer `data-orientation` / `data-state`.',
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <Tabs
        data-orientation="vertical"
        data-slot="override"
        data-state="fake"
        defaultValue="summary"
        orientation="horizontal"
        state="ready"
      >
        <TabsList
          aria-label="Invoice sections"
          data-component="Override"
          data-slot="override"
          data-variant="line"
          variant="default"
        >
          <TabsTrigger data-slot="override" value="summary">
            Summary
          </TabsTrigger>
          <TabsTrigger data-slot="override" value="attachments">
            Attachments
          </TabsTrigger>
        </TabsList>
        <TabsContent data-slot="override" value="summary">
          <TabPlaceholder>Governed summary panel</TabPlaceholder>
        </TabsContent>
        <TabsContent data-slot="override" value="attachments">
          <TabPlaceholder>Governed attachments panel</TabPlaceholder>
        </TabsContent>
      </Tabs>
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
          "Reference map of emitted `data-slot` values. Internal roles: root → tabs, header → tabs-list, control → tabs-trigger, content → tabs-content. slotKey map: list-default / list-line → tabs-list.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → tabs · header → tabs-list · control → tabs-trigger · content →
          tabs-content · list-default / list-line → tabs-list
        </p>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Slot map probe">
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <TabPlaceholder>tabs-content slot</TabPlaceholder>
          </TabsContent>
        </Tabs>
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
        <TabsStateProbe key={state} state={state} />
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
          "Triggers are keyboard-focusable with roving tabindex. Pair icon-only labels with visible text or `aria-label`. Badge counts should remain in tab text for screen readers.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <Tabs defaultValue="summary">
        <TabsList variant="line">
          <TabsTrigger value="summary">Invoice summary</TabsTrigger>
          <TabsTrigger value="attachments">
            Attachments
            <Badge emphasis="soft" size="sm" tone="neutral">
              3
            </Badge>
          </TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="summary">
          <TabPlaceholder>
            Accessible tab panel for INV-2026-0042
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="attachments">
          <TabPlaceholder>Three PDF attachments listed</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

// ─── Basic variants ────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="lg">
      <Tabs {...args} defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <TabPlaceholder>Overview content</TabPlaceholder>
        </TabsContent>
        <TabsContent value="details">
          <TabPlaceholder>Details content</TabPlaceholder>
        </TabsContent>
        <TabsContent value="history">
          <TabPlaceholder>History content</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const LineVariant: Story = {
  name: "Tabs — Line Variant",
  render: (args) => (
    <StoryFrame width="lg">
      <Tabs {...args} defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="overview">
          <TabPlaceholder>Overview content</TabPlaceholder>
        </TabsContent>
        <TabsContent value="details">
          <TabPlaceholder>Details content</TabPlaceholder>
        </TabsContent>
        <TabsContent value="history">
          <TabPlaceholder>History content</TabPlaceholder>
        </TabsContent>
        <TabsContent value="audit">
          <TabPlaceholder>Audit log content</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const DisabledTab: Story = {
  name: "Tabs — With Disabled Tab",
  render: (args) => (
    <StoryFrame width="lg">
      <Tabs {...args} defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger disabled value="locked">
            <LockIcon aria-hidden="true" className="size-4" />
            Payroll (locked)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <TabPlaceholder>
            Overview available — payroll tab requires HR Admin role.
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="details">
          <TabPlaceholder>Details available</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const VerticalOrientation: Story = {
  name: "Tabs — Vertical Settings Nav",
  render: () => (
    <StoryFrame width="xl">
      <Tabs defaultValue="general" orientation="vertical">
        <TabsList aria-label="Settings sections">
          <TabsTrigger value="general">
            <SettingsIcon aria-hidden="true" className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="users">
            <UserIcon aria-hidden="true" className="size-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldIcon aria-hidden="true" className="size-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCardIcon aria-hidden="true" className="size-4" />
            Billing
          </TabsTrigger>
        </TabsList>
        <StoryStack className="flex-1" gap="sm">
          <TabsContent value="general">
            <TabPlaceholder>Company name, locale, and timezone</TabPlaceholder>
          </TabsContent>
          <TabsContent value="users">
            <TabPlaceholder>User roster and role assignments</TabPlaceholder>
          </TabsContent>
          <TabsContent value="security">
            <TabPlaceholder>MFA policies and session timeout</TabPlaceholder>
          </TabsContent>
          <TabsContent value="billing">
            <TabPlaceholder>Subscription and payment methods</TabPlaceholder>
          </TabsContent>
        </StoryStack>
      </Tabs>
    </StoryFrame>
  ),
};

export const BothVariants: Story = {
  name: "Matrix — Default vs Line Variant",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      {(["default", "line"] as const).map((variant) => (
        <StoryStack gap="xs" key={variant}>
          <span className="font-mono text-muted-foreground text-xs">
            variant=&quot;{variant}&quot;
          </span>
          <Tabs defaultValue="a">
            <TabsList variant={variant}>
              <TabsTrigger value="a">Overview</TabsTrigger>
              <TabsTrigger value="b">Details</TabsTrigger>
              <TabsTrigger value="c">History</TabsTrigger>
            </TabsList>
            <TabsContent value="a">
              <TabPlaceholder>Content A</TabPlaceholder>
            </TabsContent>
            <TabsContent value="b">
              <TabPlaceholder>Content B</TabPlaceholder>
            </TabsContent>
            <TabsContent value="c">
              <TabPlaceholder>Content C</TabPlaceholder>
            </TabsContent>
          </Tabs>
        </StoryStack>
      ))}
    </StoryStack>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const EmployeeRecord: Story = {
  name: "ERP — Employee Record Tabs",
  parameters: { layout: "padded" },
  render: (args) => (
    <StoryFrame width="xl">
      <Tabs {...args} defaultValue="info">
        <TabsList variant="line">
          <TabsTrigger value="info">
            <UserIcon aria-hidden="true" className="size-4" />
            Personal info
          </TabsTrigger>
          <TabsTrigger value="employment">
            <FileTextIcon aria-hidden="true" className="size-4" />
            Employment
          </TabsTrigger>
          <TabsTrigger value="activity">
            <ActivityIcon aria-hidden="true" className="size-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="access">
            <ShieldIcon aria-hidden="true" className="size-4" />
            Access
          </TabsTrigger>
          <TabsTrigger value="history">
            <HistoryIcon aria-hidden="true" className="size-4" />
            Change history
          </TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="info">
          <StoryStack gap="md" paddingY="md">
            <MetadataGrid
              items={[
                ["Full name", "Jane Doe"],
                ["Employee ID", "EMP-00142"],
                ["Email", "jane.doe@company.com"],
                ["Phone", "+65 9123 4567"],
                ["Department", "Engineering"],
                ["Location", "Singapore"],
              ]}
            />
            <StoryRow justify="end">
              <Button emphasis="outline" intent="secondary" size="sm">
                Edit profile
              </Button>
            </StoryRow>
          </StoryStack>
        </TabsContent>
        <TabsContent value="employment">
          <StoryStack gap="sm" paddingY="md">
            <MetadataGrid
              items={[
                ["Job title", "Senior software engineer"],
                ["Manager", "Alex Brown"],
                ["Start date", "Mar 12, 2024"],
                ["Cost center", "210 — Engineering"],
              ]}
            />
          </StoryStack>
        </TabsContent>
        <TabsContent value="activity">
          <TabPlaceholder>
            Recent tasks, approvals, and login events
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="access">
          <TabPlaceholder>
            Module permissions and role assignments
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="history">
          <TabPlaceholder>Audit trail of HR record changes</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const InvoiceRecordTabs: Story = {
  name: "ERP — Invoice Record Tabs",
  parameters: { layout: "padded" },
  render: (args) => (
    <StoryFrame width="xl">
      <Tabs {...args} defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="line-items">
            Line items
            <Badge emphasis="soft" size="sm" tone="neutral">
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approvals">
            Approvals
            <Badge emphasis="soft" size="sm" tone="warning">
              Pending
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="attachments">
            Attachments
            <Badge emphasis="soft" size="sm" tone="neutral">
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <StoryStack gap="md" paddingY="md">
            <MetadataGrid
              items={[
                ["Invoice no.", "INV-2026-0042"],
                ["Vendor", "Acme Software Ltd."],
                ["Status", "Pending approval"],
                ["Amount", "$4,850.00 USD"],
                ["Issue date", "Jun 21, 2026"],
                ["Due date", "Jul 15, 2026"],
              ]}
            />
            <StoryRow gap="sm" justify="end">
              <Button emphasis="outline" intent="secondary" size="sm">
                Record payment
              </Button>
              <Button emphasis="solid" intent="primary" size="sm">
                Approve
              </Button>
            </StoryRow>
          </StoryStack>
        </TabsContent>
        <TabsContent value="line-items">
          <StoryStack gap="sm" paddingY="md">
            <Table size="sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <span className="block text-right">Qty</span>
                  </TableHead>
                  <TableHead>
                    <span className="block text-right">Unit</span>
                  </TableHead>
                  <TableHead>
                    <span className="block text-right">Total</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PO_LINE_ITEMS.map((row) => (
                  <TableRow key={row.line}>
                    <TableCell>{row.desc}</TableCell>
                    <TableCell>
                      <span className="block text-right tabular-nums">
                        {row.qty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="block text-right tabular-nums">
                        {formatCurrency(row.unit)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="block text-right tabular-nums">
                        {formatCurrency(row.qty * row.unit)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StoryStack>
        </TabsContent>
        <TabsContent value="approvals">
          <TabPlaceholder>
            Workflow stages, approvers, and timestamps
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="attachments">
          <TabPlaceholder>
            PDF invoice, vendor W-9, remittance advice
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="comments">
          <TabPlaceholder>Reviewer thread and finance notes</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const PurchaseOrderRecord: Story = {
  name: "ERP — Purchase Order Record Tabs",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Tabs defaultValue="header">
        <TabsList variant="line">
          <TabsTrigger value="header">
            <PackageIcon aria-hidden="true" className="size-4" />
            Header
          </TabsTrigger>
          <TabsTrigger value="lines">
            Line items
            <Badge emphasis="soft" size="sm" tone="neutral">
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="receiving">
            <TruckIcon aria-hidden="true" className="size-4" />
            Receiving
          </TabsTrigger>
          <TabsTrigger value="history">
            <HistoryIcon aria-hidden="true" className="size-4" />
            History
          </TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="header">
          <StoryStack gap="sm" paddingY="md">
            <MetadataGrid
              items={[
                ["PO number", "PO-2026-1184"],
                ["Vendor", "Acme Supplies"],
                ["Total", formatCurrency(12_400)],
                ["Need by", "Jul 1, 2026"],
              ]}
            />
          </StoryStack>
        </TabsContent>
        <TabsContent value="lines">
          <TabPlaceholder>
            Industrial fasteners, safety gloves, packing tape
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="receiving">
          <TabPlaceholder>ASN status and warehouse receipts</TabPlaceholder>
        </TabsContent>
        <TabsContent value="history">
          <TabPlaceholder>Approval and vendor communication log</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const VendorRecord: Story = {
  name: "ERP — Vendor Record Tabs",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Tabs defaultValue="profile">
        <TabsList variant="line">
          <TabsTrigger value="profile">
            <Building2Icon aria-hidden="true" className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="invoices">
            Open invoices
            <Badge emphasis="soft" size="sm" tone="warning">
              4
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <ShieldIcon aria-hidden="true" className="size-4" />
            Compliance
          </TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="profile">
          <StoryStack gap="sm" paddingY="md">
            <MetadataGrid
              items={[
                ["Legal name", "Acme Supplies Ltd."],
                ["Tax ID", "12-3456789"],
                ["Payment terms", "Net 30"],
                ["Primary contact", "Sarah Miller"],
              ]}
            />
          </StoryStack>
        </TabsContent>
        <TabsContent value="contracts">
          <TabPlaceholder>MSA, rate cards, and renewal dates</TabPlaceholder>
        </TabsContent>
        <TabsContent value="invoices">
          <TabPlaceholder>
            Four open AP invoices totaling $42,800
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="compliance">
          <TabPlaceholder>
            W-9, insurance certificates, SOC reports
          </TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const ApprovalPipelineTabs: Story = {
  name: "ERP — Approval Pipeline Tabs",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            <Badge emphasis="soft" size="sm" tone="warning">
              18
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge emphasis="soft" size="sm" tone="success">
              42
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge emphasis="soft" size="sm" tone="danger">
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <TabPlaceholder>18 records awaiting your approval</TabPlaceholder>
        </TabsContent>
        <TabsContent value="approved">
          <TabPlaceholder>
            Approved this quarter — filterable list
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="rejected">
          <TabPlaceholder>Rejected with reviewer comments</TabPlaceholder>
        </TabsContent>
        <TabsContent value="all">
          <TabPlaceholder>Full approval history across modules</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const FinancialReportsTabs: Story = {
  name: "ERP — Financial Reports Tabs",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Tabs defaultValue="pnl">
        <TabsList variant="line">
          <TabsTrigger value="pnl">Profit &amp; loss</TabsTrigger>
          <TabsTrigger value="balance">Balance sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash flow</TabsTrigger>
          <TabsTrigger value="budget">Budget vs actual</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="pnl">
          <StoryStack gap="sm" paddingY="md">
            <DefinitionRow
              label="Revenue Q2"
              value={formatCurrency(1_284_000)}
            />
            <DefinitionRow
              label="Expenses Q2"
              value={formatCurrency(942_000)}
            />
            <DefinitionRow label="Net income" value={formatCurrency(342_000)} />
          </StoryStack>
        </TabsContent>
        <TabsContent value="balance">
          <TabPlaceholder>
            Assets, liabilities, and equity snapshot
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="cashflow">
          <TabPlaceholder>
            Operating, investing, and financing flows
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="budget">
          <TabPlaceholder>
            Variance by cost center and department
          </TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const AuditLogTab: Story = {
  name: "ERP — Audit Log Tab Content",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Tabs defaultValue="audit">
        <TabsList variant="line">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="audit">
            Audit log
            <Badge emphasis="soft" size="sm" tone="neutral">
              24
            </Badge>
          </TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="summary">
          <TabPlaceholder>PO-2026-1184 header details</TabPlaceholder>
        </TabsContent>
        <TabsContent value="audit">
          <StoryStack gap="md" paddingY="md">
            {AUDIT_EVENTS.map((event) => (
              <StoryStack gap="xs" key={event.time}>
                <StoryRow justify="between">
                  <span className="font-medium text-sm">{event.actor}</span>
                  <span className="text-muted-foreground text-xs">
                    {event.time}
                  </span>
                </StoryRow>
                <StoryRow align="center" gap="sm">
                  <Badge emphasis="soft" size="sm" tone={event.tone}>
                    {event.action}
                  </Badge>
                </StoryRow>
              </StoryStack>
            ))}
          </StoryStack>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const ViewToggleTabs: Story = {
  name: "ERP — View Toggle (List / Grid)",
  parameters: { layout: "padded" },
  render: (args) => (
    <Tabs {...args} defaultValue="list">
      <TabsList>
        <TabsTrigger value="list">
          <ListIcon aria-hidden="true" className="size-4" />
          List
        </TabsTrigger>
        <TabsTrigger value="grid">
          <LayoutGridIcon aria-hidden="true" className="size-4" />
          Grid
        </TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <TabPlaceholder>248 employees in dense table view</TabPlaceholder>
      </TabsContent>
      <TabsContent value="grid">
        <TabPlaceholder>
          Card grid with avatar and department chips
        </TabPlaceholder>
      </TabsContent>
    </Tabs>
  ),
};

export const SettingsTabs: Story = {
  name: "ERP — Settings Module Tabs",
  parameters: { layout: "padded" },
  render: (args) => (
    <StoryFrame width="xl">
      <Tabs {...args} defaultValue="general" orientation="horizontal">
        <TabsList variant="line">
          <TabsTrigger value="general">
            <SettingsIcon aria-hidden="true" className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="users">
            <UserIcon aria-hidden="true" className="size-4" />
            Users &amp; roles
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldIcon aria-hidden="true" className="size-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing">
            <FileTextIcon aria-hidden="true" className="size-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="general">
          <TabPlaceholder>
            Company name, locale, fiscal year start
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="users">
          <TabPlaceholder>User management and team structure</TabPlaceholder>
        </TabsContent>
        <TabsContent value="security">
          <TabPlaceholder>
            Authentication, 2FA, and session policies
          </TabPlaceholder>
        </TabsContent>
        <TabsContent value="billing">
          <TabPlaceholder>Subscription plan and payment history</TabPlaceholder>
        </TabsContent>
        <TabsContent value="integrations">
          <TabPlaceholder>Bank feeds, ERP connectors, API keys</TabPlaceholder>
        </TabsContent>
        <TabsContent value="audit">
          <TabPlaceholder>System-wide compliance audit trail</TabPlaceholder>
        </TabsContent>
      </Tabs>
    </StoryFrame>
  ),
};

export const RecordHeaderWithActions: Story = {
  name: "ERP — Record Header With Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between" wrap>
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              INV-2026-0042
            </span>
            <span className="font-semibold text-lg">Acme Supplies Ltd.</span>
          </StoryStack>
          <StoryRow gap="sm">
            <Button emphasis="outline" intent="secondary" size="sm">
              Export PDF
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              Approve
            </Button>
          </StoryRow>
        </StoryRow>
        <Tabs defaultValue="summary">
          <TabsList variant="line">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="summary">
            <MetadataGrid
              items={[
                ["Balance due", formatCurrency(24_850)],
                ["Due date", "Jul 15, 2026"],
                ["Cost center", "210 — Manufacturing"],
              ]}
            />
          </TabsContent>
          <TabsContent value="payments">
            <TabPlaceholder>Payment history and remittance</TabPlaceholder>
          </TabsContent>
          <TabsContent value="history">
            <TabPlaceholder>Status changes and audit events</TabPlaceholder>
          </TabsContent>
        </Tabs>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ControlledTabs: Story = {
  name: "ERP — Controlled Tabs (Interactive)",
  parameters: { layout: "padded" },
  render: () => <ControlledTabsComponent />,
};

export const TabsVsAccordion: Story = {
  name: "ERP — Tabs vs Accordion",
  parameters: {
    docs: {
      description: {
        story:
          "Tabs: parallel sections on record detail (summary, lines, audit). Accordion: progressive disclosure in filters and FAQs (see Primitives/Accordion).",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Tabs — record detail sections
          </span>
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">Summary</TabsTrigger>
              <TabsTrigger value="b">Line items</TabsTrigger>
            </TabsList>
            <TabsContent value="a">
              <TabPlaceholder>Always one panel visible</TabPlaceholder>
            </TabsContent>
          </Tabs>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Accordion — collapsible filters
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Accordion for filter panels and FAQ patterns
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const TabsVsToggle: Story = {
  name: "ERP — Tabs vs Toggle",
  parameters: {
    docs: {
      description: {
        story:
          "Tabs: distinct content panels (record sections). Toggle / ToggleGroup: transient view modes and toolbar states (see Primitives/Toggle).",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Tabs — section navigation</span>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">Open</TabsTrigger>
              <TabsTrigger value="grid">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Toggle — list/grid switcher
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Toggle → View Mode Switcher
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
