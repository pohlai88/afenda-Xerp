/** Platform kernel and shared contracts — placeholder export for TIP-001 foundation. */

export const PACKAGE_NAME = "@afenda/kernel" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  brandOptionalId,
  brandRequiredId,
  type Brand,
  unbrand,
} from "./contracts/brand.contract.js";
export {
  brandAuditEventId,
  brandCompanyId,
  brandCorrelationId,
  brandExecutionId,
  brandMembershipId,
  brandOrganizationId,
  brandPermissionId,
  brandPolicyId,
  brandRoleId,
  brandTenantId,
  brandUserId,
  type AuditEventId,
  type CompanyId,
  type CorrelationId,
  type ExecutionId,
  type MembershipId,
  type OrganizationId,
  type PermissionId,
  type PolicyId,
  type RoleId,
  type TenantId,
  type UserId,
  toCompanyId,
  toCorrelationId,
  toExecutionId,
  toOrganizationId,
  toTenantId,
  toUserId,
} from "./contracts/platform-id.contract.js";
export {
  err,
  isErr,
  isOk,
  ok,
  type Result,
  type ResultFailure,
  type ResultSuccess,
} from "./contracts/result.contract.js";
export {
  assertExecutionContext,
  createExecutionContext,
  createExecutionId,
  EXECUTION_CONTEXT_SOURCES,
  type ExecutionContext,
  type ExecutionContextInput,
  type ExecutionContextSource,
} from "./contracts/execution-context.contract.js";
