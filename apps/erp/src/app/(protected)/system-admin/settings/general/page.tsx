import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { SystemAdminGeneralSettingsPanel } from "@/components/system-admin/system-admin-general-settings-panel";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";
import { resolveSystemAdminSettingsFormValues } from "@/lib/system-admin/resolve-system-admin-settings-form-values";

export default async function SystemAdminSettingsGeneralPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const formValues = resolveSystemAdminSettingsFormValues(
    access.operatingContext
  );

  return (
    <AppShellMain
      contentLabel="General settings"
      description="Organization name and core platform configuration."
      title="General"
    >
      <SystemAdminGeneralSettingsPanel formValues={formValues} />
    </AppShellMain>
  );
}
