/**
 * Canonical registry of ERP protected surfaces that must resolve tenant scope
 * via governed operating-context delegates — never from session payload fields.
 *
 * Static integration tests audit every entry for delegate wiring and forbidden
 * `session.user.tenantId` / `session.user.companyId` patterns.
 */
export const OPERATING_CONTEXT_DELEGATES = {
  resolveFromHeaders: "resolveOperatingContextFromHeaders",
  resolveActionContext: "resolveActionOperatingContext",
  resolveApiRoute: "resolveVerifiedApiRouteOperatingContext",
  resolveUserSettingsContext: "resolveUserSettingsOperatingContext",
} as const;

export type OperatingContextDelegate =
  (typeof OPERATING_CONTEXT_DELEGATES)[keyof typeof OPERATING_CONTEXT_DELEGATES];

export type OperatingContextProtectedSurfaceKind =
  | "rsc"
  | "api"
  | "action"
  | "loader";

export interface OperatingContextProtectedSurfaceEntry {
  readonly delegate: OperatingContextDelegate;
  readonly id: string;
  readonly kind: OperatingContextProtectedSurfaceKind;
  readonly module: string;
}

/** Every protected ERP surface and its required operating-context delegate. */
export const OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY = [
  {
    id: "protected-layout",
    kind: "rsc",
    module: "app/(protected)/layout.tsx",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "module-placeholder-page",
    kind: "rsc",
    module: "app/(protected)/modules/[moduleId]/page.tsx",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "metadata-workspace-page",
    kind: "rsc",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "system-admin-context",
    kind: "loader",
    module: "lib/system-admin/resolve-system-admin-operating-context.server.ts",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "dashboard-widget-loader",
    kind: "loader",
    module: "lib/workspace/load-dashboard-widget-render-context.server.ts",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "user-settings-context",
    kind: "loader",
    module: "lib/user-settings/resolve-user-settings-context.server.ts",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveFromHeaders,
  },
  {
    id: "user-settings-layout",
    kind: "rsc",
    module: "app/(protected)/settings/layout.tsx",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveUserSettingsContext,
  },
  {
    id: "protected-api-authorization",
    kind: "api",
    module: "lib/api/authorize-api-route.ts",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveApiRoute,
  },
  {
    id: "protected-server-action-binding",
    kind: "action",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveActionContext,
  },
  {
    id: "context-switch-action",
    kind: "action",
    module: "lib/context/context-switch.action.ts",
    delegate: OPERATING_CONTEXT_DELEGATES.resolveActionContext,
  },
] as const satisfies readonly OperatingContextProtectedSurfaceEntry[];

export type OperatingContextProtectedSurfaceId =
  (typeof OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY)[number]["id"];
