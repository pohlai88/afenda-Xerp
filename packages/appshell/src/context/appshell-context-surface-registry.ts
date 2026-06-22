/**
 * Canonical AppShell context surface registry — aligned with
 * `docs/architecture/multi-tenancy.md` (AppShell, lines 411–416).
 *
 * AppShell consumes pre-resolved context from the host app (`apps/erp`).
 * It must never resolve tenant, legal entity, grant, or database authority.
 */
export const APPSHELL_CONTEXT_SURFACE_RULE =
  "consume-context-only; never-resolve-tenant-or-database-authority" as const;

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

/** Dependencies AppShell must never take — authority lives in erp/database/permissions. */
export const APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES = [
  "@afenda/database",
  "@afenda/permissions",
  "@afenda/auth",
] as const;

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

/** Approved runtime dependency edges for AppShell (display + kernel contracts only). */
export const APPSHELL_APPROVED_RUNTIME_DEPENDENCIES = [
  "@afenda/kernel",
  "@afenda/ui",
] as const;
