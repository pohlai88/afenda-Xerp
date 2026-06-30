/**
 * PAS-006 Phase 3 — shared datatable-* block family contract (DATATABLE_SLOT_TEMPLATE SSOT).
 */

import { DATATABLE_SLOT_TEMPLATE } from "../../registry/block-slot-template-families.js";
import {
  BLOCK_CONTRACT_VERSION,
  type BlockContractMetadata,
} from "../block-governance.contract.js";

export const DATATABLE_BLOCK_FAMILY_PREFIX = "datatable-" as const;

export const DATATABLE_BLOCK_SLOTS = Object.fromEntries(
  DATATABLE_SLOT_TEMPLATE.slots.map((slot) => {
    const slotKey = slot.slotId.split(".")[1];

    if (slotKey === undefined || slotKey.length === 0) {
      throw new Error(`Invalid datatable slot id: ${slot.slotId}`);
    }

    return [slotKey, slot.slotId];
  })
) as {
  readonly header: "table.header";
  readonly rows: "table.rows";
  readonly actions: "table.actions";
};

export type DatatableBlockSlotMap = typeof DATATABLE_BLOCK_SLOTS;
export type DatatableBlockSlot =
  DatatableBlockSlotMap[keyof DatatableBlockSlotMap];

export function isDatatableBlockId(blockId: string): boolean {
  return blockId.startsWith(DATATABLE_BLOCK_FAMILY_PREFIX);
}

export function buildDatatableBlockMetadata(
  blockId: string,
  options: { readonly acceptanceRecordId?: string } = {}
): BlockContractMetadata {
  if (!isDatatableBlockId(blockId)) {
    throw new Error(`Expected datatable block id, received ${blockId}`);
  }

  return {
    blockDataContractId: `block-data-contract:${blockId}`,
    blockId,
    slots: DATATABLE_BLOCK_SLOTS,
    surfaceTemplateClass: "table",
    version: BLOCK_CONTRACT_VERSION,
    ...(options.acceptanceRecordId === undefined
      ? {}
      : { acceptanceRecordId: options.acceptanceRecordId }),
  } as const;
}
