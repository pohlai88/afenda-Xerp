"use client";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export function AppShellAccountSettings01DangerZone() {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Delete workspace data permanently. This action cannot be undone."
      title="Danger zone"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-01__danger-row">
        <div>
          <p className="app-shell-studio-account-settings-06__title">
            Delete account
          </p>
          <p className="app-shell-studio-account-settings-06__description">
            Account deletion is managed through tenant policy workflows.
          </p>
        </div>
        <Button
          disabled
          emphasis="outline"
          intent="destructive"
          presentation="default"
          size="md"
        >
          Delete
        </Button>
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings01DangerZoneGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;
