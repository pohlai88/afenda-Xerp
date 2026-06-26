"use client";

import {
  AppShellAccountSettings06,
  type AppShellAccountSettings06MfaEnrollPhase,
} from "@afenda/appshell";
import {
  authClient,
  readAfendaAuthSessionTwoFactorEnabled,
  twoFactor,
} from "@afenda/auth/client";
import { useCallback, useState, useTransition } from "react";

import type { SecuritySettingsViewModel } from "@/lib/system-admin/resolve-security-settings.server";
import { updateCompanyMfaOverrideAction } from "@/lib/system-admin/update-company-mfa-override.action";
import { updateSecurityMfaPolicyAction } from "@/lib/system-admin/update-security-mfa-policy.action";

export interface SystemAdminSecuritySettingsPanelProps {
  readonly initialSettings: Pick<
    SecuritySettingsViewModel,
    | "companyId"
    | "companyLabel"
    | "companyMfaOverride"
    | "effectiveMfaRequired"
    | "mfaPolicyRequired"
    | "userMfaEnabled"
  >;
}

type UserMfaReauthIntent = "disable" | "enable";

function parseBackupCodes(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function readTotpUri(value: unknown): string | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const totpURI = (value as { totpURI?: unknown }).totpURI;

  return typeof totpURI === "string" && totpURI.length > 0 ? totpURI : null;
}

/**
 * Admin Security tab — tenant MFA policy + personal MFA enroll (ARCH-AUTH-001 Slice 12).
 * Session management remains on `/settings/security` (ARCH-USER-001).
 */
export function SystemAdminSecuritySettingsPanel({
  initialSettings,
}: SystemAdminSecuritySettingsPanelProps) {
  const [mfaPolicyRequired, setMfaPolicyRequired] = useState(
    initialSettings.mfaPolicyRequired
  );
  const [companyMfaOverride, setCompanyMfaOverride] = useState(
    initialSettings.companyMfaOverride
  );
  const [effectiveMfaRequired, setEffectiveMfaRequired] = useState(
    initialSettings.effectiveMfaRequired
  );
  const [userMfaEnabled, setUserMfaEnabled] = useState(
    initialSettings.userMfaEnabled
  );
  const [mfaEnrollPhase, setMfaEnrollPhase] =
    useState<AppShellAccountSettings06MfaEnrollPhase>("idle");
  const [userMfaReauthIntent, setUserMfaReauthIntent] =
    useState<UserMfaReauthIntent | null>(null);
  const [reauthPassword, setReauthPassword] = useState("");
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<readonly string[] | null>(
    null
  );
  const [mfaEnrollError, setMfaEnrollError] = useState<string | null>(null);
  const [policyPending, startPolicyTransition] = useTransition();
  const [companyOverridePending, startCompanyOverrideTransition] =
    useTransition();
  const [userMfaPending, startUserMfaTransition] = useTransition();

  const refreshUserMfaFromSession = useCallback(async () => {
    const sessionState = await authClient.getSession();
    const fromSession = readAfendaAuthSessionTwoFactorEnabled(
      sessionState.data
    );

    if (fromSession !== undefined) {
      setUserMfaEnabled(fromSession);
    }
  }, []);

  const resetMfaEnrollment = useCallback(() => {
    setMfaEnrollPhase("idle");
    setUserMfaReauthIntent(null);
    setReauthPassword("");
    setTotpUri(null);
    setTotpCode("");
    setBackupCodes(null);
    setMfaEnrollError(null);
  }, []);

  const handleMfaPolicyChange = (required: boolean) => {
    startPolicyTransition(async () => {
      const formData = new FormData();
      formData.set("mfaRequired", String(required));
      const result = await updateSecurityMfaPolicyAction(null, formData);

      if (result?.ok) {
        setMfaPolicyRequired(result.data.mfaRequired);
        setEffectiveMfaRequired(
          companyMfaOverride === "require"
            ? true
            : companyMfaOverride === "waive"
              ? false
              : result.data.mfaRequired
        );
      }
    });
  };

  const handleCompanyMfaOverrideChange = (
    override: SecuritySettingsViewModel["companyMfaOverride"]
  ) => {
    startCompanyOverrideTransition(async () => {
      const formData = new FormData();
      formData.set("override", override);
      const result = await updateCompanyMfaOverrideAction(null, formData);

      if (result?.ok) {
        setCompanyMfaOverride(result.data.override);
        setEffectiveMfaRequired(
          result.data.override === "require"
            ? true
            : result.data.override === "waive"
              ? false
              : mfaPolicyRequired
        );
      }
    });
  };

  const openUserMfaReauth = (intent: UserMfaReauthIntent) => {
    setMfaEnrollError(null);
    setReauthPassword("");
    setUserMfaReauthIntent(intent);
    setMfaEnrollPhase("reauth");
  };

  const submitUserMfaReauth = () => {
    if (userMfaReauthIntent === null) {
      return;
    }

    const password = reauthPassword.trim();

    if (password.length === 0) {
      setMfaEnrollError("Enter your current password to continue.");
      return;
    }

    startUserMfaTransition(async () => {
      setMfaEnrollError(null);

      try {
        if (userMfaReauthIntent === "enable") {
          const result = await twoFactor.enable({ password });

          if (result.error) {
            setMfaEnrollError(
              result.error.message ?? "Unable to start MFA enrollment."
            );
            return;
          }

          const nextTotpUri = readTotpUri(result.data);
          const nextBackupCodes = parseBackupCodes(
            (result.data as { backupCodes?: unknown } | null)?.backupCodes
          );

          setTotpUri(nextTotpUri);
          setBackupCodes(nextBackupCodes.length > 0 ? nextBackupCodes : null);
          setMfaEnrollPhase("verify-totp");
          setUserMfaReauthIntent(null);
          return;
        }

        const result = await twoFactor.disable({ password });

        if (result.error) {
          setMfaEnrollError(result.error.message ?? "Unable to disable MFA.");
          return;
        }

        resetMfaEnrollment();
        await refreshUserMfaFromSession();
      } catch (error: unknown) {
        setMfaEnrollError(
          error instanceof Error
            ? error.message
            : "MFA update failed. Try again."
        );
      }
    });
  };

  const submitTotpVerification = () => {
    const code = totpCode.trim();

    if (code.length === 0) {
      setMfaEnrollError("Enter the verification code from your authenticator.");
      return;
    }

    startUserMfaTransition(async () => {
      setMfaEnrollError(null);

      try {
        const result = await twoFactor.verifyTotp({ code });

        if (result.error) {
          setMfaEnrollError(
            result.error.message ?? "Verification failed. Try again."
          );
          return;
        }

        await refreshUserMfaFromSession();

        if (backupCodes !== null && backupCodes.length > 0) {
          setMfaEnrollPhase("backup-codes");
          return;
        }

        resetMfaEnrollment();
      } catch (error: unknown) {
        setMfaEnrollError(
          error instanceof Error
            ? error.message
            : "Verification failed. Try again."
        );
      }
    });
  };

  const reauthPrompt =
    userMfaReauthIntent === "disable"
      ? "Confirm your password to disable MFA."
      : "Confirm your password to start MFA enrollment.";

  return (
    <>
      <AppShellAccountSettings06
        backupCodes={backupCodes}
        mfaEnrollError={mfaEnrollError}
        mfaEnrollPhase={mfaEnrollPhase}
        mfaPolicyPending={policyPending || companyOverridePending}
        mfaPolicyRequired={mfaPolicyRequired}
        onCancelMfaEnroll={resetMfaEnrollment}
        onConfirmReauth={submitUserMfaReauth}
        onDisableUserMfa={() => openUserMfaReauth("disable")}
        onDismissBackupCodes={resetMfaEnrollment}
        onEnableUserMfa={() => openUserMfaReauth("enable")}
        onMfaPolicyChange={handleMfaPolicyChange}
        onReauthPasswordChange={setReauthPassword}
        onTotpCodeChange={setTotpCode}
        onVerifyTotp={submitTotpVerification}
        reauthPassword={reauthPassword}
        reauthPrompt={mfaEnrollPhase === "reauth" ? reauthPrompt : null}
        showSessions={false}
        totpCode={totpCode}
        totpUri={totpUri}
        userMfaEnabled={userMfaEnabled}
        userMfaPending={userMfaPending}
      />
      <section
        aria-label="Company MFA override"
        className="erp-system-admin-settings-form"
      >
        <h2>Company MFA override</h2>
        <p>
          Override tenant MFA policy for {initialSettings.companyLabel}.
          Effective enforcement for this workspace:{" "}
          {effectiveMfaRequired ? "required" : "optional"}.
        </p>
        <label htmlFor="company-mfa-override">Override mode</label>
        <select
          disabled={companyOverridePending}
          id="company-mfa-override"
          onChange={(event) => {
            handleCompanyMfaOverrideChange(
              event.currentTarget
                .value as SecuritySettingsViewModel["companyMfaOverride"]
            );
          }}
          value={companyMfaOverride}
        >
          <option value="inherit">Inherit tenant policy</option>
          <option value="require">Require MFA for this company</option>
          <option value="waive">Do not require MFA for this company</option>
        </select>
      </section>
    </>
  );
}
