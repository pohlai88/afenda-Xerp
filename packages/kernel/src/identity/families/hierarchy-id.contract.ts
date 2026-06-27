/**
 * Tenant hierarchy, identity & access, audit/execution, and enterprise hierarchy IDs.
 */

import {
  normalizeBrandedIdForWire,
  normalizeOptionalBrandedIdForWire,
} from "../wire/identity-wire.contract.js";
import {
  defineEnterpriseFamily,
  type EnterpriseBrand,
} from "./define-enterprise-family.js";

const tenant = defineEnterpriseFamily("tenant");
const entityGroup = defineEnterpriseFamily("entityGroup");
const company = defineEnterpriseFamily("company");
const organization = defineEnterpriseFamily("organization");
const team = defineEnterpriseFamily("team");
const project = defineEnterpriseFamily("project");
const user = defineEnterpriseFamily("user");
const role = defineEnterpriseFamily("role");
const membership = defineEnterpriseFamily("membership");
const permission = defineEnterpriseFamily("permission");
const policy = defineEnterpriseFamily("policy");
const auditEvent = defineEnterpriseFamily("auditEvent");
const execution = defineEnterpriseFamily("execution");
const correlation = defineEnterpriseFamily("correlation");
const ownershipInterest = defineEnterpriseFamily("ownershipInterest");

export type TenantId = EnterpriseBrand<"tenant">;
export type EntityGroupId = EnterpriseBrand<"entityGroup">;
export type CompanyId = EnterpriseBrand<"company">;
export type OrganizationId = EnterpriseBrand<"organization">;
export type TeamId = EnterpriseBrand<"team">;
export type ProjectId = EnterpriseBrand<"project">;
export type UserId = EnterpriseBrand<"user">;
export type RoleId = EnterpriseBrand<"role">;
export type MembershipId = EnterpriseBrand<"membership">;
export type PermissionId = EnterpriseBrand<"permission">;
export type PolicyId = EnterpriseBrand<"policy">;
export type AuditEventId = EnterpriseBrand<"auditEvent">;
export type ExecutionId = EnterpriseBrand<"execution">;
export type CorrelationId = EnterpriseBrand<"correlation">;
export type OwnershipInterestId = EnterpriseBrand<"ownershipInterest">;

export const parseTenantId = tenant.parse;
export const parseOptionalTenantId = tenant.parseOptional;
export const createTenantId = tenant.create;
export const toTenantId = tenant.to;

export const parseEntityGroupId = entityGroup.parse;
export const parseOptionalEntityGroupId = entityGroup.parseOptional;
export const createEntityGroupId = entityGroup.create;
export const toEntityGroupId = entityGroup.to;

export const parseCompanyId = company.parse;
export const parseOptionalCompanyId = company.parseOptional;
export const createCompanyId = company.create;
export const toCompanyId = company.to;

export const parseOrganizationId = organization.parse;
export const parseOptionalOrganizationId = organization.parseOptional;
export const createOrganizationId = organization.create;
export const toOrganizationId = organization.to;

export const parseTeamId = team.parse;
export const parseOptionalTeamId = team.parseOptional;
export const createTeamId = team.create;
export const toTeamId = team.to;

export const parseProjectId = project.parse;
export const parseOptionalProjectId = project.parseOptional;
export const createProjectId = project.create;
export const toProjectId = project.to;

export const parseUserId = user.parse;
export const parseOptionalUserId = user.parseOptional;
export const createUserId = user.create;
export const toUserId = user.to;

export const parseRoleId = role.parse;
export const parseOptionalRoleId = role.parseOptional;
export const createRoleId = role.create;
export const toRoleId = role.to;

export const parseMembershipId = membership.parse;
export const parseOptionalMembershipId = membership.parseOptional;
export const createMembershipId = membership.create;
export const toMembershipId = membership.to;

export const parsePermissionId = permission.parse;
export const parseOptionalPermissionId = permission.parseOptional;
export const createPermissionId = permission.create;
export const toPermissionId = permission.to;

export const parsePolicyId = policy.parse;
export const parseOptionalPolicyId = policy.parseOptional;
export const createPolicyId = policy.create;
export const toPolicyId = policy.to;

export const parseAuditEventId = auditEvent.parse;
export const parseOptionalAuditEventId = auditEvent.parseOptional;
export const createAuditEventId = auditEvent.create;
export const toAuditEventId = auditEvent.to;

export const parseExecutionId = execution.parse;
export const createExecutionId = execution.create;
export const toExecutionId = execution.to;

export const parseCorrelationId = correlation.parse;
export const createCorrelationId = correlation.create;
export const toCorrelationId = correlation.to;

export const parseOwnershipInterestId = ownershipInterest.parse;
export const parseOptionalOwnershipInterestId = ownershipInterest.parseOptional;
export const createOwnershipInterestId = ownershipInterest.create;
export const toOwnershipInterestId = ownershipInterest.to;

export function normalizeTenantIdForWire(value: string | TenantId): string {
  return normalizeBrandedIdForWire(value, toTenantId);
}

export function normalizeEntityGroupIdForWire(
  value: string | EntityGroupId
): string {
  return normalizeBrandedIdForWire(value, toEntityGroupId);
}

export function normalizeCompanyIdForWire(
  value: string | CompanyId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toCompanyId);
}

export function normalizeOrganizationIdForWire(
  value: string | OrganizationId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toOrganizationId);
}

export function normalizeTeamIdForWire(
  value: string | TeamId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toTeamId);
}

export function normalizeProjectIdForWire(
  value: string | ProjectId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toProjectId);
}

export function normalizeUserIdForWire(
  value: string | UserId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toUserId);
}

export function normalizeRoleIdForWire(value: string | RoleId): string {
  return normalizeBrandedIdForWire(value, toRoleId);
}

export function normalizeMembershipIdForWire(
  value: string | MembershipId
): string {
  return normalizeBrandedIdForWire(value, toMembershipId);
}

export function normalizePermissionIdForWire(
  value: string | PermissionId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toPermissionId);
}

export function normalizePolicyIdForWire(
  value: string | PolicyId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toPolicyId);
}

export function normalizeAuditEventIdForWire(
  value: string | AuditEventId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toAuditEventId);
}

export function normalizeExecutionIdForWire(
  value: string | ExecutionId
): string {
  return normalizeBrandedIdForWire(value, toExecutionId);
}

export function normalizeCorrelationIdForWire(
  value: string | CorrelationId
): string {
  return normalizeBrandedIdForWire(value, toCorrelationId);
}

export function normalizeOwnershipInterestIdForWire(
  value: string | OwnershipInterestId
): string {
  return normalizeBrandedIdForWire(value, toOwnershipInterestId);
}
