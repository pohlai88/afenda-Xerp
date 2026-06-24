import type { PermissionKey } from "@afenda/database";

import {
  ERP_MODULE_MANIFEST,
  type ErpModuleId,
  type ModuleRoutePath,
} from "./feature-manifest.registry";

export interface ModuleRouteManifestEntry {
  readonly moduleId: ErpModuleId;
  readonly path: ModuleRoutePath;
  readonly permissionKey: PermissionKey;
}

export const MODULE_ROUTE_MANIFEST = ERP_MODULE_MANIFEST.map((entry) => ({
  moduleId: entry.moduleId,
  path: entry.routePath,
  permissionKey: entry.permissionKey,
})) satisfies readonly ModuleRouteManifestEntry[];

const routeByModuleId = new Map<ErpModuleId, ModuleRouteManifestEntry>(
  MODULE_ROUTE_MANIFEST.map((entry) => [entry.moduleId, entry])
);

const routeByPath = new Map<ModuleRoutePath, ModuleRouteManifestEntry>(
  MODULE_ROUTE_MANIFEST.map((entry) => [entry.path, entry])
);

const moduleRoutePathLookup = new Set<string>(
  MODULE_ROUTE_MANIFEST.map((entry) => entry.path)
);

export function getModuleRoute(
  moduleId: ErpModuleId
): ModuleRouteManifestEntry | null {
  return routeByModuleId.get(moduleId) ?? null;
}

export function getModuleRouteByPath(
  path: string
): ModuleRouteManifestEntry | null {
  if (!isModuleRoutePath(path)) {
    return null;
  }
  return routeByPath.get(path) ?? null;
}

export function listModuleRoutes(): readonly ModuleRouteManifestEntry[] {
  return MODULE_ROUTE_MANIFEST;
}

export function isModuleRoutePath(path: string): path is ModuleRoutePath {
  return moduleRoutePathLookup.has(path);
}

export function moduleIdFromRoutePath(path: string): ErpModuleId | null {
  const entry = getModuleRouteByPath(path);
  return entry?.moduleId ?? null;
}

export function assertModuleRoutePath(path: string): ModuleRoutePath {
  if (!isModuleRoutePath(path)) {
    throw new Error(`Unknown module route path "${path}".`);
  }
  return path;
}
