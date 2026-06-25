import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { SystemAdminNotificationsSettingsPanel } from "@/components/system-admin/system-admin-notifications-settings-panel";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveNotificationsSettings } from "@/lib/system-admin/resolve-notifications-settings.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminSettingsNotificationsPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const initialSettings = await resolveNotificationsSettings();

  return (
    <AppShellMain
      contentLabel="Notification settings"
      description="Platform-wide notification and alert configuration."
      title="Notifications"
    >
      <SystemAdminNotificationsSettingsPanel
        initialSettings={initialSettings}
      />
    </AppShellMain>
  );
}
