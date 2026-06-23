import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BuildingIcon,
  CreditCardIcon,
  PackageIcon,
  SettingsIcon,
  SlashIcon,
  UserIcon,
} from "lucide-react";
import { Fragment } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// ─── Helpers ───────────────────────────────────────────────────────────────

interface Crumb {
  readonly href?: string;
  readonly label: string;
}

function BreadcrumbTrail({ items }: { readonly items: readonly Crumb[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${String(index)}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function PageHeader({
  crumbs,
  title,
  badge,
}: {
  readonly crumbs: readonly Crumb[];
  readonly title: string;
  readonly badge?: {
    readonly label: string;
    readonly tone: "success" | "warning" | "info" | "neutral";
  };
}) {
  return (
    <StoryStack gap="sm">
      <BreadcrumbTrail items={crumbs} />
      <StoryRow align="center" gap="sm">
        <h1 className="font-heading font-semibold text-xl tracking-tight">
          {title}
        </h1>
        {badge ? (
          <Badge emphasis="soft" size="sm" tone={badge.tone}>
            {badge.label}
          </Badge>
        ) : null}
      </StoryRow>
    </StoryStack>
  );
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed navigation trail for ERP module hierarchy, record drill-down, and detail page context. Compose with `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, and `BreadcrumbEllipsis`. Pair with `DropdownMenu` to collapse deep paths.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed lifecycle state on the root landmark.",
    },
  },
  args: {
    state: "ready",
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <StoryFrame width="lg">
      <Breadcrumb {...args}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Finance</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Invoices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </StoryFrame>
  ),
};

export const Default: Story = {
  render: () => (
    <StoryFrame width="lg">
      <BreadcrumbTrail
        items={[
          { label: "Home", href: "#" },
          { label: "Finance", href: "#" },
          { label: "Invoices" },
        ]}
      />
    </StoryFrame>
  ),
};

export const TwoLevel: Story = {
  name: "Breadcrumb — Two Levels",
  render: () => (
    <StoryFrame width="md">
      <BreadcrumbTrail
        items={[
          { label: "Operations", href: "#" },
          { label: "Purchase Orders" },
        ]}
      />
    </StoryFrame>
  ),
};

export const DeepNavigation: Story = {
  name: "Breadcrumb — Deep Path",
  render: () => (
    <StoryFrame width="xl">
      <BreadcrumbTrail
        items={[
          { label: "Home", href: "#" },
          { label: "Finance", href: "#" },
          { label: "Accounts Payable", href: "#" },
          { label: "Invoices", href: "#" },
          { label: "INV-2026-0142" },
        ]}
      />
    </StoryFrame>
  ),
};

export const SinglePage: Story = {
  name: "Breadcrumb — Current Page Only",
  render: () => (
    <StoryFrame width="sm">
      <BreadcrumbTrail items={[{ label: "Dashboard" }]} />
    </StoryFrame>
  ),
};

export const CustomSeparator: Story = {
  name: "Breadcrumb — Custom Separator",
  render: () => (
    <StoryFrame width="lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon aria-hidden="true" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">HR</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon aria-hidden="true" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Leave Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </StoryFrame>
  ),
};

export const WithEllipsis: Story = {
  name: "Breadcrumb — Collapsed with Dropdown",
  render: () => (
    <StoryFrame width="xl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Show hidden breadcrumb segments"
                  emphasis="ghost"
                  intent="quiet"
                  presentation="icon"
                  size="sm"
                >
                  <BreadcrumbEllipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Finance</DropdownMenuItem>
                <DropdownMenuItem>Accounts Payable</DropdownMenuItem>
                <DropdownMenuItem>Vendor Payments</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Batch Run</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>RUN-2026-0312</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </StoryFrame>
  ),
};

export const ModuleOverview: Story = {
  name: "Breadcrumb — Module Paths",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {(
        [
          {
            icon: CreditCardIcon,
            items: [
              { label: "Finance", href: "#" },
              { label: "General Ledger" },
            ],
          },
          {
            icon: UserIcon,
            items: [{ label: "HR", href: "#" }, { label: "Employees" }],
          },
          {
            icon: PackageIcon,
            items: [{ label: "Operations", href: "#" }, { label: "Inventory" }],
          },
          {
            icon: SettingsIcon,
            items: [
              { label: "Admin", href: "#" },
              { label: "User Management" },
            ],
          },
        ] as const
      ).map(({ icon: Icon, items }) => (
        <StoryRow align="center" gap="sm" key={items.at(-1)?.label}>
          <Icon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <BreadcrumbTrail items={items} />
        </StoryRow>
      ))}
    </StoryStack>
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
          'Consumer passes `data-slot="override"` and `data-component="Override"` — governed values (`data-slot="breadcrumb"`, `data-component="Breadcrumb"`, `data-recipe="surface"`) must win in the DOM.',
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <Breadcrumb
        data-component="Override"
        data-slot="override"
        data-testid="governance-breadcrumb-root"
      >
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Root is a `nav` landmark with `aria-label=\"breadcrumb\"`. Current page uses `aria-current=\"page\"`. Separators and ellipsis are `aria-hidden`. Verify keyboard focus on links and collapsed-menu trigger.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Finance</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Invoice INV-2026-0142</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
          "Reference map of emitted `data-slot` values from `primitive-registry.ts`. Internal slot roles (e.g. `body`, `control`) differ from emitted DOM values (e.g. `breadcrumb-list`, `breadcrumb-link`).",
      },
    },
  },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → breadcrumb · body → breadcrumb-list · content → breadcrumb-item
          · control → breadcrumb-link · label → breadcrumb-page · icon →
          breadcrumb-separator · state → breadcrumb-ellipsis
        </p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem data-testid="slot-item">
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator data-testid="slot-separator" />
            <BreadcrumbItem>
              <BreadcrumbEllipsis data-testid="slot-ellipsis" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage data-testid="slot-page">Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
        <StoryFrame key={state} width="lg">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <Breadcrumb state={state}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const FinanceInvoiceDetail: Story = {
  name: "ERP — Finance Invoice Detail",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <PageHeader
        badge={{ label: "Pending Approval", tone: "warning" }}
        crumbs={[
          { label: "Home", href: "#" },
          { label: "Finance", href: "#" },
          { label: "Accounts Payable", href: "#" },
          { label: "Invoices", href: "#" },
          { label: "INV-2026-0142" },
        ]}
        title="Invoice INV-2026-0142"
      />
    </StoryFrame>
  ),
};

export const HrEmployeeRecord: Story = {
  name: "ERP — HR Employee Record",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <PageHeader
        badge={{ label: "Active", tone: "success" }}
        crumbs={[
          { label: "Home", href: "#" },
          { label: "HR", href: "#" },
          { label: "Employees", href: "#" },
          { label: "Jane Doe" },
        ]}
        title="Jane Doe · EMP-00142"
      />
    </StoryFrame>
  ),
};

export const ProcurementPurchaseOrder: Story = {
  name: "ERP — Procurement PO Detail",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <PageHeader
        badge={{ label: "Awaiting Approval", tone: "info" }}
        crumbs={[
          { label: "Home", href: "#" },
          { label: "Procurement", href: "#" },
          { label: "Purchase Orders", href: "#" },
          { label: "PO-8821" },
        ]}
        title="Purchase Order PO-8821"
      />
    </StoryFrame>
  ),
};

export const InventoryLocationPath: Story = {
  name: "ERP — Inventory Location Path",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <BreadcrumbTrail
        items={[
          { label: "Operations", href: "#" },
          { label: "Inventory", href: "#" },
          { label: "Warehouse A", href: "#" },
          { label: "Bay 12", href: "#" },
          { label: "SKU-4401" },
        ]}
      />
    </StoryFrame>
  ),
};

export const AdminSettingsNested: Story = {
  name: "ERP — Admin Settings Nested",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <BreadcrumbTrail
        items={[
          { label: "Admin Console", href: "#" },
          { label: "Settings", href: "#" },
          { label: "Security", href: "#" },
          { label: "SSO Configuration" },
        ]}
      />
    </StoryFrame>
  ),
};

export const ReportDrillDown: Story = {
  name: "ERP — Report Drill-Down",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="sm">
        <BreadcrumbTrail
          items={[
            { label: "Reports", href: "#" },
            { label: "Financial", href: "#" },
            { label: "P&L by Department", href: "#" },
            { label: "Engineering · Q2 2026" },
          ]}
        />
        <span className="text-muted-foreground text-sm tabular-nums">
          Revenue $1.2M · Expenses $840K · Net $360K
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ProjectTaskBoard: Story = {
  name: "ERP — Project Task Context",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <PageHeader
        crumbs={[
          { label: "Projects", href: "#" },
          { label: "ERP Rollout", href: "#" },
          { label: "Sprint 14", href: "#" },
          { label: "AUTH-142" },
        ]}
        title="Implement SSO for Admin Console"
      />
    </StoryFrame>
  ),
};

export const AssetRegisterDetail: Story = {
  name: "ERP — Fixed Asset Detail",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <PageHeader
        badge={{ label: "Depreciating", tone: "neutral" }}
        crumbs={[
          { label: "Finance", href: "#" },
          { label: "Fixed Assets", href: "#" },
          { label: "FA-2026-0088" },
        ]}
        title="Dell PowerEdge R750"
      />
    </StoryFrame>
  ),
};

export const RecordDetailToolbar: Story = {
  name: "ERP — Detail Page with Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between" wrap>
          <PageHeader
            badge={{ label: "Draft", tone: "warning" }}
            crumbs={[
              { label: "Home", href: "#" },
              { label: "Sales", href: "#" },
              { label: "Quotes", href: "#" },
              { label: "QT-2026-0091" },
            ]}
            title="Quote QT-2026-0091"
          />
          <StoryRow gap="sm">
            <Button emphasis="outline" intent="secondary" size="sm">
              Duplicate
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              Send to Customer
            </Button>
          </StoryRow>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const MultiOrgContext: Story = {
  name: "ERP — Multi-Org Breadcrumb",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <BuildingIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="text-muted-foreground text-sm">
            Acme Holdings Pte Ltd
          </span>
        </StoryRow>
        <BreadcrumbTrail
          items={[
            { label: "Consolidation", href: "#" },
            { label: "Intercompany", href: "#" },
            { label: "Elimination Entries" },
          ]}
        />
      </StoryStack>
    </StoryFrame>
  ),
};
