import type { AfendaAuthSession } from "@afenda/auth";

import { AUTH_PATHS, buildAuthPath } from "./auth-path.registry";
import {
  DEFAULT_SAFE_INTERNAL_PATH,
  resolveSafeInternalPath,
} from "./resolve-safe-internal-path";

export type PostAuthMembershipHint = {
  readonly workspaceCount?: number;
};

/**
 * Resolves the ERP entry path after successful authentication.
 * Stub: returns `/` until membership resolver is wired (operating-context slice).
 */
export function resolvePostAuthEntry(
  _session?: AfendaAuthSession | null,
  hint?: PostAuthMembershipHint
): string {
  const workspaceCount = hint?.workspaceCount;
  if (workspaceCount !== undefined && workspaceCount > 1) {
    return AUTH_PATHS.workspaceSelect;
  }

  return DEFAULT_SAFE_INTERNAL_PATH;
}

export function resolveSignInSuccessRedirect(
  nextParam: string | null | undefined,
  session?: AfendaAuthSession | null,
  hint?: PostAuthMembershipHint
): string {
  const safeNext = resolveSafeInternalPath(nextParam, "");
  if (safeNext.length > 0 && safeNext !== DEFAULT_SAFE_INTERNAL_PATH) {
    return safeNext;
  }

  return resolvePostAuthEntry(session, hint);
}

export function resolveSignUpSuccessRedirect(): string {
  return AUTH_PATHS.verifyEmail.sent;
}

export function resolveEmailVerifiedRedirect(): string {
  return AUTH_PATHS.verifyEmail.success;
}

export function resolvePasswordResetSuccessRedirect(): string {
  return AUTH_PATHS.resetPassword.success;
}

export function resolveSignInAfterPasswordResetPath(): string {
  return buildAuthPath("signIn", { notice: "password-reset" });
}

export function resolveUnauthenticatedRedirect(returnPath: string): string {
  return buildAuthPath("signIn", { next: returnPath });
}

export function resolveSessionExpiredRedirect(
  returnPath?: string | null
): string {
  const safeNext = resolveSafeInternalPath(returnPath, "");
  if (safeNext.length > 0) {
    return buildAuthPath("sessionExpired", { next: safeNext });
  }

  return AUTH_PATHS.sessionExpired;
}

export function resolveUnlinkedSessionRedirect(): string {
  return buildAuthPath("accessDenied", { reason: "unlinked" });
}

export function resolveMfaEntryRedirect(): string {
  return AUTH_PATHS.mfa;
}

export function resolveOtpEntryRedirect(): string {
  return buildAuthPath("mfa", { method: "otp" });
}

export function resolvePostAuthCompletePath(
  nextParam: string | null | undefined
): string {
  return buildAuthPath("postAuthComplete", {
    next: resolveSafeInternalPath(nextParam, "") || undefined,
  });
}

export function resolveInviteAcceptRedirect(
  invitationToken: string,
  email?: string
): string {
  return buildAuthPath("signUp", {
    invitationToken,
    email,
  });
}
