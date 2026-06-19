/**
 * Commercial entitlement provisioning — types and pure boundary checks (no I/O).
 *
 * Table: `schema/entitlement.schema.ts`
 * Writes: `entitlement-provision.service.ts`
 * Reads: `entitlement-load.service.ts`
 */
import type {
  CommercialPlanTemplateId,
  EntitlementScope,
  EntitlementType,
  UsageLimitPeriod,
} from "../database.types.js";

export class EntitlementProvisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntitlementProvisionError";
  }
}

export class InvalidPlanTemplateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPlanTemplateError";
  }
}

export interface EntitlementGrantTemplateRow {
  readonly companyId: string | null;
  readonly enabled: boolean;
  readonly environment: string | null;
  readonly key: string;
  readonly metadata: Readonly<Record<string, string | number | boolean | null>>;
  readonly scope: EntitlementScope;
  readonly type: EntitlementType;
}

export interface UsageLimitTemplateRow {
  readonly key: string;
  readonly maximum: number;
  readonly period: UsageLimitPeriod;
  readonly scope: EntitlementScope;
  readonly unit: string;
  readonly used: number;
}

export interface CommercialPlanTemplate {
  readonly entitlementGrants: readonly EntitlementGrantTemplateRow[];
  readonly planTemplateId: CommercialPlanTemplateId;
  readonly usageLimits: readonly UsageLimitTemplateRow[];
}

export interface EntitlementGrantRecord {
  readonly companyId: string | null;
  readonly enabled: boolean;
  readonly environment: string | null;
  readonly key: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly scope: EntitlementScope;
  readonly tenantId: string;
  readonly type: EntitlementType;
}

export interface UsageLimitRecord {
  readonly key: string;
  readonly maximum: number;
  readonly period: UsageLimitPeriod;
  readonly scope: EntitlementScope;
  readonly tenantId: string;
  readonly unit: string;
  readonly used: number;
}

export interface TenantEntitlementBundle {
  readonly entitlements: readonly EntitlementGrantRecord[];
  readonly loadedAt: string;
  readonly planTemplateId: CommercialPlanTemplateId | null;
  readonly tenantId: string;
  readonly usageLimits: readonly UsageLimitRecord[];
}

export interface ProvisionEntitlementBundleInput {
  readonly correlationId: string;
  readonly planTemplateId: CommercialPlanTemplateId;
  readonly tenantId: string;
}

export function assertValidPlanTemplateId(
  planTemplateId: string
): asserts planTemplateId is CommercialPlanTemplateId {
  const validIds = ["basic", "pro", "enterprise", "beta"] as const;

  if (!validIds.includes(planTemplateId as CommercialPlanTemplateId)) {
    throw new InvalidPlanTemplateError(
      `Unknown commercial plan template "${planTemplateId}".`
    );
  }
}

export function materializeGrantRows(
  template: CommercialPlanTemplate,
  tenantId: string
): readonly EntitlementGrantRecord[] {
  return template.entitlementGrants.map((grant) => ({
    tenantId,
    companyId: grant.companyId,
    key: grant.key,
    type: grant.type,
    scope: grant.scope,
    environment: grant.environment,
    enabled: grant.enabled,
    metadata: grant.metadata,
  }));
}

export function materializeUsageLimitRows(
  template: CommercialPlanTemplate,
  tenantId: string
): readonly UsageLimitRecord[] {
  return template.usageLimits.map((limit) => ({
    tenantId,
    key: limit.key,
    scope: limit.scope,
    period: limit.period,
    maximum: limit.maximum,
    used: limit.used,
    unit: limit.unit,
  }));
}
