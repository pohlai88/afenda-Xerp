import { AUTH_SEGMENT_PATHS } from "./auth-path.registry";

export const DEV_HARNESS_ROUTE_PREFIXES = [
  "/governance-integration",
  "/appshell-demo",
  "/appshell-canvas",
  "/policy-gate",
] as const;

/** Public auth entry UI — logged-in users are redirected away via proxy. */
export const AUTH_ENTRY_ROUTE_PREFIXES = [...AUTH_SEGMENT_PATHS] as const;

export const PUBLIC_ROUTE_PREFIXES = [
  ...AUTH_ENTRY_ROUTE_PREFIXES,
  "/api/auth",
  "/api/health",
  "/api/internal/v1/health",
  "/api/internal/v1/client-error",
  ...DEV_HARNESS_ROUTE_PREFIXES,
] as const;

export function isDevHarnessRoute(pathname: string): boolean {
  return DEV_HARNESS_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthEntryRoute(pathname: string): boolean {
  return AUTH_ENTRY_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
