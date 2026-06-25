"use client";

import {
  AppShellAccountSettings01,
  AppShellAccountSettingsPanelSection,
} from "@afenda/appshell";
import { authClient } from "@afenda/auth/client";
import { Button, Field, FieldLabel, Input } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useActionState, useId, useState, useTransition } from "react";

import type { UserProfileSettingsViewModel } from "@/lib/user-settings/resolve-user-profile-settings.server";
import {
  UPDATE_USER_PROFILE_SETTINGS_INTENT,
  type UpdateUserProfileSettingsActionState,
  updateUserProfileSettingsAction,
} from "@/lib/user-settings/update-user-profile-settings.action";

export interface UserProfileSettingsPanelProps {
  readonly profile: UserProfileSettingsViewModel;
}

export type UserProfileSettingsPanelGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Field" | "FieldLabel" | "Input"
>;

function UserProfilePersonalInfoForm({
  initialDisplayName,
}: {
  readonly initialDisplayName: string;
}) {
  const [actionState, formAction, isPending] = useActionState(
    updateUserProfileSettingsAction,
    null satisfies UpdateUserProfileSettingsActionState
  );
  const displayNameFieldId = useId();

  return (
    <form action={formAction} className="erp-system-admin-settings-form">
      <Field orientation="vertical">
        <FieldLabel htmlFor={displayNameFieldId}>Display name</FieldLabel>
        <Input
          defaultValue={initialDisplayName}
          disabled={isPending}
          id={displayNameFieldId}
          name="displayName"
        />
      </Field>
      <input
        name="intent"
        type="hidden"
        value={UPDATE_USER_PROFILE_SETTINGS_INTENT}
      />
      {actionState && !actionState.ok ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {actionState.userMessage}
        </p>
      ) : null}
      {actionState?.ok ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Profile saved.
        </p>
      ) : null}
      <div className="erp-system-admin-settings-form__actions">
        <Button
          disabled={isPending}
          emphasis="solid"
          intent="primary"
          presentation="default"
          size="md"
          type="submit"
        >
          {isPending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

function UserProfileEmailPasswordSection({
  email,
  emailVerified,
}: {
  readonly email: string;
  readonly emailVerified: boolean;
}) {
  const sectionId = useId();
  const emailFieldId = `${sectionId}-email`;
  const currentPasswordFieldId = `${sectionId}-current-password`;
  const newPasswordFieldId = `${sectionId}-new-password`;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChangePassword = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        setIsError(true);
        setMessage(result.error.message ?? "Unable to change password.");
        return;
      }

      setIsError(false);
      setMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    });
  };

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage email and password through the identity provider."
      title="Email & password"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-01__field-grid">
        <div className="app-shell-studio-account-settings-01__field">
          <Field orientation="vertical">
            <FieldLabel htmlFor={emailFieldId}>Email</FieldLabel>
            <Input disabled id={emailFieldId} readOnly value={email} />
          </Field>
          <p className="erp-system-admin-settings-form__message">
            {emailVerified
              ? "Email verified."
              : "Email verification pending — contact your administrator if this persists."}
          </p>
        </div>
      </div>
      <div className="app-shell-studio-account-settings-01__field-grid">
        <div className="app-shell-studio-account-settings-01__field">
          <Field orientation="vertical">
            <FieldLabel htmlFor={currentPasswordFieldId}>
              Current password
            </FieldLabel>
            <Input
              autoComplete="current-password"
              disabled={isPending}
              id={currentPasswordFieldId}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
              }}
              type="password"
              value={currentPassword}
            />
          </Field>
        </div>
        <div className="app-shell-studio-account-settings-01__field">
          <Field orientation="vertical">
            <FieldLabel htmlFor={newPasswordFieldId}>New password</FieldLabel>
            <Input
              autoComplete="new-password"
              disabled={isPending}
              id={newPasswordFieldId}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
              type="password"
              value={newPassword}
            />
          </Field>
        </div>
      </div>
      {message ? (
        <p
          className="erp-system-admin-settings-form__message"
          role={isError ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
      <div className="app-shell-studio-account-settings-01__actions">
        <Button
          disabled={
            isPending ||
            currentPassword.length === 0 ||
            newPassword.length === 0
          }
          emphasis="outline"
          intent="secondary"
          onClick={handleChangePassword}
          presentation="default"
          size="md"
          type="button"
        >
          {isPending ? "Updating…" : "Change password"}
        </Button>
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

/**
 * Profile tab — full account-settings-01 block with user-scoped execution (ARCH-USER-001).
 */
export function UserProfileSettingsPanel({
  profile,
}: UserProfileSettingsPanelProps) {
  const personalInfoTitleId = useId();

  return (
    <AppShellAccountSettings01
      emailPasswordSection={
        <UserProfileEmailPasswordSection
          email={profile.email}
          emailVerified={profile.emailVerified}
        />
      }
      personalInfoSection={
        <AppShellAccountSettingsPanelSection
          description="Update how your name appears across Afenda."
          title="Personal information"
          titleId={personalInfoTitleId}
        >
          <UserProfilePersonalInfoForm
            initialDisplayName={profile.displayName}
          />
        </AppShellAccountSettingsPanelSection>
      }
    />
  );
}
