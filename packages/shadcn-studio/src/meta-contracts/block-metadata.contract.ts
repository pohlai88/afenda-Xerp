/**
 * @afenda.l1-contract-envelope block-metadata
 * Role: BlockMetadata wire shape + BLOCK_METADATA_VERSION
 * Family: block-metadata · flat L1 wire (replaced contracts/blocks/*)
 * Relies on: surface-template.contract
 * Relied on by: block-metadata.builders, governance/block-metadata.registry
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
 */

import type { SurfaceTemplateClass } from "./surface-template.contract.js";

export const BLOCK_METADATA_VERSION = "1.0.0" as const;

export type BlockMetadata = {
  readonly acceptanceRecordId?: string;
  readonly blockDataContractId: string;
  readonly blockId: string;
  readonly slots: Readonly<Record<string, string>>;
  readonly surfaceTemplateClass: SurfaceTemplateClass;
  readonly version: typeof BLOCK_METADATA_VERSION;
};

/** @deprecated Use BlockMetadata — kept for existing governance imports. */
export type BlockContractMetadata = BlockMetadata;

/** @deprecated Use BlockMetadata factory naming in block-metadata.builders.ts. */
export type BlockContractMetadataFactory = () => BlockMetadata;
