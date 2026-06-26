"use client";

import {
  type SignInProviderSurface,
  type SignInSocialProviderId,
  signIn,
} from "@afenda/auth/client";
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
import { AuthDevLoginPanel } from "@/app/(auth)/_components/auth-dev-login-panel";
import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import { AuthSignInAltMethods } from "@/app/(auth)/_components/auth-sign-in-alt-methods";
import { AuthSocialProviderIcon } from "@/app/(auth)/_components/auth-social-provider-icons";
import { AUTH_SIGN_IN_COPY } from "@/lib/auth/auth-copy.registry";
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
import type { DevLoginPanelState } from "@/lib/auth/dev-login-panel.contract";
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
  devLoginPanel,
  surface,
}: {
  readonly devLoginPanel: DevLoginPanelState;
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
  const [isPending, startTransition] = useTransition();

  usePasskeyConditionalUi(surface.passkeyEnabled);

  function performEmailSignIn(signInEmail: string, signInPassword: string) {
    setError(null);
    startTransition(async () => {
      let pendingMfaChallenge: SignInTwoFactorChallenge | null = null;

      const result = await signIn.email(
        {
          email: signInEmail,
          password: signInPassword,
        },
        {
          onSuccess(context) {
            pendingMfaChallenge = readSignInTwoFactorChallenge(context.data);
          },
        }
      );

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
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    performEmailSignIn(email, password);
  }

  function handleSocialSignIn(provider: SignInSocialProviderId) {
    setError(null);
    startTransition(async () => {
      const result = await signIn.social({
        callbackURL: postAuthCompletePath,
        provider,
      });

      if (result.error) {
        setError(
          mapAuthClientError(result.error.message, "socialSignInFailed")
        );
        return;
      }

      setLastUsedLoginMethod(provider);
      setPostAuthSignInMethod(provider);
    });
  }

  function handlePasskeySignIn() {
    setError(null);
    startTransition(async () => {
      const result = await signIn.passkey();

      if (result.error) {
        setError(
          mapAuthClientError(result.error.message, "passkeySignInFailed")
        );
        return;
      }

      setLastUsedLoginMethod("passkey");
      setPostAuthSignInMethod("passkey");
      router.replace(postAuthCompletePath);
      router.refresh();
    });
  }

  function handleSsoSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signIn.sso({
        callbackURL: postAuthCompletePath,
        email: ssoEmail.trim(),
      });

      if (result.error) {
        setError(mapAuthClientError(result.error.message, "ssoSignInFailed"));
        return;
      }

      setLastUsedLoginMethod("sso");
      setPostAuthSignInMethod("sso");
    });
  }

  const hasSocialProviders = surface.socialProviderIds.length > 0;
  const hasPasskey = surface.passkeyEnabled;
  const hasSso = surface.ssoEnabled;
  const hasOtherMethods = hasPasskey || hasSso;

  return (
    <AuthForm.Root>
      {entryNotice === null ? null : <SignInEntryNotice notice={entryNotice} />}

      {hasSocialProviders ? (
        <div className="erp-auth-form__social-actions">
          {surface.socialProviderIds.map((providerId) => (
            <Button
              disabled={isPending}
              emphasis="outline"
              intent="secondary"
              key={providerId}
              onClick={() => {
                handleSocialSignIn(providerId);
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
            {AUTH_SIGN_IN_COPY.orContinueWithEmail}
          </span>
        </AuthForm.AlternateEntry>
      ) : null}

      <AuthForm.Fields onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="auth-email">
            {AUTH_SIGN_IN_COPY.emailLabel}
          </FieldLabel>
          <Input
            aria-describedby={error ? "auth-email-error" : undefined}
            aria-invalid={!!error}
            autoComplete="username webauthn"
            id="auth-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder={AUTH_SIGN_IN_COPY.emailPlaceholder}
            required
            type="email"
            value={email}
          />
          {error ? (
            <FieldError id="auth-email-error">{error}</FieldError>
          ) : null}
        </Field>
        <Field>
          <div className="erp-auth-form__field-toolbar">
            <FieldLabel htmlFor="auth-password">
              {AUTH_SIGN_IN_COPY.passwordLabel}
            </FieldLabel>
            <Link
              className="erp-auth-form__link erp-auth-form__field-toolbar-action"
              href={buildAuthPath("forgotPassword")}
            >
              {AUTH_SIGN_IN_COPY.forgotPasswordLink}
            </Link>
          </div>
          <Input
            aria-invalid={!!error}
            autoComplete="current-password webauthn"
            id="auth-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={AUTH_SIGN_IN_COPY.passwordPlaceholder}
            required
            type="password"
            value={password}
          />
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
                <Spinner aria-label="Signing in" size="sm" />
                {AUTH_SIGN_IN_COPY.signingIn}
              </>
            ) : (
              formatSignInMethodLabel(AUTH_SIGN_IN_COPY.submitLabel, "email")
            )}
          </Button>
        </div>
      </AuthForm.Fields>

      {hasOtherMethods ? (
        <AuthSignInAltMethods
          defaultTab={hasPasskey ? "passkey" : "sso"}
          isSubmitting={isPending}
          onPasskeySignIn={() => {
            handlePasskeySignIn();
          }}
          onSsoEmailChange={setSsoEmail}
          onSsoSubmit={handleSsoSignIn}
          showPasskey={hasPasskey}
          showSso={hasSso}
          ssoEmail={ssoEmail}
        />
      ) : null}

      {devLoginPanel.enabled ? (
        <AuthDevLoginPanel
          onFillCredentials={(account) => {
            setEmail(account.email);
            setPassword(account.password);
          }}
          onQuickSignIn={(account) => {
            performEmailSignIn(account.email, account.password);
          }}
          panel={devLoginPanel}
        />
      ) : null}

      <AuthForm.SignUpPrompt>
        {AUTH_SIGN_IN_COPY.noAccountPrompt}{" "}
        <Link className="erp-auth-form__link" href={buildAuthPath("signUp")}>
          {AUTH_SIGN_IN_COPY.createAccountLink}
        </Link>
      </AuthForm.SignUpPrompt>
    </AuthForm.Root>
  );
}
