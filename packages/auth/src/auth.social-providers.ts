import type { TenantOAuthProviderId } from "@afenda/database";

/** Canonical Better Auth social OAuth provider ids (google, microsoft). */
export const AFENDA_AUTH_SOCIAL_PROVIDER_IDS = [
  "google",
  "microsoft",
] as const satisfies readonly TenantOAuthProviderId[];

export type AfendaAuthSocialProviderId =
  (typeof AFENDA_AUTH_SOCIAL_PROVIDER_IDS)[number];

export function isAfendaAuthSocialProviderId(
  value: string
): value is AfendaAuthSocialProviderId {
  return (AFENDA_AUTH_SOCIAL_PROVIDER_IDS as readonly string[]).includes(value);
}

/** @deprecated Prefer `AFENDA_AUTH_SOCIAL_PROVIDER_IDS` — alias retained for compatibility. */
export const AFENDA_OAUTH_PROVIDER_IDS = AFENDA_AUTH_SOCIAL_PROVIDER_IDS;

/** @deprecated Prefer `AFENDA_AUTH_SOCIAL_PROVIDER_IDS` — alias retained for compatibility. */
export const SIGN_IN_SOCIAL_PROVIDER_IDS = AFENDA_AUTH_SOCIAL_PROVIDER_IDS;

/** @deprecated Prefer `AfendaAuthSocialProviderId` — alias retained for compatibility. */
export type SignInSocialProviderId = AfendaAuthSocialProviderId;
