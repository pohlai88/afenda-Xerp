import type { ApiRouteContract } from "./api-contract";
import {
  openApiDocsGetContract,
  openApiJsonGetContract,
} from "./api-docs/api-spec.contract";
import { authMembershipsGetContract } from "./auth/auth-memberships.contract";
import { serviceActorPingGetContract } from "./auth/service-actor-ping.contract";
import { buildApiOperationRegistry } from "./core/index";
import { healthGetContract } from "./health.api-contract";
import {
  inventoryProductsGetContract,
  inventoryProductsPatchContract,
  inventoryProductsPostContract,
  inventoryStockLevelsGetContract,
  inventoryStockMovementsPostContract,
  inventoryWarehousesGetContract,
  inventoryWarehousesPatchContract,
  inventoryWarehousesPostContract,
} from "./inventory/inventory.contract";
import { clientErrorPostContract } from "./observability/client-error.contract";
import { tenantBrandLogoUploadPostContract } from "./storage/tenant-brand-logo.contract";
import {
  systemAdminAuditEventsGetContract,
  systemAdminMembershipRoleAssignmentsPostContract,
  systemAdminMembershipRolePostContract,
  systemAdminMembershipsGetContract,
  systemAdminPermissionsGetContract,
  systemAdminRolesGetContract,
  systemAdminSettingsGetContract,
  systemAdminUserInvitationsPostContract,
  systemAdminUserInvitePostContract,
  systemAdminUsersGetContract,
} from "./system-admin/system-admin.contract";
import {
  dashboardLayoutDeleteContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
} from "./workspace/dashboard-layout.contract";

/** Export names referenced by createApiHandler in governed route files. */
export const GOVERNED_ROUTE_CONTRACT_EXPORTS = {
  authMembershipsGetContract,
  serviceActorPingGetContract,
  clientErrorPostContract,
  dashboardLayoutDeleteContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
  healthGetContract,
  inventoryProductsGetContract,
  inventoryProductsPatchContract,
  inventoryProductsPostContract,
  inventoryStockLevelsGetContract,
  inventoryStockMovementsPostContract,
  inventoryWarehousesGetContract,
  inventoryWarehousesPatchContract,
  inventoryWarehousesPostContract,
  openApiDocsGetContract,
  openApiJsonGetContract,
  systemAdminAuditEventsGetContract,
  systemAdminMembershipRoleAssignmentsPostContract,
  systemAdminMembershipRolePostContract,
  systemAdminMembershipsGetContract,
  systemAdminPermissionsGetContract,
  systemAdminRolesGetContract,
  systemAdminSettingsGetContract,
  systemAdminUserInvitationsPostContract,
  systemAdminUserInvitePostContract,
  systemAdminUsersGetContract,
  tenantBrandLogoUploadPostContract,
} as const satisfies Record<string, ApiRouteContract<unknown, unknown>>;

export const API_CONTRACTS = [
  healthGetContract,
  authMembershipsGetContract,
  serviceActorPingGetContract,
  clientErrorPostContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
  dashboardLayoutDeleteContract,
  inventoryProductsGetContract,
  inventoryProductsPostContract,
  inventoryProductsPatchContract,
  inventoryStockLevelsGetContract,
  inventoryStockMovementsPostContract,
  inventoryWarehousesGetContract,
  inventoryWarehousesPostContract,
  inventoryWarehousesPatchContract,
  systemAdminUserInvitePostContract,
  systemAdminUserInvitationsPostContract,
  systemAdminMembershipRolePostContract,
  systemAdminMembershipRoleAssignmentsPostContract,
  systemAdminAuditEventsGetContract,
  systemAdminUsersGetContract,
  systemAdminRolesGetContract,
  systemAdminPermissionsGetContract,
  systemAdminMembershipsGetContract,
  systemAdminSettingsGetContract,
  tenantBrandLogoUploadPostContract,
  openApiDocsGetContract,
  openApiJsonGetContract,
] as const satisfies readonly ApiRouteContract<unknown, unknown>[];

/** Family registry — branded operation ids + style bindings (PAS-API-001 API-002). */
export const API_OPERATION_REGISTRY = buildApiOperationRegistry(API_CONTRACTS);

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
