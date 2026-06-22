import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCwIcon, SaveIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Spinner } from "./spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// ─── Helpers ───────────────────────────────────────────────────────────────

const SPINNER_SIZES = ["size-4", "size-5", "size-6", "size-8"] as const;

function LoadingStatusRow({
  detail,
  label,
  spinnerLabel,
}: {
  readonly detail?: string;
  readonly label: string;
  readonly spinnerLabel?: string;
}) {
  return (
    <StoryRow align="center" gap="sm">
      <Spinner {...(spinnerLabel ? { "aria-label": spinnerLabel } : {})} />
      <StoryStack gap="xs">
        <span className="font-medium text-sm">{label}</span>
        {detail ? (
          <span className="text-muted-foreground text-xs">{detail}</span>
        ) : null}
      </StoryStack>
    </StoryRow>
  );
}

function CenteredLoadingPanel({
  description,
  title,
}: {
  readonly description?: string;
  readonly title: string;
}) {
  return (
    <StoryStack className="items-center" gap="sm">
      <Spinner aria-label={title} />
      <span className="font-medium text-sm">{title}</span>
      {description ? (
        <span className="text-center text-muted-foreground text-xs">
          {description}
        </span>
      ) : null}
    </StoryStack>
  );
}

function SimulatedSaveButton() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 2200);
  };

  return (
    <Button
      disabled={saving}
      emphasis="solid"
      intent="primary"
      onClick={handleSave}
      {...(saving ? { state: "loading" as const } : {})}
    >
      {saving ? <Spinner aria-label="Saving changes" /> : <SaveIcon />}
      {saving ? "Saving…" : "Save changes"}
    </Button>
  );
}

function SimulatedRefreshPanel() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Open purchase orders</span>
            <span className="text-muted-foreground text-xs">
              {refreshing
                ? "Refreshing from procurement service…"
                : "Last synced 2 minutes ago"}
            </span>
          </StoryStack>
          <Button
            disabled={refreshing}
            emphasis="outline"
            intent="secondary"
            onClick={handleRefresh}
            size="sm"
          >
            {refreshing ? (
              <Spinner aria-label="Refreshing purchase orders" />
            ) : (
              <RefreshCwIcon />
            )}
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
        </StoryRow>
        {refreshing ? (
          <StoryRow align="center" gap="sm" justify="center" paddingY="md">
            <Spinner aria-label="Loading purchase orders" />
            <span className="text-muted-foreground text-sm">Loading rows…</span>
          </StoryRow>
        ) : (
          <Badge emphasis="soft" tone="neutral">
            42 open POs
          </Badge>
        )}
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Spinner ───────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Governed indeterminate loading indicator for ERP async actions — save, sync, validate, search, and post operations. Exposes `role="status"` and `aria-label` by default. Use `Progress` when completion % is known; use `Skeleton` for layout placeholders; use Button `state="loading"` for submit affordances.',
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
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <Spinner />,
};

export const CustomAriaLabel: Story = {
  name: "Spinner — Custom aria-label",
  render: () => <Spinner aria-label="Syncing bank transactions" />,
};

export const WithLoadingText: Story = {
  name: "Spinner — With Loading Text",
  render: () => (
    <StoryRow align="center" gap="sm">
      <Spinner aria-label="Validating import file" />
      <span className="text-muted-foreground text-sm">
        Validating import file…
      </span>
    </StoryRow>
  ),
};

export const CenteredPanel: Story = {
  name: "Spinner — Centered Panel",
  render: () => (
    <StoryFrame width="sm">
      <CenteredLoadingPanel
        description="This may take up to 30 seconds for large ledgers."
        title="Posting journal entry"
      />
    </StoryFrame>
  ),
};

export const InButton: Story = {
  name: "Spinner — In Button",
  render: () => (
    <Button disabled emphasis="solid" intent="primary" state="loading">
      <Spinner aria-label="Submitting expense report" />
      Submitting…
    </Button>
  ),
};

export const InIconButton: Story = {
  name: "Spinner — In Icon Button",
  render: () => (
    <Button
      aria-label="Searching vendors"
      disabled
      emphasis="ghost"
      intent="secondary"
      presentation="icon"
      state="loading"
    >
      <Spinner aria-label="Searching vendors" />
    </Button>
  ),
};

export const MutedInline: Story = {
  name: "Spinner — Muted Inline",
  render: () => (
    <span className="text-muted-foreground text-xs">
      <StoryRow align="center" gap="xs">
        <Spinner aria-label="Loading" className="size-3" />
        Fetching exchange rates…
      </StoryRow>
    </span>
  ),
};

// ─── Governance ────────────────────────────────────────────────────────────

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="sm">
          <StoryRow align="center" gap="sm">
            <span className="font-mono text-muted-foreground text-xs">
              state=&quot;{state}&quot;
            </span>
            <Spinner aria-label={`Loading ${state}`} state={state} />
          </StoryRow>
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
          'Default `aria-label="Loading"` is overridden with action-specific labels (`Posting payment`, `Syncing ledger`). Pair visible text with the spinner for sighted users; the label covers assistive tech.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <LoadingStatusRow
        detail="ACH batch #8821 — 14 payments"
        label="Posting payment batch"
        spinnerLabel="Posting payment batch"
      />
    </StoryFrame>
  ),
};

export const MatrixSizes: Story = {
  name: "Matrix — Sizes (className)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="end" gap="md">
      {SPINNER_SIZES.map((sizeClass) => (
        <StoryStack className="items-center" gap="xs" key={sizeClass}>
          <Spinner aria-label={`Size ${sizeClass}`} className={sizeClass} />
          <span className="font-mono text-muted-foreground text-xs">
            {sizeClass}
          </span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

// ─── ERP single-action patterns ────────────────────────────────────────────

export const SavingRecord: Story = {
  name: "ERP — Saving Record",
  render: () => (
    <LoadingStatusRow
      detail="CUS-1048 — Northwind Traders"
      label="Saving customer record"
      spinnerLabel="Saving customer record"
    />
  ),
};

export const SyncingBankFeed: Story = {
  name: "ERP — Syncing Bank Feed",
  render: () => (
    <LoadingStatusRow
      detail="Chase Business — retrieving transactions since Jun 18"
      label="Syncing bank feed"
      spinnerLabel="Syncing bank feed"
    />
  ),
};

export const ValidatingImport: Story = {
  name: "ERP — Validating Import",
  render: () => (
    <LoadingStatusRow
      detail="employees_q2_2026.csv — 312 rows"
      label="Validating import file"
      spinnerLabel="Validating import file"
    />
  ),
};

export const PostingJournal: Story = {
  name: "ERP — Posting Journal Entry",
  render: () => (
    <CenteredLoadingPanel
      description="Debit 6200 / Credit 1100 — $4,850.00"
      title="Posting journal entry JE-20481"
    />
  ),
};

export const SearchingRecords: Story = {
  name: "ERP — Searching Records",
  render: () => (
    <StoryRow align="center" gap="sm">
      <SearchIcon aria-hidden="true" className="size-4 text-muted-foreground" />
      <Spinner aria-label="Searching vendors" className="size-4" />
      <span className="text-muted-foreground text-sm">
        Searching vendors matching &quot;acme&quot;…
      </span>
    </StoryRow>
  ),
};

export const GeneratingReport: Story = {
  name: "ERP — Generating Report",
  render: () => (
    <LoadingStatusRow
      detail="GL trial balance — FY2026 Q2"
      label="Generating report"
      spinnerLabel="Generating report"
    />
  ),
};

export const SendingInvoice: Story = {
  name: "ERP — Sending Invoice",
  render: () => (
    <LoadingStatusRow
      detail="INV-2026-0044 → accounts@acme.example"
      label="Sending invoice email"
      spinnerLabel="Sending invoice email"
    />
  ),
};

export const ProcessingPayment: Story = {
  name: "ERP — Processing Payment",
  render: () => (
    <LoadingStatusRow
      detail="Stripe authorization — INV-2026-0031"
      label="Processing card payment"
      spinnerLabel="Processing card payment"
    />
  ),
};

export const RefreshingDashboard: Story = {
  name: "ERP — Refreshing Dashboard",
  render: () => <SimulatedRefreshPanel />,
};

export const UploadingAttachment: Story = {
  name: "ERP — Uploading Attachment",
  render: () => (
    <LoadingStatusRow
      detail="receipt_may2026.pdf — 1.8 MB"
      label="Uploading attachment"
      spinnerLabel="Uploading attachment"
    />
  ),
};

export const CalculatingPayroll: Story = {
  name: "ERP — Calculating Payroll",
  render: () => (
    <CenteredLoadingPanel
      description="June 2026 cycle — 148 employees"
      title="Calculating payroll"
    />
  ),
};

export const ReconcilingStatement: Story = {
  name: "ERP — Reconciling Statement",
  render: () => (
    <LoadingStatusRow
      detail="Chase Business — May 2026 statement"
      label="Running auto-match"
      spinnerLabel="Running bank reconciliation"
    />
  ),
};

// ─── ERP composite patterns ──────────────────────────────────────────────────

export const TableRowRefreshing: Story = {
  name: "ERP — Table Refresh Overlay",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <StoryRow align="center" gap="sm" justify="center" paddingY="md">
                <Spinner aria-label="Loading invoices" />
                <span className="text-muted-foreground text-sm">
                  Refreshing invoice list…
                </span>
              </StoryRow>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const CardHeaderLoading: Story = {
  name: "ERP — Card Header Loading",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <StoryRow align="center" gap="sm">
            <Spinner aria-label="Loading KPI" className="size-4" />
            <StoryStack gap="xs">
              <CardTitle>Accounts receivable</CardTitle>
              <CardDescription>Fetching live balance…</CardDescription>
            </StoryStack>
          </StoryRow>
        </CardHeader>
        <CardContent>
          <StoryRow align="center" justify="center" paddingY="lg">
            <Spinner aria-label="Loading accounts receivable total" />
          </StoryRow>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const DialogSubmitLoading: Story = {
  name: "ERP — Dialog Submit Loading",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack
        className="rounded-lg border border-border"
        gap="md"
        padding="lg"
      >
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">Void invoice?</span>
          <span className="text-muted-foreground text-xs">
            INV-2026-0031 will be marked void and removed from aging.
          </span>
        </StoryStack>
        <StoryRow align="center" gap="sm" justify="center">
          <Spinner aria-label="Voiding invoice" />
          <span className="text-muted-foreground text-sm">
            Voiding invoice…
          </span>
        </StoryRow>
        <StoryRow justify="end">
          <Button disabled emphasis="ghost" intent="secondary" size="sm">
            Cancel
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InlineFormValidation: Story = {
  name: "ERP — Inline Form Validation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">Tax ID verification</span>
        <StoryRow align="center" gap="sm">
          <Spinner aria-label="Validating tax ID" className="size-4" />
          <span className="text-muted-foreground text-sm">
            Validating EIN with IRS service…
          </span>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const BatchOperationStatus: Story = {
  name: "ERP — Batch Operation Status",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Bulk approve expenses</span>
            <span className="text-muted-foreground text-xs">
              Processing 18 of 20 selected records
            </span>
          </StoryStack>
          <Badge emphasis="soft" tone="warning">
            In progress
          </Badge>
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <Spinner aria-label="Bulk approving expenses" />
          <span className="text-muted-foreground text-sm">
            Do not close this window until processing completes.
          </span>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const MasterDetailLoading: Story = {
  name: "ERP — Master-Detail Loading",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow gap="md">
        <StoryStack className="min-w-0 flex-1" gap="sm">
          <span className="font-medium text-sm">Customers</span>
          <Badge emphasis="soft" tone="neutral">
            List loaded
          </Badge>
        </StoryStack>
        <StoryStack
          className="min-w-0 flex-1 items-center rounded-md border border-border"
          gap="sm"
          padding="lg"
        >
          <Spinner aria-label="Loading customer detail" />
          <span className="text-muted-foreground text-sm">
            Loading CUS-1048 detail…
          </span>
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const AsyncSaveInteractive: Story = {
  name: "ERP — Async Save (Interactive)",
  parameters: { layout: "padded" },
  render: () => <SimulatedSaveButton />,
};

export const OperationFeedbackMatrix: Story = {
  name: "ERP — Operation Feedback Matrix",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <LoadingStatusRow label="Saving draft" spinnerLabel="Saving draft" />
        <LoadingStatusRow
          detail="WMS connector"
          label="Syncing inventory"
          spinnerLabel="Syncing inventory"
        />
        <LoadingStatusRow
          detail="FY2026 Q2"
          label="Closing period"
          spinnerLabel="Closing fiscal period"
        />
        <LoadingStatusRow
          detail="18 expense reports"
          label="Running approval rules"
          spinnerLabel="Running approval rules"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── Guidance ──────────────────────────────────────────────────────────────

export const SpinnerVsProgress: Story = {
  name: "ERP — Spinner vs Progress",
  parameters: {
    docs: {
      description: {
        story:
          "Spinner: indeterminate wait — unknown duration or no percentage. Progress: known completion (upload %, import rows, budget consumed).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Spinner — validating import
          </span>
          <StoryRow align="center" gap="sm">
            <Spinner aria-label="Validating import" />
            <span className="text-muted-foreground text-xs">
              No row count yet
            </span>
          </StoryRow>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Progress — uploading file</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Progress when upload percentage is available
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SpinnerVsSkeleton: Story = {
  name: "ERP — Spinner vs Skeleton",
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton: preserves layout while record structure loads (tables, cards, forms). Spinner: action feedback without mimicking content shape (save, post, refresh).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Spinner — posting payment</span>
          <StoryRow align="center" gap="sm">
            <Spinner aria-label="Posting payment" />
            <span className="text-muted-foreground text-xs">
              Action in flight
            </span>
          </StoryRow>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Skeleton — invoice list loading
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Skeleton for table and card placeholders
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SpinnerVsButtonState: Story = {
  name: "ERP — Spinner vs Button state",
  parameters: {
    docs: {
      description: {
        story:
          'Place `Spinner` inside a Button with `state="loading"` and `disabled` for submit affordances. Use standalone `Spinner` in panels, tables, and dialogs where a button is not the anchor.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Button + Spinner — submit</span>
          <Button disabled emphasis="solid" intent="primary" state="loading">
            <Spinner aria-label="Submitting" />
            Submitting…
          </Button>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Standalone — panel wait</span>
          <CenteredLoadingPanel title="Validating tax codes" />
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
