/**
 * PAS-006 F6 — ERP protected-route layout format registry.
 * Maps route patterns → reusable v2 view formats and MCP inspiration block references.
 * L4 views in @afenda/shadcn-studio-v2/clients are the runtime authority; MCP blocks
 * document provenance only until promoted through quarantine.
 */

import type { ViewSurfaceState } from "@afenda/shadcn-studio-v2";

export type ErpSurfaceLayoutFormat =
  | "page-shell"
  | "data-list"
  | "form-edit"
  | "settings"
  | "metrics-row"
  | "evidence";

export type ErpSurfaceLayoutWave =
  | "wave-a"
  | "wave-b"
  | "wave-c"
  | "wave-d"
  | "planned";

export type ErpSurfaceV2View =
  | "PageSurface"
  | "DataTableSurface"
  | "FormSurface"
  | "SettingsSurface"
  | "MetricWidget"
  | "EvidenceWidget";

export interface ErpSurfaceMcpBlockReference {
  readonly blockCategory: string;
  readonly blockName: string;
  readonly registryPath: string;
}

export interface ErpSurfaceLayoutFixture {
  readonly defaultState: ViewSurfaceState;
  readonly description?: string;
  readonly title: string;
}

export interface ErpSurfaceLayoutEntry {
  readonly format: ErpSurfaceLayoutFormat;
  readonly mcpInspirationBlocks: readonly ErpSurfaceMcpBlockReference[];
  readonly routePattern: string;
  readonly surfaceFixture: ErpSurfaceLayoutFixture;
  readonly v2View: ErpSurfaceV2View;
  readonly wave: ErpSurfaceLayoutWave;
  readonly wired: boolean;
}

/** MCP blocks discovered via get-blocks-metadata — mapped to existing L4 views (no quarantine install). */
export const ERP_SURFACE_MCP_LAYOUT_CATALOG = {
  "data-list": {
    blocks: [
      {
        blockCategory: "Datatable",
        blockName: "DataTable",
        registryPath: "/datatable/datatable-component/registry",
      },
    ] satisfies readonly ErpSurfaceMcpBlockReference[],
    v2View: "DataTableSurface",
  },
  evidence: {
    blocks: [
      {
        blockCategory: "dashboard-and-application",
        blockName: "widgets-component",
        registryPath: "/dashboard-and-application/widgets-component/registry",
      },
    ] satisfies readonly ErpSurfaceMcpBlockReference[],
    v2View: "EvidenceWidget",
  },
  "form-edit": {
    blocks: [
      {
        blockCategory: "dashboard-and-application",
        blockName: "Form Layout",
        registryPath: "/dashboard-and-application/form-layout/registry",
      },
      {
        blockCategory: "dashboard-and-application",
        blockName: "multi step form",
        registryPath: "/dashboard-and-application/multi-step-form/registry",
      },
    ] satisfies readonly ErpSurfaceMcpBlockReference[],
    v2View: "FormSurface",
  },
  "metrics-row": {
    blocks: [
      {
        blockCategory: "dashboard-and-application",
        blockName: "statistics-component",
        registryPath:
          "/dashboard-and-application/statistics-component/registry",
      },
    ] satisfies readonly ErpSurfaceMcpBlockReference[],
    v2View: "MetricWidget",
  },
  "page-shell": {
    blocks: [
      {
        blockCategory: "dashboard-and-application",
        blockName: "dashboard-shell",
        registryPath: "/dashboard-and-application/dashboard-shell/registry",
      },
      {
        blockCategory: "dashboard-and-application",
        blockName: "Application Shell",
        registryPath: "/dashboard-and-application/application-shell/registry",
      },
    ] satisfies readonly ErpSurfaceMcpBlockReference[],
    v2View: "PageSurface",
  },
  settings: {
    blocks: [
      {
        blockCategory: "dashboard-and-application",
        blockName: "Account Settings",
        registryPath: "/dashboard-and-application/account-settings/registry",
      },
    ] satisfies readonly ErpSurfaceMcpBlockReference[],
    v2View: "SettingsSurface",
  },
} as const satisfies Record<
  ErpSurfaceLayoutFormat,
  {
    readonly blocks: readonly ErpSurfaceMcpBlockReference[];
    readonly v2View: ErpSurfaceV2View;
  }
>;

export const ERP_SURFACE_LAYOUT_REGISTRY = [
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/system-admin/users",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "System administration user directory backed by internal users list.",
      title: "Users",
    },
    v2View: "DataTableSurface",
    wave: "wave-c",
    wired: true,
  },
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/system-admin/roles",
    surfaceFixture: {
      defaultState: "ready",
      description: "Tenant role templates backed by internal roles list.",
      title: "Roles",
    },
    v2View: "DataTableSurface",
    wave: "wave-c",
    wired: true,
  },
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/system-admin/permissions",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "Global permission catalog backed by internal permissions list.",
      title: "Permissions",
    },
    v2View: "DataTableSurface",
    wave: "wave-c",
    wired: true,
  },
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/system-admin/memberships",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "Company-scoped memberships with role assignments for the active legal entity.",
      title: "Memberships",
    },
    v2View: "DataTableSurface",
    wave: "wave-c",
    wired: true,
  },
  {
    format: "settings",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG.settings.blocks,
    routePattern: "/system-admin/settings",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "Module domain summaries derived from the governed permission catalog.",
      title: "Settings",
    },
    v2View: "SettingsSurface",
    wave: "wave-c",
    wired: true,
  },
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/system-admin/audit",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "Recent system-administration audit events for the active tenant.",
      title: "Audit",
    },
    v2View: "DataTableSurface",
    wave: "wave-c",
    wired: true,
  },
  {
    format: "page-shell",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["page-shell"].blocks,
    routePattern: "/system-admin/diagnostics",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "Operator diagnostics for operating scope, API contracts, and spine delegates.",
      title: "Diagnostics",
    },
    v2View: "PageSurface",
    wave: "wave-c",
    wired: true,
  },
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/modules/procurement/requisitions",
    surfaceFixture: {
      defaultState: "ready",
      description: "Tenant-scoped requisition directory.",
      title: "Requisitions",
    },
    v2View: "DataTableSurface",
    wave: "wave-b",
    wired: true,
  },
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/modules/procurement/purchase-orders",
    surfaceFixture: {
      defaultState: "ready",
      description: "Purchase-order workflow directory.",
      title: "Purchase orders",
    },
    v2View: "DataTableSurface",
    wave: "wave-b",
    wired: true,
  },
  {
    format: "page-shell",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["page-shell"].blocks,
    routePattern: "/workspace",
    surfaceFixture: {
      defaultState: "ready",
      description: "Operator home dashboard with widget board.",
      title: "Workspace",
    },
    v2View: "PageSurface",
    wave: "wave-a",
    wired: true,
  },
  {
    format: "page-shell",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["page-shell"].blocks,
    routePattern: "/metadata-workspace",
    surfaceFixture: {
      defaultState: "ready",
      description: "Surface templates bound to studio metadata contracts.",
      title: "Metadata workspace",
    },
    v2View: "PageSurface",
    wave: "wave-a",
    wired: true,
  },
  {
    format: "evidence",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG.evidence.blocks,
    routePattern: "/standards/accounting-readiness",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "PAS-003 B20 consumer proof for accounting standards validation.",
      title: "Accounting standards readiness",
    },
    v2View: "EvidenceWidget",
    wave: "wave-d",
    wired: true,
  },
  {
    format: "form-edit",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["form-edit"].blocks,
    routePattern: "/settings/profile",
    surfaceFixture: {
      defaultState: "ready",
      description: "Operator profile preferences and identity settings.",
      title: "Profile",
    },
    v2View: "FormSurface",
    wave: "wave-d",
    wired: true,
  },
  {
    format: "data-list",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].blocks,
    routePattern: "/modules/procurement/readiness",
    surfaceFixture: {
      defaultState: "ready",
      description: "Procurement module readiness checklist.",
      title: "Procurement readiness",
    },
    v2View: "DataTableSurface",
    wave: "wave-d",
    wired: true,
  },
  {
    format: "page-shell",
    mcpInspirationBlocks: ERP_SURFACE_MCP_LAYOUT_CATALOG["page-shell"].blocks,
    routePattern: "/modules/[moduleId]",
    surfaceFixture: {
      defaultState: "ready",
      description:
        "Deferred — dynamic module root is navigation evidence only; operational pages live under module-specific routes.",
      title: "Module root",
    },
    v2View: "PageSurface",
    wave: "planned",
    wired: false,
  },
] as const satisfies readonly ErpSurfaceLayoutEntry[];

export type ErpSurfaceLayoutRegistryEntry =
  (typeof ERP_SURFACE_LAYOUT_REGISTRY)[number];

function normalizeRoutePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function getErpSurfaceLayoutByRoute(
  pathname: string
): ErpSurfaceLayoutRegistryEntry | undefined {
  const normalized = normalizeRoutePath(pathname);

  return ERP_SURFACE_LAYOUT_REGISTRY.find(
    (entry) => entry.routePattern === normalized
  );
}

export function listErpSurfaceLayoutsByWave(
  wave: ErpSurfaceLayoutWave
): readonly ErpSurfaceLayoutRegistryEntry[] {
  return ERP_SURFACE_LAYOUT_REGISTRY.filter((entry) => entry.wave === wave);
}

export function listUnwiredErpSurfaceLayouts(): readonly ErpSurfaceLayoutRegistryEntry[] {
  return ERP_SURFACE_LAYOUT_REGISTRY.filter((entry) => !entry.wired);
}
