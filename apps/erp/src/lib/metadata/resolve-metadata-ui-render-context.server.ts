import type { OperatingContext } from "@afenda/kernel";
import {
  createMetadataUiRenderContext,
  type MetadataUiRenderContext,
} from "@afenda/metadata-ui/server";
import { createMetadataRuntimeContext } from "@afenda/ui-composition";

import { formatActiveWorkspaceId } from "@/lib/context/active-workspace-id.contract";

export interface ResolveMetadataUiRenderContextInput {
  readonly capabilities?: readonly string[];
  readonly operatingContext: OperatingContext;
  readonly permissions?: readonly string[];
}

function resolveMetadataWorkspaceId(
  operatingContext: OperatingContext
): string {
  const organizationId =
    operatingContext.organizationUnit?.organizationUnitId ??
    operatingContext.workspace.organizationId;

  return formatActiveWorkspaceId({
    tenantId: operatingContext.tenant.tenantId,
    companyId: operatingContext.legalEntity.companyId,
    organizationId,
  });
}

function resolveMetadataHierarchyScopeCarriers(
  operatingContext: OperatingContext
): {
  readonly entityGroupId?: string;
  readonly projectId?: string;
  readonly teamId?: string;
} {
  const entityGroupId = operatingContext.entityGroup?.entityGroupId;
  const teamId = operatingContext.team?.teamId;
  const projectId =
    operatingContext.project?.projectId ??
    operatingContext.workspace.projectId ??
    undefined;

  return {
    ...(entityGroupId === undefined ? {} : { entityGroupId }),
    ...(teamId === undefined ? {} : { teamId }),
    ...(projectId === undefined || projectId === null ? {} : { projectId }),
  };
}

/** Builds a server-side metadata render context from verified ERP operating context. */
export function resolveMetadataUiRenderContextFromOperatingContext(
  input: ResolveMetadataUiRenderContextInput
): MetadataUiRenderContext {
  const { operatingContext } = input;

  const organizationId =
    operatingContext.organizationUnit?.organizationUnitId ??
    operatingContext.workspace.organizationId ??
    undefined;

  const hierarchyScope =
    resolveMetadataHierarchyScopeCarriers(operatingContext);

  const runtime = createMetadataRuntimeContext({
    actorId: operatingContext.actor.userId,
    tenantId: operatingContext.tenant.tenantId,
    companyId: operatingContext.legalEntity.companyId,
    ...(organizationId === undefined ? {} : { organizationId }),
    ...hierarchyScope,
    workspaceId: resolveMetadataWorkspaceId(operatingContext),
    correlationId: operatingContext.correlationId,
    permissions: input.permissions ? [...input.permissions] : [],
    capabilities: input.capabilities ? [...input.capabilities] : [],
    density: "default",
    presentationMode: "default",
    state: "ready",
    diagnosticsEnabled: false,
    readonlyMode: false,
  });

  return createMetadataUiRenderContext({
    runtime,
    source: "server",
    hydration: "none",
    diagnosticsLevel: "off",
    diagnosticsNamespace: "erp.metadata-workspace",
  });
}
