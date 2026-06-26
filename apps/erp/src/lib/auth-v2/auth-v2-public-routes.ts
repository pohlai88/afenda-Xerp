import { AUTH_V2_SEGMENT_PATHS } from "./auth-v2-path.registry";

/** Public auth-v2 entry UI — logged-in users are redirected away via proxy. */
export const AUTH_V2_ENTRY_ROUTE_PREFIXES = [...AUTH_V2_SEGMENT_PATHS] as const;

export function isAuthV2EntryRoute(pathname: string): boolean {
  return AUTH_V2_ENTRY_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
