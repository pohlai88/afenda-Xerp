import { AUTH_PATHS, AUTH_SEGMENT_PATHS } from "./auth-path.registry";

export const DEV_HARNESS_ROUTE_PREFIXES = [
  "/governance-integration",
  "/appshell-demo",
  "/appshell-canvas",
  "/policy-gate",
] as const;

export const AUTH_POST_AUTH_COMPLETE_ROUTE_PREFIXES = [
  AUTH_PATHS.postAuthComplete,
] as const;

/** Auth UI that must stay reachable while a session is already established. */
export const AUTH_SESSION_ALLOWED_ROUTE_PREFIXES = [
  ...AUTH_POST_AUTH_COMPLETE_ROUTE_PREFIXES,
  AUTH_PATHS.securityReview,
  AUTH_PATHS.mfa,
  AUTH_PATHS.mfaRecovery,
] as const;

/** Public auth entry UI — logged-in users are redirected away via proxy. */
export const AUTH_ENTRY_ROUTE_PREFIXES = [...AUTH_SEGMENT_PATHS] as const;

export const PUBLIC_ROUTE_PREFIXES = [
  ...AUTH_POST_AUTH_COMPLETE_ROUTE_PREFIXES,
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

export function shouldRedirectAuthenticatedUserFromAuthEntry(
  pathname: string
): boolean {
  if (
    AUTH_SESSION_ALLOWED_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return false;
  }

  return isAuthEntryRoute(pathname);
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
