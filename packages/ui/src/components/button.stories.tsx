import {
  DENSITIES,
  GOVERNED_STATES,
  SIZES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BellIcon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  LockIcon,
  MailIcon,
  MoreHorizontalIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
  SaveIcon,
  SendIcon,
  ShieldCheckIcon,
  ShieldXIcon,
  Trash2Icon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { Spinner } from "./spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ─── Helpers ───────────────────────────────────────────────────────────────

function CopyRecordLinkButton() {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      emphasis="outline"
      intent="secondary"
      onClick={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      size="sm"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}

function AsyncSubmitButton() {
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = () => {
    if (phase !== "idle") {
      return;
    }
    setPhase("loading");
    setTimeout(() => setPhase("success"), 1500);
    setTimeout(() => setPhase("idle"), 3500);
  };

  return (
    <Button
      disabled={phase === "loading"}
      emphasis="solid"
      intent="primary"
      onClick={handleClick}
      size="sm"
      {...(phase === "loading" ? { state: "loading" as const } : {})}
    >
      {phase === "loading" ? (
        <>
          <Spinner />
          Submitting…
        </>
      ) : phase === "success" ? (
        <>
          <CheckIcon />
          Submitted
        </>
      ) : (
        <>
          <SendIcon />
          Submit for approval
        </>
      )}
    </Button>
  );
}

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Governed button primitive for ERP action surfaces. Combines `intent` (primary · secondary · quiet · destructive) with `emphasis` (solid · soft · outline · ghost), `size`, `state`, and optional `presentation="icon"` for toolbar slots.',
      },
    },
  },
  argTypes: {
    intent: {
      control: "select",
      options: [...VARIANT_INTENTS],
      description: "Semantic action intent",
      table: { defaultValue: { summary: "primary" } },
    },
    emphasis: {
      control: "select",
      options: [...VARIANT_EMPHASES],
      description: "Visual weight",
      table: { defaultValue: { summary: "solid" } },
    },
    size: {
      control: "radio",
      options: [...SIZES],
      description: "Button size token",
      table: { defaultValue: { summary: "md" } },
    },
    density: {
      control: "select",
      options: [...DENSITIES],
      description: "Spacing density override",
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    presentation: {
      control: "radio",
      options: ["default", "icon"],
      description: "`icon` collapses padding for square icon-only buttons",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    intent: "primary",
    emphasis: "solid",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Single variant playground ────────────────────────────────────────────────

export const Default: Story = {};

export const Secondary: Story = {
  args: { intent: "secondary" },
};

export const Quiet: Story = {
  args: { intent: "quiet" },
};

export const Destructive: Story = {
  args: { intent: "destructive" },
};

export const Soft: Story = {
  args: { emphasis: "soft" },
};

export const Outline: Story = {
  args: { emphasis: "outline" },
};

export const Ghost: Story = {
  args: { emphasis: "ghost" },
};

// ─── Size variants ────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const ExtraSmall: Story = {
  name: "Size — Extra Small",
  args: { size: "xs" },
};

// ─── States ───────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { state: "loading", disabled: true },
  render: (args) => (
    <Button {...args}>
      <Spinner />
      Saving…
    </Button>
  ),
};

// ─── Icon + label (ERP action buttons) ────────────────────────────────────────

export const Save: Story = {
  args: { intent: "primary", emphasis: "solid" },
  render: (args) => (
    <Button {...args}>
      <SaveIcon />
      Save
    </Button>
  ),
};

export const AddRecord: Story = {
  args: { intent: "primary", emphasis: "solid" },
  render: (args) => (
    <Button {...args}>
      <PlusIcon />
      Add Record
    </Button>
  ),
};

export const DeleteRecord: Story = {
  args: { intent: "destructive", emphasis: "solid" },
  render: (args) => (
    <Button {...args}>
      <Trash2Icon />
      Delete
    </Button>
  ),
};

export const CancelAction: Story = {
  args: { intent: "secondary", emphasis: "ghost" },
  render: (args) => (
    <Button {...args}>
      <XIcon />
      Cancel
    </Button>
  ),
};

export const ExportData: Story = {
  args: { intent: "secondary", emphasis: "outline" },
  render: (args) => (
    <Button {...args}>
      <DownloadIcon />
      Export
    </Button>
  ),
};

export const ImportData: Story = {
  args: { intent: "secondary", emphasis: "outline" },
  render: (args) => (
    <Button {...args}>
      <UploadIcon />
      Import
    </Button>
  ),
};

export const Refresh: Story = {
  args: { intent: "quiet", emphasis: "ghost" },
  render: (args) => (
    <Button {...args}>
      <RefreshCwIcon />
      Refresh
    </Button>
  ),
};

// ─── Icon-only (toolbar slots) ────────────────────────────────────────────────

export const IconEdit: Story = {
  name: "Icon — Edit",
  args: { intent: "quiet", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="Edit">
      <EditIcon />
    </Button>
  ),
};

export const IconDelete: Story = {
  name: "Icon — Delete",
  args: { intent: "destructive", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="Delete">
      <Trash2Icon />
    </Button>
  ),
};

export const IconView: Story = {
  name: "Icon — View",
  args: { intent: "quiet", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="View details">
      <EyeIcon />
    </Button>
  ),
};

export const IconMore: Story = {
  name: "Icon — More",
  args: { intent: "quiet", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="More options">
      <MoreHorizontalIcon />
    </Button>
  ),
};

// ─── Governance probes ────────────────────────────────────────────────────────

export const AsChildLink: Story = {
  name: "Governance — asChild Link",
  parameters: {
    docs: {
      description: {
        story:
          "Button renders as `<a>` via `asChild` (Radix Slot). Governed className, data-intent, and data-emphasis are applied to the anchor.",
      },
    },
  },
  render: (args) => (
    <Button {...args} asChild>
      <a href="/example">Open Example</a>
    </Button>
  ),
};

export const AsChildDisabledLink: Story = {
  name: "Governance — asChild Disabled Link",
  parameters: {
    docs: {
      description: {
        story:
          "When `asChild` + `disabled`, the Slot receives `aria-disabled` and `tabIndex=-1` so the anchor is keyboard-inaccessible without `pointer-events:none` hacks.",
      },
    },
  },
  render: () => (
    <Button asChild disabled emphasis="solid" intent="primary">
      <a href="/danger">Disabled Link</a>
    </Button>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          'Consumer passes `data-intent="destructive"` and `data-emphasis="ghost"` — governed props (`intent="primary"`, `emphasis="solid"`) must win in the DOM. Inspect the element to confirm.',
      },
    },
  },
  render: () => (
    <Button
      data-emphasis="ghost"
      data-intent="destructive"
      data-size="lg"
      emphasis="solid"
      intent="primary"
      size="md"
    >
      Governed Wins
    </Button>
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
          <Button emphasis="solid" intent="primary" size="sm" state={state}>
            Primary
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm" state={state}>
            Secondary
          </Button>
          <Button emphasis="ghost" intent="destructive" size="sm" state={state}>
            Destructive
          </Button>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

// ─── Composed variants (studio-inspired) ───────────────────────────────────

export const IconTrailing: Story = {
  name: "Button — Icon Trailing",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="outline" intent="secondary" size="sm">
      View report
      <ChevronRightIcon />
    </Button>
  ),
};

export const SoftSave: Story = {
  name: "Button — Soft Save",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="soft" intent="primary" size="sm">
      <SaveIcon />
      Save draft
    </Button>
  ),
};

export const CautionAction: Story = {
  name: "Button — Caution Action",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="soft" intent="secondary" size="sm">
      <AlertTriangleIcon />
      Review warnings
    </Button>
  ),
};

export const CopyRecordLink: Story = {
  name: "Button — Copy Record Link",
  parameters: { layout: "padded" },
  render: () => <CopyRecordLinkButton />,
};

export const AsyncSubmit: Story = {
  name: "Button — Async Submit",
  parameters: { layout: "padded" },
  render: () => <AsyncSubmitButton />,
};

export const NotificationBell: Story = {
  name: "Button — Notification Bell",
  parameters: { layout: "padded" },
  render: () => (
    <div className="relative inline-flex">
      <Button
        aria-label="Notifications, 5 unread"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <BellIcon />
      </Button>
      <div className="absolute -top-1 -right-1">
        <Badge emphasis="solid" size="sm" tone="danger">
          5
        </Badge>
      </div>
    </div>
  ),
};

export const TooltipIconButton: Story = {
  name: "Button — Icon With Tooltip",
  parameters: { layout: "padded" },
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Add record"
            emphasis="outline"
            intent="primary"
            presentation="icon"
            size="sm"
          >
            <PlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add record</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const UserProfileTrigger: Story = {
  name: "Button — User Profile Trigger",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="ghost" intent="secondary" size="sm">
      <Avatar size="sm">
        <AvatarImage alt="Jane Doe" src="https://github.com/shadcn.png" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      Jane Doe
      <ChevronRightIcon />
    </Button>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────────

export const FormActions: Story = {
  name: "ERP — Form Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="sm" justify="end">
        <Button emphasis="ghost" intent="secondary">
          <XIcon />
          Cancel
        </Button>
        <Button emphasis="outline" intent="secondary">
          Save Draft
        </Button>
        <Button emphasis="solid" intent="primary">
          <SaveIcon />
          Save &amp; Close
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ConfirmDestructive: Story = {
  name: "ERP — Confirm Destructive",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="sm" justify="end">
        <Button emphasis="ghost" intent="secondary">
          Cancel
        </Button>
        <Button emphasis="solid" intent="destructive">
          <Trash2Icon />
          Delete Record
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const CrudToolbar: Story = {
  name: "ERP — CRUD Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="xs">
      <Button emphasis="solid" intent="primary" size="sm">
        <PlusIcon />
        New
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        <FilterIcon />
        Filter
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        <DownloadIcon />
        Export
      </Button>
      <Button
        aria-label="Refresh"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <RefreshCwIcon />
      </Button>
    </StoryRow>
  ),
};

export const RowActions: Story = {
  name: "ERP — Row Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="xs">
      <Button
        aria-label="View"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <EyeIcon />
      </Button>
      <Button
        aria-label="Edit"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <EditIcon />
      </Button>
      <Button
        aria-label="Delete"
        emphasis="ghost"
        intent="destructive"
        presentation="icon"
        size="sm"
      >
        <Trash2Icon />
      </Button>
      <Button
        aria-label="More options"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <MoreHorizontalIcon />
      </Button>
    </StoryRow>
  ),
};

export const AsyncSave: Story = {
  name: "ERP — Async Save (loading)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Button disabled emphasis="solid" intent="primary" state="loading">
        <Spinner />
        Saving…
      </Button>
      <Button disabled emphasis="ghost" intent="secondary">
        Cancel
      </Button>
    </StoryRow>
  ),
};

export const BulkApprove: Story = {
  name: "ERP — Bulk Approve",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Button emphasis="soft" intent="primary">
        <CheckIcon />
        Approve Selected
      </Button>
      <Button emphasis="soft" intent="destructive">
        <XIcon />
        Reject Selected
      </Button>
    </StoryRow>
  ),
};

export const ApproveRejectPair: Story = {
  name: "ERP — Approve / Reject Pair",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Button emphasis="soft" intent="primary" size="sm">
        <ShieldCheckIcon />
        Approve
      </Button>
      <Button emphasis="soft" intent="destructive" size="sm">
        <ShieldXIcon />
        Reject
      </Button>
    </StoryRow>
  ),
};

export const SubmitForApproval: Story = {
  name: "ERP — Submit For Approval",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="sm" justify="end">
        <Button emphasis="ghost" intent="secondary" size="sm">
          Save Draft
        </Button>
        <AsyncSubmitButton />
      </StoryRow>
    </StoryFrame>
  ),
};

export const PostJournalEntry: Story = {
  name: "ERP — Post Journal Entry",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="solid" intent="primary" size="sm">
      <SendIcon />
      Post Entry
    </Button>
  ),
};

export const VoidPostedRecord: Story = {
  name: "ERP — Void Posted Record",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="outline" intent="destructive" size="sm">
      <XIcon />
      Void Invoice
    </Button>
  ),
};

export const RunReport: Story = {
  name: "ERP — Run Report",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="solid" intent="primary" size="sm">
      <PlayIcon />
      Run Report
    </Button>
  ),
};

export const SendPaymentReminder: Story = {
  name: "ERP — Send Payment Reminder",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="outline" intent="secondary" size="sm">
      <MailIcon />
      Send Reminder
    </Button>
  ),
};

export const AssignToMe: Story = {
  name: "ERP — Assign To Me",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="soft" intent="primary" size="sm">
      <UserIcon />
      Assign to me
    </Button>
  ),
};

export const LockAccountingPeriod: Story = {
  name: "ERP — Lock Accounting Period",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="outline" intent="destructive" size="sm">
      <LockIcon />
      Lock Period
    </Button>
  ),
};

export const ReconcileBankFeed: Story = {
  name: "ERP — Reconcile Bank Feed",
  parameters: { layout: "padded" },
  render: () => (
    <Button emphasis="solid" intent="primary" size="sm">
      <CheckIcon />
      Reconcile 12 transactions
    </Button>
  ),
};

export const PrintPreview: Story = {
  name: "ERP — Print Preview",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Button emphasis="outline" intent="secondary" size="sm">
        <EyeIcon />
        Preview
      </Button>
      <Button emphasis="solid" intent="primary" size="sm">
        <FileTextIcon />
        Print PDF
      </Button>
    </StoryRow>
  ),
};

export const DialogFooterActions: Story = {
  name: "ERP — Dialog Footer Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="sm" justify="end">
        <Button emphasis="ghost" intent="secondary" size="sm">
          Cancel
        </Button>
        <Button emphasis="outline" intent="secondary" size="sm">
          Save Draft
        </Button>
        <Button emphasis="solid" intent="primary" size="sm">
          <SaveIcon />
          Confirm
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const WizardNavigation: Story = {
  name: "ERP — Wizard Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" justify="between">
        <Button emphasis="ghost" intent="secondary" size="sm">
          <ArrowRightIcon className="rotate-180" />
          Back
        </Button>
        <span className="text-muted-foreground text-sm">
          Step 2 of 4 — Vendor details
        </span>
        <Button emphasis="solid" intent="primary" size="sm">
          Next
          <ArrowRightIcon />
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const EmptyStateCTA: Story = {
  name: "ERP — Empty State CTA",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack className="items-center" gap="md">
        <span className="text-muted-foreground text-sm">
          No purchase orders yet. Create your first PO to get started.
        </span>
        <StoryRow gap="sm" justify="center">
          <Button emphasis="outline" intent="secondary" size="sm">
            <UploadIcon />
            Import CSV
          </Button>
          <Button emphasis="solid" intent="primary" size="sm">
            <PlusIcon />
            Create PO
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PublishWorkflow: Story = {
  name: "ERP — Publish Workflow",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Button emphasis="outline" intent="secondary" size="sm">
        Save Draft
      </Button>
      <Button emphasis="solid" intent="primary" size="sm">
        <SendIcon />
        Publish
      </Button>
    </StoryRow>
  ),
};

export const PermissionLockedAction: Story = {
  name: "ERP — Permission Locked Action",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="xs">
      <Button disabled emphasis="solid" intent="primary" size="sm">
        <LockIcon />
        Post Entry
      </Button>
      <span className="text-muted-foreground text-xs">
        You need Finance Admin permission to post journal entries.
      </span>
    </StoryStack>
  ),
};

export const RecordDetailActions: Story = {
  name: "ERP — Record Detail Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" justify="between" wrap>
        <StoryStack gap="xs">
          <span className="font-mono text-muted-foreground text-xs">
            INV-2024-0892
          </span>
          <span className="font-semibold">Vendor payment — Acme Supplies</span>
        </StoryStack>
        <StoryRow align="center" gap="sm" wrap>
          <CopyRecordLinkButton />
          <Button emphasis="outline" intent="secondary" size="sm">
            <EditIcon />
            Edit
          </Button>
          <Button emphasis="solid" intent="primary" size="sm">
            <CheckIcon />
            Approve
          </Button>
        </StoryRow>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ImportExportPair: Story = {
  name: "ERP — Import / Export Pair",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Button emphasis="outline" intent="secondary" size="sm">
        <UploadIcon />
        Import
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        <DownloadIcon />
        Export
      </Button>
    </StoryRow>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Icon-only buttons require `aria-label`. Async buttons use `state="loading"` with `disabled`. Notification buttons expose unread count in the label.',
      },
    },
  },
  render: () => (
    <StoryStack gap="sm">
      <Button
        aria-label="Edit employee record"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <EditIcon />
      </Button>
      <Button
        aria-label="Delete employee record"
        emphasis="ghost"
        intent="destructive"
        presentation="icon"
        size="sm"
      >
        <Trash2Icon />
      </Button>
      <Button
        disabled
        emphasis="solid"
        intent="primary"
        size="sm"
        state="loading"
      >
        <Spinner />
        Processing…
      </Button>
    </StoryStack>
  ),
};

// ─── Full matrix ──────────────────────────────────────────────────────────────

export const AllIntents: Story = {
  name: "Matrix — All Intents (solid)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {VARIANT_INTENTS.map((intent) => (
        <Button emphasis="solid" intent={intent} key={intent}>
          {intent}
        </Button>
      ))}
    </StoryRow>
  ),
};

export const AllEmphases: Story = {
  name: "Matrix — All Emphases (primary)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {VARIANT_EMPHASES.map((emphasis) => (
        <Button emphasis={emphasis} intent="primary" key={emphasis}>
          {emphasis}
        </Button>
      ))}
    </StoryRow>
  ),
};

export const AllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm" wrap>
      {SIZES.map((size) => (
        <Button emphasis="solid" intent="primary" key={size} size={size}>
          Size {size}
        </Button>
      ))}
    </StoryRow>
  ),
};

export const AllVariants: Story = {
  name: "Matrix — Intent × Emphasis",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {VARIANT_INTENTS.map((intent) => (
        <StoryRow align="center" gap="sm" key={intent} wrap>
          {VARIANT_EMPHASES.map((emphasis) => (
            <Button
              emphasis={emphasis}
              intent={intent}
              key={emphasis}
              size="sm"
            >
              {intent}/{emphasis}
            </Button>
          ))}
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

export const AllDensities: Story = {
  name: "Matrix — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      {DENSITIES.map((density) => (
        <StoryRow align="center" gap="md" key={density}>
          <span className="w-24 font-mono text-muted-foreground text-xs">
            {density}
          </span>
          <Button density={density} emphasis="solid" intent="primary" size="sm">
            Primary
          </Button>
          <Button
            density={density}
            emphasis="outline"
            intent="secondary"
            size="sm"
          >
            Secondary
          </Button>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};
