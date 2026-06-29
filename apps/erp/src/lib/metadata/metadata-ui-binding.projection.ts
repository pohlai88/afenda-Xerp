import type { MetadataBindingContractWire } from "@afenda/shadcn-studio";

import type { MetadataRuntimeContext } from "./metadata-runtime.contract";

export interface MetadataUiBindingProjectionInput {
  readonly binding: MetadataBindingContractWire;
  readonly runtime: MetadataRuntimeContext;
}

export interface MetadataUiBindingProjectionWire {
  readonly actorId?: string;
  readonly blockId: string;
  readonly correlationId?: string;
  readonly fieldCount: number;
  readonly hasStateTemplates: boolean;
  readonly metadataBindingId: string;
  readonly tenantId?: string;
}

/** Projects ERP metadata runtime + studio binding contract into route-safe wire summary. */
export function projectMetadataUiBindingWire(
  input: MetadataUiBindingProjectionInput
): MetadataUiBindingProjectionWire {
  const { binding, runtime } = input;

  return {
    metadataBindingId: binding.metadataBindingId,
    blockId: binding.blockId,
    ...(runtime.tenantId === undefined ? {} : { tenantId: runtime.tenantId }),
    ...(runtime.actorId === undefined ? {} : { actorId: runtime.actorId }),
    ...(runtime.correlationId === undefined
      ? {}
      : { correlationId: runtime.correlationId }),
    fieldCount: binding.fields.length,
    hasStateTemplates: (binding.stateTemplates?.length ?? 0) > 0,
  };
}
