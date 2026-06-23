import type { OperatingContext } from "@afenda/kernel";

import type { WorkspaceApiScope } from "./workspace-api-scope.contract";

/** Maps verified server operating context to slug-first API client scope. */
export function toWorkspaceApiScope(
  context: OperatingContext
): WorkspaceApiScope {
  return {
    tenantSlug: context.tenant.slug,
    companySlug: context.legalEntity.slug,
    ...(context.organizationUnit
      ? { organizationSlug: context.organizationUnit.slug }
      : {}),
  };
}
