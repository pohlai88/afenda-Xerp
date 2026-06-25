"use client";

import { Button, Input } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export function AppShellAccountSettings01SocialUrl() {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage public social profile URLs."
      title="Social URLs"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-01__field-stack">
        <Input
          disabled
          placeholder="Link to social profile"
          readOnly
          value=""
        />
        <Input
          disabled
          placeholder="Link to social profile"
          readOnly
          value=""
        />
      </div>
      <div className="app-shell-studio-account-settings-01__actions">
        <Button disabled emphasis="outline" intent="secondary" size="md">
          Add URL
        </Button>
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings01SocialUrlGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input"
>;
