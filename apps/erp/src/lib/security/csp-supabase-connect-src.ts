import {
  getSupabasePublicUrl,
  hasSupabasePublicConfig,
} from "@/lib/supabase/env";
import { assertAllowlistedOrigin } from "./csp-allowlist";

export interface SupabaseCspPlatformOrigins {
  readonly connectSrc: readonly string[];
  readonly imgSrc: readonly string[];
}

/**
 * Resolves explicit Supabase browser CSP origins from public env.
 *
 * Covers REST, Auth, Functions, Storage API (`connect-src`) and public Storage
 * object URLs (`img-src`). Realtime uses matching `wss://` on the project host.
 *
 * Origins are derived from `NEXT_PUBLIC_SUPABASE_URL` — never wildcards.
 * Validated against Supabase MCP project `esxjzvcfqtaxmiwjntje` (2026-06-22).
 */
export function resolveSupabaseCspPlatformOrigins(
  env: NodeJS.ProcessEnv = process.env
): SupabaseCspPlatformOrigins {
  if (!hasSupabasePublicConfig(env)) {
    return { connectSrc: [], imgSrc: [] };
  }

  const projectUrl = new URL(getSupabasePublicUrl(env));
  const httpsOrigin = projectUrl.origin;
  const connectSrc = [httpsOrigin, `wss://${projectUrl.host}`] as const;
  const imgSrc = [httpsOrigin] as const;

  for (const origin of [...connectSrc, ...imgSrc]) {
    assertAllowlistedOrigin(origin);
  }

  return { connectSrc, imgSrc };
}

export function resolveSupabaseConnectSrcOrigins(
  env: NodeJS.ProcessEnv = process.env
): readonly string[] {
  return resolveSupabaseCspPlatformOrigins(env).connectSrc;
}
