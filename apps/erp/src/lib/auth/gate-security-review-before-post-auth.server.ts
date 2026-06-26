import { redirect } from "next/navigation";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { isAuthShellV2Default } from "@/lib/auth/is-auth-shell-v2-default";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";
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

  if (isAuthShellV2Default()) {
    return buildAuthV2Path(
      "securityReview",
      nextPath.length > 0 ? { next: nextPath } : undefined
    );
  }

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
