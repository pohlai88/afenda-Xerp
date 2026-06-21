import type { Meta, StoryObj } from "@storybook/react";
import {
  BarcodeIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  PackageIcon,
  PlusIcon,
  SaveIcon,
  ScanLineIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
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

const SNAP_POINTS = ["200px", "420px", 1] as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function DrawerCancelButton() {
  return (
    <DrawerClose asChild>
      <Button emphasis="ghost" intent="secondary">
        Cancel
      </Button>
    </DrawerClose>
  );
}

function SnapPointsPeekComponent() {
  const [snap, setSnap] = useState<number | string | null>(SNAP_POINTS[0]);

  return (
    <Drawer
      activeSnapPoint={snap}
      fadeFromIndex={0}
      setActiveSnapPoint={setSnap}
      snapPoints={[...SNAP_POINTS]}
    >
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Peek invoice details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>INV-2026-0042</DrawerTitle>
          <DrawerDescription>
            Drag to expand — snap points at peek, half, and full height.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Vendor</span>
            <span className="text-sm">Acme Supplies Ltd.</span>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Balance due</span>
            <span className="font-semibold text-sm">
              {formatCurrency(24_850)}
            </span>
          </StoryRow>
          {snap === 1 || snap === SNAP_POINTS[1] ? (
            <>
              <Separator />
              <StoryRow justify="between">
                <span className="text-muted-foreground text-sm">Due date</span>
                <span className="text-sm">Jul 15, 2026</span>
              </StoryRow>
              <StoryRow justify="between">
                <span className="text-muted-foreground text-sm">
                  Cost center
                </span>
                <span className="text-sm">210 — Manufacturing</span>
              </StoryRow>
              <StoryRow justify="between">
                <span className="text-muted-foreground text-sm">
                  PO reference
                </span>
                <span className="font-mono text-sm">PO-2026-1184</span>
              </StoryRow>
            </>
          ) : null}
        </StoryStack>
        {snap === 1 ? (
          <DrawerFooter>
            <DrawerCancelButton />
            <Button emphasis="solid" intent="primary">
              <CreditCardIcon />
              Record payment
            </Button>
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

// ─── Drawer ──────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed mobile-first bottom sheet (Vaul) for ERP peek panels, bulk actions, filters, and touch workflows. Supports `direction`, `snapPoints`, and governed `density` / `radius` / `shadow` on `DrawerContent`. Prefer `Sheet` for desktop side panels and `Dialog` for centered modals.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic drawers ─────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button intent="primary">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>
            Bottom sheet with drag handle — ideal for mobile ERP workflows.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack paddingX="md">
          <p className="text-muted-foreground text-sm">
            Drawer content goes here.
          </p>
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            Confirm
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const OpenByDefault: Story = {
  name: "Drawer — Open (Canvas Preview)",
  render: () => (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Invoice INV-2026-0042</DrawerTitle>
          <DrawerDescription>
            Canvas preview — drawer open by default for visual regression.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Status</span>
            <Badge emphasis="soft" tone="warning">
              Awaiting payment
            </Badge>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Balance</span>
            <span className="font-semibold text-sm">
              {formatCurrency(24_850)}
            </span>
          </StoryRow>
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            Record payment
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "`DrawerTitle` and `DrawerDescription` provide accessible names. Drag handle is decorative; dismiss via overlay tap or footer actions.",
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Accessible drawer
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit employee EMP-1024</DrawerTitle>
          <DrawerDescription>
            Changes apply to the active employee record only.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="xs" paddingX="md">
          <Label htmlFor="dr-a11y-name">Full name</Label>
          <Input defaultValue="Jane Doe" id="dr-a11y-name" />
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const GovernanceSurfaceVariants: Story = {
  name: "Governance — Surface Variants",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {(
        [
          { label: "standard / md", density: "standard", radius: "md" },
          { label: "compact / sm", density: "compact", radius: "sm" },
          { label: "standard / lg", density: "standard", radius: "lg" },
        ] as const
      ).map(({ label, density, radius }) => (
        <Drawer key={label}>
          <DrawerTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              {label}
            </Button>
          </DrawerTrigger>
          <DrawerContent density={density} radius={radius} shadow="overlay">
            <DrawerHeader>
              <DrawerTitle>Surface probe</DrawerTitle>
              <DrawerDescription>{label}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerCancelButton />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </StoryStack>
  ),
};

export const AllDirections: Story = {
  name: "Matrix — All Directions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {(["top", "right", "bottom", "left"] as const).map((direction) => (
        <Drawer direction={direction} key={direction}>
          <DrawerTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Direction: {direction}</DrawerTitle>
              <DrawerDescription>
                Drawer sliding from the {direction}.
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ))}
    </StoryRow>
  ),
};

// ─── ERP composite patterns ────────────────────────────────────────────────

export const RecordDetailPeek: Story = {
  name: "ERP — Record Detail Peek",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <FileTextIcon />
          View invoice
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              INV-2026-0042
            </span>
            <DrawerTitle>Acme Supplies Ltd.</DrawerTitle>
          </StoryStack>
          <DrawerDescription>Net 30 · Due Jul 15, 2026</DrawerDescription>
        </DrawerHeader>
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
            <span className="text-sm">{formatCurrency(24_850)}</span>
          </StoryRow>
          <StoryRow justify="between">
            <span className="text-muted-foreground text-sm">Amount paid</span>
            <span className="text-sm">{formatCurrency(0)}</span>
          </StoryRow>
          <Separator />
          <StoryRow justify="between">
            <span className="font-medium text-sm">Balance due</span>
            <span className="font-semibold">{formatCurrency(24_850)}</span>
          </StoryRow>
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            <CreditCardIcon />
            Record payment
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const BulkActionsBar: Story = {
  name: "ERP — Bulk Actions Bar",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          8 records selected
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bulk actions</DrawerTitle>
          <DrawerDescription>
            Apply an action to 8 selected invoices.
          </DrawerDescription>
        </DrawerHeader>
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
          <Button emphasis="outline" intent="secondary" size="sm">
            Assign
          </Button>
        </StoryRow>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button emphasis="ghost" intent="secondary" size="sm">
              Clear selection
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const MobileFilterPanel: Story = {
  name: "ERP — Mobile Filter Panel",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <FilterIcon />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter records</DrawerTitle>
          <DrawerDescription>
            Narrow results on mobile without leaving the list view.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="md" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="dr-status">Status</Label>
            <Select>
              <SelectTrigger id="dr-status">
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
            <Label htmlFor="dr-dept">Department</Label>
            <Select>
              <SelectTrigger id="dr-dept">
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
            <Label htmlFor="dr-date-from">Date range</Label>
            <StoryRow gap="xs">
              <Input id="dr-date-from" type="date" />
              <span className="self-center text-muted-foreground text-sm">
                to
              </span>
              <Input id="dr-date-to" type="date" />
            </StoryRow>
          </StoryStack>
          <Separator />
          <StoryStack gap="sm">
            <span className="font-medium text-sm">Quick filters</span>
            {[
              { id: "dr-overdue", label: "Overdue only" },
              { id: "dr-mine", label: "Assigned to me" },
              { id: "dr-unread", label: "Unreviewed" },
            ].map(({ id, label }) => (
              <StoryRow justify="between" key={id}>
                <Label className="font-normal text-sm" htmlFor={id}>
                  {label}
                </Label>
                <Switch id={id} size="sm" />
              </StoryRow>
            ))}
          </StoryStack>
        </StoryStack>
        <DrawerFooter>
          <Button emphasis="ghost" intent="secondary">
            <XIcon />
            Clear all
          </Button>
          <Button emphasis="solid" intent="primary">
            Apply filters
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const QuickAddRecord: Story = {
  name: "ERP — Quick Add Record",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button intent="primary">
          <PlusIcon />
          New employee
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add employee</DrawerTitle>
          <DrawerDescription>
            Minimum fields for a draft employee record on mobile.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="dr-first">First name *</Label>
              <Input id="dr-first" placeholder="Jane" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="dr-last">Last name *</Label>
              <Input id="dr-last" placeholder="Doe" />
            </StoryStack>
          </StoryRow>
          <Field>
            <FieldLabel htmlFor="dr-email">Work email *</FieldLabel>
            <Input
              id="dr-email"
              placeholder="jane.doe@company.com"
              type="email"
            />
            <FieldDescription>
              Used for SSO login and approval notifications.
            </FieldDescription>
          </Field>
          <StoryStack gap="xs">
            <Label htmlFor="dr-dept">Department</Label>
            <Select>
              <SelectTrigger id="dr-dept">
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
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="outline" intent="secondary">
            Save draft
          </Button>
          <Button emphasis="solid" intent="primary">
            <SaveIcon />
            Create
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const ApprovalActions: Story = {
  name: "ERP — Approval Actions",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          Review EXP-2026-042
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Expense approval</DrawerTitle>
          <DrawerDescription>
            {formatCurrency(1240)} · Travel — Client visit SF
          </DrawerDescription>
        </DrawerHeader>
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
          <StoryStack gap="xs">
            <Label htmlFor="dr-approval-note">Comment (optional)</Label>
            <Textarea
              id="dr-approval-note"
              placeholder="Approval note for audit trail…"
            />
          </StoryStack>
        </StoryStack>
        <DrawerFooter>
          <Button emphasis="soft" intent="destructive">
            <XIcon />
            Reject
          </Button>
          <Button emphasis="solid" intent="primary">
            <CheckCircle2Icon />
            Approve
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const RecordPayment: Story = {
  name: "ERP — Record Payment Drawer",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button intent="primary">
          <CreditCardIcon />
          Record payment
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Record payment</DrawerTitle>
          <DrawerDescription>
            INV-2026-0042 · Balance {formatCurrency(24_850)}
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryRow gap="sm" wrap>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="dr-pay-amount">Amount *</Label>
              <Input defaultValue="24850" id="dr-pay-amount" type="number" />
            </StoryStack>
            <StoryStack className="flex-1" gap="xs">
              <Label htmlFor="dr-pay-date">Date *</Label>
              <Input id="dr-pay-date" type="date" />
            </StoryStack>
          </StoryRow>
          <StoryStack gap="xs">
            <Label htmlFor="dr-pay-method">Method</Label>
            <Select defaultValue="ach">
              <SelectTrigger id="dr-pay-method">
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
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            Post payment
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const ActivityFeedPeek: Story = {
  name: "ERP — Activity Feed Peek",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Activity
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>PO-2026-1184 activity</DrawerTitle>
          <DrawerDescription>
            Recent audit events on this record.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          {[
            {
              time: "2h ago",
              actor: "Jane Doe",
              action: "Approved line item change",
            },
            {
              time: "Yesterday",
              actor: "System",
              action: "Vendor quote attached",
            },
            {
              time: "Jun 18",
              actor: "Alex Brown",
              action: "Created purchase order",
            },
          ].map(({ time, actor, action }) => (
            <StoryStack gap="xs" key={action}>
              <StoryRow justify="between">
                <span className="font-medium text-sm">{actor}</span>
                <span className="text-muted-foreground text-xs">{time}</span>
              </StoryRow>
              <span className="text-muted-foreground text-sm">{action}</span>
            </StoryStack>
          ))}
        </StoryStack>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button emphasis="ghost" intent="secondary" size="sm">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WarehouseScan: Story = {
  name: "ERP — Warehouse Scan Input",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button intent="primary">
          <ScanLineIcon />
          Scan item
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Receive inventory</DrawerTitle>
          <DrawerDescription>
            Scan barcode or enter SKU to receive into warehouse WH-01.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="dr-scan">Barcode / SKU</Label>
            <StoryRow gap="xs">
              <Input id="dr-scan" placeholder="Scan or type SKU…" />
              <Button
                aria-label="Open camera scanner"
                emphasis="outline"
                intent="secondary"
                presentation="icon"
              >
                <BarcodeIcon />
              </Button>
            </StoryRow>
          </StoryStack>
          <StoryStack gap="xs">
            <Label htmlFor="dr-qty">Quantity received</Label>
            <Input defaultValue="1" id="dr-qty" type="number" />
          </StoryStack>
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            <PackageIcon />
            Add to receipt
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const OrderSummary: Story = {
  name: "ERP — Order Summary Drawer",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <PackageIcon />
          Order summary
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>PO-2026-1184</DrawerTitle>
          <DrawerDescription>
            Acme Supplies Ltd. · 3 line items
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          {[
            { item: "Industrial fasteners (×500)", amount: 6000 },
            { item: "Safety gloves (×200)", amount: 1800 },
            { item: "Pallet wrap (×40)", amount: 960 },
          ].map(({ item, amount }) => (
            <StoryRow justify="between" key={item}>
              <span className="text-sm">{item}</span>
              <span className="text-sm tabular-nums">
                {formatCurrency(amount)}
              </span>
            </StoryRow>
          ))}
          <Separator />
          <StoryRow justify="between">
            <span className="font-medium text-sm">Total</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(8760)}
            </span>
          </StoryRow>
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            Submit for approval
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const SnapPointsPeek: Story = {
  name: "ERP — Snap Points Peek",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Vaul `snapPoints` enable peek → half → full expansion without a separate detail page.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <SnapPointsPeekComponent />
    </StoryFrame>
  ),
};

export const ExportOptions: Story = {
  name: "ERP — Export Options Drawer",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <DownloadIcon />
          Export
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Export employee roster</DrawerTitle>
          <DrawerDescription>
            248 records match current filters.
          </DrawerDescription>
        </DrawerHeader>
        <StoryStack gap="sm" paddingX="md">
          <StoryStack gap="xs">
            <Label htmlFor="dr-format">Format</Label>
            <Select defaultValue="csv">
              <SelectTrigger id="dr-format">
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
              <StoryRow justify="between" key={id}>
                <Label className="font-normal text-sm" htmlFor={id}>
                  {label}
                </Label>
                <Switch defaultChecked={checked} id={id} size="sm" />
              </StoryRow>
            ))}
          </StoryStack>
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            <DownloadIcon />
            Download
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const AttachmentUpload: Story = {
  name: "ERP — Attachment Upload Drawer",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="outline" intent="secondary">
          <UploadIcon />
          Upload
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Upload documents</DrawerTitle>
          <DrawerDescription>
            EXP-2026-042 · PDF or image, max 10 MB each
          </DrawerDescription>
        </DrawerHeader>
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
            Drag files here or tap to browse
          </p>
        </StoryStack>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="primary">
            Upload files
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const DeleteConfirmationPeek: Story = {
  name: "ERP — Soft Delete Peek",
  parameters: { layout: "padded" },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button emphasis="soft" intent="destructive" size="sm">
          <Trash2Icon />
          Delete draft
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delete draft PO-2026-D12?</DrawerTitle>
          <DrawerDescription>
            Draft purchase orders can be restored within 30 days. Posted orders
            require finance approval to void.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerCancelButton />
          <Button emphasis="solid" intent="destructive">
            <Trash2Icon />
            Delete draft
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const DrawerVsSheetVsDialog: Story = {
  name: "ERP — Drawer vs Sheet vs Dialog",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Drawer: mobile peek and touch workflows. Sheet: desktop side panels. Dialog: centered modals and forms.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Drawer — mobile bottom sheet
          </span>
          <Drawer>
            <DrawerTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                Peek details
              </Button>
            </DrawerTrigger>
            <DrawerContent density="compact" radius="sm">
              <DrawerHeader>
                <DrawerTitle>Quick peek</DrawerTitle>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerCancelButton />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Sheet — side panel</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Sheet for filter panels and settings
          </span>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Dialog — centered modal</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Dialog for full edit forms and async save
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
