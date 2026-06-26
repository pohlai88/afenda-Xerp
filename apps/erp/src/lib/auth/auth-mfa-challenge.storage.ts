import type { SignInTwoFactorChallenge } from "./is-sign-in-two-factor-redirect";

const MFA_CHALLENGE_STORAGE_KEY = "afenda-auth-mfa-challenge";
const MFA_NEXT_STORAGE_KEY = "afenda-auth-mfa-next";

export function persistMfaChallenge(
  challenge: SignInTwoFactorChallenge,
  nextPath: string
): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  sessionStorage.setItem(MFA_CHALLENGE_STORAGE_KEY, JSON.stringify(challenge));
  sessionStorage.setItem(MFA_NEXT_STORAGE_KEY, nextPath);
}

export function readPersistedMfaChallenge(): {
  challenge: SignInTwoFactorChallenge;
  nextPath: string;
} | null {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  const rawChallenge = sessionStorage.getItem(MFA_CHALLENGE_STORAGE_KEY);
  const nextPath = sessionStorage.getItem(MFA_NEXT_STORAGE_KEY);

  if (rawChallenge === null || nextPath === null) {
    return null;
  }

  try {
    const challenge = JSON.parse(rawChallenge) as SignInTwoFactorChallenge;
    if (!Array.isArray(challenge.methods)) {
      return null;
    }

    return { challenge, nextPath };
  } catch {
    return null;
  }
}

export function clearPersistedMfaChallenge(): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  sessionStorage.removeItem(MFA_CHALLENGE_STORAGE_KEY);
  sessionStorage.removeItem(MFA_NEXT_STORAGE_KEY);
}
