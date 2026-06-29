import type {
  AuthActorIdentity,
  OperatingContext,
  OperatingContextError,
  OperatingContextResult,
  OperatingContextSelection,
} from "@afenda/kernel";
import { err } from "@afenda/kernel";

import { resolveApiRouteAuthActor } from "@/lib/auth/resolve-api-route-auth-actor.server";
import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";
import {
  type ResolveOperatingContextInput,
  resolveOperatingContextOrchestrator,
} from "@/lib/context/resolve-operating-context-orchestrator.server";

import {
  AFENDA_COMPANY_ID_HEADER,
  AFENDA_COMPANY_SLUG_HEADER,
  AFENDA_ORGANIZATION_ID_HEADER,
  AFENDA_ORGANIZATION_SLUG_HEADER,
  AFENDA_PROJECT_SLUG_HEADER,
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

export interface ResolveApiRouteOperatingContextInput {
  readonly correlationId?: string;
  readonly requestHeaders: Headers;
}

function readOptionalHeader(
  headers: Headers,
  headerName: string
): string | null {
  const value = headers.get(headerName)?.trim();
  return value && value.length > 0 ? value : null;
}

function buildSelectionFromHeaders(
  headers: Headers
): OperatingContextSelection | null {
  const tenantSlug = readOptionalHeader(headers, TENANT_SLUG_HEADER);

  if (tenantSlug === null) {
    return null;
  }

  return {
    tenantSlug,
    companySlug: readOptionalHeader(headers, AFENDA_COMPANY_SLUG_HEADER),
    companyId: readOptionalHeader(headers, AFENDA_COMPANY_ID_HEADER),
    organizationSlug: readOptionalHeader(
      headers,
      AFENDA_ORGANIZATION_SLUG_HEADER
    ),
    organizationId: readOptionalHeader(headers, AFENDA_ORGANIZATION_ID_HEADER),
    projectSlug: readOptionalHeader(headers, AFENDA_PROJECT_SLUG_HEADER),
    projectId: readOptionalHeader(headers, "x-afenda-project-id"),
    teamId: readOptionalHeader(headers, "x-afenda-team-id"),
    surfaceId: readOptionalHeader(headers, "x-afenda-surface-id"),
    workflowId: readOptionalHeader(headers, "x-afenda-workflow-id"),
  };
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

async function resolveOperatingContextForServiceActor(input: {
  readonly correlationId: string;
  readonly identity: AuthActorIdentity;
  readonly requestHeaders: Headers;
}): Promise<OperatingContextResult> {
  const selection = buildSelectionFromHeaders(input.requestHeaders);

  if (selection === null) {
    return err({
      code: "MEMBERSHIP_DENIED",
      userMessage: "A valid workspace tenant slug is required.",
    } satisfies OperatingContextError);
  }

  return resolveOperatingContextOrchestrator({
    actorUserId: input.identity.authSubjectId,
    correlationId: input.correlationId,
    selection,
  });
}

/**
 * Protected internal API operating-context resolver — IS-002 spine (PAS-001A R1a).
 * R3 completes service-actor assembly via orchestrator + scope headers (R2 deferred work).
 */
export async function resolveApiRouteOperatingContext(
  input: ResolveApiRouteOperatingContextInput
): Promise<OperatingContextResult> {
  const authActor = await resolveApiRouteAuthActor(input.requestHeaders);

  if (authActor === null) {
    return err({
      code: "MEMBERSHIP_DENIED",
      userMessage:
        "Authentication is required for protected internal API routes.",
    } satisfies OperatingContextError);
  }

  if (authActor.kind === "service") {
    return resolveOperatingContextForServiceActor({
      correlationId:
        input.correlationId ??
        readOptionalHeader(input.requestHeaders, "x-correlation-id") ??
        crypto.randomUUID(),
      identity: authActor.identity,
      requestHeaders: input.requestHeaders,
    });
  }

  return resolveOperatingContext({
    requestHeaders: input.requestHeaders,
    session: authActor.session,
  });
}

function readOptionalHeaderFromRequest(
  request: Request,
  headerName: string
): string | null {
  return readOptionalHeader(request.headers, headerName);
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
  const tenantSlug = readOptionalHeaderFromRequest(
    input.request,
    TENANT_SLUG_HEADER
  );

  if (tenantSlug === null) {
    return {
      ok: false,
      error: {
        code: "missing_context",
        message: "A valid workspace tenant slug is required.",
      },
    };
  }

  const resolveFn =
    input.resolveOperatingContextFn ?? resolveOperatingContextOrchestrator;
  const result = await resolveFn({
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
    selection: {
      tenantSlug,
      companySlug: readOptionalHeaderFromRequest(
        input.request,
        AFENDA_COMPANY_SLUG_HEADER
      ),
      companyId: readOptionalHeaderFromRequest(
        input.request,
        AFENDA_COMPANY_ID_HEADER
      ),
      organizationSlug: readOptionalHeaderFromRequest(
        input.request,
        AFENDA_ORGANIZATION_SLUG_HEADER
      ),
      organizationId: readOptionalHeaderFromRequest(
        input.request,
        AFENDA_ORGANIZATION_ID_HEADER
      ),
      projectSlug: readOptionalHeaderFromRequest(
        input.request,
        AFENDA_PROJECT_SLUG_HEADER
      ),
      projectId: readOptionalHeaderFromRequest(
        input.request,
        "x-afenda-project-id"
      ),
      teamId: readOptionalHeaderFromRequest(input.request, "x-afenda-team-id"),
      surfaceId: readOptionalHeaderFromRequest(
        input.request,
        "x-afenda-surface-id"
      ),
      workflowId: readOptionalHeaderFromRequest(
        input.request,
        "x-afenda-workflow-id"
      ),
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
