/**
 * PAS-006D P06-009 — surface template registry.
 */

import type { SurfaceTemplateContractWire } from "../meta-contracts/surface-template.contract.js";
import { BLOCK_DATA_CONTRACT_REGISTRY } from "./block-slot.registry.js";

export const SURFACE_TEMPLATE_REGISTRY = [
  {
    acceptanceRecordIds: ["acceptance-record:account-settings-01"],
    blockBindings: [
      {
        blockId: "account-settings-01",
        slotFills: {
          "profile.displayName": "profile.displayName",
          "profile.email": "profile.email",
        },
      },
    ],
    metadataBindingId: "metadata-binding.account-settings-01",
    surfaceTemplateId: "surface-template.account-settings",
    templateClass: "settings",
  },
  {
    acceptanceRecordIds: ["acceptance-record:datatable-invoice"],
    blockBindings: [
      {
        blockId: "datatable-invoice",
        slotFills: {
          "table.header": "table.header",
          "table.rows": "table.rows",
        },
      },
    ],
    metadataBindingId: "metadata-binding.datatable-invoice",
    surfaceTemplateId: "surface-template.invoice-table",
    templateClass: "table",
  },
  {
    acceptanceRecordIds: ["acceptance-record:statistics-card-01"],
    blockBindings: [
      {
        blockId: "statistics-card-01",
        slotFills: {
          "metric.label": "metric.label",
          "metric.value": "metric.value",
        },
      },
    ],
    metadataBindingId: "metadata-binding.statistics-card-01",
    surfaceTemplateId: "surface-template.analytics-metric",
    templateClass: "dashboard",
  },
  {
    acceptanceRecordIds: ["acceptance-record:hero-section-01"],
    blockBindings: [
      {
        blockId: "hero-section-01",
        slotFills: {
          "hero.title": "hero.title",
          "hero.subtitle": "hero.subtitle",
        },
      },
    ],
    metadataBindingId: "metadata-binding.hero-section-01",
    surfaceTemplateId: "surface-template.marketing-hero",
    templateClass: "dashboard",
  },
  {
    acceptanceRecordIds: ["acceptance-record:dialog-activity"],
    blockBindings: [
      {
        blockId: "dialog-activity",
        slotFills: {
          "dialog.header": "dialog.header",
          "dialog.body": "dialog.body",
          "dialog.footer": "dialog.footer",
        },
      },
    ],
    metadataBindingId: "metadata-binding.dialog-activity",
    surfaceTemplateId: "surface-template.activity-dialog",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:error-page-shell"],
    blockBindings: [
      {
        blockId: "error-page-shell",
        slotFills: {
          "error.title": "error.title",
          "error.message": "error.message",
          "error.action": "error.action",
        },
      },
    ],
    metadataBindingId: "metadata-binding.error-page-shell",
    surfaceTemplateId: "surface-template.error-page",
    templateClass: "dashboard",
  },
  {
    acceptanceRecordIds: ["acceptance-record:login-page-04"],
    blockBindings: [
      {
        blockId: "login-page-04",
        slotFills: {
          "login.branding.title": "login.branding.title",
          "login.branding.lead": "login.branding.lead",
          "login.form.title": "login.form.title",
          "login.form.subtitle": "login.form.subtitle",
          "login.email": "login.email",
          "login.password": "login.password",
          "login.submit": "login.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.login-page-04",
    surfaceTemplateId: "surface-template.auth-sign-in",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:register-page-01"],
    blockBindings: [
      {
        blockId: "register-page-01",
        slotFills: {
          "register.branding.eyebrow": "register.branding.eyebrow",
          "register.branding.title": "register.branding.title",
          "register.branding.lead": "register.branding.lead",
          "register.form.title": "register.form.title",
          "register.form.subtitle": "register.form.subtitle",
          "register.name": "register.name",
          "register.email": "register.email",
          "register.password": "register.password",
          "register.confirmPassword": "register.confirmPassword",
          "register.invitationCode": "register.invitationCode",
          "register.submit": "register.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.register-page-01",
    surfaceTemplateId: "surface-template.auth-sign-up",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:forgot-password-page-01"],
    blockBindings: [
      {
        blockId: "forgot-password-page-01",
        slotFills: {
          "forgot-password.form.title": "forgot-password.form.title",
          "forgot-password.form.subtitle": "forgot-password.form.subtitle",
          "forgot-password.email": "forgot-password.email",
          "forgot-password.submit": "forgot-password.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.forgot-password-page-01",
    surfaceTemplateId: "surface-template.auth-forgot-password",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:forgot-password-success-page-01"],
    blockBindings: [
      {
        blockId: "forgot-password-success-page-01",
        slotFills: {
          "forgot-password-success.title": "forgot-password-success.title",
          "forgot-password-success.message": "forgot-password-success.message",
          "forgot-password-success.cta": "forgot-password-success.cta",
          "forgot-password-success.back": "forgot-password-success.back",
        },
      },
    ],
    metadataBindingId: "metadata-binding.forgot-password-success-page-01",
    surfaceTemplateId: "surface-template.auth-forgot-password-success",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:reset-password-page-01"],
    blockBindings: [
      {
        blockId: "reset-password-page-01",
        slotFills: {
          "reset-password.form.title": "reset-password.form.title",
          "reset-password.form.subtitle": "reset-password.form.subtitle",
          "reset-password.password": "reset-password.password",
          "reset-password.confirmPassword": "reset-password.confirmPassword",
          "reset-password.submit": "reset-password.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.reset-password-page-01",
    surfaceTemplateId: "surface-template.auth-reset-password",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:reset-password-success-page-01"],
    blockBindings: [
      {
        blockId: "reset-password-success-page-01",
        slotFills: {
          "reset-password-success.title": "reset-password-success.title",
          "reset-password-success.message": "reset-password-success.message",
          "reset-password-success.cta": "reset-password-success.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.reset-password-success-page-01",
    surfaceTemplateId: "surface-template.auth-reset-password-success",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:verify-email-page-01"],
    blockBindings: [
      {
        blockId: "verify-email-page-01",
        slotFills: {
          "verify-email.title": "verify-email.title",
          "verify-email.message": "verify-email.message",
          "verify-email.cta": "verify-email.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.verify-email-page-01",
    surfaceTemplateId: "surface-template.auth-verify-email",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:verify-email-sent-page-01"],
    blockBindings: [
      {
        blockId: "verify-email-sent-page-01",
        slotFills: {
          "verify-email-sent.title": "verify-email-sent.title",
          "verify-email-sent.message": "verify-email-sent.message",
          "verify-email-sent.cta": "verify-email-sent.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.verify-email-sent-page-01",
    surfaceTemplateId: "surface-template.auth-verify-email-sent",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:verify-email-expired-page-01"],
    blockBindings: [
      {
        blockId: "verify-email-expired-page-01",
        slotFills: {
          "verify-email-expired.title": "verify-email-expired.title",
          "verify-email-expired.message": "verify-email-expired.message",
          "verify-email-expired.cta": "verify-email-expired.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.verify-email-expired-page-01",
    surfaceTemplateId: "surface-template.auth-verify-email-expired",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:verify-email-success-page-01"],
    blockBindings: [
      {
        blockId: "verify-email-success-page-01",
        slotFills: {
          "verify-email-success.title": "verify-email-success.title",
          "verify-email-success.message": "verify-email-success.message",
          "verify-email-success.cta": "verify-email-success.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.verify-email-success-page-01",
    surfaceTemplateId: "surface-template.auth-verify-email-success",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:invite-page-01"],
    blockBindings: [
      {
        blockId: "invite-page-01",
        slotFills: {
          "invite.title": "invite.title",
          "invite.message": "invite.message",
          "invite.cta": "invite.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.invite-page-01",
    surfaceTemplateId: "surface-template.auth-invite",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:invite-accept-page-01"],
    blockBindings: [
      {
        blockId: "invite-accept-page-01",
        slotFills: {
          "invite-accept.form.title": "invite-accept.form.title",
          "invite-accept.form.subtitle": "invite-accept.form.subtitle",
          "invite-accept.name": "invite-accept.name",
          "invite-accept.email": "invite-accept.email",
          "invite-accept.password": "invite-accept.password",
          "invite-accept.confirmPassword": "invite-accept.confirmPassword",
          "invite-accept.invitationCode": "invite-accept.invitationCode",
          "invite-accept.submit": "invite-accept.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.invite-accept-page-01",
    surfaceTemplateId: "surface-template.auth-invite-accept",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:invite-expired-page-01"],
    blockBindings: [
      {
        blockId: "invite-expired-page-01",
        slotFills: {
          "invite-expired.title": "invite-expired.title",
          "invite-expired.message": "invite-expired.message",
          "invite-expired.cta": "invite-expired.cta",
          "invite-expired.back": "invite-expired.back",
        },
      },
    ],
    metadataBindingId: "metadata-binding.invite-expired-page-01",
    surfaceTemplateId: "surface-template.auth-invite-expired",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:invite-invalid-page-01"],
    blockBindings: [
      {
        blockId: "invite-invalid-page-01",
        slotFills: {
          "invite-invalid.title": "invite-invalid.title",
          "invite-invalid.message": "invite-invalid.message",
          "invite-invalid.cta": "invite-invalid.cta",
          "invite-invalid.back": "invite-invalid.back",
        },
      },
    ],
    metadataBindingId: "metadata-binding.invite-invalid-page-01",
    surfaceTemplateId: "surface-template.auth-invite-invalid",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:invite-consumed-page-01"],
    blockBindings: [
      {
        blockId: "invite-consumed-page-01",
        slotFills: {
          "invite-consumed.title": "invite-consumed.title",
          "invite-consumed.message": "invite-consumed.message",
          "invite-consumed.cta": "invite-consumed.cta",
          "invite-consumed.back": "invite-consumed.back",
        },
      },
    ],
    metadataBindingId: "metadata-binding.invite-consumed-page-01",
    surfaceTemplateId: "surface-template.auth-invite-consumed",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:invite-email-mismatch-page-01"],
    blockBindings: [
      {
        blockId: "invite-email-mismatch-page-01",
        slotFills: {
          "invite-email-mismatch.title": "invite-email-mismatch.title",
          "invite-email-mismatch.message": "invite-email-mismatch.message",
          "invite-email-mismatch.cta": "invite-email-mismatch.cta",
          "invite-email-mismatch.back": "invite-email-mismatch.back",
        },
      },
    ],
    metadataBindingId: "metadata-binding.invite-email-mismatch-page-01",
    surfaceTemplateId: "surface-template.auth-invite-email-mismatch",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:passkey-page-01"],
    blockBindings: [
      {
        blockId: "passkey-page-01",
        slotFills: {
          "passkey.title": "passkey.title",
          "passkey.message": "passkey.message",
          "passkey.cta": "passkey.cta",
          "passkey.fallback": "passkey.fallback",
        },
      },
    ],
    metadataBindingId: "metadata-binding.passkey-page-01",
    surfaceTemplateId: "surface-template.auth-passkey",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:error-passkey-page-01"],
    blockBindings: [
      {
        blockId: "error-passkey-page-01",
        slotFills: {
          "error-passkey.title": "error-passkey.title",
          "error-passkey.message": "error-passkey.message",
          "error-passkey.cta": "error-passkey.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.error-passkey-page-01",
    surfaceTemplateId: "surface-template.error-auth-passkey",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:sso-page-01"],
    blockBindings: [
      {
        blockId: "sso-page-01",
        slotFills: {
          "sso.title": "sso.title",
          "sso.message": "sso.message",
          "sso.cta": "sso.cta",
          "sso.fallback": "sso.fallback",
        },
      },
    ],
    metadataBindingId: "metadata-binding.sso-page-01",
    surfaceTemplateId: "surface-template.auth-sso",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:error-sso-page-01"],
    blockBindings: [
      {
        blockId: "error-sso-page-01",
        slotFills: {
          "error-sso.title": "error-sso.title",
          "error-sso.message": "error-sso.message",
          "error-sso.cta": "error-sso.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.error-sso-page-01",
    surfaceTemplateId: "surface-template.error-auth-sso",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:error-oauth-page-01"],
    blockBindings: [
      {
        blockId: "error-oauth-page-01",
        slotFills: {
          "error-oauth.title": "error-oauth.title",
          "error-oauth.message": "error-oauth.message",
          "error-oauth.cta": "error-oauth.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.error-oauth-page-01",
    surfaceTemplateId: "surface-template.error-auth-oauth",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:otp-page-01"],
    blockBindings: [
      {
        blockId: "otp-page-01",
        slotFills: {
          "otp.form.title": "otp.form.title",
          "otp.form.subtitle": "otp.form.subtitle",
          "otp.code": "otp.code",
          "otp.submit": "otp.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.otp-page-01",
    surfaceTemplateId: "surface-template.auth-otp",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:mfa-page-01"],
    blockBindings: [
      {
        blockId: "mfa-page-01",
        slotFills: {
          "mfa.form.title": "mfa.form.title",
          "mfa.form.subtitle": "mfa.form.subtitle",
          "mfa.code": "mfa.code",
          "mfa.submit": "mfa.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.mfa-page-01",
    surfaceTemplateId: "surface-template.auth-mfa",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:mfa-recovery-page-01"],
    blockBindings: [
      {
        blockId: "mfa-recovery-page-01",
        slotFills: {
          "mfa-recovery.form.title": "mfa-recovery.form.title",
          "mfa-recovery.form.subtitle": "mfa-recovery.form.subtitle",
          "mfa-recovery.code": "mfa-recovery.code",
          "mfa-recovery.submit": "mfa-recovery.submit",
        },
      },
    ],
    metadataBindingId: "metadata-binding.mfa-recovery-page-01",
    surfaceTemplateId: "surface-template.auth-mfa-recovery",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:error-session-expired-page-01"],
    blockBindings: [
      {
        blockId: "error-session-expired-page-01",
        slotFills: {
          "error-session-expired.title": "error-session-expired.title",
          "error-session-expired.message": "error-session-expired.message",
          "error-session-expired.cta": "error-session-expired.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.error-session-expired-page-01",
    surfaceTemplateId: "surface-template.error-auth-session-expired",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:error-access-denied-page-01"],
    blockBindings: [
      {
        blockId: "error-access-denied-page-01",
        slotFills: {
          "error-access-denied.title": "error-access-denied.title",
          "error-access-denied.message": "error-access-denied.message",
          "error-access-denied.cta": "error-access-denied.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.error-access-denied-page-01",
    surfaceTemplateId: "surface-template.error-auth-access-denied",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:security-review-page-01"],
    blockBindings: [
      {
        blockId: "security-review-page-01",
        slotFills: {
          "security-review.title": "security-review.title",
          "security-review.message": "security-review.message",
          "security-review.cta": "security-review.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.security-review-page-01",
    surfaceTemplateId: "surface-template.auth-security-review",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:error-authentication-page-01"],
    blockBindings: [
      {
        blockId: "error-authentication-page-01",
        slotFills: {
          "error-authentication.title": "error-authentication.title",
          "error-authentication.message": "error-authentication.message",
          "error-authentication.cta": "error-authentication.cta",
        },
      },
    ],
    metadataBindingId: "metadata-binding.error-authentication-page-01",
    surfaceTemplateId: "surface-template.error-authentication",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:datatable-user"],
    blockBindings: [
      {
        blockId: "datatable-user",
        slotFills: {
          "table.header": "table.header",
          "table.rows": "table.rows",
        },
      },
    ],
    metadataBindingId: "metadata-binding.datatable-user",
    surfaceTemplateId: "surface-template.user-table",
    templateClass: "table",
  },
  {
    acceptanceRecordIds: ["acceptance-record:datatable-product"],
    blockBindings: [
      {
        blockId: "datatable-product",
        slotFills: {
          "table.header": "table.header",
          "table.rows": "table.rows",
        },
      },
    ],
    metadataBindingId: "metadata-binding.datatable-product",
    surfaceTemplateId: "surface-template.product-table",
    templateClass: "table",
  },
] as const satisfies readonly SurfaceTemplateContractWire[];

export function getSurfaceTemplateById(
  surfaceTemplateId: string,
  registry: readonly SurfaceTemplateContractWire[] = SURFACE_TEMPLATE_REGISTRY
): SurfaceTemplateContractWire | undefined {
  return registry.find(
    (template) => template.surfaceTemplateId === surfaceTemplateId
  );
}

export function assertSurfaceTemplateMetadataBinding(
  template: SurfaceTemplateContractWire
): boolean {
  return template.metadataBindingId.trim().length > 0;
}

export function assertSurfaceTemplateBlockDataCoverage(
  template: SurfaceTemplateContractWire
): boolean {
  return template.blockBindings.every((binding) =>
    BLOCK_DATA_CONTRACT_REGISTRY.some(
      (contract) => contract.blockId === binding.blockId
    )
  );
}
