import type { EnvReaderInput } from "@/lib/env/env-reader-source";
import { readRuntimeEnvSource } from "@/lib/env/env-reader-source";

export const AFENDA_POST_AUTH_SIGN_IN_METHOD_COOKIE =
  "afenda-post-auth-sign-in-method" as const;

export const AFENDA_POST_AUTH_SIGN_IN_METHOD_MAX_AGE_SECONDS = 600;

export const AFENDA_SECURITY_REVIEW_ACK_COOKIE =
  "afenda-security-review-ack" as const;

export const AFENDA_SECURITY_REVIEW_ACK_MAX_AGE_SECONDS = 86_400;

/** Sign-in methods that establish a session without password re-entry. */
export const PASSWORDLESS_POST_AUTH_SIGN_IN_METHODS = [
  "google",
  "github",
  "passkey",
  "sso",
] as const;

export type PostAuthSignInMethod =
  | "email"
  | (typeof PASSWORDLESS_POST_AUTH_SIGN_IN_METHODS)[number];

export const AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS_ENV =
  "AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS" as const;

export type SecurityReviewOnPasswordlessEnvSource = EnvReaderInput<
  typeof AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS_ENV
>;

export function isPasswordlessPostAuthSignInMethod(
  method: string | null | undefined
): method is (typeof PASSWORDLESS_POST_AUTH_SIGN_IN_METHODS)[number] {
  if (method === null || method === undefined || method.length === 0) {
    return false;
  }

  return (PASSWORDLESS_POST_AUTH_SIGN_IN_METHODS as readonly string[]).includes(
    method
  );
}

export function isSecurityReviewOnPasswordlessActive(
  env: SecurityReviewOnPasswordlessEnvSource = readRuntimeEnvSource()
): boolean {
  return env[AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS_ENV] === "true";
}
