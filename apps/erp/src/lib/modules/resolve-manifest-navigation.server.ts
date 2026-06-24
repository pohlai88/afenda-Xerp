import {
  type AppShellMenuItem,
  buildHydratedManifestNavigation,
  isManifestModuleId,
  type ManifestNavModuleEntry,
} from "@afenda/appshell";
import { listErpModuleManifests } from "@afenda/entitlements";
import type { OperatingContext } from "@afenda/kernel";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  isDeniedAuthorizationResult,
  type PermissionDataSource,
} from "@afenda/permissions";

import { toPermissionCheckContextFromOperatingContext } from "@/lib/permissions/to-permission-check-context.server";

function toManifestNavModules(): readonly ManifestNavModuleEntry[] {
  return listErpModuleManifests().map((entry) => {
    if (!isManifestModuleId(entry.moduleId)) {
      throw new Error(
        `Entitlements module id "${entry.moduleId}" is not a governed ManifestModuleId.`
      );
    }

    return {
      moduleId: entry.moduleId,
      label: entry.label,
      routePath: entry.routePath,
      permissionKey: entry.permissionKey,
    };
  });
}

async function resolveGrantedModulePermissionKeys(
  operatingContext: OperatingContext,
  permissionDataSource: PermissionDataSource
): Promise<ReadonlySet<string>> {
  const grantedPermissionKeys = new Set<string>();
  const permissionRequest = {
    actor: { actorId: operatingContext.actor.userId },
    context: toPermissionCheckContextFromOperatingContext(operatingContext),
  };

  for (const entry of listErpModuleManifests()) {
    const result = await checkPermission(
      {
        ...permissionRequest,
        permissionKey: entry.permissionKey,
      },
      permissionDataSource
    );

    if (!isDeniedAuthorizationResult(result)) {
      grantedPermissionKeys.add(entry.permissionKey);
    }
  }

  return grantedPermissionKeys;
}

export async function resolveManifestNavigationFromOperatingContext(
  operatingContext: OperatingContext,
  permissionDataSource: PermissionDataSource = createProductionAuthorizationDataSources()
    .permission
): Promise<readonly AppShellMenuItem[]> {
  const grantedPermissionKeys = await resolveGrantedModulePermissionKeys(
    operatingContext,
    permissionDataSource
  );

  return buildHydratedManifestNavigation({
    modules: toManifestNavModules(),
    grantedPermissionKeys,
  });
}
