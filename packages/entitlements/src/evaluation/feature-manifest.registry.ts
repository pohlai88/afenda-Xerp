import { createPermissionKey, type PermissionKey } from "@afenda/database";

import type { FeatureManifestContract } from "./feature-manifest";

/** Governed ERP module identifiers — single union for manifest, routes, and nav. */
export type ErpModuleId =
  | "accounting"
  | "ai_copilot"
  | "hrm"
  | "inventory"
  | "manufacturing"
  | "mrp"
  | "sales"
  | "workspace";

export type ModuleRoutePath = `/modules/${ErpModuleId}`;

export interface ErpModuleManifestEntry extends FeatureManifestContract {
  readonly label: string;
  readonly moduleId: ErpModuleId;
  readonly permissionKey: PermissionKey;
  readonly routePath: ModuleRoutePath;
}

function moduleRoutePath(moduleId: ErpModuleId): ModuleRoutePath {
  return `/modules/${moduleId}`;
}

export const ERP_MODULE_MANIFEST = [
  {
    moduleId: "workspace",
    label: "Workspace",
    routePath: moduleRoutePath("workspace"),
    permissionKey: createPermissionKey("workspace", "dashboard_read"),
    requiredEntitlements: [],
    optionalCapabilities: [],
  },
  {
    moduleId: "accounting",
    label: "Accounting",
    routePath: moduleRoutePath("accounting"),
    permissionKey: createPermissionKey("accounting", "journal_read"),
    requiredEntitlements: ["module.accounting.enabled"],
    optionalCapabilities: ["eInvoice", "auditExport"],
  },
  {
    moduleId: "hrm",
    label: "HRM",
    routePath: moduleRoutePath("hrm"),
    permissionKey: createPermissionKey("hr", "employee_read"),
    requiredEntitlements: [],
    optionalCapabilities: [],
  },
  {
    moduleId: "inventory",
    label: "Inventory",
    routePath: moduleRoutePath("inventory"),
    permissionKey: createPermissionKey("inventory", "stock_adjust"),
    requiredEntitlements: [],
    optionalCapabilities: ["lotTracking"],
  },
  {
    moduleId: "manufacturing",
    label: "Manufacturing",
    routePath: moduleRoutePath("manufacturing"),
    permissionKey: createPermissionKey("inventory", "stock_adjust"),
    requiredEntitlements: ["module.mrp.enabled"],
    optionalCapabilities: ["lotTracking", "forecasting"],
  },
  {
    moduleId: "mrp",
    label: "MRP",
    routePath: moduleRoutePath("mrp"),
    permissionKey: createPermissionKey("inventory", "stock_adjust"),
    requiredEntitlements: ["module.mrp.enabled"],
    optionalCapabilities: ["lotTracking", "forecasting"],
  },
  {
    moduleId: "sales",
    label: "Sales",
    routePath: moduleRoutePath("sales"),
    permissionKey: createPermissionKey("finance", "invoices_read"),
    requiredEntitlements: [],
    optionalCapabilities: [],
  },
  {
    moduleId: "ai_copilot",
    label: "AI Copilot",
    routePath: moduleRoutePath("ai_copilot"),
    permissionKey: createPermissionKey("workspace", "dashboard_read"),
    requiredEntitlements: ["module.ai_copilot.enabled"],
    optionalCapabilities: ["aiRecommendations"],
  },
] as const satisfies readonly ErpModuleManifestEntry[];

export const ERP_MODULE_IDS: readonly ErpModuleId[] = ERP_MODULE_MANIFEST.map(
  (entry) => entry.moduleId
);

const manifestByModuleId = new Map<ErpModuleId, ErpModuleManifestEntry>(
  ERP_MODULE_MANIFEST.map((entry) => [entry.moduleId, entry])
);

const erpModuleIdLookup = new Set<string>(
  ERP_MODULE_MANIFEST.map((entry) => entry.moduleId)
);

export function getErpModuleManifest(
  moduleId: ErpModuleId
): ErpModuleManifestEntry | null {
  return manifestByModuleId.get(moduleId) ?? null;
}

export function listErpModuleManifests(): readonly ErpModuleManifestEntry[] {
  return ERP_MODULE_MANIFEST;
}

export function isErpModuleId(value: string): value is ErpModuleId {
  return erpModuleIdLookup.has(value);
}
