import { pgEnum } from "drizzle-orm/pg-core";

/** Small, stable platform lifecycle vocabulary. */
export const tenantStatusEnum = pgEnum("tenant_status", [
  "active",
  "suspended",
  "archived",
]);

export const companyStatusEnum = pgEnum("company_status", [
  "active",
  "suspended",
  "archived",
]);

export const organizationStatusEnum = pgEnum("organization_status", [
  "active",
  "suspended",
  "archived",
]);

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

export const roleStatusEnum = pgEnum("role_status", ["active", "inactive"]);

export const roleScopeEnum = pgEnum("role_scope", [
  "platform",
  "tenant",
  "company",
  "organization",
]);

export const policyEffectEnum = pgEnum("policy_effect", ["allow", "deny"]);

export const policyStatusEnum = pgEnum("policy_status", ["active", "inactive"]);

export const auditResultEnum = pgEnum("audit_result", [
  "success",
  "failure",
  "denied",
]);

export type TenantStatus = (typeof tenantStatusEnum.enumValues)[number];
export type CompanyStatus = (typeof companyStatusEnum.enumValues)[number];
export type OrganizationStatus =
  (typeof organizationStatusEnum.enumValues)[number];
export type OrganizationType = (typeof organizationTypeEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
export type MembershipStatus = (typeof membershipStatusEnum.enumValues)[number];
export type RoleStatus = (typeof roleStatusEnum.enumValues)[number];
export type RoleScope = (typeof roleScopeEnum.enumValues)[number];
export type PolicyEffect = (typeof policyEffectEnum.enumValues)[number];
export type PolicyStatus = (typeof policyStatusEnum.enumValues)[number];
export type AuditResult = (typeof auditResultEnum.enumValues)[number];

/** Canonical permission key shape: `{domain}.{action}`. */
export type PermissionKey = `${string}.${string}`;

export class InvalidPermissionKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPermissionKeyError";
  }
}

export function createPermissionKey(
  domain: string,
  action: string
): PermissionKey {
  const normalizedDomain = domain.trim();
  const normalizedAction = action.trim();

  if (!(normalizedDomain && normalizedAction)) {
    throw new InvalidPermissionKeyError(
      "Permission domain and action must be non-empty."
    );
  }

  return `${normalizedDomain}.${normalizedAction}`;
}
