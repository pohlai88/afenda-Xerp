"use client";

import { AppShellAccountSettings06Policy } from "@afenda/appshell";
import { useState, useTransition } from "react";

import type { SecuritySettingsViewModel } from "@/lib/system-admin/resolve-security-settings.server";
import { updateSecurityMfaPolicyAction } from "@/lib/system-admin/update-security-mfa-policy.action";

export interface SystemAdminSecuritySettingsPanelProps {
  readonly initialSettings: Pick<
    SecuritySettingsViewModel,
    "mfaPolicyRequired"
  >;
}

/**
 * Admin Security tab — tenant MFA policy only (ARCH-USER-001 Slice 6).
 * Personal MFA + sessions: `/settings/security` via `UserSecuritySettingsPanel`.
 */
export function SystemAdminSecuritySettingsPanel({
  initialSettings,
}: SystemAdminSecuritySettingsPanelProps) {
  const [mfaPolicyRequired, setMfaPolicyRequired] = useState(
    initialSettings.mfaPolicyRequired
  );
  const [policyPending, startPolicyTransition] = useTransition();

  const handleMfaPolicyChange = (required: boolean) => {
    startPolicyTransition(async () => {
      const formData = new FormData();
      formData.set("mfaRequired", String(required));
      const result = await updateSecurityMfaPolicyAction(null, formData);

      if (result?.ok) {
        setMfaPolicyRequired(result.data.mfaRequired);
      }
    });
  };

  return (
    <AppShellAccountSettings06Policy
      mfaPolicyPending={policyPending}
      mfaPolicyRequired={mfaPolicyRequired}
      onMfaPolicyChange={handleMfaPolicyChange}
    />
  );
}
