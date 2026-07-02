/**
 * @afenda.registry-inventory acceptance-record
 * Role: Sealed AcceptanceRecordWire payloads for governed block contracts
 * Family: acceptance-record
 * Relies on: acceptance-record.contract, block-metadata.builders, block-slot.registry
 * Relied on by: src/__tests__/acceptance-record.registry.test, index barrel
 * Refactored: 2026-07-02 · series flat-L1-registry
 * Gate: check:studio-block-acpa-acceptance
 */

import type { AcceptanceRecordWire } from "../meta-contracts/acceptance-record.contract.js";
import { validateAcceptanceRecordSeal } from "../meta-contracts/acceptance-record.validator.js";
import { resolveGovernedBlockAcceptanceRecordId } from "../meta-contracts/block-metadata.builders.js";
import {
  GOVERNED_BLOCK_CONTRACT_IDS,
  type GovernedBlockContractId,
} from "./block-slot.registry.js";

export const ACPA_PROFILE_VERSION = "acpa-2026-06" as const;

export const ACCEPTANCE_RECORD_SEALED_BY = "role:presentation-steward" as const;

export const ACCEPTANCE_RECORD_SEALED_AT = "2026-07-02T00:00:00.000Z" as const;

const DEFAULT_CRITERIA_RESULTS = {
  "lab-story": "pass",
  keyboard: "pass",
  acpa: "pass",
} as const;

const WCAG_AA_AUTH_ADJACENT_BLOCK_IDS = new Set<GovernedBlockContractId>([
  "login-page-04",
]);

function presentationLabProofForBlock(
  blockId: GovernedBlockContractId
): string {
  return `storybook:shadcn-studio-${blockId}`;
}

function buildSealedAcceptanceRecord(
  blockId: GovernedBlockContractId
): AcceptanceRecordWire {
  return {
    acceptanceRecordId: resolveGovernedBlockAcceptanceRecordId(blockId),
    acpaProfileVersion: ACPA_PROFILE_VERSION,
    blockId,
    criteriaResults: { ...DEFAULT_CRITERIA_RESULTS },
    lifecycleStateAtSeal: "accepted",
    presentationLabProof: presentationLabProofForBlock(blockId),
    sealedAt: ACCEPTANCE_RECORD_SEALED_AT,
    sealedBy: ACCEPTANCE_RECORD_SEALED_BY,
    wcagAaAuthAdjacent: WCAG_AA_AUTH_ADJACENT_BLOCK_IDS.has(blockId),
  };
}

export const ACCEPTANCE_RECORD_REGISTRY: Readonly<
  Record<string, AcceptanceRecordWire>
> = Object.fromEntries(
  GOVERNED_BLOCK_CONTRACT_IDS.map((blockId) => [
    resolveGovernedBlockAcceptanceRecordId(blockId),
    buildSealedAcceptanceRecord(blockId),
  ])
);

export function getAcceptanceRecordById(
  acceptanceRecordId: string
): AcceptanceRecordWire | undefined {
  return ACCEPTANCE_RECORD_REGISTRY[acceptanceRecordId];
}

export function getAcceptanceRecordByBlockId(
  blockId: GovernedBlockContractId
): AcceptanceRecordWire {
  const record =
    ACCEPTANCE_RECORD_REGISTRY[resolveGovernedBlockAcceptanceRecordId(blockId)];

  if (record === undefined) {
    throw new Error(`Missing acceptance record for block: ${blockId}`);
  }

  return record;
}

export function listAcceptanceRecordIds(): readonly string[] {
  return Object.keys(ACCEPTANCE_RECORD_REGISTRY).sort();
}

export function assertAllAcceptanceRecordsSealed(): void {
  for (const blockId of GOVERNED_BLOCK_CONTRACT_IDS) {
    const record = getAcceptanceRecordByBlockId(blockId);
    const result = validateAcceptanceRecordSeal(record);

    if (!result.ok) {
      throw new Error(
        `Acceptance record seal failed for ${blockId}: ${result.code}`
      );
    }
  }
}
