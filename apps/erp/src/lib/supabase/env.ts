import type { EnvReaderSource } from "@/lib/env/env-reader-source";

export const SUPABASE_PUBLIC_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
export const SUPABASE_PUBLIC_PUBLISHABLE_KEY_ENV =
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
export const SUPABASE_PUBLIC_ANON_KEY_ENV = "NEXT_PUBLIC_SUPABASE_ANON_KEY";
export const SUPABASE_SERVER_URL_ENV = "SUPABASE_URL";
export const SUPABASE_SERVER_PUBLISHABLE_KEY_ENV = "SUPABASE_PUBLISHABLE_KEY";
export const SUPABASE_SECRET_KEY_ENV = "SUPABASE_SECRET_KEY";
export const SUPABASE_SERVICE_ROLE_KEY_ENV = "SUPABASE_SERVICE_ROLE_KEY";
export const SUPABASE_JWKS_URL_ENV = "SUPABASE_JWKS_URL";
export const SUPABASE_JWT_KID_ENV = "SUPABASE_JWT_KID";
export const SUPABASE_JWT_KEY_ENV = "SUPABASE_JWT_KEY";

const TRAILING_SLASH_PATTERN = /\/$/;

export class MissingSupabasePublicUrlError extends Error {
  constructor() {
    super(
      `${SUPABASE_PUBLIC_URL_ENV} is required for Supabase browser and SSR clients. ` +
        "Set it in .env.config and run pnpm env:sync."
    );
    this.name = "MissingSupabasePublicUrlError";
  }
}

export class MissingSupabasePublicKeyError extends Error {
  constructor() {
    super(
      `${SUPABASE_PUBLIC_PUBLISHABLE_KEY_ENV} (or legacy ${SUPABASE_PUBLIC_ANON_KEY_ENV}) ` +
        "is required for Supabase browser and SSR clients."
    );
    this.name = "MissingSupabasePublicKeyError";
  }
}

export class MissingSupabaseSecretKeyError extends Error {
  constructor() {
    super(
      `${SUPABASE_SECRET_KEY_ENV} (or legacy ${SUPABASE_SERVICE_ROLE_KEY_ENV}) ` +
        "is required for privileged Supabase server operations."
    );
    this.name = "MissingSupabaseSecretKeyError";
  }
}

function readTrimmedEnv(env: EnvReaderSource, key: string): string | undefined {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

export function getSupabasePublicUrl(
  env: EnvReaderSource = process.env
): string {
  const url =
    readTrimmedEnv(env, SUPABASE_PUBLIC_URL_ENV) ??
    readTrimmedEnv(env, SUPABASE_SERVER_URL_ENV);

  if (!url) {
    throw new MissingSupabasePublicUrlError();
  }

  return url;
}

export function getSupabasePublicKey(
  env: EnvReaderSource = process.env
): string {
  const key =
    readTrimmedEnv(env, SUPABASE_PUBLIC_PUBLISHABLE_KEY_ENV) ??
    readTrimmedEnv(env, SUPABASE_PUBLIC_ANON_KEY_ENV) ??
    readTrimmedEnv(env, SUPABASE_SERVER_PUBLISHABLE_KEY_ENV);

  if (!key) {
    throw new MissingSupabasePublicKeyError();
  }

  return key;
}

export function getSupabaseSecretKey(
  env: EnvReaderSource = process.env
): string {
  const key =
    readTrimmedEnv(env, SUPABASE_SECRET_KEY_ENV) ??
    readTrimmedEnv(env, SUPABASE_SERVICE_ROLE_KEY_ENV);

  if (!key) {
    throw new MissingSupabaseSecretKeyError();
  }

  return key;
}

export function getSupabaseJwksUrl(
  env: EnvReaderSource = process.env
): string | undefined {
  const explicitUrl = readTrimmedEnv(env, SUPABASE_JWKS_URL_ENV);

  if (explicitUrl) {
    return explicitUrl;
  }

  const projectUrl =
    readTrimmedEnv(env, SUPABASE_PUBLIC_URL_ENV) ??
    readTrimmedEnv(env, SUPABASE_SERVER_URL_ENV);

  if (!projectUrl) {
    return;
  }

  return `${projectUrl.replace(TRAILING_SLASH_PATTERN, "")}/auth/v1/.well-known/jwks.json`;
}

export function getSupabaseJwtKeyId(
  env: EnvReaderSource = process.env
): string | undefined {
  return (
    readTrimmedEnv(env, SUPABASE_JWT_KID_ENV) ??
    readTrimmedEnv(env, SUPABASE_JWT_KEY_ENV)
  );
}

export function hasSupabaseJwtConfig(
  env: EnvReaderSource = process.env
): boolean {
  return Boolean(getSupabaseJwksUrl(env) && getSupabaseJwtKeyId(env));
}

export function hasSupabasePublicConfig(
  env: EnvReaderSource = process.env
): boolean {
  try {
    getSupabasePublicUrl(env);
    getSupabasePublicKey(env);
    return true;
  } catch {
    return false;
  }
}

export function hasSupabaseSecretKey(
  env: EnvReaderSource = process.env
): boolean {
  return Boolean(
    readTrimmedEnv(env, SUPABASE_SECRET_KEY_ENV) ??
      readTrimmedEnv(env, SUPABASE_SERVICE_ROLE_KEY_ENV)
  );
}
