import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircleIcon,
  BanIcon,
  Building2Icon,
  CheckCircle2Icon,
  ClockIcon,
  CloudOffIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderOpenIcon,
  HistoryIcon,
  InboxIcon,
  PackageIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
  WifiOffIcon,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
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

// ─── Helpers ───────────────────────────────────────────────────────────────

function EmptyStateIcon({
  icon: Icon,
  variant = "icon",
}: {
  readonly icon: ComponentType<{ className?: string }>;
  readonly variant?: "default" | "icon";
}) {
  return (
    <EmptyMedia variant={variant}>
      <Icon aria-hidden="true" />
    </EmptyMedia>
  );
}

function EmptyActions({ children }: { readonly children: ReactNode }) {
  return (
    <StoryRow gap="sm" justify="center" wrap>
      {children}
    </StoryRow>
  );
}

// ─── Empty ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Governed empty-state surface for ERP zero-data views: no records, no search results, access denied, integration errors, and positive “all clear” states. Use `EmptyMedia` `variant="icon"` for compact toolbar/table empties.',
      },
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={InboxIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No items</EmptyTitle>
          <EmptyDescription>Nothing here yet.</EmptyDescription>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "`EmptyTitle` provides the accessible name; `EmptyDescription` carries supporting context. Actions are regular buttons below the text block.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={FileTextIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No invoices in this view</EmptyTitle>
          <EmptyDescription>
            Create an invoice or adjust filters to see matching records.
          </EmptyDescription>
          <Button emphasis="solid" intent="primary" size="sm">
            <PlusIcon />
            New invoice
          </Button>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const GovernanceMediaVariants: Story = {
  name: "Governance — Media Variants",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      {[
        {
          label: 'variant="icon" (default for actions)',
          variant: "icon" as const,
        },
        {
          label: 'variant="default" (decorative)',
          variant: "default" as const,
        },
      ].map(({ label, variant }) => (
        <StoryFrame key={label} width="md">
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              {label}
            </span>
            <Empty>
              <EmptyHeader>
                <EmptyStateIcon icon={PackageIcon} variant={variant} />
              </EmptyHeader>
              <EmptyContent>
                <EmptyTitle>Media variant probe</EmptyTitle>
                <EmptyDescription>
                  Governed `EmptyMedia` sizing and background.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          </StoryStack>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const NoRecords: Story = {
  name: "ERP — No Records",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={FileTextIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No records found</EmptyTitle>
          <EmptyDescription>
            Get started by creating your first record in this module.
          </EmptyDescription>
          <Button emphasis="solid" intent="primary" size="sm">
            <PlusIcon />
            Create record
          </Button>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoSearchResults: Story = {
  name: "ERP — No Search Results",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={SearchIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No matching records</EmptyTitle>
          <EmptyDescription>
            No records match{" "}
            <span className="font-medium">&ldquo;invoice 2026&rdquo;</span>. Try
            adjusting your search or clearing filters.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="ghost" intent="secondary" size="sm">
              Clear filters
            </Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              Search all modules
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoEmployees: Story = {
  name: "ERP — No Employees (Module Empty)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={UsersIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No employees yet</EmptyTitle>
          <EmptyDescription>
            Your organisation hasn&apos;t added any employee records. Import
            from a spreadsheet or add them one by one.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="outline" intent="secondary" size="sm">
              <UploadIcon />
              Import CSV
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              <UserIcon />
              Add employee
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoInvoices: Story = {
  name: "ERP — No Invoices",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={FileTextIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No invoices this period</EmptyTitle>
          <EmptyDescription>
            There are no invoices matching the selected date range and filters.
            Adjust the range or create a new invoice.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="ghost" intent="secondary" size="sm">
              Reset filters
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              <PlusIcon />
              New invoice
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoPurchaseOrders: Story = {
  name: "ERP — No Purchase Orders",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={PackageIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No purchase orders</EmptyTitle>
          <EmptyDescription>
            Procurement queue is empty. Create a PO from an approved requisition
            or start a new request.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="outline" intent="secondary" size="sm">
              View requisitions
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              <PlusIcon />
              New PO
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoVendors: Story = {
  name: "ERP — No Vendors",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={Building2Icon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No vendors registered</EmptyTitle>
          <EmptyDescription>
            Add vendors before creating purchase orders or paying invoices.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="outline" intent="secondary" size="sm">
              <UploadIcon />
              Import vendor list
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              <PlusIcon />
              Register vendor
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const AccessDenied: Story = {
  name: "ERP — Access Denied (Module)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={ShieldIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Access restricted</EmptyTitle>
          <EmptyDescription>
            You don&apos;t have permission to view the Finance module.{" "}
            <a href="#request-access">Contact your administrator</a> to request
            access.
          </EmptyDescription>
          <Button emphasis="outline" intent="secondary" size="sm">
            Request access
          </Button>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const RecordNotFound: Story = {
  name: "ERP — Record Not Found",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={BanIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Invoice INV-2026-9999 not found</EmptyTitle>
          <EmptyDescription>
            The record may have been deleted, archived, or you may lack
            permission to view it.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="ghost" intent="secondary" size="sm">
              Back to invoices
            </Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              Search records
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const ModuleNotEnabled: Story = {
  name: "ERP — Module Not Enabled",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={FolderOpenIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Inventory module not enabled</EmptyTitle>
          <EmptyDescription>
            Stock management is not provisioned for your organisation tier.
            Upgrade or contact sales to enable warehouse features.
          </EmptyDescription>
          <Button emphasis="solid" intent="primary" size="sm">
            View plans
          </Button>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const InboxEmpty: Story = {
  name: "ERP — Empty Inbox (All Clear)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={CheckCircle2Icon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>You&apos;re all caught up</EmptyTitle>
          <EmptyDescription>
            No pending approvals or notifications at this time.
          </EmptyDescription>
          <Badge emphasis="soft" tone="success">
            Queue clear
          </Badge>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoApprovalsPending: Story = {
  name: "ERP — No Pending Approvals",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={InboxIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No items awaiting your approval</EmptyTitle>
          <EmptyDescription>
            Expense reports and purchase orders assigned to you are fully
            reviewed.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoAttachments: Story = {
  name: "ERP — No Attachments",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={FolderOpenIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No supporting documents</EmptyTitle>
          <EmptyDescription>
            Expense report EXP-2026-042 has no receipts attached. Upload
            documents for audit compliance.
          </EmptyDescription>
          <Button emphasis="solid" intent="primary" size="sm">
            <UploadIcon />
            Upload files
          </Button>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const NoAuditHistory: Story = {
  name: "ERP — No Audit History",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={HistoryIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No audit events yet</EmptyTitle>
          <EmptyDescription>
            PO-2026-1184 was created recently. Activity will appear here after
            the first edit or approval.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const FilterTooNarrow: Story = {
  name: "ERP — Filters Too Narrow",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={SearchIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No records match these filters</EmptyTitle>
          <EmptyDescription>
            Status: Overdue · Department: Legal · Assigned to me. Try removing
            one or more filters.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="ghost" intent="secondary" size="sm">
              Clear all filters
            </Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              Save filter set
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const IntegrationSyncFailed: Story = {
  name: "ERP — Integration Sync Failed",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={CloudOffIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Bank sync unavailable</EmptyTitle>
          <EmptyDescription>
            Payment batch BATCH-2026-06-18 could not reach the banking API. Your
            data is safe — retry or contact support if the issue persists.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="outline" intent="secondary" size="sm">
              Contact support
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              <RefreshCwIcon />
              Retry sync
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const UsageQuotaExceeded: Story = {
  name: "ERP — Usage Quota Exceeded",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={BanIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Export limit reached</EmptyTitle>
          <EmptyDescription>
            Your plan allows 500 employee exports per month. Upgrade to
            Enterprise for unlimited bulk exports.
          </EmptyDescription>
          <EmptyActions>
            <Button emphasis="outline" intent="secondary" size="sm">
              View usage
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              Upgrade plan
            </Button>
          </EmptyActions>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const MaintenanceWindow: Story = {
  name: "ERP — Maintenance Window",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={ClockIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Scheduled maintenance</EmptyTitle>
          <EmptyDescription>
            Payroll module is offline until 02:00 UTC for database maintenance.
            Read-only views remain available.
          </EmptyDescription>
          <Badge emphasis="soft" tone="warning">
            Est. 45 min remaining
          </Badge>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const OfflineState: Story = {
  name: "ERP — Offline / Connection Lost",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={WifiOffIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Connection lost</EmptyTitle>
          <EmptyDescription>
            Changes made offline will sync when you reconnect. Last synced 12
            minutes ago.
          </EmptyDescription>
          <Button emphasis="solid" intent="primary" size="sm">
            <RefreshCwIcon />
            Retry connection
          </Button>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const EmptyKanbanColumn: Story = {
  name: "ERP — Empty Kanban Column",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack
        className="rounded-md border border-border"
        gap="sm"
        padding="md"
      >
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">In review</span>
          <Badge emphasis="soft" size="sm" tone="info">
            0
          </Badge>
        </StoryRow>
        <Empty>
          <EmptyHeader>
            <EmptyStateIcon icon={InboxIcon} variant="icon" />
          </EmptyHeader>
          <EmptyContent>
            <EmptyTitle>No cards</EmptyTitle>
            <EmptyDescription>
              Drag purchase orders here when ready for finance review.
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmptyChartNoData: Story = {
  name: "ERP — Empty Chart Data",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Empty>
        <EmptyHeader>
          <EmptyStateIcon icon={CreditCardIcon} />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>No spend data for Q2 2026</EmptyTitle>
          <EmptyDescription>
            Expense transactions will populate this chart once posted to the
            ledger for the selected period.
          </EmptyDescription>
          <Button emphasis="outline" intent="secondary" size="sm">
            Change date range
          </Button>
        </EmptyContent>
      </Empty>
    </StoryFrame>
  ),
};

export const InTableContext: Story = {
  name: "ERP — Empty Table State",
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
          <span className="w-24">Department</span>
          <span className="w-20">Status</span>
          <span className="w-20 text-right">Actions</span>
        </StoryRow>
        <Empty>
          <EmptyHeader>
            <EmptyStateIcon icon={UsersIcon} variant="icon" />
          </EmptyHeader>
          <EmptyContent>
            <EmptyTitle>No employees match your filters</EmptyTitle>
            <EmptyDescription>
              Try clearing active filters or searching with different terms.
            </EmptyDescription>
            <Button emphasis="ghost" intent="secondary" size="sm">
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmptyCardPanel: Story = {
  name: "ERP — Empty Card Panel",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>Supporting documents</CardTitle>
          <CardDescription>
            Expense report EXP-2026-042 · Required for audit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyStateIcon icon={FolderOpenIcon} variant="icon" />
            </EmptyHeader>
            <EmptyContent>
              <EmptyTitle>No attachments yet</EmptyTitle>
              <EmptyDescription>
                Upload receipts or supporting documents for audit compliance.
              </EmptyDescription>
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

export const EmptyVsErrorGuidance: Story = {
  name: "ERP — Empty vs Error States",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Use `Empty` for expected zero-data and permission states. Use `Alert` (destructive) for recoverable runtime errors with retry actions.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Empty — no data yet</span>
          <Empty>
            <EmptyHeader>
              <EmptyStateIcon icon={FileTextIcon} variant="icon" />
            </EmptyHeader>
            <EmptyContent>
              <EmptyTitle>No invoices</EmptyTitle>
              <EmptyDescription>
                Expected when the list is new.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Error — sync failed (use Alert)
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Alert for destructive error banners with retry
          </span>
          <StoryRow align="center" gap="sm">
            <AlertCircleIcon
              aria-hidden="true"
              className="size-4 text-destructive"
            />
            <span className="text-sm">
              Bank sync failed — retry from toolbar
            </span>
          </StoryRow>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmptyStateMatrix: Story = {
  name: "Matrix — Common ERP Empties",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {(
        [
          {
            icon: FileTextIcon,
            title: "No invoices",
            desc: "Create or import",
          },
          { icon: PackageIcon, title: "No POs", desc: "Start procurement" },
          { icon: UsersIcon, title: "No employees", desc: "Import roster" },
          {
            icon: ShieldIcon,
            title: "Access denied",
            desc: "Request permission",
          },
        ] as const
      ).map(({ icon, title, desc }) => (
        <StoryFrame key={title} width="md">
          <Empty>
            <EmptyHeader>
              <EmptyStateIcon icon={icon} variant="icon" />
            </EmptyHeader>
            <EmptyContent>
              <EmptyTitle>{title}</EmptyTitle>
              <EmptyDescription>{desc}</EmptyDescription>
            </EmptyContent>
          </Empty>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};
