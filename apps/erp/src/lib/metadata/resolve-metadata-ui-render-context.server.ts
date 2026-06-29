import { normalizeTenantIdForWire, type TenantContext } from "@afenda/kernel";

import {
  createMetadataRuntimeContext,
  type MetadataRuntimeContext,
} from "./metadata-runtime.contract";

export interface ResolveMetadataUiRenderContextInput {
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly tenant: TenantContext;
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
