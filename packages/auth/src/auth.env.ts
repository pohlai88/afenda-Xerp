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
