/**
 * PAS-001A R1b — protected RSC/API surfaces with IS-002 spine delegates (INV-001).
 *
 * Every `(protected)/**` page and protected API ingress MUST declare a spine delegate.
 */

export type OperatingContextProtectedSurfaceKind =
  | "protected-rsc"
  | "protected-api"
  | "protected-server-action";

export interface OperatingContextProtectedSurfaceEntry {
  readonly delegate:
    | "resolveOperatingContext"
    | "loadProtectedRequestOperatingContext"
    | "resolveOperatingContextFromHeaders"
    | "resolveApiRouteOperatingContext"
    | "resolveActionOperatingContext"
    | "loadMetadataOperatorSurfacePage";
  readonly id: string;
  readonly kind: OperatingContextProtectedSurfaceKind;
  readonly module: string;
  readonly routePattern: string;
}

export const OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY = [
  {
    id: "protected-rsc-layout",
    kind: "protected-rsc",
    module: "app/(protected)/layout.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/(protected)/*",
  },
  {
    id: "protected-rsc-metadata-workspace",
    kind: "protected-rsc",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/metadata-workspace",
  },
  {
    id: "protected-rsc-settings-profile",
    kind: "protected-rsc",
    module: "app/(protected)/settings/profile/page.tsx",
    delegate: "loadMetadataOperatorSurfacePage",
    routePattern: "/settings/profile",
  },
  {
    id: "protected-rsc-operator-auth-sign-in",
    kind: "protected-rsc",
    module: "app/(protected)/operator/auth/sign-in/page.tsx",
    delegate: "loadMetadataOperatorSurfacePage",
    routePattern: "/operator/auth/sign-in",
  },
  {
    id: "protected-api-operating-context",
    kind: "protected-api",
    module: "lib/api/resolve-api-route-operating-context.ts",
    delegate: "resolveApiRouteOperatingContext",
    routePattern: "/api/internal/v1/*",
  },
  {
    id: "protected-server-action-operating-context",
    kind: "protected-server-action",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: "resolveActionOperatingContext",
    routePattern: "server-action",
  },
  {
    id: "protected-server-action-context-switch",
    kind: "protected-server-action",
    module: "lib/context/context-switch.action.ts",
    delegate: "resolveActionOperatingContext",
    routePattern: "server-action/context-switch",
  },
] as const satisfies readonly OperatingContextProtectedSurfaceEntry[];

export type OperatingContextProtectedSurfaceId =
  (typeof OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY)[number]["id"];
