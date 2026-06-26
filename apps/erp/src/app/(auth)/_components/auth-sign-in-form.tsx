"use client";

import {
  type SignInProviderSurface,
  type SignInSocialProviderId,
  signIn,
} from "@afenda/auth/client";
import { Button, Input, Label, Spinner } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import { AuthSignInAltMethods } from "@/app/(auth)/_components/auth-sign-in-alt-methods";
import { AuthSocialProviderIcon } from "@/app/(auth)/_components/auth-social-provider-icons";
import {
  formatSignInMethodLabel,
  setLastUsedLoginMethod,
} from "@/lib/auth/auth-last-login-method.client";
import { persistMfaChallengeAction } from "@/lib/auth/auth-mfa-challenge.action";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { setPostAuthSignInMethod } from "@/lib/auth/auth-post-auth-method.client";
import {
  resolveMfaEntryRedirect,
  resolvePostAuthCompletePath,
} from "@/lib/auth/auth-redirect.policy";
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

export type AuthSignInFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

const SOCIAL_PROVIDER_SHORT_LABELS: Record<SignInSocialProviderId, string> = {
  google: "Google",
  github: "GitHub",
};

function SignInEntryNotice({ notice }: { readonly notice: AuthEntryNotice }) {
  return (
    <AuthForm.NoticePositive
      hints={[AUTH_ENTRY_NOTICE_HINTS[notice]]}
      lead={AUTH_ENTRY_NOTICE_MESSAGES[notice]}
    />
  );
}

function SocialSignInButtonContent({
  label,
  providerId,
}: {
  readonly label: string;
  readonly providerId: SignInSocialProviderId;
}) {
  return (
    <span className="erp-auth-form__social-button-content">
      <AuthSocialProviderIcon providerId={providerId} />
      <span>{label}</span>
    </span>
  );
}

export function AuthSignInForm({
  surface,
}: {
  readonly surface: SignInProviderSurface;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const postAuthCompletePath = resolvePostAuthCompletePath(nextParam);
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
      router.replace(resolveMfaEntryRedirect());
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
  const hasPasskey = surface.passkeyEnabled;
  const hasSso = surface.ssoEnabled;
  const hasOtherMethods = hasPasskey || hasSso;

  return (
    <AuthForm.Root>
      {entryNotice === null ? null : <SignInEntryNotice notice={entryNotice} />}

      {error ? <AuthForm.FieldError>{error}</AuthForm.FieldError> : null}

      {hasSocialProviders ? (
        <div className="erp-auth-form__social-actions">
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
              <SocialSignInButtonContent
                label={formatSignInMethodLabel(
                  SOCIAL_PROVIDER_SHORT_LABELS[providerId],
                  providerId
                )}
                providerId={providerId}
              />
            </Button>
          ))}
        </div>
      ) : null}

      {hasSocialProviders ? (
        <AuthForm.AlternateEntry>
          <span className="erp-auth-form__alternate-entry-label">
            Or continue with email
          </span>
        </AuthForm.AlternateEntry>
      ) : null}

      <AuthForm.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-form__field">
          <Label htmlFor="auth-email">Work email</Label>
          <Input
            autoComplete="username webauthn"
            id="auth-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div className="erp-auth-form__field">
          <div className="erp-auth-form__field-toolbar">
            <Label htmlFor="auth-password">Password</Label>
            <Link
              className="erp-auth-form__link erp-auth-form__field-toolbar-action"
              href={buildAuthPath("forgotPassword")}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            autoComplete="current-password webauthn"
            id="auth-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={password}
          />
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
                <Spinner aria-label="Signing in" size="sm" />
                Signing in…
              </>
            ) : (
              formatSignInMethodLabel("Sign in with email", "email")
            )}
          </Button>
        </div>
      </AuthForm.Fields>

      {hasOtherMethods ? (
        <AuthSignInAltMethods
          defaultTab={hasPasskey ? "passkey" : "sso"}
          isSubmitting={isSubmitting}
          onPasskeySignIn={() => {
            void handlePasskeySignIn();
          }}
          onSsoEmailChange={setSsoEmail}
          onSsoSubmit={handleSsoSignIn}
          showPasskey={hasPasskey}
          showSso={hasSso}
          ssoEmail={ssoEmail}
        />
      ) : null}

      <AuthForm.SignUpPrompt>
        No account?{" "}
        <Link className="erp-auth-form__link" href={buildAuthPath("signUp")}>
          Create account
        </Link>
      </AuthForm.SignUpPrompt>
    </AuthForm.Root>
  );
}
