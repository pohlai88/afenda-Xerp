"use client";

import { Label, Switch } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings02InboxItem {
  readonly description: string;
  readonly enabled: boolean;
  readonly id: string;
  readonly label: string;
}

export interface AppShellAccountSettings02InboxPreferenceProps {
  readonly items: readonly AppShellAccountSettings02InboxItem[];
  readonly onChange?: (id: string, enabled: boolean) => void;
  readonly pending?: boolean;
}

export function AppShellAccountSettings02InboxPreference({
  items,
  onChange,
  pending = false,
}: AppShellAccountSettings02InboxPreferenceProps) {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage your inbox settings and notification preferences."
      title="Inbox preferences"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-02__toggle-list">
        {items.map((item) => {
          const controlId = `${sectionId}-${item.id}`;

          return (
            <div
              className="app-shell-studio-account-settings-02__toggle-row"
              key={item.id}
            >
              <Switch
                aria-busy={pending}
                checked={item.enabled}
                disabled={pending || !onChange}
                id={controlId}
                {...(onChange
                  ? {
                      onCheckedChange: (checked: boolean) =>
                        onChange(item.id, checked),
                    }
                  : {})}
                size="md"
              />
              <div className="app-shell-studio-account-settings-02__toggle-copy">
                <Label htmlFor={controlId}>{item.label}</Label>
                <p className="app-shell-studio-account-settings-06__description">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings02InboxPreferenceGovernedComponents =
  Extract<GovernedUiComponentName, "Label" | "Switch">;
