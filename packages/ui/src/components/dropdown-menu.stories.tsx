import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArchiveIcon,
  Building2Icon,
  CheckCircle2Icon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  HistoryIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PackageIcon,
  SendIcon,
  SettingsIcon,
  ShareIcon,
  Trash2Icon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// ─── Shared data ─────────────────────────────────────────────────────────────

const INVOICE_ROWS = [
  { id: "INV-001", status: "Active", tone: "success", amount: "$4,850" },
  { id: "INV-002", status: "Pending", tone: "warning", amount: "$1,200" },
  { id: "INV-003", status: "Overdue", tone: "danger", amount: "$8,750" },
] as const;

const EXPORT_COLUMNS = [
  { id: "col-id", label: "Employee ID", checked: true },
  { id: "col-name", label: "Full name", checked: true },
  { id: "col-dept", label: "Department", checked: true },
  { id: "col-email", label: "Email", checked: false },
  { id: "col-phone", label: "Phone", checked: false },
  { id: "col-status", label: "Status", checked: true },
] as const;

function RowActionsTrigger({
  label = "Row actions",
}: {
  readonly label?: string;
}) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        aria-label={label}
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <MoreHorizontalIcon />
      </Button>
    </DropdownMenuTrigger>
  );
}

function StandardRecordActions({ recordId }: { readonly recordId: string }) {
  return (
    <>
      <DropdownMenuLabel>{recordId}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <EyeIcon />
        View
      </DropdownMenuItem>
      <DropdownMenuItem>
        <EditIcon />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CopyIcon />
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuItem>
        <HistoryIcon />
        Audit log
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <Trash2Icon />
        Delete
      </DropdownMenuItem>
    </>
  );
}

// ─── DropdownMenu ──────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI DropdownMenu for ERP toolbar menus, row action buttons, bulk commands, and explicit trigger surfaces. Prefer `ContextMenu` for right-click grid rows and document tiles.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <RowActionsTrigger />
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <EyeIcon />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const WithLabel: Story = {
  name: "DropdownMenu — With Label",
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Record actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <EyeIcon />
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const WithCheckboxItems: Story = {
  name: "DropdownMenu — Checkbox Items",
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Column visibility
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {EXPORT_COLUMNS.map(({ id, label, checked }) => (
            <DropdownMenuCheckboxItem checked={checked} key={id}>
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const WithRadioItems: Story = {
  name: "DropdownMenu — Radio Items",
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Sort by
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort records by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="date-desc">
            <DropdownMenuRadioItem value="date-desc">
              Date (newest first)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date-asc">
              Date (oldest first)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="amount-desc">
              Amount (high → low)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="amount-asc">
              Amount (low → high)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const WithSubMenu: Story = {
  name: "DropdownMenu — With Sub Menu",
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <EyeIcon />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditIcon />
            Edit record
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ShareIcon />
              Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <SendIcon />
                Send by email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CopyIcon />
                Copy share link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DownloadIcon />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ArchiveIcon />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const WithShortcuts: Story = {
  name: "DropdownMenu — With Keyboard Shortcuts",
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Invoice actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <EyeIcon />
            View
            <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditIcon />
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Export
            <DropdownMenuShortcut>⌘⇧E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          'Icon triggers require `aria-label`. Destructive items use `variant="destructive"`. Keyboard navigation follows Radix menu semantics.',
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <RowActionsTrigger label="Accessible row actions" />
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <EyeIcon />
            View record
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete record
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const TableRowActions: Story = {
  name: "ERP — Table Row Actions",
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
          <span className="flex-1">Invoice</span>
          <span className="w-24">Status</span>
          <span className="w-24">Amount</span>
          <span className="w-20 text-right">Actions</span>
        </StoryRow>
        {INVOICE_ROWS.map(({ id, status, tone, amount }) => (
          <StoryRow
            align="center"
            className="border-border border-b last:border-0"
            gap="lg"
            key={id}
            paddingX="lg"
            paddingY="sm"
          >
            <span className="flex-1 font-medium text-sm">{id}</span>
            <span className="w-24">
              <Badge emphasis="soft" size="sm" tone={tone}>
                {status}
              </Badge>
            </span>
            <span className="w-24 text-sm tabular-nums">{amount}</span>
            <span className="flex w-20 justify-end">
              <DropdownMenu>
                <RowActionsTrigger label={`Actions for ${id}`} />
                <DropdownMenuContent align="end">
                  <StandardRecordActions recordId={id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const UserAccountMenu: Story = {
  name: "ERP — User Account Menu",
  parameters: { layout: "padded" },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button emphasis="ghost" intent="quiet">
          <StoryRow align="center" gap="sm">
            <Avatar size="sm">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="text-sm">Jane Doe</span>
          </StoryRow>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Jane Doe</span>
            <span className="text-muted-foreground text-xs">
              jane.doe@company.com
            </span>
            <Badge emphasis="soft" size="sm" tone="info">
              Finance admin
            </Badge>
          </StoryStack>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Profile settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Workspace preferences
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HistoryIcon />
            Activity log
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Building2Icon />
          Switch organization
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const BulkActions: Story = {
  name: "ERP — Bulk Actions Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">8 records selected</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Bulk actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Apply to 8 records</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SendIcon />
            Send for approval
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Export selected
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArchiveIcon />
            Archive selected
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryRow>
  ),
};

export const InvoiceRecordActions: Story = {
  name: "ERP — Invoice Record Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <span className="font-mono text-muted-foreground text-xs">
            INV-2026-0042
          </span>
          <span className="font-semibold text-lg">Acme Supplies Ltd.</span>
          <StoryRow gap="sm">
            <Badge emphasis="soft" tone="warning">
              Awaiting payment
            </Badge>
            <span className="text-muted-foreground text-sm">$24,850 due</span>
          </StoryRow>
        </StoryStack>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              Invoice actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <CheckCircle2Icon />
              Record payment
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SendIcon />
              Send reminder
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadIcon />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LinkIcon />
              Copy payment link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCardIcon />
              Apply credit memo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </StoryStack>
    </StoryFrame>
  ),
};

export const KanbanCardActions: Story = {
  name: "ERP — Kanban Card Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack
        className="rounded-md border border-border"
        gap="sm"
        padding="md"
      >
        <StoryRow justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Finance approval</span>
            <span className="text-muted-foreground text-xs">
              PO-2026-1184 · Alex Brown
            </span>
          </StoryStack>
          <DropdownMenu>
            <RowActionsTrigger label="Kanban card actions" />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <EyeIcon />
                Open record
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle2Icon />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlusIcon />
                Reassign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HistoryIcon />
                View history
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </StoryRow>
        <Badge emphasis="soft" size="sm" tone="warning">
          In review
        </Badge>
      </StoryStack>
    </StoryFrame>
  ),
};

export const DocumentFileActions: Story = {
  name: "ERP — Document File Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="md" justify="between">
        <StoryRow align="center" gap="md">
          <FileTextIcon
            aria-hidden="true"
            className="size-8 text-muted-foreground"
          />
          <StoryStack gap="xs">
            <span className="font-medium text-sm">vendor_w9_acme.pdf</span>
            <span className="text-muted-foreground text-xs">
              248 KB · Uploaded Jun 18, 2026
            </span>
          </StoryStack>
        </StoryRow>
        <DropdownMenu>
          <RowActionsTrigger label="Document actions" />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <EyeIcon />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadIcon />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Remove attachment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ActivityFeedActions: Story = {
  name: "ERP — Activity Feed Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="md" justify="between">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Jane Doe approved PO-2026-1184
          </span>
          <span className="text-muted-foreground text-xs">2 minutes ago</span>
        </StoryStack>
        <DropdownMenu>
          <RowActionsTrigger label="Activity item actions" />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <EyeIcon />
              View purchase order
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserIcon />
              View approver profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HistoryIcon />
              Open audit trail
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ApprovalWorkflowActions: Story = {
  name: "ERP — Approval Workflow Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="md" justify="between">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Expense report — Q2 2026</span>
          <span className="text-muted-foreground text-xs">
            $4,820 · Submitted by Jane Doe
          </span>
        </StoryStack>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              Review
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Approval actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle2Icon />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EditIcon />
              Request changes
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserPlusIcon />
              Delegate reviewer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </StoryRow>
    </StoryFrame>
  ),
};

export const BulkSelectionMenu: Story = {
  name: "ERP — Bulk Selection Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="md" justify="between">
        <StoryRow align="center" gap="sm">
          <span className="font-medium text-sm">8 invoices selected</span>
          <Badge emphasis="soft" tone="info">
            Bulk mode
          </Badge>
        </StoryRow>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              Bulk actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Apply to 8 records</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SendIcon />
              Send for approval
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadIcon />
              Export selected
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Delete selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </StoryRow>
    </StoryFrame>
  ),
};

export const InventoryLineActions: Story = {
  name: "ERP — Inventory Line Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="md" justify="between">
        <StoryRow align="center" gap="md">
          <PackageIcon
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
          <StoryStack gap="xs">
            <span className="font-medium text-sm">FAST-M8-500</span>
            <span className="text-muted-foreground text-xs">
              M8 bolt kit · Warehouse East
            </span>
          </StoryStack>
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <Badge emphasis="soft" tone="success">
            1,240 in stock
          </Badge>
          <DropdownMenu>
            <RowActionsTrigger label="Inventory line actions" />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <EyeIcon />
                View item master
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EditIcon />
                Adjust quantity
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PackageIcon />
                Create replenishment PO
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HistoryIcon />
                Stock movement history
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </StoryRow>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ToolbarCommandMenu: Story = {
  name: "ERP — Toolbar Command Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="sm" wrap>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>New record</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserPlusIcon />
              Employee
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PackageIcon />
              Purchase order
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileTextIcon />
              Invoice
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Building2Icon />
              Vendor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              <DownloadIcon />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Export format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value="csv">
              <DropdownMenuRadioItem value="csv">CSV</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="xlsx">
                Excel (.xlsx)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pdf">
                PDF summary
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="More toolbar actions"
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="sm"
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <SettingsIcon />
              Table settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HistoryIcon />
              Import history
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </StoryRow>
    </StoryFrame>
  ),
};

export const StatusChangeMenu: Story = {
  name: "ERP — Status Change Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="soft" intent="secondary" size="sm">
            <Badge emphasis="soft" tone="warning">
              Pending
            </Badge>
            Change status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Update status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="pending">
            <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pending">
              Pending approval
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="approved">
              Approved
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="paid">Paid</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="void">Void</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const AssigneePickerMenu: Story = {
  name: "ERP — Assignee Picker Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            <UserPlusIcon />
            Assign reviewer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Route PO-2026-1184</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="jane">
            <DropdownMenuRadioItem value="jane">
              Jane Doe — Finance
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="alex">
              Alex Brown — Operations
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="sam">
              Sam Chen — HR
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const WorkflowRouteMenu: Story = {
  name: "ERP — Workflow Route Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Route workflow
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>PO-2026-1184</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SendIcon />
              Send to queue
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Finance approval</DropdownMenuItem>
              <DropdownMenuItem>Legal review</DropdownMenuItem>
              <DropdownMenuItem>Executive sign-off</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlusIcon />
              Assign to user
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Jane Doe</DropdownMenuItem>
              <DropdownMenuItem>Alex Brown</DropdownMenuItem>
              <DropdownMenuItem>Sam Chen</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HistoryIcon />
            View routing history
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const ModuleNavigationMenu: Story = {
  name: "ERP — Module Navigation Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Modules
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Jump to module</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Finance · Invoices</DropdownMenuItem>
            <DropdownMenuItem>Procurement · Purchase orders</DropdownMenuItem>
            <DropdownMenuItem>HR · Employee roster</DropdownMenuItem>
            <DropdownMenuItem>Inventory · Stock levels</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  ),
};

export const DropdownVsContextComparison: Story = {
  name: "ERP — Dropdown vs Context Menu",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "DropdownMenu: explicit trigger buttons and toolbars. ContextMenu: right-click surfaces on grids, cards, and documents.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Explicit trigger (dropdown)
          </span>
          <span className="text-muted-foreground text-xs">
            Use for toolbar and icon buttons
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                <MoreHorizontalIcon />
                Row actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <EyeIcon />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EditIcon />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Pointer surface (context menu)
          </span>
          <span className="text-muted-foreground text-xs">
            Use for grid rows, cards, and document tiles
          </span>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <button
                className="w-full rounded-md border border-border bg-transparent text-left text-sm transition-colors hover:bg-muted/30"
                type="button"
              >
                <StoryRow paddingX="md" paddingY="md">
                  INV-2026-0042 — Acme Supplies · right-click this surface
                </StoryRow>
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem>
                  <EyeIcon />
                  View
                </ContextMenuItem>
                <ContextMenuItem>
                  <EditIcon />
                  Edit
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
