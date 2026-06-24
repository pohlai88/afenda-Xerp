import { DENSITIES, GOVERNED_STATES, SIZES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  FieldLegend,
  FieldSeparator,
  FieldSet,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
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

const VENDOR_CODE_PATTERN = /^VND-\d{4}$/u;

function ValidatedVendorCodeField() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && !VENDOR_CODE_PATTERN.test(value);

  return (
    <FormItem state={invalid ? "error" : "ready"}>
      <FormLabel htmlFor="vendor-code">Vendor code *</FormLabel>
      <FormControl>
        <Input
          id="vendor-code"
          onBlur={() => setTouched(true)}
          onChange={(event) => setValue(event.target.value)}
          placeholder="VND-0001"
          {...(invalid ? { state: "error" as const } : {})}
          value={value}
        />
      </FormControl>
      <FormDescription>Format: VND- followed by 4 digits.</FormDescription>
      {invalid ? (
        <FormMessage
          errors={[{ message: "Vendor code must match VND-####" }]}
        />
      ) : null}
    </FormItem>
  );
}

// ─── Form (Field aliases) ──────────────────────────────────────────────────

function FormPlaygroundDemo({
  density = "standard",
  orientation = "vertical",
  size = "md",
  state = "ready",
}: {
  readonly density?: (typeof DENSITIES)[number];
  readonly orientation?: "vertical" | "horizontal" | "responsive";
  readonly size?: (typeof SIZES)[number];
  readonly state?: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryFrame width="md">
      <Form>
        <FormItem
          density={density}
          orientation={orientation}
          size={size}
          state={state}
        >
          <FormLabel htmlFor="form-playground">Purchase order total</FormLabel>
          <FormControl>
            <Input id="form-playground" placeholder="12,450.00" type="number" />
          </FormControl>
          <FormDescription>
            Adjust orientation, density, size, and governed state from controls.
          </FormDescription>
        </FormItem>
      </Form>
    </StoryFrame>
  );
}

function FormStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryFrame width="md">
      <p className="font-mono text-muted-foreground text-xs">
        state=&quot;{state}&quot;
      </p>
      <FormItem state={state}>
        <FormLabel htmlFor={`gov-form-${state}`}>Amount</FormLabel>
        <FormControl>
          <Input id={`gov-form-${state}`} placeholder="0.00" state={state} />
        </FormControl>
      </FormItem>
    </StoryFrame>
  );
}

const meta = {
  title: "Primitives/Form",
  component: FormItem,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed form primitives — shadcn v4 `Form*` aliases over `Field*`. `Form` = `FieldGroup`, `FormItem` = `Field`, `FormControl` = `FieldContent`, `FormMessage` = `FieldError`. Use with governed inputs for ERP data entry.",
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
    state: "ready",
  },
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground & governance probes ────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <FormPlaygroundDemo
      density={args.density}
      orientation={args.orientation}
      size={args.size}
      state={args.state}
    />
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Consumer `data-*` props cannot override governed Form alias attributes on `FormItem`, `FormLabel`, or `FormMessage`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <FormItem
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-testid="governance-form-item"
        state="ready"
      >
        <FormLabel
          data-component="Override"
          data-slot="override"
          htmlFor="authority-email"
        >
          Work email
        </FormLabel>
        <FormControl>
          <Input id="authority-email" placeholder="name@company.com" />
        </FormControl>
        <FormMessage
          data-component="Override"
          data-slot="override"
          errors={[{ message: "Required" }]}
        />
      </FormItem>
    </StoryFrame>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Form aliases emit the same governed `data-slot` values as Field. `Form` → field-group · `FormItem` → field · `FormLabel` → field-label · `FormControl` → field-content · `FormDescription` → field-description · `FormMessage` → field-error.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          Form → field-group · FormItem → field · FormLabel → field-label ·
          FormControl → field-content · FormDescription → field-description ·
          FormMessage → field-error
        </p>
        <Form data-testid="slot-map-form">
          <FormItem data-testid="slot-map-item">
            <FormLabel htmlFor="slot-map-email">
              Inspect slot attributes
            </FormLabel>
            <FormControl data-testid="slot-map-control">
              <Input id="slot-map-email" placeholder="name@company.com" />
            </FormControl>
            <FormDescription>
              Open DevTools and verify governed attributes on each alias.
            </FormDescription>
            <FormMessage errors={[{ message: "Example validation message" }]} />
          </FormItem>
        </Form>
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
        <FormStateProbe key={state} state={state} />
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
          '`FormLabel` pairs with control `id`. `FormMessage` renders `role="alert"`. `FormItem` defaults to `role="group"`.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <FormItem state="error">
        <FormLabel htmlFor="a11y-email">Work email *</FormLabel>
        <FormControl>
          <Input
            aria-invalid
            id="a11y-email"
            placeholder="name@company.com"
            state="error"
            type="email"
          />
        </FormControl>
        <FormMessage
          errors={[{ message: "Enter a valid company email address" }]}
        />
      </FormItem>
    </StoryFrame>
  ),
};

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Form>
        <FormItem {...args}>
          <FormLabel htmlFor="form-email">Work email</FormLabel>
          <FormControl>
            <Input
              id="form-email"
              placeholder="jane@company.com"
              type="email"
            />
          </FormControl>
          <FormDescription>
            Used for login and approval notifications.
          </FormDescription>
        </FormItem>
      </Form>
    </StoryFrame>
  ),
};

export const WithError: Story = {
  name: "Form — With Error Message",
  parameters: {
    docs: {
      description: {
        story:
          'Validation errors render in a live `role="alert"` region associated with the field.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Password is required"
    );
  },
  render: (args) => (
    <StoryFrame width="md">
      <FormItem {...args} state="error">
        <FormLabel htmlFor="form-password">Password</FormLabel>
        <FormControl>
          <Input id="form-password" state="error" type="password" />
        </FormControl>
        <FormMessage errors={[{ message: "Password is required" }]} />
      </FormItem>
    </StoryFrame>
  ),
};

export const MultipleErrors: Story = {
  name: "Form — Multiple Errors",
  render: (args) => (
    <StoryFrame width="md">
      <FormItem {...args} state="error">
        <FormLabel htmlFor="form-username">Username</FormLabel>
        <FormControl>
          <Input id="form-username" state="error" />
        </FormControl>
        <FormMessage
          errors={[{ message: "Required" }, { message: "Too short" }]}
        />
      </FormItem>
    </StoryFrame>
  ),
};

export const Horizontal: Story = {
  name: "Form — Horizontal Item",
  args: { orientation: "horizontal" },
  render: (args) => (
    <StoryFrame width="xl">
      <FormItem {...args}>
        <FormLabel htmlFor="form-dept">Department</FormLabel>
        <FormControl>
          <Input id="form-dept" placeholder="Engineering" />
        </FormControl>
      </FormItem>
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  name: "Form — Disabled",
  render: (args) => (
    <StoryFrame width="md">
      <FormItem {...args}>
        <FormLabel htmlFor="form-disabled">Record ID</FormLabel>
        <FormControl>
          <Input disabled id="form-disabled" value="INV-2024-0892" />
        </FormControl>
        <FormDescription>System-generated — cannot be edited.</FormDescription>
      </FormItem>
    </StoryFrame>
  ),
};

export const FormGroup: Story = {
  name: "Form — Group (multiple items)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Form>
        <FormItem>
          <FormLabel htmlFor="grp-first">First name</FormLabel>
          <FormControl>
            <Input id="grp-first" placeholder="Jane" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="grp-last">Last name</FormLabel>
          <FormControl>
            <Input id="grp-last" placeholder="Doe" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="grp-email">Email</FormLabel>
          <FormControl>
            <Input id="grp-email" placeholder="jane@company.com" type="email" />
          </FormControl>
        </FormItem>
      </Form>
    </StoryFrame>
  ),
};

export const FieldSetSection: Story = {
  name: "Form — FieldSet Section",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Account credentials</FieldLegend>
        <FormItem>
          <FormLabel htmlFor="fs-email">Email</FormLabel>
          <FormControl>
            <Input id="fs-email" type="email" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="fs-password">Password</FormLabel>
          <FormControl>
            <Input id="fs-password" type="password" />
          </FormControl>
        </FormItem>
      </FieldSet>
    </StoryFrame>
  ),
};

// ─── Governance matrices ───────────────────────────────────────────────────

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
            <FormItem orientation={orientation}>
              <FormLabel htmlFor={`ori-${orientation}`}>Cost centre</FormLabel>
              <FormControl>
                <Input id={`ori-${orientation}`} placeholder="CC-100" />
              </FormControl>
            </FormItem>
          </StoryStack>
        )
      )}
    </StoryStack>
  ),
};

// ─── Composed control types ────────────────────────────────────────────────

export const WithSelect: Story = {
  name: "Form — With Select",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FormItem>
        <FormLabel htmlFor="form-select-dept">Department</FormLabel>
        <FormControl>
          <Select>
            <SelectTrigger id="form-select-dept">
              <SelectValue placeholder="Select department…" />
            </SelectTrigger>
            <SelectContent>
              {["Finance", "HR", "Operations", "Procurement"].map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription>Determines approval workflow routing.</FormDescription>
      </FormItem>
    </StoryFrame>
  ),
};

export const WithTextarea: Story = {
  name: "Form — With Textarea",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FormItem>
        <FormLabel htmlFor="form-notes">Notes</FormLabel>
        <FormControl>
          <Textarea
            id="form-notes"
            placeholder="Internal notes for reviewers…"
          />
        </FormControl>
      </FormItem>
    </StoryFrame>
  ),
};

export const WithCheckbox: Story = {
  name: "Form — With Checkbox",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FormItem orientation="horizontal">
        <FormControl>
          <Checkbox defaultChecked id="form-terms" />
        </FormControl>
        <StoryStack gap="xs">
          <FormLabel htmlFor="form-terms">Accept procurement policy</FormLabel>
          <FormDescription>
            Required before submitting purchase orders over $5,000.
          </FormDescription>
        </StoryStack>
      </FormItem>
    </StoryFrame>
  ),
};

export const WithSwitch: Story = {
  name: "Form — With Switch",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FormItem orientation="horizontal">
        <FormControl>
          <Switch defaultChecked id="form-notify" />
        </FormControl>
        <StoryStack gap="xs">
          <FormLabel htmlFor="form-notify">Email on approval</FormLabel>
          <FormDescription>
            Notify when records need your sign-off.
          </FormDescription>
        </StoryStack>
      </FormItem>
    </StoryFrame>
  ),
};

export const LiveValidation: Story = {
  name: "Form — Live Validation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <ValidatedVendorCodeField />
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const LoginForm: Story = {
  name: "ERP — Login Form",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <Form>
        <FormItem>
          <FormLabel htmlFor="login-email">Email</FormLabel>
          <FormControl>
            <Input
              id="login-email"
              placeholder="you@company.com"
              type="email"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="login-password">Password</FormLabel>
          <FormControl>
            <Input id="login-password" type="password" />
          </FormControl>
        </FormItem>
        <Button emphasis="solid" intent="primary" size="sm">
          Sign in
        </Button>
      </Form>
    </StoryFrame>
  ),
};

export const EmployeeOnboardingForm: Story = {
  name: "ERP — Employee Onboarding",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>New employee</FieldLegend>
        <StoryRow gap="md" wrap>
          <div className="flex-1">
            <FormItem>
              <FormLabel htmlFor="emp-first">First name *</FormLabel>
              <FormControl>
                <Input id="emp-first" placeholder="Jane" />
              </FormControl>
            </FormItem>
          </div>
          <div className="flex-1">
            <FormItem>
              <FormLabel htmlFor="emp-last">Last name *</FormLabel>
              <FormControl>
                <Input id="emp-last" placeholder="Doe" />
              </FormControl>
            </FormItem>
          </div>
        </StoryRow>
        <FormItem>
          <FormLabel htmlFor="emp-email">Work email *</FormLabel>
          <FormControl>
            <Input
              id="emp-email"
              placeholder="jane.doe@company.com"
              type="email"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="emp-start">Start date</FormLabel>
          <FormControl>
            <Input id="emp-start" type="date" />
          </FormControl>
        </FormItem>
      </FieldSet>
    </StoryFrame>
  ),
};

export const VendorMasterForm: Story = {
  name: "ERP — Vendor Master",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Form>
        <FormItem>
          <FormLabel htmlFor="vendor-name">Company name *</FormLabel>
          <FormControl>
            <Input id="vendor-name" placeholder="Acme Supplies Ltd" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="vendor-tax">Tax ID / ABN</FormLabel>
          <FormControl>
            <Input id="vendor-tax" placeholder="12 345 678 901" />
          </FormControl>
          <FormDescription>Required for AP tax reporting.</FormDescription>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="vendor-email">Accounts payable email</FormLabel>
          <FormControl>
            <Input
              id="vendor-email"
              placeholder="ap@acme.example"
              type="email"
            />
          </FormControl>
        </FormItem>
      </Form>
    </StoryFrame>
  ),
};

export const PurchaseOrderForm: Story = {
  name: "ERP — Purchase Order",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Form>
        <FormItem>
          <FormLabel htmlFor="po-vendor">Vendor *</FormLabel>
          <FormControl>
            <Select>
              <SelectTrigger id="po-vendor">
                <SelectValue placeholder="Select vendor…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acme">Acme Supplies</SelectItem>
                <SelectItem value="global">Global Parts Co.</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="po-delivery">Requested delivery</FormLabel>
          <FormControl>
            <Input id="po-delivery" type="date" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="po-notes">Buyer notes</FormLabel>
          <FormControl>
            <Textarea id="po-notes" placeholder="Delivery instructions…" />
          </FormControl>
        </FormItem>
      </Form>
    </StoryFrame>
  ),
};

export const InvoiceLineItemForm: Story = {
  name: "ERP — Invoice Line Item",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Form>
        <FormItem>
          <FormLabel htmlFor="line-desc">Description *</FormLabel>
          <FormControl>
            <Input id="line-desc" placeholder="Consulting services — Q1 2026" />
          </FormControl>
        </FormItem>
        <StoryRow gap="md" wrap>
          <div className="flex-1">
            <FormItem>
              <FormLabel htmlFor="line-qty">Quantity</FormLabel>
              <FormControl>
                <div className="tabular-nums">
                  <Input id="line-qty" placeholder="1" type="number" />
                </div>
              </FormControl>
            </FormItem>
          </div>
          <div className="flex-1">
            <FormItem>
              <FormLabel htmlFor="line-rate">Unit price</FormLabel>
              <FormControl>
                <div className="tabular-nums">
                  <Input id="line-rate" placeholder="150.00" type="number" />
                </div>
              </FormControl>
            </FormItem>
          </div>
        </StoryRow>
      </Form>
    </StoryFrame>
  ),
};

export const ExpenseReportValidation: Story = {
  name: "ERP — Expense Validation Errors",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Form>
        <FormItem state="error">
          <FormLabel htmlFor="exp-amount">Amount *</FormLabel>
          <FormControl>
            <div className="tabular-nums">
              <Input
                id="exp-amount"
                placeholder="0.00"
                state="error"
                type="number"
              />
            </div>
          </FormControl>
          <FormMessage
            errors={[{ message: "Amount must be greater than zero" }]}
          />
        </FormItem>
        <FormItem state="error">
          <FormLabel htmlFor="exp-date">Expense date *</FormLabel>
          <FormControl>
            <Input id="exp-date" state="error" type="date" />
          </FormControl>
          <FormMessage errors={[{ message: "Date cannot be in the future" }]} />
        </FormItem>
      </Form>
    </StoryFrame>
  ),
};

export const GLAccountForm: Story = {
  name: "ERP — GL Account",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FormItem>
        <FormLabel htmlFor="gl-account">GL account *</FormLabel>
        <FormControl>
          <Input id="gl-account" placeholder="6100 — Office Supplies" />
        </FormControl>
        <FormDescription>
          Must be active in the current fiscal year chart of accounts.
        </FormDescription>
      </FormItem>
    </StoryFrame>
  ),
};

export const AddressForm: Story = {
  name: "ERP — Ship-to Address",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Ship-to address</FieldLegend>
        <Form>
          <FormItem>
            <FormLabel htmlFor="addr-1">Address line 1</FormLabel>
            <FormControl>
              <Input id="addr-1" placeholder="123 Business Park Dr" />
            </FormControl>
          </FormItem>
          <StoryRow gap="md" wrap>
            <div className="flex-1">
              <FormItem>
                <FormLabel htmlFor="addr-city">City</FormLabel>
                <FormControl>
                  <Input id="addr-city" placeholder="Melbourne" />
                </FormControl>
              </FormItem>
            </div>
            <div className="flex-1">
              <FormItem>
                <FormLabel htmlFor="addr-post">Postcode</FormLabel>
                <FormControl>
                  <Input id="addr-post" placeholder="3000" />
                </FormControl>
              </FormItem>
            </div>
          </StoryRow>
        </Form>
      </FieldSet>
    </StoryFrame>
  ),
};

export const ApprovalCommentForm: Story = {
  name: "ERP — Approval Comment",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FormItem>
        <FormLabel htmlFor="approval-note">Approval comment</FormLabel>
        <FormControl>
          <Textarea
            id="approval-note"
            placeholder="Optional note for audit trail…"
          />
        </FormControl>
        <FormDescription>
          Recorded in the approval history for PO-1042.
        </FormDescription>
      </FormItem>
    </StoryFrame>
  ),
};

export const PermissionRestrictedForm: Story = {
  name: "ERP — Permission Restricted",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <FormItem>
        <FormLabel htmlFor="salary-field">Annual salary</FormLabel>
        <FormControl>
          <Input disabled id="salary-field" value="Restricted" />
        </FormControl>
        <FormDescription>
          HR Admin permission required to view compensation fields.
        </FormDescription>
      </FormItem>
    </StoryFrame>
  ),
};

export const CustomerMultiSectionForm: Story = {
  name: "ERP — Customer (Multi-Section)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>New customer</FieldLegend>
        <Form>
          <FormItem>
            <FormLabel htmlFor="cust-name">Customer name *</FormLabel>
            <FormControl>
              <Input id="cust-name" placeholder="Northwind Traders" />
            </FormControl>
          </FormItem>
          <FieldSeparator>Billing</FieldSeparator>
          <FormItem>
            <FormLabel htmlFor="cust-billing">Billing email</FormLabel>
            <FormControl>
              <Input
                id="cust-billing"
                placeholder="billing@northwind.example"
                type="email"
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="cust-terms">Payment terms</FormLabel>
            <FormControl>
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
            </FormControl>
          </FormItem>
          <FieldSeparator>Preferences</FieldSeparator>
          <FormItem orientation="horizontal">
            <FormControl>
              <Switch defaultChecked id="cust-portal" />
            </FormControl>
            <StoryStack gap="xs">
              <FormLabel htmlFor="cust-portal">Customer portal</FormLabel>
              <FormDescription>
                Allow self-service invoice downloads.
              </FormDescription>
            </StoryStack>
          </FormItem>
        </Form>
      </FieldSet>
    </StoryFrame>
  ),
};

export const SearchFilterForm: Story = {
  name: "ERP — Search Filter",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FormItem>
        <FormLabel htmlFor="search-records">Search records</FormLabel>
        <FormControl>
          <Input
            id="search-records"
            placeholder="Invoice, vendor, or assignee…"
            type="search"
          />
        </FormControl>
        <FormDescription>Filters the current module list.</FormDescription>
      </FormItem>
    </StoryFrame>
  ),
};

export const JournalEntryForm: Story = {
  name: "ERP — Journal Entry",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Form>
        <FormItem>
          <FormLabel htmlFor="je-date">Posting date *</FormLabel>
          <FormControl>
            <Input id="je-date" type="date" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="je-memo">Memo</FormLabel>
          <FormControl>
            <Textarea
              id="je-memo"
              placeholder="Month-end accrual adjustment…"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="je-account">Debit account *</FormLabel>
          <FormControl>
            <Input id="je-account" placeholder="5200 — Accrued Expenses" />
          </FormControl>
        </FormItem>
      </Form>
    </StoryFrame>
  ),
};
