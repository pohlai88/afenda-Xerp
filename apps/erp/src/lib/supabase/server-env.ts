import type { SupabaseEnv } from "@supabase/server";

import {
  getSupabaseJwksUrl,
  getSupabasePublicKey,
  getSupabasePublicUrl,
  getSupabaseSecretKey,
  hasSupabasePublicConfig,
  hasSupabaseSecretKey,
} from "./env";

/**
 * Maps Afenda env vars to {@link SupabaseEnv} overrides for `@supabase/server`.
 *
 * Accepts both sync-derived server vars (`SUPABASE_*`) and browser-safe
 * `NEXT_PUBLIC_*` fallbacks so local dev works before `pnpm env:sync`.
 */
export function getSupabaseServerEnv(
  env: NodeJS.ProcessEnv = process.env
): Partial<SupabaseEnv> {
  const overrides: Partial<SupabaseEnv> = {};

  if (hasSupabasePublicConfig(env)) {
    overrides.url = getSupabasePublicUrl(env);
    overrides.publishableKeys = { default: getSupabasePublicKey(env) };
  }

  if (hasSupabaseSecretKey(env)) {
    overrides.secretKeys = { default: getSupabaseSecretKey(env) };
  }

  const jwksUrl = getSupabaseJwksUrl(env);

  if (jwksUrl) {
    overrides.jwks = new URL(jwksUrl);
  }

  return overrides;
}
