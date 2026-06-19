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
