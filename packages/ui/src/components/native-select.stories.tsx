import type { Meta, StoryObj } from "@storybook/react";
import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Label } from "./label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";

// ─── Shared ERP option sets ────────────────────────────────────────────────

const RECORD_STATUSES = [
  "Active",
  "Inactive",
  "Pending",
  "Suspended",
  "Archived",
] as const;

const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const;

const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "HR",
  "Operations",
  "Sales",
  "Legal",
] as const;

const CURRENCIES = [
  { value: "usd", label: "USD — US Dollar" },
  { value: "eur", label: "EUR — Euro" },
  { value: "gbp", label: "GBP — British Pound" },
  { value: "aud", label: "AUD — Australian Dollar" },
  { value: "sgd", label: "SGD — Singapore Dollar" },
] as const;

const PAYMENT_TERMS = [
  { value: "net-15", label: "Net 15" },
  { value: "net-30", label: "Net 30" },
  { value: "net-45", label: "Net 45" },
  { value: "net-60", label: "Net 60" },
  { value: "due-on-receipt", label: "Due on receipt" },
] as const;

const GL_ASSET_ACCOUNTS = [
  { value: "1100", label: "1100 — Accounts Receivable" },
  { value: "1200", label: "1200 — Inventory" },
  { value: "1500", label: "1500 — Prepaid Expenses" },
] as const;

const GL_EXPENSE_ACCOUNTS = [
  { value: "6100", label: "6100 — Office Supplies" },
  { value: "6200", label: "6200 — Travel & Entertainment" },
  { value: "6300", label: "6300 — Professional Services" },
] as const;

const UOM_OPTIONS = [
  { value: "ea", label: "Each (EA)" },
  { value: "box", label: "Box (BOX)" },
  { value: "kg", label: "Kilogram (KG)" },
  { value: "hr", label: "Hour (HR)" },
] as const;

const WAREHOUSE_LOCATIONS = [
  { value: "wh-east", label: "East warehouse" },
  { value: "wh-west", label: "West warehouse" },
  { value: "wh-central", label: "Central hub" },
  { value: "wh-transit", label: "In transit" },
] as const;

const FISCAL_PERIODS = [
  { value: "q1-2026", label: "Q1 2026" },
  { value: "q2-2026", label: "Q2 2026" },
  { value: "q3-2026", label: "Q3 2026" },
  { value: "q4-2026", label: "Q4 2026" },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function LabeledNativeSelect({
  children,
  defaultValue,
  disabled,
  id,
  label,
  required,
  size,
}: {
  readonly children: ReactNode;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly size?: "sm" | "default";
}) {
  return (
    <StoryStack gap="xs">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-destructive">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <NativeSelect
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        {...(size ? { size } : {})}
      >
        {children}
      </NativeSelect>
    </StoryStack>
  );
}

function ControlledNativeSelectDemo() {
  const [value, setValue] = useState("pending");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return (
    <StoryStack gap="sm">
      <NativeSelect
        id="controlled-status"
        onChange={handleChange}
        value={value}
      >
        <NativeSelectOption value="">Select status…</NativeSelectOption>
        {RECORD_STATUSES.map((status) => (
          <NativeSelectOption key={status} value={status.toLowerCase()}>
            {status}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <span className="text-muted-foreground text-xs">
        Selected value: <Badge emphasis="soft">{value || "none"}</Badge>
      </span>
    </StoryStack>
  );
}

function DenseGridRow({
  id,
  recordId,
  status,
}: {
  readonly id: string;
  readonly recordId: string;
  readonly status: string;
}) {
  return (
    <StoryRow align="center" gap="sm" wrap>
      <span className="font-mono text-sm">{recordId}</span>
      <NativeSelect
        aria-label={`Status for ${recordId}`}
        className="w-36"
        defaultValue={status}
        id={id}
        size="sm"
      >
        {RECORD_STATUSES.map((item) => (
          <NativeSelectOption key={item} value={item.toLowerCase()}>
            {item}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect
        aria-label={`Priority for ${recordId}`}
        className="w-36"
        defaultValue="medium"
        size="sm"
      >
        {PRIORITY_LEVELS.map((item) => (
          <NativeSelectOption key={item} value={item.toLowerCase()}>
            {item}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </StoryRow>
  );
}

// ─── NativeSelect ────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed native `<select>` wrapper for ERP surfaces where OS pickers, mobile keyboards, and compact grid cells matter. Use for short fixed lists in dense tables and field workflows. Prefer Radix `Select` for styled overlays; use `Combobox` for searchable long lists.",
      },
    },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="sm">
      <NativeSelect defaultValue="">
        <NativeSelectOption value="">Select status…</NativeSelectOption>
        {RECORD_STATUSES.map((status) => (
          <NativeSelectOption key={status} value={status.toLowerCase()}>
            {status}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </StoryFrame>
  ),
};

export const Small: Story = {
  name: "NativeSelect — Small Size",
  render: () => (
    <StoryFrame width="sm">
      <NativeSelect size="sm">
        <NativeSelectOption value="">Select…</NativeSelectOption>
        {RECORD_STATUSES.map((status) => (
          <NativeSelectOption key={status} value={status.toLowerCase()}>
            {status}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </StoryFrame>
  ),
};

export const WithPlaceholder: Story = {
  name: "NativeSelect — With Placeholder",
  render: () => (
    <StoryFrame width="sm">
      <NativeSelect defaultValue="">
        <NativeSelectOption disabled value="">
          Choose a department…
        </NativeSelectOption>
        {DEPARTMENTS.map((department) => (
          <NativeSelectOption key={department} value={department.toLowerCase()}>
            {department}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </StoryFrame>
  ),
};

export const WithLabel: Story = {
  name: "NativeSelect — With Label",
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect id="labeled-dept" label="Department">
        <NativeSelectOption value="">Select department…</NativeSelectOption>
        {DEPARTMENTS.map((department) => (
          <NativeSelectOption key={department} value={department.toLowerCase()}>
            {department}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const RequiredField: Story = {
  name: "NativeSelect — Required Field",
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect id="required-currency" label="Currency" required>
        <NativeSelectOption value="">Select currency…</NativeSelectOption>
        {CURRENCIES.map(({ value, label }) => (
          <NativeSelectOption key={value} value={value}>
            {label}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  name: "NativeSelect — Disabled",
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect
        defaultValue="finance"
        disabled
        id="disabled-dept"
        label="Department (locked)"
      >
        {DEPARTMENTS.map((department) => (
          <NativeSelectOption key={department} value={department.toLowerCase()}>
            {department}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const WithOptGroups: Story = {
  name: "NativeSelect — Opt Groups",
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect id="gl-account" label="GL account">
        <NativeSelectOption value="">Select account…</NativeSelectOption>
        <NativeSelectOptGroup label="Assets">
          {GL_ASSET_ACCOUNTS.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Expenses">
          {GL_EXPENSE_ACCOUNTS.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelectOptGroup>
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const Controlled: Story = {
  name: "NativeSelect — Controlled",
  render: () => (
    <StoryFrame width="sm">
      <ControlledNativeSelectDemo />
    </StoryFrame>
  ),
};

export const SizeComparison: Story = {
  name: "NativeSelect — Size Comparison",
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <LabeledNativeSelect id="size-default" label="Default size">
          <NativeSelectOption value="pending">Pending</NativeSelectOption>
          <NativeSelectOption value="active">Active</NativeSelectOption>
        </LabeledNativeSelect>
        <LabeledNativeSelect id="size-sm" label="Small (sm)" size="sm">
          <NativeSelectOption value="pending">Pending</NativeSelectOption>
          <NativeSelectOption value="active">Active</NativeSelectOption>
        </LabeledNativeSelect>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP usage ───────────────────────────────────────────────────────────────

export const DenseGridCells: Story = {
  name: "ERP — Dense Grid Cells",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Compact native selects for inline editing in registers — status and priority without opening a styled overlay.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm" wrap>
          <span className="font-mono text-muted-foreground text-xs">
            Record
          </span>
          <span className="font-mono text-muted-foreground text-xs">
            Status
          </span>
          <span className="font-mono text-muted-foreground text-xs">
            Priority
          </span>
        </StoryRow>
        <DenseGridRow id="row-inv-001" recordId="INV-001" status="active" />
        <DenseGridRow id="row-inv-002" recordId="INV-002" status="pending" />
        <DenseGridRow id="row-inv-003" recordId="INV-003" status="suspended" />
      </StoryStack>
    </StoryFrame>
  ),
};

export const RecordStatusFilter: Story = {
  name: "ERP — Record Status Filter",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect id="filter-status" label="Status filter" size="sm">
        <NativeSelectOption value="">All statuses</NativeSelectOption>
        {RECORD_STATUSES.map((status) => (
          <NativeSelectOption key={status} value={status.toLowerCase()}>
            {status}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const DepartmentAssignment: Story = {
  name: "ERP — Department Assignment",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect
        defaultValue="engineering"
        id="emp-dept"
        label="Department"
        required
      >
        {DEPARTMENTS.map((department) => (
          <NativeSelectOption key={department} value={department.toLowerCase()}>
            {department}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const CurrencySelection: Story = {
  name: "ERP — Currency Selection",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect
        defaultValue="usd"
        id="invoice-currency"
        label="Invoice currency"
        required
      >
        {CURRENCIES.map(({ value, label }) => (
          <NativeSelectOption key={value} value={value}>
            {label}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const PaymentTerms: Story = {
  name: "ERP — Payment Terms",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect
        defaultValue="net-30"
        id="payment-terms"
        label="Payment terms"
      >
        {PAYMENT_TERMS.map(({ value, label }) => (
          <NativeSelectOption key={value} value={value}>
            {label}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const GLAccountPicker: Story = {
  name: "ERP — GL Account Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledNativeSelect id="expense-gl" label="Expense account" required>
        <NativeSelectOption value="">Select GL account…</NativeSelectOption>
        <NativeSelectOptGroup label="Assets">
          {GL_ASSET_ACCOUNTS.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Expenses">
          {GL_EXPENSE_ACCOUNTS.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelectOptGroup>
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const InvoiceLineUOM: Story = {
  name: "ERP — Invoice Line UOM",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryRow align="end" gap="sm" wrap>
        <LabeledNativeSelect
          defaultValue="ea"
          id="line-uom"
          label="Unit of measure"
          size="sm"
        >
          {UOM_OPTIONS.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </LabeledNativeSelect>
      </StoryRow>
    </StoryFrame>
  ),
};

export const WarehouseLocation: Story = {
  name: "ERP — Warehouse Location",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect
        defaultValue="wh-east"
        id="stock-location"
        label="Ship from location"
      >
        {WAREHOUSE_LOCATIONS.map(({ value, label }) => (
          <NativeSelectOption key={value} value={value}>
            {label}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const ApprovalPriority: Story = {
  name: "ERP — Approval Priority",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect
        defaultValue="high"
        id="approval-priority"
        label="Approval priority"
        size="sm"
      >
        {PRIORITY_LEVELS.map((priority) => (
          <NativeSelectOption key={priority} value={priority.toLowerCase()}>
            {priority}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const FiscalPeriod: Story = {
  name: "ERP — Fiscal Period",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledNativeSelect
        defaultValue="q2-2026"
        id="fiscal-period"
        label="Reporting period"
      >
        {FISCAL_PERIODS.map(({ value, label }) => (
          <NativeSelectOption key={value} value={value}>
            {label}
          </NativeSelectOption>
        ))}
      </LabeledNativeSelect>
    </StoryFrame>
  ),
};

export const MobileDataEntryForm: Story = {
  name: "ERP — Mobile Data Entry Form",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Native selects trigger OS-native pickers on mobile — ideal for warehouse floor and field service data entry.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <LabeledNativeSelect id="mobile-status" label="Ticket status" size="sm">
          <NativeSelectOption value="open">Open</NativeSelectOption>
          <NativeSelectOption value="in-progress">
            In progress
          </NativeSelectOption>
          <NativeSelectOption value="resolved">Resolved</NativeSelectOption>
        </LabeledNativeSelect>
        <LabeledNativeSelect id="mobile-priority" label="Priority" size="sm">
          {PRIORITY_LEVELS.map((priority) => (
            <NativeSelectOption key={priority} value={priority.toLowerCase()}>
              {priority}
            </NativeSelectOption>
          ))}
        </LabeledNativeSelect>
        <LabeledNativeSelect id="mobile-location" label="Location" size="sm">
          {WAREHOUSE_LOCATIONS.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </LabeledNativeSelect>
      </StoryStack>
    </StoryFrame>
  ),
};

export const BulkEditToolbar: Story = {
  name: "ERP — Bulk Edit Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm" wrap>
          <Badge emphasis="soft" tone="neutral">
            12 records selected
          </Badge>
        </StoryRow>
        <StoryRow align="center" gap="sm" wrap>
          <NativeSelect
            aria-label="Bulk update status"
            className="w-40"
            defaultValue=""
            size="sm"
          >
            <NativeSelectOption value="">Set status…</NativeSelectOption>
            {RECORD_STATUSES.map((status) => (
              <NativeSelectOption key={status} value={status.toLowerCase()}>
                {status}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Bulk update department"
            className="w-40"
            defaultValue=""
            size="sm"
          >
            <NativeSelectOption value="">Set department…</NativeSelectOption>
            {DEPARTMENTS.map((department) => (
              <NativeSelectOption
                key={department}
                value={department.toLowerCase()}
              >
                {department}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Bulk update priority"
            className="w-40"
            defaultValue=""
            size="sm"
          >
            <NativeSelectOption value="">Set priority…</NativeSelectOption>
            {PRIORITY_LEVELS.map((priority) => (
              <NativeSelectOption key={priority} value={priority.toLowerCase()}>
                {priority}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const NativeSelectVsRadixSelect: Story = {
  name: "ERP — NativeSelect vs Radix Select",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Use `NativeSelect` in dense grids and mobile flows. Use Radix `Select` (Primitives/Select) when styled overlays, separators, and rich item content are required.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <LabeledNativeSelect
          id="native-status"
          label="Status (NativeSelect)"
          size="sm"
        >
          <NativeSelectOption value="">Select…</NativeSelectOption>
          {RECORD_STATUSES.map((status) => (
            <NativeSelectOption key={status} value={status.toLowerCase()}>
              {status}
            </NativeSelectOption>
          ))}
        </LabeledNativeSelect>
        <span className="text-muted-foreground text-xs">
          See Primitives/Select for Radix overlay pickers with groups,
          separators, and custom item layouts.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Associate labels with `htmlFor` + `id`. In grid cells without visible labels, provide `aria-label`. Pass `required` on the native select for form validation hints.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <LabeledNativeSelect id="a11y-dept" label="Department" required>
          <NativeSelectOption value="">Select department…</NativeSelectOption>
          {DEPARTMENTS.map((department) => (
            <NativeSelectOption
              key={department}
              value={department.toLowerCase()}
            >
              {department}
            </NativeSelectOption>
          ))}
        </LabeledNativeSelect>
        <NativeSelect
          aria-label="Inline status for PO-1042"
          className="w-36"
          defaultValue="pending"
          size="sm"
        >
          {RECORD_STATUSES.map((status) => (
            <NativeSelectOption key={status} value={status.toLowerCase()}>
              {status}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </StoryStack>
    </StoryFrame>
  ),
};
