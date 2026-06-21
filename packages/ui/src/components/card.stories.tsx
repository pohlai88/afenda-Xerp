import {
  DENSITIES,
  GOVERNED_PANEL_RADII,
  GOVERNED_PANEL_SHADOWS,
  GOVERNED_STATES,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Building2Icon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  InboxIcon,
  MailIcon,
  PackageIcon,
  PhoneIcon,
  PlusIcon,
  SettingsIcon,
  ShieldAlertIcon,
  TruckIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { GOVERNED_CARD_LAYOUT_SIZES } from "../governance/component-props";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";
import { Progress } from "./progress";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

// ─── Sample data ───────────────────────────────────────────────────────────

const TEAM = [
  {
    initials: "JD",
    name: "Jane Doe",
    role: "Finance Manager",
    dept: "Finance",
  },
  {
    initials: "AB",
    name: "Alex Brown",
    role: "Procurement Lead",
    dept: "Operations",
  },
  { initials: "SC", name: "Sam Chen", role: "Department Head", dept: "HR" },
  { initials: "MK", name: "Maria Kim", role: "CFO", dept: "Executive" },
] as const;

const ACTIVITY = [
  {
    id: "a1",
    actor: "Jane Doe",
    initials: "JD",
    action: "Approved purchase order PO-2026-1184",
    time: "2 min ago",
  },
  {
    id: "a2",
    actor: "Alex Brown",
    initials: "AB",
    action: "Added line item — Industrial fasteners (×500)",
    time: "18 min ago",
  },
  {
    id: "a3",
    actor: "Sam Chen",
    initials: "SC",
    action: "Requested budget revision for Q3 procurement",
    time: "1 hr ago",
  },
] as const;

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function DismissibleActionCardComponent() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <p className="text-muted-foreground text-sm italic">
        Card dismissed — refresh story to reset.
      </p>
    );
  }

  return (
    <Card shadow="overlay">
      <CardHeader>
        <CardTitle>Complete your vendor onboarding</CardTitle>
        <CardDescription>
          Upload W-9 and banking details to enable payments for Acme Supplies.
        </CardDescription>
        <CardAction>
          <Button
            aria-label="Dismiss card"
            emphasis="ghost"
            intent="quiet"
            onClick={() => setVisible(false)}
            presentation="icon"
            size="sm"
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <StoryRow gap="sm">
          <Button size="sm">
            <UploadIcon />
            Upload documents
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            Remind me later
          </Button>
        </StoryRow>
      </CardFooter>
    </Card>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed surface container for ERP dashboards, record detail panels, form sections, KPI tiles, and workflow summaries. Supports `density`, `radius`, `shadow`, `size`, and governed `state`. Compose with `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`.",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: [...DENSITIES],
      table: { defaultValue: { summary: "standard" } },
    },
    radius: {
      control: "select",
      options: [...GOVERNED_PANEL_RADII],
      table: { defaultValue: { summary: "md" } },
    },
    shadow: {
      control: "select",
      options: [...GOVERNED_PANEL_SHADOWS],
      table: { defaultValue: { summary: "raised" } },
    },
    size: {
      control: "select",
      options: [...GOVERNED_CARD_LAYOUT_SIZES],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
  args: {
    density: "standard",
    radius: "md",
    shadow: "raised",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic variants ────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
          <CardAction>
            <Button emphasis="outline" size="sm">
              Action
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>Card content goes here.</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const Compact: Story = {
  args: {
    density: "compact",
    size: "sm",
  },
  render: (args) => (
    <StoryFrame width="sm">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Compact card</CardTitle>
          <CardDescription>Reduced density and layout size.</CardDescription>
        </CardHeader>
        <CardContent>
          Compact content area for dense ERP tables and side panels.
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const OverlayShadow: Story = {
  args: {
    shadow: "overlay",
    radius: "lg",
  },
  render: (args) => (
    <StoryFrame width="md">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Overlay shadow</CardTitle>
          <CardDescription>
            Elevated surface for modals, drawers, and spotlight panels.
          </CardDescription>
        </CardHeader>
        <CardContent>Overlay shadow variant.</CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const HeaderWithAction: Story = {
  name: "Card — Header With Action",
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>Open purchase orders</CardTitle>
          <CardDescription>
            12 orders awaiting delivery confirmation
          </CardDescription>
          <CardAction>
            <Button emphasis="outline" size="sm">
              View all
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    </StoryFrame>
  ),
};

export const FooterActions: Story = {
  name: "Card — Footer Actions",
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>Expense report — Q2 2026</CardTitle>
          <CardDescription>
            Submitted by Jane Doe · 14 line items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryStack gap="xs">
            <StoryRow justify="between">
              <span className="text-muted-foreground text-sm">
                Total amount
              </span>
              <span className="font-semibold text-sm">
                {formatCurrency(4820)}
              </span>
            </StoryRow>
            <StoryRow justify="between">
              <span className="text-muted-foreground text-sm">
                Policy compliance
              </span>
              <Badge emphasis="soft" tone="success">
                Within limit
              </Badge>
            </StoryRow>
          </StoryStack>
        </CardContent>
        <CardFooter>
          <StoryRow gap="sm">
            <Button size="sm">Approve</Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              Request changes
            </Button>
            <Button emphasis="ghost" intent="quiet" size="sm">
              Reject
            </Button>
          </StoryRow>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

// ─── Governance probes ─────────────────────────────────────────────────────

export const AllShadows: Story = {
  name: "Matrix — All Shadows",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="md" wrap>
      {GOVERNED_PANEL_SHADOWS.map((shadow) => (
        <StoryFrame key={shadow} width="sm">
          <Card shadow={shadow}>
            <CardHeader>
              <CardTitle>shadow=&quot;{shadow}&quot;</CardTitle>
            </CardHeader>
            <CardContent>Shadow variant for surface elevation.</CardContent>
          </Card>
        </StoryFrame>
      ))}
    </StoryRow>
  ),
};

export const AllDensities: Story = {
  name: "Matrix — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {DENSITIES.map((density) => (
          <Card density={density} key={density}>
            <CardHeader>
              <CardTitle>density=&quot;{density}&quot;</CardTitle>
              <CardDescription>
                Spacing density for compact data grids or comfortable detail
                views.
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const AllRadii: Story = {
  name: "Matrix — All Radii",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="md" wrap>
      {GOVERNED_PANEL_RADII.map((radius) => (
        <StoryFrame key={radius} width="sm">
          <Card radius={radius}>
            <CardHeader>
              <CardTitle>radius=&quot;{radius}&quot;</CardTitle>
            </CardHeader>
            <CardContent>Governed corner radius.</CardContent>
          </Card>
        </StoryFrame>
      ))}
    </StoryRow>
  ),
};

export const AllLayoutSizes: Story = {
  name: "Matrix — Layout Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="md" wrap>
      {GOVERNED_CARD_LAYOUT_SIZES.map((size) => (
        <StoryFrame key={size} width="sm">
          <Card size={size}>
            <CardHeader>
              <CardTitle>size=&quot;{size}&quot;</CardTitle>
            </CardHeader>
            <CardContent>
              Layout size governs internal padding rhythm.
            </CardContent>
          </Card>
        </StoryFrame>
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
        <StoryFrame key={state} width="md">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <Card state={state}>
            <CardHeader>
              <CardTitle>Governed card probe</CardTitle>
              <CardDescription>
                Card rendered with governed state &quot;{state}&quot;.
              </CardDescription>
            </CardHeader>
          </Card>
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
          "Cards are static surfaces (`div`) — interactive controls inside cards must retain native semantics. Footer actions use governed `Button` primitives with explicit labels.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>Accessible card actions</CardTitle>
          <CardDescription>
            Primary workflow actions are exposed as labeled buttons, not
            clickable card shells.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <StoryRow gap="sm">
            <Button aria-label="Approve expense report EXP-2026-042" size="sm">
              Approve
            </Button>
            <Button
              aria-label="Reject expense report EXP-2026-042"
              emphasis="outline"
              intent="destructive"
              size="sm"
            >
              Reject
            </Button>
          </StoryRow>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const KpiMetricCard: Story = {
  name: "ERP — KPI Metric Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <Card density="compact" size="sm">
        <CardHeader>
          <CardDescription>Monthly revenue</CardDescription>
          <CardTitle>{formatCurrency(1_284_000)}</CardTitle>
          <CardAction>
            <Badge emphasis="soft" tone="success">
              <ArrowUpIcon />
              12.4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <StoryRow gap="xs">
            <span className="text-muted-foreground text-xs">
              vs. prior month
            </span>
            <span className="font-medium text-success text-xs">
              +{formatCurrency(142_000)}
            </span>
          </StoryRow>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const DashboardStatGrid: Story = {
  name: "ERP — Dashboard Stat Grid",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow gap="md" wrap>
        {[
          {
            label: "Open invoices",
            value: "248",
            delta: "+18",
            tone: "info" as const,
            icon: FileTextIcon,
          },
          {
            label: "Pending approvals",
            value: "34",
            delta: "-6",
            tone: "warning" as const,
            icon: ClockIcon,
          },
          {
            label: "Overdue payments",
            value: "7",
            delta: "+2",
            tone: "danger" as const,
            icon: ShieldAlertIcon,
          },
          {
            label: "Active vendors",
            value: "1,204",
            delta: "+42",
            tone: "success" as const,
            icon: Building2Icon,
          },
        ].map(({ label, value, delta, tone, icon: Icon }) => (
          <StoryStack className="min-w-40 flex-1" gap="xs" key={label}>
            <Card density="compact" size="sm">
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle>{value}</CardTitle>
                <CardAction>
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                </CardAction>
              </CardHeader>
              <CardContent>
                <Badge emphasis="soft" size="sm" tone={tone}>
                  {delta} this week
                </Badge>
              </CardContent>
            </Card>
          </StoryStack>
        ))}
      </StoryRow>
    </StoryFrame>
  ),
};

export const InvoiceSummaryCard: Story = {
  name: "ERP — Invoice Summary Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              INV-2026-0042
            </span>
            <CardTitle>Acme Supplies Ltd.</CardTitle>
          </StoryStack>
          <CardDescription>Due Apr 15, 2026 · Net 30 terms</CardDescription>
          <CardAction>
            <Badge emphasis="soft" tone="warning">
              Awaiting payment
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <StoryStack gap="sm">
            <StoryRow justify="between">
              <span className="text-muted-foreground text-sm">
                Invoice amount
              </span>
              <span className="font-semibold">{formatCurrency(24_850)}</span>
            </StoryRow>
            <StoryRow justify="between">
              <span className="text-muted-foreground text-sm">Amount paid</span>
              <span>{formatCurrency(0)}</span>
            </StoryRow>
            <Separator />
            <StoryRow justify="between">
              <span className="font-medium text-sm">Balance due</span>
              <span className="font-semibold">{formatCurrency(24_850)}</span>
            </StoryRow>
          </StoryStack>
        </CardContent>
        <CardFooter>
          <StoryRow gap="sm">
            <Button size="sm">Record payment</Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              Send reminder
            </Button>
          </StoryRow>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const RecordDetailSection: Story = {
  name: "ERP — Record Detail Section",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <CardTitle>Vendor details</CardTitle>
          <CardDescription>
            Core identification and compliance fields
          </CardDescription>
          <CardAction>
            <Button emphasis="outline" size="sm">
              <SettingsIcon />
              Edit
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <StoryStack gap="sm">
            {[
              { label: "Legal name", value: "Acme Supplies Ltd." },
              { label: "Vendor ID", value: "VND-88421" },
              { label: "Tax ID", value: "12-3456789" },
              { label: "Payment terms", value: "Net 30" },
              { label: "Currency", value: "USD" },
            ].map(({ label, value }) => (
              <StoryRow justify="between" key={label}>
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className="text-sm">{value}</span>
              </StoryRow>
            ))}
          </StoryStack>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const FormSectionCard: Story = {
  name: "ERP — Form Section Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <CardTitle>Shipping address</CardTitle>
          <CardDescription>
            Delivery location for purchase order PO-2026-1184
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryStack gap="sm">
            <StoryStack gap="xs">
              <span className="font-medium text-sm">
                Warehouse — East Campus
              </span>
              <span className="text-muted-foreground text-sm">
                4200 Industrial Parkway, Suite 200
              </span>
              <span className="text-muted-foreground text-sm">
                Columbus, OH 43215, USA
              </span>
            </StoryStack>
            <StoryRow gap="sm">
              <Badge emphasis="soft" tone="neutral">
                Receiving dock B
              </Badge>
              <Badge emphasis="soft" tone="info">
                Business hours only
              </Badge>
            </StoryRow>
          </StoryStack>
        </CardContent>
        <CardFooter>
          <Button emphasis="outline" size="sm">
            Change address
          </Button>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const ApprovalWorkflowCard: Story = {
  name: "ERP — Approval Workflow Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <CardTitle>Purchase order approval</CardTitle>
          <CardDescription>
            PO-2026-1184 · {formatCurrency(18_420)} total
          </CardDescription>
          <CardAction>
            <Badge emphasis="soft" tone="warning">
              In review
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <StoryStack gap="md">
            <StoryStack gap="xs">
              <StoryRow justify="between">
                <span className="text-muted-foreground text-sm">
                  Overall progress
                </span>
                <span className="text-sm">60%</span>
              </StoryRow>
              <Progress value={60} />
            </StoryStack>
            <StoryStack gap="sm">
              {[
                { step: "Submitted", status: "done", actor: "Alex Brown" },
                {
                  step: "Department review",
                  status: "done",
                  actor: "Sam Chen",
                },
                {
                  step: "Finance approval",
                  status: "pending",
                  actor: "Jane Doe",
                },
                {
                  step: "Executive sign-off",
                  status: "waiting",
                  actor: "Maria Kim",
                },
              ].map(({ step, status, actor }) => (
                <StoryRow align="center" gap="sm" key={step}>
                  <CheckCircle2Icon
                    aria-hidden="true"
                    className={
                      status === "done"
                        ? "size-4 text-success"
                        : "size-4 text-muted-foreground"
                    }
                  />
                  <StoryStack className="flex-1" gap="xs">
                    <StoryRow justify="between">
                      <span className="text-sm">{step}</span>
                      <Badge
                        emphasis="soft"
                        size="sm"
                        tone={
                          status === "done"
                            ? "success"
                            : status === "pending"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {status}
                      </Badge>
                    </StoryRow>
                    <span className="text-muted-foreground text-xs">
                      {actor}
                    </span>
                  </StoryStack>
                </StoryRow>
              ))}
            </StoryStack>
          </StoryStack>
        </CardContent>
        <CardFooter>
          <StoryRow gap="sm">
            <Button size="sm">Approve</Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              Delegate
            </Button>
          </StoryRow>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const TabbedRecordCard: Story = {
  name: "ERP — Tabbed Record Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <CardTitle>Employee record — Jane Doe</CardTitle>
          <CardDescription>EMP-1024 · Finance · Active</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>
            <Separator />
            <TabsContent value="overview">
              <StoryStack gap="sm" paddingY="sm">
                <StoryRow justify="between">
                  <span className="text-muted-foreground text-sm">
                    Department
                  </span>
                  <span className="text-sm">Finance</span>
                </StoryRow>
                <StoryRow justify="between">
                  <span className="text-muted-foreground text-sm">Manager</span>
                  <span className="text-sm">Maria Kim</span>
                </StoryRow>
                <StoryRow justify="between">
                  <span className="text-muted-foreground text-sm">
                    Start date
                  </span>
                  <span className="text-sm">Mar 12, 2019</span>
                </StoryRow>
              </StoryStack>
            </TabsContent>
            <TabsContent value="compensation">
              <StoryStack paddingY="sm">
                <p className="text-muted-foreground text-sm">
                  Annual salary {formatCurrency(92_000)} · Paid bi-weekly
                </p>
              </StoryStack>
            </TabsContent>
            <TabsContent value="documents">
              <StoryStack paddingY="sm">
                <p className="text-muted-foreground text-sm">
                  6 documents on file — I-9, W-4, offer letter
                </p>
              </StoryStack>
            </TabsContent>
            <TabsContent value="audit">
              <StoryStack paddingY="sm">
                <p className="text-muted-foreground text-sm">
                  Last modified by HR Admin on Jun 18, 2026
                </p>
              </StoryStack>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const TeamStakeholdersCard: Story = {
  name: "ERP — Team Stakeholders Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <CardTitle>Project stakeholders</CardTitle>
          <CardDescription>
            ERP rollout — Phase 2 implementation
          </CardDescription>
          <CardAction>
            <Button emphasis="outline" size="sm">
              <PlusIcon />
              Invite
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <StoryStack gap="xs">
            {TEAM.map(({ initials, name, role, dept }, i) => (
              <StoryRow
                align="center"
                className="rounded-md hover:bg-muted/40"
                justify="between"
                key={name}
                paddingX="sm"
                paddingY="sm"
              >
                <StoryRow align="center" gap="md">
                  <Avatar size="sm">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <StoryStack gap="xs">
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-muted-foreground text-xs">
                      {role} · {dept}
                    </span>
                  </StoryStack>
                </StoryRow>
                <Badge
                  emphasis="soft"
                  size="sm"
                  tone={i === 2 ? "warning" : "success"}
                >
                  {i === 2 ? "On leave" : "Active"}
                </Badge>
              </StoryRow>
            ))}
          </StoryStack>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const DismissibleActionCard: Story = {
  name: "ERP — Dismissible Action Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <DismissibleActionCardComponent />
    </StoryFrame>
  ),
};

export const NestedAlertCard: Story = {
  name: "ERP — Nested Alert Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <CardTitle>Payment batch — BATCH-2026-06-18</CardTitle>
          <CardDescription>
            18 invoices · {formatCurrency(98_420)} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryStack gap="md">
            <Alert tone="warning">
              <ShieldAlertIcon aria-hidden="true" />
              <AlertTitle>3 invoices exceed approval threshold</AlertTitle>
              <AlertDescription>
                Finance review required before batch release.
              </AlertDescription>
            </Alert>
            <StoryStack gap="sm">
              <StoryRow justify="between">
                <span className="text-muted-foreground text-sm">
                  Ready to pay
                </span>
                <span className="text-sm">15 invoices</span>
              </StoryRow>
              <StoryRow justify="between">
                <span className="text-muted-foreground text-sm">
                  Needs review
                </span>
                <span className="text-sm">3 invoices</span>
              </StoryRow>
            </StoryStack>
          </StoryStack>
        </CardContent>
        <CardFooter>
          <Button size="sm">Release approved payments</Button>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const ActivityTimelineCard: Story = {
  name: "ERP — Activity Timeline Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card density="compact">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Purchase order PO-2026-1184</CardDescription>
          <CardAction>
            <Button emphasis="ghost" intent="quiet" size="sm">
              View full history
              <ChevronRightIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <StoryStack gap="sm">
            {ACTIVITY.map(({ id, actor, initials, action, time }) => (
              <StoryRow align="start" gap="md" key={id}>
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <StoryStack className="flex-1" gap="xs">
                  <span className="font-medium text-sm">{actor}</span>
                  <span className="text-sm">{action}</span>
                  <span className="text-muted-foreground text-xs">{time}</span>
                </StoryStack>
              </StoryRow>
            ))}
          </StoryStack>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const OrderLineItemCard: Story = {
  name: "ERP — Order Line Item Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card density="compact" size="sm">
        <CardHeader>
          <StoryRow align="center" gap="md">
            <StoryStack
              className="rounded-md bg-muted/50"
              gap="xs"
              padding="sm"
            >
              <PackageIcon
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </StoryStack>
            <StoryStack gap="xs">
              <CardTitle>Industrial fasteners — M8 bolt kit</CardTitle>
              <CardDescription>SKU: FAST-M8-500 · Line 3</CardDescription>
            </StoryStack>
          </StoryRow>
          <CardAction>
            <Badge emphasis="soft" tone="info">
              In transit
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <StoryRow gap="lg" wrap>
            <StoryStack gap="xs">
              <span className="text-muted-foreground text-xs">Quantity</span>
              <span className="font-medium text-sm">500 units</span>
            </StoryStack>
            <StoryStack gap="xs">
              <span className="text-muted-foreground text-xs">Unit price</span>
              <span className="font-medium text-sm">{formatCurrency(12)}</span>
            </StoryStack>
            <StoryStack gap="xs">
              <span className="text-muted-foreground text-xs">Line total</span>
              <span className="font-medium text-sm">
                {formatCurrency(6000)}
              </span>
            </StoryStack>
            <StoryStack gap="xs">
              <span className="text-muted-foreground text-xs">ETA</span>
              <StoryRow align="center" gap="xs">
                <TruckIcon
                  aria-hidden="true"
                  className="size-3 text-muted-foreground"
                />
                <span className="font-medium text-sm">Jun 28, 2026</span>
              </StoryRow>
            </StoryStack>
          </StoryRow>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const VendorContactCard: Story = {
  name: "ERP — Vendor Contact Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <StoryRow align="center" gap="md">
            <Avatar>
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <CardTitle>Acme Supplies Ltd.</CardTitle>
              <CardDescription>Primary vendor · VND-88421</CardDescription>
            </StoryStack>
          </StoryRow>
        </CardHeader>
        <CardContent>
          <StoryStack gap="sm">
            <StoryRow align="center" gap="sm">
              <UserIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm">Sarah Mitchell — Account manager</span>
            </StoryRow>
            <StoryRow align="center" gap="sm">
              <MailIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm">sarah.mitchell@acmesupplies.com</span>
            </StoryRow>
            <StoryRow align="center" gap="sm">
              <PhoneIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm">+1 (614) 555-0192</span>
            </StoryRow>
            <StoryRow align="center" gap="sm">
              <Building2Icon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm">Columbus, OH · Net 30</span>
            </StoryRow>
          </StoryStack>
        </CardContent>
        <CardFooter>
          <StoryRow gap="sm">
            <Button size="sm">Create PO</Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              View vendor record
            </Button>
          </StoryRow>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const EmptyStateCard: Story = {
  name: "ERP — Empty State Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
          <CardDescription>
            Supporting documents for expense report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>No attachments yet</EmptyTitle>
              <EmptyDescription>
                Upload receipts or supporting documents for audit compliance.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">
                <UploadIcon />
                Upload files
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const LoadingSkeletonCard: Story = {
  name: "ERP — Loading Skeleton Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <StoryRow align="center" gap="sm">
            <Skeleton
              style={{ height: "2.5rem", width: "2.5rem", borderRadius: "50%" }}
            />
            <StoryStack className="flex-1" gap="xs">
              <Skeleton style={{ height: "0.875rem", width: "60%" }} />
              <Skeleton style={{ height: "0.75rem", width: "40%" }} />
            </StoryStack>
          </StoryRow>
        </CardHeader>
        <CardContent>
          <StoryStack gap="xs">
            <Skeleton style={{ height: "0.75rem", width: "100%" }} />
            <Skeleton style={{ height: "0.75rem", width: "85%" }} />
            <Skeleton style={{ height: "0.75rem", width: "70%" }} />
          </StoryStack>
        </CardContent>
        <CardFooter>
          <StoryRow gap="sm">
            <Skeleton style={{ height: "2rem", width: "5rem" }} />
            <Skeleton style={{ height: "2rem", width: "5rem" }} />
          </StoryRow>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const TrendComparisonCard: Story = {
  name: "ERP — Trend Comparison Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <CardTitle>Spend analysis — Q2 2026</CardTitle>
          <CardDescription>Procurement vs. budget by category</CardDescription>
        </CardHeader>
        <CardContent>
          <StoryStack gap="md">
            {[
              { category: "Raw materials", actual: 420_000, budget: 400_000 },
              { category: "IT services", actual: 182_000, budget: 210_000 },
              { category: "Facilities", actual: 95_000, budget: 88_000 },
            ].map(({ category, actual, budget }) => {
              const pct = Math.round((actual / budget) * 100);
              const over = actual > budget;
              return (
                <StoryStack gap="xs" key={category}>
                  <StoryRow justify="between">
                    <span className="text-sm">{category}</span>
                    <StoryRow align="center" gap="xs">
                      {over ? (
                        <ArrowUpIcon
                          aria-hidden="true"
                          className="size-3 text-danger"
                        />
                      ) : (
                        <ArrowDownIcon
                          aria-hidden="true"
                          className="size-3 text-success"
                        />
                      )}
                      <span className="text-muted-foreground text-xs">
                        {pct}% of budget
                      </span>
                    </StoryRow>
                  </StoryRow>
                  <StoryRow justify="between">
                    <span className="text-muted-foreground text-xs">
                      {formatCurrency(actual)} actual
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatCurrency(budget)} budget
                    </span>
                  </StoryRow>
                  <Progress value={Math.min(pct, 100)} />
                </StoryStack>
              );
            })}
          </StoryStack>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};
