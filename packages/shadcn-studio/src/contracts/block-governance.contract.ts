/**
 * PAS-006 Phase 3 — block governance contract vocabulary (blocks lane SSOT).
 */

import type { SurfaceTemplateClass } from "./surface-template.contract.js";

export const BLOCK_CONTRACT_VERSION = "1.0.0" as const;

export type BlockContractMetadata = {
  readonly acceptanceRecordId?: string;
  readonly blockDataContractId: string;
  readonly blockId: string;
  readonly slots: Readonly<Record<string, string>>;
  readonly surfaceTemplateClass: SurfaceTemplateClass;
  readonly version: typeof BLOCK_CONTRACT_VERSION;
};

export type BlockContractMetadataFactory = () => BlockContractMetadata;
