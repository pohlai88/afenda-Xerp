/**
 * Canonical Step 8 context integration registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 8, lines 572–579).
 *
 * Runtime mirror: `apps/erp/src/lib/context/context-integration-registry.ts`.
 */
export const MULTI_TENANCY_CONTEXT_INTEGRATION_SURFACE_RULE =
  "multi-tenancy-context-integration-is-canonical-api-action-appshell-wiring" as const;

/** Markers that must appear in multi-tenancy.md Step 8 (§572–579). */
export const MULTI_TENANCY_DOC_CONTEXT_INTEGRATION_MARKERS = [
  "Step 8 — API/action/AppShell integration",
  "Wire protected API routes.",
  "Wire protected server actions.",
  "Feed resolved context into permission checks.",
  "Pass allowed contexts to AppShell.",
  "Validate context switch server-side.",
] as const;

/** Delivery doc H2 — must match `TIP_007_012_REQUIRED_SECTIONS` entry. */
export const TIP_007_012_CONTEXT_INTEGRATION_SECTION =
  "API/action/AppShell integration" as const;

export const CONTEXT_INTEGRATION_WIRING = [
  {
    id: "protected-api-routes",
    step: "Wire protected API routes",
    module: "server/api/runtime/create-api-handler.ts",
    delegate: "assertRoutePermission",
  },
  {
    id: "protected-server-actions",
    step: "Wire protected server actions",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: "resolveActionOperatingContext",
  },
  {
    id: "permission-checks",
    step: "Feed resolved context into permission checks",
    module: "lib/api/authorize-api-route.ts",
    delegate: "checkPermission",
  },
  {
    id: "appshell-context",
    step: "Pass allowed contexts to AppShell",
    module: "app/(protected)/layout.tsx",
    delegate: "toApplicationShellOperatingContext",
  },
  {
    id: "context-switch",
    step: "Validate context switch server-side",
    module: "lib/context/context-switch.action.ts",
    delegate: "switchOperatingContextAction",
  },
] as const;

export const CONTEXT_INTEGRATION_FUNCTIONS = [
  {
    name: "createApiHandler",
    file: "server/api/runtime/create-api-handler.ts",
  },
  {
    name: "assertAuthorizedApiRoute",
    file: "lib/api/authorize-api-route.ts",
  },
  {
    name: "resolveActionOperatingContext",
    file: "lib/server-actions/resolve-action-operating-context.server.ts",
  },
  {
    name: "parseProtectedActionInput",
    file: "lib/server-actions/parse-protected-action-input.ts",
  },
  {
    name: "toApplicationShellOperatingContext",
    file: "lib/context/to-shell-operating-context.ts",
  },
  {
    name: "switchOperatingContextAction",
    file: "lib/context/context-switch.action.ts",
  },
] as const;

/** Step 8 dimensions — one table per concern in §574–578. */
export const MULTI_TENANCY_CONTEXT_INTEGRATION_DIMENSIONS = [
  {
    id: "protected-api-routes",
    title: "Protected API routes",
    tableMarker: "### Protected API routes",
    artifactPath: "apps/erp/src/server/api/runtime/create-api-handler.ts",
  },
  {
    id: "protected-server-actions",
    title: "Protected server actions",
    tableMarker: "### Protected server actions",
    artifactPath:
      "apps/erp/src/lib/server-actions/resolve-action-operating-context.server.ts",
  },
  {
    id: "permission-feed",
    title: "Permission checks from operating context",
    tableMarker: "### Permission checks from operating context",
    artifactPath: "apps/erp/src/lib/api/authorize-api-route.ts",
  },
  {
    id: "appshell-context",
    title: "AppShell display context",
    tableMarker: "### AppShell display context",
    artifactPath: "apps/erp/src/app/(protected)/layout.tsx",
  },
  {
    id: "context-switch",
    title: "Context switch validation",
    tableMarker: "### Context switch validation",
    artifactPath: "apps/erp/src/lib/context/context-switch.action.ts",
  },
] as const;

export const MULTI_TENANCY_CONTEXT_INTEGRATION_FUNCTION_MARKERS =
  CONTEXT_INTEGRATION_FUNCTIONS.map(
    (entry) => entry.name
  ) as readonly [
    "createApiHandler",
    "assertAuthorizedApiRoute",
    "resolveActionOperatingContext",
    "parseProtectedActionInput",
    "toApplicationShellOperatingContext",
    "switchOperatingContextAction",
  ];

export const MULTI_TENANCY_CONTEXT_INTEGRATION_WIRING_MARKERS =
  CONTEXT_INTEGRATION_WIRING.map(
    (entry) => entry.step
  ) as readonly string[];

export const MULTI_TENANCY_CONTEXT_INTEGRATION_GATE =
  "scripts/governance/check-multi-tenancy-context-integration.mts" as const;

export const MULTI_TENANCY_CONTEXT_INTEGRATION_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-context-integration-enforcement.mts" as const;
