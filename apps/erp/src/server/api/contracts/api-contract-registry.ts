import type { ApiRouteContract } from "./api-contract";
import { authMembershipsGetContract } from "./auth/auth-memberships.contract";
import { healthGetContract } from "./health.api-contract";
import { clientErrorPostContract } from "./observability/client-error.contract";
import { tenantBrandLogoUploadPostContract } from "./storage/tenant-brand-logo.contract";
import {
  systemAdminAuditEventsGetContract,
  systemAdminMembershipRolePostContract,
  systemAdminUserInvitePostContract,
} from "./system-admin/system-admin.contract";
import {
  dashboardLayoutDeleteContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
} from "./workspace/dashboard-layout.contract";

/** Export names referenced by createApiHandler in governed route files. */
export const GOVERNED_ROUTE_CONTRACT_EXPORTS = {
  authMembershipsGetContract,
  clientErrorPostContract,
  dashboardLayoutDeleteContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
  healthGetContract,
  systemAdminAuditEventsGetContract,
  systemAdminMembershipRolePostContract,
  systemAdminUserInvitePostContract,
  tenantBrandLogoUploadPostContract,
} as const satisfies Record<string, ApiRouteContract<unknown, unknown>>;

export const API_CONTRACTS = [
  healthGetContract,
  authMembershipsGetContract,
  clientErrorPostContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
  dashboardLayoutDeleteContract,
  systemAdminUserInvitePostContract,
  systemAdminMembershipRolePostContract,
  systemAdminAuditEventsGetContract,
  tenantBrandLogoUploadPostContract,
] as const satisfies readonly ApiRouteContract<unknown, unknown>[];

export type ApiContractId = (typeof API_CONTRACTS)[number]["id"];

export function getApiContractById(
  id: ApiContractId
): (typeof API_CONTRACTS)[number] {
  const contract = API_CONTRACTS.find((entry) => entry.id === id);
  if (contract === undefined) {
    throw new Error(`Unknown API contract id: ${id}`);
  }
  return contract;
}
