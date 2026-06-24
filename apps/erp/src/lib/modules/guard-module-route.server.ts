import type { OperatingContext } from "@afenda/kernel";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  isDeniedAuthorizationResult,
  type PermissionDataSource,
} from "@afenda/permissions";

import { createErpLogger } from "@/lib/observability/create-erp-logger";
import { toErpCorrelationId } from "@/lib/observability/erp-correlation-id";
import { ERP_LOGGER_MODULES } from "@/lib/observability/erp-diagnostic-defaults";
import { recordErpAuditEvent } from "@/lib/observability/record-erp-audit-event";
import { toPermissionCheckContextFromOperatingContext } from "@/lib/permissions/to-permission-check-context.server";

import {
  type GeneratedModuleRoute,
  getGeneratedModuleRoute,
} from "./generate-module-routes";

export type ModuleRouteGuardResult =
  | {
      readonly kind: "allowed";
      readonly route: GeneratedModuleRoute;
    }
  | {
      readonly kind: "forbidden";
      readonly moduleId: string;
      readonly permissionKey: string;
    }
  | {
      readonly kind: "not_found";
      readonly moduleId: string;
    };

async function logModuleRouteDenial(input: {
  readonly correlationId: string;
  readonly moduleId: string;
  readonly operatingContext: OperatingContext;
  readonly permissionKey: string;
}): Promise<void> {
  const { operatingContext } = input;

  createErpLogger({
    correlationId: toErpCorrelationId(input.correlationId),
    module: ERP_LOGGER_MODULES.apiAuthorization,
  }).warn("module.route.denied", {
    actorId: operatingContext.actor.userId,
    companyId: operatingContext.permissionScope.companyId,
    moduleId: input.moduleId,
    organizationId: operatingContext.permissionScope.organizationId,
    permissionKey: input.permissionKey,
    tenantId: operatingContext.permissionScope.tenantId,
  });

  await recordErpAuditEvent({
    action: "module.route.access_denied",
    actorUserId: operatingContext.actor.userId,
    correlationId: input.correlationId,
    module: ERP_LOGGER_MODULES.apiAuthorization,
    result: "denied",
    targetId: input.moduleId,
    targetType: "erp_module_route",
    fallbackMetadata: {
      permissionKey: input.permissionKey,
    },
  });
}

export async function guardModuleRoute(input: {
  readonly correlationId: string;
  readonly moduleId: string;
  readonly operatingContext: OperatingContext;
  readonly permissionDataSource?: PermissionDataSource;
}): Promise<ModuleRouteGuardResult> {
  const route = getGeneratedModuleRoute(input.moduleId);
  if (!route) {
    return {
      kind: "not_found",
      moduleId: input.moduleId,
    };
  }

  const permissionDataSource =
    input.permissionDataSource ??
    createProductionAuthorizationDataSources().permission;

  const permissionResult = await checkPermission(
    {
      actor: { actorId: input.operatingContext.actor.userId },
      context: toPermissionCheckContextFromOperatingContext(
        input.operatingContext
      ),
      permissionKey: route.permissionKey,
    },
    permissionDataSource
  );

  if (isDeniedAuthorizationResult(permissionResult)) {
    await logModuleRouteDenial({
      correlationId: input.correlationId,
      moduleId: route.moduleId,
      operatingContext: input.operatingContext,
      permissionKey: route.permissionKey,
    });

    return {
      kind: "forbidden",
      moduleId: route.moduleId,
      permissionKey: route.permissionKey,
    };
  }

  return {
    kind: "allowed",
    route,
  };
}
