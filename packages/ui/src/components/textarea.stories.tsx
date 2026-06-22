import { DENSITIES, GOVERNED_STATES, SIZES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Label } from "./label";
import { Textarea } from "./textarea";

// ─── Helpers ───────────────────────────────────────────────────────────────

const MAX_INTERNAL_NOTE = 2000;
const MAX_APPROVAL_COMMENT = 500;

function LabeledField({
  id,
  label,
  required,
  hint,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly hint?: string;
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
      {hint ? (
        <span className="text-muted-foreground text-xs">{hint}</span>
      ) : null}
    </StoryStack>
  );
}

function ValidatedRejectionReasonField() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && value.trim().length < 10;

  return (
    <Field state={invalid ? "error" : "ready"}>
      <FieldLabel htmlFor="live-reject">Rejection reason *</FieldLabel>
      <Textarea
        aria-invalid={invalid}
        id="live-reject"
        onBlur={() => setTouched(true)}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Explain why this expense cannot be approved…"
        rows={4}
        {...(invalid ? { state: "error" as const } : {})}
        value={value}
      />
      <FieldDescription>
        Minimum 10 characters — stored in the audit trail.
      </FieldDescription>
      {invalid ? (
        <FieldError
          errors={[
            { message: "Rejection reason must be at least 10 characters" },
          ]}
        />
      ) : null}
    </Field>
  );
}

function CharCountNotesField() {
  const [value, setValue] = useState("");
  const remaining = MAX_INTERNAL_NOTE - value.length;

  return (
    <StoryStack gap="xs">
      <Label htmlFor="char-notes">Internal notes</Label>
      <Textarea
        id="char-notes"
        maxLength={MAX_INTERNAL_NOTE}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Delivery instructions, budget reference, or approval context…"
        rows={4}
        value={value}
      />
      <StoryRow justify="between">
        <span className="text-muted-foreground text-xs">
          Not visible to vendor
        </span>
        <span className="text-muted-foreground text-xs">
          {remaining.toLocaleString()} characters left
        </span>
      </StoryRow>
    </StoryStack>
  );
}

// ─── Textarea ──────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed multi-line text control for ERP notes, approval comments, narratives, and audit memos. Supports governed `density`, `size`, and `state`. For block labels, character-count footers, or toolbar addons, use `InputGroup` with `InputGroupTextarea` (Primitives/InputGroup).",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: [...DENSITIES],
      table: { defaultValue: { summary: "standard" } },
    },
    size: {
      control: "radio",
      options: [...SIZES],
      table: { defaultValue: { summary: "md" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
  },
  args: {
    placeholder: "Enter notes…",
    size: "md",
    density: "standard",
    rows: 3,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm", rows: 2 },
};

export const Large: Story = {
  args: { size: "lg", rows: 5 },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Read-only system note",
    value: "Posted by system on Jun 21, 2026 — cannot edit.",
  },
};

export const Compact: Story = {
  args: { density: "compact", placeholder: "Compact density notes", rows: 3 },
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
          <Textarea placeholder={`State: ${state}`} rows={2} state={state} />
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceAllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {SIZES.map((size) => (
          <Textarea
            key={size}
            placeholder={`Size: ${size}`}
            rows={2}
            size={size}
          />
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAllDensities: Story = {
  name: "Matrix — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {DENSITIES.map((density) => (
          <Textarea
            density={density}
            key={density}
            placeholder={`Density: ${density}`}
            rows={2}
          />
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const ErrorState: Story = {
  name: "State — Error",
  args: { state: "error", placeholder: "Comment required before rejection" },
};

export const LoadingState: Story = {
  name: "State — Loading",
  args: { state: "loading", placeholder: "Loading template…" },
};

export const InvalidState: Story = {
  name: "State — Invalid",
  args: { state: "invalid", placeholder: "Fails schema validation" },
};

export const ForbiddenState: Story = {
  name: "State — Forbidden",
  args: { state: "forbidden", placeholder: "Insufficient permission" },
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          'Pair with `Label` or `FieldLabel` via matching `id`/`htmlFor`. Use `aria-invalid` and `state="error"` for validation. Link hints with `aria-describedby`.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Field state="error">
        <FieldLabel htmlFor="a11y-comment">Approval comment *</FieldLabel>
        <Textarea
          aria-describedby="a11y-comment-hint a11y-comment-error"
          aria-invalid
          id="a11y-comment"
          placeholder="Optional note for audit trail…"
          rows={3}
          state="error"
        />
        <FieldDescription id="a11y-comment-hint">
          Visible to submitter and finance reviewers.
        </FieldDescription>
        <FieldError
          errors={[{ message: "Comment required when rejecting over $1,000" }]}
          id="a11y-comment-error"
        />
      </Field>
    </StoryFrame>
  ),
};

// ─── ERP single fields ─────────────────────────────────────────────────────

export const InternalNotes: Story = {
  name: "ERP — Internal Notes",
  render: (args) => (
    <StoryFrame width="md">
      <LabeledField
        hint="Not visible to vendor or customer portal users."
        id="erp-internal"
        label="Internal notes"
      >
        <Textarea
          {...args}
          id="erp-internal"
          placeholder="Budget reference, delivery constraints, or approval context…"
          rows={4}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const ApprovalComment: Story = {
  name: "ERP — Approval Comment",
  render: (args) => (
    <StoryFrame width="md">
      <LabeledField
        hint="Stored in the approval audit trail."
        id="erp-approve"
        label="Approver comment"
      >
        <Textarea
          {...args}
          id="erp-approve"
          placeholder="Optional note for audit trail…"
          rows={3}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const RejectionReason: Story = {
  name: "ERP — Rejection Reason",
  render: () => (
    <StoryFrame width="md">
      <LabeledField
        hint="Required when rejecting expenses over $1,000."
        id="erp-reject"
        label="Rejection reason"
        required
      >
        <Textarea
          id="erp-reject"
          placeholder="Explain why this request cannot be approved…"
          rows={4}
          state="error"
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const DeliveryInstructions: Story = {
  name: "ERP — Delivery Instructions",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="erp-delivery" label="Delivery instructions">
        <Textarea
          id="erp-delivery"
          placeholder="Dock 4, receiving hours Mon–Fri 8 AM–4 PM. Call ahead for oversized freight."
          rows={3}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const ExpenseJustification: Story = {
  name: "ERP — Expense Justification",
  render: () => (
    <StoryFrame width="md">
      <LabeledField
        hint="Business purpose required for client entertainment."
        id="erp-exp-just"
        label="Business purpose"
        required
      >
        <Textarea
          id="erp-exp-just"
          placeholder="Client visit — contract renewal discussion with Northwind Traders"
          rows={3}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const LeaveRequestNote: Story = {
  name: "ERP — Leave Request Note",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="erp-leave" label="Coverage plan">
        <Textarea
          id="erp-leave"
          placeholder="Alex Brown covering approvals; no client travel scheduled."
          rows={3}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const JournalEntryMemo: Story = {
  name: "ERP — Journal Entry Memo",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="erp-je-memo" label="Journal memo">
        <Textarea
          id="erp-je-memo"
          placeholder="Month-end accrual — prepaid software licenses FY2026-Q2"
          rows={2}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const VendorDescription: Story = {
  name: "ERP — Vendor Description",
  render: () => (
    <StoryFrame width="lg">
      <LabeledField id="erp-vendor-desc" label="Vendor description">
        <Textarea
          id="erp-vendor-desc"
          placeholder="Industrial supplies vendor — primary fasteners and safety equipment for Warehouse A."
          rows={3}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const SupportTicketDescription: Story = {
  name: "ERP — Support Ticket Description",
  render: () => (
    <StoryFrame width="lg">
      <LabeledField id="erp-ticket" label="Issue description" required>
        <Textarea
          id="erp-ticket"
          placeholder="Describe the issue, steps to reproduce, and impact on operations…"
          rows={5}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const ComplianceNarrative: Story = {
  name: "ERP — Compliance Narrative",
  render: () => (
    <StoryFrame width="lg">
      <LabeledField
        hint="Required for SOX control exceptions."
        id="erp-compliance"
        label="Control exception narrative"
        required
      >
        <Textarea
          id="erp-compliance"
          placeholder="Describe the exception, compensating controls, and remediation timeline…"
          rows={5}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const ReadOnlySystemNote: Story = {
  name: "ERP — Read-only System Note",
  render: () => (
    <StoryFrame width="md">
      <LabeledField id="erp-sys-note" label="System posting note">
        <Textarea
          disabled
          id="erp-sys-note"
          rows={3}
          value="Auto-posted from bank feed BATCH-2026-06-18. Do not edit — create adjustment entry if incorrect."
        />
      </LabeledField>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const PurchaseOrderNotesForm: Story = {
  name: "ERP — Purchase Order Notes Form",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <LabeledField id="po-vendor-note" label="Vendor message">
          <Textarea
            id="po-vendor-note"
            placeholder="Please confirm lead time for SKU-8842 before ship date…"
            rows={3}
          />
        </LabeledField>
        <LabeledField
          hint={`Max ${MAX_INTERNAL_NOTE.toLocaleString()} characters · internal only`}
          id="po-internal"
          label="Internal notes"
        >
          <Textarea
            id="po-internal"
            maxLength={MAX_INTERNAL_NOTE}
            placeholder="Cost center 210 — Q3 maintenance budget"
            rows={4}
          />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ExpenseReportNarrative: Story = {
  name: "ERP — Expense Report Narrative",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <LabeledField id="exp-summary" label="Trip summary" required>
          <Textarea
            id="exp-summary"
            placeholder="Client visit San Francisco — contract renewal and Q3 planning"
            rows={2}
          />
        </LabeledField>
        <LabeledField id="exp-policy" label="Policy exception request">
          <Textarea
            id="exp-policy"
            placeholder="Meal exceeded daily limit — client dinner with 4 attendees, pre-approved by manager"
            rows={3}
          />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ReturnMerchandiseForm: Story = {
  name: "ERP — Return Merchandise Authorization",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <LabeledField id="rma-reason" label="Return reason" required>
          <Textarea
            id="rma-reason"
            placeholder="Received wrong glove size — SKU-7710 ordered L, received XL"
            rows={3}
          />
        </LabeledField>
        <LabeledField id="rma-inspection" label="Warehouse inspection notes">
          <Textarea
            id="rma-inspection"
            placeholder="Outer carton intact, inner packs unopened, photos attached"
            rows={2}
          />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const CustomerFeedbackCapture: Story = {
  name: "ERP — Customer Feedback Capture",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <LabeledField id="feedback" label="Customer feedback">
        <Textarea
          id="feedback"
          placeholder="Portal user reported delayed invoice PDF downloads during month-end…"
          rows={4}
        />
      </LabeledField>
    </StoryFrame>
  ),
};

export const MeetingMinutes: Story = {
  name: "ERP — Meeting Minutes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <LabeledField id="minutes" label="Minutes — Q2 close review">
        <Textarea
          defaultValue="• Revenue recognition policy update approved\n• AP cutoff extended to Jun 22 5 PM ET\n• Action: Finance to reconcile intercompany balances"
          id="minutes"
          rows={6}
        />
      </LabeledField>
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
          <Textarea
            id="val-default"
            placeholder="Enter internal notes…"
            rows={2}
          />
        </LabeledField>
        <LabeledField id="val-error" label="Error">
          <Textarea
            aria-invalid
            id="val-error"
            placeholder="Comment required"
            rows={2}
            state="error"
          />
        </LabeledField>
        <LabeledField id="val-disabled" label="Disabled">
          <Textarea
            disabled
            id="val-disabled"
            placeholder="Read-only field"
            rows={2}
          />
        </LabeledField>
        <LabeledField id="val-loading" label="Loading">
          <Textarea
            id="val-loading"
            placeholder="Loading template…"
            rows={2}
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
    <StoryFrame width="md">
      <LabeledField id="salary-note" label="Compensation notes">
        <Textarea
          disabled
          id="salary-note"
          rows={3}
          state="forbidden"
          value="Restricted — HR Admin permission required to view or edit compensation notes."
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
      <ValidatedRejectionReasonField />
    </StoryFrame>
  ),
};

export const CharCountLimited: Story = {
  name: "ERP — Character Count (Interactive)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <CharCountNotesField />
    </StoryFrame>
  ),
};

export const ApprovalCommentWithLimit: Story = {
  name: "ERP — Approval Comment With Limit",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="approve-limit">Approver comment</Label>
        <Textarea
          id="approve-limit"
          maxLength={MAX_APPROVAL_COMMENT}
          placeholder="Optional note for EXP-2026-042…"
          rows={3}
        />
        <span className="text-muted-foreground text-xs">
          Max {MAX_APPROVAL_COMMENT} characters · visible to submitter
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const TextareaVsInput: Story = {
  name: "ERP — Textarea vs Input",
  parameters: {
    docs: {
      description: {
        story:
          "Use `Input` for single-line identifiers, amounts, and dates. Use `Textarea` for multi-line narratives, notes, and audit comments.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledField id="vs-input" label="Invoice number (single line)">
          <span className="font-mono text-muted-foreground text-sm">
            Use Primitives/Input → INV-2026-0042
          </span>
        </LabeledField>
        <LabeledField id="vs-textarea" label="Approval comment (multi-line)">
          <Textarea
            id="vs-textarea"
            placeholder="Multi-line comment for audit trail…"
            rows={3}
          />
        </LabeledField>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InputGroupReference: Story = {
  name: "ERP — Use InputGroup for block addons",
  parameters: {
    docs: {
      description: {
        story:
          "Plain `Textarea` is for labeled form fields. Block-start labels, character-count footers, and toolbar rows belong in `Primitives/InputGroup` with `InputGroupTextarea`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledField id="plain-notes" label="PO internal notes">
          <Textarea
            id="plain-notes"
            placeholder="Delivery instructions and budget reference…"
            rows={4}
          />
        </LabeledField>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Needs block header or footer?
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/InputGroup → Internal Notes Textarea for PO-2026-1184
            pattern with block-start label and character limit footer.
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
