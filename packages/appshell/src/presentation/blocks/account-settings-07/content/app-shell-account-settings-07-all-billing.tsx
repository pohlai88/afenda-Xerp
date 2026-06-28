"use client";

import { Progress, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings07UsageRow {
  readonly id: string;
  readonly includedText: string;
  readonly priceLabel: string;
  readonly title: string;
  readonly usedText: string;
  readonly value: number;
}

export interface AppShellAccountSettings07AllBillingProps {
  readonly extraLineDescription?: string;
  readonly extraLinePrice?: string;
  readonly extraLineTitle?: string;
  readonly planDescription: string;
  readonly planName: string;
  readonly planPriceLabel: string;
  readonly totalAmountLabel: string;
  readonly totalLabel: string;
  readonly usageRows: readonly AppShellAccountSettings07UsageRow[];
}

export function AppShellAccountSettings07AllBilling({
  extraLineDescription,
  extraLinePrice,
  extraLineTitle,
  planDescription,
  planName,
  planPriceLabel,
  totalAmountLabel,
  totalLabel,
  usageRows,
}: AppShellAccountSettings07AllBillingProps) {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Overview of current billing cycle based on fixed and on-demand charges."
      title="Billing"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-07__plan-row">
        <div>
          <p className="app-shell-studio-account-settings-02__item-title">
            {planName}
          </p>
          <p className="app-shell-studio-account-settings-06__description">
            {planDescription}
          </p>
        </div>
        <p className="app-shell-studio-account-settings-02__item-title">
          {planPriceLabel}
        </p>
      </div>
      <Separator />
      {usageRows.map((row) => (
        <div key={row.id}>
          <div className="app-shell-studio-account-settings-07__usage-row">
            <div>
              <p className="app-shell-studio-account-settings-02__item-title">
                {row.title}
              </p>
              <Progress value={row.value} />
              <div className="app-shell-studio-account-settings-07__usage-meta">
                <p className="app-shell-studio-account-settings-06__description">
                  {row.usedText}
                </p>
                <p className="app-shell-studio-account-settings-06__description">
                  {row.includedText}
                </p>
              </div>
            </div>
            <p className="app-shell-studio-account-settings-02__item-title">
              {row.priceLabel}
            </p>
          </div>
          <Separator />
        </div>
      ))}
      {extraLineTitle ? (
        <>
          <div className="app-shell-studio-account-settings-07__plan-row">
            <div>
              <p className="app-shell-studio-account-settings-02__item-title">
                {extraLineTitle}
              </p>
              {extraLineDescription ? (
                <p className="app-shell-studio-account-settings-06__description">
                  {extraLineDescription}
                </p>
              ) : null}
            </div>
            {extraLinePrice ? (
              <p className="app-shell-studio-account-settings-02__item-title">
                {extraLinePrice}
              </p>
            ) : null}
          </div>
          <Separator />
        </>
      ) : null}
      <div className="app-shell-studio-account-settings-07__plan-row">
        <p className="app-shell-studio-account-settings-02__item-title">
          {totalLabel}
        </p>
        <p className="app-shell-studio-account-settings-02__item-title">
          {totalAmountLabel}
        </p>
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings07AllBillingGovernedComponents = Extract<
  GovernedUiComponentName,
  "Progress" | "Separator"
>;
