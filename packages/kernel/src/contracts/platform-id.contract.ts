import {
  type Brand,
  brandOptionalId,
  brandRequiredId,
  unbrand,
} from "./brand.contract.js";

export type { Brand };

export type TenantId = Brand<string, "TenantId">;
export type EntityGroupId = Brand<string, "EntityGroupId">;
export type CompanyId = Brand<string, "CompanyId">;
export type OrganizationId = Brand<string, "OrganizationId">;
export type TeamId = Brand<string, "TeamId">;
export type ProjectId = Brand<string, "ProjectId">;
export type UserId = Brand<string, "UserId">;
export type RoleId = Brand<string, "RoleId">;
export type MembershipId = Brand<string, "MembershipId">;
export type PermissionId = Brand<string, "PermissionId">;
export type PolicyId = Brand<string, "PolicyId">;
export type AuditEventId = Brand<string, "AuditEventId">;
export type OwnershipInterestId = Brand<string, "OwnershipInterestId">;
export type ExecutionId = Brand<string, "ExecutionId">;
export type CorrelationId = Brand<string, "CorrelationId">;

export function brandTenantId(
  value: string | TenantId | null | undefined
): TenantId | null {
  return brandOptionalId(value, "tenantId") as TenantId | null;
}

export function brandEntityGroupId(
  value: string | EntityGroupId | null | undefined
): EntityGroupId | null {
  return brandOptionalId(value, "entityGroupId") as EntityGroupId | null;
}

export function brandCompanyId(
  value: string | CompanyId | null | undefined
): CompanyId | null {
  return brandOptionalId(value, "companyId") as CompanyId | null;
}

export function brandOrganizationId(
  value: string | OrganizationId | null | undefined
): OrganizationId | null {
  return brandOptionalId(value, "organizationId") as OrganizationId | null;
}

export function brandTeamId(
  value: string | TeamId | null | undefined
): TeamId | null {
  return brandOptionalId(value, "teamId") as TeamId | null;
}

export function brandProjectId(
  value: string | ProjectId | null | undefined
): ProjectId | null {
  return brandOptionalId(value, "projectId") as ProjectId | null;
}

export function brandUserId(
  value: string | UserId | null | undefined
): UserId | null {
  return brandOptionalId(value, "userId") as UserId | null;
}

export function brandRoleId(
  value: string | RoleId | null | undefined
): RoleId | null {
  return brandOptionalId(value, "roleId") as RoleId | null;
}

export function brandMembershipId(
  value: string | MembershipId | null | undefined
): MembershipId | null {
  return brandOptionalId(value, "membershipId") as MembershipId | null;
}

export function brandPermissionId(
  value: string | PermissionId | null | undefined
): PermissionId | null {
  return brandOptionalId(value, "permissionId") as PermissionId | null;
}

export function brandPolicyId(
  value: string | PolicyId | null | undefined
): PolicyId | null {
  return brandOptionalId(value, "policyId") as PolicyId | null;
}

export function brandAuditEventId(
  value: string | AuditEventId | null | undefined
): AuditEventId | null {
  return brandOptionalId(value, "auditEventId") as AuditEventId | null;
}

export function brandOwnershipInterestId(
  value: string | OwnershipInterestId | null | undefined
): OwnershipInterestId | null {
  return brandOptionalId(
    value,
    "ownershipInterestId"
  ) as OwnershipInterestId | null;
}

export function brandExecutionId(value: string | ExecutionId): ExecutionId {
  return brandRequiredId(value, "executionId") as ExecutionId;
}

export function brandCorrelationId(
  value: string | CorrelationId
): CorrelationId {
  return brandRequiredId(value, "correlationId") as CorrelationId;
}

export function toTenantId(value: TenantId): string {
  return unbrand(value);
}

export function toEntityGroupId(value: EntityGroupId): string {
  return unbrand(value);
}

export function toCompanyId(value: CompanyId): string {
  return unbrand(value);
}

export function toOwnershipInterestId(value: OwnershipInterestId): string {
  return unbrand(value);
}

export function toOrganizationId(value: OrganizationId): string {
  return unbrand(value);
}

export function toUserId(value: UserId): string {
  return unbrand(value);
}

export function toExecutionId(value: ExecutionId): string {
  return unbrand(value);
}

export function toCorrelationId(value: CorrelationId): string {
  return unbrand(value);
}
