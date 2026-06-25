import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { SystemAdminBillingSettingsPanel } from "@/components/system-admin/system-admin-billing-settings-panel";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveBillingSettings } from "@/lib/system-admin/resolve-billing-settings.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminSettingsBillingPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const initialSettings = await resolveBillingSettings();

  return (
    <AppShellMain
      contentLabel="Billing and usage"
      description="Subscription plan, usage metrics, and billing configuration."
      title="Billing & Usage"
    >
      <SystemAdminBillingSettingsPanel initialSettings={initialSettings} />
    </AppShellMain>
  );
}
