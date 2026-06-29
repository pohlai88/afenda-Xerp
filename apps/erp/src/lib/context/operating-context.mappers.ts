import type { TenantLookupRow } from "@afenda/database";
import { parseUnknownTenantContext, type TenantContext } from "@afenda/kernel";

import { mapPlatformLifecycleStatusToTenantSaasLifecyclePhase } from "./map-tenant-saas-lifecycle-phase";

/** Maps database tenant lookup rows to kernel `TenantContext` at the ERP trust boundary. */
export function toTenantContext(row: TenantLookupRow): TenantContext {
  return parseUnknownTenantContext({
    tenantId: row.enterpriseId,
    slug: row.slug,
    displayName: row.name,
    status: row.status,
    saasLifecyclePhase: mapPlatformLifecycleStatusToTenantSaasLifecyclePhase(
      row.status
    ),
  });
}
