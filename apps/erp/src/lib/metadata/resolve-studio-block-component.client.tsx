"use client";

import {
  AuthShell,
  ConfirmDialogSurface,
  DataTableSurface,
  EvidenceWidget,
  MetricWidget,
  PageSurface,
  resolveAuthShellBlockPresetOrSignIn,
  SettingsSurface,
} from "@afenda/shadcn-studio-v2/clients";
import type { ComponentType } from "react";
import { AuthBlockFormPreview } from "@/components/auth/auth-block-form-preview.client";

export type StudioBlockPreviewComponent = ComponentType<Record<string, never>>;

export const STUDIO_BLOCK_VIEW_KINDS = [
  "auth-shell",
  "confirm-dialog",
  "datatable",
  "evidence-widget",
  "form",
  "metric-widget",
  "page",
  "settings",
] as const;

export type StudioBlockViewKind = (typeof STUDIO_BLOCK_VIEW_KINDS)[number];

function createMetricPreview(
  _blockId: string,
  label: string
): StudioBlockPreviewComponent {
  return function MetricPreview() {
    return (
      <MetricWidget
        dataSourceKind="fixture"
        label={label}
        state="ready"
        useCase="erp-workspace"
        value="—"
      />
    );
  };
}

function createDataTablePreview(
  _blockId: string,
  title: string
): StudioBlockPreviewComponent {
  return function DataTablePreview() {
    return (
      <DataTableSurface
        columns={[{ header: "Preview", id: "preview" }]}
        rows={[]}
        state="empty"
        title={title}
      />
    );
  };
}

function createPagePreview(
  _blockId: string,
  title: string
): StudioBlockPreviewComponent {
  return function PagePreview() {
    return <PageSurface state="ready" title={title} />;
  };
}

function createEvidencePreview(
  _blockId: string,
  title: string
): StudioBlockPreviewComponent {
  return function EvidencePreview() {
    return (
      <EvidenceWidget label={title} state="empty" useCase="erp-workspace" />
    );
  };
}

function createSettingsPreview(
  _blockId: string,
  title: string
): StudioBlockPreviewComponent {
  return function SettingsPreview() {
    return (
      <SettingsSurface
        sections={[
          {
            id: "preview",
            items: [],
            title: "Preview",
          },
        ]}
        state="ready"
        title={title}
      />
    );
  };
}

function createConfirmDialogPreview(
  _blockId: string,
  title: string
): StudioBlockPreviewComponent {
  return function ConfirmDialogPreview() {
    return (
      <ConfirmDialogSurface
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        intent="default"
        state="ready"
        title={title}
      />
    );
  };
}

function createAuthShellPreview(
  blockId: string,
  title: string
): StudioBlockPreviewComponent {
  return function AuthShellPreview() {
    const preset = resolveAuthShellBlockPresetOrSignIn(blockId);

    return (
      <AuthShell
        description={preset.description ?? title}
        state="ready"
        title={preset.title ?? title}
      >
        <AuthBlockFormPreview blockId={blockId} />
      </AuthShell>
    );
  };
}

type StudioBlockPreviewDefinition = {
  readonly create: (
    blockId: string,
    title: string
  ) => StudioBlockPreviewComponent;
  readonly title: string;
  readonly viewKind: StudioBlockViewKind;
};

const STUDIO_BLOCK_PREVIEW_DEFINITIONS = {
  "account-settings-01": {
    create: createSettingsPreview,
    title: "Account settings",
    viewKind: "settings",
  },
  "chart-earning-report": {
    create: createMetricPreview,
    title: "Earning report",
    viewKind: "metric-widget",
  },
  "chart-sales-metrics": {
    create: createMetricPreview,
    title: "Sales metrics",
    viewKind: "metric-widget",
  },
  "chart-total-revenue": {
    create: createMetricPreview,
    title: "Total revenue",
    viewKind: "metric-widget",
  },
  "datatable-invoice": {
    create: createDataTablePreview,
    title: "Invoices",
    viewKind: "datatable",
  },
  "datatable-product": {
    create: createDataTablePreview,
    title: "Products",
    viewKind: "datatable",
  },
  "datatable-user": {
    create: createDataTablePreview,
    title: "Users",
    viewKind: "datatable",
  },
  "dialog-activity": {
    create: createConfirmDialogPreview,
    title: "Activity dialog",
    viewKind: "confirm-dialog",
  },
  "error-access-denied-page-01": {
    create: createAuthShellPreview,
    title: "Access denied",
    viewKind: "auth-shell",
  },
  "error-authentication-page-01": {
    create: createAuthShellPreview,
    title: "Authentication error",
    viewKind: "auth-shell",
  },
  "error-oauth-page-01": {
    create: createAuthShellPreview,
    title: "OAuth error",
    viewKind: "auth-shell",
  },
  "error-page-shell": {
    create: createPagePreview,
    title: "Error page",
    viewKind: "page",
  },
  "error-passkey-page-01": {
    create: createAuthShellPreview,
    title: "Passkey error",
    viewKind: "auth-shell",
  },
  "error-session-expired-page-01": {
    create: createAuthShellPreview,
    title: "Session expired",
    viewKind: "auth-shell",
  },
  "error-sso-page-01": {
    create: createAuthShellPreview,
    title: "SSO error",
    viewKind: "auth-shell",
  },
  "forgot-password-page-01": {
    create: createAuthShellPreview,
    title: "Forgot password",
    viewKind: "auth-shell",
  },
  "forgot-password-success-page-01": {
    create: createAuthShellPreview,
    title: "Forgot password sent",
    viewKind: "auth-shell",
  },
  "hero-section-01": {
    create: createPagePreview,
    title: "Hero section",
    viewKind: "page",
  },
  "invite-accept-page-01": {
    create: createAuthShellPreview,
    title: "Accept invite",
    viewKind: "auth-shell",
  },
  "invite-consumed-page-01": {
    create: createAuthShellPreview,
    title: "Invite consumed",
    viewKind: "auth-shell",
  },
  "invite-email-mismatch-page-01": {
    create: createAuthShellPreview,
    title: "Invite email mismatch",
    viewKind: "auth-shell",
  },
  "invite-expired-page-01": {
    create: createAuthShellPreview,
    title: "Invite expired",
    viewKind: "auth-shell",
  },
  "invite-invalid-page-01": {
    create: createAuthShellPreview,
    title: "Invite invalid",
    viewKind: "auth-shell",
  },
  "invite-page-01": {
    create: createAuthShellPreview,
    title: "Invite",
    viewKind: "auth-shell",
  },
  "login-page-04": {
    create: createAuthShellPreview,
    title: "Sign in",
    viewKind: "auth-shell",
  },
  "login-page-03": {
    create: createAuthShellPreview,
    title: "Select workspace",
    viewKind: "auth-shell",
  },
  "mfa-page-01": {
    create: createAuthShellPreview,
    title: "MFA",
    viewKind: "auth-shell",
  },
  "mfa-recovery-page-01": {
    create: createAuthShellPreview,
    title: "MFA recovery",
    viewKind: "auth-shell",
  },
  "otp-page-01": {
    create: createAuthShellPreview,
    title: "OTP",
    viewKind: "auth-shell",
  },
  "passkey-page-01": {
    create: createAuthShellPreview,
    title: "Passkey",
    viewKind: "auth-shell",
  },
  "register-page-01": {
    create: createAuthShellPreview,
    title: "Register",
    viewKind: "auth-shell",
  },
  "reset-password-page-01": {
    create: createAuthShellPreview,
    title: "Reset password",
    viewKind: "auth-shell",
  },
  "reset-password-success-page-01": {
    create: createAuthShellPreview,
    title: "Reset password success",
    viewKind: "auth-shell",
  },
  "security-review-page-01": {
    create: createAuthShellPreview,
    title: "Security review",
    viewKind: "auth-shell",
  },
  "sso-page-01": {
    create: createAuthShellPreview,
    title: "SSO",
    viewKind: "auth-shell",
  },
  "statistics-card-01": {
    create: createMetricPreview,
    title: "Net income",
    viewKind: "metric-widget",
  },
  "statistics-card-03": {
    create: createMetricPreview,
    title: "Headcount",
    viewKind: "metric-widget",
  },
  "statistics-card-04": {
    create: createMetricPreview,
    title: "Open tasks",
    viewKind: "metric-widget",
  },
  "statistics-expense-card": {
    create: createMetricPreview,
    title: "Expense",
    viewKind: "metric-widget",
  },
  "statistics-line-trends-card": {
    create: createMetricPreview,
    title: "Line trends",
    viewKind: "metric-widget",
  },
  "statistics-orders-progress-card": {
    create: createMetricPreview,
    title: "Active orders",
    viewKind: "metric-widget",
  },
  "statistics-revenue-card": {
    create: createMetricPreview,
    title: "Revenue",
    viewKind: "metric-widget",
  },
  "statistics-sales-overview-card": {
    create: createMetricPreview,
    title: "Sales overview",
    viewKind: "metric-widget",
  },
  "statistics-trend-card": {
    create: createMetricPreview,
    title: "Trend",
    viewKind: "metric-widget",
  },
  "verify-email-expired-page-01": {
    create: createAuthShellPreview,
    title: "Verify email expired",
    viewKind: "auth-shell",
  },
  "verify-email-page-01": {
    create: createAuthShellPreview,
    title: "Verify email",
    viewKind: "auth-shell",
  },
  "verify-email-sent-page-01": {
    create: createAuthShellPreview,
    title: "Verify email sent",
    viewKind: "auth-shell",
  },
  "verify-email-success-page-01": {
    create: createAuthShellPreview,
    title: "Verify email success",
    viewKind: "auth-shell",
  },
  "widget-payment-history": {
    create: createEvidencePreview,
    title: "Payment history",
    viewKind: "evidence-widget",
  },
  "widget-sales-by-countries": {
    create: createEvidencePreview,
    title: "Regional sales",
    viewKind: "evidence-widget",
  },
  "widget-total-earning": {
    create: createEvidencePreview,
    title: "Total earning",
    viewKind: "evidence-widget",
  },
  "widget-transactions": {
    create: createEvidencePreview,
    title: "Recent transactions",
    viewKind: "evidence-widget",
  },
} as const satisfies Record<string, StudioBlockPreviewDefinition>;

const STUDIO_BLOCK_PREVIEW_REGISTRY = Object.fromEntries(
  Object.entries(STUDIO_BLOCK_PREVIEW_DEFINITIONS).map(
    ([blockId, definition]) => [
      blockId,
      definition.create(blockId, definition.title),
    ]
  )
) as Record<
  keyof typeof STUDIO_BLOCK_PREVIEW_DEFINITIONS,
  StudioBlockPreviewComponent
>;

export type StudioBlockPreviewId = keyof typeof STUDIO_BLOCK_PREVIEW_REGISTRY;

export function isStudioBlockPreviewId(
  blockId: string
): blockId is StudioBlockPreviewId {
  return blockId in STUDIO_BLOCK_PREVIEW_REGISTRY;
}

export function getStudioBlockViewKind(
  blockId: string
): StudioBlockViewKind | undefined {
  if (!isStudioBlockPreviewId(blockId)) {
    return;
  }

  return STUDIO_BLOCK_PREVIEW_DEFINITIONS[blockId].viewKind;
}

/** Maps legacy block ids to v2 view preview components for metadata/workspace bridges. */
export function resolveStudioBlockComponent(
  blockId: string
): StudioBlockPreviewComponent | undefined {
  if (!isStudioBlockPreviewId(blockId)) {
    return;
  }

  return STUDIO_BLOCK_PREVIEW_REGISTRY[blockId];
}

export function listStudioBlockPreviewIds(): readonly StudioBlockPreviewId[] {
  return Object.keys(STUDIO_BLOCK_PREVIEW_REGISTRY) as StudioBlockPreviewId[];
}
