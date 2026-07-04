/**
 * PAS-001A R1b — auth-adjacent protected paths (B110 companion on ADR-0027 skeleton).
 */

export type AuthProtectedSurfaceKind =
  | "session-guard"
  | "actor-resolver"
  | "proxy-guard";

export interface AuthProtectedSurfaceEntry {
  readonly delegate: string;
  readonly id: string;
  readonly kind: AuthProtectedSurfaceKind;
  readonly module: string;
}

/** App Router paths guarded by proxy session redirect (skeleton minimum). */
export const PROTECTED_APP_ROUTER_PATH_PREFIXES = [
  "/metadata-workspace",
  "/modules",
  "/settings",
  "/system-admin",
  "/workspace",
] as const;

export type ProtectedAppRouterPathPrefix =
  (typeof PROTECTED_APP_ROUTER_PATH_PREFIXES)[number];

/** Public paths that bypass proxy session redirect. */
export const PUBLIC_APP_ROUTER_PATH_PREFIXES = [
  "/api/auth",
  "/api/health",
  "/maintenance",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/forgot-password/success",
  "/reset-password",
  "/reset-password/success",
  "/verify-email",
  "/invite",
  "/passkey",
  "/sso",
  "/oauth/error",
  "/otp",
  "/mfa",
  "/session-expired",
  "/access-denied",
  "/auth/complete",
  "/organization/select",
  "/security/review",
  "/workspace/select",
  "/error",
] as const;

export function isProtectedAppRouterPath(pathname: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  if (normalized === "/") {
    return false;
  }

  if (
    PUBLIC_APP_ROUTER_PATH_PREFIXES.some(
      (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
    )
  ) {
    return false;
  }

  return PROTECTED_APP_ROUTER_PATH_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

export const AUTH_PROTECTED_SURFACE_REGISTRY = [
  {
    id: "protected-layout-session",
    kind: "session-guard",
    module: "app/(protected)/layout.tsx",
    delegate: "isAfendaAuthSessionLinked",
  },
  {
    id: "protected-layout-actor",
    kind: "actor-resolver",
    module: "app/(protected)/layout.tsx",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
  {
    id: "proxy-session-guard",
    kind: "proxy-guard",
    module: "proxy.ts",
    delegate: "getSessionCookie",
  },
  {
    id: "protected-api-actor",
    kind: "actor-resolver",
    module: "lib/api/authorize-api-route.ts",
    delegate: "resolveWireActorUserIdFromAfendaAuthSession",
  },
  {
    id: "protected-action-actor",
    kind: "actor-resolver",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: "resolveWireActorUserIdFromAfendaAuthSession",
  },
  {
    id: "metadata-auth-actor",
    kind: "actor-resolver",
    module: "lib/metadata/resolve-metadata-auth-actor.server.ts",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
] as const satisfies readonly AuthProtectedSurfaceEntry[];

export type AuthProtectedSurfaceId =
  (typeof AUTH_PROTECTED_SURFACE_REGISTRY)[number]["id"];
