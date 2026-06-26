"use client";

import {
  Button,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Spinner,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  RESET_PASSWORD_CONFIRM_HINT,
  RESET_PASSWORD_INVALID_LINK_HINT,
  RESET_PASSWORD_MISSING_TOKEN_HINT,
  RESET_PASSWORD_REQUEST_LEAD,
  RESET_PASSWORD_REQUIREMENTS_HINT,
} from "@/lib/auth/auth-copy.registry";
import {
  AUTH_FORM_SIGN_IN_LINK,
  buildAuthPath,
} from "@/lib/auth/auth-path.registry";
import { resolvePasswordResetSuccessRedirect } from "@/lib/auth/auth-redirect.policy";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import { submitPasswordReset } from "@/lib/auth/submit-password-reset.client";

export type AuthResetPasswordFormGovernedComponents = Extract<
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

export function AuthResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    startTransition(async () => {
      const result = await submitPasswordReset({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(
          mapAuthClientError(result.error.message, "passwordResetFailed")
        );
        return;
      }

      router.replace(resolvePasswordResetSuccessRedirect());
      router.refresh();
    });
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

      <AuthForm.Fields onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="auth-reset-password">New password</FieldLabel>
          <Input
            aria-describedby={error ? "auth-reset-password-error" : undefined}
            aria-invalid={!!error}
            autoComplete="new-password"
            id="auth-reset-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            required
            type="password"
            value={password}
          />
          {error ? (
            <FieldError id="auth-reset-password-error">{error}</FieldError>
          ) : null}
          <AuthForm.FieldHint>
            {RESET_PASSWORD_REQUIREMENTS_HINT}
          </AuthForm.FieldHint>
        </Field>
        <Field>
          <FieldLabel htmlFor="auth-reset-password-confirm">
            Confirm password
          </FieldLabel>
          <Input
            aria-invalid={!!error}
            autoComplete="new-password"
            id="auth-reset-password-confirm"
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your new password"
            required
            type="password"
            value={confirmPassword}
          />
          <AuthForm.FieldHint>{RESET_PASSWORD_CONFIRM_HINT}</AuthForm.FieldHint>
        </Field>
        <div className="erp-auth-form__submit-row">
          <Button
            aria-busy={isPending ? "true" : undefined}
            disabled={isPending}
            emphasis="solid"
            intent="primary"
            presentation="default"
            size="md"
            type="submit"
          >
            {isPending ? (
              <>
                <Spinner aria-label="Updating password" size="sm" />
                Updating…
              </>
            ) : (
              "Update password"
            )}
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
