import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./field";
import { Label } from "./label";
import { Slider } from "./slider";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatPercent(value: number): string {
  return `${value}%`;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

function formatHours(value: number): string {
  return `${value}h`;
}

interface LabeledSliderProps {
  readonly defaultValue?: number[];
  readonly description?: string;
  readonly disabled?: boolean;
  readonly formatValue?: (value: number) => string;
  readonly id: string;
  readonly label: string;
  readonly max?: number;
  readonly min?: number;
  readonly onValueChange?: (value: number[]) => void;
  readonly state?: (typeof GOVERNED_STATES)[number];
  readonly step?: number;
  readonly value?: number[];
}

function LabeledSlider({
  id,
  label,
  description,
  defaultValue = [50],
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  state,
  formatValue = formatPercent,
}: LabeledSliderProps) {
  const display = value?.[0] ?? defaultValue[0] ?? min;

  return (
    <StoryStack gap="xs">
      <StoryRow justify="between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-muted-foreground text-xs">
          {formatValue(display)}
        </span>
      </StoryRow>
      {description ? (
        <span className="text-muted-foreground text-xs">{description}</span>
      ) : null}
      <Slider
        aria-label={label}
        id={id}
        max={max}
        min={min}
        step={step}
        {...(disabled ? { disabled } : {})}
        {...(onValueChange
          ? { onValueChange, value: value ?? defaultValue }
          : { defaultValue })}
        {...(state ? { state } : {})}
      />
    </StoryStack>
  );
}

interface RangeSliderFieldProps {
  readonly defaultValue?: number[];
  readonly formatValue?: (value: number) => string;
  readonly id: string;
  readonly label: string;
  readonly max?: number;
  readonly min?: number;
  readonly step?: number;
}

function RangeSliderField({
  id,
  label,
  defaultValue = [20, 80],
  min = 0,
  max = 100,
  step = 1,
  formatValue = formatPercent,
}: RangeSliderFieldProps) {
  return (
    <StoryStack gap="xs">
      <StoryRow justify="between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-muted-foreground text-xs">
          {formatValue(defaultValue[0] ?? min)} –{" "}
          {formatValue(defaultValue[1] ?? max)}
        </span>
      </StoryRow>
      <Slider
        aria-label={label}
        defaultValue={defaultValue}
        id={id}
        max={max}
        min={min}
        step={step}
      />
    </StoryStack>
  );
}

function ControlledSliderDemo() {
  const [value, setValue] = useState([35]);

  return (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <LabeledSlider
          id="ctrl-discount"
          label="Line discount"
          onValueChange={setValue}
          value={value}
        />
        <span className="text-muted-foreground text-xs">
          Applied rate: <Badge emphasis="soft">{value[0]}%</Badge>
        </span>
      </StoryStack>
    </StoryFrame>
  );
}

function ControlledRangeDemo() {
  const [range, setRange] = useState([250, 750]);

  return (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow justify="between">
          <span className="font-medium text-sm">Invoice amount filter</span>
          <span className="text-muted-foreground text-xs">
            {formatCurrency(range[0] ?? 0)} – {formatCurrency(range[1] ?? 0)}
          </span>
        </StoryRow>
        <Slider
          aria-label="Invoice amount range"
          max={1000}
          min={0}
          onValueChange={setRange}
          step={50}
          value={range}
        />
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Slider ────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix UI slider for ERP numeric tuning — discounts, commission rates, budget allocation, price-range filters, and approval thresholds. Use single-thumb for one value; dual-thumb for min–max ranges. Pair with visible labels or `aria-label`. Prefer `Input` for exact numeric entry; use `Progress` for read-only completion.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Slider aria-label="Volume" {...args} />
    </StoryFrame>
  ),
};

export const WithLabel: Story = {
  name: "Slider — With Label",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[72]}
        description="Consumed against FY2026 operating budget"
        id="sl-budget"
        label="Budget utilization"
      />
    </StoryFrame>
  ),
};

export const Controlled: Story = {
  name: "Slider — Controlled",
  parameters: { layout: "padded" },
  render: () => <ControlledSliderDemo />,
};

export const Disabled: Story = {
  name: "Slider — Disabled",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[40]}
        description="Locked by organization policy"
        disabled
        id="sl-disabled"
        label="Maximum discount"
      />
    </StoryFrame>
  ),
};

export const Range: Story = {
  name: "Slider — Range (Dual Thumb)",
  render: () => (
    <StoryFrame width="md">
      <RangeSliderField
        defaultValue={[15_000, 85_000]}
        formatValue={formatCurrency}
        id="sl-range"
        label="Deal value band"
        max={100_000}
        min={0}
        step={5000}
      />
    </StoryFrame>
  ),
};

export const CustomStep: Story = {
  name: "Slider — Custom Step",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[15]}
        description="Increments of 5 percentage points"
        id="sl-step"
        label="Service fee markup"
        step={5}
      />
    </StoryFrame>
  ),
};

export const CustomMinMax: Story = {
  name: "Slider — Custom Min / Max",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[2500]}
        description="Annual procurement spend cap"
        formatValue={formatCurrency}
        id="sl-minmax"
        label="Spend ceiling"
        max={10_000}
        min={500}
        step={250}
      />
    </StoryFrame>
  ),
};

// ─── Governance ────────────────────────────────────────────────────────────

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
          <Slider
            aria-label={`State probe ${state}`}
            defaultValue={[60]}
            state={state}
          />
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Associate sliders with visible labels via matching `id`/`htmlFor`, or provide `aria-label` when space is tight. Value changes are keyboard-operable (arrow keys) and announced by assistive tech via Radix Slider.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Field>
        <FieldContent>
          <FieldLabel htmlFor="sl-a11y">
            Approval confidence threshold
          </FieldLabel>
          <FieldDescription>
            Route to senior approver when match score falls below this level.
          </FieldDescription>
        </FieldContent>
        <Slider
          aria-labelledby="sl-a11y"
          defaultValue={[85]}
          id="sl-a11y"
          max={100}
          min={50}
          step={5}
        />
      </Field>
    </StoryFrame>
  ),
};

export const MatrixValues: Story = {
  name: "Matrix — Value Positions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {[0, 25, 50, 75, 100].map((position) => (
          <StoryRow align="center" gap="sm" key={position}>
            <span className="w-8 text-right text-muted-foreground text-xs">
              {position}%
            </span>
            <Slider
              aria-label={`Position ${position}`}
              className="min-w-0 flex-1"
              defaultValue={[position]}
            />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP single-field patterns ─────────────────────────────────────────────

export const DiscountPercent: Story = {
  name: "ERP — Line Discount %",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[12]}
        description="Applied to PO line #4 — office supplies"
        id="erp-discount"
        label="Discount"
        max={30}
        step={1}
      />
    </StoryFrame>
  ),
};

export const CommissionRate: Story = {
  name: "ERP — Sales Commission Rate",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[8]}
        description="North America enterprise tier — Q2 2026"
        id="erp-commission"
        label="Commission rate"
        max={20}
        step={0.5}
      />
    </StoryFrame>
  ),
};

export const BudgetAllocation: Story = {
  name: "ERP — Budget Allocation",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[68]}
        description="Marketing spend vs. FY2026 plan"
        id="erp-budget"
        label="Budget consumed"
      />
    </StoryFrame>
  ),
};

export const RiskTolerance: Story = {
  name: "ERP — Risk Tolerance",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[35]}
        description="Vendor credit exposure scoring model"
        id="erp-risk"
        label="Acceptable risk score"
        max={100}
        min={0}
        step={5}
      />
    </StoryFrame>
  ),
};

export const ApprovalThreshold: Story = {
  name: "ERP — Approval Threshold",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[5000]}
        description="Auto-approve expenses below this amount"
        formatValue={formatCurrency}
        id="erp-approval"
        label="Auto-approve ceiling"
        max={25_000}
        min={0}
        step={500}
      />
    </StoryFrame>
  ),
};

export const InventoryReorderLevel: Story = {
  name: "ERP — Inventory Reorder Level",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[25]}
        description="SKU-8842 — reorder when stock falls below this % of max"
        id="erp-reorder"
        label="Reorder point"
        max={50}
        min={5}
        step={5}
      />
    </StoryFrame>
  ),
};

export const PriceRangeFilter: Story = {
  name: "ERP — Price Range Filter",
  render: () => (
    <StoryFrame width="md">
      <RangeSliderField
        defaultValue={[50, 500]}
        formatValue={formatCurrency}
        id="erp-price-range"
        label="Unit price range"
        max={1000}
        min={0}
        step={25}
      />
    </StoryFrame>
  ),
};

export const VolumeMixSplit: Story = {
  name: "ERP — Volume Mix Split",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[60]}
        description="Direct vs. distributor channel mix — North region"
        id="erp-mix"
        label="Direct channel share"
      />
    </StoryFrame>
  ),
};

export const TaxRateAdjustment: Story = {
  name: "ERP — Tax Rate Adjustment",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[10]}
        description="GST override for export invoices — AU entity"
        id="erp-tax"
        label="Effective tax rate"
        max={15}
        min={0}
        step={0.5}
      />
    </StoryFrame>
  ),
};

export const SlaResponseTarget: Story = {
  name: "ERP — SLA Response Target",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[4]}
        description="Support ticket first-response SLA"
        formatValue={formatHours}
        id="erp-sla"
        label="Response within"
        max={24}
        min={1}
        step={1}
      />
    </StoryFrame>
  ),
};

export const WarehouseCapacityTarget: Story = {
  name: "ERP — Warehouse Capacity Target",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[85]}
        description="Alert when utilization exceeds target"
        id="erp-capacity"
        label="Capacity utilization alert"
        max={100}
        min={50}
        step={5}
      />
    </StoryFrame>
  ),
};

export const PaymentAdvancePercent: Story = {
  name: "ERP — Payment Advance %",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[30]}
        description="Deposit required before production release"
        id="erp-advance"
        label="Advance payment"
        max={100}
        min={0}
        step={5}
      />
    </StoryFrame>
  ),
};

export const MarkupMargin: Story = {
  name: "ERP — Markup Margin",
  render: () => (
    <StoryFrame width="md">
      <LabeledSlider
        defaultValue={[22]}
        description="Default margin on catalogue items — wholesale"
        id="erp-markup"
        label="Gross margin target"
        max={50}
        min={5}
        step={1}
      />
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ────────────────────────────────────────────────

export const PricingRulesPanel: Story = {
  name: "ERP — Pricing Rules Panel",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>Wholesale pricing — North America</FieldLegend>
        <StoryStack gap="md">
          <LabeledSlider
            defaultValue={[18]}
            description="Base margin before volume tiers"
            id="pr-base"
            label="Base margin"
            max={40}
          />
          <LabeledSlider
            defaultValue={[5]}
            description="Additional discount above 1,000 units"
            id="pr-volume"
            label="Volume discount"
            max={25}
          />
          <LabeledSlider
            defaultValue={[12]}
            description="Maximum allowed without manager approval"
            id="pr-max-disc"
            label="Max line discount"
            max={30}
          />
        </StoryStack>
      </FieldSet>
    </StoryFrame>
  ),
};

export const BudgetPlannerForm: Story = {
  name: "ERP — Budget Planner",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>FY2026 allocation — Engineering</FieldLegend>
        <StoryStack gap="md">
          <LabeledSlider
            defaultValue={[45]}
            description="$2.25M of $5M department cap"
            id="bp-rd"
            label="R&D projects"
          />
          <LabeledSlider
            defaultValue={[30]}
            description="Infrastructure and tooling"
            id="bp-infra"
            label="Platform & infra"
          />
          <LabeledSlider
            defaultValue={[25]}
            description="Training and contractor bench"
            id="bp-ops"
            label="Operations reserve"
          />
        </StoryStack>
      </FieldSet>
    </StoryFrame>
  ),
};

export const ReportFilterPanel: Story = {
  name: "ERP — Report Filter Panel",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <span className="font-medium text-sm">
          Open invoices — advanced filters
        </span>
        <RangeSliderField
          defaultValue={[1000, 50_000]}
          formatValue={formatCurrency}
          id="rf-amount"
          label="Outstanding balance"
          max={100_000}
          min={0}
          step={1000}
        />
        <LabeledSlider
          defaultValue={[30]}
          description="Days past due"
          id="rf-aging"
          label="Minimum aging"
          max={90}
          min={0}
          step={15}
        />
        <LabeledSlider
          defaultValue={[80]}
          description="ML match confidence for duplicate detection"
          id="rf-confidence"
          label="Match confidence"
          max={100}
          min={50}
          step={5}
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ApprovalRulesConfigurator: Story = {
  name: "ERP — Approval Rules",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>Expense policy — auto-approval rules</FieldLegend>
        <StoryStack gap="md">
          <LabeledSlider
            defaultValue={[500]}
            description="Manager approval not required below this amount"
            formatValue={formatCurrency}
            id="ar-auto"
            label="Auto-approve limit"
            max={5000}
            step={100}
          />
          <LabeledSlider
            defaultValue={[10_000]}
            description="CFO queue for amounts above this threshold"
            formatValue={formatCurrency}
            id="ar-cfo"
            label="CFO escalation"
            max={50_000}
            step={1000}
          />
          <LabeledSlider
            defaultValue={[90]}
            description="Receipt OCR confidence required for auto-post"
            id="ar-ocr"
            label="Receipt match confidence"
            max={100}
            min={70}
            step={5}
          />
        </StoryStack>
      </FieldSet>
    </StoryFrame>
  ),
};

export const ResourceAllocationBoard: Story = {
  name: "ERP — Resource Allocation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">
            Project Phoenix — Q3 staffing
          </span>
          <Badge emphasis="soft" tone="warning">
            92% allocated
          </Badge>
        </StoryRow>
        <LabeledSlider
          defaultValue={[40]}
          description="Backend engineering FTE share"
          id="ra-backend"
          label="Backend"
        />
        <LabeledSlider
          defaultValue={[35]}
          description="Frontend and design systems"
          id="ra-frontend"
          label="Frontend"
        />
        <LabeledSlider
          defaultValue={[25]}
          description="QA and release engineering"
          id="ra-qa"
          label="Quality assurance"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ControlledRange: Story = {
  name: "ERP — Controlled Range (Interactive)",
  parameters: { layout: "padded" },
  render: () => <ControlledRangeDemo />,
};

// ─── Guidance ──────────────────────────────────────────────────────────────

export const SliderVsInput: Story = {
  name: "ERP — Slider vs Input",
  parameters: {
    docs: {
      description: {
        story:
          "Slider: approximate tuning, filters, and percentage allocation where precision is secondary. Input: exact amounts, SKUs, tax IDs, and ledger codes. Combine both when users need coarse adjustment plus fine entry.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Slider — approximate tuning
          </span>
          <LabeledSlider
            defaultValue={[15]}
            id="vs-slider"
            label="Bulk discount estimate"
          />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Input — exact entry</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Input for unit price, quantity, and GL account fields
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SliderVsProgress: Story = {
  name: "ERP — Slider vs Progress",
  parameters: {
    docs: {
      description: {
        story:
          "Slider: user adjusts a target or filter threshold. Progress: system-reported completion (upload %, workflow step, budget consumed). Do not use Slider as a read-only indicator.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Slider — user sets target</span>
          <LabeledSlider
            defaultValue={[75]}
            id="vs-prog-slider"
            label="Capacity alert threshold"
          />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Progress — system reports status
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Progress for import completion and approval pipeline
            bars
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
