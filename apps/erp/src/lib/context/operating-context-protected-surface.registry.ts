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
    | "resolveOperatingContextFromHeaders"
    | "resolveApiRouteOperatingContext";
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
    delegate: "resolveOperatingContext",
    routePattern: "/(protected)/*",
  },
  {
    id: "protected-rsc-metadata-workspace",
    kind: "protected-rsc",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "resolveOperatingContextFromHeaders",
    routePattern: "/metadata-workspace",
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
    delegate: "resolveOperatingContextFromHeaders",
    routePattern: "server-action",
  },
] as const satisfies readonly OperatingContextProtectedSurfaceEntry[];

export type OperatingContextProtectedSurfaceId =
  (typeof OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY)[number]["id"];
