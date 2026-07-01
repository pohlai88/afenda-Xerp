/**
 * @afenda.l1-contract-envelope block-metadata
 * Role: buildBlockMetadata() + datatable family rules from registry SSOT
 * Family: block-metadata · flat L1 builder (no per-block files)
 * Relies on: block-metadata.contract, surface-template, registry/block-slot.registry
 * Relied on by: governance/block-metadata.registry
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-block-contracts · check:studio-l1-contracts
 */

import {
  GOVERNED_BLOCK_CONTRACT_IDS,
  getBlockSlotsForBlockId,
} from "../meta-registry/block-slot.registry.js";
import {
  BLOCK_METADATA_VERSION,
  type BlockMetadata,
} from "./block-metadata.contract.js";
import type { SurfaceTemplateClass } from "./surface-template.contract.js";

export const DATATABLE_BLOCK_FAMILY_PREFIX = "datatable-" as const;

export function isDatatableBlockId(blockId: string): boolean {
  return blockId.startsWith(DATATABLE_BLOCK_FAMILY_PREFIX);
}

export function resolveGovernedBlockAcceptanceRecordId(
  blockId: string
): string {
  return `acceptance-record:${blockId}`;
}

function resolveSurfaceTemplateClass(blockId: string): SurfaceTemplateClass {
  if (isDatatableBlockId(blockId)) {
    return "table";
  }

  if (blockId === "account-settings-01") {
    return "settings";
  }

  if (blockId === "login-page-04" || blockId === "dialog-activity") {
    return "form";
  }

  if (
    blockId === "hero-section-01" ||
    blockId === "statistics-card-01" ||
    blockId.startsWith("statistics-") ||
    blockId.startsWith("error-page-")
  ) {
    return "dashboard";
  }

  throw new Error(`No surface template class for governed block: ${blockId}`);
}

function slotKeyFromSlotId(slotId: string): string {
  const segments = slotId.split(".");

  if (segments.length <= 1) {
    return slotId;
  }

  const [, ...rest] = segments;

  return rest.reduce<string>(
    (key, segment, index) =>
      index === 0
        ? segment
        : `${key}${segment.charAt(0).toUpperCase()}${segment.slice(1)}`,
    ""
  );
}

export function buildSlotMapFromRegistry(
  blockId: string
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    getBlockSlotsForBlockId(blockId).map((entry) => [
      slotKeyFromSlotId(entry.slotId),
      entry.slotId,
    ])
  );
}

export function buildBlockMetadata(blockId: string): BlockMetadata {
  if (
    !GOVERNED_BLOCK_CONTRACT_IDS.includes(
      blockId as (typeof GOVERNED_BLOCK_CONTRACT_IDS)[number]
    )
  ) {
    throw new Error(`Expected governed block id, received ${blockId}`);
  }

  const acceptanceRecordId = resolveGovernedBlockAcceptanceRecordId(blockId);

  return {
    blockDataContractId: `block-data-contract:${blockId}`,
    blockId,
    slots: buildSlotMapFromRegistry(blockId),
    surfaceTemplateClass: resolveSurfaceTemplateClass(blockId),
    version: BLOCK_METADATA_VERSION,
    acceptanceRecordId,
  } as const;
}

export function buildGovernedBlockMetadataRegistry(): readonly BlockMetadata[] {
  return GOVERNED_BLOCK_CONTRACT_IDS.map((blockId) =>
    buildBlockMetadata(blockId)
  );
}
