import {
  BETTER_AUTH_SECRET_ENV,
  BETTER_AUTH_URL_ENV,
  MissingBetterAuthSecretError,
  MissingBetterAuthUrlError,
} from "./auth.errors.js";

function readTrimmedEnv(
  env: NodeJS.ProcessEnv,
  key: string
): string | undefined {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

export function getBetterAuthSecret(
  env: NodeJS.ProcessEnv = process.env
): string {
  const secret = readTrimmedEnv(env, BETTER_AUTH_SECRET_ENV);

  if (!secret || secret.length < 32) {
    throw new MissingBetterAuthSecretError();
  }

  return secret;
}

const TRAILING_SLASH_PATTERN = /\/$/;

export function getBetterAuthUrl(env: NodeJS.ProcessEnv = process.env): string {
  const url = readTrimmedEnv(env, BETTER_AUTH_URL_ENV);

  if (!url) {
    throw new MissingBetterAuthUrlError();
  }

  return url.replace(TRAILING_SLASH_PATTERN, "");
}

function resolveVercelDeploymentOrigin(
  env: NodeJS.ProcessEnv
): string | undefined {
  const vercelUrl = readTrimmedEnv(env, "VERCEL_URL");

  if (!vercelUrl) {
    return;
  }

  return `https://${vercelUrl.replace(TRAILING_SLASH_PATTERN, "")}`;
}

/** Public ERP origin for Better Auth — prefers Vercel preview URL when injected. */
export function resolveBetterAuthBaseUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  return resolveVercelDeploymentOrigin(env) ?? getBetterAuthUrl(env);
}

/** WebAuthn origin for Better Auth passkey plugin — must not include a trailing slash. */
export function resolveBetterAuthWebAuthnOrigin(
  env: NodeJS.ProcessEnv = process.env
): string {
  return resolveBetterAuthBaseUrl(env);
}

/** WebAuthn RP ID derived from the Better Auth public origin hostname. */
export function resolveBetterAuthWebAuthnRpId(
  env: NodeJS.ProcessEnv = process.env
): string {
  try {
    return new URL(resolveBetterAuthWebAuthnOrigin(env)).hostname;
  } catch {
    return "localhost";
  }
}

/** Human-readable relying party name for WebAuthn ceremonies. */
export const BETTER_AUTH_WEBAUTHN_RP_NAME = "Afenda ERP" as const;

export function resolveBetterAuthWebAuthnRpName(): string {
  return BETTER_AUTH_WEBAUTHN_RP_NAME;
}

/** Trusted browser origins for Better Auth CSRF — config URL + active Vercel preview. */
export function resolveBetterAuthTrustedOrigins(
  env: NodeJS.ProcessEnv = process.env
): readonly string[] {
  const origins = new Set<string>();

  try {
    origins.add(getBetterAuthUrl(env));
  } catch {
    // BETTER_AUTH_URL may be unset on ephemeral preview-only runs.
  }

  const vercelOrigin = resolveVercelDeploymentOrigin(env);

  if (vercelOrigin) {
    origins.add(vercelOrigin);
  }

  if (origins.size === 0) {
    throw new MissingBetterAuthUrlError();
  }

  return [...origins];
}

export function hasBetterAuthConfig(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  try {
    getBetterAuthSecret(env);
    getBetterAuthUrl(env);
    return true;
  } catch {
    return false;
  }
}

/** Env key for transactional auth email delivery (Resend/SES integration). */
export const AFENDA_AUTH_EMAIL_API_KEY_ENV = "AFENDA_AUTH_EMAIL_API_KEY";

/** True when a transactional email provider API key is configured. */
export function isAuthEmailDeliveryEnabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return Boolean(readTrimmedEnv(env, AFENDA_AUTH_EMAIL_API_KEY_ENV));
}

/** Runtime contract — mirrors `user.changeEmail.enabled` in `auth.config.ts`. */
export const AUTH_CHANGE_EMAIL_ENABLED = true as const;

/** Platform OAuth client ID env keys (ARCH-AUTH-001 Slice 13c). */
export const AFENDA_OAUTH_GOOGLE_CLIENT_ID_ENV =
  "AFENDA_OAUTH_GOOGLE_CLIENT_ID" as const;
export const AFENDA_OAUTH_GOOGLE_CLIENT_SECRET_ENV =
  "AFENDA_OAUTH_GOOGLE_CLIENT_SECRET" as const;
export const AFENDA_OAUTH_MICROSOFT_CLIENT_ID_ENV =
  "AFENDA_OAUTH_MICROSOFT_CLIENT_ID" as const;
export const AFENDA_OAUTH_MICROSOFT_CLIENT_SECRET_ENV =
  "AFENDA_OAUTH_MICROSOFT_CLIENT_SECRET" as const;

export function resolveOAuthClientSecretFromEnv(
  env: NodeJS.ProcessEnv,
  envKey: string
): string | undefined {
  return readTrimmedEnv(env, envKey);
}

export interface BetterAuthSocialProviderConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly disableImplicitSignUp: true;
}

export type BetterAuthSocialProvidersConfig = Partial<
  Record<"google" | "microsoft", BetterAuthSocialProviderConfig>
>;

/** Resolves Better Auth `socialProviders` from platform env (tenant secrets via env key). */
export function resolveBetterAuthSocialProviders(
  env: NodeJS.ProcessEnv = process.env
): BetterAuthSocialProvidersConfig | undefined {
  const providers: BetterAuthSocialProvidersConfig = {};

  const googleClientId = readTrimmedEnv(env, AFENDA_OAUTH_GOOGLE_CLIENT_ID_ENV);
  const googleClientSecret = readTrimmedEnv(
    env,
    AFENDA_OAUTH_GOOGLE_CLIENT_SECRET_ENV
  );

  if (googleClientId && googleClientSecret) {
    providers.google = {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      disableImplicitSignUp: true,
    };
  }

  const microsoftClientId = readTrimmedEnv(
    env,
    AFENDA_OAUTH_MICROSOFT_CLIENT_ID_ENV
  );
  const microsoftClientSecret = readTrimmedEnv(
    env,
    AFENDA_OAUTH_MICROSOFT_CLIENT_SECRET_ENV
  );

  if (microsoftClientId && microsoftClientSecret) {
    providers.microsoft = {
      clientId: microsoftClientId,
      clientSecret: microsoftClientSecret,
      disableImplicitSignUp: true,
    };
  }

  return Object.keys(providers).length > 0 ? providers : undefined;
}

/** Whether Better Auth change-email is enabled for ERP profile UI gating. */
export function isAuthChangeEmailEnabled(): boolean {
  return AUTH_CHANGE_EMAIL_ENABLED;
}
