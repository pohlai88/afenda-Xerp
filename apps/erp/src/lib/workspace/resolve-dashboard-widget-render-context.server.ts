import {
  DASHBOARD_WIDGET_CAPABILITIES,
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  type SerializableDashboardWidgetRenderContext,
  serializeDashboardWidgetRenderContext,
} from "@afenda/appshell";
import type { OperatingContext } from "@afenda/kernel";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  isDeniedAuthorizationResult,
  PERMISSION_REGISTRY,
  type PermissionCheckRequest,
  type PermissionDataSource,
} from "@afenda/permissions";

const EMPTY_SERIALIZED_DASHBOARD_WIDGET_RENDER_CONTEXT = {
  permissions: [],
  capabilities: [],
  featureFlags: [],
} satisfies SerializableDashboardWidgetRenderContext;

const FINANCE_PERMISSION_REGISTRY_KEYS = {
  [DASHBOARD_WIDGET_FINANCE_PERMISSIONS[0]]:
    PERMISSION_REGISTRY.finance.invoices.read,
  [DASHBOARD_WIDGET_FINANCE_PERMISSIONS[1]]:
    PERMISSION_REGISTRY.finance.cards.read,
  [DASHBOARD_WIDGET_FINANCE_PERMISSIONS[2]]:
    PERMISSION_REGISTRY.finance.transactions.read,
} as const satisfies Record<
  (typeof DASHBOARD_WIDGET_FINANCE_PERMISSIONS)[number],
  string
>;

const CAPABILITY_PERMISSION_REGISTRY_KEYS = {
  [DASHBOARD_WIDGET_CAPABILITIES[0]]:
    PERMISSION_REGISTRY.dashboard.moduleEarnings,
  [DASHBOARD_WIDGET_CAPABILITIES[1]]:
    PERMISSION_REGISTRY.dashboard.regionalSales,
} as const satisfies Record<
  (typeof DASHBOARD_WIDGET_CAPABILITIES)[number],
  string
>;

function toAuthorizationContextFromOperatingContext(
  operatingContext: OperatingContext
): PermissionCheckRequest["context"] {
  return {
    tenantId: operatingContext.permissionScope.tenantId,
    companyId: operatingContext.permissionScope.companyId,
    organizationId: operatingContext.permissionScope.organizationId,
    workspaceId: null,
  };
}

async function isPermissionGranted(
  request: Omit<PermissionCheckRequest, "permissionKey">,
  permissionKey: string,
  dataSource: ReturnType<
    typeof createProductionAuthorizationDataSources
  >["permission"]
): Promise<boolean> {
  const result = await checkPermission(
    {
      ...request,
      permissionKey,
    },
    dataSource
  );

  return !isDeniedAuthorizationResult(result);
}

/**
 * Resolves dashboard widget RBAC from verified operating context via `@afenda/permissions`.
 */
export async function resolveDashboardWidgetRenderContextFromOperatingContext(
  operatingContext: OperatingContext,
  permissionDataSource: PermissionDataSource = createProductionAuthorizationDataSources()
    .permission
): Promise<SerializableDashboardWidgetRenderContext> {
  const authorizationContext =
    toAuthorizationContextFromOperatingContext(operatingContext);
  const permissionRequest = {
    actor: { actorId: operatingContext.actor.userId },
    context: authorizationContext,
  } satisfies Omit<PermissionCheckRequest, "permissionKey">;

  const grantedPermissions: string[] = [];
  const grantedCapabilities: string[] = [];

  for (const gateKey of DASHBOARD_WIDGET_FINANCE_PERMISSIONS) {
    const permissionKey = FINANCE_PERMISSION_REGISTRY_KEYS[gateKey];
    const allowed = await isPermissionGranted(
      permissionRequest,
      permissionKey,
      permissionDataSource
    );

    if (allowed) {
      grantedPermissions.push(gateKey);
    }
  }

  for (const gateKey of DASHBOARD_WIDGET_CAPABILITIES) {
    const permissionKey = CAPABILITY_PERMISSION_REGISTRY_KEYS[gateKey];
    const allowed = await isPermissionGranted(
      permissionRequest,
      permissionKey,
      permissionDataSource
    );

    if (allowed) {
      grantedCapabilities.push(gateKey);
    }
  }

  return {
    permissions: grantedPermissions,
    capabilities: grantedCapabilities,
    featureFlags: [],
  };
}

/** Dev harness fallback when no authenticated operating context is available. */
export function resolveDevHarnessDashboardWidgetRenderContext(): SerializableDashboardWidgetRenderContext {
  return serializeDashboardWidgetRenderContext(
    PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
  );
}

export function emptyDashboardWidgetRenderContext(): SerializableDashboardWidgetRenderContext {
  return EMPTY_SERIALIZED_DASHBOARD_WIDGET_RENDER_CONTEXT;
}

/**
 * Resolves whether the actor may persist workspace dashboard layout changes.
 */
export async function resolveWorkspaceDashboardCapabilitiesFromOperatingContext(
  operatingContext: OperatingContext,
  permissionDataSource: PermissionDataSource = createProductionAuthorizationDataSources()
    .permission
): Promise<{ readonly canEditLayout: boolean }> {
  const permissionRequest = {
    actor: { actorId: operatingContext.actor.userId },
    context: toAuthorizationContextFromOperatingContext(operatingContext),
  } satisfies Omit<PermissionCheckRequest, "permissionKey">;

  const canEditLayout = await isPermissionGranted(
    permissionRequest,
    PERMISSION_REGISTRY.workspace.dashboard.write,
    permissionDataSource
  );

  return { canEditLayout };
}
