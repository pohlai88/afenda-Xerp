/**
 * Canonical Step 8 API/action/AppShell integration registry — aligned with
 * `docs/architecture/multi-tenancy.md` (§572–579).
 *
 * Server resolves operating context; AppShell receives display labels only.
 */
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

/** Primary integration entry points. */
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

export type ContextIntegrationWiringId =
  (typeof CONTEXT_INTEGRATION_WIRING)[number]["id"];

export type ContextIntegrationFunctionName =
  (typeof CONTEXT_INTEGRATION_FUNCTIONS)[number]["name"];
