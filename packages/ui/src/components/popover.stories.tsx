import type { Meta, StoryObj } from "@storybook/react";
import {
  CalendarIcon,
  CopyIcon,
  FilterIcon,
  LinkIcon,
  MoreHorizontalIcon,
  ShareIcon,
  SlidersHorizontalIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Textarea } from "./textarea";

// ─── Helpers ───────────────────────────────────────────────────────────────

function PopoverApplyFooter({
  applyLabel = "Apply",
  clearLabel = "Clear",
  onApply,
  onClear,
}: {
  readonly applyLabel?: string;
  readonly clearLabel?: string;
  readonly onApply?: () => void;
  readonly onClear?: () => void;
}) {
  return (
    <StoryRow gap="sm" justify="end">
      <Button
        emphasis="ghost"
        intent="secondary"
        onClick={onClear}
        size="sm"
        type="button"
      >
        {clearLabel}
      </Button>
      <Button
        emphasis="solid"
        intent="primary"
        onClick={onApply}
        size="sm"
        type="button"
      >
        {applyLabel}
      </Button>
    </StoryRow>
  );
}

function DatePickerPopoverField({
  id,
  label,
  value,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <StoryStack gap="xs">
      <Label htmlFor={id}>{label}</Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button emphasis="outline" id={id} intent="secondary">
            <CalendarIcon />
            {value || "Pick a date…"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>{label}</PopoverTitle>
          </PopoverHeader>
          <Input
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(false);
            }}
            type="date"
            value={value}
          />
        </PopoverContent>
      </Popover>
    </StoryStack>
  );
}

// ─── Popover ───────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed popover for ERP date pickers, quick filters, column pickers, and lightweight forms anchored to triggers. Use `PopoverHeader`, `PopoverTitle`, and `PopoverDescription` for structure. For modal workflows, use `Dialog`.",
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Open popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Record summary</PopoverTitle>
        </PopoverHeader>
        <PopoverDescription>
          Contextual information or quick actions anchored to the trigger.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

export const SideTop: Story = {
  name: "Popover — Side: Top",
  render: () => (
    <StoryFrame width="md">
      <StoryRow justify="center">
        <Popover>
          <PopoverTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              Open above
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top">
            <PopoverTitle>Top placement</PopoverTitle>
            <PopoverDescription>
              Panel opens above the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      </StoryRow>
    </StoryFrame>
  ),
};

export const SideRight: Story = {
  name: "Popover — Side: Right",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Open right
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right">
        <PopoverTitle>Right placement</PopoverTitle>
        <PopoverDescription>Panel opens to the right.</PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

function ControlledOpenComponent() {
  const [open, setOpen] = useState(false);

  return (
    <StoryStack gap="sm">
      <StoryRow align="center" gap="sm">
        <Button
          emphasis="outline"
          intent="secondary"
          onClick={() => setOpen((value) => !value)}
          size="sm"
          type="button"
        >
          Toggle externally
        </Button>
        <span className="text-muted-foreground text-xs">
          Open: {open ? "yes" : "no"}
        </span>
      </StoryRow>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button emphasis="outline" intent="secondary">
            Controlled popover
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Controlled state</PopoverTitle>
          <PopoverDescription>
            Parent state drives `open` for programmatic close after apply.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </StoryStack>
  );
}

export const ControlledOpen: Story = {
  name: "Popover — Controlled Open",
  render: () => <ControlledOpenComponent />,
};

export const GovernanceSurfaceVariants: Story = {
  name: "Governance — Surface Variants",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {(
        [
          {
            label: "standard / md / overlay",
            density: "standard",
            radius: "md",
          },
          { label: "compact / sm / overlay", density: "compact", radius: "sm" },
          {
            label: "standard / lg / overlay",
            density: "standard",
            radius: "lg",
          },
        ] as const
      ).map(({ label, density, radius }) => (
        <Popover key={label}>
          <PopoverTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              {label}
            </Button>
          </PopoverTrigger>
          <PopoverContent density={density} radius={radius} shadow="overlay">
            <PopoverHeader>
              <PopoverTitle>Surface probe</PopoverTitle>
              <PopoverDescription>{label}</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </StoryStack>
  ),
};

// ─── ERP patterns ──────────────────────────────────────────────────────────

function DueDatePopoverComponent() {
  const [dueDate, setDueDate] = useState("2026-07-15");

  return (
    <StoryFrame width="sm">
      <DatePickerPopoverField
        id="due-date"
        label="Due date"
        onChange={setDueDate}
        value={dueDate}
      />
    </StoryFrame>
  );
}

export const DueDatePopover: Story = {
  name: "ERP — Due Date Picker",
  render: () => <DueDatePopoverComponent />,
};

function PostingDatePopoverComponent() {
  const [date, setDate] = useState("");
  return (
    <StoryFrame width="sm">
      <DatePickerPopoverField
        id="post-date"
        label="Posting date"
        onChange={setDate}
        value={date}
      />
    </StoryFrame>
  );
}

export const PostingDatePopover: Story = {
  name: "ERP — Posting Date Picker",
  render: () => <PostingDatePopoverComponent />,
};

export const QuickFilterPopover: Story = {
  name: "ERP — Date Range Filter",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          <FilterIcon />
          Advanced filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Filter by date range</PopoverTitle>
          <PopoverDescription>
            Applies to the current invoice list.
          </PopoverDescription>
        </PopoverHeader>
        <StoryStack gap="sm">
          <StoryStack gap="xs">
            <Label htmlFor="qf-from">From</Label>
            <Input id="qf-from" size="sm" type="date" />
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="qf-to">To</Label>
            <Input id="qf-to" size="sm" type="date" />
          </StoryStack>
          <PopoverApplyFooter />
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const StatusFilterPopover: Story = {
  name: "ERP — Status Filter",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          <SlidersHorizontalIcon />
          Status
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <PopoverHeader>
          <PopoverTitle>Invoice status</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="sm">
          <Select defaultValue="pending">
            <SelectTrigger size="sm">
              <SelectValue placeholder="Select status…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          <PopoverApplyFooter applyLabel="Apply filter" />
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const ColumnVisibilityPopover: Story = {
  name: "ERP — Column Visibility",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <PopoverHeader>
          <PopoverTitle>Show columns</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="sm">
          {[
            { id: "inv", label: "Invoice number", defaultChecked: true },
            { id: "vendor", label: "Vendor", defaultChecked: true },
            { id: "amount", label: "Amount", defaultChecked: true },
            { id: "due", label: "Due date", defaultChecked: false },
          ].map((column) => (
            <StoryRow align="center" gap="sm" key={column.id}>
              <Checkbox defaultChecked={column.defaultChecked} id={column.id} />
              <Label htmlFor={column.id}>{column.label}</Label>
            </StoryRow>
          ))}
          <PopoverApplyFooter applyLabel="Save view" />
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const ExportOptionsPopover: Story = {
  name: "ERP — Export Options",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <PopoverHeader>
          <PopoverTitle>Export invoices</PopoverTitle>
          <PopoverDescription>
            284 records match current filters.
          </PopoverDescription>
        </PopoverHeader>
        <StoryStack gap="sm">
          <Select defaultValue="csv">
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="pdf">PDF summary</SelectItem>
            </SelectContent>
          </Select>
          <Button emphasis="solid" intent="primary" size="sm">
            Download export
          </Button>
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const AssignUserPopover: Story = {
  name: "ERP — Assign User",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          <UserPlusIcon />
          Assign
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <PopoverHeader>
          <PopoverTitle>Assign approver</PopoverTitle>
          <PopoverDescription>
            PO-2026-1184 · Industrial fasteners
          </PopoverDescription>
        </PopoverHeader>
        <StoryStack gap="sm">
          {[
            { name: "Jane Doe", initials: "JD", role: "Finance lead" },
            { name: "Alex Chen", initials: "AC", role: "Procurement manager" },
          ].map((person) => (
            <Button emphasis="ghost" intent="quiet" key={person.name} size="sm">
              <StoryRow align="center" gap="sm">
                <Avatar size="sm">
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
                <StoryStack gap="xs">
                  <span className="text-sm">{person.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {person.role}
                  </span>
                </StoryStack>
              </StoryRow>
            </Button>
          ))}
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const ApprovalCommentPopover: Story = {
  name: "ERP — Approval Comment",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Add comment
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Approval comment</PopoverTitle>
          <PopoverDescription>
            Recorded in the audit trail for INV-2026-0042.
          </PopoverDescription>
        </PopoverHeader>
        <StoryStack gap="sm">
          <Textarea placeholder="Optional note for reviewers…" rows={3} />
          <PopoverApplyFooter applyLabel="Save comment" clearLabel="Cancel" />
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const ShareLinkPopover: Story = {
  name: "ERP — Share Record Link",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Share record"
          emphasis="ghost"
          intent="quiet"
          presentation="icon"
          size="sm"
        >
          <ShareIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Share invoice</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="sm">
          <StoryRow align="center" gap="xs">
            <LinkIcon className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">
              /finance/invoices/inv-2026-0042
            </span>
          </StoryRow>
          <Button emphasis="outline" intent="secondary" size="sm">
            <CopyIcon />
            Copy link
          </Button>
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const RecordQuickActionsPopover: Story = {
  name: "ERP — Record Quick Actions",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Record actions"
          emphasis="ghost"
          intent="quiet"
          presentation="icon"
          size="sm"
        >
          <MoreHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <PopoverHeader>
          <PopoverTitle>INV-2026-0042</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="xs">
          <Button emphasis="ghost" intent="quiet" size="sm">
            View details
          </Button>
          <Button emphasis="ghost" intent="quiet" size="sm">
            Edit invoice
          </Button>
          <Button emphasis="ghost" intent="quiet" size="sm">
            Approve
          </Button>
          <Separator />
          <Button emphasis="ghost" intent="destructive" size="sm">
            Void invoice
          </Button>
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const WorkspaceSwitcherPopover: Story = {
  name: "ERP — Workspace Switcher",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Demo Company · APAC
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <PopoverHeader>
          <PopoverTitle>Switch workspace</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="xs">
          {[
            { name: "Demo Company · APAC", active: true },
            { name: "Demo Company · EMEA", active: false },
            { name: "Sandbox · QA", active: false },
          ].map((workspace) => (
            <Button
              emphasis={workspace.active ? "soft" : "ghost"}
              intent={workspace.active ? "primary" : "quiet"}
              key={workspace.name}
              size="sm"
            >
              {workspace.name}
            </Button>
          ))}
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const NotificationPopover: Story = {
  name: "ERP — Notifications",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Notifications
          <Badge emphasis="soft" size="sm" tone="warning">
            3
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>3 items need attention</PopoverDescription>
        </PopoverHeader>
        <StoryStack gap="sm">
          {[
            "PO-2026-1184 awaiting your approval",
            "Payment batch BATCH-2026-06-18 ready to post",
            "Expense EXP-2026-042 rejected — comment required",
          ].map((message) => (
            <StoryStack
              className="rounded-md border border-border"
              gap="xs"
              key={message}
              padding="sm"
            >
              <span className="text-sm">{message}</span>
            </StoryStack>
          ))}
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const VendorLookupPopover: Story = {
  name: "ERP — Vendor Lookup",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Select vendor
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Vendor</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="sm">
          <Input placeholder="Search vendors…" type="search" />
          <StoryStack gap="xs">
            {["Acme Supplies Ltd", "Global Parts Co.", "Northwind Traders"].map(
              (vendor) => (
                <Button emphasis="ghost" intent="quiet" key={vendor} size="sm">
                  {vendor}
                </Button>
              )
            )}
          </StoryStack>
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const GLAccountPickerPopover: Story = {
  name: "ERP — GL Account Picker",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          6100 — Office Supplies
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>GL account</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="sm">
          <Input placeholder="Search accounts…" type="search" />
          <StoryStack gap="xs">
            {[
              "6100 — Office Supplies",
              "6200 — Travel & Entertainment",
              "6300 — Professional Services",
            ].map((account) => (
              <Button emphasis="ghost" intent="quiet" key={account} size="sm">
                {account}
              </Button>
            ))}
          </StoryStack>
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const AmountAdjustmentPopover: Story = {
  name: "ERP — Line Amount Adjustment",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          $4,850.00
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <PopoverHeader>
          <PopoverTitle>Adjust amount</PopoverTitle>
        </PopoverHeader>
        <StoryStack gap="sm">
          <StoryStack gap="xs">
            <Label htmlFor="adj-amount">Invoice amount</Label>
            <Input defaultValue="4850.00" id="adj-amount" type="number" />
          </StoryStack>
          <PopoverApplyFooter applyLabel="Update" />
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const InlineNotesPopover: Story = {
  name: "ERP — Inline Notes",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          Add note
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Internal note</PopoverTitle>
          <PopoverDescription>Visible to finance team only.</PopoverDescription>
        </PopoverHeader>
        <StoryStack gap="sm">
          <Textarea placeholder="Buyer notes for PO-2026-1184…" rows={3} />
          <PopoverApplyFooter applyLabel="Save" />
        </StoryStack>
      </PopoverContent>
    </Popover>
  ),
};

export const PopoverVsDialog: Story = {
  name: "ERP — Popover vs Dialog",
  parameters: {
    docs: {
      description: {
        story:
          "Popover: lightweight, anchored, non-modal panels (filters, pickers). Dialog: modal workflows that block the page (create record, confirm delete).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Popover — quick filter</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                Filter list
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <PopoverTitle>Quick filter</PopoverTitle>
              <PopoverDescription>Stays on the list view.</PopoverDescription>
            </PopoverContent>
          </Popover>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Dialog — create record</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Dialog for modal create/edit flows.
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PopoverVsHoverCard: Story = {
  name: "ERP — Popover vs HoverCard",
  parameters: {
    docs: {
      description: {
        story:
          "Popover: click/focus opens interactive panels. HoverCard: hover previews without requiring a click — see Primitives/HoverCard.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Click for actions
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <PopoverTitle>Interactive panel</PopoverTitle>
        <PopoverDescription>
          Popover supports buttons, inputs, and apply actions.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Use `PopoverTitle` for accessible naming. Pair triggers with visible labels; icon triggers need `aria-label`. Focus returns to trigger on close.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open due date picker"
          emphasis="outline"
          intent="secondary"
        >
          <CalendarIcon />
          Jul 15, 2026
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <PopoverHeader>
          <PopoverTitle>Due date</PopoverTitle>
          <PopoverDescription>Invoice INV-2026-0042</PopoverDescription>
        </PopoverHeader>
        <Input aria-label="Due date" type="date" />
      </PopoverContent>
    </Popover>
  ),
};
