export const DEV_HARNESS_ROUTE_PREFIXES = [
  "/governance-integration",
  "/appshell-demo",
  "/appshell-canvas",
  "/policy-gate",
] as const;

export const PUBLIC_ROUTE_PREFIXES = [
  "/sign-in",
  "/sign-up",
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

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
