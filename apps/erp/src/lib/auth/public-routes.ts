export const PUBLIC_ROUTE_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/api/health",
  "/api/internal/v1/health",
  "/api/internal/v1/client-error",
  "/governance-integration",
  "/appshell-demo",
  "/appshell-canvas",
  "/policy-gate",
] as const;

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
