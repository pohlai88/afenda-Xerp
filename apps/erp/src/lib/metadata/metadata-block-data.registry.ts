/** ERP-local block data contracts mirrored from metadata bindings (B-08). */

import type { BlockDataContractWire } from "./metadata-studio.contract";
import { METADATA_BINDING_REGISTRY } from "./metadata-binding.registry";

function buildBlockDataContractsFromBindings(): readonly BlockDataContractWire[] {
  const byBlockId = new Map<string, BlockDataContractWire>();

  for (const binding of METADATA_BINDING_REGISTRY) {
    byBlockId.set(binding.blockId, {
      blockId: binding.blockId,
      fields: binding.fields.map((field) => ({
        fieldKey: field.fieldKey,
        slotId: field.slotId,
        kind:
          field.presentationKind === "checkbox"
            ? "boolean"
            : field.fieldKey.includes("password")
              ? "password"
              : field.fieldKey.includes("email")
                ? "email"
                : field.presentationKind === "number"
                  ? "number"
                  : field.presentationKind === "date"
                    ? "date"
                    : field.presentationKind === "select"
                      ? "select"
                      : field.presentationKind === "readonly"
                        ? "readonly"
                        : "text",
        ...(field.labelAtomRef === undefined
          ? {}
          : { labelAtomRef: field.labelAtomRef }),
        ...(field.requiredDisplay === undefined
          ? {}
          : { requiredDisplay: field.requiredDisplay }),
      })),
    });
  }

  return [...byBlockId.values()];
}

export const BLOCK_DATA_CONTRACT_REGISTRY = buildBlockDataContractsFromBindings();

export function getBlockDataContractForBlockId(
  blockId: string,
  registry: readonly BlockDataContractWire[] = BLOCK_DATA_CONTRACT_REGISTRY
): BlockDataContractWire | undefined {
  return registry.find((contract) => contract.blockId === blockId);
}
