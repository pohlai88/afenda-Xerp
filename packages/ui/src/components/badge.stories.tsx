import {
  DENSITIES,
  GOVERNED_STATES,
  SIZES,
  STATUS_TONES,
  VARIANT_EMPHASES,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertTriangleIcon,
  BanIcon,
  CheckCircle2Icon,
  ClockIcon,
  ShieldAlertIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// ─── Helpers ───────────────────────────────────────────────────────────────

type StatusTone = (typeof STATUS_TONES)[number];

function StatusDot({ tone }: { readonly tone: StatusTone }) {
  const dotClass =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
        ? "bg-warning"
        : tone === "danger" || tone === "forbidden" || tone === "invalid"
          ? "bg-destructive"
          : tone === "info"
            ? "bg-primary"
            : "bg-muted-foreground";

  return (
    <span
      aria-hidden="true"
      className={`size-2 shrink-0 rounded-full ${dotClass}`}
    />
  );
}

function StatusBadge({
  label,
  tone,
  emphasis = "soft",
}: {
  readonly label: string;
  readonly tone: StatusTone;
  readonly emphasis?: (typeof VARIANT_EMPHASES)[number];
}) {
  return (
    <Badge emphasis={emphasis} size="sm" tone={tone}>
      <StoryRow align="center" gap="xs">
        <StatusDot tone={tone} />
        {label}
      </StoryRow>
    </Badge>
  );
}

function IconStatusBadge({
  icon: Icon,
  label,
  tone,
  emphasis = "outline",
}: {
  readonly icon: typeof CheckCircle2Icon;
  readonly label: string;
  readonly tone: StatusTone;
  readonly emphasis?: (typeof VARIANT_EMPHASES)[number];
}) {
  return (
    <Badge emphasis={emphasis} size="sm" tone={tone}>
      <StoryRow align="center" gap="xs">
        <Icon aria-hidden="true" className="size-3" />
        {label}
      </StoryRow>
    </Badge>
  );
}

function DismissibleFilterChips() {
  const [filters, setFilters] = useState([
    "Finance",
    "Q2 2026",
    "Pending approval",
  ]);

  if (filters.length === 0) {
    return (
      <p aria-live="polite" className="text-muted-foreground text-sm italic">
        No active filters — refresh story to reset.
      </p>
    );
  }

  return (
    <StoryRow gap="sm" wrap>
      {filters.map((filter) => (
        <Badge emphasis="outline" key={filter} size="sm" tone="neutral">
          <StoryRow align="center" gap="xs">
            {filter}
            <Button
              aria-label={`Remove ${filter} filter`}
              emphasis="ghost"
              intent="quiet"
              onClick={() =>
                setFilters((current) => current.filter((f) => f !== filter))
              }
              presentation="icon"
              size="sm"
            >
              <XIcon />
            </Button>
          </StoryRow>
        </Badge>
      ))}
    </StoryRow>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed status and label badge for ERP record states, priorities, roles, filters, and workflow stages. Combines `tone`, `emphasis`, `size`, and optional `state`.",
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: [...STATUS_TONES],
    },
    emphasis: {
      control: "select",
      options: [...VARIANT_EMPHASES],
    },
    size: {
      control: "select",
      options: [...SIZES],
    },
    density: {
      control: "select",
      options: [...DENSITIES],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
    tone: "neutral",
    emphasis: "solid",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Single variant playground ─────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Neutral soft badge — default governed tone and emphasis.",
      },
    },
  },
};

export const Success: Story = {
  args: { tone: "success" },
};

export const Warning: Story = {
  args: { tone: "warning" },
};

export const Danger: Story = {
  args: { tone: "danger" },
};

export const Info: Story = {
  args: { tone: "info" },
};

export const Outline: Story = {
  args: { emphasis: "outline" },
};

export const Soft: Story = {
  args: { emphasis: "soft", tone: "info" },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const AsChildLink: Story = {
  name: "Governance — asChild Link",
  parameters: {
    docs: {
      description: {
        story:
          "Badge renders as `<a>` via `asChild` (Radix Slot). Governed tone and emphasis data attributes are applied to the anchor.",
      },
    },
  },
  render: () => (
    <Badge asChild tone="info">
      <a href="/records/pending">3 pending approvals</a>
    </Badge>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          'Consumer passes `data-tone="danger"` and `data-emphasis="ghost"` — governed props (`tone="success"`, `emphasis="solid"`) must win in the DOM.',
      },
    },
  },
  render: () => (
    <Badge
      data-emphasis="ghost"
      data-tone="danger"
      emphasis="solid"
      tone="success"
    >
      Governed Wins
    </Badge>
  ),
};

export const SmallSize: Story = {
  name: "Size — Small",
  args: { size: "sm", tone: "success", children: "Active" },
};

export const LargeSize: Story = {
  name: "Size — Large",
  args: { size: "lg", tone: "info", children: "Enterprise" },
};

// ─── Governance matrices ───────────────────────────────────────────────────

export const AllTones: Story = {
  name: "Matrix — All Tones",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow gap="sm" wrap>
        {STATUS_TONES.map((tone) => (
          <Badge emphasis="soft" key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
      </StoryRow>
    </StoryFrame>
  ),
};

export const AllEmphases: Story = {
  name: "Matrix — All Emphases",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {VARIANT_EMPHASES.map((emphasis) => (
          <StoryRow align="center" gap="md" key={emphasis}>
            <span className="w-16 font-mono text-muted-foreground text-xs">
              {emphasis}
            </span>
            <Badge emphasis={emphasis} tone="info">
              Info
            </Badge>
            <Badge emphasis={emphasis} tone="success">
              Success
            </Badge>
            <Badge emphasis={emphasis} tone="warning">
              Warning
            </Badge>
            <Badge emphasis={emphasis} tone="danger">
              Danger
            </Badge>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const AllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md" wrap>
      {SIZES.map((size) => (
        <StoryStack className="items-center" gap="xs" key={size}>
          <Badge emphasis="soft" size={size} tone="info">
            {size}
          </Badge>
          <span className="text-muted-foreground text-xs">
            size=&quot;{size}&quot;
          </span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

export const AllDensities: Story = {
  name: "Matrix — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md" wrap>
      {DENSITIES.map((density) => (
        <StoryStack className="items-center" gap="xs" key={density}>
          <Badge density={density} emphasis="soft" size="sm" tone="info">
            {density}
          </Badge>
          <span className="font-mono text-muted-foreground text-xs">
            density=&quot;{density}&quot;
          </span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryRow align="center" gap="md" key={state}>
          <span className="w-24 font-mono text-muted-foreground text-xs">
            {state}
          </span>
          <Badge emphasis="soft" size="sm" state={state} tone="neutral">
            Neutral
          </Badge>
          <Badge emphasis="soft" size="sm" state={state} tone="success">
            Success
          </Badge>
          <Badge emphasis="soft" size="sm" state={state} tone="warning">
            Warning
          </Badge>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

// ─── Composed variants (studio-inspired) ───────────────────────────────────

export const WithStatusDot: Story = {
  name: "Badge — With Status Dot",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <StatusBadge label="Online" tone="success" />
      <StatusBadge label="Away" tone="warning" />
      <StatusBadge label="Busy" tone="danger" />
      <StatusBadge label="Offline" tone="neutral" />
    </StoryRow>
  ),
};

export const WithIcon: Story = {
  name: "Badge — With Icon",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <IconStatusBadge
        icon={CheckCircle2Icon}
        label="Approved"
        tone="success"
      />
      <IconStatusBadge icon={ClockIcon} label="Pending" tone="warning" />
      <IconStatusBadge
        icon={AlertTriangleIcon}
        label="At risk"
        tone="warning"
      />
      <IconStatusBadge icon={BanIcon} label="Rejected" tone="danger" />
      <IconStatusBadge
        icon={ShieldAlertIcon}
        label="Restricted"
        tone="forbidden"
      />
    </StoryRow>
  ),
};

export const CountBadge: Story = {
  name: "Badge — Count / Notification",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="lg">
      <StoryStack className="items-center" gap="xs">
        <Badge emphasis="solid" size="sm" tone="danger">
          <span className="tabular-nums">3</span>
        </Badge>
        <span className="text-muted-foreground text-xs">Unread</span>
      </StoryStack>
      <StoryStack className="items-center" gap="xs">
        <Badge emphasis="solid" size="sm" tone="warning">
          <span className="tabular-nums">12</span>
        </Badge>
        <span className="text-muted-foreground text-xs">Pending reviews</span>
      </StoryStack>
      <StoryStack className="items-center" gap="xs">
        <Badge emphasis="outline" size="sm" tone="neutral">
          <span className="tabular-nums">99+</span>
        </Badge>
        <span className="text-muted-foreground text-xs">Overflow count</span>
      </StoryStack>
    </StoryRow>
  ),
};

export const DismissibleFilters: Story = {
  name: "Badge — Dismissible Filter Chips",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">Active filters</span>
        <DismissibleFilterChips />
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const PurchaseOrderStatus: Story = {
  name: "ERP — Purchase Order Status",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <StatusBadge label="Draft" tone="neutral" />
      <StatusBadge label="Pending Approval" tone="warning" />
      <StatusBadge label="Approved" tone="success" />
      <StatusBadge label="Rejected" tone="danger" />
      <StatusBadge label="Cancelled" tone="forbidden" />
    </StoryRow>
  ),
};

export const InvoiceStatus: Story = {
  name: "ERP — Invoice Status",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <IconStatusBadge
        icon={ClockIcon}
        label="Awaiting payment"
        tone="warning"
      />
      <IconStatusBadge icon={CheckCircle2Icon} label="Paid" tone="success" />
      <IconStatusBadge icon={AlertTriangleIcon} label="Overdue" tone="danger" />
      <Badge emphasis="outline" size="sm" tone="info">
        Partial
      </Badge>
      <Badge emphasis="outline" size="sm" tone="forbidden">
        Void
      </Badge>
    </StoryRow>
  ),
};

export const EmployeeStatus: Story = {
  name: "ERP — Employee Status",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <StatusBadge label="Active" tone="success" />
      <StatusBadge label="On Leave" tone="warning" />
      <StatusBadge label="Probation" tone="info" />
      <StatusBadge label="Terminated" tone="danger" />
      <StatusBadge label="Suspended" tone="forbidden" />
    </StoryRow>
  ),
};

export const InventoryStockLevels: Story = {
  name: "ERP — Inventory Stock Levels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {[
          { sku: "SKU-1042", label: "In Stock", tone: "success" as const },
          { sku: "SKU-2088", label: "Low Stock", tone: "warning" as const },
          { sku: "SKU-3310", label: "Out of Stock", tone: "danger" as const },
          { sku: "SKU-0091", label: "Discontinued", tone: "neutral" as const },
        ].map(({ sku, label, tone }) => (
          <StoryRow align="center" justify="between" key={sku}>
            <span className="font-mono text-sm tabular-nums">{sku}</span>
            <StatusBadge label={label} tone={tone} />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const PriorityLabels: Story = {
  name: "ERP — Priority Labels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <Badge emphasis="soft" size="sm" tone="neutral">
        Low
      </Badge>
      <Badge emphasis="soft" size="sm" tone="info">
        Medium
      </Badge>
      <Badge emphasis="soft" size="sm" tone="warning">
        High
      </Badge>
      <Badge emphasis="solid" size="sm" tone="danger">
        Critical
      </Badge>
    </StoryRow>
  ),
};

export const RoleBadges: Story = {
  name: "ERP — Role Badges",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <Badge emphasis="solid" size="sm" tone="danger">
        Admin
      </Badge>
      <Badge emphasis="soft" size="sm" tone="info">
        Editor
      </Badge>
      <Badge emphasis="outline" size="sm" tone="neutral">
        Viewer
      </Badge>
      <Badge emphasis="outline" size="sm" tone="forbidden">
        No Access
      </Badge>
    </StoryRow>
  ),
};

export const ModuleTags: Story = {
  name: "ERP — Module Tags",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {["Finance", "HR", "Procurement", "Operations", "Reports"].map(
        (module) => (
          <Badge emphasis="outline" key={module} size="sm" tone="neutral">
            {module}
          </Badge>
        )
      )}
    </StoryRow>
  ),
};

export const ApprovalWorkflowStages: Story = {
  name: "ERP — Approval Workflow Stages",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="sm" wrap>
        {[
          { label: "Submitted", tone: "info" as const },
          { label: "Dept Review", tone: "warning" as const },
          { label: "Finance Review", tone: "warning" as const },
          { label: "Approved", tone: "success" as const },
        ].map(({ label, tone }, i) => (
          <StoryRow align="center" gap="sm" key={label}>
            {i > 0 && <span className="text-muted-foreground text-xs">→</span>}
            <StatusBadge label={label} tone={tone} />
          </StoryRow>
        ))}
      </StoryRow>
    </StoryFrame>
  ),
};

export const TableStatusColumn: Story = {
  name: "ERP — Table Status Column",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Table size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>Record</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            {
              id: "PO-1042",
              module: "Procurement",
              status: { label: "Pending Approval", tone: "warning" as const },
              priority: { label: "High", tone: "warning" as const },
            },
            {
              id: "INV-0892",
              module: "Finance",
              status: { label: "Paid", tone: "success" as const },
              priority: { label: "Low", tone: "neutral" as const },
            },
            {
              id: "EMP-0042",
              module: "HR",
              status: { label: "On Leave", tone: "warning" as const },
              priority: { label: "Medium", tone: "info" as const },
            },
            {
              id: "TKT-7710",
              module: "Support",
              status: { label: "Overdue", tone: "danger" as const },
              priority: { label: "Critical", tone: "danger" as const },
            },
          ].map(({ id, module, status, priority }) => (
            <TableRow key={id}>
              <TableCell>
                <span className="font-mono text-sm tabular-nums">{id}</span>
              </TableCell>
              <TableCell>{module}</TableCell>
              <TableCell>
                <StatusBadge label={status.label} tone={status.tone} />
              </TableCell>
              <TableCell>
                <Badge emphasis="soft" size="sm" tone={priority.tone}>
                  {priority.label}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const SLAIndicators: Story = {
  name: "ERP — SLA Indicators",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      {[
        {
          ticket: "TKT-4401",
          label: "On track",
          tone: "success" as const,
          due: "Due in 2 days",
        },
        {
          ticket: "TKT-4402",
          label: "At risk",
          tone: "warning" as const,
          due: "Due tomorrow",
        },
        {
          ticket: "TKT-4403",
          label: "Breached",
          tone: "danger" as const,
          due: "Overdue 4 hr",
        },
      ].map(({ ticket, label, tone, due }) => (
        <StoryRow align="center" justify="between" key={ticket}>
          <StoryRow align="center" gap="md">
            <span className="font-mono text-sm tabular-nums">{ticket}</span>
            <StatusBadge label={label} tone={tone} />
          </StoryRow>
          <span className="text-muted-foreground text-xs tabular-nums">
            {due}
          </span>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

export const ComplianceLabels: Story = {
  name: "ERP — Compliance Labels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <IconStatusBadge
        icon={CheckCircle2Icon}
        label="Compliant"
        tone="success"
      />
      <IconStatusBadge
        icon={ClockIcon}
        label="Review required"
        tone="warning"
      />
      <IconStatusBadge
        icon={ShieldAlertIcon}
        label="Non-compliant"
        tone="danger"
      />
      <Badge emphasis="outline" size="sm" tone="invalid">
        Data incomplete
      </Badge>
    </StoryRow>
  ),
};

export const BatchJobStatus: Story = {
  name: "ERP — Batch Job Status",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {[
          { job: "Nightly GL sync", status: "Running", tone: "info" as const },
          {
            job: "Payroll export",
            status: "Completed",
            tone: "success" as const,
          },
          {
            job: "Inventory reconcile",
            status: "Failed",
            tone: "danger" as const,
          },
          { job: "Email digest", status: "Queued", tone: "neutral" as const },
        ].map(({ job, status, tone }) => (
          <StoryRow align="center" justify="between" key={job}>
            <span className="text-sm">{job}</span>
            <StatusBadge label={status} tone={tone} />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const SubscriptionTier: Story = {
  name: "ERP — Subscription Tier",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <Badge emphasis="outline" size="sm" tone="neutral">
        Starter
      </Badge>
      <Badge emphasis="soft" size="sm" tone="info">
        Professional
      </Badge>
      <Badge emphasis="solid" size="lg" tone="success">
        Enterprise
      </Badge>
      <Badge emphasis="outline" size="sm" tone="forbidden">
        Trial expired
      </Badge>
    </StoryRow>
  ),
};

export const RecordDetailHeader: Story = {
  name: "ERP — Record Detail Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm" wrap>
          <span className="font-mono text-muted-foreground text-xs tabular-nums">
            PO-1042
          </span>
          <StatusBadge label="Pending Approval" tone="warning" />
          <Badge emphasis="soft" size="sm" tone="warning">
            High priority
          </Badge>
          <Badge emphasis="outline" size="sm" tone="neutral">
            Procurement
          </Badge>
        </StoryRow>
        <span className="font-semibold text-lg tracking-tight">
          Office supplies — Q2 restock
        </span>
        <span className="text-muted-foreground text-sm">
          Submitted by Jane Doe · Awaiting Alex Brown approval
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PaymentStatus: Story = {
  name: "ERP — Payment Status",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      <IconStatusBadge icon={CheckCircle2Icon} label="Settled" tone="success" />
      <IconStatusBadge icon={ClockIcon} label="Processing" tone="info" />
      <IconStatusBadge icon={AlertTriangleIcon} label="Failed" tone="danger" />
      <Badge emphasis="outline" size="sm" tone="warning">
        Refund pending
      </Badge>
      <Badge emphasis="outline" size="sm" tone="forbidden">
        Chargeback
      </Badge>
    </StoryRow>
  ),
};

export const StatusBridgeTones: Story = {
  name: "Token — Status Bridge Tones",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Success, warning, and info tones now use `--success`, `--warning`, and `--info` bridge utilities (retargeted from accent/chart-3/primary proxies). Toggle Theme to verify dark-mode token values. Solid emphasis fills with the bridge background; soft/outline use alpha variants.",
      },
    },
  },
  render: () => (
    <StoryStack gap="lg">
      <StoryStack gap="sm">
        <span className="font-medium text-foreground text-xs">
          Solid (filled background)
        </span>
        <StoryRow gap="sm" wrap>
          <Badge emphasis="solid" tone="success">
            Success
          </Badge>
          <Badge emphasis="solid" tone="warning">
            Warning
          </Badge>
          <Badge emphasis="solid" tone="info">
            Info
          </Badge>
          <Badge emphasis="solid" tone="danger">
            Danger
          </Badge>
        </StoryRow>
      </StoryStack>
      <StoryStack gap="sm">
        <span className="font-medium text-foreground text-xs">
          Soft (10 % alpha surface)
        </span>
        <StoryRow gap="sm" wrap>
          <Badge emphasis="soft" tone="success">
            Success
          </Badge>
          <Badge emphasis="soft" tone="warning">
            Warning
          </Badge>
          <Badge emphasis="soft" tone="info">
            Info
          </Badge>
          <Badge emphasis="soft" tone="danger">
            Danger
          </Badge>
        </StoryRow>
      </StoryStack>
      <StoryStack gap="sm">
        <span className="font-medium text-foreground text-xs">
          Outline (border only)
        </span>
        <StoryRow gap="sm" wrap>
          <Badge emphasis="outline" tone="success">
            Success
          </Badge>
          <Badge emphasis="outline" tone="warning">
            Warning
          </Badge>
          <Badge emphasis="outline" tone="info">
            Info
          </Badge>
          <Badge emphasis="outline" tone="danger">
            Danger
          </Badge>
        </StoryRow>
      </StoryStack>
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
          "Status badges must pair color with text labels. Dot and icon indicators use `aria-hidden` on decorative elements; meaning is conveyed by badge text.",
      },
    },
  },
  render: () => (
    <StoryStack gap="sm">
      <StatusBadge label="Approved — accessible label" tone="success" />
      <IconStatusBadge
        icon={BanIcon}
        label="Rejected — icon + text"
        tone="danger"
      />
      <Badge
        aria-label="3 pending approvals"
        emphasis="solid"
        size="sm"
        tone="warning"
      >
        <span className="tabular-nums">3</span>
      </Badge>
    </StoryStack>
  ),
};
