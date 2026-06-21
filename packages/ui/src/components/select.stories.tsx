import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Label } from "./label";
import { NativeSelect, NativeSelectOption } from "./native-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

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
  "USD — US Dollar",
  "EUR — Euro",
  "GBP — British Pound",
  "AUD — Australian Dollar",
  "SGD — Singapore Dollar",
] as const;

const PAYMENT_TERMS = [
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due on receipt",
] as const;

const GL_ACCOUNTS = [
  "6100 — Office Supplies",
  "6200 — Travel & Entertainment",
  "6300 — Professional Services",
  "5200 — Accrued Expenses",
  "1100 — Accounts Receivable",
] as const;

type FilterLabel = "Status" | "Department" | "Priority";

const FILTER_OPTIONS: Record<FilterLabel, readonly string[]> = {
  Status: RECORD_STATUSES,
  Department: DEPARTMENTS,
  Priority: PRIORITY_LEVELS,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function SelectShell({
  children,
  defaultValue,
  id,
  placeholder = "Select…",
  size,
}: {
  readonly children: ReactNode;
  readonly defaultValue?: string;
  readonly id?: string;
  readonly placeholder?: string;
  readonly size?: "sm" | "md";
}) {
  return (
    <Select {...(defaultValue ? { defaultValue } : {})}>
      <SelectTrigger id={id} {...(size ? { size } : {})}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

function LabeledSelect({
  children,
  defaultValue,
  id,
  label,
  placeholder,
  required,
  size,
}: {
  readonly children: ReactNode;
  readonly defaultValue?: string;
  readonly id: string;
  readonly label: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly size?: "sm" | "md";
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
      <SelectShell
        id={id}
        {...(defaultValue ? { defaultValue } : {})}
        {...(placeholder ? { placeholder } : {})}
        {...(size ? { size } : {})}
      >
        {children}
      </SelectShell>
    </StoryStack>
  );
}

function ControlledSelectDemo() {
  const [value, setValue] = useState("pending");

  return (
    <StoryStack gap="sm">
      <Select onValueChange={setValue} value={value}>
        <SelectTrigger id="controlled-status">
          <SelectValue placeholder="Select status…" />
        </SelectTrigger>
        <SelectContent>
          {RECORD_STATUSES.map((status) => (
            <SelectItem key={status} value={status.toLowerCase()}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground text-xs">
        Selected value: <Badge emphasis="soft">{value}</Badge>
      </span>
    </StoryStack>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix UI Select for ERP option surfaces — status filters, department assignment, currency, payment terms, and GL accounts. Use for short fixed lists. Prefer `NativeSelect` in dense grids; use `Combobox` for searchable long lists.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="sm">
      <SelectShell placeholder="Select status…">
        {RECORD_STATUSES.map((status) => (
          <SelectItem key={status} value={status.toLowerCase()}>
            {status}
          </SelectItem>
        ))}
      </SelectShell>
    </StoryFrame>
  ),
};

export const Small: Story = {
  name: "Size — Small",
  render: () => (
    <StoryFrame width="sm">
      <SelectShell placeholder="Select…" size="sm">
        {RECORD_STATUSES.map((status) => (
          <SelectItem key={status} value={status.toLowerCase()}>
            {status}
          </SelectItem>
        ))}
      </SelectShell>
    </StoryFrame>
  ),
};

export const WithGroups: Story = {
  name: "Select — With Groups",
  render: () => (
    <StoryFrame width="sm">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Assign department…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Operations</SelectLabel>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Business</SelectLabel>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </StoryFrame>
  ),
};

export const WithLabel: Story = {
  name: "Select — With Label",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect
        id="sel-status"
        label="Record status"
        placeholder="Choose status…"
      >
        {RECORD_STATUSES.map((status) => (
          <SelectItem key={status} value={status.toLowerCase()}>
            {status}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const WithDisabledItems: Story = {
  name: "Select — Disabled Items",
  render: () => (
    <StoryFrame width="sm">
      <SelectShell placeholder="Select role…">
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem disabled value="admin">
          Admin (requires approval)
        </SelectItem>
        <SelectItem disabled value="superadmin">
          Super admin (restricted)
        </SelectItem>
      </SelectShell>
    </StoryFrame>
  ),
};

export const Controlled: Story = {
  name: "Select — Controlled",
  render: () => (
    <StoryFrame width="sm">
      <ControlledSelectDemo />
    </StoryFrame>
  ),
};

export const GovernanceAllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="sm">
        {(["sm", "md"] as const).map((size) => (
          <StoryStack gap="xs" key={size}>
            <Label>Size: {size}</Label>
            <SelectShell placeholder={`size="${size}"`} size={size}>
              {RECORD_STATUSES.map((status) => (
                <SelectItem key={status} value={status.toLowerCase()}>
                  {status}
                </SelectItem>
              ))}
            </SelectShell>
          </StoryStack>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const LongOptionList: Story = {
  name: "Select — Long List (Scroll)",
  render: () => (
    <StoryFrame width="md">
      <LabeledSelect id="gl-long" label="GL account">
        {Array.from({ length: 24 }, (_, index) => {
          const code = 6000 + index * 10;
          return (
            <SelectItem key={code} value={String(code)}>
              {code} — Account {index + 1}
            </SelectItem>
          );
        })}
      </LabeledSelect>
    </StoryFrame>
  ),
};

// ─── ERP single fields ─────────────────────────────────────────────────────

export const RecordStatusFilter: Story = {
  name: "ERP — Record Status Filter",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect
        defaultValue="active"
        id="filter-status"
        label="Filter by status"
        placeholder="All statuses"
      >
        <SelectItem value="all">All statuses</SelectItem>
        <SelectSeparator />
        {RECORD_STATUSES.map((status) => (
          <SelectItem key={status} value={status.toLowerCase()}>
            {status}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const PriorityAssignment: Story = {
  name: "ERP — Priority Assignment",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect
        defaultValue="medium"
        id="sel-priority"
        label="Priority level"
        required
      >
        {PRIORITY_LEVELS.map((priority) => (
          <SelectItem key={priority} value={priority.toLowerCase()}>
            {priority}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const DepartmentAssignment: Story = {
  name: "ERP — Department Assignment",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect id="sel-dept" label="Department" required>
        {DEPARTMENTS.map((department) => (
          <SelectItem key={department} value={department.toLowerCase()}>
            {department}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const CurrencySelector: Story = {
  name: "ERP — Currency Selector",
  render: () => (
    <StoryFrame width="md">
      <LabeledSelect
        defaultValue="usd — us dollar"
        id="sel-currency"
        label="Invoice currency"
        required
      >
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency} value={currency.toLowerCase()}>
            {currency}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const PaymentTerms: Story = {
  name: "ERP — Payment Terms",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect defaultValue="net 30" id="pay-terms" label="Payment terms">
        {PAYMENT_TERMS.map((term) => (
          <SelectItem key={term} value={term.toLowerCase()}>
            {term}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const GLAccountPicker: Story = {
  name: "ERP — GL Account",
  render: () => (
    <StoryFrame width="md">
      <LabeledSelect id="gl-account" label="GL account" required>
        {GL_ACCOUNTS.map((account) => (
          <SelectItem key={account} value={account.toLowerCase()}>
            {account}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const CostCentre: Story = {
  name: "ERP — Cost Centre",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect id="cost-centre" label="Cost centre">
        <SelectItem value="cc-eng-100">CC-ENG-100 · Engineering</SelectItem>
        <SelectItem value="cc-fin-200">CC-FIN-200 · Finance</SelectItem>
        <SelectItem value="cc-ops-300">CC-OPS-300 · Operations</SelectItem>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const VendorSelector: Story = {
  name: "ERP — Vendor Selector",
  render: () => (
    <StoryFrame width="md">
      <LabeledSelect id="vendor" label="Vendor" required>
        <SelectItem value="acme">Acme Supplies Ltd</SelectItem>
        <SelectItem value="global">Global Parts Co.</SelectItem>
        <SelectItem value="northwind">Northwind Traders</SelectItem>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const ApprovalLevel: Story = {
  name: "ERP — Approval Level",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect id="approval-level" label="Approval level">
        <SelectItem value="l1">L1 · Department manager</SelectItem>
        <SelectItem value="l2">L2 · Finance director</SelectItem>
        <SelectItem value="l3">L3 · Executive sign-off</SelectItem>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const FiscalPeriod: Story = {
  name: "ERP — Fiscal Period",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect defaultValue="fy2026-q2" id="fiscal" label="Fiscal period">
        <SelectItem value="fy2026-q1">FY2026 · Q1</SelectItem>
        <SelectItem value="fy2026-q2">FY2026 · Q2</SelectItem>
        <SelectItem value="fy2026-q3">FY2026 · Q3</SelectItem>
        <SelectItem value="fy2026-q4">FY2026 · Q4</SelectItem>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const TaxCode: Story = {
  name: "ERP — Tax Code",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect id="tax-code" label="Tax code">
        <SelectItem value="gst-au-10">GST-AU-10 · Standard 10%</SelectItem>
        <SelectItem value="gst-au-0">GST-AU-0 · Zero rated</SelectItem>
        <SelectItem value="exempt">EXEMPT · Input taxed</SelectItem>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const WarehouseSelector: Story = {
  name: "ERP — Warehouse",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect id="warehouse" label="Warehouse">
        <SelectItem value="syd">Sydney · WH-SYD</SelectItem>
        <SelectItem value="mel">Melbourne · WH-MEL</SelectItem>
        <SelectItem value="bne">Brisbane · WH-BNE</SelectItem>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const RegionGroups: Story = {
  name: "ERP — Region (Grouped)",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect id="region" label="Region">
        <SelectGroup>
          <SelectLabel>Asia Pacific</SelectLabel>
          <SelectItem value="sg">Singapore</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gb">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
        </SelectGroup>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const ExportFormat: Story = {
  name: "ERP — Export Format",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect defaultValue="csv" id="export-fmt" label="Export format">
        <SelectItem value="csv">CSV</SelectItem>
        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
        <SelectItem value="pdf">PDF summary</SelectItem>
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const PageSizeSelector: Story = {
  name: "ERP — Page Size",
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect
        defaultValue="25"
        id="page-size"
        label="Rows per page"
        size="sm"
      >
        {["10", "25", "50", "100"].map((size) => (
          <SelectItem key={size} value={size}>
            {size}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

// ─── ERP composites ────────────────────────────────────────────────────────

export const CompactFilterRow: Story = {
  name: "ERP — Compact Filter Row",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {(["Status", "Department", "Priority"] as FilterLabel[]).map((label) => (
        <StoryStack className="min-w-36" gap="xs" key={label}>
          <Label>{label}</Label>
          <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder={`All ${label.toLowerCase()}…`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {FILTER_OPTIONS[label].map((value) => (
                <SelectItem key={value} value={value.toLowerCase()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

export const PurchaseOrderForm: Story = {
  name: "ERP — Purchase Order Fields",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledSelect id="po-vendor" label="Vendor" required>
          <SelectItem value="acme">Acme Supplies Ltd</SelectItem>
          <SelectItem value="global">Global Parts Co.</SelectItem>
        </LabeledSelect>
        <LabeledSelect id="po-wh" label="Deliver to warehouse">
          <SelectItem value="syd">Sydney · WH-SYD</SelectItem>
          <SelectItem value="mel">Melbourne · WH-MEL</SelectItem>
        </LabeledSelect>
        <LabeledSelect id="po-terms" label="Payment terms">
          {PAYMENT_TERMS.map((term) => (
            <SelectItem key={term} value={term.toLowerCase()}>
              {term}
            </SelectItem>
          ))}
        </LabeledSelect>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InvoiceHeaderFields: Story = {
  name: "ERP — Invoice Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledSelect id="inv-currency" label="Currency" required>
          {CURRENCIES.map((currency) => (
            <SelectItem key={currency} value={currency.toLowerCase()}>
              {currency}
            </SelectItem>
          ))}
        </LabeledSelect>
        <LabeledSelect id="inv-gl" label="Default GL account">
          {GL_ACCOUNTS.map((account) => (
            <SelectItem key={account} value={account.toLowerCase()}>
              {account}
            </SelectItem>
          ))}
        </LabeledSelect>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmployeeFormFields: Story = {
  name: "ERP — Employee Form",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledSelect id="emp-dept" label="Department" required>
          {DEPARTMENTS.map((department) => (
            <SelectItem key={department} value={department.toLowerCase()}>
              {department}
            </SelectItem>
          ))}
        </LabeledSelect>
        <LabeledSelect id="emp-manager" label="Reports to">
          <SelectItem value="jane">Jane Doe · Engineering lead</SelectItem>
          <SelectItem value="alex">Alex Chen · Finance director</SelectItem>
        </LabeledSelect>
      </StoryStack>
    </StoryFrame>
  ),
};

export const NativeSelectReference: Story = {
  name: "ERP — NativeSelect for Dense Grids",
  parameters: {
    docs: {
      description: {
        story:
          "Use governed `NativeSelect` in compact table cells and mobile data entry where native OS pickers are acceptable.",
      },
    },
  },
  render: () => (
    <StoryRow align="center" gap="sm" wrap>
      <NativeSelect className="w-36" size="sm">
        <NativeSelectOption value="">Status…</NativeSelectOption>
        {RECORD_STATUSES.map((status) => (
          <NativeSelectOption key={status} value={status.toLowerCase()}>
            {status}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect className="w-36" size="sm">
        <NativeSelectOption value="">Priority…</NativeSelectOption>
        {PRIORITY_LEVELS.map((priority) => (
          <NativeSelectOption key={priority} value={priority.toLowerCase()}>
            {priority}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </StoryRow>
  ),
};

export const SelectVsCombobox: Story = {
  name: "ERP — Select vs Combobox",
  parameters: {
    docs: {
      description: {
        story:
          "Use `Select` for short fixed lists (≤ ~20 items). Use `Combobox` when users must search vendors, SKUs, or employees — see Primitives/Combobox.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect id="select-short" label="Status (Select)">
        {RECORD_STATUSES.map((status) => (
          <SelectItem key={status} value={status.toLowerCase()}>
            {status}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Pair `Label` with `SelectTrigger` via matching `id`/`htmlFor`. Radix manages listbox keyboard navigation and aria roles on the trigger.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <LabeledSelect
        id="a11y-dept"
        label="Department"
        placeholder="Choose department…"
        required
      >
        {DEPARTMENTS.map((department) => (
          <SelectItem key={department} value={department.toLowerCase()}>
            {department}
          </SelectItem>
        ))}
      </LabeledSelect>
    </StoryFrame>
  ),
};
