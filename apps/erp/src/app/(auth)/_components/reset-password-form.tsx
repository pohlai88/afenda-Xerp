"use client";

import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  AUTH_FORM_SIGN_IN_LINK,
  RESET_PASSWORD_CONFIRM_HINT,
  RESET_PASSWORD_INVALID_LINK_HINT,
  RESET_PASSWORD_MISSING_TOKEN_HINT,
  RESET_PASSWORD_REQUEST_LEAD,
  RESET_PASSWORD_REQUIREMENTS_HINT,
} from "@/app/(auth)/_components/auth-form.copy";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { resolvePasswordResetSuccessRedirect } from "@/lib/auth/auth-redirect.policy";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import { submitPasswordReset } from "@/lib/auth/submit-password-reset.client";

export type ResetPasswordFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

function ResetPasswordLinkProblemState({
  hint,
  lead,
}: {
  readonly hint: string;
  readonly lead: string;
}) {
  return (
    <AuthForm.Root>
      <AuthForm.BackToSignIn />

      <AuthForm.NoticeCaution hints={[hint]} lead={lead} />

      <AuthForm.Alternates>
        <AuthForm.AlternateLabel>Need a fresh link?</AuthForm.AlternateLabel>
        <AuthForm.AlternateNotice>
          <Link
            className="erp-auth-form__link"
            href={buildAuthPath("forgotPassword")}
          >
            Request a new reset link
          </Link>
        </AuthForm.AlternateNotice>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={AUTH_FORM_SIGN_IN_LINK}>
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (token.length === 0) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const result = await submitPasswordReset({
      newPassword: password,
      token,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "passwordResetFailed"));
      return;
    }

    router.replace(resolvePasswordResetSuccessRedirect());
    router.refresh();
  }

  if (resetError === "INVALID_TOKEN") {
    return (
      <ResetPasswordLinkProblemState
        hint={RESET_PASSWORD_INVALID_LINK_HINT}
        lead="This reset link is invalid or has expired."
      />
    );
  }

  if (token.length === 0) {
    return (
      <ResetPasswordLinkProblemState
        hint={RESET_PASSWORD_MISSING_TOKEN_HINT}
        lead="This reset link is missing a token."
      />
    );
  }

  return (
    <AuthForm.Root>
      <AuthForm.BackToSignIn />

      <AuthForm.StepLead>{RESET_PASSWORD_REQUEST_LEAD}</AuthForm.StepLead>

      {error ? <AuthForm.FieldError>{error}</AuthForm.FieldError> : null}

      <AuthForm.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-form__field">
          <Label htmlFor="reset-password">New password</Label>
          <Input
            autoComplete="new-password"
            id="reset-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            required
            type="password"
            value={password}
          />
          <p className="erp-auth-form__field-hint">
            {RESET_PASSWORD_REQUIREMENTS_HINT}
          </p>
        </div>
        <div className="erp-auth-form__field">
          <Label htmlFor="reset-password-confirm">Confirm password</Label>
          <Input
            autoComplete="new-password"
            id="reset-password-confirm"
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your new password"
            required
            type="password"
            value={confirmPassword}
          />
          <p className="erp-auth-form__field-hint">
            {RESET_PASSWORD_CONFIRM_HINT}
          </p>
        </div>
        <div className="erp-auth-form__submit-row">
          <Button
            disabled={isSubmitting}
            emphasis="solid"
            intent="primary"
            presentation="default"
            size="md"
            type="submit"
          >
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </div>
      </AuthForm.Fields>

      <AuthForm.Alternates>
        <AuthForm.AlternateLabel>
          Link expired or not working?
        </AuthForm.AlternateLabel>
        <AuthForm.AlternateNotice>
          <Link
            className="erp-auth-form__link"
            href={buildAuthPath("forgotPassword")}
          >
            Request a new reset link
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}
