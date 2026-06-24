import type { UserId } from "@afenda/kernel";

/**
 * ADR-0001 AppShell context authority — consume-only operating context labels.
 * AppShell must never resolve tenant, grant, or database authority.
 */

export const APPSHELL_CONTEXT_SURFACE_RULE =
  "consume-context-only; never-resolve-tenant-or-database-authority" as const;

export type AppShellContextSurfaceRule = typeof APPSHELL_CONTEXT_SURFACE_RULE;

/** Serializable operating context labels for shell chrome — display only, no authority. */
export interface ApplicationShellOperatingContext {
  readonly entityGroupLabel?: string;
  readonly legalEntityLabel: string;
  readonly organizationUnitLabel?: string;
  readonly tenantLabel: string;
  readonly workspaceLabel: string;
}

/** Serializable identity surface for shell chrome — boundary-safe, no session fields. */
export interface ApplicationShellIdentity {
  readonly displayName: string;
  readonly email: string;
  readonly userId: UserId;
}

/** Slug-only workspace switch selection — server re-verifies on every action. */
export interface AppShellContextSwitchSelection {
  readonly companySlug: string;
  readonly organizationSlug?: string;
}

/** Dependencies AppShell must never take — authority lives in erp/database/permissions. */
export const APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES = [
  "@afenda/database",
  "@afenda/permissions",
  "@afenda/auth",
] as const;

export type AppShellForbiddenAuthorityDependency =
  (typeof APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES)[number];

/** Symbols that indicate authority resolution — forbidden in AppShell production source. */
export const APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS = [
  "resolveOperatingContext",
  "resolveScopedMembership",
  "requirePermission",
  "createProductionAuthorizationDataSources",
  "getDb",
  "insertTenant",
  "insertCompany",
  "resolveTenantSlugFromHostname",
  "resolveGrantScope",
  "resolveLegalEntityContext",
] as const;

export type AppShellForbiddenAuthoritySymbol =
  (typeof APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS)[number];

/** Approved runtime dependency edges for AppShell (display + kernel contracts only). */
export const APPSHELL_APPROVED_RUNTIME_DEPENDENCIES = [
  "@afenda/kernel",
  "@afenda/ui",
] as const;

export type AppShellApprovedRuntimeDependency =
  (typeof APPSHELL_APPROVED_RUNTIME_DEPENDENCIES)[number];

/** Production modules that consume serializable context from the host. */
export const APPSHELL_CONTEXT_CONSUMPTION_MODULES = [
  {
    path: "app-shell.types.ts",
    role: "Operating context chrome labels",
    kernelTypes: ["UserId"],
    displayTypes: [
      "ApplicationShellOperatingContext",
      "ApplicationShellIdentity",
    ],
  },
  {
    path: "app-shell-header.tsx",
    role: "Header context display + switcher slot",
    kernelTypes: [],
    displayTypes: ["ApplicationShellOperatingContext"],
  },
  {
    path: "shadcn-studio/blocks/app-shell-context-switcher.tsx",
    role: "Context switch UI (host wires server action)",
    kernelTypes: ["ApplicationShellAllowedContextOptions"],
    displayTypes: ["AppShellContextSwitchSelection"],
  },
  {
    path: "dashboard/dashboard-widget-render-context.ts",
    role: "Dashboard widget RBAC display gate",
    kernelTypes: [],
    displayTypes: ["SerializableDashboardWidgetRenderContext"],
  },
] as const;
