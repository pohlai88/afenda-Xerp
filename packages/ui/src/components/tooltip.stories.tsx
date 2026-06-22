import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  CalendarIcon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  HelpCircleIcon,
  InfoIcon,
  KeyboardIcon,
  LockIcon,
  MoreHorizontalIcon,
  SaveIcon,
  ShieldIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import { Kbd } from "./kbd";
import { Label } from "./label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ─── Helpers ───────────────────────────────────────────────────────────────

function ErpTooltipProvider({
  children,
  delayDuration = 0,
}: {
  readonly children: ReactNode;
  readonly delayDuration?: number;
}) {
  return (
    <TooltipProvider delayDuration={delayDuration}>{children}</TooltipProvider>
  );
}

function IconTooltipButton({
  icon: Icon,
  label,
  emphasis = "ghost",
  intent = "quiet",
  disabled,
}: {
  readonly icon: ComponentType<{ className?: string }>;
  readonly label: string;
  readonly emphasis?: "ghost" | "outline" | "solid" | "soft";
  readonly intent?: "primary" | "secondary" | "quiet" | "destructive";
  readonly disabled?: boolean;
}) {
  const trigger = (
    <Button
      aria-label={label}
      disabled={disabled}
      emphasis={emphasis}
      intent={intent}
      presentation="icon"
      size="sm"
    >
      <Icon />
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {disabled ? <span className="inline-flex">{trigger}</span> : trigger}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function FieldHelpTooltip({
  id,
  label,
  help,
}: {
  readonly id: string;
  readonly label: string;
  readonly help: string;
}) {
  return (
    <StoryRow align="center" gap="xs">
      <Label htmlFor={id}>{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={`Help: ${label}`}
            emphasis="ghost"
            intent="quiet"
            presentation="icon"
            size="sm"
          >
            <HelpCircleIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{help}</TooltipContent>
      </Tooltip>
    </StoryRow>
  );
}

// ─── Tooltip ───────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed hover/focus hint for ERP icon buttons, field help, keyboard shortcuts, and disabled-action explanations. Wrap the tree in `TooltipProvider`. For interactive panels (filters, date pickers, forms), use `Popover` or `Dialog`.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ErpTooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="More options"
            emphasis="ghost"
            intent="quiet"
            presentation="icon"
          >
            <MoreHorizontalIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>More options</TooltipContent>
      </Tooltip>
    </ErpTooltipProvider>
  ),
};

export const AllSides: Story = {
  name: "Matrix — All Sides",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryFrame width="lg">
        <StoryRow align="center" gap="md" justify="center" wrap>
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button emphasis="outline" intent="secondary" size="sm">
                  {side}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
            </Tooltip>
          ))}
        </StoryRow>
      </StoryFrame>
    </ErpTooltipProvider>
  ),
};

export const DelayDuration: Story = {
  name: "Tooltip — Provider Delay",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      <StoryStack gap="xs">
        <span className="font-mono text-muted-foreground text-xs">
          delayDuration=0 (instant)
        </span>
        <ErpTooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                Hover instant
              </Button>
            </TooltipTrigger>
            <TooltipContent>Appears immediately on hover</TooltipContent>
          </Tooltip>
        </ErpTooltipProvider>
      </StoryStack>
      <StoryStack gap="xs">
        <span className="font-mono text-muted-foreground text-xs">
          delayDuration=700
        </span>
        <ErpTooltipProvider delayDuration={700}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                Hover delayed
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Appears after 700ms — reduces noise in dense UIs
            </TooltipContent>
          </Tooltip>
        </ErpTooltipProvider>
      </StoryStack>
    </StoryStack>
  ),
};

export const LongContent: Story = {
  name: "Tooltip — Long Content",
  render: () => (
    <ErpTooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Currency code help"
            emphasis="ghost"
            intent="quiet"
            presentation="icon"
          >
            <InfoIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          This field accepts ISO 4217 currency codes. Invoices with non-standard
          codes are flagged for manual review by Finance.
        </TooltipContent>
      </Tooltip>
    </ErpTooltipProvider>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only triggers need `aria-label`. Tooltip supplements the label — do not rely on tooltip text alone for critical instructions.",
      },
    },
  },
  render: () => (
    <ErpTooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Export employee roster"
            emphasis="outline"
            intent="secondary"
            size="sm"
          >
            <DownloadIcon />
            Export
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Download CSV of current filter results (248 records)
        </TooltipContent>
      </Tooltip>
    </ErpTooltipProvider>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const ErpToolbarTooltips: Story = {
  name: "ERP — Toolbar Icon Tooltips",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="xs">
        {[
          { icon: CalendarIcon, label: "Schedule review" },
          { icon: UserCircleIcon, label: "Assign to user" },
          { icon: SaveIcon, label: "Save draft" },
          { icon: InfoIcon, label: "View record details" },
          { icon: KeyboardIcon, label: "Keyboard shortcuts" },
          { icon: MoreHorizontalIcon, label: "More options" },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                aria-label={label}
                emphasis="ghost"
                intent="quiet"
                presentation="icon"
                size="sm"
              >
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const TableRowActionHints: Story = {
  name: "ERP — Table Row Action Hints",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="xs">
        <IconTooltipButton icon={EyeIcon} label="View PO-2026-1184" />
        <IconTooltipButton icon={EditIcon} label="Edit purchase order" />
        <IconTooltipButton icon={CopyIcon} label="Duplicate line items" />
        <IconTooltipButton icon={DownloadIcon} label="Download PDF" />
        <IconTooltipButton icon={MoreHorizontalIcon} label="More actions" />
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const FieldHelpIcons: Story = {
  name: "ERP — Field Help Icons",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryFrame width="md">
        <StoryStack gap="md">
          <FieldHelpTooltip
            help="Format: EMP- followed by five digits. Used for payroll and SSO provisioning."
            id="emp-id"
            label="Employee ID"
          />
          <FieldHelpTooltip
            help="ISO 4217 code. Non-USD invoices require FX rate on posting date."
            id="currency"
            label="Currency"
          />
          <FieldHelpTooltip
            help="Net days from invoice date. Overrides vendor default when set."
            id="terms"
            label="Payment terms"
          />
        </StoryStack>
      </StoryFrame>
    </ErpTooltipProvider>
  ),
};

export const KeyboardShortcutHints: Story = {
  name: "ERP — Keyboard Shortcut Hints",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button emphasis="solid" intent="primary" size="sm">
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <StoryRow gap="sm">
              <span>Save changes</span>
              <Kbd>⌘S</Kbd>
            </StoryRow>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              <FilterIcon />
              Filters
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <StoryRow gap="sm">
              <span>Open filter panel</span>
              <Kbd>F</Kbd>
            </StoryRow>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Keyboard shortcuts"
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="sm"
            >
              <KeyboardIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Press ? for full shortcut list</TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const DisabledActionReason: Story = {
  name: "ERP — Disabled Action Reason",
  parameters: {
    docs: {
      description: {
        story:
          "Wrap disabled buttons in a `span` when using `TooltipTrigger asChild` so hover still shows the permission reason.",
      },
    },
  },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow gap="sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button disabled emphasis="solid" intent="primary" size="sm">
                Post payment
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            Invoice must be approved before payment can be posted
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button disabled emphasis="outline" intent="secondary" size="sm">
                <EditIcon />
                Edit amount
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            Posted invoices require Finance Admin to edit amounts
          </TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const PermissionDeniedTooltip: Story = {
  name: "ERP — Permission Denied Tooltip",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button
              disabled
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="sm"
            >
              <LockIcon />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Salary fields require HR Admin permission
        </TooltipContent>
      </Tooltip>
    </ErpTooltipProvider>
  ),
};

export const StatusBadgeExplanation: Story = {
  name: "ERP — Status Badge Explanation",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge emphasis="soft" tone="warning">
              Pending approval
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            Awaiting manager sign-off — SLA due in 2 business days
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge emphasis="soft" tone="danger">
              Overdue
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            Due date passed · balance $24,850 outstanding
          </TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const ApprovalQueueSlaHint: Story = {
  name: "ERP — Approval Queue SLA Hint",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="sm">
        <span className="font-mono text-sm">EXP-2026-042</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="SLA information"
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="sm"
            >
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            Manager approval required within 48 hours. Escalates to VP Finance
            if not actioned.
          </TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const RecordMetadataHints: Story = {
  name: "ERP — Record Metadata Hints",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryStack gap="sm">
        {[
          {
            label: "Created by",
            value: "Jane Doe",
            hint: "EMP-1024 · Finance · Jun 18, 2026 09:14",
          },
          {
            label: "Last modified",
            value: "System sync",
            hint: "Bank feed BATCH-2026-06-18 · automated posting",
          },
        ].map(({ label, value, hint }) => (
          <StoryRow align="center" gap="sm" key={label}>
            <span className="text-muted-foreground text-sm">{label}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button emphasis="ghost" intent="quiet" size="sm">
                  {value}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{hint}</TooltipContent>
            </Tooltip>
          </StoryRow>
        ))}
      </StoryStack>
    </ErpTooltipProvider>
  ),
};

export const AssignUserQuickAction: Story = {
  name: "ERP — Assign User Quick Action",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="sm">
        <span className="text-sm">PO-2026-1184</span>
        <IconTooltipButton icon={UserPlusIcon} label="Assign reviewer" />
        <IconTooltipButton icon={UserCircleIcon} label="View assignee queue" />
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const ExportFormatHint: Story = {
  name: "ERP — Export Format Hint",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="sm">
        <Button emphasis="outline" intent="secondary" size="sm">
          <DownloadIcon />
          Export
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Export format help"
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="sm"
            >
              <HelpCircleIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            CSV includes all visible columns. Salary column requires HR Admin
            and is omitted by default.
          </TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const ComplianceFieldHint: Story = {
  name: "ERP — Compliance Field Hint",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="sm">
        <ShieldIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        <span className="text-sm">Tax ID verification</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Tax ID verification help"
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="sm"
            >
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            Vendor tax IDs are validated against IRS records before first
            payment. Mismatches block AP posting.
          </TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const InventoryReorderHint: Story = {
  name: "ERP — Inventory Reorder Hint",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="sm">
        <Badge emphasis="soft" tone="warning">
          Low stock
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Reorder point details"
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="sm"
            >
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            SKU-8842 · On hand 180 · Reorder at 200 · Auto-PO enabled
          </TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const DataGridColumnHint: Story = {
  name: "ERP — Data Grid Column Hint",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryRow align="center" gap="lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium text-sm">Balance due</span>
          </TooltipTrigger>
          <TooltipContent>
            Outstanding amount in invoice currency · click header to sort
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium text-sm">Aging bucket</span>
          </TooltipTrigger>
          <TooltipContent>
            Days past due · 0–30, 31–60, 61–90, 90+
          </TooltipContent>
        </Tooltip>
      </StoryRow>
    </ErpTooltipProvider>
  ),
};

export const SidebarNavIconHints: Story = {
  name: "ERP — Sidebar Nav Icon Hints",
  parameters: { layout: "padded" },
  render: () => (
    <ErpTooltipProvider>
      <StoryStack gap="xs">
        {[
          { icon: UserCircleIcon, label: "HR — Employee roster" },
          { icon: ShieldIcon, label: "Admin — Security policies" },
          { icon: FilterIcon, label: "Procurement — Open POs" },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                aria-label={label}
                emphasis="ghost"
                intent="quiet"
                presentation="icon"
                size="sm"
              >
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}
      </StoryStack>
    </ErpTooltipProvider>
  ),
};

export const TooltipVsPopover: Story = {
  name: "ERP — Tooltip vs Popover",
  parameters: {
    docs: {
      description: {
        story:
          "Tooltip: non-interactive hints on hover/focus. Popover: anchored panels with inputs, filters, and apply actions (see Primitives/Popover).",
      },
    },
  },
  render: () => (
    <ErpTooltipProvider>
      <StoryFrame width="lg">
        <StoryStack gap="md">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">
              Tooltip — read-only hint
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button emphasis="outline" intent="secondary" size="sm">
                  <InfoIcon />
                  What is net 30?
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Payment due 30 calendar days after invoice date.
              </TooltipContent>
            </Tooltip>
          </StoryStack>
          <StoryStack gap="xs">
            <span className="font-medium text-sm">
              Popover — interactive filter
            </span>
            <span className="text-muted-foreground text-xs">
              See Primitives/Popover for date pickers, column pickers, and quick
              assign panels
            </span>
          </StoryStack>
        </StoryStack>
      </StoryFrame>
    </ErpTooltipProvider>
  ),
};

export const PopoverReference: Story = {
  name: "ERP — Use Popover for Interactive Panels",
  parameters: {
    docs: {
      description: {
        story:
          "Tooltips cannot contain focusable controls. Date pickers, filters, and forms belong in Popover or Dialog.",
      },
    },
  },
  render: () => (
    <ErpTooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Why not a popover?
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Tooltips cannot contain interactive controls — use Popover instead.
        </TooltipContent>
      </Tooltip>
    </ErpTooltipProvider>
  ),
};
