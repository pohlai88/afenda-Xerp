import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { SystemAdminSecuritySettingsPanel } from "@/components/system-admin/system-admin-security-settings-panel";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { resolveActionSession } from "@/lib/server-actions/resolve-action-session";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveSecuritySettings } from "@/lib/system-admin/resolve-security-settings.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminSettingsSecurityPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  if (access.kind !== "allowed") {
    return (
      <AppShellMain
        contentLabel="Security settings"
        description="Authentication, session, and access policy configuration."
        title="Security"
      >
        <p>
          Security settings are not available for your current access level.
        </p>
      </AppShellMain>
    );
  }

  const sessionResult = await resolveActionSession();
  if (!sessionResult.ok) {
    return (
      <AppShellMain
        contentLabel="Security settings"
        description="Authentication, session, and access policy configuration."
        title="Security"
      >
        <p>Sign in to manage security settings.</p>
      </AppShellMain>
    );
  }

  const initialSettings = await resolveSecuritySettings(
    access.operatingContext,
    sessionResult.session
  );

  return (
    <AppShellMain
      contentLabel="Security settings"
      description="Authentication, session, and access policy configuration."
      title="Security"
    >
      <SystemAdminSecuritySettingsPanel initialSettings={initialSettings} />
    </AppShellMain>
  );
}
