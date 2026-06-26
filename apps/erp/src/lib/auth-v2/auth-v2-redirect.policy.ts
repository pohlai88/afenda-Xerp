import type { AfendaAuthSession } from "@afenda/auth";

import {
  type PostAuthMembershipHint,
  resolvePostAuthEntry,
} from "@/lib/auth/auth-redirect.policy";
import {
  DEFAULT_SAFE_INTERNAL_PATH,
  resolveSafeInternalPath,
} from "@/lib/auth/resolve-safe-internal-path";

import { AUTH_V2_PATHS, buildAuthV2Path } from "./auth-v2-path.registry";

export function resolveAuthV2SignInSuccessRedirect(
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

export function resolveAuthV2SignUpSuccessRedirect(): string {
  return AUTH_V2_PATHS.verifyEmail.sent;
}

export function resolveAuthV2PasswordResetSuccessRedirect(): string {
  return AUTH_V2_PATHS.resetPassword.success;
}

export function resolveAuthV2SignInAfterPasswordResetPath(): string {
  return buildAuthV2Path("signIn", { notice: "password-reset" });
}

export function resolveAuthV2MfaEntryRedirect(): string {
  return AUTH_V2_PATHS.mfa;
}

export function resolveAuthV2OtpEntryRedirect(): string {
  return buildAuthV2Path("mfa", { method: "otp" });
}

export function resolveAuthV2UnauthenticatedRedirect(
  returnPath: string
): string {
  return buildAuthV2Path("signIn", { next: returnPath });
}

export function resolveAuthV2EmailVerifiedRedirect(): string {
  return AUTH_V2_PATHS.verifyEmail.success;
}

export function resolveAuthV2InviteAcceptRedirect(
  invitationToken: string,
  email?: string
): string {
  return buildAuthV2Path("signUp", {
    invitationToken,
    email,
  });
}

export function resolveAuthV2PostAuthCompletePath(
  nextParam: string | null | undefined
): string {
  return buildAuthV2Path("postAuthComplete", {
    next: resolveSafeInternalPath(nextParam, "") || undefined,
  });
}

export function resolveAuthV2UnlinkedSessionRedirect(): string {
  return buildAuthV2Path("accessDenied", { reason: "unlinked" });
}

export function resolveAuthV2SessionExpiredRedirect(
  returnPath?: string | null
): string {
  const safeNext = resolveSafeInternalPath(returnPath, "");
  if (safeNext.length > 0) {
    return buildAuthV2Path("sessionExpired", { next: safeNext });
  }

  return AUTH_V2_PATHS.sessionExpired;
}
