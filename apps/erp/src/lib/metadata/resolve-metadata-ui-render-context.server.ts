import {
  normalizeTenantIdForWire,
  type OperatingContext,
  type TenantContext,
} from "@afenda/kernel";

import {
  createMetadataRuntimeContext,
  type MetadataRuntimeContext,
} from "./metadata-runtime.contract";

export interface ResolveMetadataUiRenderContextInput {
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly tenant: TenantContext;
}

export interface ResolveMetadataUiRenderContextFromOperatingContextInput {
  readonly operatingContext: OperatingContext;
}

/** Projects verified kernel tenant context into ERP metadata runtime (PAS-001 B111). */
export function resolveMetadataUiRenderContextFromTenantContext(
  input: ResolveMetadataUiRenderContextInput
): MetadataRuntimeContext {
  const tenantIdWire = normalizeTenantIdForWire(input.tenant.tenantId);

  return createMetadataRuntimeContext({
    tenantId: tenantIdWire,
    ...(input.tenant.saasLifecyclePhase === undefined
      ? {}
      : {
          tenantSaasLifecyclePhase: input.tenant.saasLifecyclePhase,
        }),
    ...(input.actorId === undefined ? {} : { actorId: input.actorId }),
    ...(input.correlationId === undefined
      ? {}
      : { correlationId: input.correlationId }),
  });
}

/** Operating-context ingress alias for metadata surfaces (IS-003 / PAS-006D). */
export function resolveMetadataUiRenderContextFromOperatingContext(
  input: ResolveMetadataUiRenderContextFromOperatingContextInput
): MetadataRuntimeContext {
  return resolveMetadataUiRenderContextFromTenantContext({
    tenant: input.operatingContext.tenant,
    actorId: `${input.operatingContext.actor.userId}`,
    correlationId: input.operatingContext.correlationId,
  });
}
