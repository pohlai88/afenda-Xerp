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

import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  AUTH_FORM_WORK_EMAIL_HINT,
  SIGN_IN_CREDENTIALS_LEAD,
  SIGN_IN_PASSWORD_HINT,
  SIGN_IN_SOCIAL_LEAD,
} from "@/app/(auth-v2)/_components/auth-v2-form.copy";
import {
  formatSignInMethodLabel,
  setLastUsedLoginMethod,
} from "@/lib/auth/auth-last-login-method.client";
import { persistMfaChallengeAction } from "@/lib/auth/auth-mfa-challenge.action";
import { setPostAuthSignInMethod } from "@/lib/auth/auth-post-auth-method.client";
import { fetchPostAuthEntryPath } from "@/lib/auth/fetch-post-auth-entry-path.client";
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
import { usePasskeyConditionalUi } from "@/lib/auth/use-passkey-conditional-ui";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";
import {
  resolveAuthV2MfaEntryRedirect,
  resolveAuthV2PostAuthCompletePath,
} from "@/lib/auth-v2/auth-v2-redirect.policy";

export type AuthV2SignInFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

const SOCIAL_PROVIDER_LABELS: Record<SignInSocialProviderId, string> = {
  google: "Google",
  github: "GitHub",
};

function SignInEntryNotice({ notice }: { readonly notice: AuthEntryNotice }) {
  return (
    <AuthV2Form.NoticePositive
      hints={[AUTH_ENTRY_NOTICE_HINTS[notice]]}
      lead={AUTH_ENTRY_NOTICE_MESSAGES[notice]}
    />
  );
}

export function AuthV2SignInForm({
  surface,
}: {
  readonly surface: SignInProviderSurface;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const postAuthCompletePath = resolveAuthV2PostAuthCompletePath(nextParam);
  const entryNotice = resolveAuthEntryNotice(searchParams.get("notice"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ssoEmail, setSsoEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePasskeyConditionalUi(surface.passkeyEnabled);

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
      await persistMfaChallengeAction(pendingMfaChallenge, nextParam);
      router.replace(resolveAuthV2MfaEntryRedirect());
      return;
    }

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "signInFailed"));
      return;
    }

    setLastUsedLoginMethod("email");
    setPostAuthSignInMethod("email");
    const destination = await fetchPostAuthEntryPath(nextParam);
    router.replace(destination);
    router.refresh();
  }

  async function handleSocialSignIn(provider: SignInSocialProviderId) {
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.social({
      callbackURL: postAuthCompletePath,
      provider,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "socialSignInFailed"));
      return;
    }

    setLastUsedLoginMethod(provider);
    setPostAuthSignInMethod(provider);
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

    setLastUsedLoginMethod("passkey");
    setPostAuthSignInMethod("passkey");
    router.replace(postAuthCompletePath);
    router.refresh();
  }

  async function handleSsoSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.sso({
      callbackURL: postAuthCompletePath,
      email: ssoEmail.trim(),
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(mapAuthClientError(result.error.message, "ssoSignInFailed"));
      return;
    }

    setLastUsedLoginMethod("sso");
    setPostAuthSignInMethod("sso");
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
    <AuthV2Form.Root>
      {entryNotice === null ? null : <SignInEntryNotice notice={entryNotice} />}

      {credentialsLead === null ? null : (
        <AuthV2Form.StepLead>{credentialsLead}</AuthV2Form.StepLead>
      )}

      {error ? <AuthV2Form.FieldError>{error}</AuthV2Form.FieldError> : null}

      {hasSocialProviders ? (
        <div className="erp-auth-v2-form__secondary-actions">
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
              {formatSignInMethodLabel(
                SOCIAL_PROVIDER_LABELS[providerId],
                providerId
              )}
            </Button>
          ))}
        </div>
      ) : null}

      {hasSocialProviders ? (
        <AuthV2Form.AlternateEntry>
          <span className="erp-auth-v2-form__alternate-entry-label">
            Alternate entry
          </span>
        </AuthV2Form.AlternateEntry>
      ) : null}

      <AuthV2Form.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-email">Work email</Label>
          <Input
            autoComplete="username webauthn"
            id="auth-v2-email"
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
        <div className="erp-auth-v2-form__field">
          <Label htmlFor="auth-v2-password">Password</Label>
          <Input
            autoComplete="current-password webauthn"
            id="auth-v2-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
          <p className="erp-auth-v2-form__field-hint">
            {SIGN_IN_PASSWORD_HINT}
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
            {isSubmitting
              ? "Signing in…"
              : formatSignInMethodLabel("Sign in with email", "email")}
          </Button>
          <p className="erp-auth-v2-form__footer-link">
            <Link
              className="erp-auth-v2-form__link"
              href={buildAuthV2Path("forgotPassword")}
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </AuthV2Form.Fields>

      <AuthV2Form.Alternates>
        {hasPasskeyOrSso ? (
          <>
            {showAlternatesLabel ? (
              <AuthV2Form.AlternateLabel>
                Or continue with
              </AuthV2Form.AlternateLabel>
            ) : null}
            {surface.passkeyEnabled ? (
              <div className="erp-auth-v2-form__secondary-actions">
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
                  {formatSignInMethodLabel("Passkey", "passkey")}
                </Button>
              </div>
            ) : null}
            {surface.ssoEnabled ? (
              <div className="erp-auth-v2-form__sso">
                <AuthV2Form.AlternateLabel>
                  Enterprise SSO
                </AuthV2Form.AlternateLabel>
                <form
                  className="erp-auth-v2-form__sso-fields"
                  onSubmit={handleSsoSignIn}
                >
                  <div className="erp-auth-v2-form__field">
                    <Label htmlFor="auth-v2-sso-email">
                      Organization email
                    </Label>
                    <Input
                      autoComplete="email"
                      id="auth-v2-sso-email"
                      name="ssoEmail"
                      onChange={(event) => setSsoEmail(event.target.value)}
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={ssoEmail}
                    />
                    <p className="erp-auth-v2-form__field-hint">
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
                    {formatSignInMethodLabel("Continue with SSO", "sso")}
                  </Button>
                </form>
              </div>
            ) : null}
          </>
        ) : null}
        <AuthV2Form.AlternateLabel>
          New to Afenda ERP?
        </AuthV2Form.AlternateLabel>
        <AuthV2Form.AlternateNotice>
          Received an invitation?{" "}
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signUp")}
          >
            Create account
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}
