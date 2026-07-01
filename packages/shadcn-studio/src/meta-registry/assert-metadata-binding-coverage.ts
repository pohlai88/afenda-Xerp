/**
 * PAS-006D P06-008-R1 — metadata binding coverage enforcement (MCP manifest blockIds).
 */

import type { MetadataBindingContractWire } from "../meta-contracts/metadata-binding.contract.js";
import { isValidMetadataBindingPresentationKind } from "../meta-contracts/metadata-binding.contract.js";
import type { MetadataBindingWaiverWire } from "../meta-contracts/metadata-binding-waiver.contract.js";
import { isMetadataBindingWaiverReason } from "../meta-contracts/metadata-binding-waiver.contract.js";
import { getBlockSlotsForBlockId } from "./block-slot.registry.js";
import { METADATA_BINDING_REGISTRY } from "./metadata-binding.registry.js";
import { METADATA_BINDING_WAIVER_REGISTRY } from "./metadata-binding-waiver.registry.js";

export type MetadataBindingCoverageRow = {
  readonly blockId: string;
  readonly metadataBindingId?: string;
  readonly outcome: "binding" | "waiver";
  readonly waiverId?: string;
};

export type MetadataBindingCoverageResult =
  | { ok: true; rows: readonly MetadataBindingCoverageRow[] }
  | { ok: false; violations: readonly string[] };

export function assertMetadataBindingCoverage(
  blockIds: readonly string[]
): MetadataBindingCoverageResult {
  const violations: string[] = [];
  const rows: MetadataBindingCoverageRow[] = [];

  const bindingByBlockId = new Map<string, MetadataBindingContractWire>(
    METADATA_BINDING_REGISTRY.map((binding) => [binding.blockId, binding])
  );
  const waiverByBlockId = new Map<string, MetadataBindingWaiverWire>(
    METADATA_BINDING_WAIVER_REGISTRY.map((waiver) => [waiver.blockId, waiver])
  );

  const bindingBlockIds = new Set<string>();
  const bindingIds = new Set<string>();
  const waiverBlockIds = new Set<string>();
  const waiverIds = new Set<string>();

  for (const binding of METADATA_BINDING_REGISTRY) {
    if (bindingBlockIds.has(binding.blockId)) {
      violations.push(`duplicate binding blockId: ${binding.blockId}`);
    }
    bindingBlockIds.add(binding.blockId);

    if (bindingIds.has(binding.metadataBindingId)) {
      violations.push(
        `duplicate metadataBindingId: ${binding.metadataBindingId}`
      );
    }
    bindingIds.add(binding.metadataBindingId);

    const slotIds = new Set(
      getBlockSlotsForBlockId(binding.blockId).map((slot) => slot.slotId)
    );

    for (const field of binding.fields) {
      if (!slotIds.has(field.slotId)) {
        violations.push(
          `binding ${binding.metadataBindingId} references unknown slotId ${field.slotId}`
        );
      }

      if (
        field.labelAtomRef === undefined ||
        field.labelAtomRef.trim().length === 0
      ) {
        violations.push(
          `binding ${binding.metadataBindingId} field ${field.fieldKey} missing labelAtomRef`
        );
      }

      if (!isValidMetadataBindingPresentationKind(field.presentationKind)) {
        violations.push(
          `binding ${binding.metadataBindingId} field ${field.fieldKey} has invalid presentationKind ${field.presentationKind}`
        );
      }
    }
  }

  for (const waiver of METADATA_BINDING_WAIVER_REGISTRY) {
    if (waiverBlockIds.has(waiver.blockId)) {
      violations.push(`duplicate waiver blockId: ${waiver.blockId}`);
    }
    waiverBlockIds.add(waiver.blockId);

    if (waiverIds.has(waiver.waiverId)) {
      violations.push(`duplicate waiverId: ${waiver.waiverId}`);
    }
    waiverIds.add(waiver.waiverId);

    if (!isMetadataBindingWaiverReason(waiver.reason)) {
      violations.push(`waiver ${waiver.waiverId} has invalid reason`);
    }

    if (waiver.notes.trim().length === 0) {
      violations.push(`waiver ${waiver.waiverId} missing notes`);
    }

    if (bindingByBlockId.has(waiver.blockId)) {
      violations.push(
        `blockId ${waiver.blockId} has both binding and waiver rows`
      );
    }
  }

  for (const blockId of blockIds) {
    const binding = bindingByBlockId.get(blockId);
    const waiver = waiverByBlockId.get(blockId);

    if (binding !== undefined && waiver !== undefined) {
      violations.push(`blockId ${blockId} has binding and waiver overlap`);
    }

    if (binding === undefined && waiver === undefined) {
      violations.push(`blockId ${blockId} has no binding or waiver coverage`);
      continue;
    }

    if (binding !== undefined) {
      rows.push({
        blockId,
        outcome: "binding",
        metadataBindingId: binding.metadataBindingId,
      });
      continue;
    }

    if (waiver === undefined) {
      continue;
    }

    rows.push({
      blockId,
      outcome: "waiver",
      waiverId: waiver.waiverId,
    });
  }

  if (violations.length > 0) {
    return { ok: false, violations };
  }

  return { ok: true, rows };
}

export function summarizeMetadataBindingCoverage(blockIds: readonly string[]): {
  readonly bindingCount: number;
  readonly total: number;
  readonly waiverCount: number;
} {
  const result = assertMetadataBindingCoverage(blockIds);

  if (!result.ok) {
    throw new Error(result.violations.join("\n"));
  }

  const bindingCount = result.rows.filter(
    (row) => row.outcome === "binding"
  ).length;
  const waiverCount = result.rows.filter(
    (row) => row.outcome === "waiver"
  ).length;

  return {
    bindingCount,
    waiverCount,
    total: blockIds.length,
  };
}
