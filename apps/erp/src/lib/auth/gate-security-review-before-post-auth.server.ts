import { redirect } from "next/navigation";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

import {
  isPasswordlessPostAuthSignInMethod,
  isSecurityReviewOnPasswordlessActive,
} from "./auth-post-auth-method.constants";
import {
  hasSecurityReviewAckCookie,
  readPostAuthSignInMethodCookie,
} from "./auth-security-review.cookies.server";

function resolveSecurityReviewRedirect(
  nextParam: string | null | undefined
): string {
  const nextPath = resolveSafeInternalPath(nextParam, "");

  return buildAuthPath(
    "securityReview",
    nextPath.length > 0 ? { next: nextPath } : undefined
  );
}

/** Redirects passwordless sign-in sessions through security review when enabled. */
export async function gateSecurityReviewBeforePostAuth(
  nextParam: string | null | undefined
): Promise<void> {
  if (!isSecurityReviewOnPasswordlessActive()) {
    return;
  }

  if (await hasSecurityReviewAckCookie()) {
    return;
  }

  const method = await readPostAuthSignInMethodCookie();

  if (!isPasswordlessPostAuthSignInMethod(method)) {
    return;
  }

  redirect(resolveSecurityReviewRedirect(nextParam));
}
