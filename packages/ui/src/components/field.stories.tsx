import { DENSITIES, GOVERNED_STATES, SIZES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Checkbox } from "./checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";
import { Input } from "./input";
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

function ValidatedEmployeeIdField() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && value.length < 4;

  return (
    <Field state={invalid ? "error" : "ready"}>
      <FieldLabel htmlFor="emp-id">Employee ID *</FieldLabel>
      <Input
        id="emp-id"
        onBlur={() => setTouched(true)}
        onChange={(event) => setValue(event.target.value)}
        placeholder="EMP-0000"
        value={value}
      />
      <FieldDescription>Format: EMP- followed by 4 digits.</FieldDescription>
      {invalid ? (
        <FieldError
          errors={[{ message: "Employee ID must be at least 4 characters" }]}
        />
      ) : null}
    </Field>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed form-field shell for ERP data entry. Composes `FieldLabel`, `FieldDescription`, `FieldError`, `FieldSet`, and `FieldSeparator` with `orientation`, `density`, `size`, and `state`.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
      table: { defaultValue: { summary: "vertical" } },
    },
    density: {
      control: "select",
      options: [...DENSITIES],
    },
    size: {
      control: "select",
      options: [...SIZES],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
  },
  args: {
    orientation: "vertical",
    density: "standard",
    size: "md",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Account</FieldLegend>
        <Field {...args}>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" placeholder="you@example.com" type="email" />
          <FieldDescription>We will never share your email.</FieldDescription>
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const Horizontal: Story = {
  name: "Field — Horizontal",
  args: { orientation: "horizontal" },
  render: (args) => (
    <StoryFrame width="xl">
      <Field {...args}>
        <FieldLabel htmlFor="field-name">Name</FieldLabel>
        <Input id="field-name" placeholder="Jane Doe" />
      </Field>
    </StoryFrame>
  ),
};

export const Responsive: Story = {
  name: "Field — Responsive",
  args: { orientation: "responsive" },
  render: (args) => (
    <StoryFrame width="lg">
      <Field {...args}>
        <FieldLabel htmlFor="field-responsive">Department</FieldLabel>
        <Input id="field-responsive" placeholder="Engineering" />
        <FieldDescription>
          Stacks vertically on narrow viewports.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const WithError: Story = {
  name: "Field — With Error",
  render: (args) => (
    <StoryFrame width="md">
      <FieldSet>
        <Field {...args} state="error">
          <FieldLabel htmlFor="field-password">Password</FieldLabel>
          <Input id="field-password" state="error" type="password" />
          <FieldError errors={[{ message: "Password is required" }]} />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const MultipleErrors: Story = {
  name: "Field — Multiple Errors",
  render: (args) => (
    <StoryFrame width="md">
      <FieldSet>
        <Field {...args} state="error">
          <FieldLabel htmlFor="field-username">Username</FieldLabel>
          <Input id="field-username" state="error" />
          <FieldError
            errors={[{ message: "Required" }, { message: "Too short" }]}
          />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  name: "Field — Disabled",
  render: (args) => (
    <StoryFrame width="md">
      <Field {...args}>
        <FieldLabel htmlFor="field-disabled">Disabled field</FieldLabel>
        <Input disabled id="field-disabled" placeholder="Unavailable" />
        <FieldDescription>
          This field is read-only for your role.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const WithSeparator: Story = {
  name: "FieldSet — With Separator",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Contact details</FieldLegend>
        <Field>
          <FieldLabel htmlFor="sep-email">Email</FieldLabel>
          <Input id="sep-email" placeholder="jane@company.com" type="email" />
        </Field>
        <FieldSeparator>Work address</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="sep-street">Street</FieldLabel>
          <Input id="sep-street" placeholder="123 Main St" />
        </Field>
        <Field>
          <FieldLabel htmlFor="sep-city">City</FieldLabel>
          <Input id="sep-city" placeholder="Sydney" />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const FieldGroupLayout: Story = {
  name: "Field — Group Layout",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldGroup>
        <FieldTitle>Invoice totals</FieldTitle>
        <StoryRow gap="md" wrap>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="subtotal">Subtotal</FieldLabel>
              <Input id="subtotal" placeholder="0.00" type="number" />
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="tax">Tax</FieldLabel>
              <Input id="tax" placeholder="0.00" type="number" />
            </Field>
          </div>
        </StoryRow>
      </FieldGroup>
    </StoryFrame>
  ),
};

// ─── Governance matrices ───────────────────────────────────────────────────

export const GovernanceStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="md">
          <span className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </span>
          <Field state={state}>
            <FieldLabel htmlFor={`state-${state}`}>Field label</FieldLabel>
            <Input id={`state-${state}`} placeholder="Value" state={state} />
          </Field>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const AllOrientations: Story = {
  name: "Matrix — Orientations",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      {(["vertical", "horizontal", "responsive"] as const).map(
        (orientation) => (
          <StoryStack gap="xs" key={orientation}>
            <span className="font-medium text-muted-foreground text-xs">
              orientation=&quot;{orientation}&quot;
            </span>
            <Field orientation={orientation}>
              <FieldLabel htmlFor={`ori-${orientation}`}>
                Cost centre
              </FieldLabel>
              <Input id={`ori-${orientation}`} placeholder="CC-100" />
            </Field>
          </StoryStack>
        )
      )}
    </StoryStack>
  ),
};

export const AllDensities: Story = {
  name: "Matrix — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {DENSITIES.map((density) => (
        <Field density={density} key={density}>
          <FieldLabel htmlFor={`density-${density}`}>{density}</FieldLabel>
          <Input
            density={density}
            id={`density-${density}`}
            placeholder="Value"
          />
        </Field>
      ))}
    </StoryStack>
  ),
};

// ─── Composed control types ────────────────────────────────────────────────

export const WithSelect: Story = {
  name: "Field — With Select",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel htmlFor="field-dept">Department</FieldLabel>
        <Select>
          <SelectTrigger id="field-dept">
            <SelectValue placeholder="Select department…" />
          </SelectTrigger>
          <SelectContent>
            {["Engineering", "Finance", "HR", "Operations"].map((dept) => (
              <SelectItem key={dept} value={dept.toLowerCase()}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>Determines approval routing.</FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const WithTextarea: Story = {
  name: "Field — With Textarea",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel htmlFor="field-notes">Internal notes</FieldLabel>
        <Textarea id="field-notes" placeholder="Add context for approvers…" />
        <FieldDescription>Visible to finance reviewers only.</FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const WithCheckbox: Story = {
  name: "Field — With Checkbox",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field orientation="horizontal">
        <Checkbox defaultChecked id="field-terms" />
        <FieldContent>
          <FieldLabel htmlFor="field-terms">Accept terms</FieldLabel>
          <FieldDescription>
            I agree to the procurement policy and data handling terms.
          </FieldDescription>
        </FieldContent>
      </Field>
    </StoryFrame>
  ),
};

export const WithSwitch: Story = {
  name: "Field — With Switch",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field orientation="horizontal">
        <Switch defaultChecked id="field-notify" />
        <FieldContent>
          <FieldLabel htmlFor="field-notify">Email notifications</FieldLabel>
          <FieldDescription>
            Receive alerts when records require your approval.
          </FieldDescription>
        </FieldContent>
      </Field>
    </StoryFrame>
  ),
};

export const ValidatedField: Story = {
  name: "Field — Live Validation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <ValidatedEmployeeIdField />
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const EmployeeRecordForm: Story = {
  name: "ERP — Employee Record Form",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>Employee details</FieldLegend>
        <StoryRow gap="md" wrap>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="emp-first">First name *</FieldLabel>
              <Input id="emp-first" placeholder="Jane" />
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="emp-last">Last name *</FieldLabel>
              <Input id="emp-last" placeholder="Doe" />
            </Field>
          </div>
        </StoryRow>
        <Field>
          <FieldLabel htmlFor="emp-email">Work email *</FieldLabel>
          <Input
            id="emp-email"
            placeholder="jane.doe@company.com"
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="emp-dept">Department</FieldLabel>
          <Select>
            <SelectTrigger id="emp-dept">
              <SelectValue placeholder="Select department…" />
            </SelectTrigger>
            <SelectContent>
              {["Engineering", "Finance", "HR", "Sales"].map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="emp-title">Job title</FieldLabel>
          <Input id="emp-title" placeholder="Senior Software Engineer" />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const VendorContactForm: Story = {
  name: "ERP — Vendor Contact Form",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Vendor contact</FieldLegend>
        <Field>
          <FieldLabel htmlFor="vendor-name">Company name *</FieldLabel>
          <Input id="vendor-name" placeholder="Acme Supplies Ltd" />
        </Field>
        <Field>
          <FieldLabel htmlFor="vendor-contact">Primary contact</FieldLabel>
          <Input id="vendor-contact" placeholder="Sarah Mitchell" />
        </Field>
        <Field>
          <FieldLabel htmlFor="vendor-email">Accounts email</FieldLabel>
          <Input id="vendor-email" placeholder="ap@acme.example" type="email" />
          <FieldDescription>
            Used for invoice delivery and payment remittance.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="vendor-tax">Tax ID / ABN</FieldLabel>
          <Input id="vendor-tax" placeholder="12 345 678 901" />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const InvoiceLineItemField: Story = {
  name: "ERP — Invoice Line Item",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldGroup>
        <FieldTitle>Line item</FieldTitle>
        <Field>
          <FieldLabel htmlFor="line-desc">Description *</FieldLabel>
          <Input
            id="line-desc"
            placeholder="Consulting services — March 2026"
          />
        </Field>
        <StoryRow gap="md" wrap>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="line-qty">Quantity</FieldLabel>
              <Input id="line-qty" placeholder="1" type="number" />
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="line-rate">Unit price</FieldLabel>
              <Input id="line-rate" placeholder="150.00" type="number" />
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="line-tax">Tax code</FieldLabel>
              <Select>
                <SelectTrigger id="line-tax">
                  <SelectValue placeholder="GST 10%" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gst">GST 10%</SelectItem>
                  <SelectItem value="exempt">Tax exempt</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </StoryRow>
      </FieldGroup>
    </StoryFrame>
  ),
};

export const PurchaseOrderField: Story = {
  name: "ERP — Purchase Order Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend variant="label">PO header</FieldLegend>
        <Field>
          <FieldLabel htmlFor="po-vendor">Vendor *</FieldLabel>
          <Select>
            <SelectTrigger id="po-vendor">
              <SelectValue placeholder="Select vendor…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acme">Acme Supplies</SelectItem>
              <SelectItem value="global">Global Parts Co.</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="po-delivery">Requested delivery</FieldLabel>
          <Input id="po-delivery" type="date" />
        </Field>
        <Field>
          <FieldLabel htmlFor="po-notes">Buyer notes</FieldLabel>
          <Textarea
            id="po-notes"
            placeholder="Delivery instructions or special terms…"
          />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const GLAccountField: Story = {
  name: "ERP — GL Account Field",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel htmlFor="gl-account">GL account *</FieldLabel>
        <Input id="gl-account" placeholder="6100 — Office Supplies" />
        <FieldDescription>
          Must be an active account in the current fiscal year chart of
          accounts.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const AddressFieldGroup: Story = {
  name: "ERP — Address Field Group",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Ship-to address</FieldLegend>
        <Field>
          <FieldLabel htmlFor="addr-line1">Address line 1</FieldLabel>
          <Input id="addr-line1" placeholder="123 Business Park Dr" />
        </Field>
        <Field>
          <FieldLabel htmlFor="addr-line2">Address line 2</FieldLabel>
          <Input id="addr-line2" placeholder="Suite 400" />
        </Field>
        <StoryRow gap="md" wrap>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="addr-city">City</FieldLabel>
              <Input id="addr-city" placeholder="Melbourne" />
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="addr-post">Postcode</FieldLabel>
              <Input id="addr-post" placeholder="3000" />
            </Field>
          </div>
        </StoryRow>
        <Field>
          <FieldLabel htmlFor="addr-country">Country</FieldLabel>
          <Select>
            <SelectTrigger id="addr-country">
              <SelectValue placeholder="Australia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="nz">New Zealand</SelectItem>
              <SelectItem value="sg">Singapore</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const FormValidationErrors: Story = {
  name: "ERP — Form Validation Errors",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Submit expense report</FieldLegend>
        <Field state="error">
          <FieldLabel htmlFor="val-amount">Amount *</FieldLabel>
          <Input
            id="val-amount"
            placeholder="0.00"
            state="error"
            type="number"
          />
          <FieldError
            errors={[{ message: "Amount must be greater than zero" }]}
          />
        </Field>
        <Field state="error">
          <FieldLabel htmlFor="val-date">Expense date *</FieldLabel>
          <Input id="val-date" state="error" type="date" />
          <FieldError errors={[{ message: "Date cannot be in the future" }]} />
        </Field>
        <Field state="error">
          <FieldLabel htmlFor="val-category">Category *</FieldLabel>
          <Select>
            <SelectTrigger id="val-category">
              <SelectValue placeholder="Select category…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="meals">Meals</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[{ message: "Category is required" }]} />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const PermissionRestrictedField: Story = {
  name: "ERP — Permission Restricted Field",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel htmlFor="restricted-salary">Annual salary</FieldLabel>
        <Input
          disabled
          id="restricted-salary"
          placeholder="Restricted"
          value="—"
        />
        <FieldDescription>
          You need HR Admin permission to view or edit compensation fields.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const AuditMetadataFields: Story = {
  name: "ERP — Audit Metadata Fields",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldGroup>
        <FieldTitle>Record metadata</FieldTitle>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="meta-created">Created by</FieldLabel>
          <Input disabled id="meta-created" value="Jane Doe · 12 Mar 2026" />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="meta-modified">Last modified</FieldLabel>
          <Input disabled id="meta-modified" value="Alex Brown · 18 Mar 2026" />
        </Field>
      </FieldGroup>
    </StoryFrame>
  ),
};

export const ApprovalCommentField: Story = {
  name: "ERP — Approval Comment Field",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel htmlFor="approval-comment">Approval comment</FieldLabel>
        <Textarea
          id="approval-comment"
          placeholder="Optional note for the requester and audit trail…"
        />
        <FieldDescription>
          Included in the approval history for PO-1042.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const SearchFilterField: Story = {
  name: "ERP — Search Filter Field",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Field>
        <FieldLabel htmlFor="filter-search">Search records</FieldLabel>
        <Input
          id="filter-search"
          placeholder="Invoice number, vendor, or assignee…"
          type="search"
        />
        <FieldDescription>
          Filters the current module list. Press Enter to apply.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const MultiSectionForm: Story = {
  name: "ERP — Multi-Section Form",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>New customer</FieldLegend>
        <Field>
          <FieldLabel htmlFor="cust-name">Customer name *</FieldLabel>
          <Input id="cust-name" placeholder="Northwind Traders" />
        </Field>
        <FieldSeparator>Billing</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="cust-billing-email">Billing email</FieldLabel>
          <Input
            id="cust-billing-email"
            placeholder="billing@northwind.example"
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="cust-terms">Payment terms</FieldLabel>
          <Select>
            <SelectTrigger id="cust-terms">
              <SelectValue placeholder="Net 30" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net15">Net 15</SelectItem>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net60">Net 60</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldSeparator>Preferences</FieldSeparator>
        <Field orientation="horizontal">
          <Switch defaultChecked id="cust-portal" />
          <FieldContent>
            <FieldLabel htmlFor="cust-portal">
              Customer portal access
            </FieldLabel>
            <FieldDescription>
              Allow self-service invoice downloads.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Every control needs a `FieldLabel` with matching `htmlFor`/`id`. `FieldError` renders `role="alert"`. Field root uses `role="group"`.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Field state="error">
        <FieldLabel htmlFor="a11y-email">Work email *</FieldLabel>
        <Input
          aria-invalid
          id="a11y-email"
          placeholder="name@company.com"
          state="error"
          type="email"
        />
        <FieldError
          errors={[{ message: "Enter a valid company email address" }]}
        />
      </Field>
    </StoryFrame>
  ),
};

export const FormFieldTokenStates: Story = {
  name: "Token — Form Field State Surfaces",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "All four form-field surfaces driven by `--afenda-form-field-*` tokens. Default, focused (click into), disabled, and invalid borders/backgrounds adapt in dark mode automatically via the generated token values.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <Field>
          <FieldLabel htmlFor="ff-default">Default</FieldLabel>
          <Input
            id="ff-default"
            placeholder="Placeholder text"
          />
          <FieldDescription>Border: --afenda-form-field-border · Placeholder: --afenda-form-field-placeholder</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="ff-disabled">Disabled</FieldLabel>
          <Input
            disabled
            id="ff-disabled"
            placeholder="Not editable"
          />
          <FieldDescription>Background: --afenda-form-field-disabled-background</FieldDescription>
        </Field>

        <Field state="error">
          <FieldLabel htmlFor="ff-invalid">Invalid</FieldLabel>
          <Input
            aria-invalid
            id="ff-invalid"
            placeholder="Error state"
            state="error"
          />
          <FieldError errors={[{ message: "Border: --afenda-form-field-invalid-border" }]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="ff-textarea">Textarea</FieldLabel>
          <Textarea
            id="ff-textarea"
            placeholder="Multiline — same form-field border/background tokens"
            rows={3}
          />
        </Field>
      </StoryStack>
    </StoryFrame>
  ),
};
