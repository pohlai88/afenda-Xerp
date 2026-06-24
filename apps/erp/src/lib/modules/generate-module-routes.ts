import type { PermissionKey } from "@afenda/database";
import {
  type ErpModuleId,
  getErpModuleManifest,
  getModuleRoute,
  isErpModuleId,
  listModuleRoutes,
  type ModuleRoutePath,
} from "@afenda/entitlements";

export interface GeneratedModuleRoute {
  readonly label: string;
  readonly moduleId: ErpModuleId;
  readonly path: ModuleRoutePath;
  readonly permissionKey: PermissionKey;
  readonly segment: ErpModuleId;
}

export function generateModuleRoutes(): readonly GeneratedModuleRoute[] {
  return listModuleRoutes().map((route) => {
    const manifest = getErpModuleManifest(route.moduleId);

    return {
      moduleId: route.moduleId,
      segment: route.moduleId,
      path: route.path,
      permissionKey: route.permissionKey,
      label: manifest?.label ?? route.moduleId,
    };
  });
}

export function getGeneratedModuleRoute(
  moduleId: string
): GeneratedModuleRoute | null {
  if (!isErpModuleId(moduleId)) {
    return null;
  }

  const route = getModuleRoute(moduleId);
  if (!route) {
    return null;
  }

  const manifest = getErpModuleManifest(moduleId);
  return {
    moduleId,
    segment: moduleId,
    path: route.path,
    permissionKey: route.permissionKey,
    label: manifest?.label ?? moduleId,
  };
}

export function isKnownModuleRouteSegment(
  moduleId: string
): moduleId is ErpModuleId {
  return isErpModuleId(moduleId);
}
