import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArchiveIcon,
  CheckCircle2Icon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  HistoryIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PackageIcon,
  SendIcon,
  ShareIcon,
  Trash2Icon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

// ─── Helpers ───────────────────────────────────────────────────────────────

function ContextSurface({
  children,
  hint = "Right-click for actions",
}: {
  readonly children: ReactNode;
  readonly hint?: string;
}) {
  return (
    <ContextMenuTrigger asChild>
      <button
        className="w-full rounded-md border border-border bg-transparent text-left transition-colors hover:bg-muted/30"
        type="button"
      >
        <StoryStack gap="sm" padding="lg">
          {children}
          <span className="text-muted-foreground text-xs">{hint}</span>
        </StoryStack>
      </button>
    </ContextMenuTrigger>
  );
}

// ─── ContextMenu ───────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI ContextMenu for ERP right-click surfaces: data grid rows, kanban cards, documents, and activity items. Use for contextual actions where pointer position matters; prefer `DropdownMenu` for explicit trigger buttons.",
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface>
          <StoryStack gap="xs">
            <span className="font-medium text-sm">INV-2026-0042</span>
            <span className="text-muted-foreground text-sm">
              Acme Supplies Ltd. · $24,850
            </span>
          </StoryStack>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <EyeIcon />
            View Details
          </ContextMenuItem>
          <ContextMenuItem>
            <EditIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const WithLabel: Story = {
  name: "ContextMenu — With Label",
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click record surface">
          <span className="font-medium text-sm">PO-2026-1184</span>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuLabel>Record Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <EyeIcon />
            View
          </ContextMenuItem>
          <ContextMenuItem>
            <EditIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <CopyIcon />
            Duplicate
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const WithCheckboxItems: Story = {
  name: "ContextMenu — Checkbox Items",
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click to toggle columns">
          <span className="font-medium text-sm">Employee roster grid</span>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuLabel>Toggle Columns</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked>Employee ID</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked>Name</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked>Department</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Email</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Phone</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked>Status</ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const WithRadioItems: Story = {
  name: "ContextMenu — Radio Items",
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click to change sort">
          <span className="font-medium text-sm">Invoice list</span>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuLabel>Sort Records By</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value="date-desc">
            <ContextMenuRadioItem value="date-desc">
              Date (Newest First)
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="date-asc">
              Date (Oldest First)
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="amount-desc">
              Amount (High → Low)
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="amount-asc">
              Amount (Low → High)
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="status">Status</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const WithSubMenu: Story = {
  name: "ContextMenu — With Sub Menu",
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface>
          <span className="font-medium text-sm">Vendor contract — Acme Supplies</span>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <EyeIcon />
            View Details
          </ContextMenuItem>
          <ContextMenuItem>
            <EditIcon />
            Edit Record
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ShareIcon />
              Share
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>
                <SendIcon />
                Send by Email
              </ContextMenuItem>
              <ContextMenuItem>
                <CopyIcon />
                Copy Share Link
              </ContextMenuItem>
              <ContextMenuItem>
                <DownloadIcon />
                Export as PDF
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <ArchiveIcon />
            Archive
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const WithShortcuts: Story = {
  name: "ContextMenu — With Keyboard Shortcuts",
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface>
          <span className="font-medium text-sm">INV-2026-0042</span>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuLabel>Invoice Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <EyeIcon />
            View
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <EditIcon />
            Edit
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <CopyIcon />
            Duplicate
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon />
            Export
            <ContextMenuShortcut>⌘⇧E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Delete
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Context menus open on right-click (or long-press). Destructive items use `variant=\"destructive\"`. Keyboard navigation follows Radix menu semantics.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click — keyboard navigable menu">
          <span className="font-medium text-sm">Accessible context surface</span>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <EyeIcon />
            View record
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Delete record
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ────────────────────────────────────────────────

export const TableRowContextMenu: Story = {
  name: "ERP — Table Row Context Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack className="overflow-hidden rounded-md border border-border" gap="xs">
        <StoryRow
          className="border-border border-b bg-muted/30 font-medium text-muted-foreground text-xs"
          gap="lg"
          paddingX="lg"
          paddingY="sm"
        >
          <span className="flex-1">Invoice</span>
          <span className="w-24">Status</span>
          <span className="w-24">Amount</span>
        </StoryRow>
        {(
          [
            { id: "INV-001", status: "Active", tone: "success", amount: "$4,850" },
            { id: "INV-002", status: "Pending", tone: "warning", amount: "$1,200" },
            { id: "INV-003", status: "Overdue", tone: "danger", amount: "$8,750" },
          ] as const
        ).map(({ id, status, tone, amount }) => (
          <ContextMenu key={id}>
            <ContextMenuTrigger asChild>
              <button
                className="flex w-full items-center gap-4 border-border border-b bg-transparent px-4 py-2 text-left transition-colors last:border-0 hover:bg-muted/20"
                type="button"
              >
                <span className="flex-1 font-medium text-sm">{id}</span>
                <span className="w-24">
                  <Badge emphasis="soft" size="sm" tone={tone}>
                    {status}
                  </Badge>
                </span>
                <span className="w-24 text-sm tabular-nums">{amount}</span>
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel>{id}</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <EyeIcon />
                View
              </ContextMenuItem>
              <ContextMenuItem>
                <EditIcon />
                Edit
              </ContextMenuItem>
              <ContextMenuItem>
                <CopyIcon />
                Duplicate
              </ContextMenuItem>
              <ContextMenuItem>
                <HistoryIcon />
                Audit Log
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">
                <Trash2Icon />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </StoryStack>
      <span className="text-muted-foreground text-xs">
        Right-click any row for actions
      </span>
    </StoryFrame>
  ),
};

export const InvoiceRecordSurface: Story = {
  name: "ERP — Invoice Record Surface",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click invoice header">
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              INV-2026-0042
            </span>
            <span className="font-semibold text-lg">Acme Supplies Ltd.</span>
            <StoryRow gap="sm">
              <Badge emphasis="soft" tone="warning">Awaiting payment</Badge>
              <span className="text-muted-foreground text-sm">$24,850 due</span>
            </StoryRow>
          </StoryStack>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <CheckCircle2Icon />
            Record payment
          </ContextMenuItem>
          <ContextMenuItem>
            <SendIcon />
            Send reminder
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon />
            Download PDF
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <LinkIcon />
            Copy payment link
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const KanbanCardContext: Story = {
  name: "ERP — Kanban Card Context",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <ContextMenu>
        <ContextSurface hint="Right-click workflow card">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Finance approval</span>
            <span className="text-muted-foreground text-xs">
              PO-2026-1184 · Alex Brown
            </span>
            <Badge emphasis="soft" size="sm" tone="warning">In review</Badge>
          </StoryStack>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <EyeIcon />
            Open record
          </ContextMenuItem>
          <ContextMenuItem>
            <CheckCircle2Icon />
            Approve
          </ContextMenuItem>
          <ContextMenuItem>
            <UserPlusIcon />
            Reassign
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <HistoryIcon />
            View history
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const DocumentFileContext: Story = {
  name: "ERP — Document File Context",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click attachment">
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
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <EyeIcon />
            Preview
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon />
            Download
          </ContextMenuItem>
          <ContextMenuItem>
            <CopyIcon />
            Copy link
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Remove attachment
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const ActivityFeedContext: Story = {
  name: "ERP — Activity Feed Context",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <ContextMenu>
        <ContextSurface hint="Right-click activity item">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Jane Doe approved PO-2026-1184</span>
            <span className="text-muted-foreground text-xs">2 minutes ago</span>
          </StoryStack>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <EyeIcon />
            View purchase order
          </ContextMenuItem>
          <ContextMenuItem>
            <UserIcon />
            View approver profile
          </ContextMenuItem>
          <ContextMenuItem>
            <HistoryIcon />
            Open audit trail
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const ApprovalWorkflowActions: Story = {
  name: "ERP — Approval Workflow Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click pending approval">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Expense report — Q2 2026</span>
            <span className="text-muted-foreground text-xs">
              $4,820 · Submitted by Jane Doe
            </span>
          </StoryStack>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuLabel>Approval actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <CheckCircle2Icon />
            Approve
          </ContextMenuItem>
          <ContextMenuItem>
            <EditIcon />
            Request changes
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Reject
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <UserPlusIcon />
            Delegate reviewer
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const BulkSelectionContext: Story = {
  name: "ERP — Bulk Selection Context",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <ContextMenu>
        <ContextSurface hint="Right-click selection summary">
          <StoryRow align="center" gap="md" justify="between">
            <span className="font-medium text-sm">8 invoices selected</span>
            <Badge emphasis="soft" tone="info">Bulk mode</Badge>
          </StoryRow>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuLabel>Apply to 8 records</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <SendIcon />
            Send for approval
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon />
            Export selected
          </ContextMenuItem>
          <ContextMenuItem>
            <ArchiveIcon />
            Archive selected
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <Trash2Icon />
            Delete selected
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const InventoryLineContext: Story = {
  name: "ERP — Inventory Line Context",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <ContextMenu>
        <ContextSurface hint="Right-click stock line">
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
            <Badge emphasis="soft" tone="success">1,240 in stock</Badge>
          </StoryRow>
        </ContextSurface>
        <ContextMenuContent>
          <ContextMenuItem>
            <EyeIcon />
            View item master
          </ContextMenuItem>
          <ContextMenuItem>
            <EditIcon />
            Adjust quantity
          </ContextMenuItem>
          <ContextMenuItem>
            <PackageIcon />
            Create replenishment PO
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <HistoryIcon />
            Stock movement history
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </StoryFrame>
  ),
};

export const DropdownVsContextComparison: Story = {
  name: "ERP — Dropdown vs Context Menu",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Explicit trigger (dropdown)</span>
          <span className="text-muted-foreground text-xs">
            Use for toolbar and icon buttons
          </span>
          <Button emphasis="outline" intent="secondary" size="sm">
            <MoreHorizontalIcon />
            Row actions
          </Button>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Pointer surface (context menu)</span>
          <span className="text-muted-foreground text-xs">
            Use for grid rows, cards, and document tiles
          </span>
          <ContextMenu>
            <ContextSurface hint="Right-click this surface">
              <span className="text-sm">INV-2026-0042 — Acme Supplies</span>
            </ContextSurface>
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
