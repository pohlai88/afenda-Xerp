"use client";

import {
  type SignInProviderSurface,
  type SignInSocialProviderId,
  signIn,
} from "@afenda/auth/client";
import { Button, Input, Label, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export type SignInFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label" | "Separator"
>;

const SOCIAL_PROVIDER_LABELS: Record<SignInSocialProviderId, string> = {
  google: "Google",
  microsoft: "Microsoft",
};

export interface SignInFormProps {
  readonly surface: SignInProviderSurface;
}

export function SignInForm({ surface }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ssoEmail, setSsoEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.email({
      email,
      password,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Sign-in failed.");
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
      setError(result.error.message ?? "Social sign-in failed.");
    }
  }

  async function handlePasskeySignIn() {
    setError(null);
    setIsSubmitting(true);

    const result = await signIn.passkey();

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Passkey sign-in failed.");
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
      setError(result.error.message ?? "SSO sign-in failed.");
    }
  }

  const hasSocialProviders = surface.socialProviderIds.length > 0;
  const hasPasskeyOrSso = surface.passkeyEnabled || surface.ssoEnabled;
  const showAlternatesLabel = hasPasskeyOrSso && hasSocialProviders === false;

  return (
    <div className="erp-sign-in-form">
      {hasSocialProviders ? (
        <div className="erp-sign-in-form__social">
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
              Continue with {SOCIAL_PROVIDER_LABELS[providerId]}
            </Button>
          ))}
        </div>
      ) : null}

      {hasSocialProviders ? (
        <div className="erp-sign-in-form__divider">
          <Separator />
          <span className="erp-sign-in-form__divider-label">
            Or sign in with email
          </span>
          <Separator />
        </div>
      ) : null}

      <form className="erp-sign-in-form__fields" onSubmit={handleSubmit}>
        <div className="erp-sign-in-form__field">
          <Label htmlFor="email">Email</Label>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div className="erp-sign-in-form__field">
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
        {error ? (
          <p className="erp-sign-in-form__error" role="alert">
            {error}
          </p>
        ) : null}
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
      </form>

      {hasPasskeyOrSso ? (
        <div className="erp-sign-in-form__alternates">
          {showAlternatesLabel ? (
            <p className="erp-sign-in-form__alternates-label">
              Or continue with
            </p>
          ) : null}
          {surface.passkeyEnabled ? (
            <div className="erp-sign-in-form__alternates-actions">
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
            <form className="erp-sign-in-form__sso" onSubmit={handleSsoSignIn}>
              <Label htmlFor="sso-email">Work email for SSO</Label>
              <Input
                autoComplete="email"
                id="sso-email"
                name="ssoEmail"
                onChange={(event) => setSsoEmail(event.target.value)}
                required
                type="email"
                value={ssoEmail}
              />
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
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
