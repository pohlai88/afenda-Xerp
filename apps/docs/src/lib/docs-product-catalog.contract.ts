/** Serializable catalog snapshots exported by `pnpm sync:product-docs`. */

export const CATALOG_IDS = [
  "auth-routes",
  "system-admin",
  "permissions",
  "env",
  "modules",
] as const;

export type CatalogId = (typeof CATALOG_IDS)[number];

export interface AuthRouteCatalogEntry {
  readonly path: string;
  readonly lane: string;
}

export interface AuthRoutesCatalog {
  readonly catalogId: "auth-routes";
  readonly exportedAt: string;
  readonly lanes: readonly string[];
  readonly routes: readonly AuthRouteCatalogEntry[];
}

export interface SystemAdminSectionCatalogEntry {
  readonly sectionId: string;
  readonly label: string;
  readonly href: string;
  readonly readPermissionKey: string;
}

export interface SystemAdminCatalog {
  readonly catalogId: "system-admin";
  readonly exportedAt: string;
  readonly sections: readonly SystemAdminSectionCatalogEntry[];
}

export interface PermissionCatalogEntry {
  readonly key: string;
  readonly domain: string;
  readonly action: string;
}

export interface PermissionsCatalog {
  readonly catalogId: "permissions";
  readonly exportedAt: string;
  readonly permissions: readonly PermissionCatalogEntry[];
}

export interface EnvCatalogEntry {
  readonly name: string;
  readonly section: string;
  readonly description?: string;
  readonly deprecated?: boolean;
}

export interface EnvCatalog {
  readonly catalogId: "env";
  readonly exportedAt: string;
  readonly variables: readonly EnvCatalogEntry[];
}

export interface ModuleCatalogEntry {
  readonly moduleId: string;
  readonly label: string;
  readonly routePath: string;
  readonly permissionKey: string;
  readonly requiredEntitlements: readonly string[];
  readonly optionalCapabilities: readonly string[];
}

export interface ModulesCatalog {
  readonly catalogId: "modules";
  readonly exportedAt: string;
  readonly modules: readonly ModuleCatalogEntry[];
}

export type ProductCatalog =
  | AuthRoutesCatalog
  | SystemAdminCatalog
  | PermissionsCatalog
  | EnvCatalog
  | ModulesCatalog;

export const CATALOG_FILE_NAMES = {
  "auth-routes": "auth-routes.catalog.json",
  "system-admin": "system-admin.catalog.json",
  permissions: "permissions.catalog.json",
  env: "env.catalog.json",
  modules: "modules.catalog.json",
} as const satisfies Record<CatalogId, string>;

export const TASK_ARTICLE_AUDIENCES = [
  "end-user",
  "tenant-admin",
  "tenant-devops",
  "integrator",
  "engineer",
] as const;

export type TaskArticleAudience = (typeof TASK_ARTICLE_AUDIENCES)[number];
