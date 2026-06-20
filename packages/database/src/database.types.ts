import {
  AUDIT_ACTOR_TYPES as OBSERVABILITY_AUDIT_ACTOR_TYPES,
  AUDIT_RESULTS as OBSERVABILITY_AUDIT_RESULTS,
  AUDIT_SOURCES as OBSERVABILITY_AUDIT_SOURCES,
} from "@afenda/observability";
import { pgEnum } from "drizzle-orm/pg-core";

// biome-ignore lint/performance/noBarrelFile: preserves existing @afenda/database audit vocabulary exports.
export {
  AUDIT_ACTOR_TYPES,
  AUDIT_RESULTS,
  AUDIT_SOURCES,
} from "@afenda/observability";

/** Shared platform lifecycle vocabulary for tenant, company, and organization. */
export const PLATFORM_LIFECYCLE_STATUSES = [
  "active",
  "suspended",
  "archived",
] as const;

export type PlatformLifecycleStatus =
  (typeof PLATFORM_LIFECYCLE_STATUSES)[number];

export const tenantStatusEnum = pgEnum(
  "tenant_status",
  PLATFORM_LIFECYCLE_STATUSES
);

export const companyStatusEnum = pgEnum(
  "company_status",
  PLATFORM_LIFECYCLE_STATUSES
);

export const organizationStatusEnum = pgEnum(
  "organization_status",
  PLATFORM_LIFECYCLE_STATUSES
);

export const organizationTypeEnum = pgEnum("organization_type", [
  "company_root",
  "branch",
  "department",
  "team",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "invited",
  "suspended",
  "deactivated",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "pending",
  "suspended",
  "revoked",
]);

export const MEMBERSHIP_SCOPE_TYPES = [
  "tenant",
  "company",
  "organization",
] as const;

export const membershipScopeEnum = pgEnum(
  "membership_scope",
  MEMBERSHIP_SCOPE_TYPES
);

/**
 * Role lifecycle. Use `inactive` when a role is retained for audit/history
 * but must not be assigned to new memberships or grant permissions.
 */
export const roleStatusEnum = pgEnum("role_status", [
  "active",
  "inactive",
  "archived",
]);

export const roleScopeEnum = pgEnum("role_scope", [
  "platform",
  "tenant",
  "company",
  "organization",
]);

export const policyEffectEnum = pgEnum("policy_effect", ["allow", "deny"]);

export const policyScopeEnum = pgEnum("policy_scope", [
  "platform",
  "tenant",
  "company",
  "organization",
  "module",
  "workflow",
]);

export const policyStatusEnum = pgEnum("policy_status", [
  "active",
  "inactive",
  "archived",
]);

export const auditResultEnum = pgEnum(
  "audit_result",
  OBSERVABILITY_AUDIT_RESULTS
);
export const auditActorTypeEnum = pgEnum(
  "audit_actor_type",
  OBSERVABILITY_AUDIT_ACTOR_TYPES
);
export const auditSourceEnum = pgEnum(
  "audit_source",
  OBSERVABILITY_AUDIT_SOURCES
);

export type TenantStatus = (typeof tenantStatusEnum.enumValues)[number];
export type CompanyStatus = (typeof companyStatusEnum.enumValues)[number];
export type OrganizationStatus =
  (typeof organizationStatusEnum.enumValues)[number];
export type OrganizationType = (typeof organizationTypeEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
export type MembershipStatus = (typeof membershipStatusEnum.enumValues)[number];
export type MembershipScopeType =
  (typeof membershipScopeEnum.enumValues)[number];
export type RoleStatus = (typeof roleStatusEnum.enumValues)[number];
export type RoleScope = (typeof roleScopeEnum.enumValues)[number];
export type PolicyEffect = (typeof policyEffectEnum.enumValues)[number];
export type PolicyScope = (typeof policyScopeEnum.enumValues)[number];
export type PolicyStatus = (typeof policyStatusEnum.enumValues)[number];
export type AuditResult = (typeof auditResultEnum.enumValues)[number];
export type AuditActorType = (typeof auditActorTypeEnum.enumValues)[number];
export type AuditSource = (typeof auditSourceEnum.enumValues)[number];

export const ENTITLEMENT_TYPES = [
  "module",
  "feature",
  "usage_limit",
  "localization",
  "deployment",
  "support",
  "security",
  "beta",
] as const;

export const entitlementTypeEnum = pgEnum(
  "entitlement_type",
  ENTITLEMENT_TYPES
);

export const ENTITLEMENT_SCOPES = [
  "global",
  "tenant",
  "company",
  "environment",
] as const;

export const entitlementScopeEnum = pgEnum(
  "entitlement_scope",
  ENTITLEMENT_SCOPES
);

export const USAGE_LIMIT_PERIODS = [
  "instant",
  "daily",
  "monthly",
  "annual",
] as const;

export const usageLimitPeriodEnum = pgEnum(
  "usage_limit_period",
  USAGE_LIMIT_PERIODS
);

export const COMMERCIAL_PLAN_TEMPLATE_IDS = [
  "basic",
  "pro",
  "enterprise",
  "beta",
] as const;

export type EntitlementType = (typeof ENTITLEMENT_TYPES)[number];
export type EntitlementScope = (typeof ENTITLEMENT_SCOPES)[number];
export type UsageLimitPeriod = (typeof USAGE_LIMIT_PERIODS)[number];
export type CommercialPlanTemplateId =
  (typeof COMMERCIAL_PLAN_TEMPLATE_IDS)[number];

export const FEATURE_FLAG_ROLLOUTS = [
  "off",
  "internal",
  "beta",
  "limited",
  "on",
] as const;

export const featureFlagRolloutEnum = pgEnum(
  "feature_flag_rollout",
  FEATURE_FLAG_ROLLOUTS
);

export const KILL_SWITCH_SEVERITIES = [
  "standard",
  "urgent",
  "critical",
] as const;

export const killSwitchSeverityEnum = pgEnum(
  "kill_switch_severity",
  KILL_SWITCH_SEVERITIES
);

export type FeatureFlagRollout = (typeof FEATURE_FLAG_ROLLOUTS)[number];
export type KillSwitchSeverity = (typeof KILL_SWITCH_SEVERITIES)[number];

export const STORAGE_PROVIDERS = ["r2", "blob"] as const;

export const storageProviderEnum = pgEnum(
  "storage_provider",
  STORAGE_PROVIDERS
);

export type StorageProvider = (typeof storageProviderEnum.enumValues)[number];
