"use client";

import { Button, Input, Label, Spinner } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useState } from "react";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  AUTH_FORM_WORK_EMAIL_HINT,
  FORGOT_PASSWORD_SUCCESS_HINT,
  FORGOT_PASSWORD_SUCCESS_LEAD,
} from "@/lib/auth/auth-copy.registry";
import {
  AUTH_FORM_SIGN_IN_LINK,
  AUTH_FORM_SIGN_IN_PASSWORD_RESET_NOTICE_LINK,
} from "@/lib/auth/auth-path.registry";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import { submitPasswordResetRequest } from "@/lib/auth/submit-password-reset-request.client";

export type AuthForgotPasswordFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

function ForgotPasswordSuccessState({ notice }: { readonly notice: string }) {
  return (
    <AuthForm.Root>
      <AuthForm.BackToSignIn />

      <AuthForm.NoticePositive
        hints={[FORGOT_PASSWORD_SUCCESS_HINT]}
        lead={notice}
      />

      <AuthForm.Alternates>
        <AuthForm.AlternateLabel>Ready to sign in?</AuthForm.AlternateLabel>
        <AuthForm.AlternateNotice>
          <Link
            className="erp-auth-form__link"
            href={AUTH_FORM_SIGN_IN_PASSWORD_RESET_NOTICE_LINK}
          >
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    const result = await submitPasswordResetRequest({ email });

    setIsSubmitting(false);

    if (result.error) {
      setError(
        mapAuthClientError(result.error.message, "passwordResetRequestFailed")
      );
      return;
    }

    setNotice(FORGOT_PASSWORD_SUCCESS_LEAD);
  }

  if (notice !== null) {
    return <ForgotPasswordSuccessState notice={notice} />;
  }

  return (
    <AuthForm.Root>
      <AuthForm.BackToSignIn />

      {error ? <AuthForm.FieldError>{error}</AuthForm.FieldError> : null}

      <AuthForm.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-form__field">
          <Label htmlFor="auth-forgot-password-email">Work email</Label>
          <Input
            autoComplete="email"
            id="auth-forgot-password-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            required
            type="email"
            value={email}
          />
          <AuthForm.FieldHint>{AUTH_FORM_WORK_EMAIL_HINT}</AuthForm.FieldHint>
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
            {isSubmitting ? (
              <>
                <Spinner aria-label="Sending reset link" size="sm" />
                Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </div>
      </AuthForm.Fields>

      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          Remember your password?{" "}
          <Link className="erp-auth-form__link" href={AUTH_FORM_SIGN_IN_LINK}>
            Sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}
