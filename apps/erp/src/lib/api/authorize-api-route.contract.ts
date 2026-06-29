import type { ExecutionContext, OperatingContext } from "@afenda/kernel";
import type {
  AuthorizationDecision,
  AuthorizationDenialCode,
  ResolvedAuthorizationContext,
} from "@afenda/permissions";

import type { ApiErrorCode } from "@/server/api/contracts/api-error.contract";
import type { ApiRouteProtectionLevel } from "./api-route-context";
import type { ApiRoutePermissionRequirement } from "./api-route-permissions";

/** Serializable RBAC denial codes surfaced to API clients (via envelope). */
export type ApiRouteAuthorizationDenialCode =
  | AuthorizationDenialCode
  | "missing_context"
  | "missing_session";

/**
 * Server-only evaluation artifact for metadata diagnostics — never sent in API envelopes.
 */
export interface ApiRouteAuthorizationEvaluationArtifact {
  readonly authorizationDenialCode: AuthorizationDenialCode;
  readonly decision: AuthorizationDecision;
  readonly operatingContext: OperatingContext | null;
  readonly permissionKey: string;
}

export interface ApiRouteAuthorizationInput {
  readonly actorId: string | null;
  readonly correlationId: string;
  readonly method: string;
  readonly path: string;
  readonly permission: ApiRoutePermissionRequirement;
  readonly protectionLevel: ApiRouteProtectionLevel;
  readonly request: Request;
}

export interface ApiRouteAuthorizationSuccess {
  readonly authorization: ResolvedAuthorizationContext;
  readonly decision: AuthorizationDecision;
  readonly execution: ExecutionContext;
  readonly kind: "success";
  readonly operatingContext: OperatingContext | null;
}

export interface ApiRouteAuthorizationFailure {
  readonly apiCode: ApiErrorCode;
  readonly correlationId: string;
  readonly denialCode: ApiRouteAuthorizationDenialCode;
  readonly details?: unknown;
  /** Server-only RBAC evaluation artifact — not included in API error envelopes. */
  readonly evaluation?: ApiRouteAuthorizationEvaluationArtifact;
  readonly kind: "failure";
  readonly message: string;
}

export type ApiRouteAuthorizationResult =
  | ApiRouteAuthorizationFailure
  | ApiRouteAuthorizationSuccess;
