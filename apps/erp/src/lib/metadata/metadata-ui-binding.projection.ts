import {
  ERP_DOMAIN_MODULE_KV_IDS,
  ERP_DOMAIN_MODULES,
  type ErpDomainModule,
} from "@afenda/kernel/erp-domain/catalog";
import type { MetadataBindingContractWire } from "@afenda/shadcn-studio";
import { getBlockDataContractForBlockId } from "@afenda/shadcn-studio";

import type { MetadataRuntimeContext } from "./metadata-runtime.contract";

export interface MetadataUiBindingProjectionInput {
  readonly binding: MetadataBindingContractWire;
  readonly runtime: MetadataRuntimeContext;
}

export interface MetadataUiBindingProjectionWire {
  readonly actorId?: string;
  readonly blockId: string;
  readonly correlationId?: string;
  readonly erpDomainKvId?: string;
  readonly erpDomainModuleSlug?: string;
  readonly fieldCount: number;
  readonly hasStateTemplates: boolean;
  readonly matchedBlockDataFieldCount: number;
  readonly metadataBindingId: string;
  readonly tenantId?: string;
}

const KNOWN_ERP_DOMAIN_KV_IDS = new Set<string>(
  Object.values(ERP_DOMAIN_MODULE_KV_IDS)
);

function isErpDomainModuleSlug(value: string): value is ErpDomainModule {
  return (ERP_DOMAIN_MODULES as readonly string[]).includes(value);
}

/** True when value is a catalog KV id from ERP_DOMAIN_MODULE_KV_IDS SSOT. */
export function isKnownErpDomainKvId(value: string): boolean {
  return KNOWN_ERP_DOMAIN_KV_IDS.has(value);
}

function resolveErpDomainCatalogRefs(binding: MetadataBindingContractWire): {
  readonly erpDomainKvId?: string;
  readonly erpDomainModuleSlug?: string;
} {
  if (
    binding.erpDomainModuleSlug !== undefined &&
    isErpDomainModuleSlug(binding.erpDomainModuleSlug)
  ) {
    return {
      erpDomainModuleSlug: binding.erpDomainModuleSlug,
      erpDomainKvId: ERP_DOMAIN_MODULE_KV_IDS[binding.erpDomainModuleSlug],
    };
  }

  if (
    binding.erpDomainKvId !== undefined &&
    isKnownErpDomainKvId(binding.erpDomainKvId)
  ) {
    return { erpDomainKvId: binding.erpDomainKvId };
  }

  return {};
}

/** Projects ERP metadata runtime + studio binding contract into route-safe wire summary. */
export function projectMetadataUiBindingWire(
  input: MetadataUiBindingProjectionInput
): MetadataUiBindingProjectionWire {
  const { binding, runtime } = input;
  const catalogRefs = resolveErpDomainCatalogRefs(binding);
  const blockDataContract = getBlockDataContractForBlockId(binding.blockId);
  const blockDataFieldKeys = new Set(
    blockDataContract?.fields.map((field) => field.fieldKey) ?? []
  );
  const matchedBlockDataFieldCount = binding.fields.filter((field) =>
    blockDataFieldKeys.has(field.fieldKey)
  ).length;

  return {
    metadataBindingId: binding.metadataBindingId,
    blockId: binding.blockId,
    ...(runtime.tenantId === undefined ? {} : { tenantId: runtime.tenantId }),
    ...(runtime.actorId === undefined ? {} : { actorId: runtime.actorId }),
    ...(runtime.correlationId === undefined
      ? {}
      : { correlationId: runtime.correlationId }),
    ...catalogRefs,
    fieldCount: binding.fields.length,
    hasStateTemplates: (binding.stateTemplates?.length ?? 0) > 0,
    matchedBlockDataFieldCount,
  };
}
