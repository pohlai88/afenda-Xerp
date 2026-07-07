"use client";

import {
  Button,
  Field,
  FieldControl,
  FieldLabel,
  Input,
} from "@afenda/shadcn-studio-v2/clients";

import { getAuthBlockSlotsForBlockId } from "@/lib/auth/auth-block-slot.registry";

interface AuthBlockFormPreviewProps {
  readonly blockId: string;
}

function renderLoginForm() {
  return (
    <form className="flex flex-col gap-4" id="login-form-v1">
      <p
        className="font-medium text-sm"
        data-afenda-slot="login.branding.title"
      >
        Afenda ERP
      </p>
      <p
        className="text-muted-foreground text-sm"
        data-afenda-slot="login.form.title"
      >
        Sign in with your workspace credentials
      </p>
      <Field>
        <FieldLabel data-afenda-slot="login.email" htmlFor="login-email">
          Email
        </FieldLabel>
        <FieldControl>
          <Input
            autoComplete="email"
            id="login-email"
            name="email"
            type="email"
          />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel data-afenda-slot="login.password" htmlFor="login-password">
          Password
        </FieldLabel>
        <FieldControl>
          <Input
            autoComplete="current-password"
            id="login-password"
            name="password"
            type="password"
          />
        </FieldControl>
      </Field>
      <Button data-afenda-slot="login.submit" type="submit">
        Sign in
      </Button>
    </form>
  );
}

function renderRegisterForm() {
  return (
    <form className="flex flex-col gap-4" id="register-form-v1">
      <p
        className="font-medium text-sm"
        data-afenda-slot="invite-accept.form.title"
      >
        Create your account
      </p>
      <Field>
        <FieldLabel
          data-afenda-slot="invite-accept.email"
          htmlFor="register-email"
        >
          Email
        </FieldLabel>
        <FieldControl>
          <Input
            autoComplete="email"
            id="register-email"
            name="email"
            type="email"
          />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel
          data-afenda-slot="invite-accept.password"
          htmlFor="register-password"
        >
          Password
        </FieldLabel>
        <FieldControl>
          <Input
            autoComplete="new-password"
            id="register-password"
            name="password"
            type="password"
          />
        </FieldControl>
      </Field>
      <input name="invitationToken" type="hidden" />
      <Button data-afenda-slot="invite-accept.submit" type="submit">
        Create account
      </Button>
    </form>
  );
}

function renderForgotPasswordForm() {
  return (
    <form className="flex flex-col gap-4" id="forgot-password-form-v1">
      <Field>
        <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
        <FieldControl>
          <Input
            autoComplete="email"
            id="forgot-password-email"
            name="email"
            type="email"
          />
        </FieldControl>
      </Field>
      <Button type="submit">Send reset link</Button>
    </form>
  );
}

function renderResetPasswordForm() {
  return (
    <form className="flex flex-col gap-4" id="reset-password-form-v1">
      <Field>
        <FieldLabel htmlFor="reset-password-new">New password</FieldLabel>
        <FieldControl>
          <Input
            autoComplete="new-password"
            id="reset-password-new"
            name="newPassword"
            type="password"
          />
        </FieldControl>
      </Field>
      <input name="token" type="hidden" />
      <Button type="submit">Update password</Button>
    </form>
  );
}

function renderOtpForm(formId: string, slotPrefix: "otp" | "mfa") {
  return (
    <form className="flex flex-col gap-4" id={formId}>
      <p
        className="font-medium text-sm"
        data-afenda-slot={`${slotPrefix}.form.title`}
      >
        Enter verification code
      </p>
      <Field>
        <FieldLabel
          data-afenda-slot={`${slotPrefix}.code`}
          htmlFor={`${formId}-code`}
        >
          Code
        </FieldLabel>
        <FieldControl>
          <Input
            autoComplete="one-time-code"
            id={`${formId}-code`}
            inputMode="numeric"
            name="code"
          />
        </FieldControl>
      </Field>
      <Button data-afenda-slot={`${slotPrefix}.submit`} type="submit">
        Verify
      </Button>
    </form>
  );
}

function renderMfaRecoveryForm() {
  return (
    <form className="flex flex-col gap-4" id="mfa-recovery-form-v1">
      <p
        className="font-medium text-sm"
        data-afenda-slot="mfa-recovery.form.title"
      >
        Enter recovery code
      </p>
      <Field>
        <FieldLabel
          data-afenda-slot="mfa-recovery.code"
          htmlFor="mfa-recovery-code"
        >
          Recovery code
        </FieldLabel>
        <FieldControl>
          <Input id="mfa-recovery-code" name="recoveryCode" />
        </FieldControl>
      </Field>
      <Button data-afenda-slot="mfa-recovery.submit" type="submit">
        Verify recovery code
      </Button>
    </form>
  );
}

function renderMessageBlock(slots: readonly { readonly slotId: string }[]) {
  const titleSlot = slots.find((slot) => slot.slotId.endsWith(".title"));
  const messageSlot = slots.find((slot) => slot.slotId.endsWith(".message"));
  const ctaSlot = slots.find((slot) => slot.slotId.endsWith(".cta"));

  return (
    <div className="flex flex-col gap-4">
      {titleSlot === undefined ? null : (
        <p className="font-medium text-sm" data-afenda-slot={titleSlot.slotId}>
          Status title
        </p>
      )}
      {messageSlot === undefined ? null : (
        <p
          className="text-muted-foreground text-sm"
          data-afenda-slot={messageSlot.slotId}
        >
          Status message
        </p>
      )}
      {ctaSlot === undefined ? null : (
        <Button data-afenda-slot={ctaSlot.slotId} type="button">
          Continue
        </Button>
      )}
    </div>
  );
}

const FORM_RENDERERS: Record<string, () => React.JSX.Element> = {
  "forgot-password-page-01": renderForgotPasswordForm,
  "invite-accept-page-01": renderRegisterForm,
  "login-page-04": renderLoginForm,
  "mfa-page-01": () => renderOtpForm("mfa-otp-form-v1", "mfa"),
  "mfa-recovery-page-01": renderMfaRecoveryForm,
  "otp-page-01": () => renderOtpForm("mfa-otp-form-v1", "otp"),
  "register-page-01": renderRegisterForm,
  "reset-password-page-01": renderResetPasswordForm,
};

/** Renders auth block form DOM with WCAG slot markers for runtime bridge attachment. */
export function AuthBlockFormPreview({ blockId }: AuthBlockFormPreviewProps) {
  const renderer = FORM_RENDERERS[blockId];

  if (renderer !== undefined) {
    return renderer();
  }

  const slots = getAuthBlockSlotsForBlockId(blockId);

  if (slots.length > 0) {
    return renderMessageBlock(slots);
  }

  return (
    <p
      className="text-muted-foreground text-sm"
      data-afenda-slot={`${blockId}.content`}
    >
      Auth block preview
    </p>
  );
}
