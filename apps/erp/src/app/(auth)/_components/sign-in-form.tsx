"use client";

import {
  type SignInProviderSurface,
  type SignInSocialProviderId,
  signIn,
} from "@afenda/auth/client";
import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  AUTH_FORM_WORK_EMAIL_HINT,
  SIGN_IN_CREDENTIALS_LEAD,
  SIGN_IN_PASSWORD_HINT,
  SIGN_IN_SOCIAL_LEAD,
} from "@/app/(auth)/_components/auth-form.copy";
import { persistMfaChallenge } from "@/lib/auth/auth-mfa-challenge.storage";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import {
  resolveMfaEntryRedirect,
  resolveSignInSuccessRedirect,
} from "@/lib/auth/auth-redirect.policy";
import {
  readSignInTwoFactorChallenge,
  type SignInTwoFactorChallenge,
} from "@/lib/auth/is-sign-in-two-factor-redirect";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";
import {
  AUTH_ENTRY_NOTICE_HINTS,
  AUTH_ENTRY_NOTICE_MESSAGES,
  type AuthEntryNotice,
  resolveAuthEntryNotice,
} from "@/lib/auth/resolve-auth-entry-notice";

export type SignInFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

const SOCIAL_PROVIDER_LABELS: Record<SignInSocialProviderId, string> = {
  google: "Google",
  microsoft: "Microsoft",
};

function SignInEntryNotice({ notice }: { readonly notice: AuthEntryNotice }) {
  return (
    <AuthForm.NoticePositive
      hints={[AUTH_ENTRY_NOTICE_HINTS[notice]]}
      lead={AUTH_ENTRY_NOTICE_MESSAGES[notice]}
    />
  );
}

export function SignInForm({
  surface,
}: {
  readonly surface: SignInProviderSurface;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveSignInSuccessRedirect(searchParams.get("next"));
  const entryNotice = resolveAuthEntryNotice(searchParams.get("notice"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ssoEmail, setSsoEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    let pendingMfaChallenge: SignInTwoFactorChallenge | null = null;

    const result = await signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess(context) {
          pendingMfaChallenge = readSignInTwoFactorChallenge(context.data);
        },
      }
    );

    setIsSubmitting(false);

    if (pendingMfaChallenge !== null) {
      persistMfaChallenge(pendingMfaChallenge, nextPath);
      router.replace(resolveMfaEntryRedirect());
      return;
    }

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "signInFailed"));
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  async function handleSocialSignIn(provider: SignInSocialProviderId) {
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.social({
      callbackURL: nextPath,
      provider,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "socialSignInFailed"));
    }
  }

  async function handlePasskeySignIn() {
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.passkey();

    setIsSubmitting(false);

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "passkeySignInFailed"));
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  async function handleSsoSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.sso({
      callbackURL: nextPath,
      email: ssoEmail.trim(),
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "ssoSignInFailed"));
    }
  }

  const hasSocialProviders = surface.socialProviderIds.length > 0;
  const hasPasskeyOrSso = surface.passkeyEnabled || surface.ssoEnabled;
  const showAlternatesLabel = hasPasskeyOrSso && hasSocialProviders === false;
  const credentialsLead =
    entryNotice === null
      ? hasSocialProviders
        ? SIGN_IN_SOCIAL_LEAD
        : SIGN_IN_CREDENTIALS_LEAD
      : null;

  return (
    <AuthForm.Root>
      {entryNotice === null ? null : <SignInEntryNotice notice={entryNotice} />}

      {credentialsLead === null ? null : (
        <AuthForm.StepLead>{credentialsLead}</AuthForm.StepLead>
      )}

      {error ? <AuthForm.FieldError>{error}</AuthForm.FieldError> : null}

      {hasSocialProviders ? (
        <div className="erp-auth-form__secondary-actions">
          {surface.socialProviderIds.map((providerId) => (
            <Button
              disabled={isSubmitting}
              emphasis="outline"
              intent="secondary"
              key={providerId}
              onClick={() => {
                void handleSocialSignIn(providerId);
              }}
              presentation="default"
              size="md"
              type="button"
            >
              {SOCIAL_PROVIDER_LABELS[providerId]}
            </Button>
          ))}
        </div>
      ) : null}

      {hasSocialProviders ? (
        <AuthForm.AlternateEntry>
          <span className="erp-auth-form__alternate-entry-label">
            Alternate entry
          </span>
        </AuthForm.AlternateEntry>
      ) : null}

      <AuthForm.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-form__field">
          <Label htmlFor="email">Work email</Label>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            required
            type="email"
            value={email}
          />
          <p className="erp-auth-form__field-hint">
            {AUTH_FORM_WORK_EMAIL_HINT}
          </p>
        </div>
        <div className="erp-auth-form__field">
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
          <p className="erp-auth-form__field-hint">{SIGN_IN_PASSWORD_HINT}</p>
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
            {isSubmitting ? "Signing in…" : "Sign in with email"}
          </Button>
          <p className="erp-auth-form__footer-link">
            <Link
              className="erp-auth-form__link"
              href={buildAuthPath("forgotPassword")}
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </AuthForm.Fields>

      <AuthForm.Alternates>
        {hasPasskeyOrSso ? (
          <>
            {showAlternatesLabel ? (
              <AuthForm.AlternateLabel>
                Or continue with
              </AuthForm.AlternateLabel>
            ) : null}
            {surface.passkeyEnabled ? (
              <div className="erp-auth-form__secondary-actions">
                <Button
                  disabled={isSubmitting}
                  emphasis="outline"
                  intent="secondary"
                  onClick={() => {
                    void handlePasskeySignIn();
                  }}
                  presentation="default"
                  size="md"
                  type="button"
                >
                  Passkey
                </Button>
              </div>
            ) : null}
            {surface.ssoEnabled ? (
              <div className="erp-auth-form__sso">
                <AuthForm.AlternateLabel>
                  Enterprise SSO
                </AuthForm.AlternateLabel>
                <form
                  className="erp-auth-form__sso-fields"
                  onSubmit={handleSsoSignIn}
                >
                  <div className="erp-auth-form__field">
                    <Label htmlFor="sso-email">Organization email</Label>
                    <Input
                      autoComplete="email"
                      id="sso-email"
                      name="ssoEmail"
                      onChange={(event) => setSsoEmail(event.target.value)}
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={ssoEmail}
                    />
                    <p className="erp-auth-form__field-hint">
                      Use your organization domain email to continue with SSO.
                    </p>
                  </div>
                  <Button
                    disabled={isSubmitting}
                    emphasis="outline"
                    intent="secondary"
                    presentation="default"
                    size="md"
                    type="submit"
                  >
                    Continue with SSO
                  </Button>
                </form>
              </div>
            ) : null}
          </>
        ) : null}
        <AuthForm.AlternateLabel>New to Afenda ERP?</AuthForm.AlternateLabel>
        <AuthForm.AlternateNotice>
          Received an invitation?{" "}
          <Link className="erp-auth-form__link" href={buildAuthPath("signUp")}>
            Create account
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}
