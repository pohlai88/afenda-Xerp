import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { SystemAdminIntegrationsSettingsPanel } from "@/components/system-admin/system-admin-integrations-settings-panel";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveIntegrationsSettingsPageData } from "@/lib/system-admin/resolve-integrations-settings.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminSettingsIntegrationsPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const pageData = await resolveIntegrationsSettingsPageData();

  return (
    <AppShellMain
      contentLabel="Integration settings"
      description="Third-party service connections and API configuration."
      title="Integrations"
    >
      <SystemAdminIntegrationsSettingsPanel
        initialIntegrations={pageData.integrations}
        initialSsoProviders={pageData.ssoProviders}
      />
    </AppShellMain>
  );
}
