import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";

import {
  AFENDA_COMPANY_ID_HEADER,
  AFENDA_COMPANY_SLUG_HEADER,
  AFENDA_ORGANIZATION_ID_HEADER,
  AFENDA_ORGANIZATION_SLUG_HEADER,
  AFENDA_WORKSPACE_ID_HEADER,
} from "./api-route-context";

export type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";

export function buildWorkspaceScopeHeaders(
  scope: WorkspaceApiScope
): Record<string, string> {
  const headers: Record<string, string> = {
    [TENANT_SLUG_HEADER]: scope.tenantSlug,
  };

  if (scope.companySlug) {
    headers[AFENDA_COMPANY_SLUG_HEADER] = scope.companySlug;
  }

  if (scope.companyId) {
    headers[AFENDA_COMPANY_ID_HEADER] = scope.companyId;
  }

  if (scope.organizationSlug) {
    headers[AFENDA_ORGANIZATION_SLUG_HEADER] = scope.organizationSlug;
  }

  if (scope.organizationId) {
    headers[AFENDA_ORGANIZATION_ID_HEADER] = scope.organizationId;
  }

  if (scope.workspaceId) {
    headers[AFENDA_WORKSPACE_ID_HEADER] = scope.workspaceId;
  }

  return headers;
}
