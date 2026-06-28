"use client";

/**
 * Normalized scaffold for account-settings-01 (shadcn/studio Pro block).
 *
 * Source: @ss-blocks/account-settings-01 (ADR-0017 §Promotion pipeline).
 * Q1 — studio semantic classes in afenda-appshell-studio.css §J
 * Q2 — governed @afenda/ui primitives only
 * Q3 — ERP injects SystemAdminSettingsForm via personalInfoSection
 */

import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { ReactNode } from "react";

import type { AppShellAccountSettings01ConnectAccountGovernedComponents } from "./account-settings-01/content/app-shell-account-settings-01-connect-account";
import { AppShellAccountSettings01ConnectAccount } from "./account-settings-01/content/app-shell-account-settings-01-connect-account";
import type { AppShellAccountSettings01DangerZoneGovernedComponents } from "./account-settings-01/content/app-shell-account-settings-01-danger-zone";
import { AppShellAccountSettings01DangerZone } from "./account-settings-01/content/app-shell-account-settings-01-danger-zone";
import type { AppShellAccountSettings01EmailPasswordGovernedComponents } from "./account-settings-01/content/app-shell-account-settings-01-email-password";
import { AppShellAccountSettings01EmailPassword } from "./account-settings-01/content/app-shell-account-settings-01-email-password";
import { AppShellAccountSettings01PersonalInfo } from "./account-settings-01/content/app-shell-account-settings-01-personal-info";
import type { AppShellAccountSettings01SocialUrlGovernedComponents } from "./account-settings-01/content/app-shell-account-settings-01-social-url";
import { AppShellAccountSettings01SocialUrl } from "./account-settings-01/content/app-shell-account-settings-01-social-url";

export type AppShellAccountSettings01GovernedComponents = Extract<
  GovernedUiComponentName,
  | AppShellAccountSettings01ConnectAccountGovernedComponents
  | AppShellAccountSettings01DangerZoneGovernedComponents
  | AppShellAccountSettings01EmailPasswordGovernedComponents
  | AppShellAccountSettings01SocialUrlGovernedComponents
>;

export interface AppShellAccountSettings01Props {
  readonly connectAccountSection?: ReactNode;
  readonly dangerZoneSection?: ReactNode;
  readonly emailPasswordSection?: ReactNode;
  readonly personalInfoSection?: ReactNode;
  readonly socialUrlSection?: ReactNode;
}

export function AppShellAccountSettings01({
  personalInfoSection,
  emailPasswordSection,
  connectAccountSection,
  socialUrlSection,
  dangerZoneSection,
}: AppShellAccountSettings01Props) {
  return (
    <div className="app-shell-studio-account-settings-01">
      <section
        aria-label="Personal information"
        className="app-shell-studio-account-settings-01__section"
      >
        {personalInfoSection ?? <AppShellAccountSettings01PersonalInfo />}
      </section>
      <section
        aria-label="Email and password"
        className="app-shell-studio-account-settings-01__section"
      >
        {emailPasswordSection ?? <AppShellAccountSettings01EmailPassword />}
      </section>
      <section
        aria-label="Connected accounts"
        className="app-shell-studio-account-settings-01__section"
      >
        {connectAccountSection ?? <AppShellAccountSettings01ConnectAccount />}
      </section>
      <section
        aria-label="Social profiles"
        className="app-shell-studio-account-settings-01__section"
      >
        {socialUrlSection ?? <AppShellAccountSettings01SocialUrl />}
      </section>
      <section
        aria-label="Danger zone"
        className="app-shell-studio-account-settings-01__section app-shell-studio-account-settings-01__section--danger"
      >
        {dangerZoneSection ?? <AppShellAccountSettings01DangerZone />}
      </section>
    </div>
  );
}
