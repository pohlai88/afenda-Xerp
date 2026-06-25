"use client";

/**
 * Normalized account-settings-02 (notifications) — shadcn/studio Pro promotion.
 * Source: @ss-blocks/account-settings-02 staged in packages/ui.
 */

import { Button, Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { ReactNode } from "react";

import {
  AppShellAccountSettings02AllNotifications,
  type AppShellAccountSettings02AllNotificationsProps,
} from "./account-settings-02/content/app-shell-account-settings-02-all-notifications";
import {
  AppShellAccountSettings02BrowserNotification,
  type AppShellAccountSettings02BrowserNotificationProps,
} from "./account-settings-02/content/app-shell-account-settings-02-browser-notification";
import {
  AppShellAccountSettings02DoNotDisturb,
  type AppShellAccountSettings02DoNotDisturbProps,
} from "./account-settings-02/content/app-shell-account-settings-02-do-not-disturb";
import {
  AppShellAccountSettings02InboxPreference,
  type AppShellAccountSettings02InboxPreferenceProps,
} from "./account-settings-02/content/app-shell-account-settings-02-inbox-preference";

export interface AppShellAccountSettings02Props {
  readonly allNotifications?: AppShellAccountSettings02AllNotificationsProps;
  readonly browserNotification?: AppShellAccountSettings02BrowserNotificationProps;
  readonly doNotDisturb?: AppShellAccountSettings02DoNotDisturbProps;
  readonly inboxPreference?: AppShellAccountSettings02InboxPreferenceProps;
  readonly onSave?: () => void;
  readonly savePending?: boolean;
  readonly saveSlot?: ReactNode;
}

export function AppShellAccountSettings02({
  allNotifications,
  browserNotification,
  doNotDisturb,
  inboxPreference,
  onSave,
  savePending = false,
  saveSlot,
}: AppShellAccountSettings02Props) {
  return (
    <div className="app-shell-studio-account-settings-02">
      {allNotifications ? (
        <AppShellAccountSettings02AllNotifications {...allNotifications} />
      ) : null}
      {inboxPreference ? (
        <>
          <Separator />
          <AppShellAccountSettings02InboxPreference {...inboxPreference} />
        </>
      ) : null}
      {browserNotification ? (
        <>
          <Separator />
          <AppShellAccountSettings02BrowserNotification
            {...browserNotification}
          />
        </>
      ) : null}
      {doNotDisturb ? (
        <>
          <Separator />
          <AppShellAccountSettings02DoNotDisturb {...doNotDisturb} />
        </>
      ) : null}
      {saveSlot ??
        (onSave ? (
          <div className="app-shell-studio-account-settings-02__save-row">
            <Button
              aria-busy={savePending}
              disabled={savePending}
              emphasis="solid"
              intent="primary"
              onClick={onSave}
              presentation="default"
              size="md"
              type="button"
            >
              Save changes
            </Button>
          </div>
        ) : null)}
    </div>
  );
}

export type AppShellAccountSettings02GovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Separator"
>;
