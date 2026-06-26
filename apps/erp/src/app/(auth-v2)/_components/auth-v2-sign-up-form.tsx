"use client";

import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  AUTH_V2_FORM_SIGN_IN_LINK,
  INVITATION_HINT,
  INVITATION_LEAD,
  MISSING_INVITATION_HINT,
  MISSING_INVITATION_LEAD,
  SIGN_UP_EMAIL_HINT,
  SIGN_UP_NAME_HINT,
  SIGN_UP_PASSWORD_HINT,
  SIGN_UP_PROFILE_LEAD,
} from "@/app/(auth-v2)/_components/auth-v2-form.copy";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import { submitInvitationSignUp } from "@/lib/auth/submit-invitation-sign-up.client";
import { resolveAuthV2SignUpSuccessRedirect } from "@/lib/auth-v2/auth-v2-redirect.policy";

export type AuthV2SignUpFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

function SignUpInvitationProblemState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.BackToSignIn />

      <AuthV2Form.NoticeCaution
        hints={[MISSING_INVITATION_HINT]}
        lead={MISSING_INVITATION_LEAD}
      />

      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateLabel>
          Already have access?
        </AuthV2Form.AlternateLabel>
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

export function AuthV2SignUpForm() {
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

    router.replace(resolveAuthV2SignUpSuccessRedirect());
    router.refresh();
  }

  if (!hasInvitation) {
    return <SignUpInvitationProblemState />;
  }

  return (
    <AuthV2Form.Root>
      <AuthV2Form.BackToSignIn />

      <AuthV2Form.NoticePositive
        hints={[INVITATION_HINT]}
        lead={INVITATION_LEAD}
      />

      <AuthV2Form.StepLead>{SIGN_UP_PROFILE_LEAD}</AuthV2Form.StepLead>

      {error ? <AuthV2Form.FieldError>{error}</AuthV2Form.FieldError> : null}

      <AuthV2Form.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-sign-up-name">Full name</Label>
          <Input
            autoComplete="name"
            id="auth-v2-sign-up-name"
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            type="text"
            value={name}
          />
          <p className="erp-auth-v2-form__field-hint">{SIGN_UP_NAME_HINT}</p>
        </div>
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-sign-up-email">Email</Label>
          <Input
            autoComplete="email"
            id="auth-v2-sign-up-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            readOnly={prefilledEmail.length > 0}
            required
            type="email"
            value={email}
          />
          <p className="erp-auth-v2-form__field-hint">{SIGN_UP_EMAIL_HINT}</p>
        </div>
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-sign-up-password">Password</Label>
          <Input
            autoComplete="new-password"
            id="auth-v2-sign-up-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            required
            type="password"
            value={password}
          />
          <p className="erp-auth-v2-form__field-hint">
            {SIGN_UP_PASSWORD_HINT}
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
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </div>
      </AuthV2Form.Fields>

      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateLabel>
          Already have an account?
        </AuthV2Form.AlternateLabel>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={AUTH_V2_FORM_SIGN_IN_LINK}
          >
            Sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}
