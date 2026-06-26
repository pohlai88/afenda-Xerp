import {
  getAfendaAuthSession,
  isAfendaAuthPasswordlessTwoFactorEnforcementActive,
  isAuthUserMfaEnabled,
} from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";

import {
  persistMfaChallengeCookie,
  readMfaChallengeCookie,
} from "./auth-mfa-challenge.cookies.server";
import { resolveSafeInternalPath } from "./resolve-safe-internal-path";

/**
 * When `AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR=enforce-all`, passwordless sign-in
 * may establish a session before 2FA. Redirect to MFA step-up before membership.
 */
export async function gatePasswordlessTwoFactorBeforePostAuth(
  nextParam: string | null | undefined,
  mfaPathBuilder: (next: string) => string = (next) =>
    buildAuthPath("mfa", next.length > 0 ? { next } : undefined)
): Promise<void> {
  if (!isAfendaAuthPasswordlessTwoFactorEnforcementActive()) {
    return;
  }

  const existingChallenge = await readMfaChallengeCookie();

  if (existingChallenge !== null) {
    return;
  }

  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    return;
  }

  const mfaEnabled = await isAuthUserMfaEnabled(session.user.authUserId);

  if (!mfaEnabled) {
    return;
  }

  const nextPath = resolveSafeInternalPath(nextParam, "");

  await persistMfaChallengeCookie({ methods: ["totp", "otp"] }, nextPath);

  redirect(mfaPathBuilder(nextPath));
}
