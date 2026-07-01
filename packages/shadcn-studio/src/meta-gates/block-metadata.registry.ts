/**
 * @afenda.governance-envelope block-metadata
 * Role: Runtime aggregator — BLOCK_METADATA_REGISTRY from registry/block-slot
 * Family: block-metadata
 * Relies on: contracts/block-metadata.builders, contracts/block-metadata.contract, registry/block-slot.registry
 * Relied on by: governance/index, check:studio-block-contracts, blocks metadata render tests
 * Refactored: 2026-07-01 · series flat-governance
 * Gate: check:studio-governance-envelope
 */

import {
  buildGovernedBlockMetadataRegistry,
  buildBlockMetadata,
} from "../meta-contracts/block-metadata.builders.js";
import type { BlockMetadata } from "../meta-contracts/block-metadata.contract.js";
import { GOVERNED_BLOCK_CONTRACT_IDS } from "../meta-registry/block-slot.registry.js";

export type { BlockMetadata, BlockContractMetadata } from "../meta-contracts/block-metadata.contract.js";

export const BLOCK_METADATA_REGISTRY: readonly BlockMetadata[] =
  buildGovernedBlockMetadataRegistry();

export function getBlockMetadataById(
  blockId: string,
  registry: readonly BlockMetadata[] = BLOCK_METADATA_REGISTRY
): BlockMetadata | undefined {
  return registry.find((entry) => entry.blockId === blockId);
}

export type BlockMetadataRegistryDiff = {
  readonly registeredCount: number;
  readonly expectedCount: number;
  readonly missingBlockIds: readonly string[];
  readonly extraBlockIds: readonly string[];
};

export function diffBlockMetadataRegistry(
  registry: readonly BlockMetadata[] = BLOCK_METADATA_REGISTRY
): BlockMetadataRegistryDiff {
  const registeredIds = registry.map((entry) => entry.blockId);
  const registeredSet = new Set<string>(registeredIds);
  const expectedSet = new Set<string>(GOVERNED_BLOCK_CONTRACT_IDS);

  return {
    registeredCount: registeredIds.length,
    expectedCount: GOVERNED_BLOCK_CONTRACT_IDS.length,
    missingBlockIds: GOVERNED_BLOCK_CONTRACT_IDS.filter(
      (blockId) => !registeredSet.has(blockId)
    ),
    extraBlockIds: registeredIds.filter((blockId) => !expectedSet.has(blockId)),
  };
}

export function formatBlockMetadataRegistryDiff(
  diff: BlockMetadataRegistryDiff
): string {
  const lines = [
    `registered=${diff.registeredCount} expected=${diff.expectedCount}`,
  ];

  if (diff.missingBlockIds.length > 0) {
    lines.push(`missing block ids: ${diff.missingBlockIds.join(", ")}`);
  }

  if (diff.extraBlockIds.length > 0) {
    lines.push(`extra block ids: ${diff.extraBlockIds.join(", ")}`);
  }

  return lines.join(" · ");
}

export function assertBlockMetadataRegistryComplete(
  registry: readonly BlockMetadata[] = BLOCK_METADATA_REGISTRY
): boolean {
  const diff = diffBlockMetadataRegistry(registry);

  return (
    diff.registeredCount === diff.expectedCount &&
    diff.missingBlockIds.length === 0 &&
    diff.extraBlockIds.length === 0
  );
}

export function assertBlockMetadataRegistryCompleteOrThrow(
  registry: readonly BlockMetadata[] = BLOCK_METADATA_REGISTRY
): void {
  const diff = diffBlockMetadataRegistry(registry);

  if (!assertBlockMetadataRegistryComplete(registry)) {
    throw new Error(
      `block metadata registry incomplete: ${formatBlockMetadataRegistryDiff(diff)}`
    );
  }
}

export { buildBlockMetadata };
