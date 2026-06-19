/**
 * Commercial entitlement provisioning — writes grants and limits at plan activation.
 */
import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import {
  entitlementGrants,
  tenantCommercialPlans,
  usageLimitCounters,
} from "../schema/entitlement.schema.js";
import {
  assertValidPlanTemplateId,
  EntitlementProvisionError,
  materializeGrantRows,
  materializeUsageLimitRows,
  type ProvisionEntitlementBundleInput,
} from "./entitlement.contract.js";
import { getCommercialPlanTemplate } from "./plan-templates.js";

export interface EntitlementProvisionAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type ProvisionTenantEntitlementsInput =
  ProvisionEntitlementBundleInput & {
    readonly audit: EntitlementProvisionAuditContext;
  };

export interface ProvisionTenantEntitlementsResult {
  readonly entitlementCount: number;
  readonly planTemplateId: string;
  readonly tenantId: string;
  readonly usageLimitCount: number;
}

/** Materializes a commercial plan template into tenant-scoped entitlement grants. */
export async function provisionTenantEntitlements(
  input: ProvisionTenantEntitlementsInput,
  db: AfendaDatabase = getDb()
): Promise<ProvisionTenantEntitlementsResult> {
  assertValidPlanTemplateId(input.planTemplateId);

  const template = getCommercialPlanTemplate(input.planTemplateId);

  if (!template) {
    throw new EntitlementProvisionError(
      `Commercial plan template "${input.planTemplateId}" is not registered.`
    );
  }

  const grantRows = materializeGrantRows(template, input.tenantId);
  const limitRows = materializeUsageLimitRows(template, input.tenantId);

  await db.transaction(async (tx) => {
    await tx
      .delete(entitlementGrants)
      .where(eq(entitlementGrants.tenantId, input.tenantId));
    await tx
      .delete(usageLimitCounters)
      .where(eq(usageLimitCounters.tenantId, input.tenantId));

    if (grantRows.length > 0) {
      await tx.insert(entitlementGrants).values(
        grantRows.map((grant) => ({
          tenantId: grant.tenantId,
          companyId: grant.companyId,
          key: grant.key,
          type: grant.type,
          scope: grant.scope,
          environment: grant.environment,
          enabled: grant.enabled,
          metadata: grant.metadata,
        }))
      );
    }

    if (limitRows.length > 0) {
      await tx.insert(usageLimitCounters).values(
        limitRows.map((limit) => ({
          tenantId: limit.tenantId,
          key: limit.key,
          scope: limit.scope,
          period: limit.period,
          maximum: limit.maximum,
          used: limit.used,
          unit: limit.unit,
        }))
      );
    }

    await tx
      .insert(tenantCommercialPlans)
      .values({
        tenantId: input.tenantId,
        planTemplateId: input.planTemplateId,
        correlationId: input.correlationId,
      })
      .onConflictDoUpdate({
        target: tenantCommercialPlans.tenantId,
        set: {
          planTemplateId: input.planTemplateId,
          correlationId: input.correlationId,
          updatedAt: new Date(),
        },
      });
  });

  await insertAuditEvent(
    {
      actorType: input.audit.actorType,
      actorUserId: input.audit.actorUserId ?? null,
      tenantId: input.tenantId,
      module: "platform",
      action: "entitlement.provision",
      targetType: "tenant",
      targetId: input.tenantId,
      result: "success",
      source: input.audit.source ?? "system",
      correlationId: input.audit.correlationId,
      ipAddress: input.audit.ipAddress ?? null,
      userAgent: input.audit.userAgent ?? null,
      metadata: {
        planTemplateId: input.planTemplateId,
        entitlementCount: String(grantRows.length),
        usageLimitCount: String(limitRows.length),
      },
    },
    db
  );

  return {
    tenantId: input.tenantId,
    planTemplateId: input.planTemplateId,
    entitlementCount: grantRows.length,
    usageLimitCount: limitRows.length,
  };
}
