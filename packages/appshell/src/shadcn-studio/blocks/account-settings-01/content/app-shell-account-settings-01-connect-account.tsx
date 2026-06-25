"use client";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

const CONNECTED_ACCOUNTS = [
  { id: "google", name: "Google" },
  { id: "slack", name: "Slack" },
] as const;

export function AppShellAccountSettings01ConnectAccount() {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Connect third-party accounts for sign-in and integrations."
      title="Connected accounts"
      titleId={sectionId}
    >
      <ul className="app-shell-studio-account-settings-01__connected-list">
        {CONNECTED_ACCOUNTS.map((account) => (
          <li
            className="app-shell-studio-account-settings-01__connected-row"
            key={account.id}
          >
            <span>{account.name}</span>
            <Button disabled emphasis="outline" intent="secondary" size="sm">
              Disconnect
            </Button>
          </li>
        ))}
      </ul>
      <div className="app-shell-studio-account-settings-01__actions">
        <Button disabled emphasis="outline" intent="secondary" size="md">
          Connect account
        </Button>
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings01ConnectAccountGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;
