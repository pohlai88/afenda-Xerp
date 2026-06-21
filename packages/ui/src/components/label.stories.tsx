import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BuildingIcon,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  HashIcon,
  MailIcon,
  PackageIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Field, FieldDescription, FieldLabel } from "./field";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

// ─── Helpers ───────────────────────────────────────────────────────────────

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-destructive">
      {" "}
      *
    </span>
  );
}

function LabeledControl({
  id,
  label,
  required,
  optional,
  hint,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly optional?: boolean;
  readonly hint?: string;
  readonly children: ReactNode;
}) {
  return (
    <StoryStack gap="xs">
      <StoryRow align="center" gap="sm" wrap>
        <Label htmlFor={id}>
          {label}
          {required ? <RequiredMark /> : null}
        </Label>
        {optional ? (
          <span className="text-muted-foreground text-xs">(optional)</span>
        ) : null}
      </StoryRow>
      {hint ? (
        <span className="text-muted-foreground text-xs">{hint}</span>
      ) : null}
      {children}
    </StoryStack>
  );
}

function IconLabel({
  htmlFor,
  icon: Icon,
  label,
}: {
  readonly htmlFor: string;
  readonly icon: ComponentType<{ className?: string }>;
  readonly label: string;
}) {
  return (
    <Label htmlFor={htmlFor}>
      <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      {label}
    </Label>
  );
}

function RadioLabel({
  id,
  label,
  normalWeight = true,
}: {
  readonly id: string;
  readonly label: string;
  readonly normalWeight?: boolean;
}) {
  return (
    <Label
      htmlFor={id}
      {...(normalWeight ? { className: "font-normal" } : {})}
    >
      {label}
    </Label>
  );
}

// ─── Label ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix label for ERP forms, filters, and settings. Associate controls with `htmlFor`. Use `font-normal` for checkbox/radio companion labels; keep default weight for primary field captions. Supports governed `state` for error, loading, and disabled contexts.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
  args: {
    children: "Field label",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="sm">
      <Label {...args} />
    </StoryFrame>
  ),
};

export const WithInput: Story = {
  name: "Label — With Input",
  render: () => (
    <StoryFrame width="md">
      <LabeledControl id="vendor-name" label="Vendor Name" required>
        <Input id="vendor-name" placeholder="Acme Software Ltd." />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const WithCheckbox: Story = {
  name: "Label — With Checkbox",
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" gap="sm">
        <Checkbox defaultChecked id="terms" />
        <Label className="font-normal" htmlFor="terms">
          Accept terms and conditions
        </Label>
      </StoryRow>
    </StoryFrame>
  ),
};

export const RequiredIndicator: Story = {
  name: "Label — Required",
  render: () => (
    <StoryFrame width="md">
      <LabeledControl id="po-number" label="Purchase Order Number" required>
        <Input id="po-number" placeholder="PO-2026-1184" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const OptionalHint: Story = {
  name: "Label — Optional",
  render: () => (
    <StoryFrame width="md">
      <LabeledControl
        hint="Shown on printed PO and vendor portal"
        id="internal-ref"
        label="Internal Reference"
        optional
      >
        <Input id="internal-ref" placeholder="Cost center or project code" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const DisabledPeer: Story = {
  name: "Label — Disabled Control",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <LabeledControl id="locked-field" label="Locked after approval">
          <Input disabled id="locked-field" value="PO-2026-1184" />
        </LabeledControl>
        <span className="text-muted-foreground text-xs">
          Label opacity follows disabled peer via governed styles.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const WithBadge: Story = {
  name: "Label — With Badge",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <StoryRow align="center" gap="sm" wrap>
          <Label htmlFor="beta-feature">Advanced Analytics</Label>
          <Badge emphasis="soft" size="sm" tone="info">
            Beta
          </Badge>
        </StoryRow>
        <Input id="beta-feature" placeholder="Enable preview dashboards" />
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
        <StoryFrame key={state} width="md">
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              state=&quot;{state}&quot;
            </span>
            <Label htmlFor={`label-${state}`} state={state}>
              Employee ID
            </Label>
            <Input id={`label-${state}`} placeholder="EMP-00142" state={state} />
          </StoryStack>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const FieldVsLabel: Story = {
  name: "Label — FieldLabel Comparison",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Standalone Label + control</span>
          <LabeledControl id="standalone-dept" label="Department">
            <Input id="standalone-dept" placeholder="Finance" />
          </LabeledControl>
        </StoryStack>
        <Field>
          <FieldLabel htmlFor="field-dept">Department</FieldLabel>
          <FieldDescription>
            Use `FieldLabel` inside `Field` for grouped legends, descriptions,
            and error slots.
          </FieldDescription>
          <Input id="field-dept" placeholder="Finance" />
        </Field>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const InvoiceDueDate: Story = {
  name: "ERP — Invoice Due Date",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledControl
        hint="Payment terms: Net 30 from invoice date"
        id="inv-due-date"
        label="Due Date"
        required
      >
        <Input id="inv-due-date" type="date" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const EmployeeId: Story = {
  name: "ERP — Employee ID",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledControl id="emp-id" label="Employee ID" required>
        <Input id="emp-id" placeholder="EMP-00142" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const VendorName: Story = {
  name: "ERP — Vendor Name",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledControl id="vendor" label="Vendor Name" required>
        <Input id="vendor" placeholder="Search vendor master…" type="search" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const PurchaseOrderReference: Story = {
  name: "ERP — PO Reference",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledControl id="po-ref" label="Purchase Order Number" required>
        <Input id="po-ref" placeholder="PO-2026-1184" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const GLAccountCode: Story = {
  name: "ERP — GL Account Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledControl
        hint="Format: #### · Office Expenses"
        id="gl-account"
        label="GL Account"
        required
      >
        <Input id="gl-account" placeholder="6100" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const PaymentMethodLabels: Story = {
  name: "ERP — Payment Method Labels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <Label className="font-medium">Payment Method</Label>
        <RadioGroup defaultValue="ach">
          <StoryStack gap="sm">
            <StoryRow align="center" gap="sm">
              <RadioGroupItem id="pay-ach" value="ach" />
              <RadioLabel id="pay-ach" label="ACH transfer" />
            </StoryRow>
            <StoryRow align="center" gap="sm">
              <RadioGroupItem id="pay-wire" value="wire" />
              <RadioLabel id="pay-wire" label="Wire transfer" />
            </StoryRow>
            <StoryRow align="center" gap="sm">
              <RadioGroupItem id="pay-check" value="check" />
              <RadioLabel id="pay-check" label="Check" />
            </StoryRow>
          </StoryStack>
        </RadioGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PermissionToggleLabels: Story = {
  name: "ERP — Permission Toggle Labels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {[
          { id: "perm-finance", label: "Finance module access" },
          { id: "perm-procurement", label: "Create purchase orders" },
          { id: "perm-reports", label: "Export financial reports" },
        ].map((item) => (
          <StoryRow align="center" justify="between" key={item.id}>
            <Label className="font-normal" htmlFor={item.id}>
              {item.label}
            </Label>
            <Switch defaultChecked={item.id === "perm-finance"} id={item.id} />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const FilterPanelLabels: Story = {
  name: "ERP — Filter Panel Labels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow gap="sm" wrap>
          <StoryStack className="min-w-40 flex-1" gap="xs">
            <Label htmlFor="filter-status">Status</Label>
            <Select defaultValue="all">
              <SelectTrigger id="filter-status" size="sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
          <StoryStack className="min-w-40 flex-1" gap="xs">
            <Label htmlFor="filter-dept">Department</Label>
            <Select defaultValue="all">
              <SelectTrigger id="filter-dept" size="sm">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="ops">Operations</SelectItem>
              </SelectContent>
            </Select>
          </StoryStack>
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <Checkbox id="filter-overdue" />
          <Label className="font-normal" htmlFor="filter-overdue">
            Overdue only
          </Label>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const DateRangeLabels: Story = {
  name: "ERP — Date Range Labels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow gap="sm" wrap>
        <StoryStack className="min-w-40 flex-1" gap="xs">
          <IconLabel htmlFor="date-from" icon={CalendarIcon} label="From" />
          <Input id="date-from" type="date" />
        </StoryStack>
        <StoryStack className="min-w-40 flex-1" gap="xs">
          <IconLabel htmlFor="date-to" icon={CalendarIcon} label="To" />
          <Input id="date-to" type="date" />
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const AmountCurrencyLabel: Story = {
  name: "ERP — Amount Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledControl id="payment-amount" label="Payment Amount" required>
        <StoryRow align="center" gap="sm">
          <DollarSignIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <Input id="payment-amount" inputMode="decimal" placeholder="0.00" />
        </StoryRow>
      </LabeledControl>
    </StoryFrame>
  ),
};

export const TermsAcceptance: Story = {
  name: "ERP — Terms Acceptance",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack
        className="rounded-md border border-border"
        gap="sm"
        padding="md"
      >
        <StoryRow align="start" gap="sm">
          <Checkbox id="terms-erp" />
          <StoryStack gap="xs">
            <Label className="font-normal" htmlFor="terms-erp">
              I confirm this purchase complies with company procurement policy
            </Label>
            <span className="text-muted-foreground text-xs">
              Required before PO submission · Policy v2026.3
            </span>
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SectionGroupLabel: Story = {
  name: "ERP — Section Group Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <Label className="font-medium">Billing Address</Label>
        <LabeledControl id="bill-street" label="Street" required>
          <Input id="bill-street" placeholder="123 Main Street" />
        </LabeledControl>
        <StoryRow gap="sm" wrap>
          <StoryStack className="min-w-32 flex-1" gap="xs">
            <Label htmlFor="bill-city">City</Label>
            <Input id="bill-city" placeholder="San Francisco" />
          </StoryStack>
          <StoryStack className="min-w-24 flex-1" gap="xs">
            <Label htmlFor="bill-postal">Postal Code</Label>
            <Input id="bill-postal" placeholder="94105" />
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ReadOnlyFieldLabel: Story = {
  name: "ERP — Read-only Field Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledControl id="approved-by" label="Approved By">
        <Input disabled id="approved-by" readOnly value="Maria Kim · CFO" />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const RecordDetailLabels: Story = {
  name: "ERP — Record Detail Labels",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow gap="md" wrap>
          <StoryStack className="min-w-48 flex-1" gap="xs">
            <IconLabel htmlFor="detail-invoice" icon={FileTextIcon} label="Invoice No." />
            <Input id="detail-invoice" readOnly value="INV-2026-0042" />
          </StoryStack>
          <StoryStack className="min-w-48 flex-1" gap="xs">
            <IconLabel htmlFor="detail-vendor" icon={BuildingIcon} label="Vendor" />
            <Input id="detail-vendor" readOnly value="Acme Software Ltd." />
          </StoryStack>
        </StoryRow>
        <StoryRow gap="md" wrap>
          <StoryStack className="min-w-48 flex-1" gap="xs">
            <IconLabel htmlFor="detail-owner" icon={UserIcon} label="Owner" />
            <Input id="detail-owner" readOnly value="Jane Doe" />
          </StoryStack>
          <StoryStack className="min-w-48 flex-1" gap="xs">
            <IconLabel htmlFor="detail-amount" icon={HashIcon} label="Amount" />
            <Input id="detail-amount" readOnly value="$4,850.00" />
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ApprovalCommentLabel: Story = {
  name: "ERP — Approval Comment Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledControl
        hint="Visible to requester and audit trail"
        id="approval-comment"
        label="Approval Comment"
        optional
      >
        <Textarea
          id="approval-comment"
          placeholder="Add context for approval decision…"
        />
      </LabeledControl>
    </StoryFrame>
  ),
};

export const SecurityConsentLabel: Story = {
  name: "ERP — Security Consent Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack
        className="rounded-md border border-border"
        gap="sm"
        padding="md"
      >
        <StoryRow align="start" gap="sm">
          <ShieldIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <StoryStack gap="sm">
            <Label className="font-medium" htmlFor="security-consent">
              Sensitive data access
            </Label>
            <span className="text-muted-foreground text-sm">
              Payroll and compensation fields require elevated permissions.
            </span>
            <StoryRow align="center" gap="sm">
              <Checkbox id="security-consent" />
              <Label className="font-normal" htmlFor="security-consent">
                I acknowledge SOX logging for this access
              </Label>
            </StoryRow>
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ShipmentReferenceLabel: Story = {
  name: "ERP — Shipment Reference Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledControl
        hint="Scan barcode or enter tracking number"
        id="shipment-ref"
        label="Shipment / Tracking No."
        required
      >
        <StoryRow align="center" gap="sm">
          <PackageIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <Input id="shipment-ref" placeholder="7849 1234 5678" />
        </StoryRow>
      </LabeledControl>
    </StoryFrame>
  ),
};

export const ContactEmailLabel: Story = {
  name: "ERP — Contact Email Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledControl id="contact-email" label="Accounts Payable Email" required>
        <StoryRow align="center" gap="sm">
          <MailIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <Input
            id="contact-email"
            placeholder="ap@vendor.example"
            type="email"
          />
        </StoryRow>
      </LabeledControl>
    </StoryFrame>
  ),
};

export const CreditLimitLabel: Story = {
  name: "ERP — Credit Limit Label",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <StoryRow align="center" gap="sm" wrap>
          <Label htmlFor="credit-limit">
            Credit Limit
            <RequiredMark />
          </Label>
          <Badge emphasis="soft" size="sm" tone="warning">
            Review required
          </Badge>
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <CreditCardIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <Input id="credit-limit" inputMode="decimal" placeholder="50000" />
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};
