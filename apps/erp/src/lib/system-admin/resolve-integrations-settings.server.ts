import {
  listTenantSsoProvidersByTenantId,
  type TenantIntegrationsSettings,
  type TenantSsoProviderSummary,
} from "@afenda/database";
import { resolveSystemAdminSectionAccess } from "./resolve-system-admin-section-access.server";
import {
  buildDefaultIntegrationsSettings,
  resolveIntegrationsSettings,
} from "./resolve-tenant-settings.server";

export interface IntegrationsSettingsPageData {
  readonly integrations: TenantIntegrationsSettings;
  readonly ssoProviders: readonly TenantSsoProviderSummary[];
}

export { resolveIntegrationsSettings };

export async function resolveIntegrationsSettingsPageData(): Promise<IntegrationsSettingsPageData> {
  const access = await resolveSystemAdminSectionAccess("settings");
  if (access.kind !== "allowed") {
    return {
      integrations: buildDefaultIntegrationsSettings(),
      ssoProviders: [],
    };
  }

  const tenantId = access.operatingContext.tenant.tenantId;
  const [integrations, ssoProviders] = await Promise.all([
    resolveIntegrationsSettings(),
    listTenantSsoProvidersByTenantId(tenantId),
  ]);

  return { integrations, ssoProviders };
}
