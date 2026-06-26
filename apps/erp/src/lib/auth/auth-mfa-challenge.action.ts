"use server";

import type { SignInTwoFactorChallenge } from "@/lib/auth/is-sign-in-two-factor-redirect";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

import {
  clearMfaChallengeCookie,
  persistMfaChallengeCookie,
} from "./auth-mfa-challenge.cookies.server";

export async function persistMfaChallengeAction(
  challenge: SignInTwoFactorChallenge,
  nextParam: string | null | undefined
): Promise<void> {
  const nextPath = resolveSafeInternalPath(nextParam, "");
  await persistMfaChallengeCookie(challenge, nextPath);
}

export async function clearMfaChallengeAction(): Promise<void> {
  await clearMfaChallengeCookie();
}
