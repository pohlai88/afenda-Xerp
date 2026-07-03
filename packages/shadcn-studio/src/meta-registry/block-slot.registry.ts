/**
 * PAS-006B P06-003 — block slot registry for seeded MCP blocks.
 */

import type { BlockDataContractWire } from "../meta-contracts/block-data.contract.js";
import type { BlockSlotEntry } from "./block-slot.types.js";
import {
  type BlockSlotTemplate,
  resolveBlockSlotTemplate,
} from "./block-slot-template-families.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "./studio-block-parity.registry.js";

export type { BlockSlotEntry, BlockSlotRole } from "./block-slot.types.js";

const BLOCK_SLOT_TEMPLATES: Readonly<Record<string, BlockSlotTemplate>> = {
  "hero-section-01": {
    slots: [
      { slotId: "hero.title", role: "content", label: "Hero title" },
      { slotId: "hero.subtitle", role: "content", label: "Hero subtitle" },
      { slotId: "hero.cta", role: "form-action", label: "Primary CTA" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "hero.title",
          kind: "text",
          labelAtomRef: "atom.marketing.hero-title",
        },
        {
          fieldKey: "subtitle",
          slotId: "hero.subtitle",
          kind: "text",
          labelAtomRef: "atom.marketing.hero-subtitle",
        },
      ],
      actions: [
        {
          actionKey: "primary-cta",
          slotId: "hero.cta",
          kind: "navigate",
          labelAtomRef: "atom.marketing.hero-cta",
        },
      ],
    },
  },
  "statistics-card-01": {
    slots: [
      { slotId: "metric.label", role: "metric", label: "Metric label" },
      { slotId: "metric.value", role: "metric", label: "Metric value" },
      { slotId: "metric.change", role: "metric", label: "Metric change" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "label",
          slotId: "metric.label",
          kind: "readonly",
          labelAtomRef: "atom.analytics.metric-label",
        },
        {
          fieldKey: "value",
          slotId: "metric.value",
          kind: "number",
          labelAtomRef: "atom.analytics.metric-value",
        },
        {
          fieldKey: "change",
          slotId: "metric.change",
          kind: "readonly",
          labelAtomRef: "atom.analytics.metric-change",
        },
      ],
    },
  },
  "account-settings-01": {
    slots: [
      { slotId: "profile.avatar", role: "content", label: "Profile avatar" },
      {
        slotId: "profile.displayName",
        role: "form-field",
        label: "Display name",
      },
      {
        slotId: "profile.displayName.help",
        role: "form-field",
        label: "Display name help text",
      },
      { slotId: "profile.email", role: "form-field", label: "Email" },
      {
        slotId: "profile.email.help",
        role: "form-field",
        label: "Email help text",
      },
      { slotId: "profile.save", role: "form-action", label: "Save profile" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "displayName",
          slotId: "profile.displayName",
          kind: "text",
          labelAtomRef: "atom.user.display-name",
          requiredDisplay: true,
        },
        {
          fieldKey: "email",
          slotId: "profile.email",
          kind: "email",
          labelAtomRef: "atom.user.email",
          requiredDisplay: true,
        },
      ],
      actions: [
        {
          actionKey: "save",
          slotId: "profile.save",
          kind: "submit",
          labelAtomRef: "atom.actions.save",
        },
      ],
    },
  },
  "datatable-invoice": {
    slots: [
      { slotId: "table.header", role: "table", label: "Table header" },
      { slotId: "table.rows", role: "table", label: "Table rows" },
      { slotId: "table.actions", role: "form-action", label: "Row actions" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "invoiceNumber",
          slotId: "table.header",
          kind: "readonly",
          labelAtomRef: "atom.invoice.number",
        },
        {
          fieldKey: "amount",
          slotId: "table.rows",
          kind: "number",
          labelAtomRef: "atom.invoice.amount",
        },
      ],
      actions: [
        {
          actionKey: "view-row",
          slotId: "table.actions",
          kind: "navigate",
          labelAtomRef: "atom.actions.view",
        },
      ],
    },
  },
  "dialog-activity": {
    slots: [
      { slotId: "dialog.header", role: "dialog", label: "Dialog header" },
      { slotId: "dialog.body", role: "dialog", label: "Dialog body" },
      { slotId: "dialog.footer", role: "form-action", label: "Dialog footer" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "dialog.header",
          kind: "readonly",
          labelAtomRef: "atom.activity.title",
        },
        {
          fieldKey: "summary",
          slotId: "dialog.body",
          kind: "readonly",
          labelAtomRef: "atom.activity.summary",
        },
      ],
      actions: [
        {
          actionKey: "close",
          slotId: "dialog.footer",
          kind: "dialog",
          labelAtomRef: "atom.actions.close",
        },
      ],
    },
  },
  "login-page-04": {
    slots: [
      { slotId: "login-page-04.content", role: "content", label: "Page root" },
      { slotId: "login.branding", role: "content", label: "Branding panel" },
      {
        slotId: "login.branding.title",
        role: "content",
        label: "Branding title",
      },
      {
        slotId: "login.branding.lead",
        role: "content",
        label: "Branding lead",
      },
      {
        slotId: "login.form.title",
        role: "content",
        label: "Login form title",
      },
      {
        slotId: "login.form.subtitle",
        role: "content",
        label: "Login form subtitle",
      },
      { slotId: "login.email", role: "form-field", label: "Email" },
      { slotId: "login.password", role: "form-field", label: "Password" },
      {
        slotId: "login.password.help",
        role: "form-field",
        label: "Password help text",
      },
      { slotId: "login.submit", role: "form-action", label: "Sign in" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "brandingTitle",
          slotId: "login.branding.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.branding-title",
        },
        {
          fieldKey: "brandingLead",
          slotId: "login.branding.lead",
          kind: "readonly",
          labelAtomRef: "atom.auth.branding-lead",
        },
        {
          fieldKey: "formTitle",
          slotId: "login.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "login.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.form-subtitle",
        },
        {
          fieldKey: "email",
          slotId: "login.email",
          kind: "email",
          labelAtomRef: "atom.auth.email",
          requiredDisplay: true,
        },
        {
          fieldKey: "password",
          slotId: "login.password",
          kind: "password",
          labelAtomRef: "atom.auth.password",
          requiredDisplay: true,
        },
      ],
      actions: [
        {
          actionKey: "submit",
          slotId: "login.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "register-page-01": {
    slots: [
      {
        slotId: "register-page-01.content",
        role: "content",
        label: "Register page root",
      },
      {
        slotId: "register.branding",
        role: "content",
        label: "Register branding panel",
      },
      {
        slotId: "register.branding.eyebrow",
        role: "content",
        label: "Register eyebrow",
      },
      {
        slotId: "register.branding.title",
        role: "content",
        label: "Register branding title",
      },
      {
        slotId: "register.branding.lead",
        role: "content",
        label: "Register branding lead",
      },
      {
        slotId: "register.form.title",
        role: "content",
        label: "Register form title",
      },
      {
        slotId: "register.form.subtitle",
        role: "content",
        label: "Register form subtitle",
      },
      { slotId: "register.name", role: "form-field", label: "Full name" },
      { slotId: "register.email", role: "form-field", label: "Work email" },
      {
        slotId: "register.password",
        role: "form-field",
        label: "Password",
      },
      {
        slotId: "register.confirmPassword",
        role: "form-field",
        label: "Confirm password",
      },
      {
        slotId: "register.invitationCode",
        role: "form-field",
        label: "Invitation or workspace code",
      },
      {
        slotId: "register.submit",
        role: "form-action",
        label: "Create account",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "brandingEyebrow",
          slotId: "register.branding.eyebrow",
          kind: "readonly",
          labelAtomRef: "atom.auth.register-eyebrow",
        },
        {
          fieldKey: "brandingTitle",
          slotId: "register.branding.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.register-branding-title",
        },
        {
          fieldKey: "brandingLead",
          slotId: "register.branding.lead",
          kind: "readonly",
          labelAtomRef: "atom.auth.register-branding-lead",
        },
        {
          fieldKey: "formTitle",
          slotId: "register.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.register-form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "register.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.register-form-subtitle",
        },
        {
          fieldKey: "name",
          slotId: "register.name",
          kind: "text",
          labelAtomRef: "atom.auth.register-name",
          requiredDisplay: true,
        },
        {
          fieldKey: "email",
          slotId: "register.email",
          kind: "email",
          labelAtomRef: "atom.auth.register-email",
          requiredDisplay: true,
        },
        {
          fieldKey: "password",
          slotId: "register.password",
          kind: "password",
          labelAtomRef: "atom.auth.register-password",
          requiredDisplay: true,
        },
        {
          fieldKey: "confirmPassword",
          slotId: "register.confirmPassword",
          kind: "password",
          labelAtomRef: "atom.auth.register-confirm-password",
          requiredDisplay: true,
        },
        {
          fieldKey: "invitationCode",
          slotId: "register.invitationCode",
          kind: "text",
          labelAtomRef: "atom.auth.register-invitation-code",
        },
      ],
      actions: [
        {
          actionKey: "submit",
          slotId: "register.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.register-submit",
        },
      ],
    },
  },
  "forgot-password-page-01": {
    slots: [
      {
        slotId: "forgot-password-page-01.content",
        role: "content",
        label: "Forgot password page root",
      },
      {
        slotId: "forgot-password.form.title",
        role: "content",
        label: "Forgot password form title",
      },
      {
        slotId: "forgot-password.form.subtitle",
        role: "content",
        label: "Forgot password form subtitle",
      },
      {
        slotId: "forgot-password.email",
        role: "form-field",
        label: "Work email",
      },
      {
        slotId: "forgot-password.submit",
        role: "form-action",
        label: "Send reset link",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "formTitle",
          slotId: "forgot-password.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.forgot-password-form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "forgot-password.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.forgot-password-form-subtitle",
        },
        {
          fieldKey: "email",
          slotId: "forgot-password.email",
          kind: "email",
          labelAtomRef: "atom.auth.forgot-password-email",
          requiredDisplay: true,
        },
      ],
      actions: [
        {
          actionKey: "request-password-reset",
          slotId: "forgot-password.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.forgot-password-submit",
        },
      ],
    },
  },
  "forgot-password-success-page-01": {
    slots: [
      {
        slotId: "forgot-password-success-page-01.content",
        role: "content",
        label: "Forgot password success page root",
      },
      {
        slotId: "forgot-password-success.title",
        role: "content",
        label: "Forgot password success title",
      },
      {
        slotId: "forgot-password-success.message",
        role: "content",
        label: "Forgot password success message",
      },
      {
        slotId: "forgot-password-success.cta",
        role: "form-action",
        label: "Sign in",
      },
      {
        slotId: "forgot-password-success.back",
        role: "form-action",
        label: "Back to website",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "forgot-password-success.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.forgot-password-success-title",
        },
        {
          fieldKey: "message",
          slotId: "forgot-password-success.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.forgot-password-success-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "forgot-password-success.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
        {
          actionKey: "back-to-website",
          slotId: "forgot-password-success.back",
          kind: "navigate",
          labelAtomRef: "atom.auth.back-to-website",
        },
      ],
    },
  },
  "reset-password-page-01": {
    slots: [
      {
        slotId: "reset-password-page-01.content",
        role: "content",
        label: "Reset password page root",
      },
      {
        slotId: "reset-password.form.title",
        role: "content",
        label: "Reset password form title",
      },
      {
        slotId: "reset-password.form.subtitle",
        role: "content",
        label: "Reset password form subtitle",
      },
      {
        slotId: "reset-password.password",
        role: "form-field",
        label: "New password",
      },
      {
        slotId: "reset-password.confirmPassword",
        role: "form-field",
        label: "Confirm password",
      },
      {
        slotId: "reset-password.submit",
        role: "form-action",
        label: "Update password",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "formTitle",
          slotId: "reset-password.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.reset-password-form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "reset-password.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.reset-password-form-subtitle",
        },
        {
          fieldKey: "password",
          slotId: "reset-password.password",
          kind: "password",
          labelAtomRef: "atom.auth.reset-password",
          requiredDisplay: true,
        },
        {
          fieldKey: "confirmPassword",
          slotId: "reset-password.confirmPassword",
          kind: "password",
          labelAtomRef: "atom.auth.reset-password-confirm",
          requiredDisplay: true,
        },
      ],
      actions: [
        {
          actionKey: "reset-password",
          slotId: "reset-password.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.reset-password-submit",
        },
      ],
    },
  },
  "reset-password-success-page-01": {
    slots: [
      {
        slotId: "reset-password-success-page-01.content",
        role: "content",
        label: "Reset password success page root",
      },
      {
        slotId: "reset-password-success.title",
        role: "content",
        label: "Success title",
      },
      {
        slotId: "reset-password-success.message",
        role: "content",
        label: "Success message",
      },
      {
        slotId: "reset-password-success.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "reset-password-success.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.reset-password-success-title",
        },
        {
          fieldKey: "message",
          slotId: "reset-password-success.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.reset-password-success-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "reset-password-success.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "verify-email-page-01": {
    slots: [
      {
        slotId: "verify-email-page-01.content",
        role: "content",
        label: "Verify email page root",
      },
      {
        slotId: "verify-email.title",
        role: "content",
        label: "Verify email title",
      },
      {
        slotId: "verify-email.message",
        role: "content",
        label: "Verify email message",
      },
      {
        slotId: "verify-email.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "verify-email.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-title",
        },
        {
          fieldKey: "message",
          slotId: "verify-email.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "verify-email.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "verify-email-sent-page-01": {
    slots: [
      {
        slotId: "verify-email-sent-page-01.content",
        role: "content",
        label: "Verify email sent page root",
      },
      {
        slotId: "verify-email-sent.title",
        role: "content",
        label: "Verify email sent title",
      },
      {
        slotId: "verify-email-sent.message",
        role: "content",
        label: "Verify email sent message",
      },
      {
        slotId: "verify-email-sent.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "verify-email-sent.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-sent-title",
        },
        {
          fieldKey: "message",
          slotId: "verify-email-sent.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-sent-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "verify-email-sent.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "verify-email-expired-page-01": {
    slots: [
      {
        slotId: "verify-email-expired-page-01.content",
        role: "content",
        label: "Verify email expired page root",
      },
      {
        slotId: "verify-email-expired.title",
        role: "content",
        label: "Verify email expired title",
      },
      {
        slotId: "verify-email-expired.message",
        role: "content",
        label: "Verify email expired message",
      },
      {
        slotId: "verify-email-expired.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "verify-email-expired.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-expired-title",
        },
        {
          fieldKey: "message",
          slotId: "verify-email-expired.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-expired-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "verify-email-expired.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "verify-email-success-page-01": {
    slots: [
      {
        slotId: "verify-email-success-page-01.content",
        role: "content",
        label: "Verify email success page root",
      },
      {
        slotId: "verify-email-success.title",
        role: "content",
        label: "Verify email success title",
      },
      {
        slotId: "verify-email-success.message",
        role: "content",
        label: "Verify email success message",
      },
      {
        slotId: "verify-email-success.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "verify-email-success.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-success-title",
        },
        {
          fieldKey: "message",
          slotId: "verify-email-success.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.verify-email-success-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "verify-email-success.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "invite-page-01": {
    slots: [
      {
        slotId: "invite-page-01.content",
        role: "content",
        label: "Invite page root",
      },
      { slotId: "invite.title", role: "content", label: "Invite title" },
      { slotId: "invite.message", role: "content", label: "Invite message" },
      { slotId: "invite.cta", role: "form-action", label: "Sign in" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "invite.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-title",
        },
        {
          fieldKey: "message",
          slotId: "invite.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "invite.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "invite-accept-page-01": {
    slots: [
      {
        slotId: "invite-accept-page-01.content",
        role: "content",
        label: "Invite accept page root",
      },
      {
        slotId: "invite-accept.form.title",
        role: "content",
        label: "Invite accept form title",
      },
      {
        slotId: "invite-accept.form.subtitle",
        role: "content",
        label: "Invite accept form subtitle",
      },
      { slotId: "invite-accept.name", role: "form-field", label: "Full name" },
      {
        slotId: "invite-accept.email",
        role: "form-field",
        label: "Work email",
      },
      {
        slotId: "invite-accept.password",
        role: "form-field",
        label: "Password",
      },
      {
        slotId: "invite-accept.confirmPassword",
        role: "form-field",
        label: "Confirm password",
      },
      {
        slotId: "invite-accept.invitationCode",
        role: "form-field",
        label: "Invitation code",
      },
      {
        slotId: "invite-accept.submit",
        role: "form-action",
        label: "Accept invitation",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "formTitle",
          slotId: "invite-accept.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-accept-form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "invite-accept.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-accept-form-subtitle",
        },
        {
          fieldKey: "name",
          slotId: "invite-accept.name",
          kind: "text",
          labelAtomRef: "atom.auth.register-name",
          requiredDisplay: true,
        },
        {
          fieldKey: "email",
          slotId: "invite-accept.email",
          kind: "email",
          labelAtomRef: "atom.auth.register-email",
          requiredDisplay: true,
        },
        {
          fieldKey: "password",
          slotId: "invite-accept.password",
          kind: "password",
          labelAtomRef: "atom.auth.register-password",
          requiredDisplay: true,
        },
        {
          fieldKey: "confirmPassword",
          slotId: "invite-accept.confirmPassword",
          kind: "password",
          labelAtomRef: "atom.auth.register-confirm-password",
          requiredDisplay: true,
        },
        {
          fieldKey: "invitationCode",
          slotId: "invite-accept.invitationCode",
          kind: "text",
          labelAtomRef: "atom.auth.register-invitation-code",
        },
      ],
      actions: [
        {
          actionKey: "accept-invitation",
          slotId: "invite-accept.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.invite-accept-submit",
        },
      ],
    },
  },
  "invite-expired-page-01": {
    slots: [
      {
        slotId: "invite-expired-page-01.content",
        role: "content",
        label: "Invite expired page root",
      },
      {
        slotId: "invite-expired.title",
        role: "content",
        label: "Invite expired title",
      },
      {
        slotId: "invite-expired.message",
        role: "content",
        label: "Invite expired message",
      },
      {
        slotId: "invite-expired.cta",
        role: "form-action",
        label: "Sign in",
      },
      {
        slotId: "invite-expired.back",
        role: "form-action",
        label: "Back to website",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "invite-expired.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-expired-title",
        },
        {
          fieldKey: "message",
          slotId: "invite-expired.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-expired-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "invite-expired.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
        {
          actionKey: "back-to-website",
          slotId: "invite-expired.back",
          kind: "navigate",
          labelAtomRef: "atom.auth.back-to-website",
        },
      ],
    },
  },
  "invite-invalid-page-01": {
    slots: [
      {
        slotId: "invite-invalid-page-01.content",
        role: "content",
        label: "Invite invalid page root",
      },
      {
        slotId: "invite-invalid.title",
        role: "content",
        label: "Invite invalid title",
      },
      {
        slotId: "invite-invalid.message",
        role: "content",
        label: "Invite invalid message",
      },
      {
        slotId: "invite-invalid.cta",
        role: "form-action",
        label: "Sign in",
      },
      {
        slotId: "invite-invalid.back",
        role: "form-action",
        label: "Back to website",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "invite-invalid.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-invalid-title",
        },
        {
          fieldKey: "message",
          slotId: "invite-invalid.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-invalid-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "invite-invalid.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
        {
          actionKey: "back-to-website",
          slotId: "invite-invalid.back",
          kind: "navigate",
          labelAtomRef: "atom.auth.back-to-website",
        },
      ],
    },
  },
  "invite-consumed-page-01": {
    slots: [
      {
        slotId: "invite-consumed-page-01.content",
        role: "content",
        label: "Invite consumed page root",
      },
      {
        slotId: "invite-consumed.title",
        role: "content",
        label: "Invite consumed title",
      },
      {
        slotId: "invite-consumed.message",
        role: "content",
        label: "Invite consumed message",
      },
      {
        slotId: "invite-consumed.cta",
        role: "form-action",
        label: "Sign in",
      },
      {
        slotId: "invite-consumed.back",
        role: "form-action",
        label: "Back to website",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "invite-consumed.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-consumed-title",
        },
        {
          fieldKey: "message",
          slotId: "invite-consumed.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-consumed-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "invite-consumed.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
        {
          actionKey: "back-to-website",
          slotId: "invite-consumed.back",
          kind: "navigate",
          labelAtomRef: "atom.auth.back-to-website",
        },
      ],
    },
  },
  "invite-email-mismatch-page-01": {
    slots: [
      {
        slotId: "invite-email-mismatch-page-01.content",
        role: "content",
        label: "Invite email mismatch page root",
      },
      {
        slotId: "invite-email-mismatch.title",
        role: "content",
        label: "Invite email mismatch title",
      },
      {
        slotId: "invite-email-mismatch.message",
        role: "content",
        label: "Invite email mismatch message",
      },
      {
        slotId: "invite-email-mismatch.cta",
        role: "form-action",
        label: "Sign in",
      },
      {
        slotId: "invite-email-mismatch.back",
        role: "form-action",
        label: "Back to website",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "invite-email-mismatch.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-email-mismatch-title",
        },
        {
          fieldKey: "message",
          slotId: "invite-email-mismatch.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.invite-email-mismatch-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "invite-email-mismatch.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
        {
          actionKey: "back-to-website",
          slotId: "invite-email-mismatch.back",
          kind: "navigate",
          labelAtomRef: "atom.auth.back-to-website",
        },
      ],
    },
  },
  "passkey-page-01": {
    slots: [
      {
        slotId: "passkey-page-01.content",
        role: "content",
        label: "Passkey page root",
      },
      { slotId: "passkey.title", role: "content", label: "Passkey title" },
      {
        slotId: "passkey.message",
        role: "content",
        label: "Passkey message",
      },
      { slotId: "passkey.cta", role: "form-action", label: "Use passkey" },
      {
        slotId: "passkey.fallback",
        role: "form-action",
        label: "Sign in fallback",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "passkey.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.passkey-title",
        },
        {
          fieldKey: "message",
          slotId: "passkey.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.passkey-message",
        },
      ],
      actions: [
        {
          actionKey: "start-passkey",
          slotId: "passkey.cta",
          kind: "submit",
          labelAtomRef: "atom.auth.passkey-submit",
        },
        {
          actionKey: "sign-in",
          slotId: "passkey.fallback",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "error-passkey-page-01": {
    slots: [
      {
        slotId: "error-passkey-page-01.content",
        role: "content",
        label: "Passkey error page root",
      },
      {
        slotId: "error-passkey.title",
        role: "content",
        label: "Passkey error title",
      },
      {
        slotId: "error-passkey.message",
        role: "content",
        label: "Passkey error message",
      },
      {
        slotId: "error-passkey.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "error-passkey.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-passkey-title",
        },
        {
          fieldKey: "message",
          slotId: "error-passkey.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-passkey-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "error-passkey.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "sso-page-01": {
    slots: [
      {
        slotId: "sso-page-01.content",
        role: "content",
        label: "SSO page root",
      },
      { slotId: "sso.title", role: "content", label: "SSO title" },
      { slotId: "sso.message", role: "content", label: "SSO message" },
      { slotId: "sso.cta", role: "form-action", label: "Continue with SSO" },
      {
        slotId: "sso.fallback",
        role: "form-action",
        label: "Sign in fallback",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "sso.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.sso-title",
        },
        {
          fieldKey: "message",
          slotId: "sso.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.sso-message",
        },
      ],
      actions: [
        {
          actionKey: "start-sso",
          slotId: "sso.cta",
          kind: "submit",
          labelAtomRef: "atom.auth.sso-submit",
        },
        {
          actionKey: "sign-in",
          slotId: "sso.fallback",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "error-sso-page-01": {
    slots: [
      {
        slotId: "error-sso-page-01.content",
        role: "content",
        label: "SSO error page root",
      },
      { slotId: "error-sso.title", role: "content", label: "SSO error title" },
      {
        slotId: "error-sso.message",
        role: "content",
        label: "SSO error message",
      },
      { slotId: "error-sso.cta", role: "form-action", label: "Sign in" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "error-sso.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-sso-title",
        },
        {
          fieldKey: "message",
          slotId: "error-sso.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-sso-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "error-sso.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "error-oauth-page-01": {
    slots: [
      {
        slotId: "error-oauth-page-01.content",
        role: "content",
        label: "OAuth error page root",
      },
      {
        slotId: "error-oauth.title",
        role: "content",
        label: "OAuth error title",
      },
      {
        slotId: "error-oauth.message",
        role: "content",
        label: "OAuth error message",
      },
      { slotId: "error-oauth.cta", role: "form-action", label: "Sign in" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "error-oauth.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-oauth-title",
        },
        {
          fieldKey: "message",
          slotId: "error-oauth.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-oauth-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "error-oauth.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "otp-page-01": {
    slots: [
      {
        slotId: "otp-page-01.content",
        role: "content",
        label: "OTP page root",
      },
      { slotId: "otp.form.title", role: "content", label: "OTP form title" },
      {
        slotId: "otp.form.subtitle",
        role: "content",
        label: "OTP form subtitle",
      },
      { slotId: "otp.code", role: "form-field", label: "Verification code" },
      { slotId: "otp.submit", role: "form-action", label: "Continue" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "formTitle",
          slotId: "otp.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.otp-form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "otp.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.otp-form-subtitle",
        },
        {
          fieldKey: "code",
          slotId: "otp.code",
          kind: "text",
          labelAtomRef: "atom.auth.otp-code",
          requiredDisplay: true,
        },
      ],
      actions: [
        {
          actionKey: "submit-otp",
          slotId: "otp.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.otp-submit",
        },
      ],
    },
  },
  "mfa-page-01": {
    slots: [
      {
        slotId: "mfa-page-01.content",
        role: "content",
        label: "MFA page root",
      },
      { slotId: "mfa.form.title", role: "content", label: "MFA form title" },
      {
        slotId: "mfa.form.subtitle",
        role: "content",
        label: "MFA form subtitle",
      },
      { slotId: "mfa.code", role: "form-field", label: "Verification code" },
      { slotId: "mfa.submit", role: "form-action", label: "Verify code" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "formTitle",
          slotId: "mfa.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.mfa-form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "mfa.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.mfa-form-subtitle",
        },
        {
          fieldKey: "code",
          slotId: "mfa.code",
          kind: "text",
          labelAtomRef: "atom.auth.mfa-code",
          requiredDisplay: true,
        },
      ],
      actions: [
        {
          actionKey: "submit-mfa-otp",
          slotId: "mfa.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.mfa-submit",
        },
      ],
    },
  },
  "mfa-recovery-page-01": {
    slots: [
      {
        slotId: "mfa-recovery-page-01.content",
        role: "content",
        label: "MFA recovery page root",
      },
      {
        slotId: "mfa-recovery.form.title",
        role: "content",
        label: "MFA recovery form title",
      },
      {
        slotId: "mfa-recovery.form.subtitle",
        role: "content",
        label: "MFA recovery form subtitle",
      },
      {
        slotId: "mfa-recovery.code",
        role: "form-field",
        label: "Recovery code",
      },
      {
        slotId: "mfa-recovery.submit",
        role: "form-action",
        label: "Use recovery code",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "formTitle",
          slotId: "mfa-recovery.form.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.mfa-recovery-form-title",
        },
        {
          fieldKey: "formSubtitle",
          slotId: "mfa-recovery.form.subtitle",
          kind: "readonly",
          labelAtomRef: "atom.auth.mfa-recovery-form-subtitle",
        },
        {
          fieldKey: "recoveryCode",
          slotId: "mfa-recovery.code",
          kind: "text",
          labelAtomRef: "atom.auth.mfa-recovery-code",
          requiredDisplay: true,
        },
      ],
      actions: [
        {
          actionKey: "submit-mfa-recovery",
          slotId: "mfa-recovery.submit",
          kind: "submit",
          labelAtomRef: "atom.auth.mfa-recovery-submit",
        },
      ],
    },
  },
  "error-session-expired-page-01": {
    slots: [
      {
        slotId: "error-session-expired-page-01.content",
        role: "content",
        label: "Session expired page root",
      },
      {
        slotId: "error-session-expired.title",
        role: "content",
        label: "Session expired title",
      },
      {
        slotId: "error-session-expired.message",
        role: "content",
        label: "Session expired message",
      },
      {
        slotId: "error-session-expired.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "error-session-expired.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-session-expired-title",
        },
        {
          fieldKey: "message",
          slotId: "error-session-expired.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-session-expired-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "error-session-expired.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "error-access-denied-page-01": {
    slots: [
      {
        slotId: "error-access-denied-page-01.content",
        role: "content",
        label: "Access denied page root",
      },
      {
        slotId: "error-access-denied.title",
        role: "content",
        label: "Access denied title",
      },
      {
        slotId: "error-access-denied.message",
        role: "content",
        label: "Access denied message",
      },
      {
        slotId: "error-access-denied.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "error-access-denied.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-access-denied-title",
        },
        {
          fieldKey: "message",
          slotId: "error-access-denied.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-access-denied-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "error-access-denied.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "security-review-page-01": {
    slots: [
      {
        slotId: "security-review-page-01.content",
        role: "content",
        label: "Security review page root",
      },
      {
        slotId: "security-review.title",
        role: "content",
        label: "Security review title",
      },
      {
        slotId: "security-review.message",
        role: "content",
        label: "Security review message",
      },
      {
        slotId: "security-review.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "security-review.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.security-review-title",
        },
        {
          fieldKey: "message",
          slotId: "security-review.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.security-review-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "security-review.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
  "error-authentication-page-01": {
    slots: [
      {
        slotId: "error-authentication-page-01.content",
        role: "content",
        label: "Auth error page root",
      },
      {
        slotId: "error-authentication.title",
        role: "content",
        label: "Auth error title",
      },
      {
        slotId: "error-authentication.message",
        role: "content",
        label: "Auth error message",
      },
      {
        slotId: "error-authentication.cta",
        role: "form-action",
        label: "Sign in",
      },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "error-authentication.title",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-title",
        },
        {
          fieldKey: "message",
          slotId: "error-authentication.message",
          kind: "readonly",
          labelAtomRef: "atom.auth.error-message",
        },
      ],
      actions: [
        {
          actionKey: "sign-in",
          slotId: "error-authentication.cta",
          kind: "navigate",
          labelAtomRef: "atom.auth.sign-in",
        },
      ],
    },
  },
};

/** Blocks with explicit slot templates — governed by block contract lane. */
export const METADATA_BOUND_BLOCK_TEMPLATE_IDS = [
  "hero-section-01",
  "statistics-card-01",
  "account-settings-01",
  "dialog-activity",
  "error-page-shell",
  "login-page-04",
  "register-page-01",
  "forgot-password-page-01",
  "forgot-password-success-page-01",
  "reset-password-page-01",
  "reset-password-success-page-01",
  "verify-email-page-01",
  "verify-email-sent-page-01",
  "verify-email-expired-page-01",
  "verify-email-success-page-01",
  "invite-page-01",
  "invite-accept-page-01",
  "invite-expired-page-01",
  "invite-invalid-page-01",
  "invite-consumed-page-01",
  "invite-email-mismatch-page-01",
  "passkey-page-01",
  "error-passkey-page-01",
  "sso-page-01",
  "error-sso-page-01",
  "error-oauth-page-01",
  "otp-page-01",
  "mfa-page-01",
  "mfa-recovery-page-01",
  "error-session-expired-page-01",
  "error-access-denied-page-01",
  "security-review-page-01",
  "error-authentication-page-01",
] as const;

/** MCP datatable blocks resolved via DATATABLE_SLOT_TEMPLATE family rule. */
export const DATATABLE_BLOCK_CONTRACT_IDS = [
  "datatable-invoice",
  "datatable-user",
  "datatable-product",
] as const;

/** Full block contract gate surface (explicit templates + datatable family). */
export const GOVERNED_BLOCK_CONTRACT_IDS = [
  ...METADATA_BOUND_BLOCK_TEMPLATE_IDS,
  ...DATATABLE_BLOCK_CONTRACT_IDS,
] as const;

export type MetadataBoundBlockTemplateId =
  (typeof METADATA_BOUND_BLOCK_TEMPLATE_IDS)[number];

export type DatatableBlockContractId =
  (typeof DATATABLE_BLOCK_CONTRACT_IDS)[number];

export type GovernedBlockContractId =
  (typeof GOVERNED_BLOCK_CONTRACT_IDS)[number];

function buildBlockSlotRegistry(): readonly BlockSlotEntry[] {
  return SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.flatMap((parity) => {
    const template = resolveBlockSlotTemplate(
      parity.mcpBlockId,
      BLOCK_SLOT_TEMPLATES
    );

    if (template === undefined) {
      return [
        {
          slotId: `${parity.mcpBlockId}.content`,
          blockId: parity.mcpBlockId,
          role: "content",
          label: "Default content slot",
        },
      ] satisfies BlockSlotEntry[];
    }

    return template.slots.map(
      (slot) =>
        ({
          ...slot,
          blockId: parity.mcpBlockId,
        }) satisfies BlockSlotEntry
    );
  });
}

function buildBlockDataContractRegistry(): readonly BlockDataContractWire[] {
  return SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.flatMap((parity) => {
    const template = resolveBlockSlotTemplate(
      parity.mcpBlockId,
      BLOCK_SLOT_TEMPLATES
    );

    if (template === undefined) {
      return [
        {
          blockDataContractId: `block-data-contract:${parity.mcpBlockId}`,
          blockId: parity.mcpBlockId,
          fields: [
            {
              fieldKey: "content",
              slotId: `${parity.mcpBlockId}.content`,
              kind: "readonly",
              labelAtomRef: `atom.presentation.${parity.mcpBlockId}.content`,
            },
          ],
        } satisfies BlockDataContractWire,
      ];
    }

    return [
      {
        blockDataContractId: `block-data-contract:${parity.mcpBlockId}`,
        blockId: parity.mcpBlockId,
        fields: template.contract.fields,
        ...(template.contract.actions === undefined
          ? {}
          : { actions: template.contract.actions }),
      } satisfies BlockDataContractWire,
    ];
  });
}

export const BLOCK_SLOT_REGISTRY = buildBlockSlotRegistry();

export const BLOCK_DATA_CONTRACT_REGISTRY = buildBlockDataContractRegistry();

export function getBlockSlotsForBlockId(
  blockId: string,
  registry: readonly BlockSlotEntry[] = BLOCK_SLOT_REGISTRY
): readonly BlockSlotEntry[] {
  return registry.filter((entry) => entry.blockId === blockId);
}

export function getBlockDataContractForBlockId(
  blockId: string,
  registry: readonly BlockDataContractWire[] = BLOCK_DATA_CONTRACT_REGISTRY
): BlockDataContractWire | undefined {
  return registry.find((entry) => entry.blockId === blockId);
}
