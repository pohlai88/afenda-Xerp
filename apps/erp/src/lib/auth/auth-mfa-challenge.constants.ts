/** HttpOnly cookie carrying a signed MFA challenge payload. */
export const AFENDA_MFA_CHALLENGE_COOKIE = "afenda-mfa-challenge" as const;

/** MFA challenge cookie lifetime — matches Better Auth OTP expiry guidance. */
export const MFA_CHALLENGE_COOKIE_MAX_AGE_SECONDS = 300 as const;
