/**
 * Canonical registry of ERP protected surfaces requiring linked auth session
 * and governed operating-context resolution — never session payload tenant fields.
 *
 * Static integration tests audit every entry for delegate wiring and forbidden patterns.
 */
export const AUTH_SESSION_DELEGATES = {
  requireLinkedSession: "requireAfendaAuthSession",
  assertLinkedSession: "isAfendaAuthSessionLinked",
  resolveActionSession: "resolveActionSession",
} as const;

export const AUTH_CONTEXT_DELEGATES = {
  resolveFromHeaders: "resolveOperatingContextFromHeaders",
  resolveActionContext: "resolveActionOperatingContext",
  assertApiRoute: "assertAuthorizedApiRoute",
} as const;

export type AuthSessionDelegate =
  (typeof AUTH_SESSION_DELEGATES)[keyof typeof AUTH_SESSION_DELEGATES];

export type AuthContextDelegate =
  (typeof AUTH_CONTEXT_DELEGATES)[keyof typeof AUTH_CONTEXT_DELEGATES];

export interface AuthProtectedSurfaceEntry {
  /** Present when operating-context resolution occurs in the same module. */
  readonly contextDelegate?: AuthContextDelegate;
  readonly id: string;
  readonly module: string;
  readonly sessionDelegate: AuthSessionDelegate;
}

/** Every protected ERP integration point and its required auth/context delegates. */
export const AUTH_PROTECTED_SURFACE_REGISTRY = [
  {
    id: "protected-layout",
    module: "app/(protected)/layout.tsx",
    sessionDelegate: AUTH_SESSION_DELEGATES.assertLinkedSession,
    contextDelegate: AUTH_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "protected-api-authorization",
    module: "lib/api/authorize-api-route.ts",
    sessionDelegate: AUTH_SESSION_DELEGATES.assertLinkedSession,
    contextDelegate: AUTH_CONTEXT_DELEGATES.assertApiRoute,
  },
  {
    id: "protected-server-actions",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    sessionDelegate: AUTH_SESSION_DELEGATES.resolveActionSession,
    contextDelegate: AUTH_CONTEXT_DELEGATES.resolveActionContext,
  },
  {
    id: "protected-action-session",
    module: "lib/server-actions/resolve-action-session.ts",
    sessionDelegate: AUTH_SESSION_DELEGATES.assertLinkedSession,
  },
  {
    id: "session-guard",
    module: "lib/auth/require-session.ts",
    sessionDelegate: AUTH_SESSION_DELEGATES.requireLinkedSession,
  },
  {
    id: "system-admin-context",
    module: "lib/system-admin/resolve-system-admin-operating-context.server.ts",
    sessionDelegate: AUTH_SESSION_DELEGATES.assertLinkedSession,
    contextDelegate: AUTH_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "dashboard-widget-context",
    module: "lib/workspace/load-dashboard-widget-render-context.server.ts",
    sessionDelegate: AUTH_SESSION_DELEGATES.assertLinkedSession,
    contextDelegate: AUTH_CONTEXT_DELEGATES.resolveFromHeaders,
  },
] as const satisfies readonly AuthProtectedSurfaceEntry[];

export type AuthProtectedSurfaceId =
  (typeof AUTH_PROTECTED_SURFACE_REGISTRY)[number]["id"];
