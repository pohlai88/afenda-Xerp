"use client";

import { Badge, Card, Separator, Switch } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings07AddOnRow {
  readonly badgeLabel?: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly id: string;
  readonly learnMoreHref?: string;
  readonly name: string;
  readonly priceLabel: string;
}

export interface AppShellAccountSettings07AddOnsProps {
  readonly addOns: readonly AppShellAccountSettings07AddOnRow[];
  readonly onToggle?: (addOnId: string, enabled: boolean) => void;
  readonly pending?: boolean;
}

export function AppShellAccountSettings07AddOns({
  addOns,
  onToggle,
  pending = false,
}: AppShellAccountSettings07AddOnsProps) {
  return (
    <AppShellAccountSettingsPanelSection
      description="Manage your add-ons and subscription options."
      title="Add-ons"
    >
      <div className="app-shell-studio-account-settings-07__addon-stack">
        {addOns.map((addOn) => (
          <Card key={addOn.id}>
            <div className="app-shell-studio-account-settings-06__panel">
              <p className="app-shell-studio-account-settings-06__description">
                {addOn.priceLabel}
              </p>
              <div className="app-shell-studio-account-settings-07__addon-title-row">
                <p className="app-shell-studio-account-settings-02__item-title">
                  {addOn.name}
                </p>
                {addOn.badgeLabel ? (
                  <Badge emphasis="soft" tone="info">
                    {addOn.badgeLabel}
                  </Badge>
                ) : null}
              </div>
              <p className="app-shell-studio-account-settings-06__description">
                {addOn.description}
              </p>
              <Separator />
              <div className="app-shell-studio-account-settings-07__addon-actions">
                <div className="app-shell-studio-account-settings-02__toggle-row">
                  <Switch
                    aria-label={`Activate ${addOn.name}`}
                    checked={addOn.enabled}
                    disabled={pending || !onToggle}
                    onCheckedChange={(checked) => onToggle?.(addOn.id, checked)}
                    size="md"
                  />
                  <p className="app-shell-studio-account-settings-06__description">
                    Activate
                  </p>
                </div>
                {addOn.learnMoreHref ? (
                  <a
                    className="app-shell-studio-account-settings-07__learn-more"
                    href={addOn.learnMoreHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Learn more
                  </a>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings07AddOnsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Card" | "Separator" | "Switch"
>;
