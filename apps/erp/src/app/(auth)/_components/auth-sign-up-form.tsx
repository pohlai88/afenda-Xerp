"use client";

import { Button, Input, Label, Spinner } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  INVITATION_HINT,
  INVITATION_LEAD,
  MISSING_INVITATION_HINT,
  MISSING_INVITATION_LEAD,
  SIGN_UP_EMAIL_HINT,
  SIGN_UP_NAME_HINT,
  SIGN_UP_PASSWORD_HINT,
  SIGN_UP_PROFILE_LEAD,
} from "@/lib/auth/auth-copy.registry";
import { AUTH_FORM_SIGN_IN_LINK } from "@/lib/auth/auth-path.registry";
import { resolveSignUpSuccessRedirect } from "@/lib/auth/auth-redirect.policy";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import { submitInvitationSignUp } from "@/lib/auth/submit-invitation-sign-up.client";

export type AuthSignUpFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

function SignUpInvitationProblemState() {
  return (
    <AuthForm.Root>
      <AuthForm.BackToSignIn />

      <AuthForm.NoticeCaution
        hints={[MISSING_INVITATION_HINT]}
        lead={MISSING_INVITATION_LEAD}
      />

      <AuthForm.Alternates>
        <AuthForm.AlternateLabel>Already have access?</AuthForm.AlternateLabel>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={AUTH_FORM_SIGN_IN_LINK}>
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("invitationToken")?.trim() ?? "";
  const prefilledEmail = searchParams.get("email")?.trim() ?? "";
  const hasInvitation = invitationToken.length > 0;

  const [name, setName] = useState("");
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!hasInvitation) {
      setError("A valid invitation link is required to create an account.");
      return;
    }

    setIsSubmitting(true);

    const trimmedName = name.trim();
    const displayName =
      trimmedName.length > 0
        ? trimmedName
        : (email.trim().split("@")[0] ?? "User");

    const result = await submitInvitationSignUp({
      email: email.trim(),
      invitationToken,
      name: displayName,
      password,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "signUpFailed"));
      return;
    }

    router.replace(resolveSignUpSuccessRedirect());
    router.refresh();
  }

  if (!hasInvitation) {
    return <SignUpInvitationProblemState />;
  }

  return (
    <AuthForm.Root>
      <AuthForm.BackToSignIn />

      <AuthForm.NoticePositive
        hints={[INVITATION_HINT]}
        lead={INVITATION_LEAD}
      />

      <AuthForm.StepLead>{SIGN_UP_PROFILE_LEAD}</AuthForm.StepLead>

      {error ? <AuthForm.FieldError>{error}</AuthForm.FieldError> : null}

      <AuthForm.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-form__field">
          <Label htmlFor="auth-sign-up-name">Full name</Label>
          <Input
            autoComplete="name"
            id="auth-sign-up-name"
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            type="text"
            value={name}
          />
          <AuthForm.FieldHint>{SIGN_UP_NAME_HINT}</AuthForm.FieldHint>
        </div>
        <div className="erp-auth-form__field">
          <Label htmlFor="auth-sign-up-email">Email</Label>
          <Input
            autoComplete="email"
            id="auth-sign-up-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            readOnly={prefilledEmail.length > 0}
            required
            type="email"
            value={email}
          />
          <AuthForm.FieldHint>{SIGN_UP_EMAIL_HINT}</AuthForm.FieldHint>
        </div>
        <div className="erp-auth-form__field">
          <Label htmlFor="auth-sign-up-password">Password</Label>
          <Input
            autoComplete="new-password"
            id="auth-sign-up-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            required
            type="password"
            value={password}
          />
          <AuthForm.FieldHint>{SIGN_UP_PASSWORD_HINT}</AuthForm.FieldHint>
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
                <Spinner aria-label="Creating account" size="sm" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </div>
      </AuthForm.Fields>

      <AuthForm.Alternates>
        <AuthForm.AlternateLabel>
          Already have an account?
        </AuthForm.AlternateLabel>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={AUTH_FORM_SIGN_IN_LINK}>
            Sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}
