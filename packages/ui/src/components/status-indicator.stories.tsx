import { GOVERNED_STATES, STATUS_TONES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ERP_STATUS_SAMPLES,
  InvoiceAgingTable,
  LiveRegionStatusPanel,
  SyncJobsTable,
} from "./_storybook/status-indicator-story.compositions";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { StatusIndicator } from "./status-indicator";

// ─── StatusIndicator ───────────────────────────────────────────────────────

const meta = {
  title: "Primitives/StatusIndicator",
  component: StatusIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed ERP status cell pattern — colored dot plus secondary label text. Use inside table cells instead of filled badge pills. Dot carries tone color; label stays `text-muted-foreground` with `tabular-nums`.",
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: [...STATUS_TONES],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
  },
  args: {
    tone: "success",
    children: "Active",
  },
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    tone: "success",
    children: "Active",
  },
};

export const Default: Story = {
  render: () => <StatusIndicator tone="success">Active</StatusIndicator>,
};

// ─── Governance ────────────────────────────────────────────────────────────

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          "Consumer `data-*` props cannot override governed StatusIndicator root attributes.",
      },
    },
  },
  render: () => (
    <StatusIndicator
      data-component="Override"
      data-recipe="override"
      data-slot="override"
      data-state="fake"
      data-tone="danger"
      state="ready"
      tone="success"
    >
      Synced
    </StatusIndicator>
  ),
};

export const GovernanceTones: Story = {
  name: "Governance — Tones",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {ERP_STATUS_SAMPLES.map(({ label, tone }) => (
          <StoryRow align="center" gap="md" key={tone}>
            <StoryCaption width="sm">{tone}</StoryCaption>
            <StatusIndicator tone={tone}>{label}</StatusIndicator>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {GOVERNED_STATES.map((state) => (
          <StoryRow align="center" gap="md" key={state}>
            <StoryCaption width="sm">{state}</StoryCaption>
            <StatusIndicator state={state} tone="info">
              {state}
            </StatusIndicator>
          </StoryRow>
        ))}
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
          'Dot is `aria-hidden`; label text carries meaning. Add `role="status"` and `aria-live` when the value updates dynamically (sync progress, batch jobs).',
      },
    },
  },
  render: () => <LiveRegionStatusPanel />,
};

// ─── ERP patterns ──────────────────────────────────────────────────────────

export const TableStatusColumn: Story = {
  name: "ERP — Sync Jobs Table",
  render: () => <SyncJobsTable />,
};

export const InvoiceAgingStatus: Story = {
  name: "ERP — Invoice Aging",
  parameters: {
    docs: {
      description: {
        story:
          "Status cells in receivables aging: dot color only — label stays secondary plain text, amounts use `tabular-nums`.",
      },
    },
  },
  render: () => <InvoiceAgingTable />,
};

export const ApprovalQueue: Story = {
  name: "ERP — Approval Queue",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">
            PO-1042 · FastCo Industrial
          </span>
          <StatusIndicator tone="pending">Awaiting VP Finance</StatusIndicator>
        </StoryRow>
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">
            EXP-882 · Travel reimbursement
          </span>
          <StatusIndicator tone="warning">Manager review</StatusIndicator>
        </StoryRow>
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">
            JE-20481 · Period close accrual
          </span>
          <StatusIndicator tone="success">Approved</StatusIndicator>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const IntegrationHealth: Story = {
  name: "ERP — Integration Health",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <span className="text-sm">Stripe payments</span>
          <StatusIndicator tone="success">Connected</StatusIndicator>
        </StoryRow>
        <StoryRow align="center" justify="between">
          <span className="text-sm">Chase bank feed</span>
          <StatusIndicator tone="info">Syncing</StatusIndicator>
        </StoryRow>
        <StoryRow align="center" justify="between">
          <span className="text-sm">Avalara tax</span>
          <StatusIndicator tone="critical">Auth expired</StatusIndicator>
        </StoryRow>
        <StoryRow align="center" justify="between">
          <span className="text-sm">Legacy WMS connector</span>
          <StatusIndicator tone="forbidden">Disabled by admin</StatusIndicator>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ValidationErrors: Story = {
  name: "ERP — Validation Errors",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StatusIndicator tone="invalid">EIN format invalid</StatusIndicator>
        <StatusIndicator tone="invalid">GL account not found</StatusIndicator>
        <StatusIndicator tone="danger">Duplicate vendor tax ID</StatusIndicator>
      </StoryStack>
    </StoryFrame>
  ),
};

export const StatusVsBadge: Story = {
  name: "ERP — Status vs Badge",
  parameters: {
    docs: {
      description: {
        story:
          "Use StatusIndicator in data tables and dense lists (dot + plain text). Reserve Badge for toolbar chips and filter affordances — not table cell status pills.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Table cell — StatusIndicator
          </span>
          <StatusIndicator tone="warning">Pending review</StatusIndicator>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Toolbar chip — use Badge instead
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Badge for filter and action chips
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
