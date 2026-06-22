import type { OperatingContext, OperatingContextResult } from "@afenda/kernel";

import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import {
  resolveOperatingContext,
  type ResolveOperatingContextInput,
} from "@/lib/context/resolve-operating-context.server";

import {
  AFENDA_COMPANY_ID_HEADER,
  AFENDA_COMPANY_SLUG_HEADER,
  AFENDA_ORGANIZATION_ID_HEADER,
  AFENDA_ORGANIZATION_SLUG_HEADER,
} from "./api-route-context";

export type ApiRouteOperatingContextFailureCode =
  | "missing_context"
  | "membership_denied"
  | "tenant_not_found"
  | "tenant_not_operational"
  | "company_not_found"
  | "company_scope_mismatch"
  | "organization_not_found"
  | "organization_scope_mismatch"
  | "invalid_selection";

export interface ApiRouteOperatingContextFailure {
  readonly code: ApiRouteOperatingContextFailureCode;
  readonly message: string;
}

export type ResolveOperatingContextFn = (
  input: ResolveOperatingContextInput
) => Promise<OperatingContextResult>;

function readOptionalHeader(request: Request, headerName: string): string | null {
  const value = request.headers.get(headerName)?.trim();
  return value && value.length > 0 ? value : null;
}

function mapOperatingContextError(
  code: string
): ApiRouteOperatingContextFailureCode {
  switch (code) {
    case "TENANT_NOT_FOUND":
      return "tenant_not_found";
    case "TENANT_NOT_OPERATIONAL":
      return "tenant_not_operational";
    case "COMPANY_NOT_FOUND":
      return "company_not_found";
    case "COMPANY_SCOPE_MISMATCH":
      return "company_scope_mismatch";
    case "ORGANIZATION_NOT_FOUND":
      return "organization_not_found";
    case "ORGANIZATION_SCOPE_MISMATCH":
      return "organization_scope_mismatch";
    case "MEMBERSHIP_DENIED":
      return "membership_denied";
    case "INVALID_SELECTION":
    case "MISSING_LEGAL_ENTITY_SELECTION":
    case "INVALID_SURFACE_ID":
    case "INVALID_WORKFLOW_ID":
    case "TEAM_NOT_FOUND":
    case "TEAM_SCOPE_MISMATCH":
    case "ENTITY_GROUP_NOT_FOUND":
    case "ENTITY_GROUP_NOT_OPERATIONAL":
    case "ENTITY_GROUP_SCOPE_MISMATCH":
    case "PROJECT_SCOPE_MISMATCH":
      return "invalid_selection";
    default:
      return "invalid_selection";
  }
}

export async function resolveVerifiedApiRouteOperatingContext(input: {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly request: Request;
  readonly resolveOperatingContextFn?: ResolveOperatingContextFn;
}): Promise<
  | { readonly ok: true; readonly operatingContext: OperatingContext }
  | { readonly ok: false; readonly error: ApiRouteOperatingContextFailure }
> {
  const tenantSlug = readOptionalHeader(input.request, TENANT_SLUG_HEADER);

  if (!tenantSlug) {
    return {
      ok: false,
      error: {
        code: "missing_context",
        message: "A valid workspace tenant slug is required.",
      },
    };
  }

  const resolveFn = input.resolveOperatingContextFn ?? resolveOperatingContext;
  const result = await resolveFn({
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
    selection: {
      tenantSlug,
      companySlug: readOptionalHeader(input.request, AFENDA_COMPANY_SLUG_HEADER),
      companyId: readOptionalHeader(input.request, AFENDA_COMPANY_ID_HEADER),
      organizationSlug: readOptionalHeader(
        input.request,
        AFENDA_ORGANIZATION_SLUG_HEADER
      ),
      organizationId: readOptionalHeader(
        input.request,
        AFENDA_ORGANIZATION_ID_HEADER
      ),
      projectId: readOptionalHeader(input.request, "x-afenda-project-id"),
      teamId: readOptionalHeader(input.request, "x-afenda-team-id"),
      surfaceId: readOptionalHeader(input.request, "x-afenda-surface-id"),
      workflowId: readOptionalHeader(input.request, "x-afenda-workflow-id"),
    },
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        code: mapOperatingContextError(result.error.code),
        message: result.error.userMessage,
      },
    };
  }

  return { ok: true, operatingContext: result.value };
}
