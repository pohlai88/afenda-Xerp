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

function isMissingDatabaseRelationError(error: unknown): boolean {
  const candidate =
    typeof error === "object" && error !== null && "cause" in error
      ? error.cause
      : error;

  return (
    typeof candidate === "object" &&
    candidate !== null &&
    "code" in candidate &&
    candidate.code === "42P01"
  );
}

async function listTenantSsoProvidersSafely(
  tenantId: string
): Promise<readonly TenantSsoProviderSummary[]> {
  try {
    return await listTenantSsoProvidersByTenantId(tenantId);
  } catch (error) {
    if (isMissingDatabaseRelationError(error)) {
      return [];
    }

    throw error;
  }
}

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
    listTenantSsoProvidersSafely(tenantId),
  ]);

  return { integrations, ssoProviders };
}
