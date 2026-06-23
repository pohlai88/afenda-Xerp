import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2Icon,
  CreditCardIcon,
  FileTextIcon,
  PackageIcon,
  TruckIcon,
} from "lucide-react";
import {
  ControlledPriorityComponent,
  PAYMENT_METHODS,
  PRIORITY_LEVELS,
  RadioField,
  RadioOptionField,
  SHIPPING_CARRIERS,
} from "./_storybook/radio-group-story.compositions";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { Field, FieldLabel } from "./field";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Separator } from "./separator";

const meta = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed single-selection control for ERP forms, filters, and approval workflows. Pair each `RadioGroupItem` with a `Label` via `htmlFor`. Use card-style option rows for high-impact decisions.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="sm">
      <RadioGroup defaultValue="medium">
        <StoryStack gap="sm">
          {PRIORITY_LEVELS.map((level) => (
            <RadioField
              id={`rg-${level.toLowerCase()}`}
              key={level}
              label={level}
              value={level.toLowerCase()}
            />
          ))}
        </StoryStack>
      </RadioGroup>
    </StoryFrame>
  ),
};

export const Horizontal: Story = {
  name: "RadioGroup — Horizontal",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <span className="font-medium text-sm">
          <Label>Priority</Label>
        </span>
        <RadioGroup defaultValue="medium">
          <StoryRow gap="md" wrap>
            {PRIORITY_LEVELS.map((level) => (
              <RadioField
                id={`rh-${level.toLowerCase()}`}
                key={level}
                label={level}
                value={level.toLowerCase()}
              />
            ))}
          </StoryRow>
        </RadioGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const WithDescriptions: Story = {
  name: "RadioGroup — With Descriptions",
  render: () => (
    <StoryFrame width="md">
      <RadioGroup defaultValue="approve">
        <StoryStack gap="sm">
          <RadioOptionField
            description="Record passes review and proceeds to next stage"
            id="desc-approve"
            label="Approve"
            value="approve"
          />
          <RadioOptionField
            description="Record is rejected and returned to submitter"
            id="desc-reject"
            label="Reject"
            value="reject"
          />
          <RadioOptionField
            description="Defer decision pending further information"
            id="desc-hold"
            label="Place on hold"
            value="hold"
          />
        </StoryStack>
      </RadioGroup>
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  name: "RadioGroup — Disabled Group",
  render: () => (
    <StoryFrame width="sm">
      <RadioGroup defaultValue="medium" disabled>
        <StoryStack gap="sm">
          {["Low", "Medium", "High"].map((level) => (
            <RadioField
              id={`rd-${level.toLowerCase()}`}
              key={level}
              label={level}
              value={level.toLowerCase()}
            />
          ))}
        </StoryStack>
      </RadioGroup>
    </StoryFrame>
  ),
};

export const DisabledItem: Story = {
  name: "RadioGroup — Disabled Item",
  render: () => (
    <StoryFrame width="sm">
      <RadioGroup defaultValue="standard">
        <StoryStack gap="sm">
          <RadioField id="tier-standard" label="Standard" value="standard" />
          <RadioField
            disabled
            id="tier-enterprise"
            label="Enterprise (not provisioned)"
            value="enterprise"
          />
          <RadioField id="tier-custom" label="Custom contract" value="custom" />
        </StoryStack>
      </RadioGroup>
    </StoryFrame>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          "Consumer `data-*` props cannot override governed RadioGroup root or item attributes.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <RadioGroup
        aria-label="Priority"
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        defaultValue="medium"
        state="ready"
      >
        <RadioGroupItem
          aria-label="Medium"
          data-component="Override"
          data-slot="override"
          value="medium"
        />
      </RadioGroup>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Each item has a unique `id` paired with `Label` `htmlFor`. Arrow keys move selection within the group; focus ring is governed on items.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <Field>
        <FieldLabel>Invoice status</FieldLabel>
        <RadioGroup defaultValue="pending">
          <StoryStack gap="sm">
            <RadioField
              id="a11y-pending"
              label="Pending approval"
              value="pending"
            />
            <RadioField id="a11y-approved" label="Approved" value="approved" />
            <RadioField id="a11y-paid" label="Paid" value="paid" />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const GovernanceValidationStates: Story = {
  name: "Governance — Validation States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.filter((state) => state !== "loading").map((state) => (
        <StoryRow align="start" gap="md" key={state}>
          <StoryCaption width="sm">{state}</StoryCaption>
          <StoryFrame width="sm">
            <RadioGroup defaultValue="medium" state={state}>
              <StoryStack gap="sm">
                <RadioField id={`${state}-low`} label="Low" value="low" />
                <RadioField
                  id={`${state}-medium`}
                  label="Medium"
                  value="medium"
                />
                <RadioField id={`${state}-high`} label="High" value="high" />
              </StoryStack>
            </RadioGroup>
          </StoryFrame>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

export const Controlled: Story = {
  name: "RadioGroup — Controlled (Interactive)",
  render: () => <ControlledPriorityComponent />,
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const ApprovalDecision: Story = {
  name: "ERP — Approval Decision",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="font-semibold text-sm">
          <Label>Approval decision</Label>
        </span>
        <span className="text-muted-foreground text-xs">
          PO-2026-1184 · $8,760 · Acme Supplies Ltd.
        </span>
        <RadioGroup defaultValue="approve">
          <StoryStack gap="sm">
            <RadioOptionField
              badge={{ text: "Recommended", tone: "success" }}
              description="Route to finance posting queue"
              id="ap-approve"
              label="Approve purchase order"
              value="approve"
            />
            <RadioOptionField
              description="Return to Alex Brown with comments"
              id="ap-reject"
              label="Reject and send back"
              value="reject"
            />
            <RadioOptionField
              description="Pause workflow until vendor quote is revised"
              id="ap-hold"
              label="Place on hold"
              value="hold"
            />
          </StoryStack>
        </RadioGroup>
        <StoryRow gap="sm">
          <Button emphasis="solid" intent="primary" size="sm">
            Submit decision
          </Button>
          <Button emphasis="ghost" intent="secondary" size="sm">
            Cancel
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InvoiceStatus: Story = {
  name: "ERP — Invoice Status",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <Field>
        <FieldLabel>Status</FieldLabel>
        <RadioGroup defaultValue="pending">
          <StoryStack gap="sm">
            <RadioField id="inv-draft" label="Draft" value="draft" />
            <RadioField
              id="inv-pending"
              label="Pending approval"
              value="pending"
            />
            <RadioField id="inv-approved" label="Approved" value="approved" />
            <RadioField id="inv-paid" label="Paid" value="paid" />
            <RadioField id="inv-void" label="Void" value="void" />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const PaymentMethod: Story = {
  name: "ERP — Payment Method",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel>Payment method</FieldLabel>
        <FieldDescription>INV-2026-0042 · Balance $24,850</FieldDescription>
        <RadioGroup defaultValue="ach">
          <StoryStack gap="sm">
            {PAYMENT_METHODS.map(({ value, label, description }) => (
              <RadioOptionField
                description={description}
                icon={CreditCardIcon}
                id={`pay-${value}`}
                key={value}
                label={label}
                value={value}
              />
            ))}
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const ShippingCarrier: Story = {
  name: "ERP — Shipping Carrier",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <Field>
        <FieldLabel>Carrier</FieldLabel>
        <RadioGroup defaultValue="fedex">
          <StoryStack gap="sm">
            {SHIPPING_CARRIERS.map(({ value, label }) => (
              <RadioField
                id={`ship-${value}`}
                key={value}
                label={label}
                value={value}
              />
            ))}
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const ExpenseCategory: Story = {
  name: "ERP — Expense Category",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel>Expense category</FieldLabel>
        <RadioGroup defaultValue="travel">
          <StoryStack gap="sm">
            <RadioOptionField
              description="Flights, hotels, ground transport"
              id="exp-travel"
              label="Travel"
              value="travel"
            />
            <RadioOptionField
              description="Software, hardware, SaaS subscriptions"
              id="exp-it"
              label="IT & equipment"
              value="it"
            />
            <RadioOptionField
              description="Client meals and events"
              id="exp-entertainment"
              label="Client entertainment"
              value="entertainment"
            />
            <RadioOptionField
              badge={{ text: "Policy", tone: "warning" }}
              description="Requires CFO pre-approval"
              id="exp-capital"
              label="Capital expenditure"
              value="capital"
            />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const TaxTreatment: Story = {
  name: "ERP — Tax Treatment",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel>Tax code</FieldLabel>
        <RadioGroup defaultValue="standard">
          <StoryStack gap="sm">
            <RadioField
              id="tax-standard"
              label="Standard rate (8.25%)"
              value="standard"
            />
            <RadioField
              id="tax-exempt"
              label="Tax exempt — nonprofit vendor"
              value="exempt"
            />
            <RadioField
              id="tax-reverse"
              label="Reverse charge (EU)"
              value="reverse"
            />
            <RadioField
              id="tax-out-of-scope"
              label="Out of scope"
              value="out-of-scope"
            />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const FiscalPeriod: Story = {
  name: "ERP — Fiscal Period",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <Field>
        <FieldLabel>Post to period</FieldLabel>
        <RadioGroup defaultValue="current">
          <StoryStack gap="sm">
            <RadioField
              id="fp-current"
              label="Current period (Jun 2026)"
              value="current"
            />
            <RadioField
              id="fp-next"
              label="Next period (Jul 2026)"
              value="next"
            />
            <RadioField
              disabled
              id="fp-closed"
              label="May 2026 (closed)"
              value="may"
            />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const VendorPaymentTerms: Story = {
  name: "ERP — Vendor Payment Terms",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <Field>
        <FieldLabel>Payment terms</FieldLabel>
        <RadioGroup defaultValue="net30">
          <StoryStack gap="sm">
            <RadioField id="terms-due" label="Due on receipt" value="due" />
            <RadioField id="terms-net15" label="Net 15" value="net15" />
            <RadioField id="terms-net30" label="Net 30" value="net30" />
            <RadioField id="terms-net60" label="Net 60" value="net60" />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const RecordVisibility: Story = {
  name: "ERP — Record Visibility",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel>Who can view this report?</FieldLabel>
        <RadioGroup defaultValue="team">
          <StoryStack gap="sm">
            <RadioOptionField
              description="Finance and procurement roles"
              id="vis-team"
              label="Department team"
              value="team"
            />
            <RadioOptionField
              description="All employees in the organisation"
              id="vis-org"
              label="Entire organisation"
              value="org"
            />
            <RadioOptionField
              description="Only record owner and admins"
              id="vis-private"
              label="Private"
              value="private"
            />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const ExportFormat: Story = {
  name: "ERP — Export Format",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <Field>
        <FieldLabel>Export format</FieldLabel>
        <RadioGroup defaultValue="csv">
          <StoryStack gap="sm">
            <RadioField id="fmt-csv" label="CSV" value="csv" />
            <RadioField id="fmt-xlsx" label="Excel (.xlsx)" value="xlsx" />
            <RadioField id="fmt-pdf" label="PDF summary" value="pdf" />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const ApprovalRoute: Story = {
  name: "ERP — Approval Route",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel>Route expense report</FieldLabel>
        <RadioGroup defaultValue="manager">
          <StoryStack gap="sm">
            <RadioOptionField
              description="Jane Doe — direct manager"
              id="route-manager"
              label="Manager approval"
              value="manager"
            />
            <RadioOptionField
              description="Required for amounts over $5,000"
              icon={Building2Icon}
              id="route-finance"
              label="Finance controller"
              value="finance"
            />
            <RadioOptionField
              description="Executive sign-off for policy exceptions"
              id="route-exec"
              label="CFO escalation"
              value="executive"
            />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const PoUrgency: Story = {
  name: "ERP — PO Urgency",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel>Urgency</FieldLabel>
        <RadioGroup defaultValue="standard">
          <StoryRow gap="md" wrap>
            <RadioField id="urg-rush" label="Rush" value="rush" />
            <RadioField id="urg-standard" label="Standard" value="standard" />
            <RadioField
              id="urg-scheduled"
              label="Scheduled"
              value="scheduled"
            />
          </StoryRow>
        </RadioGroup>
        <FieldDescription>
          Rush orders may incur expedite fees from the vendor.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const DocumentTypeFilter: Story = {
  name: "ERP — Document Type Filter",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">
          <Label>Attachment type</Label>
        </span>
        <RadioGroup defaultValue="all">
          <StoryRow gap="md" wrap>
            <RadioField id="doc-all" label="All types" value="all" />
            <StoryRow align="center" gap="xs">
              <RadioGroupItem id="doc-pdf" value="pdf" />
              <span className="font-normal">
                <Label htmlFor="doc-pdf">
                  <StoryRow align="center" gap="xs">
                    <FileTextIcon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    PDF
                  </StoryRow>
                </Label>
              </span>
            </StoryRow>
            <StoryRow align="center" gap="xs">
              <RadioGroupItem id="doc-img" value="image" />
              <span className="font-normal">
                <Label htmlFor="doc-img">Images</Label>
              </span>
            </StoryRow>
          </StoryRow>
        </RadioGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ReceivingMode: Story = {
  name: "ERP — Warehouse Receiving Mode",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldLabel>Receiving mode</FieldLabel>
        <RadioGroup defaultValue="scan">
          <StoryStack gap="sm">
            <RadioOptionField
              description="Barcode scanner WH-SCAN-04"
              icon={PackageIcon}
              id="recv-scan"
              label="Scan items"
              value="scan"
            />
            <RadioOptionField
              description="Enter SKU and quantity manually"
              id="recv-manual"
              label="Manual entry"
              value="manual"
            />
            <RadioOptionField
              description="Import receipt file from carrier"
              icon={TruckIcon}
              id="recv-import"
              label="Import ASN"
              value="import"
            />
          </StoryStack>
        </RadioGroup>
      </Field>
    </StoryFrame>
  ),
};

export const FilterBarRadioCluster: Story = {
  name: "ERP — Filter Bar Radio Cluster",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow align="center" gap="lg" wrap>
          <StoryStack gap="xs">
            <span className="text-muted-foreground text-xs">Status</span>
            <RadioGroup defaultValue="active">
              <StoryRow gap="sm" wrap>
                <RadioField id="fb-active" label="Active" value="active" />
                <RadioField id="fb-pending" label="Pending" value="pending" />
                <RadioField
                  id="fb-archived"
                  label="Archived"
                  value="archived"
                />
              </StoryRow>
            </RadioGroup>
          </StoryStack>
          <div className="hidden h-8 sm:block">
            <Separator orientation="vertical" />
          </div>
          <StoryStack gap="xs">
            <span className="text-muted-foreground text-xs">Assignment</span>
            <RadioGroup defaultValue="mine">
              <StoryRow gap="sm" wrap>
                <RadioField id="fb-mine" label="Mine" value="mine" />
                <RadioField id="fb-team" label="My team" value="team" />
                <RadioField id="fb-all" label="All" value="all" />
              </StoryRow>
            </RadioGroup>
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const RadioGroupVsSelect: Story = {
  name: "ERP — RadioGroup vs Select",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Use `RadioGroup` when all options should be visible (≤5 choices, high-impact decisions). Use `Select` for long lists or compact filters.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            RadioGroup — visible options
          </span>
          <RadioGroup defaultValue="approve">
            <StoryRow gap="md" wrap>
              <RadioField id="cmp-approve" label="Approve" value="approve" />
              <RadioField id="cmp-reject" label="Reject" value="reject" />
            </StoryRow>
          </RadioGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Select — long option lists
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Select for department and vendor pickers
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const OptionLayoutMatrix: Story = {
  name: "Matrix — Option Layouts",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      <StoryFrame width="sm">
        <StoryStack gap="xs">
          <span className="text-muted-foreground text-xs">Vertical list</span>
          <RadioGroup defaultValue="medium">
            <StoryStack gap="sm">
              <RadioField id="mx-v-low" label="Low" value="low" />
              <RadioField id="mx-v-medium" label="Medium" value="medium" />
              <RadioField id="mx-v-high" label="High" value="high" />
            </StoryStack>
          </RadioGroup>
        </StoryStack>
      </StoryFrame>
      <StoryFrame width="md">
        <StoryStack gap="xs">
          <span className="text-muted-foreground text-xs">
            Horizontal cluster
          </span>
          <RadioGroup defaultValue="medium">
            <StoryRow gap="md" wrap>
              <RadioField id="mx-h-low" label="Low" value="low" />
              <RadioField id="mx-h-medium" label="Medium" value="medium" />
              <RadioField id="mx-h-high" label="High" value="high" />
            </StoryRow>
          </RadioGroup>
        </StoryStack>
      </StoryFrame>
      <StoryFrame width="md">
        <StoryStack gap="xs">
          <span className="text-muted-foreground text-xs">Card options</span>
          <RadioGroup defaultValue="approve">
            <StoryStack gap="sm">
              <RadioOptionField
                description="Proceed to posting"
                id="mx-c-approve"
                label="Approve"
                value="approve"
              />
              <RadioOptionField
                description="Return to submitter"
                id="mx-c-reject"
                label="Reject"
                value="reject"
              />
            </StoryStack>
          </RadioGroup>
        </StoryStack>
      </StoryFrame>
    </StoryStack>
  ),
};
