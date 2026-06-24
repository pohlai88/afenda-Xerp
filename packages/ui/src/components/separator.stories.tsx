import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2Icon,
  CreditCardIcon,
  FileTextIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import {
  ACTIVITY_FEED,
  formatCurrency,
  KeyValueRow,
  SectionLabel,
} from "./_storybook/separator-story.compositions";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Label } from "./label";
import { Separator } from "./separator";

// ─── Separator ─────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed visual divider for ERP forms, settings panels, record detail layouts, and toolbar clusters. Supports `orientation` (horizontal | vertical) and `decorative` for accessibility semantics.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="text-sm">Section above</span>
        <Separator />
        <span className="text-sm">Section below</span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const Vertical: Story = {
  name: "Separator — Vertical",
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="start" gap="md" paddingY="md">
        <StoryStack className="flex-1" gap="xs">
          <span className="font-medium text-sm">Finance</span>
          <span className="text-muted-foreground text-xs">
            12 open invoices
          </span>
        </StoryStack>
        <Separator orientation="vertical" />
        <StoryStack className="flex-1" gap="xs">
          <span className="font-medium text-sm">Procurement</span>
          <span className="text-muted-foreground text-xs">4 pending POs</span>
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          "Consumer `data-*` props cannot override governed Separator root attributes.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="text-sm">Section above</span>
        <Separator
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          data-state="fake"
          state="ready"
        />
        <span className="text-sm">Section below</span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {GOVERNED_STATES.map((state) => (
          <StoryRow align="start" gap="md" key={state}>
            <StoryCaption width="sm">{state}</StoryCaption>
            <StoryStack className="min-w-0 flex-1" gap="sm">
              <span className="text-sm">Line item subtotal</span>
              <Separator state={state} />
              <span className="text-sm">Tax and total</span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Default `decorative={true}` for visual-only dividers. Set `decorative={false}` when the separator conveys meaningful structure between regions.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="sm">
          <SectionLabel>Decorative (default)</SectionLabel>
          <StoryStack gap="sm">
            <span className="text-sm">Profile fields</span>
            <Separator decorative />
            <span className="text-sm">Notification toggles</span>
          </StoryStack>
        </StoryStack>
        <StoryStack gap="sm">
          <SectionLabel>Semantic divider</SectionLabel>
          <StoryStack gap="sm">
            <span className="text-sm">Accounts payable</span>
            <Separator decorative={false} />
            <span className="text-sm">Accounts receivable</span>
          </StoryStack>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const FormSectionDivider: Story = {
  name: "ERP — Form Section Divider",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="sm">
          <SectionLabel>Employee details</SectionLabel>
          <StoryStack gap="xs">
            <Label htmlFor="sep-name">Full name</Label>
            <span className="text-sm">Jane Doe</span>
          </StoryStack>
        </StoryStack>
        <Separator />
        <StoryStack gap="sm">
          <SectionLabel>Work assignment</SectionLabel>
          <StoryStack gap="xs">
            <Label htmlFor="sep-dept">Department</Label>
            <span className="text-sm">Finance</span>
          </StoryStack>
        </StoryStack>
        <Separator />
        <StoryStack gap="sm">
          <SectionLabel>Compensation</SectionLabel>
          <span className="text-muted-foreground text-sm">
            Restricted — visible to HR admins only
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SettingsPanelSections: Story = {
  name: "ERP — Settings Panel Sections",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack
        className="rounded-md border border-border"
        gap="md"
        padding="md"
      >
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">Profile</span>
          <KeyValueRow label="Display name" value="Jane Doe" />
          <KeyValueRow label="Email" value="jane.doe@company.com" />
        </StoryStack>
        <Separator />
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">Notifications</span>
          <KeyValueRow label="Email alerts" value="Enabled" />
          <KeyValueRow label="Approval reminders" value="Enabled" />
        </StoryStack>
        <Separator />
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">Security</span>
          <KeyValueRow label="Two-factor auth" value="Required for Finance" />
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InvoiceSummarySections: Story = {
  name: "ERP — Invoice Summary Sections",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>INV-2026-0042</CardTitle>
          <CardDescription>Acme Supplies Ltd.</CardDescription>
        </CardHeader>
        <CardContent>
          <StoryStack gap="sm">
            <KeyValueRow
              label="Invoice amount"
              value={formatCurrency(24_850)}
            />
            <KeyValueRow label="Amount paid" value={formatCurrency(0)} />
            <Separator />
            <StoryRow justify="between">
              <span className="font-medium text-sm">Balance due</span>
              <span className="font-semibold">{formatCurrency(24_850)}</span>
            </StoryRow>
            <Separator />
            <StoryRow gap="sm">
              <Button emphasis="solid" intent="primary" size="sm">
                <CreditCardIcon />
                Record payment
              </Button>
              <Button emphasis="outline" intent="secondary" size="sm">
                <FileTextIcon />
                Download PDF
              </Button>
            </StoryRow>
          </StoryStack>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const RecordDetailColumns: Story = {
  name: "ERP — Record Detail Columns",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="start" gap="lg" paddingY="sm">
        <StoryStack className="flex-1" gap="sm">
          <StoryRow align="center" gap="sm">
            <Building2Icon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-medium text-sm">Vendor</span>
          </StoryRow>
          <KeyValueRow label="Legal name" value="Acme Supplies Ltd." />
          <KeyValueRow label="Tax ID" value="12-3456789" />
        </StoryStack>
        <Separator orientation="vertical" />
        <StoryStack className="flex-1" gap="sm">
          <StoryRow align="center" gap="sm">
            <PackageIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-medium text-sm">Purchase order</span>
          </StoryRow>
          <KeyValueRow label="PO number" value="PO-2026-1184" />
          <KeyValueRow label="Status" value="Awaiting payment" />
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const FilterToolbarClusters: Story = {
  name: "ERP — Filter Toolbar Clusters",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" gap="md" wrap>
        <StoryRow gap="sm" wrap>
          <Badge emphasis="soft" tone="info">
            Status: Active
          </Badge>
          <Badge emphasis="soft" tone="warning">
            Overdue
          </Badge>
        </StoryRow>
        <div className="hidden h-8 sm:block">
          <Separator orientation="vertical" />
        </div>
        <StoryRow gap="sm" wrap>
          <Badge emphasis="outline">Department: Finance</Badge>
          <Badge emphasis="outline">Assigned: Me</Badge>
        </StoryRow>
        <div className="hidden h-8 sm:block">
          <Separator orientation="vertical" />
        </div>
        <Button emphasis="ghost" intent="secondary" size="sm">
          Clear filters
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ActivityFeedDividers: Story = {
  name: "ERP — Activity Feed Dividers",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {ACTIVITY_FEED.map(({ actor, action, time }, index) => (
          <StoryStack gap="sm" key={action}>
            <StoryStack gap="xs">
              <StoryRow justify="between">
                <span className="font-medium text-sm">{actor}</span>
                <span className="text-muted-foreground text-xs">{time}</span>
              </StoryRow>
              <span className="text-muted-foreground text-sm">{action}</span>
            </StoryStack>
            {index < ACTIVITY_FEED.length - 1 ? <Separator /> : null}
          </StoryStack>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const DataTableSectionHeader: Story = {
  name: "ERP — Data Table Section Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack
        className="overflow-hidden rounded-md border border-border"
        gap="xs"
      >
        <StoryRow
          className="border-border border-b bg-muted/30 font-medium text-muted-foreground text-xs"
          gap="lg"
          paddingX="lg"
          paddingY="sm"
        >
          <span className="flex-1">Employee</span>
          <span className="w-28">Department</span>
          <span className="w-24">Status</span>
        </StoryRow>
        <StoryStack gap="xs" paddingX="lg" paddingY="sm">
          <SectionLabel>Active employees</SectionLabel>
        </StoryStack>
        <Separator />
        <StoryRow gap="lg" paddingX="lg" paddingY="sm">
          <span className="flex-1 text-sm">Jane Doe</span>
          <span className="w-28 text-sm">Finance</span>
          <span className="w-24 text-sm">Active</span>
        </StoryRow>
        <StoryRow gap="lg" paddingX="lg" paddingY="sm">
          <span className="flex-1 text-sm">Alex Brown</span>
          <span className="w-28 text-sm">Operations</span>
          <span className="w-24 text-sm">Active</span>
        </StoryRow>
        <Separator />
        <StoryStack gap="xs" paddingX="lg" paddingY="sm">
          <SectionLabel>On leave</SectionLabel>
        </StoryStack>
        <StoryRow gap="lg" paddingX="lg" paddingY="sm">
          <span className="flex-1 text-sm">Sam Chen</span>
          <span className="w-28 text-sm">HR</span>
          <span className="w-24 text-sm">On leave</span>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const MenuStyleListGroups: Story = {
  name: "ERP — Menu-Style List Groups",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack
        className="rounded-md border border-border"
        gap="xs"
        padding="xs"
      >
        <Button emphasis="ghost" intent="quiet" size="sm">
          <UserIcon />
          View profile
        </Button>
        <Button emphasis="ghost" intent="quiet" size="sm">
          <FileTextIcon />
          Activity log
        </Button>
        <Separator />
        <Button emphasis="ghost" intent="quiet" size="sm">
          <Building2Icon />
          Switch organization
        </Button>
        <Separator />
        <Button emphasis="soft" intent="destructive" size="sm">
          Log out
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const WizardStepContent: Story = {
  name: "ERP — Wizard Step Content",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Step 2 — Vendor details</span>
          <span className="text-muted-foreground text-xs">
            PO-2026-1184 onboarding
          </span>
        </StoryStack>
        <KeyValueRow label="Legal name" value="Acme Supplies Ltd." />
        <KeyValueRow label="Payment terms" value="Net 30" />
        <Separator />
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Banking (required)</span>
          <span className="text-muted-foreground text-sm">
            Upload voided check or bank letter
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const CardSectionDividers: Story = {
  name: "ERP — Card Section Dividers",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>Expense report</CardTitle>
          <CardDescription>EXP-2026-042 · Q2 travel</CardDescription>
        </CardHeader>
        <CardContent>
          <StoryStack gap="sm">
            <KeyValueRow label="Submitted by" value="Alex Brown" />
            <KeyValueRow label="Amount" value={formatCurrency(1240)} />
            <Separator />
            <KeyValueRow label="Policy" value="Requires manager" />
            <KeyValueRow label="Cost center" value="210 — Manufacturing" />
          </StoryStack>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const PoLineSubtotalBlock: Story = {
  name: "ERP — PO Line Subtotal Block",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="sm">
        <KeyValueRow label="Line subtotal" value={formatCurrency(7800)} />
        <KeyValueRow label="Freight" value={formatCurrency(960)} />
        <KeyValueRow label="Tax" value={formatCurrency(0)} />
        <Separator />
        <StoryRow justify="between">
          <span className="font-medium text-sm">PO total</span>
          <span className="font-semibold tabular-nums">
            {formatCurrency(8760)}
          </span>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const VerticalToolbarSplit: Story = {
  name: "ERP — Vertical Toolbar Split",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="sm">
        <Button emphasis="outline" intent="secondary" size="sm">
          Export
        </Button>
        <Button emphasis="outline" intent="secondary" size="sm">
          Import
        </Button>
        <div className="h-8">
          <Separator orientation="vertical" />
        </div>
        <Button intent="primary" size="sm">
          New record
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const SeparatorVsBorder: Story = {
  name: "ERP — Separator vs Border",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Use `Separator` inside flex/stack layouts for rhythm between content blocks. Use container `border` for card and panel chrome.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Separator — in-flow divider
          </span>
          <StoryStack gap="sm">
            <span className="text-sm">Totals section</span>
            <Separator />
            <span className="text-sm">Actions section</span>
          </StoryStack>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Border — panel chrome</span>
          <StoryStack
            className="rounded-md border border-border"
            gap="sm"
            padding="md"
          >
            <span className="text-sm">Panel content with outer border</span>
          </StoryStack>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const OrientationMatrix: Story = {
  name: "Governance — Orientations",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      <StoryFrame width="md">
        <StoryRow align="start" gap="md">
          <StoryCaption width="sm">horizontal</StoryCaption>
          <StoryStack className="min-w-0 flex-1" gap="sm" paddingY="sm">
            <span className="text-sm">Above</span>
            <Separator />
            <span className="text-sm">Below</span>
          </StoryStack>
        </StoryRow>
      </StoryFrame>
      <StoryFrame width="md">
        <StoryRow align="start" gap="md">
          <StoryCaption width="sm">vertical</StoryCaption>
          <StoryRow
            align="start"
            className="min-w-0 flex-1"
            gap="md"
            paddingY="md"
          >
            <span className="text-sm">Left column</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right column</span>
          </StoryRow>
        </StoryRow>
      </StoryFrame>
    </StoryStack>
  ),
};
