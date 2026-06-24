import type { OperatingContext } from "@afenda/kernel";
import type { AuthorizationContextInput } from "@afenda/permissions";

export const AFENDA_TENANT_ID_HEADER = "x-afenda-tenant-id";
export const AFENDA_COMPANY_ID_HEADER = "x-afenda-company-id";
export const AFENDA_COMPANY_SLUG_HEADER = "x-afenda-company-slug";
export const AFENDA_ORGANIZATION_ID_HEADER = "x-afenda-organization-id";
export const AFENDA_ORGANIZATION_SLUG_HEADER = "x-afenda-organization-slug";
export const AFENDA_WORKSPACE_ID_HEADER = "x-afenda-workspace-id";

export type ApiRouteProtectionLevel =
  | "authenticated"
  | "company-protected"
  | "internal-system"
  | "organization-protected"
  | "platform-admin"
  | "public"
  | "tenant-protected";

export interface ApiRouteScopeCandidate {
  readonly companyId: string | null;
  readonly organizationId: string | null;
  readonly source: "header";
  readonly tenantId: string;
  readonly workspaceId: string | null;
}

function readOptionalHeader(
  request: Request,
  headerName: string
): string | null {
  const value = request.headers.get(headerName)?.trim();
  return value && value.length > 0 ? value : null;
}

export function readScopeCandidateFromHeaders(
  request: Request
): Omit<ApiRouteScopeCandidate, "source"> | null {
  const tenantId = readOptionalHeader(request, AFENDA_TENANT_ID_HEADER);

  if (tenantId === null) {
    return null;
  }

  return {
    tenantId,
    companyId: readOptionalHeader(request, AFENDA_COMPANY_ID_HEADER),
    organizationId: readOptionalHeader(request, AFENDA_ORGANIZATION_ID_HEADER),
    workspaceId: readOptionalHeader(request, AFENDA_WORKSPACE_ID_HEADER),
  };
}

export function resolveApiRouteScopeCandidate(input: {
  readonly protectionLevel: ApiRouteProtectionLevel;
  readonly request: Request;
}): ApiRouteScopeCandidate | null {
  if (
    input.protectionLevel === "public" ||
    input.protectionLevel === "authenticated" ||
    input.protectionLevel === "internal-system"
  ) {
    return null;
  }

  const headerScope = readScopeCandidateFromHeaders(input.request);

  if (headerScope === null) {
    return null;
  }

  return {
    ...headerScope,
    source: "header",
  };
}

export function toAuthorizationContextInput(
  scope: ApiRouteScopeCandidate | null
): AuthorizationContextInput {
  if (scope === null) {
    return {};
  }

  return {
    tenantId: scope.tenantId,
    companyId: scope.companyId,
    organizationId: scope.organizationId,
    workspaceId: scope.workspaceId,
  };
}

/** Maps verified operating context into permission-check scope — hierarchy ids from resolver, not headers. */
export function toAuthorizationContextFromOperatingContext(input: {
  readonly operatingContext: OperatingContext;
  readonly request: Request;
}): AuthorizationContextInput {
  const { operatingContext } = input;
  const headerScope = readScopeCandidateFromHeaders(input.request);

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
    workspaceId: headerScope?.workspaceId ?? null,
  };
}
