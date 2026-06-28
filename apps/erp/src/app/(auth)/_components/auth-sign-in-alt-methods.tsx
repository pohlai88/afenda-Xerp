"use client";

import {
  Button,
  Field,
  FieldLabel,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { FormEvent } from "react";

export type AuthSignInAltMethodsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label" | "Tabs"
>;

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import { AuthPasskeyIcon } from "@/app/(auth)/_components/auth-social-provider-icons";
import { formatSignInMethodLabel } from "@/lib/auth/auth-last-login-method.client";

export function AuthSignInAltMethods({
  defaultTab,
  isSubmitting,
  onPasskeySignIn,
  onSsoSubmit,
  onSsoEmailChange,
  showPasskey,
  showSso,
  ssoEmail,
}: {
  readonly defaultTab: "passkey" | "sso";
  readonly isSubmitting: boolean;
  readonly onPasskeySignIn: () => void;
  readonly onSsoSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onSsoEmailChange: (value: string) => void;
  readonly showPasskey: boolean;
  readonly showSso: boolean;
  readonly ssoEmail: string;
}) {
  if (!(showPasskey || showSso)) {
    return null;
  }

  const passkeyPanel = (
    <div className="erp-auth-form__alt-tab-panel erp-auth-form__alt-tab-panel--passkey">
      <Button
        disabled={isSubmitting}
        emphasis="outline"
        intent="secondary"
        onClick={onPasskeySignIn}
        presentation="default"
        size="md"
        type="button"
      >
        <AuthPasskeyIcon />
        {formatSignInMethodLabel("Continue with Passkey", "passkey")}
      </Button>
    </div>
  );

  const ssoPanel = (
    <form className="erp-auth-form__alt-tab-panel" onSubmit={onSsoSubmit}>
      <Field>
        <FieldLabel htmlFor="auth-sso-email">Organization email</FieldLabel>
        <Input
          autoComplete="email"
          id="auth-sso-email"
          name="ssoEmail"
          onChange={(event) => onSsoEmailChange(event.target.value)}
          placeholder="name@company.com"
          required
          type="email"
          value={ssoEmail}
        />
      </Field>
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
  );

  const hasBoth = showPasskey && showSso;

  return (
    <AuthForm.OtherMethods>
      {hasBoth ? null : (
        <AuthForm.AlternateLabel>Other sign-in options</AuthForm.AlternateLabel>
      )}
      {hasBoth ? (
        <div className="erp-auth-form__alt-tabs">
          <Tabs defaultValue={defaultTab}>
            <TabsList>
              <TabsTrigger value="passkey">Passkey</TabsTrigger>
              <TabsTrigger value="sso">Organization SSO</TabsTrigger>
            </TabsList>
            <TabsContent value="passkey">{passkeyPanel}</TabsContent>
            <TabsContent value="sso">{ssoPanel}</TabsContent>
          </Tabs>
        </div>
      ) : null}
      {showPasskey && !showSso ? passkeyPanel : null}
      {!showPasskey && showSso ? ssoPanel : null}
    </AuthForm.OtherMethods>
  );
}
