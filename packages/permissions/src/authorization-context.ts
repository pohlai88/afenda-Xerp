import type { AfendaAuthSession } from "@afenda/auth";

import type { AuthorizationContextDenialCode } from "./authorization-denial-code.js";

/** Actor identity supplied by TIP-004 — permissions never authenticate. */
export interface AuthorizationActor {
  readonly actorId: string;
}

export interface AuthorizationContextInput {
  readonly companyId?: string | null;
  readonly entityGroupId?: string | null;
  readonly organizationId?: string | null;
  readonly projectId?: string | null;
  readonly teamId?: string | null;
  readonly tenantId?: string | null;
  readonly workspaceId?: string | null;
}

/** Resolved authorization scope for a request. */
export interface AuthorizationContext {
  readonly actorId: string;
  readonly companyId: string | null;
  readonly entityGroupId: string | null;
  readonly membershipId: string | null;
  readonly organizationId: string | null;
  readonly roleId: string | null;
  readonly tenantId: string;
  readonly workspaceId: string | null;
}

/** Scope with membership and role resolved after permission checks. */
export interface ResolvedAuthorizationContext extends AuthorizationContext {
  readonly membershipId: string;
  readonly roleId: string;
}

export function actorFromAuthSession(
  session: AfendaAuthSession
): AuthorizationActor {
  const actorId = session.user.userId?.trim();

  if (!actorId) {
    throw new MissingAuthorizationActorError(
      "Authenticated identity is not linked to a platform user."
    );
  }

  return {
    actorId,
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

export function resolveAuthorizationContext(
  actor: AuthorizationActor,
  input: AuthorizationContextInput
): AuthorizationContext {
  assertTenantContext(input);

  return {
    actorId: actor.actorId,
    tenantId: input.tenantId,
    companyId: input.companyId ?? null,
    entityGroupId: input.entityGroupId ?? null,
    organizationId: input.organizationId ?? null,
    workspaceId: input.workspaceId ?? null,
    membershipId: null,
    roleId: null,
  };
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
