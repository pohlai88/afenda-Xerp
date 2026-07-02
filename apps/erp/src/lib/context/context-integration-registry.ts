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
    id: "protected-request-operating-context",
    step: "Request-scoped protected RSC operating context assembly (INV-001)",
    module: "lib/context/load-protected-request-operating-context.server.ts",
    delegate: "loadProtectedRequestOperatingContext",
  },
  {
    id: "metadata-operator-surface-page-loader",
    step: "Operator metadata routes consume request-scoped spine assembly",
    module: "lib/metadata/load-metadata-operator-surface-page.server.ts",
    delegate: "loadMetadataOperatorSurfacePage",
  },
  {
    id: "procurement-foundation-readiness-loader",
    step: "Procurement foundation readiness route consumes request-scoped spine assembly",
    module:
      "lib/procurement/load-procurement-foundation-readiness-page.server.ts",
    delegate: "loadProcurementFoundationReadinessPage",
  },
  {
    id: "procurement-foundation-readiness-page",
    step: "Protected procurement foundation readiness RSC ingress (ERP-PROC-OP-005)",
    module: "app/(protected)/modules/procurement/readiness/page.tsx",
    delegate: "loadProcurementFoundationReadinessPage",
  },
  {
    id: "accounting-standards-readiness-loader",
    step: "Accounting standards readiness route consumes PAS-003 validation workflow",
    module:
      "lib/accounting-standards/load-accounting-standards-readiness-page.server.ts",
    delegate: "loadAccountingStandardsReadinessPage",
  },
  {
    id: "accounting-standards-readiness-page",
    step: "Protected accounting standards consumer proof RSC ingress (PAS-003 B20)",
    module: "app/(protected)/modules/accounting/standards-readiness/page.tsx",
    delegate: "loadAccountingStandardsReadinessPage",
  },
  {
    id: "procurement-requisitions-list-loader",
    step: "Procurement requisitions list route consumes request-scoped spine assembly",
    module: "lib/procurement/load-procurement-requisitions-page.server.ts",
    delegate: "loadProcurementRequisitionsPage",
  },
  {
    id: "procurement-requisitions-list-page",
    step: "Protected procurement requisitions PAS-006 list RSC ingress (ERP-PROC-OP-007)",
    module: "app/(protected)/modules/procurement/requisitions/page.tsx",
    delegate: "loadProcurementRequisitionsPage",
  },
  {
    id: "procurement-purchase-orders-list-loader",
    step: "Procurement purchase orders list route consumes request-scoped spine assembly",
    module: "lib/procurement/load-procurement-purchase-orders-page.server.ts",
    delegate: "loadProcurementPurchaseOrdersPage",
  },
  {
    id: "procurement-purchase-orders-list-page",
    step: "Protected procurement purchase orders PAS-006 list RSC ingress (ERP-PROC-OP-007)",
    module: "app/(protected)/modules/procurement/purchase-orders/page.tsx",
    delegate: "loadProcurementPurchaseOrdersPage",
  },
  {
    id: "protected-rsc-metadata-workspace",
    step: "Resolve operating context for metadata workspace RSC",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
  },
  {
    id: "protected-rsc-layout",
    step: "Resolve operating context for protected layout RSC ingress",
    module: "app/(protected)/layout.tsx",
    delegate: "loadProtectedRequestOperatingContext",
  },
  {
    id: "presentation-shell-context",
    step: "Pass allowed contexts to PAS-006 protected shell",
    module: "app/(protected)/layout.tsx",
    delegate: "toShellOperatingContextWire",
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
    delegate: "createApiHandler",
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

export const SERVICE_ACTOR_BRIDGE_WIRING = [
  {
    id: "service-actor-header-ingress",
    step: "Parse service/delegated_application actor from S2S request headers",
    module: "lib/auth/resolve-service-actor.server.ts",
    delegate: "parseServiceActorIdentityFromRequestHeaders",
  },
  {
    id: "service-actor-api-route",
    step: "Protected internal API auth actor resolution (human session or S2S)",
    module: "lib/auth/resolve-api-route-auth-actor.server.ts",
    delegate: "resolveApiRouteAuthActor",
  },
  {
    id: "service-actor-api-operating-context",
    step: "Internal API operating context branches on S2S ingress before session path",
    module: "lib/api/resolve-api-route-operating-context.ts",
    delegate: "resolveApiRouteOperatingContext",
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
    id: "metadata-erp-domain-permission-registry-bridge",
    step: "Bridge kernel erp-domain permission vocabulary to PERMISSION_REGISTRY for metadata authorization",
    module: "lib/metadata/metadata-erp-domain-permission-registry.bridge.ts",
    delegate: "METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_BRIDGE",
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
    step: "Metadata workspace previews auth sign-in surface template",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "resolveMetadataWorkspaceSurfaces",
  },
] as const;
