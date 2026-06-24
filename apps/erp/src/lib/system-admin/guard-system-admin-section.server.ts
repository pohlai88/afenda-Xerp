import type { OperatingContext } from "@afenda/kernel";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  isDeniedAuthorizationResult,
  type PermissionDataSource,
  type RegisteredPermissionKey,
} from "@afenda/permissions";

import { createErpLogger } from "@/lib/observability/create-erp-logger";
import { toErpCorrelationId } from "@/lib/observability/erp-correlation-id";
import { ERP_LOGGER_MODULES } from "@/lib/observability/erp-diagnostic-defaults";
import { recordErpAuditEvent } from "@/lib/observability/record-erp-audit-event";
import { toPermissionCheckContextFromOperatingContext } from "@/lib/permissions/to-permission-check-context.server";

import {
  getSystemAdminSection,
  type SystemAdminSectionDefinition,
} from "./system-admin-sections";

export type SystemAdminSectionGuardResult =
  | {
      readonly kind: "allowed";
      readonly section: SystemAdminSectionDefinition;
    }
  | {
      readonly kind: "forbidden";
      readonly permissionKey: RegisteredPermissionKey;
      readonly sectionId: string;
    }
  | {
      readonly kind: "not_found";
      readonly sectionId: string;
    };

async function logSystemAdminSectionDenial(input: {
  readonly correlationId: string;
  readonly operatingContext: OperatingContext;
  readonly permissionKey: RegisteredPermissionKey;
  readonly sectionId: string;
}): Promise<void> {
  const { operatingContext } = input;

  createErpLogger({
    correlationId: toErpCorrelationId(input.correlationId),
    module: ERP_LOGGER_MODULES.apiAuthorization,
  }).warn("system_admin.section.denied", {
    actorId: operatingContext.actor.userId,
    companyId: operatingContext.permissionScope.companyId,
    organizationId: operatingContext.permissionScope.organizationId,
    permissionKey: input.permissionKey,
    sectionId: input.sectionId,
    tenantId: operatingContext.permissionScope.tenantId,
  });

  await recordErpAuditEvent({
    action: "system_admin.section.access_denied",
    actorUserId: operatingContext.actor.userId,
    correlationId: input.correlationId,
    module: ERP_LOGGER_MODULES.apiAuthorization,
    result: "denied",
    targetId: input.sectionId,
    targetType: "system_admin_section",
    fallbackMetadata: {
      permissionKey: input.permissionKey,
    },
  });
}

export async function guardSystemAdminSection(input: {
  readonly correlationId: string;
  readonly operatingContext: OperatingContext;
  readonly permissionDataSource?: PermissionDataSource;
  readonly sectionId: string;
}): Promise<SystemAdminSectionGuardResult> {
  const section = getSystemAdminSection(input.sectionId);
  if (!section) {
    return {
      kind: "not_found",
      sectionId: input.sectionId,
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
      permissionKey: section.readPermissionKey,
    },
    permissionDataSource
  );

  if (isDeniedAuthorizationResult(permissionResult)) {
    await logSystemAdminSectionDenial({
      correlationId: input.correlationId,
      operatingContext: input.operatingContext,
      permissionKey: section.readPermissionKey,
      sectionId: section.sectionId,
    });

    return {
      kind: "forbidden",
      permissionKey: section.readPermissionKey,
      sectionId: section.sectionId,
    };
  }

  return {
    kind: "allowed",
    section,
  };
}
