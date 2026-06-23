import React from "react";
import { DENSITIES, GOVERNED_STATES, SIZES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Input } from "./input";
import { Label } from "./label";

// ─── Helpers ───────────────────────────────────────────────────────────────

const EMPLOYEE_ID_PATTERN = /^EMP-\d{5}$/u;

function LabeledField({
  id,
  label,
  required,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly children: ReactNode;
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
      {children}
    </StoryStack>
  );
}

function ValidatedEmployeeIdField() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && !EMPLOYEE_ID_PATTERN.test(value);

  return (
    <LabeledField id="live-emp-id" label="Employee ID" required>
      <Input
        aria-invalid={invalid}
        id="live-emp-id"
        onBlur={() => setTouched(true)}
        onChange={(event) => setValue(event.target.value)}
        placeholder="EMP-00142"
        {...(invalid ? { state: "error" as const } : {})}
        value={value}
      />
    </LabeledField>
  );
}

function AsyncVendorLookupField() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);
    if (next.length >= 3) {
      setLoading(true);
      setTimeout(() => setLoading(false), 800);
    } else {
      setLoading(false);
    }
  };

  return (
    <LabeledField id="async-vendor" label="Vendor lookup">
      <Input
        id="async-vendor"
        onChange={handleChange}
        placeholder="Type at least 3 characters…"
        {...(loading ? { state: "loading" as const } : {})}
        type="search"
        value={value}
      />
    </LabeledField>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed text-input primitive for ERP form surfaces. Accepts all HTML input types plus governed `density`, `size`, and `state`. For prefix/suffix icons, currency adornments, or inline buttons, use `InputGroup` (Primitives/InputGroup).",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: [...DENSITIES],
      description: "Spacing density override",
      table: { defaultValue: { summary: "standard" } },
    },
    size: {
      control: "radio",
      options: [...SIZES],
      description: "Input size token",
      table: { defaultValue: { summary: "md" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "search",
        "date",
        "datetime-local",
        "url",
      ],
    },
  },
  args: {
    placeholder: "Enter value…",
    size: "md",
    density: "standard",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {};

export const Small: Story = { args: { size: "sm" } };

export const Large: Story = { args: { size: "lg" } };

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Unavailable" },
};

export const Compact: Story = {
  args: { density: "compact", placeholder: "Compact density" },
};

// ─── Governance matrices ───────────────────────────────────────────────────

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="md">
          <span className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </span>
          <Input placeholder={`State: ${state}`} state={state} />
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceAllSizes: Story = {
  name: "Governance — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {SIZES.map((size) => (
          <Input key={size} placeholder={`Size: ${size}`} size={size} />
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAllDensities: Story = {
  name: "Governance — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {DENSITIES.map((density) => (
          <Input
            density={density}
            key={density}
            placeholder={`Density: ${density}`}
          />
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` on `Input` — governed values (`data-slot="input"`, `data-component="Input"`, `data-recipe="form-control"`) must win in the DOM.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Input
        aria-label="Inspect governed attributes"
        data-component="Override"
        data-slot="override"
        data-testid="governance-input"
        placeholder="Inspect governed attributes"
      />
    </StoryFrame>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → input (single-slot form-control leaf)
        </p>
        <Input
          aria-label="Employee ID"
          data-testid="slot-map-input"
          placeholder="EMP-00142"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernancePlayground: Story = {
  name: "Governance — Playground",
  parameters: { layout: "padded" },
  argTypes: {
    density: { control: "select", options: [...DENSITIES] },
    size: { control: "select", options: [...SIZES] },
    state: { control: "select", options: [...GOVERNED_STATES] },
  },
  args: {
    density: "standard",
    size: "md",
    state: "ready",
    placeholder: "Adjust density, size, and state",
  },
  render: ({ density, size, state, placeholder }) => (
    <StoryFrame width="md">
      <Input
        aria-label="Governed input playground"
        density={density}
        placeholder={placeholder}
        size={size}
        state={state}
      />
    </StoryFrame>
  ),
};

export const ErrorState: Story = {
  name: "State — Error",
  args: { state: "error", placeholder: "Invalid value" },
};

export const LoadingState: Story = {
  name: "State — Loading",
  args: { state: "loading", placeholder: "Loading…" },
};

export const InvalidState: Story = {
  name: "State — Invalid",
  args: { state: "invalid", placeholder: "Fails schema validation" },
};

export const ForbiddenState: Story = {
  name: "State — Forbidden",
  args: { state: "forbidden", placeholder: "Insufficient permission" },
};

// ─── ERP single fields ─────────────────────────────────────────────────────

export const EmployeeName: Story = {
  name: "ERP — Employee Name",
  render: (args) => (
    <StoryFrame width="md">
      <LabeledField id="erp-name" label="Full name" required>
        <Input {...args} id="erp-name" placeholder="Jane Doe" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const Email: Story = {
  name: "ERP — Email",
  render: (args) => (
    <StoryFrame width="md">
      <LabeledField id="erp-email" label="Work email" required>
        <Input
          {...args}
          id="erp-email"
          placeholder="jane.doe@company.com"
          type="email"
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const Password: Story = {
  name: "ERP — Password",
  render: (args) => (
    <StoryFrame width="md">
      <LabeledField id="erp-pwd" label="Password" required>
        <Input {...args} id="erp-pwd" placeholder="••••••••" type="password" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const Phone: Story = {
  name: "ERP — Phone",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="erp-phone" label="Phone">
        <Input id="erp-phone" placeholder="+61 400 000 000" type="tel" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const CurrencyAmount: Story = {
  name: "ERP — Currency Amount",
  render: (args) => (
    <StoryFrame width="sm">
      <LabeledField id="erp-amount" label="Invoice amount" required>
        <Input {...args} id="erp-amount" placeholder="0.00" type="number" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const SearchBar: Story = {
  name: "ERP — Search Bar",
  render: (args) => (
    <StoryFrame width="lg">
      <Input
        {...args}
        aria-label="Search records"
        placeholder="Search records, invoices, employees…"
        type="search"
      />
    </StoryFrame>
  ),
};

export const VendorCode: Story = {
  name: "ERP — Vendor Code",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="vendor-code" label="Vendor code" required>
        <Input id="vendor-code" placeholder="VND-0042" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const InvoiceNumber: Story = {
  name: "ERP — Invoice Number",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="inv-num" label="Invoice number">
        <Input id="inv-num" placeholder="INV-2026-0042" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const PurchaseOrderNumber: Story = {
  name: "ERP — Purchase Order Number",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="po-num" label="PO number">
        <Input id="po-num" placeholder="PO-2026-0118" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const GLAccountCode: Story = {
  name: "ERP — GL Account Code",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="gl-code" label="GL account">
        <Input id="gl-code" placeholder="6100 — Office Supplies" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const TaxId: Story = {
  name: "ERP — Tax ID / ABN",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="tax-id" label="Tax ID / ABN">
        <Input id="tax-id" placeholder="12 345 678 901" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const SkuCode: Story = {
  name: "ERP — SKU Code",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="sku" label="SKU">
        <Input id="sku" placeholder="SKU-WDG-442" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const Quantity: Story = {
  name: "ERP — Quantity",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="qty" label="Quantity">
        <Input id="qty" min={0} placeholder="1" type="number" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const PercentageRate: Story = {
  name: "ERP — Percentage Rate",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="rate" label="Discount rate">
        <Input id="rate" max={100} min={0} placeholder="10" type="number" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const PostingDate: Story = {
  name: "ERP — Posting Date",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="post-date" label="Posting date" required>
        <Input id="post-date" type="date" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const DueDateTime: Story = {
  name: "ERP — Due Date & Time",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="due-dt" label="Payment due">
        <Input id="due-dt" type="datetime-local" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const RecordIdReadonly: Story = {
  name: "ERP — Read-only Record ID",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="rec-id" label="Record ID">
        <Input disabled id="rec-id" value="INV-2026-0042" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const BankAccountNumber: Story = {
  name: "ERP — Bank Account Number",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="bank-acct" label="Account number">
        <Input id="bank-acct" inputMode="numeric" placeholder="12345678" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const WebUrl: Story = {
  name: "ERP — Web URL",
  render: () => (
    <StoryFrame width="lg">
      <LabeledField id="web-url" label="Vendor portal URL">
        <Input
          id="web-url"
          placeholder="https://vendor.example.com/portal"
          type="url"
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const PostalCode: Story = {
  name: "ERP — Postal Code",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="postal" label="Postcode">
        <Input id="postal" placeholder="3000" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const CostCentre: Story = {
  name: "ERP — Cost Centre",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="cc" label="Cost centre">
        <Input id="cc" placeholder="CC-ENG-100" />
      </LabeledField>
    </StoryFrame>
  ),
};

export const FiscalPeriod: Story = {
  name: "ERP — Fiscal Period",
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="fiscal" label="Fiscal period">
        <Input id="fiscal" placeholder="FY2026-Q2" />
      </LabeledField>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const RegistrationFormFields: Story = {
  name: "ERP — Registration Form Fields",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryRow gap="sm" wrap>
          <StoryStack className="min-w-0 flex-1" gap="xs">
            <Label htmlFor="reg-first">First name</Label>
            <Input id="reg-first" placeholder="Jane" />
          </StoryStack>
          <StoryStack className="min-w-0 flex-1" gap="xs">
            <Label htmlFor="reg-last">Last name</Label>
            <Input id="reg-last" placeholder="Doe" />
          </StoryStack>
        </StoryRow>
        <LabeledField id="reg-email" label="Work email" required>
          <Input id="reg-email" placeholder="jane.doe@corp.com" type="email" />
        </LabeledField>
        <LabeledField id="reg-phone" label="Phone">
          <Input id="reg-phone" placeholder="+61 400 000 000" type="tel" />
        </LabeledField>
        <LabeledField id="reg-dept" label="Department code">
          <Input id="reg-dept" placeholder="ENG-001" />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const VendorMasterFields: Story = {
  name: "ERP — Vendor Master Fields",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledField id="vm-name" label="Company name" required>
          <Input id="vm-name" placeholder="Acme Supplies Ltd" />
        </LabeledField>
        <LabeledField id="vm-tax" label="Tax ID / ABN">
          <Input id="vm-tax" placeholder="12 345 678 901" />
        </LabeledField>
        <LabeledField id="vm-email" label="Accounts payable email">
          <Input id="vm-email" placeholder="ap@acme.example" type="email" />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const LoginCredentials: Story = {
  name: "ERP — Login Credentials",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <LabeledField id="login-email" label="Email" required>
          <Input
            autoComplete="username"
            id="login-email"
            placeholder="you@company.com"
            type="email"
          />
        </LabeledField>
        <LabeledField id="login-pwd" label="Password" required>
          <Input
            autoComplete="current-password"
            id="login-pwd"
            type="password"
          />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InvoiceHeaderFields: Story = {
  name: "ERP — Invoice Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow gap="sm" wrap>
          <StoryStack className="min-w-0 flex-1" gap="xs">
            <Label htmlFor="ih-num">Invoice number</Label>
            <Input disabled id="ih-num" value="INV-2026-0042" />
          </StoryStack>
          <StoryStack className="min-w-0 flex-1" gap="xs">
            <Label htmlFor="ih-date">Invoice date</Label>
            <Input id="ih-date" type="date" />
          </StoryStack>
        </StoryRow>
        <StoryRow gap="sm" wrap>
          <StoryStack className="min-w-0 flex-1" gap="xs">
            <Label htmlFor="ih-vendor">Vendor</Label>
            <Input id="ih-vendor" placeholder="Acme Software Ltd" />
          </StoryStack>
          <StoryStack className="min-w-0 flex-1" gap="xs">
            <Label htmlFor="ih-due">Due date</Label>
            <Input id="ih-due" type="date" />
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const JournalEntryLine: Story = {
  name: "ERP — Journal Entry Line",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="end" gap="sm" wrap>
        <StoryStack className="min-w-0 flex-1" gap="xs">
          <Label htmlFor="je-acct">Account</Label>
          <Input id="je-acct" placeholder="5200 — Accrued Expenses" />
        </StoryStack>
        <StoryStack className="w-32" gap="xs">
          <Label htmlFor="je-debit">Debit</Label>
          <Input id="je-debit" placeholder="0.00" type="number" />
        </StoryStack>
        <StoryStack className="w-32" gap="xs">
          <Label htmlFor="je-credit">Credit</Label>
          <Input id="je-credit" placeholder="0.00" type="number" />
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const FilterToolbar: Story = {
  name: "ERP — Filter Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" gap="sm" wrap>
        <div className="min-w-48 flex-1">
          <Input
            density="compact"
            placeholder="Search invoices…"
            size="sm"
            type="search"
          />
        </div>
        <div className="w-36">
          <Input density="compact" placeholder="Vendor" size="sm" />
        </div>
        <div className="w-32">
          <Input density="compact" size="sm" type="date" />
        </div>
      </StoryRow>
    </StoryFrame>
  ),
};

export const InlineEditRow: Story = {
  name: "ERP — Inline Edit Row",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" gap="sm">
        <div className="w-28">
          <Input placeholder="Line #" size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <Input placeholder="Description" size="sm" />
        </div>
        <div className="w-20">
          <Input placeholder="Qty" size="sm" type="number" />
        </div>
        <div className="w-28">
          <Input placeholder="Unit price" size="sm" type="number" />
        </div>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ValidationStates: Story = {
  name: "ERP — Validation States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledField id="val-default" label="Default">
          <Input id="val-default" placeholder="Enter employee ID" />
        </LabeledField>
        <LabeledField id="val-error" label="Error">
          <Input
            aria-invalid
            id="val-error"
            placeholder="Invalid employee ID"
            state="error"
          />
        </LabeledField>
        <LabeledField id="val-disabled" label="Disabled">
          <Input disabled id="val-disabled" placeholder="Read-only field" />
        </LabeledField>
        <LabeledField id="val-loading" label="Loading">
          <Input
            id="val-loading"
            placeholder="Fetching data…"
            state="loading"
          />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PermissionRestricted: Story = {
  name: "ERP — Permission Restricted",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <LabeledField id="salary" label="Annual salary">
        <Input
          disabled
          id="salary"
          state="forbidden"
          value="Restricted — HR Admin required"
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const LiveValidation: Story = {
  name: "ERP — Live Validation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <ValidatedEmployeeIdField />
    </StoryFrame>
  ),
};

export const AsyncLookup: Story = {
  name: "ERP — Async Lookup Loading",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <AsyncVendorLookupField />
    </StoryFrame>
  ),
};

export const InputGroupReference: Story = {
  name: "ERP — Use InputGroup for adornments",
  parameters: {
    docs: {
      description: {
        story:
          "Plain `Input` is for simple labeled fields. Prefix/suffix text, icons, currency symbols, and inline clear buttons belong in `Primitives/InputGroup`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledField id="plain-desc" label="Description">
          <Input id="plain-desc" placeholder="Consulting services — Q1 2026" />
        </LabeledField>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Needs a prefix or icon?</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/InputGroup for search icons, currency prefixes, and
            record-ID patterns.
          </span>
        </StoryStack>
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
          'Pair every input with a `Label` via `htmlFor`/`id`. Use `aria-invalid` and `state="error"` for validation. Provide `aria-label` on standalone search fields.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <LabeledField id="a11y-email" label="Work email" required>
          <Input
            aria-describedby="a11y-email-hint"
            aria-invalid
            autoComplete="email"
            id="a11y-email"
            placeholder="name@company.com"
            state="error"
            type="email"
          />
        </LabeledField>
        <span className="text-destructive text-xs" id="a11y-email-hint" role="alert">
          Enter a valid company email address.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};
