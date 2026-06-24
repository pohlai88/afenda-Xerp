import {
  DENSITIES,
  GOVERNED_PANEL_RADII,
  GOVERNED_PANEL_SHADOWS,
  GOVERNED_STATES,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, screen, userEvent, within } from "storybook/test";
import {
  AlertCircleIcon,
  Building2Icon,
  CheckCircle2Icon,
  CreditCardIcon,
  DownloadIcon,
  FileTextIcon,
  PackageIcon,
  SaveIcon,
  UploadIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import {
  governedPanelStoryProps,
  type RenderStory,
} from "./_storybook/story-types";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Field, FieldDescription, FieldLabel } from "./field";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Spinner } from "./spinner";
import { Textarea } from "./textarea";

// ─── Shared data ─────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "HR",
  "Operations",
  "Sales",
  "Legal",
] as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function DialogCancelButton() {
  return (
    <DialogClose asChild>
      <Button emphasis="ghost" intent="secondary">
        Cancel
      </Button>
    </DialogClose>
  );
}

function AsyncSaveDialogComponent() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button intent="primary">Save invoice changes</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!saving}>
        <DialogHeader>
          <DialogTitle>
            {saving ? "Saving changes…" : "Update invoice INV-2026-0042"}
          </DialogTitle>
          <DialogDescription>
            {saving
              ? "Please wait while the record is saved to the ledger."
              : "Modify vendor, amount, or due date before posting."}
          </DialogDescription>
        </DialogHeader>
        {saving ? (
          <StoryRow
            aria-busy="true"
            aria-label="Saving invoice changes"
            gap="md"
            justify="center"
            paddingY="md"
          >
            <Spinner />
            <span className="text-muted-foreground text-sm">
              Updating invoice #INV-0042…
            </span>
          </StoryRow>
        ) : (
          <StoryStack gap="sm">
            <StoryStack gap="xs">
              <Label htmlFor="async-vendor">Vendor</Label>
              <Input defaultValue="Acme Supplies Ltd." id="async-vendor" />
            </StoryStack>
            <StoryStack gap="xs">
              <Label htmlFor="async-amount">Amount</Label>
              <Input defaultValue="24850" id="async-amount" type="number" />
            </StoryStack>
          </StoryStack>
        )}
        <DialogFooter>
          <Button
            disabled={saving}
            emphasis="ghost"
            intent="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={saving}
            emphasis="solid"
            intent="primary"
            onClick={handleSave}
            {...(saving ? { state: "loading" as const } : {})}
          >
            {saving ? (
              <>
                <Spinner />
                Saving…
              </>
            ) : (
              <>
                <SaveIcon aria-hidden="true" />
                Save changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DialogPlaygroundDemo({
  density = "standard",
  radius = "md",
  shadow = "overlay",
  state = "ready",
}: {
  readonly density?: (typeof DENSITIES)[number];
  readonly radius?: (typeof GOVERNED_PANEL_RADII)[number];
  readonly shadow?: (typeof GOVERNED_PANEL_SHADOWS)[number];
  readonly state?: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <Dialog defaultOpen>
      <DialogContent
        density={density}
        radius={radius}
        shadow={shadow}
        state={state}
      >
        <DialogHeader>
          <DialogTitle>Dialog playground</DialogTitle>
          <DialogDescription>
            Adjust density, radius, shadow, and governed state from controls.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

function DialogStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryFrame width="md">
      <p className="font-mono text-muted-foreground text-xs">
        state=&quot;{state}&quot;
      </p>
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false} state={state}>
          <DialogHeader>
            <DialogTitle>Governed dialog probe</DialogTitle>
            <DialogDescription>
              Inspect `data-state` on dialog-content.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </StoryFrame>
  );
}

// ─── Dialog ────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed modal dialog for ERP detail views, editable forms, multi-step workflows, and recoverable errors. Supports governed `density`, `radius`, and `shadow` on `DialogContent`. Use `AlertDialog` for irreversible confirmations (delete, void, post).",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state on DialogContent",
      table: { defaultValue: { summary: "ready" } },
    },
    density: {
      control: "select",
      options: [...DENSITIES],
      description: "Panel density on DialogContent",
    },
    radius: {
      control: "select",
      options: [...GOVERNED_PANEL_RADII],
      description: "Panel radius on DialogContent",
    },
    shadow: {
      control: "select",
      options: [...GOVERNED_PANEL_SHADOWS],
      description: "Panel shadow on DialogContent",
    },
  },
  args: {
    state: "ready",
    density: "standard",
    radius: "md",
    shadow: "overlay",
  },
} satisfies Meta;

export default meta;
type Story = RenderStory<typeof meta>;

// ─── Basic dialogs ─────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => <DialogPlaygroundDemo {...governedPanelStoryProps(args)} />,
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Trigger opens a modal dialog with title, description, and footer close control.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open dialog/i }));
    await expect(screen.getByRole("dialog")).toBeInTheDocument();
    await expect(
      screen.getByRole("heading", { name: /record details/i })
    ).toBeInTheDocument();
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button intent="primary">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record details</DialogTitle>
          <DialogDescription>
            Review the selected record before making changes.
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Record content goes here.
        </p>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  name: "Dialog — No Header Close",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Session notice
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Session expiring soon</DialogTitle>
          <DialogDescription>
            You must acknowledge this message to continue working.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm">
          Your session will expire in 5 minutes due to inactivity. Save open
          records before the session ends.
        </p>
        <DialogFooter>
          <Button emphasis="solid" intent="primary">
            Acknowledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FooterWithCloseButton: Story = {
  name: "Dialog — Footer Close Button",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          View summary
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Quarterly close summary</DialogTitle>
          <DialogDescription>
            Read-only snapshot — no edits in this dialog.
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Revenue {formatCurrency(1_284_000)} · Expenses{" "}
          {formatCurrency(942_000)}
        </p>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};

export const OpenByDefault: Story = {
  name: "Dialog — Open (Canvas Preview)",
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice INV-2026-0042</DialogTitle>
          <DialogDescription>
            Canvas preview — dialog open by default for visual regression.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Vendor</span>
            <span className="text-sm">Acme Supplies Ltd.</span>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Balance due</span>
            <span className="font-semibold text-sm tabular-nums">
              {formatCurrency(24_850)}
            </span>
          </StoryRow>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            Record payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
          'Consumer passes `data-slot="override"` on `DialogContent` — governed values (`data-slot="dialog-content"`, `data-component="Dialog"`, `data-recipe="surface"`) must win in the DOM.',
      },
    },
  },
  render: () => (
    <Dialog defaultOpen>
      <DialogContent
        data-component="Override"
        data-slot="override"
        data-testid="governance-dialog-content"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Data authority probe</DialogTitle>
          <DialogDescription>
            Inspect the content root — governed `data-*` attributes must
            override consumer props.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Reference map of emitted `data-slot` values from `primitive-registry.ts`. Internal roles (`label`, `state`, `body`) emit `dialog-title`, `dialog-description`, `dialog-overlay`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → dialog-content · body → dialog-overlay · header → dialog-header
          · footer → dialog-footer · label → dialog-title · state →
          dialog-description · close-button → dialog-close-button · close-label
          → dialog-close-label
        </p>
        <Dialog defaultOpen>
          <DialogContent data-testid="slot-map-content">
            <DialogHeader>
              <DialogTitle>Inspect slot attributes</DialogTitle>
              <DialogDescription>
                Open DevTools and verify `data-component`, `data-recipe`, and
                `data-slot` on each dialog part.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
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
        <DialogStateProbe key={state} state={state} />
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
          "`DialogTitle` and `DialogDescription` provide accessible names. Header close button includes a screen-reader label. Focus is trapped while open; close returns focus to trigger.",
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Accessible dialog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit employee EMP-1024</DialogTitle>
          <DialogDescription>
            Changes apply to the active employee record only.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="xs">
          <Label htmlFor="a11y-name">Full name</Label>
          <Input defaultValue="Jane Doe" id="a11y-name" />
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
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
        <Dialog key={label}>
          <DialogTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              {label}
            </Button>
          </DialogTrigger>
          <DialogContent density={density} radius={radius} shadow="overlay">
            <DialogHeader>
              <DialogTitle>Surface probe</DialogTitle>
              <DialogDescription>{label}</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      ))}
    </StoryStack>
  ),
};

// ─── ERP form dialogs ─────────────────────────────────────────────────────

export const AddEmployee: Story = {
  name: "ERP — Add Employee Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button intent="primary">
          <UserPlusIcon />
          Add employee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new employee</DialogTitle>
          <DialogDescription>
            Required fields are marked with *. Employee ID is generated on save.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="md">
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="dlg-first">First name *</Label>
              <Input id="dlg-first" placeholder="Jane" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="dlg-last">Last name *</Label>
              <Input id="dlg-last" placeholder="Doe" />
            </StoryStack>
          </StoryRow>
          <Field>
            <FieldLabel htmlFor="dlg-email">Work email *</FieldLabel>
            <Input
              id="dlg-email"
              placeholder="jane.doe@company.com"
              type="email"
            />
            <FieldDescription>
              Used for SSO login and approval notifications.
            </FieldDescription>
          </Field>
          <StoryStack gap="xs">
            <Label htmlFor="dlg-dept">Department</Label>
            <Select>
              <SelectTrigger id="dlg-dept">
                <SelectValue placeholder="Select department…" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d.toLowerCase()}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="dlg-role">Job title</Label>
            <Input id="dlg-role" placeholder="Senior software engineer" />
          </StoryStack>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            <SaveIcon />
            Create employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const EditRecord: Story = {
  name: "ERP — Edit Invoice Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Edit invoice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit invoice INV-2026-0042</DialogTitle>
          <DialogDescription>
            Changes are audited. Posted invoices require finance approval.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryStack gap="xs">
            <Label htmlFor="edit-vendor">Vendor</Label>
            <Input defaultValue="Acme Supplies Ltd." id="edit-vendor" />
          </StoryStack>
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input defaultValue="24850.00" id="edit-amount" type="number" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="edit-currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="edit-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="sgd">SGD</SelectItem>
                </SelectContent>
              </Select>
            </StoryStack>
          </StoryRow>
          <StoryStack gap="xs">
            <Label htmlFor="edit-due">Due date</Label>
            <Input defaultValue="2026-07-15" id="edit-due" type="date" />
          </StoryStack>
        </StoryStack>
        <DialogFooter>
          <Button emphasis="ghost" intent="secondary">
            <XIcon />
            Discard
          </Button>
          <Button emphasis="solid" intent="primary">
            <SaveIcon />
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const RecordDetailView: Story = {
  name: "ERP — Record Detail View",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <FileTextIcon />
          View invoice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              INV-2026-0042
            </span>
            <DialogTitle>Acme Supplies Ltd.</DialogTitle>
          </StoryStack>
          <DialogDescription>Net 30 · Due Jul 15, 2026</DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Status</span>
            <Badge emphasis="soft" tone="warning">
              Awaiting payment
            </Badge>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">
              Invoice amount
            </span>
            <span>{formatCurrency(24_850)}</span>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Amount paid</span>
            <span className="tabular-nums">{formatCurrency(0)}</span>
          </StoryRow>
          <Separator />
          <StoryRow justify="between">
            <span className="font-medium text-sm">Balance due</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(24_850)}
            </span>
          </StoryRow>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            <CreditCardIcon />
            Record payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const CreatePurchaseOrder: Story = {
  name: "ERP — Create Purchase Order",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button intent="primary">
          <PackageIcon />
          New PO
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create purchase order</DialogTitle>
          <DialogDescription>
            PO number assigned on submit. Link to an approved requisition if
            available.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryStack gap="xs">
            <Label htmlFor="po-vendor">Vendor *</Label>
            <Input id="po-vendor" placeholder="Search vendor…" />
          </StoryStack>
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="po-cost">Cost center</Label>
              <Input id="po-cost" placeholder="210 — Manufacturing" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="po-need">Need by</Label>
              <Input id="po-need" type="date" />
            </StoryStack>
          </StoryRow>
          <StoryStack gap="xs">
            <Label htmlFor="po-notes">Internal notes</Label>
            <Textarea
              id="po-notes"
              placeholder="Delivery instructions or budget reference…"
            />
          </StoryStack>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            Create PO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const RecordPayment: Story = {
  name: "ERP — Record Payment Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button intent="primary">
          <CreditCardIcon />
          Record payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record payment — INV-2026-0042</DialogTitle>
          <DialogDescription>
            Balance due {formatCurrency(24_850)} · Acme Supplies Ltd.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="pay-amount">Payment amount *</Label>
              <Input defaultValue="24850" id="pay-amount" type="number" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="pay-date">Payment date *</Label>
              <Input id="pay-date" type="date" />
            </StoryStack>
          </StoryRow>
          <StoryStack gap="xs">
            <Label htmlFor="pay-method">Payment method</Label>
            <Select defaultValue="ach">
              <SelectTrigger id="pay-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ach">ACH transfer</SelectItem>
                <SelectItem value="wire">Wire transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="pay-ref">Reference number</Label>
            <Input id="pay-ref" placeholder="Bank confirmation or check #" />
          </StoryStack>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            Post payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ApprovalComment: Story = {
  name: "ERP — Approval Comment Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <CheckCircle2Icon />
          Approve with comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve expense EXP-2026-042</DialogTitle>
          <DialogDescription>
            Optional comment is stored in the approval audit trail.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="xs">
          <Label htmlFor="approval-comment">Comment</Label>
          <Textarea
            id="approval-comment"
            placeholder="Policy exception approved per CFO memo…"
          />
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            Confirm approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const QuickAssignUser: Story = {
  name: "ERP — Quick Assign Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          <UserPlusIcon />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent density="compact" radius="sm">
        <DialogHeader>
          <DialogTitle>Assign PO-2026-1184</DialogTitle>
          <DialogDescription>
            Route to a reviewer in the procurement queue.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="xs">
          <Label htmlFor="assign-user">Assignee</Label>
          <Select>
            <SelectTrigger id="assign-user">
              <SelectValue placeholder="Select user…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jane">Jane Doe — Finance</SelectItem>
              <SelectItem value="alex">Alex Brown — Operations</SelectItem>
              <SelectItem value="sam">Sam Chen — HR</SelectItem>
            </SelectContent>
          </Select>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary" size="sm">
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ImportColumnMapping: Story = {
  name: "ERP — Import Column Mapping",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <UploadIcon />
          Map import columns
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Map employee import columns</DialogTitle>
          <DialogDescription>
            File: payroll_june_2026.xlsx · 248 rows detected
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          {[
            { file: "emp_id", field: "Employee ID" },
            { file: "full_name", field: "Full name" },
            { file: "dept_code", field: "Department" },
          ].map(({ file, field }) => (
            <StoryRow align="center" gap="md" key={file}>
              <span className="font-mono text-muted-foreground text-xs">
                {file}
              </span>
              <span className="text-muted-foreground text-xs">→</span>
              <span className="text-sm">{field}</span>
            </StoryRow>
          ))}
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            Run import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AttachmentUpload: Story = {
  name: "ERP — Attachment Upload Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <UploadIcon />
          Upload attachments
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload supporting documents</DialogTitle>
          <DialogDescription>
            Expense report EXP-2026-042 · PDF or image, max 10 MB each
          </DialogDescription>
        </DialogHeader>
        <StoryStack
          className="rounded-md border border-border border-dashed"
          gap="sm"
          padding="lg"
        >
          <StoryRow align="center" justify="center">
            <UploadIcon
              aria-hidden="true"
              className="size-8 text-muted-foreground"
            />
          </StoryRow>
          <p className="text-center text-muted-foreground text-sm">
            Drag files here or click to browse
          </p>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            Upload files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const BulkEditFields: Story = {
  name: "ERP — Bulk Edit Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Bulk edit (8 selected)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk edit invoices</DialogTitle>
          <DialogDescription>
            Changes apply to all 8 selected records. Empty fields are skipped.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryStack gap="xs">
            <Label htmlFor="bulk-status">Status</Label>
            <Select>
              <SelectTrigger id="bulk-status">
                <SelectValue placeholder="No change" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="bulk-assignee">Assignee</Label>
            <Select>
              <SelectTrigger id="bulk-assignee">
                <SelectValue placeholder="No change" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jane">Jane Doe</SelectItem>
                <SelectItem value="alex">Alex Brown</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            Apply to 8 records
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const RecoverableError: Story = {
  name: "ERP — Recoverable Error Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog defaultOpen={false}>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Sync failed
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <StoryRow align="center" gap="sm">
            <AlertCircleIcon
              aria-hidden="true"
              className="size-5 text-destructive"
            />
            <DialogTitle>Bank sync interrupted</DialogTitle>
          </StoryRow>
          <DialogDescription>
            Payment batch BATCH-2026-06-18 could not reach the banking API. Your
            data is safe — retry or save as draft.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            Retry sync
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const VendorQuickAdd: Story = {
  name: "ERP — Vendor Quick Add",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          <Building2Icon />
          Quick add vendor
        </Button>
      </DialogTrigger>
      <DialogContent density="compact" radius="sm">
        <DialogHeader>
          <DialogTitle>Register vendor</DialogTitle>
          <DialogDescription>
            Minimum fields to create a draft vendor record.
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryStack gap="xs">
            <Label htmlFor="v-name">Legal name *</Label>
            <Input id="v-name" placeholder="Acme Supplies Ltd." />
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="v-tax">Tax ID</Label>
            <Input id="v-tax" placeholder="12-3456789" />
          </StoryStack>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary" size="sm">
            Create vendor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WorkflowStepDialog: Story = {
  name: "ERP — Workflow Step Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button intent="primary">Continue workflow</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Step 2 — Line items</DialogTitle>
          <DialogDescription>
            PO-2026-1184 · Add items before routing to approval
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="sm">
          <StoryRow justify="between">
            <span className="text-sm">Industrial fasteners (×500)</span>
            <span className="text-sm tabular-nums">{formatCurrency(6000)}</span>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-sm">Safety gloves (×200)</span>
            <span className="text-sm tabular-nums">{formatCurrency(1800)}</span>
          </StoryRow>
          <Button emphasis="outline" intent="secondary" size="sm">
            <PackageIcon />
            Add line item
          </Button>
        </StoryStack>
        <DialogFooter>
          <Button emphasis="ghost" intent="secondary">
            Back
          </Button>
          <Button emphasis="solid" intent="primary">
            Next: Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AsyncSaving: Story = {
  name: "ERP — Async Save (Interactive)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <AsyncSaveDialogComponent />
    </StoryFrame>
  ),
};

export const DialogVsAlertDialog: Story = {
  name: "ERP — Dialog vs AlertDialog",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Use `Dialog` for forms, detail views, and recoverable flows. Use `AlertDialog` (Primitives/AlertDialog) for irreversible confirmations.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Dialog — editable form</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                Edit invoice
              </Button>
            </DialogTrigger>
            <DialogContent density="compact" radius="sm">
              <DialogHeader>
                <DialogTitle>Edit amount</DialogTitle>
              </DialogHeader>
              <Input defaultValue="24850" type="number" />
              <DialogFooter>
                <DialogCancelButton />
                <Button size="sm">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            AlertDialog — irreversible action
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/AlertDialog for delete, void, and post confirmations
          </span>
          <Button emphasis="soft" intent="destructive" size="sm">
            Delete invoice (AlertDialog)
          </Button>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ExportPreview: Story = {
  name: "ERP — Export Preview Dialog",
  parameters: { layout: "padded" },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <DownloadIcon />
          Export preview
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export employee roster</DialogTitle>
          <DialogDescription>
            248 records · CSV · Columns: ID, name, department, status
          </DialogDescription>
        </DialogHeader>
        <StoryStack gap="xs">
          <span className="text-muted-foreground text-sm">
            EMP-1024, Jane Doe, Finance, Active
          </span>
          <span className="text-muted-foreground text-sm">
            EMP-2048, Alex Brown, Operations, Active
          </span>
          <span className="text-muted-foreground text-sm">
            EMP-3072, Sam Chen, HR, On leave
          </span>
        </StoryStack>
        <DialogFooter>
          <DialogCancelButton />
          <Button emphasis="solid" intent="primary">
            <DownloadIcon />
            Download CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
