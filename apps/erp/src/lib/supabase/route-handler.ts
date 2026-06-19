import {
  createSupabaseContext,
  type SupabaseContext,
  type WithSupabaseConfig,
  withSupabase,
} from "@supabase/server";

import { getSupabaseServerEnv } from "./server-env";

export type { SupabaseContext, WithSupabaseConfig } from "@supabase/server";

type SupabaseRouteHandler = (
  request: Request,
  context: SupabaseContext
) => Promise<Response>;

function mergeSupabaseRouteConfig(
  config: WithSupabaseConfig
): WithSupabaseConfig {
  const { cors = false, env, ...rest } = config;

  return {
    ...rest,
    cors,
    env: {
      ...getSupabaseServerEnv(),
      ...env,
    },
  };
}

/**
 * Next.js App Router helper around `withSupabase`.
 *
 * Disables Supabase Edge CORS headers (Next handles CORS separately) and
 * bridges Afenda env naming to `@supabase/server`'s {@link SupabaseEnv}.
 *
 * Use `@/lib/supabase/server` (`@supabase/ssr`) for cookie-backed RSC pages;
 * use this for API routes that accept `Authorization: Bearer` or `apikey`.
 */
export function withSupabaseRoute(
  config: WithSupabaseConfig,
  handler: SupabaseRouteHandler
) {
  return withSupabase(mergeSupabaseRouteConfig(config), handler);
}

/**
 * Builds a {@link SupabaseContext} inside a Route Handler without the
 * `withSupabase` wrapper — useful when auth mode depends on the request path.
 */
export function createSupabaseRouteContext(
  request: Request,
  config: WithSupabaseConfig
) {
  return createSupabaseContext(request, mergeSupabaseRouteConfig(config));
}
