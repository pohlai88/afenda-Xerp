import {
  DENSITIES,
  GOVERNED_PANEL_RADII,
  GOVERNED_STATES,
  STATUS_TONES,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  InfoIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  UploadIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

// ─── Helpers ───────────────────────────────────────────────────────────────

function AlertIcon({
  icon: Icon,
}: {
  readonly icon: ComponentType<{ className?: string }>;
}) {
  return <Icon aria-hidden="true" />;
}

function AlertWithDismiss({
  children,
  tone = "info",
}: {
  readonly children: ReactNode;
  readonly tone?: (typeof STATUS_TONES)[number];
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return (
      <p aria-live="polite" className="text-muted-foreground text-sm italic">
        Alert dismissed — refresh story to reset.
      </p>
    );
  }
  return (
    <Alert tone={tone}>
      {children}
      <AlertAction>
        <Button
          aria-label="Dismiss alert"
          emphasis="ghost"
          intent="quiet"
          onClick={() => setVisible(false)}
          presentation="icon"
          size="sm"
        >
          <XIcon />
        </Button>
      </AlertAction>
    </Alert>
  );
}

function DismissibleStackComponent() {
  const [alerts, setAlerts] = useState([
    {
      id: "import",
      tone: "success" as const,
      title: "Import complete",
      body: "248 employee records synced successfully.",
    },
    {
      id: "approval",
      tone: "warning" as const,
      title: "3 records need review",
      body: "Duplicate entries detected during import.",
    },
    {
      id: "maintenance",
      tone: "info" as const,
      title: "Scheduled maintenance",
      body: "System downtime tonight 02:00–04:00 UTC.",
    },
  ]);

  const dismiss = (id: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  if (alerts.length === 0) {
    return (
      <p aria-live="polite" className="text-muted-foreground text-sm italic">
        All notifications dismissed.
      </p>
    );
  }

  return (
    <StoryStack gap="sm">
      {alerts.map(({ id, tone, title, body }) => (
        <Alert key={id} tone={tone}>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{body}</AlertDescription>
          <AlertAction>
            <Button
              aria-label={`Dismiss ${title}`}
              emphasis="ghost"
              intent="quiet"
              onClick={() => dismiss(id)}
              presentation="icon"
              size="sm"
            >
              <XIcon />
            </Button>
          </AlertAction>
        </Alert>
      ))}
    </StoryStack>
  );
}

// ─── Alert ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed status alert for ERP feedback surfaces. Supports `tone` (neutral · info · success · warning · danger), optional icons, dismiss actions, and semantic `role` assignment (`alert` for warning/danger, `status` otherwise).",
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: [...STATUS_TONES],
      table: { defaultValue: { summary: "neutral" } },
    },
    density: {
      control: "select",
      options: [...DENSITIES],
      table: { defaultValue: { summary: "standard" } },
    },
    radius: {
      control: "select",
      options: [...GOVERNED_PANEL_RADII],
      table: { defaultValue: { summary: "md" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
  args: {
    tone: "neutral",
    density: "standard",
    radius: "md",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic variants ────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Success: Story = {
  args: { tone: "success" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <CheckCircle2Icon aria-hidden="true" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Info: Story = {
  args: { tone: "info" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Non-critical status update for the user.
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Warning: Story = {
  args: { tone: "warning" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertTriangleIcon aria-hidden="true" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Review required before continuing.</AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Danger: Story = {
  args: { tone: "danger" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertCircleIcon aria-hidden="true" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Try again.</AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const TitleOnly: Story = {
  name: "Alert — Title Only",
  render: () => (
    <StoryFrame width="md">
      <Alert tone="info">
        <InfoIcon aria-hidden="true" />
        <AlertTitle>
          New policy update published — review by Jun 30, 2026.
        </AlertTitle>
      </Alert>
    </StoryFrame>
  ),
};

export const WithIcon: Story = {
  name: "Alert — With Icon",
  render: () => (
    <StoryFrame width="md">
      <Alert tone="success">
        <AlertIcon icon={CheckCircle2Icon} />
        <AlertTitle>Payment processed</AlertTitle>
        <AlertDescription>
          Invoice INV-2026-0042 has been marked as paid.
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const WithAction: Story = {
  name: "Alert — With Action",
  args: { tone: "info" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>A new version is ready to install.</AlertDescription>
        <AlertAction>
          <Button emphasis="outline" intent="secondary" size="sm">
            Install
          </Button>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const WithBulletList: Story = {
  name: "Alert — With Bullet List",
  render: () => (
    <StoryFrame width="md">
      <Alert tone="danger">
        <AlertCircleIcon aria-hidden="true" />
        <AlertTitle>Unable to process payment</AlertTitle>
        <AlertDescription>
          <p>Please verify your billing information and try again.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check card details and expiry date</li>
            <li>Ensure sufficient funds are available</li>
            <li>Verify billing address matches card issuer records</li>
          </ul>
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Dismissible: Story = {
  name: "Alert — Dismissible",
  render: () => (
    <StoryFrame width="md">
      <AlertWithDismiss tone="info">
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Background sync complete</AlertTitle>
        <AlertDescription>
          12 records updated since your last visit.
        </AlertDescription>
      </AlertWithDismiss>
    </StoryFrame>
  ),
};

// ─── Governance probes ─────────────────────────────────────────────────────

export const DeprecatedVariantBridge: Story = {
  name: "Governance — Deprecated Variant Bridge",
  parameters: {
    docs: {
      description: {
        story:
          'Stock `variant="destructive"` maps to `tone="danger"`. Canonical `tone` wins when both are set. No `data-variant` is emitted.',
      },
    },
  },
  render: () => (
    <StoryStack gap="sm">
      <Alert variant="destructive">
        <AlertTitle>variant=&quot;destructive&quot; → danger</AlertTitle>
        <AlertDescription>
          Migration bridge only — prefer `tone=&quot;danger&quot;` in new code.
        </AlertDescription>
      </Alert>
      <Alert tone="warning" variant="destructive">
        <AlertTitle>tone wins over variant</AlertTitle>
        <AlertDescription>
          `data-tone` is &quot;warning&quot; even when variant is destructive.
        </AlertDescription>
      </Alert>
    </StoryStack>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="md">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <Alert state={state} tone="info">
            <InfoIcon aria-hidden="true" />
            <AlertTitle>Governed alert probe</AlertTitle>
            <AlertDescription>
              Status alert rendered with governed state &quot;{state}&quot;.
            </AlertDescription>
          </Alert>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const AllTones: Story = {
  name: "Matrix — All Tones",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {STATUS_TONES.map((tone) => (
          <Alert key={tone} tone={tone}>
            <AlertTitle>{tone}</AlertTitle>
            <AlertDescription>
              Status tone preview for ERP alerts.
            </AlertDescription>
          </Alert>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const AllDensities: Story = {
  name: "Matrix — All Densities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {DENSITIES.map((density) => (
          <Alert density={density} key={density} tone="info">
            <AlertTitle>density=&quot;{density}&quot;</AlertTitle>
            <AlertDescription>
              Spacing density variant for compact or comfortable layouts.
            </AlertDescription>
          </Alert>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const RoleSemantics: Story = {
  name: "Governance — Role Semantics",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Danger and warning tones default to `role="alert"`. Neutral, info, and success default to `role="status"`. Inspect the DOM to verify.',
      },
    },
  },
  render: () => (
    <StoryStack gap="sm">
      <Alert tone="danger">
        <AlertCircleIcon aria-hidden="true" />
        <AlertTitle>role=&quot;alert&quot; (danger)</AlertTitle>
        <AlertDescription>
          Critical error requiring immediate attention.
        </AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTriangleIcon aria-hidden="true" />
        <AlertTitle>role=&quot;alert&quot; (warning)</AlertTitle>
        <AlertDescription>Review required before proceeding.</AlertDescription>
      </Alert>
      <Alert tone="success">
        <CheckCircle2Icon aria-hidden="true" />
        <AlertTitle>role=&quot;status&quot; (success)</AlertTitle>
        <AlertDescription>
          Non-disruptive success confirmation.
        </AlertDescription>
      </Alert>
    </StoryStack>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const FormValidationErrors: Story = {
  name: "ERP — Form Validation Errors",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="danger">
        <AlertCircleIcon aria-hidden="true" />
        <AlertTitle>Unable to save employee record</AlertTitle>
        <AlertDescription>
          <p>Please fix the following errors before submitting:</p>
          <ul className="list-inside list-disc text-sm">
            <li>Employee ID is required</li>
            <li>Email address format is invalid</li>
            <li>Start date cannot be in the future</li>
            <li>Department must be selected</li>
          </ul>
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const RecordSaveSuccess: Story = {
  name: "ERP — Record Save Success",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="success">
        <CheckCircle2Icon aria-hidden="true" />
        <AlertTitle>Employee record saved</AlertTitle>
        <AlertDescription>
          Jane Doe (EMP-00142) has been updated. Changes are visible to all
          authorized users immediately.
        </AlertDescription>
        <AlertAction>
          <Button emphasis="outline" intent="secondary" size="sm">
            View Record
          </Button>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const UnsavedChanges: Story = {
  name: "ERP — Unsaved Changes Warning",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="warning">
        <AlertTriangleIcon aria-hidden="true" />
        <AlertTitle>Unsaved changes</AlertTitle>
        <AlertDescription>
          You have unsaved edits on this invoice. Leaving now will discard your
          changes.
        </AlertDescription>
        <AlertAction>
          <StoryRow gap="xs">
            <Button emphasis="ghost" intent="secondary" size="sm">
              Discard
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              Save &amp; Continue
            </Button>
          </StoryRow>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const SessionExpiring: Story = {
  name: "ERP — Session Expiring",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="warning">
        <ClockIcon aria-hidden="true" />
        <AlertTitle>Session expiring in 5 minutes</AlertTitle>
        <AlertDescription>
          Your session will expire due to inactivity. Save your work or extend
          your session to avoid losing unsaved changes.
        </AlertDescription>
        <AlertAction>
          <Button emphasis="solid" intent="primary" size="sm">
            Extend Session
          </Button>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const PermissionDenied: Story = {
  name: "ERP — Permission Denied",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="danger">
        <ShieldAlertIcon aria-hidden="true" />
        <AlertTitle>Access restricted</AlertTitle>
        <AlertDescription>
          You do not have permission to edit records in the Finance module.
          Contact your administrator to request &quot;Read / Write&quot; access.
        </AlertDescription>
        <AlertAction>
          <Button emphasis="outline" intent="secondary" size="sm">
            Request Access
          </Button>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const SystemMaintenance: Story = {
  name: "ERP — System Maintenance Notice",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="info">
        <WrenchIcon aria-hidden="true" />
        <AlertTitle>Scheduled maintenance — Jun 22, 2026</AlertTitle>
        <AlertDescription>
          The system will be unavailable from 02:00 to 04:00 UTC for database
          upgrades. Export any critical reports before the maintenance window.
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const ApprovalPending: Story = {
  name: "ERP — Approval Pending",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="warning">
        <AlertTriangleIcon aria-hidden="true" />
        <AlertTitle>Approval required — INV-2026-0042</AlertTitle>
        <AlertDescription>
          This invoice (<span className="tabular-nums">$4,850.00</span>) is
          awaiting VP Finance approval. You will be notified once the review is
          complete.
        </AlertDescription>
        <AlertAction>
          <Button emphasis="outline" intent="secondary" size="sm">
            View Workflow
          </Button>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const DataImportResult: Story = {
  name: "ERP — Data Import Result",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <Alert tone="success">
          <CheckCircle2Icon aria-hidden="true" />
          <AlertTitle>
            <span className="tabular-nums">248</span> records imported
            successfully
          </AlertTitle>
          <AlertDescription>
            Employee records from payroll_june_2026.xlsx are now available in
            the HR module.
          </AlertDescription>
        </Alert>
        <Alert tone="warning">
          <AlertTriangleIcon aria-hidden="true" />
          <AlertTitle>3 records skipped</AlertTitle>
          <AlertDescription>
            Duplicate employee IDs detected. Review skipped rows in the import
            log before re-processing.
          </AlertDescription>
          <AlertAction>
            <Button emphasis="outline" intent="secondary" size="sm">
              View Import Log
            </Button>
          </AlertAction>
        </Alert>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PaymentOverdue: Story = {
  name: "ERP — Payment Overdue",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="danger">
        <CreditCardIcon aria-hidden="true" />
        <AlertTitle>Payment overdue — INV-2026-0031</AlertTitle>
        <AlertDescription>
          Invoice for Acme Software Ltd. (
          <span className="tabular-nums">$4,850.00</span>) was due Jul 15, 2026.
          Late fees may apply after 30 days.
        </AlertDescription>
        <AlertAction>
          <StoryRow gap="xs">
            <Button emphasis="outline" intent="secondary" size="sm">
              View Invoice
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              Record Payment
            </Button>
          </StoryRow>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const SyncFailure: Story = {
  name: "ERP — Sync Failure with Retry",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="danger">
        <AlertCircleIcon aria-hidden="true" />
        <AlertTitle>Sync failed — external ERP connector</AlertTitle>
        <AlertDescription>
          Unable to reach the accounting integration endpoint. Last successful
          sync: Jun 20, 2026 at 14:32 UTC. Error code: CONN_TIMEOUT.
        </AlertDescription>
        <AlertAction>
          <StoryRow gap="xs">
            <Button emphasis="ghost" intent="secondary" size="sm">
              View Logs
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              <RefreshCwIcon />
              Retry Sync
            </Button>
          </StoryRow>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const BulkOperationResult: Story = {
  name: "ERP — Bulk Operation Result",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="info">
        <UploadIcon aria-hidden="true" />
        <AlertTitle>
          Bulk update complete — <span className="tabular-nums">18 of 20</span>{" "}
          records
        </AlertTitle>
        <AlertDescription>
          18 invoice records were approved. 2 records failed due to missing
          approver assignments. Failed records remain in &quot;Pending&quot;
          status.
        </AlertDescription>
        <AlertAction>
          <Button emphasis="outline" intent="secondary" size="sm">
            Review Failures
          </Button>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const ComplianceNotice: Story = {
  name: "ERP — Compliance Notice",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Alert tone="info">
        <ShieldAlertIcon aria-hidden="true" />
        <AlertTitle>Data retention policy update</AlertTitle>
        <AlertDescription>
          Financial records will be archived after 7 years per SOX compliance
          requirements. Archived records remain searchable but read-only.
          Effective Aug 1, 2026.
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const OnboardingWelcome: Story = {
  name: "ERP — Onboarding Welcome",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <AlertWithDismiss tone="info">
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Welcome to Afenda ERP</AlertTitle>
        <AlertDescription>
          Complete your profile and review the getting-started guide to unlock
          all modules. Your administrator has assigned you access to Finance and
          HR.
        </AlertDescription>
      </AlertWithDismiss>
    </StoryFrame>
  ),
};

export const NotificationStack: Story = {
  name: "ERP — Dismissible Notification Stack",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <DismissibleStackComponent />
    </StoryFrame>
  ),
};
