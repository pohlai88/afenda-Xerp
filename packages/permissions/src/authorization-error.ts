import type { PermissionKey } from "@afenda/database";

import type { AuthorizationDenialCode } from "./authorization-denial-code.js";
import type { PolicyDecision } from "./policy.contract.js";

export type { AuthorizationDenialCode } from "./authorization-denial-code.js";

/** Audit-ready authorization decision — safe to persist or emit to audit pipeline. */
export interface AuthorizationDecision {
  readonly action: string;
  readonly actorId: string;
  readonly companyId: string | null;
  readonly correlationId: string;
  readonly entityGroupId: string | null;
  readonly evaluatedAt: string;
  readonly membershipId: string | null;
  readonly organizationId: string | null;
  readonly permissionKey: PermissionKey;
  readonly reason: string;
  readonly result: PolicyDecision;
  readonly roleId: string | null;
  readonly targetId: string | null;
  readonly targetType: string | null;
  readonly tenantId: string;
  readonly workspaceId: string | null;
}

/** Standard denied-action payload for callers and audit writers. */
export interface DeniedAuthorizationResult {
  readonly allowed: false;
  readonly code: AuthorizationDenialCode;
  readonly decision: AuthorizationDecision;
}

export interface AllowedAuthorizationResult {
  readonly allowed: true;
  readonly decision: AuthorizationDecision;
}

export type AuthorizationResult =
  | AllowedAuthorizationResult
  | DeniedAuthorizationResult;

export class AuthorizationDeniedError extends Error {
  readonly code: AuthorizationDenialCode;
  readonly decision: AuthorizationDecision;

  constructor(decision: AuthorizationDecision, code: AuthorizationDenialCode) {
    super(decision.reason);
    this.name = "AuthorizationDeniedError";
    this.decision = decision;
    this.code = code;
  }
}

export class PolicyGateError extends Error {
  readonly code: AuthorizationDenialCode = "policy_gated";
  readonly decision: AuthorizationDecision;

  constructor(decision: AuthorizationDecision) {
    super(decision.reason);
    this.name = "PolicyGateError";
    this.decision = decision;
  }
}

export function isAuthorizationDeniedError(
  error: unknown
): error is AuthorizationDeniedError {
  return error instanceof AuthorizationDeniedError;
}

export function isPolicyGateError(error: unknown): error is PolicyGateError {
  return error instanceof PolicyGateError;
}

export function isDeniedAuthorizationResult(
  result: AuthorizationResult
): result is DeniedAuthorizationResult {
  return !result.allowed;
}

export function createDeniedAuthorizationResult(
  decision: AuthorizationDecision,
  code: AuthorizationDenialCode
): DeniedAuthorizationResult {
  return {
    allowed: false,
    code,
    decision,
  };
}

export function createAllowedAuthorizationResult(
  decision: AuthorizationDecision
): AllowedAuthorizationResult {
  return {
    allowed: true,
    decision,
  };
}

export function buildAuthorizationDecision(
  input: Omit<AuthorizationDecision, "evaluatedAt"> & {
    evaluatedAt?: string;
  }
): AuthorizationDecision {
  return {
    ...input,
    evaluatedAt: input.evaluatedAt ?? new Date().toISOString(),
  };
}
