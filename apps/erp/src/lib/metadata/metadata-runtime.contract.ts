/**
 * ERP metadata runtime shape — serializable carrier for greenfield PAS-006 surfaces.
 *
 * Replaces retired `@afenda/ui-composition` runtime contract for B111 lifecycle ingress.
 */

export type MetadataRuntimeTenantSaasLifecyclePhase = string;
export type MetadataRuntimeTenantId = string;
export type MetadataRuntimeActorId = string;
export type MetadataRuntimeCorrelationId = string;

export interface MetadataRuntimeContext {
  readonly actorId?: MetadataRuntimeActorId;
  readonly correlationId?: MetadataRuntimeCorrelationId;
  readonly tenantId?: MetadataRuntimeTenantId;
  readonly tenantSaasLifecyclePhase?: MetadataRuntimeTenantSaasLifecyclePhase;
}

export interface CreateMetadataRuntimeContextInput {
  readonly actorId?: MetadataRuntimeActorId;
  readonly correlationId?: MetadataRuntimeCorrelationId;
  readonly tenantId?: MetadataRuntimeTenantId;
  readonly tenantSaasLifecyclePhase?: MetadataRuntimeTenantSaasLifecyclePhase;
}

export function createMetadataRuntimeContext(
  input: CreateMetadataRuntimeContextInput = {}
): MetadataRuntimeContext {
  return {
    ...(input.actorId === undefined ? {} : { actorId: input.actorId }),
    ...(input.correlationId === undefined
      ? {}
      : { correlationId: input.correlationId }),
    ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
    ...(input.tenantSaasLifecyclePhase === undefined
      ? {}
      : { tenantSaasLifecyclePhase: input.tenantSaasLifecyclePhase }),
  };
}
