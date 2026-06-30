import type { OperatingContext } from "@afenda/kernel";
import type { AuthorizationContextInput } from "@afenda/permissions";

/** Maps verified operating context into permission-check scope (IS-002 spine). */
export function authorizationContextFromOperatingContext(
  operatingContext: OperatingContext
): AuthorizationContextInput {
  return {
    tenantId: operatingContext.workspace.tenantId,
    companyId: operatingContext.workspace.companyId,
    organizationId: operatingContext.workspace.organizationId,
    entityGroupId:
      operatingContext.legalEntity.entityGroupId ??
      operatingContext.entityGroup?.entityGroupId ??
      null,
    projectId:
      operatingContext.workspace.projectId ??
      operatingContext.project?.projectId ??
      null,
    teamId: operatingContext.team?.teamId ?? null,
    workspaceId: null,
  };
}
