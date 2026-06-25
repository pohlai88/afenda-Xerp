import { AppShellMain } from "@afenda/appshell";
import { notFound } from "next/navigation";

import { UserNotificationsSettingsPanel } from "@/components/user-settings/user-notifications-settings-panel";
import { resolveUserPreferences } from "@/lib/user-settings/resolve-user-preferences.server";
import { buildDefaultUserNotificationsSettings } from "@/lib/user-settings/user-settings-blocks.contract";

export default async function UserSettingsNotificationsPage() {
  const preferencesResult = await resolveUserPreferences();

  if (preferencesResult.kind !== "ready") {
    notFound();
  }

  const initialSettings =
    preferencesResult.preferences.notifications ??
    buildDefaultUserNotificationsSettings();

  return (
    <AppShellMain
      contentLabel="Notification settings"
      description="Personal notification preferences for email, desktop, and in-app alerts."
      title="Notifications"
    >
      <UserNotificationsSettingsPanel initialSettings={initialSettings} />
    </AppShellMain>
  );
}
