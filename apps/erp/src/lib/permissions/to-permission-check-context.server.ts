import type { OperatingContext } from "@afenda/kernel";
import type { PermissionCheckRequest } from "@afenda/permissions";

/** Maps kernel operating context into the permission checker scope contract. */
export function toPermissionCheckContextFromOperatingContext(
  operatingContext: OperatingContext
): PermissionCheckRequest["context"] {
  return {
    tenantId: operatingContext.permissionScope.tenantId,
    companyId: operatingContext.permissionScope.companyId,
    organizationId: operatingContext.permissionScope.organizationId,
    workspaceId: null,
  };
}
