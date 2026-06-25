"use client";

import { AppShellAccountSettingsPanelSection } from "@afenda/appshell";

import type { SystemAdminSettingsFormValues } from "@/lib/system-admin/resolve-system-admin-settings-form-values";

import { SystemAdminSettingsForm } from "./system-admin-settings-form";

export interface SystemAdminGeneralSettingsPanelProps {
  readonly formValues: SystemAdminSettingsFormValues;
}

/**
 * Tenant General settings — company display name only (ARCH-USER-001 Slice 6).
 * Personal profile block 01 sections live on `/settings/profile`.
 */
export function SystemAdminGeneralSettingsPanel({
  formValues,
}: SystemAdminGeneralSettingsPanelProps) {
  return (
    <AppShellAccountSettingsPanelSection
      description="Organization name and core tenant configuration."
      title="Tenant settings"
    >
      <SystemAdminSettingsForm formValues={formValues} variant="general" />
    </AppShellAccountSettingsPanelSection>
  );
}
