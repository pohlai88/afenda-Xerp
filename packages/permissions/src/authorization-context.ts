import type { AfendaAuthSession } from "@afenda/auth";

import type { AuthorizationContextDenialCode } from "./authorization-denial-code.js";

/** Actor identity supplied by TIP-004 — permissions never authenticate. */
export interface AuthorizationActor {
  readonly actorId: string;
}

export interface AuthorizationContextInput {
  readonly companyId?: string | null;
  readonly organizationId?: string | null;
  readonly tenantId?: string | null;
  readonly workspaceId?: string | null;
}

/** Resolved authorization scope for a request. */
export interface AuthorizationContext {
  readonly actorId: string;
  readonly companyId: string | null;
  readonly membershipId: string | null;
  readonly organizationId: string | null;
  readonly roleId: string | null;
  readonly tenantId: string;
  readonly workspaceId: string | null;
}

export function actorFromAuthSession(
  session: AfendaAuthSession
): AuthorizationActor {
  return {
    actorId: session.user.userId,
  };
}

export function createAuthorizationCorrelationId(prefix = "authz"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

/** Validates required tenant context — never silently allows missing scope. */
export function assertTenantContext(
  context: AuthorizationContextInput
): asserts context is AuthorizationContextInput & { tenantId: string } {
  if (!context.tenantId?.trim()) {
    throw new MissingAuthorizationContextError(
      "tenantId is required for authorization.",
      "missing_tenant"
    );
  }
}

export class MissingAuthorizationContextError extends Error {
  readonly code: AuthorizationContextDenialCode;

  constructor(message: string, code: AuthorizationContextDenialCode) {
    super(message);
    this.name = "MissingAuthorizationContextError";
    this.code = code;
  }
}

export class MissingAuthorizationActorError extends Error {
  readonly code = "missing_actor" as const;

  constructor(
    message = "An authenticated actor is required for authorization."
  ) {
    super(message);
    this.name = "MissingAuthorizationActorError";
  }
}

export function isMissingAuthorizationContextError(
  error: unknown
): error is MissingAuthorizationContextError {
  return error instanceof MissingAuthorizationContextError;
}

export function isMissingAuthorizationActorError(
  error: unknown
): error is MissingAuthorizationActorError {
  return error instanceof MissingAuthorizationActorError;
}

export function assertAuthorizationActor(
  actor: AuthorizationActor | null | undefined
): asserts actor is AuthorizationActor {
  if (!actor?.actorId?.trim()) {
    throw new MissingAuthorizationActorError();
  }
}
