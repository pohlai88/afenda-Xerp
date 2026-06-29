/**
 * PAS-006D — metadata binding registry (generated from block data contracts + overrides).
 */

import type { MetadataBindingContractWire } from "../contracts/metadata-binding.contract.js";
import { buildMetadataBindingFromDataContracts } from "./build-metadata-binding-from-data-contracts.js";
import { applyMetadataBindingOverrides } from "./metadata-binding-overrides.registry.js";

export const METADATA_BINDING_REGISTRY = applyMetadataBindingOverrides(
  buildMetadataBindingFromDataContracts()
) satisfies readonly MetadataBindingContractWire[];

export function getMetadataBindingById(
  metadataBindingId: string,
  registry: readonly MetadataBindingContractWire[] = METADATA_BINDING_REGISTRY
): MetadataBindingContractWire | undefined {
  return registry.find(
    (binding) => binding.metadataBindingId === metadataBindingId
  );
}

export function getMetadataBindingByBlockId(
  blockId: string,
  registry: readonly MetadataBindingContractWire[] = METADATA_BINDING_REGISTRY
): MetadataBindingContractWire | undefined {
  return registry.find((binding) => binding.blockId === blockId);
}
