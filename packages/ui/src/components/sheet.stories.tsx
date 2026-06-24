import {
  DENSITIES,
  GOVERNED_PANEL_RADII,
  GOVERNED_PANEL_SHADOWS,
  GOVERNED_STATES,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircleIcon,
  Building2Icon,
  CheckCircle2Icon,
  CreditCardIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  HistoryIcon,
  PackageIcon,
  PlusIcon,
  SaveIcon,
  SettingsIcon,
  UploadIcon,
  UserIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { sheetStoryProps, type RenderStory } from "./_storybook/story-types";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Spinner } from "./spinner";
import { Switch } from "./switch";
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

const MODULE_LINKS = [
  "Finance · Invoices",
  "Procurement · Purchase orders",
  "HR · Employee roster",
  "Inventory · Stock levels",
] as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function SheetCancelButton() {
  return (
    <SheetClose asChild>
      <Button emphasis="ghost" intent="secondary">
        Cancel
      </Button>
    </SheetClose>
  );
}

function ToggleRow({
  id,
  label,
  defaultChecked,
}: {
  readonly id: string;
  readonly label: string;
  readonly defaultChecked?: boolean;
}) {
  return (
    <StoryRow justify="between">
      <span className="font-normal text-sm">
        <Label htmlFor={id}>{label}</Label>
      </span>
      <Switch
        id={id}
        {...(defaultChecked === undefined ? {} : { defaultChecked })}
        size="sm"
      />
    </StoryRow>
  );
}

function AsyncSaveSheetComponent() {
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
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button intent="primary">Save invoice changes</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={!saving}>
        <SheetHeader>
          <SheetTitle>
            {saving ? "Saving changes…" : "Update invoice INV-2026-0042"}
          </SheetTitle>
          <SheetDescription>
            {saving
              ? "Please wait while the record is saved to the ledger."
              : "Side panel edit — list view stays visible behind overlay."}
          </SheetDescription>
        </SheetHeader>
        {saving ? (
          <StoryRow gap="md" justify="center" paddingY="md">
            <Spinner />
            <span className="text-muted-foreground text-sm">
              Updating invoice #INV-0042…
            </span>
          </StoryRow>
        ) : (
          <StoryStack gap="sm" paddingX="md">
            <StoryStack gap="xs">
              <Label htmlFor="sh-async-vendor">Vendor</Label>
              <Input defaultValue="Acme Supplies Ltd." id="sh-async-vendor" />
            </StoryStack>
            <StoryStack gap="xs">
              <Label htmlFor="sh-async-amount">Amount</Label>
              <Input defaultValue="24850" id="sh-async-amount" type="number" />
            </StoryStack>
          </StoryStack>
        )}
        <SheetFooter>
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
                <SaveIcon />
                Save changes
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SheetPlaygroundDemo({
  density = "standard",
  radius = "md",
  shadow = "overlay",
  side = "right",
  state = "ready",
}: {
  readonly density?: (typeof DENSITIES)[number];
  readonly radius?: (typeof GOVERNED_PANEL_RADII)[number];
  readonly shadow?: (typeof GOVERNED_PANEL_SHADOWS)[number];
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly state?: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <Sheet defaultOpen>
      <SheetContent
        density={density}
        radius={radius}
        shadow={shadow}
        side={side}
        state={state}
      >
        <SheetHeader>
          <SheetTitle>Sheet playground</SheetTitle>
          <SheetDescription>
            Adjust density, radius, shadow, side, and governed state from
            controls.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetCancelButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SheetStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryFrame width="md">
      <p className="font-mono text-muted-foreground text-xs">
        state=&quot;{state}&quot;
      </p>
      <Sheet defaultOpen>
        <SheetContent showCloseButton={false} state={state}>
          <SheetHeader>
            <SheetTitle>Governed sheet probe</SheetTitle>
            <SheetDescription>
              Inspect `data-state` on sheet-content.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </StoryFrame>
  );
}

// ─── Sheet ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed slide-in panel for ERP side forms, filter panels, record detail, and settings. Slides from any edge (`side`). Supports governed `density`, `radius`, `shadow`, and optional header close via `showCloseButton`. Prefer `Drawer` for mobile bottom sheets and `Dialog` for centered modals.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state on SheetContent",
      table: { defaultValue: { summary: "ready" } },
    },
    density: {
      control: "select",
      options: [...DENSITIES],
      description: "Panel density on SheetContent",
    },
    radius: {
      control: "select",
      options: [...GOVERNED_PANEL_RADII],
      description: "Panel radius on SheetContent",
    },
    shadow: {
      control: "select",
      options: [...GOVERNED_PANEL_SHADOWS],
      description: "Panel shadow on SheetContent",
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Edge the sheet slides in from",
    },
  },
  args: {
    state: "ready",
    density: "standard",
    radius: "md",
    shadow: "overlay",
    side: "right",
  },
} satisfies Meta;

export default meta;
type Story = RenderStory<typeof meta>;

// ─── Playground & governance probes ────────────────────────────────────────

export const Playground: Story = {
  render: (args) => <SheetPlaygroundDemo {...sheetStoryProps(args)} />,
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` on `SheetContent` — governed values must win in the DOM.',
      },
    },
  },
  render: () => (
    <Sheet defaultOpen>
      <SheetContent
        data-component="Override"
        data-slot="override"
        data-testid="governance-sheet-content"
        showCloseButton={false}
        state="ready"
      >
        <SheetHeader>
          <SheetTitle>Data authority probe</SheetTitle>
          <SheetDescription>
            Inspect the content root — governed `data-*` attributes must
            override consumer props.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Reference map of emitted `data-slot` values. Internal roles (`label`, `state`, `body`) emit `sheet-title`, `sheet-description`, `sheet-overlay`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → sheet-content · body → sheet-overlay · header → sheet-header ·
          footer → sheet-footer · label → sheet-title · state →
          sheet-description · close-button → sheet-close-button · close-label →
          sheet-close-label
        </p>
        <Sheet defaultOpen>
          <SheetContent data-testid="slot-map-content" side="right">
            <SheetHeader>
              <SheetTitle>Inspect slot attributes</SheetTitle>
              <SheetDescription>
                Open DevTools and verify `data-component`, `data-recipe`, and
                `data-slot` on each sheet part.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetCancelButton />
            </SheetFooter>
          </SheetContent>
        </Sheet>
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
        <SheetStateProbe key={state} state={state} />
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
          "`SheetTitle` and `SheetDescription` wire `aria-labelledby` / `aria-describedby`. Header close includes sr-only label; icon is `aria-hidden`.",
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Accessible sheet
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit employee EMP-1024</SheetTitle>
          <SheetDescription>
            Changes apply to the active employee record only.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="xs" paddingX="md">
          <Label htmlFor="sh-a11y-name">Full name</Label>
          <Input defaultValue="Jane Doe" id="sh-a11y-name" />
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
        <Sheet key={label}>
          <SheetTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              {label}
            </Button>
          </SheetTrigger>
          <SheetContent density={density} radius={radius} shadow="overlay">
            <SheetHeader>
              <SheetTitle>Surface probe</SheetTitle>
              <SheetDescription>{label}</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetCancelButton />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </StoryStack>
  ),
};

// ─── Basic directions ──────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="md">
      <Sheet>
        <SheetTrigger asChild>
          <Button intent="primary">Open panel</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Panel title</SheetTitle>
            <SheetDescription>Panel description or context.</SheetDescription>
          </SheetHeader>
          <StoryStack paddingX="md">
            <p className="text-muted-foreground text-sm">Content goes here.</p>
          </StoryStack>
          <SheetFooter>
            <Button emphasis="solid" intent="primary">
              Confirm
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </StoryFrame>
  ),
};

export const OpenByDefault: Story = {
  name: "Sheet — Open (Canvas Preview)",
  render: () => (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter panel</SheetTitle>
          <SheetDescription>
            Canvas preview — sheet open by default for visual regression.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Status</span>
            <Badge emphasis="soft" tone="info">
              Active
            </Badge>
          </StoryRow>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const FromLeft: Story = {
  name: "Sheet — Left Side",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Open left
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Module navigation</SheetTitle>
          <SheetDescription>Jump between ERP modules.</SheetDescription>
        </SheetHeader>
        <StoryStack gap="xs" paddingX="md">
          {MODULE_LINKS.map((module) => (
            <Button emphasis="ghost" intent="quiet" key={module} size="sm">
              {module}
            </Button>
          ))}
        </StoryStack>
      </SheetContent>
    </Sheet>
  ),
};

export const FromBottom: Story = {
  name: "Sheet — Bottom Bulk Actions",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          8 records selected
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bulk actions</SheetTitle>
          <SheetDescription>
            Apply an action to 8 selected invoices.
          </SheetDescription>
        </SheetHeader>
        <StoryRow align="center" gap="sm" justify="center" paddingX="md" wrap>
          <Button emphasis="soft" intent="primary" size="sm">
            <CheckCircle2Icon />
            Approve
          </Button>
          <Button emphasis="soft" intent="destructive" size="sm">
            <XIcon />
            Reject
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            <DownloadIcon />
            Export
          </Button>
        </StoryRow>
      </SheetContent>
    </Sheet>
  ),
};

export const WithoutCloseButton: Story = {
  name: "Sheet — No Header Close",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Guided setup
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Complete vendor onboarding</SheetTitle>
          <SheetDescription>
            Finish required steps before payments can be issued.
          </SheetDescription>
        </SheetHeader>
        <StoryStack paddingX="md">
          <p className="text-muted-foreground text-sm">
            Upload W-9 and banking details for Acme Supplies Ltd.
          </p>
        </StoryStack>
        <SheetFooter>
          <Button emphasis="solid" intent="primary">
            Continue
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const FooterWithCloseButton: Story = {
  name: "Sheet — Footer Dismiss",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          View summary
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Quarterly close summary</SheetTitle>
          <SheetDescription>
            Read-only snapshot — dismiss via footer action.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Revenue</span>
            <span className="text-sm tabular-nums">
              {formatCurrency(1_284_000)}
            </span>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Expenses</span>
            <span className="text-sm tabular-nums">
              {formatCurrency(942_000)}
            </span>
          </StoryRow>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const AllSides: Story = {
  name: "Matrix — All Sides",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Side: {side}</SheetTitle>
              <SheetDescription>
                Sheet sliding from the {side}.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </StoryRow>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const FilterPanel: Story = {
  name: "ERP — Filter Panel",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <FilterIcon />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter records</SheetTitle>
          <SheetDescription>
            Narrow results by applying one or more filters.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="md" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="sf-status">Status</Label>
            <Select>
              <SelectTrigger id="sf-status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {["Active", "Inactive", "Pending", "Archived"].map((s) => (
                  <SelectItem key={s} value={s.toLowerCase()}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="sf-dept">Department</Label>
            <Select>
              <SelectTrigger id="sf-dept">
                <SelectValue placeholder="All departments" />
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
            <Label htmlFor="sf-date-from">Date range</Label>
            <StoryRow gap="xs">
              <Input id="sf-date-from" type="date" />
              <span className="self-center text-muted-foreground text-sm">
                to
              </span>
              <Input id="sf-date-to" type="date" />
            </StoryRow>
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="sf-search">Keyword search</Label>
            <Input id="sf-search" placeholder="Filter by name or ID…" />
          </StoryStack>
          <Separator />
          <StoryStack gap="sm">
            <span className="font-medium text-sm">Quick filters</span>
            <ToggleRow id="qf-overdue" label="Overdue only" />
            <ToggleRow defaultChecked id="qf-mine" label="Assigned to me" />
            <ToggleRow id="qf-unread" label="Unreviewed" />
          </StoryStack>
        </StoryStack>
        <SheetFooter>
          <Button emphasis="ghost" intent="secondary">
            <XIcon />
            Clear all
          </Button>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const AddRecordPanel: Story = {
  name: "ERP — Add Record Side Panel",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button intent="primary">
          <PlusIcon />
          New employee
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create new employee</SheetTitle>
          <SheetDescription>
            Complete the form to onboard a new employee.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="ap-first">First name *</Label>
              <Input id="ap-first" placeholder="Jane" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="ap-last">Last name *</Label>
              <Input id="ap-last" placeholder="Doe" />
            </StoryStack>
          </StoryRow>
          <StoryStack gap="xs">
            <Label htmlFor="ap-email">Work email *</Label>
            <Input id="ap-email" placeholder="jane@company.com" type="email" />
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="ap-dept">Department</Label>
            <Select>
              <SelectTrigger id="ap-dept">
                <SelectValue placeholder="Select…" />
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
            <Label htmlFor="ap-start">Start date</Label>
            <Input id="ap-start" type="date" />
          </StoryStack>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            <SaveIcon />
            Create
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const UserSettingsPanel: Story = {
  name: "ERP — User Settings Panel",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Settings"
          emphasis="ghost"
          intent="quiet"
          presentation="icon"
        >
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User settings</SheetTitle>
          <SheetDescription>
            Configure your account and workspace preferences.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="md" paddingX="md">
          <StoryStack gap="sm">
            <span className="font-semibold text-sm">Profile</span>
            <StoryStack gap="xs">
              <Label htmlFor="us-name">Display name</Label>
              <Input defaultValue="Jane Doe" id="us-name" />
            </StoryStack>
            <StoryStack gap="xs">
              <Label htmlFor="us-email">Email</Label>
              <Input
                defaultValue="jane.doe@corp.com"
                disabled
                id="us-email"
                type="email"
              />
            </StoryStack>
          </StoryStack>
          <Separator />
          <StoryStack gap="sm">
            <span className="font-semibold text-sm">Notifications</span>
            <ToggleRow
              defaultChecked
              id="nt-email"
              label="Email notifications"
            />
            <ToggleRow
              defaultChecked
              id="nt-approval"
              label="Approval reminders"
            />
            <ToggleRow id="nt-system" label="System announcements" />
          </StoryStack>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            <SaveIcon />
            Save settings
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const RecordDetailPanel: Story = {
  name: "ERP — Record Detail Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <FileTextIcon />
          View invoice
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              INV-2026-0042
            </span>
            <SheetTitle>Acme Supplies Ltd.</SheetTitle>
          </StoryStack>
          <SheetDescription>Net 30 · Due Jul 15, 2026</SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
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
            <span className="text-muted-foreground text-sm">Balance due</span>
            <span className="font-semibold">{formatCurrency(24_850)}</span>
          </StoryRow>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            <CreditCardIcon />
            Record payment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ApprovalReviewPanel: Story = {
  name: "ERP — Approval Review Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Review EXP-2026-042
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Expense approval</SheetTitle>
          <SheetDescription>
            {formatCurrency(1240)} · Travel — Client visit SF
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Submitted by</span>
            <span className="text-sm">Alex Brown</span>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Policy</span>
            <Badge emphasis="soft" tone="warning">
              Requires manager
            </Badge>
          </StoryRow>
          <Field>
            <FieldLabel htmlFor="sh-approval-note">Comment</FieldLabel>
            <Textarea
              id="sh-approval-note"
              placeholder="Optional note for audit trail…"
            />
          </Field>
        </StoryStack>
        <SheetFooter>
          <Button emphasis="soft" intent="destructive">
            Reject
          </Button>
          <Button emphasis="solid" intent="primary">
            <CheckCircle2Icon />
            Approve
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ExportOptionsPanel: Story = {
  name: "ERP — Export Options Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <DownloadIcon />
          Export
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Export employee roster</SheetTitle>
          <SheetDescription>
            248 records match current filters.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="sh-format">Format</Label>
            <Select defaultValue="csv">
              <SelectTrigger id="sh-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF summary</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
          <StoryStack gap="sm">
            <span className="font-medium text-sm">Include columns</span>
            {[
              { id: "col-id", label: "Employee ID", checked: true },
              { id: "col-name", label: "Full name", checked: true },
              { id: "col-dept", label: "Department", checked: true },
              {
                id: "col-salary",
                label: "Salary (restricted)",
                checked: false,
              },
            ].map(({ id, label, checked }) => (
              <StoryRow align="center" gap="sm" key={id}>
                <Checkbox defaultChecked={checked} id={id} />
                <span className="font-normal text-sm">
                  <Label htmlFor={id}>{label}</Label>
                </span>
              </StoryRow>
            ))}
          </StoryStack>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            <DownloadIcon />
            Download
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ColumnVisibilityPanel: Story = {
  name: "ERP — Column Visibility Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Columns
        </Button>
      </SheetTrigger>
      <SheetContent density="compact" radius="sm">
        <SheetHeader>
          <SheetTitle>Toggle columns</SheetTitle>
          <SheetDescription>Employee roster grid</SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          {[
            { id: "cv-id", label: "Employee ID", checked: true },
            { id: "cv-name", label: "Name", checked: true },
            { id: "cv-dept", label: "Department", checked: true },
            { id: "cv-email", label: "Email", checked: false },
            { id: "cv-status", label: "Status", checked: true },
          ].map(({ id, label, checked }) => (
            <StoryRow align="center" gap="sm" key={id}>
              <Checkbox defaultChecked={checked} id={id} />
              <span className="font-normal text-sm">
                <Label htmlFor={id}>{label}</Label>
              </span>
            </StoryRow>
          ))}
        </StoryStack>
        <SheetFooter>
          <Button size="sm">Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const QuickAssignPanel: Story = {
  name: "ERP — Quick Assign Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          <UserPlusIcon />
          Assign
        </Button>
      </SheetTrigger>
      <SheetContent density="compact" radius="sm">
        <SheetHeader>
          <SheetTitle>Assign PO-2026-1184</SheetTitle>
          <SheetDescription>
            Route to procurement queue reviewer.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="xs" paddingX="md">
          <Label htmlFor="sh-assign">Assignee</Label>
          <Select>
            <SelectTrigger id="sh-assign">
              <SelectValue placeholder="Select user…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jane">Jane Doe — Finance</SelectItem>
              <SelectItem value="alex">Alex Brown — Operations</SelectItem>
              <SelectItem value="sam">Sam Chen — HR</SelectItem>
            </SelectContent>
          </Select>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button size="sm">Assign</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ActivityAuditPanel: Story = {
  name: "ERP — Activity Audit Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          <HistoryIcon />
          Activity
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>PO-2026-1184 activity</SheetTitle>
          <SheetDescription>
            Recent audit events on this record.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          {[
            {
              actor: "Jane Doe",
              action: "Approved line item change",
              time: "2h ago",
            },
            {
              actor: "System",
              action: "Vendor quote attached",
              time: "Yesterday",
            },
            {
              actor: "Alex Brown",
              action: "Created purchase order",
              time: "Jun 18",
            },
          ].map(({ actor, action, time }) => (
            <StoryStack gap="xs" key={action}>
              <StoryRow justify="between">
                <span className="font-medium text-sm">{actor}</span>
                <span className="text-muted-foreground text-xs">{time}</span>
              </StoryRow>
              <span className="text-muted-foreground text-sm">{action}</span>
            </StoryStack>
          ))}
        </StoryStack>
      </SheetContent>
    </Sheet>
  ),
};

export const VendorOnboardingPanel: Story = {
  name: "ERP — Vendor Onboarding Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <Building2Icon />
          Onboard vendor
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Register vendor</SheetTitle>
          <SheetDescription>
            Minimum fields to create a draft vendor record.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="sh-v-name">Legal name *</Label>
            <Input id="sh-v-name" placeholder="Acme Supplies Ltd." />
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="sh-v-tax">Tax ID</Label>
            <Input id="sh-v-tax" placeholder="12-3456789" />
          </StoryStack>
          <Field>
            <FieldLabel htmlFor="sh-v-notes">Notes</FieldLabel>
            <Textarea
              id="sh-v-notes"
              placeholder="Payment terms or compliance notes…"
            />
          </Field>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            Create vendor
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const RecordPaymentPanel: Story = {
  name: "ERP — Record Payment Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button intent="primary">
          <CreditCardIcon />
          Record payment
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Record payment</SheetTitle>
          <SheetDescription>
            INV-2026-0042 · Balance {formatCurrency(24_850)}
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-pay-amount">Amount *</Label>
              <Input defaultValue="24850" id="sh-pay-amount" type="number" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-pay-date">Date *</Label>
              <Input id="sh-pay-date" type="date" />
            </StoryStack>
          </StoryRow>
          <StoryStack gap="xs">
            <Label htmlFor="sh-pay-method">Method</Label>
            <Select defaultValue="ach">
              <SelectTrigger id="sh-pay-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ach">ACH transfer</SelectItem>
                <SelectItem value="wire">Wire transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Post payment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const CreatePurchaseOrderPanel: Story = {
  name: "ERP — Create Purchase Order Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button intent="primary">
          <PackageIcon />
          New PO
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create purchase order</SheetTitle>
          <SheetDescription>PO number assigned on submit.</SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="sh-po-vendor">Vendor *</Label>
            <Input id="sh-po-vendor" placeholder="Search vendor…" />
          </StoryStack>
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-po-cost">Cost center</Label>
              <Input id="sh-po-cost" placeholder="210 — Manufacturing" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-po-need">Need by</Label>
              <Input id="sh-po-need" type="date" />
            </StoryStack>
          </StoryRow>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            Create PO
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ImportMappingPanel: Story = {
  name: "ERP — Import Mapping Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <UploadIcon />
          Map import
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Map employee import columns</SheetTitle>
          <SheetDescription>
            payroll_june_2026.xlsx · 248 rows detected
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
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
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Run import
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ModuleNavigationPanel: Story = {
  name: "ERP — Module Navigation Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <UserIcon />
          Modules
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>ERP modules</SheetTitle>
          <SheetDescription>
            Jump to a module without losing list context.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="xs" paddingX="md">
          {MODULE_LINKS.map((module) => (
            <Button emphasis="ghost" intent="quiet" key={module} size="sm">
              {module}
            </Button>
          ))}
        </StoryStack>
      </SheetContent>
    </Sheet>
  ),
};

export const EditInvoicePanel: Story = {
  name: "ERP — Edit Invoice Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Edit invoice
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit invoice INV-2026-0042</SheetTitle>
          <SheetDescription>
            Changes are audited. Posted invoices require finance approval.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="sh-edit-vendor">Vendor</Label>
            <Input defaultValue="Acme Supplies Ltd." id="sh-edit-vendor" />
          </StoryStack>
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-edit-amount">Amount</Label>
              <Input
                defaultValue="24850.00"
                id="sh-edit-amount"
                type="number"
              />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-edit-currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="sh-edit-currency">
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
            <Label htmlFor="sh-edit-due">Due date</Label>
            <Input defaultValue="2026-07-15" id="sh-edit-due" type="date" />
          </StoryStack>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            <SaveIcon />
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const BulkEditPanel: Story = {
  name: "ERP — Bulk Edit Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Bulk edit (8 selected)
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bulk edit invoices</SheetTitle>
          <SheetDescription>
            Changes apply to all 8 selected records. Empty fields are skipped.
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="sh-bulk-status">Status</Label>
            <Select>
              <SelectTrigger id="sh-bulk-status">
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
            <Label htmlFor="sh-bulk-assignee">Assignee</Label>
            <Select>
              <SelectTrigger id="sh-bulk-assignee">
                <SelectValue placeholder="No change" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jane">Jane Doe</SelectItem>
                <SelectItem value="alex">Alex Brown</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Apply to 8 records
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const AttachmentUploadPanel: Story = {
  name: "ERP — Attachment Upload Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <UploadIcon />
          Upload attachments
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload supporting documents</SheetTitle>
          <SheetDescription>
            Expense report EXP-2026-042 · PDF or image, max 10 MB each
          </SheetDescription>
        </SheetHeader>
        <StoryStack
          className="rounded-md border border-border border-dashed"
          gap="sm"
          padding="lg"
          paddingX="md"
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
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Upload files
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const WorkflowStepPanel: Story = {
  name: "ERP — Workflow Step Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button intent="primary">Continue workflow</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Step 2 — Line items</SheetTitle>
          <SheetDescription>
            PO-2026-1184 · Add items before routing to approval
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
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
        <SheetFooter>
          <Button emphasis="ghost" intent="secondary">
            Back
          </Button>
          <Button emphasis="solid" intent="primary">
            Next: Review
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const RecoverableErrorPanel: Story = {
  name: "ERP — Recoverable Error Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Sync failed
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <StoryRow align="center" gap="sm">
            <AlertCircleIcon
              aria-hidden="true"
              className="size-5 text-destructive"
            />
            <SheetTitle>Bank sync interrupted</SheetTitle>
          </StoryRow>
          <SheetDescription>
            Payment batch BATCH-2026-06-18 could not reach the banking API. Your
            data is safe — retry or save as draft.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            Retry sync
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ExportPreviewPanel: Story = {
  name: "ERP — Export Preview Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <DownloadIcon />
          Export preview
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Export employee roster</SheetTitle>
          <SheetDescription>
            248 records · CSV · Columns: ID, name, department, status
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="xs" paddingX="md">
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
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            <DownloadIcon />
            Download CSV
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const StockAdjustmentPanel: Story = {
  name: "ERP — Stock Adjustment Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Adjust stock
        </Button>
      </SheetTrigger>
      <SheetContent density="compact" radius="sm">
        <SheetHeader>
          <SheetTitle>Adjust SKU-8842</SheetTitle>
          <SheetDescription>
            Industrial fasteners · Warehouse A · On hand: 1,240 units
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-adj-qty">Quantity delta *</Label>
              <Input defaultValue="-50" id="sh-adj-qty" type="number" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-adj-reason">Reason</Label>
              <Select defaultValue="cycle">
                <SelectTrigger id="sh-adj-reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cycle">Cycle count</SelectItem>
                  <SelectItem value="damage">Damaged goods</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </StoryStack>
          </StoryRow>
          <Field>
            <FieldLabel htmlFor="sh-adj-note">Notes</FieldLabel>
            <Textarea
              id="sh-adj-note"
              placeholder="Audit note for inventory ledger…"
            />
          </Field>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button size="sm">Post adjustment</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LeaveRequestPanel: Story = {
  name: "ERP — Leave Request Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Request leave
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Time off request</SheetTitle>
          <SheetDescription>
            EMP-1024 · Jane Doe · Balance: 12 days PTO
          </SheetDescription>
        </SheetHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="sh-leave-type">Leave type</Label>
            <Select defaultValue="pto">
              <SelectTrigger id="sh-leave-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pto">Paid time off</SelectItem>
                <SelectItem value="sick">Sick leave</SelectItem>
                <SelectItem value="unpaid">Unpaid leave</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-leave-from">From</Label>
              <Input id="sh-leave-from" type="date" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="sh-leave-to">To</Label>
              <Input id="sh-leave-to" type="date" />
            </StoryStack>
          </StoryRow>
          <Field>
            <FieldLabel htmlFor="sh-leave-note">Manager note</FieldLabel>
            <Textarea
              id="sh-leave-note"
              placeholder="Coverage plan or client commitments…"
            />
          </Field>
        </StoryStack>
        <SheetFooter>
          <SheetCancelButton />
          <Button emphasis="solid" intent="primary">
            Submit request
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const AsyncSaving: Story = {
  name: "ERP — Async Save (Interactive)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <AsyncSaveSheetComponent />
    </StoryFrame>
  ),
};

export const SheetVsDialogVsDrawer: Story = {
  name: "ERP — Sheet vs Dialog vs Drawer",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Sheet: desktop side panels and filters. Dialog: centered modals. Drawer: mobile bottom sheets.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Sheet — side panel</span>
          <span className="text-muted-foreground text-xs">
            Filters, settings, record detail alongside list views
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                <FilterIcon />
                Open filters
              </Button>
            </SheetTrigger>
            <SheetContent density="compact" radius="sm">
              <SheetHeader>
                <SheetTitle>Filter invoices</SheetTitle>
              </SheetHeader>
              <StoryStack gap="xs" paddingX="md">
                <ToggleRow
                  defaultChecked
                  id="vs-overdue"
                  label="Overdue only"
                />
              </StoryStack>
              <SheetFooter>
                <SheetCancelButton />
                <Button size="sm">Apply</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Dialog — centered modal</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Dialog for edit forms and async save
          </span>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Drawer — mobile bottom sheet
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Drawer for touch peek and bulk actions
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
