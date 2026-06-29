/**
 * Kernel consumer integration registry — PAS-001A R1a IS-002 (ADR-0027 skeleton).
 *
 * Machine authority for operating-context assembly spine and auth bridge wiring.
 */
export const CONTEXT_INTEGRATION_WIRING = [
  {
    id: "operating-context-spine",
    step: "Canonical operating context assembly entry",
    module: "lib/context/resolve-operating-context.server.ts",
    delegate: "resolveOperatingContext",
  },
  {
    id: "protected-rsc-metadata-workspace",
    step: "Resolve operating context for metadata workspace RSC",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "resolveOperatingContextFromHeaders",
  },
  {
    id: "protected-rsc-layout",
    step: "Resolve operating context for protected layout RSC ingress",
    module: "app/(protected)/layout.tsx",
    delegate: "resolveOperatingContext",
  },
  {
    id: "presentation-shell-context",
    step: "Pass allowed contexts to PAS-006 protected shell",
    module: "app/(protected)/layout.tsx",
    delegate: "toPresentationShellOperatingContext",
  },
  {
    id: "permission-checks",
    step: "Feed resolved context into permission checks",
    module: "lib/api/authorize-api-route.ts",
    delegate: "checkPermission",
  },
  {
    id: "protected-server-actions",
    step: "Wire protected server actions",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: "resolveActionOperatingContext",
  },
  {
    id: "protected-api-routes",
    step: "Wire protected API routes",
    module: "server/api/runtime/create-api-handler.ts",
    delegate: "assertRoutePermission",
  },
  {
    id: "protected-api-operating-context",
    step: "Resolve operating context for protected internal API routes",
    module: "lib/api/resolve-api-route-operating-context.ts",
    delegate: "resolveApiRouteOperatingContext",
  },
  {
    id: "context-switch",
    step: "Validate context switch server-side",
    module: "lib/context/context-switch.action.ts",
    delegate: "switchOperatingContextAction",
  },
] as const;

export const AUTH_SESSION_BRIDGE_WIRING = [
  {
    id: "auth-session-layout",
    step: "Protected layout session link gate",
    module: "app/(protected)/layout.tsx",
    delegate: "isAfendaAuthSessionLinked",
  },
  {
    id: "auth-session-actions",
    step: "Protected server action session link gate",
    module: "lib/server-actions/resolve-action-session.ts",
    delegate: "isAfendaAuthSessionLinked",
  },
  {
    id: "auth-session-metadata",
    step: "Metadata header ingress session lookup",
    module: "lib/context/resolve-operating-context-from-headers.server.ts",
    delegate: "getAfendaAuthSession",
  },
] as const;

export const AUTH_ACTOR_BRIDGE_WIRING = [
  {
    id: "auth-actor-api",
    step: "API route actor wire ingress",
    module: "lib/api/authorize-api-route.ts",
    delegate: "resolveWireActorUserIdFromAfendaAuthSession",
  },
  {
    id: "auth-actor-actions",
    step: "Server action actor wire ingress",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: "resolveWireActorUserIdFromAfendaAuthSession",
  },
  {
    id: "auth-actor-metadata",
    step: "Metadata auth actor ingress",
    module: "lib/metadata/resolve-metadata-auth-actor.server.ts",
    delegate: "parseAuthActorIdentityFromAfendaAuthSession",
  },
  {
    id: "auth-actor-protected-layout",
    step: "Protected layout actor wire ingress",
    module: "app/(protected)/layout.tsx",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
] as const;

export const TENANT_LIFECYCLE_BRIDGE_WIRING = [
  {
    id: "tenant-lifecycle-operating-context-mapper",
    step: "Map DB tenant status to kernel SaaS lifecycle phase at ERP trust boundary",
    module: "lib/context/operating-context.mappers.ts",
    delegate: "mapPlatformLifecycleStatusToTenantSaasLifecyclePhase",
  },
  {
    id: "tenant-extension-metadata-ingress",
    step: "Assert extension field keys do not fork kernel brand at metadata ingress",
    module: "lib/metadata/resolve-metadata-tenant-extension-boundary.server.ts",
    delegate: "assertMetadataTenantExtensionFieldKey",
  },
  {
    id: "tenant-lifecycle-metadata-runtime",
    step: "Carry tenant SaaS lifecycle phase into metadata runtime context",
    module: "lib/metadata/resolve-metadata-ui-render-context.server.ts",
    delegate: "tenantSaasLifecyclePhase",
  },
] as const;

export const METADATA_PAS006_CONSUMER_WIRING = [
  {
    id: "metadata-ui-render-context",
    step: "Project verified tenant context into metadata runtime carrier",
    module: "lib/metadata/resolve-metadata-ui-render-context.server.ts",
    delegate: "resolveMetadataUiRenderContextFromTenantContext",
  },
  {
    id: "metadata-workspace-surfaces",
    step: "Resolve studio surface templates and binding projection wire",
    module: "lib/metadata/resolve-metadata-workspace-surfaces.server.ts",
    delegate: "resolveMetadataWorkspaceSurfaces",
  },
  {
    id: "metadata-binding-slot-hydration",
    step: "Map binding projection and runtime to data-afenda-slot targets",
    module: "lib/metadata/hydrate-metadata-binding-slots.server.ts",
    delegate: "hydrateMetadataBindingSlots",
  },
  {
    id: "metadata-workspace-page",
    step: "Protected metadata workspace RSC consumes spine and PAS-006 registries",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "resolveMetadataWorkspaceSurfaces",
  },
  {
    id: "metadata-operator-surface-resolver",
    step: "Resolve one operator surface template with slot hydration",
    module: "lib/metadata/resolve-metadata-operator-surface.server.ts",
    delegate: "resolveMetadataOperatorSurface",
  },
  {
    id: "metadata-operator-surface-registry",
    step: "Declare metadata-bound operator route to surface template mapping",
    module: "lib/metadata/metadata-operator-surface.registry.ts",
    delegate: "METADATA_OPERATOR_SURFACE_REGISTRY",
  },
  {
    id: "metadata-operator-settings-profile",
    step: "Settings profile operator route consumes metadata operator surface",
    module: "app/(protected)/settings/profile/page.tsx",
    delegate: "loadMetadataOperatorSurfacePage",
  },
  {
    id: "metadata-operator-auth-sign-in",
    step: "Operator auth sign-in preview route consumes metadata operator surface",
    module: "app/(protected)/operator/auth/sign-in/page.tsx",
    delegate: "loadMetadataOperatorSurfacePage",
  },
] as const;
