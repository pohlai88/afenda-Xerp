"use client";

import {
  DataTableSurface,
  EvidenceWidget,
  FormSurface,
  MetricWidget,
  PageSurface,
} from "@afenda/shadcn-studio-v2/clients";
import type { ComponentType } from "react";

export type StudioBlockPreviewComponent = ComponentType<Record<string, never>>;

function createMetricPreview(label: string): StudioBlockPreviewComponent {
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

function createDataTablePreview(title: string): StudioBlockPreviewComponent {
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

function createFormPreview(title: string): StudioBlockPreviewComponent {
  return function FormPreview() {
    return (
      <FormSurface fields={[]} state="ready" title={title} />
    );
  };
}

function createPagePreview(title: string): StudioBlockPreviewComponent {
  return function PagePreview() {
    return <PageSurface state="ready" title={title} />;
  };
}

function createEvidencePreview(title: string): StudioBlockPreviewComponent {
  return function EvidencePreview() {
    return (
      <EvidenceWidget
        label={title}
        state="empty"
        useCase="erp-workspace"
      />
    );
  };
}

const STUDIO_BLOCK_PREVIEW_REGISTRY = {
  "account-settings-01": createFormPreview("Account settings"),
  "chart-earning-report": createMetricPreview("Earning report"),
  "chart-sales-metrics": createMetricPreview("Sales metrics"),
  "chart-total-revenue": createMetricPreview("Total revenue"),
  "datatable-invoice": createDataTablePreview("Invoices"),
  "datatable-product": createDataTablePreview("Products"),
  "datatable-user": createDataTablePreview("Users"),
  "dialog-activity": createFormPreview("Activity dialog"),
  "error-access-denied-page-01": createPagePreview("Access denied"),
  "error-authentication-page-01": createPagePreview("Authentication error"),
  "error-oauth-page-01": createPagePreview("OAuth error"),
  "error-page-shell": createPagePreview("Error page"),
  "error-passkey-page-01": createPagePreview("Passkey error"),
  "error-session-expired-page-01": createPagePreview("Session expired"),
  "error-sso-page-01": createPagePreview("SSO error"),
  "forgot-password-page-01": createFormPreview("Forgot password"),
  "forgot-password-success-page-01": createPagePreview("Forgot password sent"),
  "hero-section-01": createPagePreview("Hero section"),
  "invite-accept-page-01": createFormPreview("Accept invite"),
  "invite-consumed-page-01": createPagePreview("Invite consumed"),
  "invite-email-mismatch-page-01": createPagePreview("Invite email mismatch"),
  "invite-expired-page-01": createPagePreview("Invite expired"),
  "invite-invalid-page-01": createPagePreview("Invite invalid"),
  "invite-page-01": createPagePreview("Invite"),
  "login-page-04": createFormPreview("Sign in"),
  "mfa-page-01": createFormPreview("MFA"),
  "mfa-recovery-page-01": createFormPreview("MFA recovery"),
  "otp-page-01": createFormPreview("OTP"),
  "passkey-page-01": createPagePreview("Passkey"),
  "register-page-01": createFormPreview("Register"),
  "reset-password-page-01": createFormPreview("Reset password"),
  "reset-password-success-page-01": createPagePreview("Reset password success"),
  "security-review-page-01": createPagePreview("Security review"),
  "sso-page-01": createPagePreview("SSO"),
  "statistics-card-01": createMetricPreview("Net income"),
  "statistics-card-03": createMetricPreview("Headcount"),
  "statistics-card-04": createMetricPreview("Open tasks"),
  "statistics-expense-card": createMetricPreview("Expense"),
  "statistics-line-trends-card": createMetricPreview("Line trends"),
  "statistics-orders-progress-card": createMetricPreview("Active orders"),
  "statistics-revenue-card": createMetricPreview("Revenue"),
  "statistics-sales-overview-card": createMetricPreview("Sales overview"),
  "statistics-trend-card": createMetricPreview("Trend"),
  "verify-email-expired-page-01": createPagePreview("Verify email expired"),
  "verify-email-page-01": createPagePreview("Verify email"),
  "verify-email-sent-page-01": createPagePreview("Verify email sent"),
  "verify-email-success-page-01": createPagePreview("Verify email success"),
  "widget-payment-history": createEvidencePreview("Payment history"),
  "widget-sales-by-countries": createEvidencePreview("Regional sales"),
  "widget-total-earning": createEvidencePreview("Total earning"),
  "widget-transactions": createEvidencePreview("Recent transactions"),
} as const satisfies Record<string, StudioBlockPreviewComponent>;

export type StudioBlockPreviewId = keyof typeof STUDIO_BLOCK_PREVIEW_REGISTRY;

export function isStudioBlockPreviewId(
  blockId: string
): blockId is StudioBlockPreviewId {
  return blockId in STUDIO_BLOCK_PREVIEW_REGISTRY;
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
