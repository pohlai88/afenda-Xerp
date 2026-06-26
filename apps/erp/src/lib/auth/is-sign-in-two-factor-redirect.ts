export type SignInTwoFactorMethod = "otp" | "totp";

export interface SignInTwoFactorChallenge {
  readonly methods: readonly SignInTwoFactorMethod[];
}

function isSignInTwoFactorMethod(
  value: unknown
): value is SignInTwoFactorMethod {
  return value === "totp" || value === "otp";
}

/** Narrows Better Auth sign-in success payload when 2FA verification is required. */
export function readSignInTwoFactorChallenge(
  data: unknown
): SignInTwoFactorChallenge | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  if (
    !("twoFactorRedirect" in data) ||
    (data as { twoFactorRedirect?: boolean }).twoFactorRedirect !== true
  ) {
    return null;
  }

  const rawMethods =
    "twoFactorMethods" in data
      ? (data as { twoFactorMethods?: unknown }).twoFactorMethods
      : undefined;

  if (!Array.isArray(rawMethods)) {
    return { methods: ["totp"] };
  }

  const methods = rawMethods.filter(isSignInTwoFactorMethod);

  return {
    methods: methods.length > 0 ? methods : (["totp"] as const),
  };
}
