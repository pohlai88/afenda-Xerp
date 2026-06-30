/**
 * PAS-006 Phase 3 — aggregated block contract metadata for template-bound blocks.
 */

import type { BlockContractMetadata } from "../contracts/block-governance.contract.js";
import { accountSettings01BlockMetadata } from "../contracts/blocks/account-settings-01.block.contract.js";
import { datatableInvoiceBlockMetadata } from "../contracts/blocks/datatable-invoice.block.contract.js";
import { datatableProductBlockMetadata } from "../contracts/blocks/datatable-product.block.contract.js";
import { datatableUserBlockMetadata } from "../contracts/blocks/datatable-user.block.contract.js";
import { dialogActivityBlockMetadata } from "../contracts/blocks/dialog-activity.block.contract.js";
import { heroSection01BlockMetadata } from "../contracts/blocks/hero-section-01.block.contract.js";
import { loginPage04BlockMetadata } from "../contracts/blocks/login-page-04.block.contract.js";
import { statisticsCard01BlockMetadata } from "../contracts/blocks/statistics-card-01.block.contract.js";
import { GOVERNED_BLOCK_CONTRACT_IDS } from "../registry/block-slot.registry.js";

export const BLOCK_METADATA_REGISTRY: readonly BlockContractMetadata[] = [
  loginPage04BlockMetadata(),
  heroSection01BlockMetadata(),
  statisticsCard01BlockMetadata(),
  accountSettings01BlockMetadata(),
  datatableInvoiceBlockMetadata(),
  datatableUserBlockMetadata(),
  datatableProductBlockMetadata(),
  dialogActivityBlockMetadata(),
] as const;

export function getBlockMetadataById(
  blockId: string,
  registry: readonly BlockContractMetadata[] = BLOCK_METADATA_REGISTRY
): BlockContractMetadata | undefined {
  return registry.find((entry) => entry.blockId === blockId);
}

export function assertBlockMetadataRegistryComplete(
  registry: readonly BlockContractMetadata[] = BLOCK_METADATA_REGISTRY
): boolean {
  return GOVERNED_BLOCK_CONTRACT_IDS.every((blockId) =>
    registry.some((entry) => entry.blockId === blockId)
  );
}
