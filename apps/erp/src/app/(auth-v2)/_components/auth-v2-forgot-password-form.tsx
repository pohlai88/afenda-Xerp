"use client";

import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useState } from "react";

import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  AUTH_FORM_WORK_EMAIL_HINT,
  AUTH_V2_FORM_SIGN_IN_LINK,
  AUTH_V2_FORM_SIGN_IN_PASSWORD_RESET_NOTICE_LINK,
  FORGOT_PASSWORD_SUCCESS_HINT,
  FORGOT_PASSWORD_SUCCESS_LEAD,
} from "@/app/(auth-v2)/_components/auth-v2-form.copy";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import { submitPasswordResetRequest } from "@/lib/auth/submit-password-reset-request.client";

export type AuthV2ForgotPasswordFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

function ForgotPasswordSuccessState({ notice }: { readonly notice: string }) {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.BackToSignIn />

      <AuthV2Form.NoticePositive
        hints={[FORGOT_PASSWORD_SUCCESS_HINT]}
        lead={notice}
      />

      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateLabel>Ready to sign in?</AuthV2Form.AlternateLabel>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={AUTH_V2_FORM_SIGN_IN_PASSWORD_RESET_NOTICE_LINK}
          >
            Return to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2ForgotPasswordForm() {
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
    <AuthV2Form.Root>
      <AuthV2Form.BackToSignIn />

      {error ? <AuthV2Form.FieldError>{error}</AuthV2Form.FieldError> : null}

      <AuthV2Form.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-forgot-password-email">Work email</Label>
          <Input
            autoComplete="email"
            id="auth-v2-forgot-password-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            required
            type="email"
            value={email}
          />
          <p className="erp-auth-v2-form__field-hint">
            {AUTH_FORM_WORK_EMAIL_HINT}
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
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </div>
      </AuthV2Form.Fields>

      <AuthV2Form.AlternateNotice>
        Remember your password?{" "}
        <Link
          className="erp-auth-v2-form__link"
          href={AUTH_V2_FORM_SIGN_IN_LINK}
        >
          Sign in
        </Link>
      </AuthV2Form.AlternateNotice>
    </AuthV2Form.Root>
  );
}
