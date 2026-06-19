/**
 * Commercial entitlement loading — reads persisted grants for evaluation hydration.
 */
import { eq } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import {
  entitlementGrants,
  tenantCommercialPlans,
  usageLimitCounters,
} from "../schema/entitlement.schema.js";
import {
  assertValidPlanTemplateId,
  type TenantEntitlementBundle,
} from "./entitlement.contract.js";

export async function loadTenantEntitlementBundle(
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<TenantEntitlementBundle> {
  const [grantRows, limitRows, planRow] = await Promise.all([
    db
      .select({
        tenantId: entitlementGrants.tenantId,
        companyId: entitlementGrants.companyId,
        key: entitlementGrants.key,
        type: entitlementGrants.type,
        scope: entitlementGrants.scope,
        environment: entitlementGrants.environment,
        enabled: entitlementGrants.enabled,
        metadata: entitlementGrants.metadata,
      })
      .from(entitlementGrants)
      .where(eq(entitlementGrants.tenantId, tenantId)),
    db
      .select({
        tenantId: usageLimitCounters.tenantId,
        key: usageLimitCounters.key,
        scope: usageLimitCounters.scope,
        period: usageLimitCounters.period,
        maximum: usageLimitCounters.maximum,
        used: usageLimitCounters.used,
        unit: usageLimitCounters.unit,
      })
      .from(usageLimitCounters)
      .where(eq(usageLimitCounters.tenantId, tenantId)),
    db
      .select({
        planTemplateId: tenantCommercialPlans.planTemplateId,
      })
      .from(tenantCommercialPlans)
      .where(eq(tenantCommercialPlans.tenantId, tenantId))
      .limit(1),
  ]);

  const planTemplateId = planRow[0]?.planTemplateId ?? null;

  if (planTemplateId !== null) {
    assertValidPlanTemplateId(planTemplateId);
  }

  return {
    tenantId,
    planTemplateId,
    loadedAt: new Date().toISOString(),
    entitlements: grantRows.map((row) => ({
      tenantId: row.tenantId,
      companyId: row.companyId,
      key: row.key,
      type: row.type,
      scope: row.scope,
      environment: row.environment,
      enabled: row.enabled,
      metadata: row.metadata as Readonly<Record<string, unknown>>,
    })),
    usageLimits: limitRows.map((row) => ({
      tenantId: row.tenantId,
      key: row.key,
      scope: row.scope,
      period: row.period,
      maximum: row.maximum,
      used: row.used,
      unit: row.unit,
    })),
  };
}
