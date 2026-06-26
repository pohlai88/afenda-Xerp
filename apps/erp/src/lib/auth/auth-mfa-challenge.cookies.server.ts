import { createHmac, timingSafeEqual } from "node:crypto";

import { getBetterAuthSecret } from "@afenda/auth";
import { cookies } from "next/headers";

import {
  AFENDA_MFA_CHALLENGE_COOKIE,
  MFA_CHALLENGE_COOKIE_MAX_AGE_SECONDS,
} from "./auth-mfa-challenge.constants";
import {
  clearMfaChallengeStorePayload,
  persistMfaChallengeStorePayload,
  readMfaChallengeStorePayload,
  readMfaChallengeStoreReference,
} from "./auth-mfa-challenge.store.server";
import type { SignInTwoFactorChallenge } from "./is-sign-in-two-factor-redirect";

const MFA_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: MFA_CHALLENGE_COOKIE_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
} as const;

function signMfaChallengePayload(serialized: string, secret: string): string {
  return createHmac("sha256", secret).update(serialized).digest("base64url");
}

function encodeSignedMfaChallengeCookie(
  serialized: string,
  secret: string
): string {
  return `${serialized}.${signMfaChallengePayload(serialized, secret)}`;
}

function decodeSignedMfaChallengeCookie(
  value: string,
  secret: string
): string | null {
  const separatorIndex = value.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return null;
  }

  const serialized = value.slice(0, separatorIndex);
  const signature = value.slice(separatorIndex + 1);
  const expected = signMfaChallengePayload(serialized, secret);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  return serialized;
}

export async function persistMfaChallengeCookie(
  challenge: SignInTwoFactorChallenge,
  nextPath: string
): Promise<void> {
  const secret = getBetterAuthSecret();
  const cookieStore = await cookies();
  const storedValue = await persistMfaChallengeStorePayload({
    challenge,
    nextPath,
    exp: Date.now() + MFA_CHALLENGE_COOKIE_MAX_AGE_SECONDS * 1000,
  });

  const cookieValue =
    readMfaChallengeStoreReference(storedValue) === null
      ? encodeSignedMfaChallengeCookie(storedValue, secret)
      : storedValue;

  cookieStore.set(AFENDA_MFA_CHALLENGE_COOKIE, cookieValue, MFA_COOKIE_OPTIONS);
}

export async function readMfaChallengeCookie(): Promise<{
  readonly challenge: SignInTwoFactorChallenge;
  readonly nextPath: string;
} | null> {
  const secret = getBetterAuthSecret();
  const cookieStore = await cookies();
  const raw = cookieStore.get(AFENDA_MFA_CHALLENGE_COOKIE)?.value;

  if (raw === undefined || raw.length === 0) {
    return null;
  }

  const storedValue =
    readMfaChallengeStoreReference(raw) === null
      ? decodeSignedMfaChallengeCookie(raw, secret)
      : raw;

  if (storedValue === null) {
    return null;
  }

  const decoded = await readMfaChallengeStorePayload(storedValue);

  if (decoded === null) {
    return null;
  }

  return {
    challenge: decoded.challenge,
    nextPath: decoded.nextPath,
  };
}

export async function clearMfaChallengeCookie(): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AFENDA_MFA_CHALLENGE_COOKIE)?.value;

  if (raw !== undefined && raw.length > 0) {
    await clearMfaChallengeStorePayload(raw);
  }

  cookieStore.delete(AFENDA_MFA_CHALLENGE_COOKIE);
}
