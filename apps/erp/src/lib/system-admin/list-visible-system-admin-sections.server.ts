import type { OperatingContext } from "@afenda/kernel";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  isDeniedAuthorizationResult,
  type PermissionDataSource,
} from "@afenda/permissions";

import { toPermissionCheckContextFromOperatingContext } from "@/lib/permissions/to-permission-check-context.server";

import { resolveSystemAdminOperatingContext } from "./resolve-system-admin-operating-context.server";
import {
  SYSTEM_ADMIN_SECTIONS,
  type SystemAdminSectionDefinition,
} from "./system-admin-sections";

export async function filterVisibleSystemAdminSections(input: {
  readonly operatingContext: OperatingContext;
  readonly permissionDataSource: PermissionDataSource;
}): Promise<readonly SystemAdminSectionDefinition[]> {
  const visibleSections: SystemAdminSectionDefinition[] = [];

  for (const section of SYSTEM_ADMIN_SECTIONS) {
    const permissionResult = await checkPermission(
      {
        actor: { actorId: input.operatingContext.actor.userId },
        context: toPermissionCheckContextFromOperatingContext(
          input.operatingContext
        ),
        permissionKey: section.readPermissionKey,
      },
      input.permissionDataSource
    );

    if (!isDeniedAuthorizationResult(permissionResult)) {
      visibleSections.push(section);
    }
  }

  return visibleSections;
}

export async function listVisibleSystemAdminSections(input?: {
  readonly permissionDataSource?: PermissionDataSource;
}): Promise<readonly SystemAdminSectionDefinition[]> {
  const operatingResult = await resolveSystemAdminOperatingContext();

  if (operatingResult.kind !== "ready") {
    return [];
  }

  return filterVisibleSystemAdminSections({
    operatingContext: operatingResult.operatingContext,
    permissionDataSource:
      input?.permissionDataSource ??
      createProductionAuthorizationDataSources().permission,
  });
}
