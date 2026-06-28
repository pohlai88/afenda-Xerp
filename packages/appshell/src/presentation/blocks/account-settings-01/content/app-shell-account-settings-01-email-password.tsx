"use client";

import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export function AppShellAccountSettings01EmailPassword() {
  const sectionId = useId();
  const emailId = `${sectionId}-email`;

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage email and password settings through the identity provider."
      title="Email & password"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-01__field-grid">
        <div className="app-shell-studio-account-settings-01__field">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            disabled
            id={emailId}
            placeholder="Managed by identity provider"
            readOnly
            value=""
          />
        </div>
      </div>
      <div className="app-shell-studio-account-settings-01__actions">
        <Button disabled emphasis="outline" intent="secondary" size="md">
          Change password
        </Button>
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings01EmailPasswordGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;
