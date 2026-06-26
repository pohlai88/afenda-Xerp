import { AFENDA_AUTH_OAUTH_CALLBACK_PREFIX } from "./auth.oauth-policy.js";
import {
  AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX,
  AFENDA_AUTH_SSO_SAML_CALLBACK_PREFIX,
} from "./auth.sso-policy.js";

/**
 * Better Auth default 2FA enforcement scope.
 *
 * Credential endpoints (`/sign-in/email`, `/sign-in/username`, `/sign-in/phone-number`)
 * issue a 2FA challenge when `twoFactorEnabled` is true. Passwordless flows (OAuth,
 * passkey, SSO, magic link) are not gated unless `enforce-all` mode adds custom hooks.
 *
 * @see https://better-auth.com/docs/plugins/2fa#sign-in-with-2fa
 */
export const AFENDA_AUTH_CREDENTIAL_TWO_FACTOR_ENFORCEMENT =
  "better-auth-credential-endpoints-only" as const;

export type AfendaAuthCredentialTwoFactorEnforcement =
  typeof AFENDA_AUTH_CREDENTIAL_TWO_FACTOR_ENFORCEMENT;

/** Runtime mode for passwordless sign-in 2FA — `enforce-all` requires future hook slice. */
export type AfendaAuthPasswordlessTwoFactorMode =
  | "credential-only"
  | "enforce-all";

export const AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR_ENV =
  "AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR" as const;

/** Better Auth paths where passwordless sign-in completes without native 2FA gating. */
export const AFENDA_AUTH_PASSWORDLESS_SIGN_IN_PATH_PREFIXES = [
  AFENDA_AUTH_OAUTH_CALLBACK_PREFIX,
  AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX,
  AFENDA_AUTH_SSO_SAML_CALLBACK_PREFIX,
  "/passkey/verify-authentication",
  "/sign-in/sso",
] as const;

export const AFENDA_AUTH_PASSKEY_SIGN_IN_PATH =
  "/passkey/verify-authentication" as const;

export function resolveAfendaAuthPasswordlessTwoFactorMode(
  env: NodeJS.ProcessEnv = process.env
): AfendaAuthPasswordlessTwoFactorMode {
  const raw = env[AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR_ENV]?.trim();

  return raw === "enforce-all" ? "enforce-all" : "credential-only";
}

export function isAfendaAuthPasswordlessSignInPath(path: string): boolean {
  return AFENDA_AUTH_PASSWORDLESS_SIGN_IN_PATH_PREFIXES.some((prefix) =>
    path.startsWith(prefix)
  );
}

export function isAfendaAuthPasswordlessTwoFactorEnforcementActive(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return resolveAfendaAuthPasswordlessTwoFactorMode(env) === "enforce-all";
}
