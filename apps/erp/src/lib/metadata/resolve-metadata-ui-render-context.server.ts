import type { OperatingContext } from "@afenda/kernel";
import { createMetadataRuntimeContext } from "@afenda/metadata";
import {
  createMetadataUiRenderContext,
  type MetadataUiRenderContext,
} from "@afenda/metadata-ui/server";

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

  return [
    operatingContext.tenant.tenantId,
    operatingContext.legalEntity.companyId,
    organizationId ?? "root",
  ].join(":");
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

  const runtime = createMetadataRuntimeContext({
    actorId: operatingContext.actor.userId,
    tenantId: operatingContext.tenant.tenantId,
    companyId: operatingContext.legalEntity.companyId,
    ...(organizationId === undefined ? {} : { organizationId }),
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
