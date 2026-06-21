import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import { Progress } from "./progress";
import { Spinner } from "./spinner";

// ─── Helpers ───────────────────────────────────────────────────────────────

function LabeledProgress({
  detail,
  label,
  value,
}: {
  readonly detail?: string;
  readonly label: string;
  readonly value: number;
}) {
  return (
    <StoryStack gap="xs">
      <StoryRow justify="between">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-muted-foreground text-xs">
          {detail ?? `${value}%`}
        </span>
      </StoryRow>
      <Progress value={value} />
    </StoryStack>
  );
}

function stepBadgeTone(pct: number): "success" | "warning" | "neutral" {
  if (pct === 100) {
    return "success";
  }
  if (pct > 0) {
    return "warning";
  }
  return "neutral";
}

function FileUploadDemo() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  const start = () => {
    setProgress(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) {
      return;
    }
    if (progress >= 100) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(
      () => setProgress((current) => Math.min(current + 5, 100)),
      100
    );
    return () => clearTimeout(timer);
  }, [running, progress]);

  return (
    <StoryFrame width="lg">
      <StoryStack
        className="rounded-md border border-border"
        gap="md"
        padding="lg"
      >
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">payroll_june_2026.xlsx</span>
            <span className="text-muted-foreground text-xs">
              {progress < 100 ? `Uploading… ${progress}%` : "Upload complete"}
            </span>
          </StoryStack>
          {progress < 100 ? (
            <Spinner />
          ) : (
            <Badge emphasis="soft" tone="success">
              Done
            </Badge>
          )}
        </StoryRow>
        <Progress value={progress} />
        <StoryRow justify="end">
          <Button emphasis="ghost" intent="primary" onClick={start} size="sm">
            {running ? "Uploading…" : "Restart demo"}
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Progress ─────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix UI progress bar for ERP uploads, imports, approval workflows, budget utilization, and task completion. Value is 0–100. Pair with labels and record counts for table and card footers.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress value (0–100)",
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
  },
  args: {
    value: 60,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Progress {...args} />
    </StoryFrame>
  ),
};

export const Complete: Story = {
  args: { value: 100 },
  render: (args) => (
    <StoryFrame width="md">
      <Progress {...args} />
    </StoryFrame>
  ),
};

export const Empty: Story = {
  args: { value: 0 },
  render: (args) => (
    <StoryFrame width="md">
      <Progress {...args} />
    </StoryFrame>
  ),
};

export const WithLabel: Story = {
  name: "Progress — With Label",
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress label="Budget consumed" value={72} />
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
          <span className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </span>
          <Progress state={state} value={60} />
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const MatrixProgressValues: Story = {
  name: "Matrix — Progress Values",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {[0, 25, 50, 75, 100].map((value) => (
          <StoryRow align="center" gap="sm" key={value}>
            <span className="w-8 text-right text-muted-foreground text-xs">
              {value}%
            </span>
            <div className="min-w-0 flex-1">
              <Progress value={value} />
            </div>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const FileUpload: Story = {
  name: "ERP — File Upload Progress",
  parameters: { layout: "padded" },
  render: () => <FileUploadDemo />,
};

export const DataImport: Story = {
  name: "ERP — Data Import Progress",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <LabeledProgress
          detail="248 / 248"
          label="Employee records"
          value={100}
        />
        <LabeledProgress
          detail="182 / 324"
          label="Payroll entries"
          value={56}
        />
        <LabeledProgress detail="0 / 248" label="Leave balances" value={0} />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ApprovalWorkflow: Story = {
  name: "ERP — Approval Workflow Stages",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        {[
          { stage: "Submitted", pct: 100 },
          { stage: "Department review", pct: 100 },
          { stage: "Finance approval", pct: 60 },
          { stage: "Executive sign-off", pct: 0 },
        ].map(({ stage, pct }, index) => (
          <StoryRow align="start" gap="sm" key={stage}>
            <Badge emphasis="soft" size="sm" tone={stepBadgeTone(pct)}>
              {index + 1}
            </Badge>
            <StoryStack className="min-w-0 flex-1" gap="xs">
              <StoryRow justify="between">
                <span className="text-sm">{stage}</span>
                <span className="text-muted-foreground text-xs">{pct}%</span>
              </StoryRow>
              <Progress value={pct} />
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const BudgetUtilization: Story = {
  name: "ERP — Budget Utilization",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledProgress
          detail="$920K / $1.2M"
          label="Engineering · FY 2026"
          value={77}
        />
        <LabeledProgress
          detail="$410K / $800K"
          label="Marketing · FY 2026"
          value={51}
        />
        <LabeledProgress
          detail="$1.05M / $1.0M"
          label="Operations · FY 2026"
          value={100}
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const POReceiptProgress: Story = {
  name: "ERP — PO Receipt Progress",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="72 / 100 units received"
        label="PO-2026-1184 · Industrial fasteners"
        value={72}
      />
    </StoryFrame>
  ),
};

export const InventoryReorder: Story = {
  name: "ERP — Inventory Reorder Level",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledProgress
          detail="820 / 500 min"
          label="SKU-WDG-442 · On hand vs reorder"
          value={100}
        />
        <LabeledProgress
          detail="180 / 500 min"
          label="SKU-FST-M8 · On hand vs reorder"
          value={36}
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const PayrollProcessing: Story = {
  name: "ERP — Payroll Processing",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="Step 3 of 5 · Calculating deductions"
        label="Pay run PR-2026-06-18"
        value={58}
      />
    </StoryFrame>
  ),
};

export const PaymentBatchPosting: Story = {
  name: "ERP — Payment Batch Posting",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="18 / 24 payments posted"
        label="BATCH-2026-06-18"
        value={75}
      />
    </StoryFrame>
  ),
};

export const ProjectMilestone: Story = {
  name: "ERP — Project Milestone",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="Phase 2 · Integration testing"
        label="ERP rollout · Manufacturing module"
        value={45}
      />
    </StoryFrame>
  ),
};

export const OnboardingChecklist: Story = {
  name: "ERP — Employee Onboarding",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledProgress
          detail="4 / 6 tasks complete"
          label="Jane Doe · EMP-1024"
          value={67}
        />
        <StoryStack gap="xs">
          {[
            "Profile created",
            "Payroll details submitted",
            "Equipment assigned",
            "Policy acknowledgements",
          ].map((task) => (
            <span className="text-muted-foreground text-xs" key={task}>
              ✓ {task}
            </span>
          ))}
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SLAProgress: Story = {
  name: "ERP — Approval SLA",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="18h elapsed · 24h SLA"
        label="INV-2026-0042 approval window"
        value={75}
      />
    </StoryFrame>
  ),
};

export const QuarterlyTarget: Story = {
  name: "ERP — Quarterly Sales Target",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="$842K / $1.0M Q2 target"
        label="North America · Enterprise"
        value={84}
      />
    </StoryFrame>
  ),
};

export const StorageQuota: Story = {
  name: "ERP — Document Storage Quota",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="42.8 GB / 50 GB"
        label="Tenant document storage"
        value={86}
      />
    </StoryFrame>
  ),
};

export const WarehouseCapacity: Story = {
  name: "ERP — Warehouse Capacity",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <LabeledProgress
          detail="82% utilized"
          label="Sydney · Aisle 12"
          value={82}
        />
        <LabeledProgress
          detail="54% utilized"
          label="Melbourne · Zone B"
          value={54}
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const TrainingCompletion: Story = {
  name: "ERP — Compliance Training",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <LabeledProgress
        detail="186 / 248 employees certified"
        label="SOX compliance training · FY 2026"
        value={75}
      />
    </StoryFrame>
  ),
};

export const ModuleRollout: Story = {
  name: "ERP — Module Rollout",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        {[
          { module: "Finance", value: 100 },
          { module: "Procurement", value: 88 },
          { module: "Inventory", value: 62 },
          { module: "HR", value: 34 },
        ].map(({ module, value }) => (
          <LabeledProgress
            detail={`${value}% enabled`}
            key={module}
            label={module}
            value={value}
          />
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const DashboardSummary: Story = {
  name: "ERP — Dashboard KPI Row",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack
        className="rounded-md border border-border"
        gap="md"
        padding="lg"
      >
        <StoryRow justify="between">
          <span className="font-medium text-sm">Month-end close</span>
          <Badge emphasis="soft" tone="warning">
            In progress
          </Badge>
        </StoryRow>
        <Progress value={68} />
        <span className="text-muted-foreground text-xs">
          17 of 25 close tasks complete · due Jun 30, 2026
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const LoadingVsProgress: Story = {
  name: "ERP — Progress vs Spinner",
  parameters: {
    docs: {
      description: {
        story:
          "Use `Progress` when completion percentage is known (uploads, imports, budgets). Use `Spinner` for indeterminate waits — see Primitives/Spinner when available.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Determinate (Progress)</span>
          <LabeledProgress label="Exporting 284 invoices" value={42} />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Indeterminate (Spinner)</span>
          <StoryRow align="center" gap="sm">
            <Spinner />
            <span className="text-muted-foreground text-sm">
              Validating tax codes…
            </span>
          </StoryRow>
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
          "Radix Progress exposes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`. Pair with visible labels and supplementary text for screen readers.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <span className="font-medium text-sm" id="progress-label">
          Payment batch posting
        </span>
        <Progress aria-labelledby="progress-label" value={75} />
        <span className="text-muted-foreground text-xs">
          18 of 24 payments posted to the ledger.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};
