/**
 * Kernel consumer integration registry — PAS-001 B111 (ADR-0027 skeleton rebuild).
 *
 * Full operating-context spine wiring returns as protected routes are reintroduced.
 */
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
