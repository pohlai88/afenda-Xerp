import { pgEnum } from "drizzle-orm/pg-core";

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

export const auditResultEnum = pgEnum("audit_result", [
  "success",
  "failure",
  "denied",
]);

export const AUDIT_ACTOR_TYPES = [
  "user",
  "system",
  "service",
  "integration",
  "cron",
  "import",
] as const;

export const auditActorTypeEnum = pgEnum("audit_actor_type", AUDIT_ACTOR_TYPES);

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
