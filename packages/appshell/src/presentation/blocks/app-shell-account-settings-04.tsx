"use client";

/**
 * Normalized account-settings-04 (integrations) — shadcn/studio Pro promotion.
 */

import { Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  AppShellAccountSettings04IntegrationSection,
  type AppShellAccountSettings04IntegrationSectionProps,
} from "./account-settings-04/content/app-shell-account-settings-04-integration-section";

export interface AppShellAccountSettings04Props {
  readonly communication?: AppShellAccountSettings04IntegrationSectionProps;
  readonly planning?: AppShellAccountSettings04IntegrationSectionProps;
  readonly tools?: AppShellAccountSettings04IntegrationSectionProps;
}

export type {
  AppShellAccountSettings04IntegrationApp,
  AppShellAccountSettings04IntegrationSectionProps,
} from "./account-settings-04/content/app-shell-account-settings-04-integration-section";

export function AppShellAccountSettings04({
  communication,
  planning,
  tools,
}: AppShellAccountSettings04Props) {
  return (
    <div className="app-shell-studio-account-settings-02">
      {communication ? (
        <AppShellAccountSettings04IntegrationSection {...communication} />
      ) : null}
      {planning ? (
        <>
          <Separator />
          <AppShellAccountSettings04IntegrationSection {...planning} />
        </>
      ) : null}
      {tools ? (
        <>
          <Separator />
          <AppShellAccountSettings04IntegrationSection {...tools} />
        </>
      ) : null}
    </div>
  );
}

export type AppShellAccountSettings04GovernedComponents = Extract<
  GovernedUiComponentName,
  "Separator"
>;
