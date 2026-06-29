/**
 * Canonical Step 8 API/action/AppShell integration registry — aligned with
 * `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md` (§572–579).
 *
 * Server resolves operating context; AppShell receives display labels only.
 */
export const CONTEXT_INTEGRATION_WIRING = [
  {
    id: "protected-api-routes",
    step: "Wire protected API routes",
    module: "server/api/runtime/create-api-handler.ts",
    delegate: "runProtectedMutation",
  },
  {
    id: "protected-mutation-spine",
    step: "Execute governed mutations through operating spine",
    module: "lib/spine/run-protected-mutation.ts",
    delegate: "runProtectedMutation",
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
  {
    id: "session-workspace-hint",
    step: "Merge auth session activeWorkspaceId into selection hints",
    module: "lib/context/tenant-domain.server.ts",
    delegate: "buildOperatingContextSelectionFromRequest",
  },
  {
    id: "protected-rsc-layout",
    step: "Resolve operating context for protected AppShell layout",
    module: "app/(protected)/layout.tsx",
    delegate: "resolveOperatingContextFromHeaders",
  },
  {
    id: "protected-rsc-module-page",
    step: "Resolve operating context for module placeholder routes",
    module: "app/(protected)/modules/[moduleId]/page.tsx",
    delegate: "resolveOperatingContextFromHeaders",
  },
  {
    id: "protected-rsc-metadata-workspace",
    step: "Resolve operating context for metadata workspace preview",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "resolveOperatingContextFromHeaders",
  },
  {
    id: "system-admin-operating-context",
    step: "Resolve operating context for system admin surfaces",
    module: "lib/system-admin/resolve-system-admin-operating-context.server.ts",
    delegate: "resolveOperatingContextFromHeaders",
  },
  {
    id: "user-settings-operating-context",
    step: "Resolve operating context for user self-service settings",
    module: "lib/user-settings/resolve-user-settings-context.server.ts",
    delegate: "resolveOperatingContextFromHeaders",
  },
  {
    id: "user-settings-rsc-layout",
    step: "Guard user settings layout with self-service context resolver",
    module: "app/(protected)/settings/layout.tsx",
    delegate: "resolveUserSettingsOperatingContext",
  },
  {
    id: "dashboard-widget-render-loader",
    step: "Load dashboard widget RBAC from verified operating context",
    module: "lib/workspace/load-dashboard-widget-render-context.server.ts",
    delegate: "resolveOperatingContextFromHeaders",
  },
] as const;

/** Primary integration entry points. */
export const CONTEXT_INTEGRATION_FUNCTIONS = [
  {
    name: "runProtectedMutation",
    file: "lib/spine/run-protected-mutation.ts",
  },
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

/** Auth actor wire — PAS-001 §4.1.11 ingress before operating-context actorUserId assembly. */
export const AUTH_ACTOR_BRIDGE_WIRING = [
  {
    id: "auth-actor-protected-layout",
    step: "Resolve wire actor id before protected AppShell operating context",
    module: "app/(protected)/layout.tsx",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
  {
    id: "auth-actor-module-page",
    step: "Resolve wire actor id before module route operating context",
    module: "app/(protected)/modules/[moduleId]/page.tsx",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
  {
    id: "auth-actor-metadata-workspace",
    step: "Resolve wire actor id before metadata workspace operating context",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "resolveMetadataActorUserIdFromAfendaAuthSession",
  },
  {
    id: "auth-actor-api-routes",
    step: "Resolve wire actor id before API operating context",
    module: "lib/api/authorize-api-route.ts",
    delegate: "resolveWireActorUserIdFromAfendaAuthSession",
  },
  {
    id: "auth-actor-server-actions",
    step: "Resolve wire actor id before server action operating context",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: "resolveWireActorUserIdFromAfendaAuthSession",
  },
  {
    id: "auth-actor-system-admin",
    step: "Resolve wire actor id before system admin operating context",
    module: "lib/system-admin/resolve-system-admin-operating-context.server.ts",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
  {
    id: "auth-actor-user-settings",
    step: "Resolve wire actor id before user settings operating context",
    module: "lib/user-settings/resolve-user-settings-context.server.ts",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
  {
    id: "auth-actor-dashboard-widgets",
    step: "Resolve wire actor id before dashboard widget RBAC loader",
    module: "lib/workspace/load-dashboard-widget-render-context.server.ts",
    delegate: "resolveProtectedPathActorUserIdFromSession",
  },
  {
    id: "auth-actor-metadata-bridge",
    step: "Resolve metadata actor id from governed auth wire ingress",
    module: "lib/metadata/resolve-metadata-auth-actor.server.ts",
    delegate: "parseAuthActorIdentityFromAfendaAuthSession",
  },
] as const;

/** Auth-session bridge — linked platform user required before operating-context resolution. */
export const AUTH_SESSION_BRIDGE_WIRING = [
  {
    id: "auth-session-layout",
    step: "Validate linked auth session before AppShell context",
    module: "app/(protected)/layout.tsx",
    delegate: "isAfendaAuthSessionLinked",
  },
  {
    id: "auth-session-api",
    step: "Reject unlinked auth session before API operating context",
    module: "lib/api/authorize-api-route.ts",
    delegate: "isAfendaAuthSessionLinked",
  },
  {
    id: "auth-session-actions",
    step: "Reject unlinked auth session before server action context",
    module: "lib/server-actions/resolve-action-session.ts",
    delegate: "isAfendaAuthSessionLinked",
  },
] as const;

export type ContextIntegrationWiringId =
  (typeof CONTEXT_INTEGRATION_WIRING)[number]["id"];

export type ContextIntegrationFunctionName =
  (typeof CONTEXT_INTEGRATION_FUNCTIONS)[number]["name"];
