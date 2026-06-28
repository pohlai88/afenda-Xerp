"use client";

import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export function AppShellAccountSettings01PersonalInfo() {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage personal information and role metadata for this workspace."
      title="Personal information"
      titleId={sectionId}
    >
      <p className="app-shell-studio-account-settings__lead">
        Personal profile fields are managed through the General settings form.
      </p>
    </AppShellAccountSettingsPanelSection>
  );
}
