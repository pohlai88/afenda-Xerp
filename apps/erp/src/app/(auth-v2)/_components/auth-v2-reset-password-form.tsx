"use client";

import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  AUTH_V2_FORM_SIGN_IN_LINK,
  RESET_PASSWORD_CONFIRM_HINT,
  RESET_PASSWORD_INVALID_LINK_HINT,
  RESET_PASSWORD_MISSING_TOKEN_HINT,
  RESET_PASSWORD_REQUEST_LEAD,
  RESET_PASSWORD_REQUIREMENTS_HINT,
} from "@/app/(auth-v2)/_components/auth-v2-form.copy";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import { submitPasswordReset } from "@/lib/auth/submit-password-reset.client";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";
import { resolveAuthV2PasswordResetSuccessRedirect } from "@/lib/auth-v2/auth-v2-redirect.policy";

export type AuthV2ResetPasswordFormGovernedComponents = Extract<
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
    <AuthV2Form.Root>
      <AuthV2Form.BackToSignIn />

      <AuthV2Form.NoticeCaution hints={[hint]} lead={lead} />

      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateLabel>
          Need a fresh link?
        </AuthV2Form.AlternateLabel>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("forgotPassword")}
          >
            Request a new reset link
          </Link>
        </AuthV2Form.AlternateNotice>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={AUTH_V2_FORM_SIGN_IN_LINK}
          >
            Return to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2ResetPasswordForm() {
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

    router.replace(resolveAuthV2PasswordResetSuccessRedirect());
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
    <AuthV2Form.Root>
      <AuthV2Form.BackToSignIn />

      <AuthV2Form.StepLead>{RESET_PASSWORD_REQUEST_LEAD}</AuthV2Form.StepLead>

      {error ? <AuthV2Form.FieldError>{error}</AuthV2Form.FieldError> : null}

      <AuthV2Form.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-reset-password">New password</Label>
          <Input
            autoComplete="new-password"
            id="auth-v2-reset-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            required
            type="password"
            value={password}
          />
          <p className="erp-auth-v2-form__field-hint">
            {RESET_PASSWORD_REQUIREMENTS_HINT}
          </p>
        </div>
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-reset-password-confirm">
            Confirm password
          </Label>
          <Input
            autoComplete="new-password"
            id="auth-v2-reset-password-confirm"
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your new password"
            required
            type="password"
            value={confirmPassword}
          />
          <p className="erp-auth-v2-form__field-hint">
            {RESET_PASSWORD_CONFIRM_HINT}
          </p>
        </div>
        <div className="erp-auth-v2-form__submit-row">
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
      </AuthV2Form.Fields>

      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateLabel>
          Link expired or not working?
        </AuthV2Form.AlternateLabel>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("forgotPassword")}
          >
            Request a new reset link
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}
