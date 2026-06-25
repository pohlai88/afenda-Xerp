"use client";

import { Button, Input, Label, Progress, Switch } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings07SpendManagementProps {
  readonly enabled: boolean;
  readonly limitAmountLabel: string;
  readonly notificationEmail: string;
  readonly onEnabledChange?: (enabled: boolean) => void;
  readonly onNotificationEmailChange?: (value: string) => void;
  readonly onSetAmountChange?: (value: string) => void;
  readonly onUpdate?: () => void;
  readonly pending?: boolean;
  readonly progressPercent: number;
  readonly setAmount: string;
  readonly usedAmountLabel: string;
}

export function AppShellAccountSettings07SpendManagement({
  enabled,
  limitAmountLabel,
  notificationEmail,
  onEnabledChange,
  onNotificationEmailChange,
  onSetAmountChange,
  onUpdate,
  pending = false,
  progressPercent,
  setAmount,
  usedAmountLabel,
}: AppShellAccountSettings07SpendManagementProps) {
  const sectionId = useId();
  const amountId = `${sectionId}-amount`;
  const emailId = `${sectionId}-email`;

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage your spend and subscription options."
      title="Spend management"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-07__spend-header">
        <div className="app-shell-studio-account-settings-07__spend-meter">
          <div className="app-shell-studio-account-settings-07__spend-progress-wrap">
            <Progress value={progressPercent} />
            <span className="app-shell-studio-account-settings-07__spend-percent">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div>
            <p className="app-shell-studio-account-settings-02__item-title">
              {usedAmountLabel} / {limitAmountLabel}
            </p>
            <p className="app-shell-studio-account-settings-06__description">
              {enabled
                ? "Spend management enabled"
                : "Spend management disabled"}
            </p>
          </div>
        </div>
        <Switch
          aria-busy={pending}
          checked={enabled}
          disabled={pending || !onEnabledChange}
          size="md"
          {...(onEnabledChange ? { onCheckedChange: onEnabledChange } : {})}
        />
      </div>
      {enabled ? (
        <div className="app-shell-studio-account-settings-07__spend-form">
          <div className="app-shell-studio-account-settings-03__field">
            <Label htmlFor={amountId}>Set amount ($)</Label>
            <Input
              disabled={pending || !onSetAmountChange}
              id={amountId}
              onChange={(event) =>
                onSetAmountChange?.(event.currentTarget.value)
              }
              type="tel"
              value={setAmount}
            />
          </div>
          <div className="app-shell-studio-account-settings-03__field">
            <Label htmlFor={emailId}>Provide email for notifications</Label>
            <Input
              disabled={pending || !onNotificationEmailChange}
              id={emailId}
              onChange={(event) =>
                onNotificationEmailChange?.(event.currentTarget.value)
              }
              type="email"
              value={notificationEmail}
            />
          </div>
          {onUpdate ? (
            <div className="app-shell-studio-account-settings-02__save-row">
              <Button
                aria-busy={pending}
                disabled={pending}
                emphasis="solid"
                intent="primary"
                onClick={onUpdate}
                presentation="default"
                size="md"
                type="button"
              >
                Update
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings07SpendManagementGovernedComponents =
  Extract<
    GovernedUiComponentName,
    "Button" | "Input" | "Label" | "Progress" | "Switch"
  >;
