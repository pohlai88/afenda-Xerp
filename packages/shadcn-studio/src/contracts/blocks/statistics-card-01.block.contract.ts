import {
  BLOCK_CONTRACT_VERSION,
  type BlockContractMetadata,
} from "../block-governance.contract.js";

export const STATISTICS_CARD_01_BLOCK_ID = "statistics-card-01" as const;

export const STATISTICS_CARD_01_SLOTS = {
  label: "metric.label",
  value: "metric.value",
  change: "metric.change",
} as const;

export function statisticsCard01BlockMetadata(): BlockContractMetadata {
  return {
    acceptanceRecordId: "acceptance-record:statistics-card-01",
    blockDataContractId: "block-data-contract:statistics-card-01",
    blockId: STATISTICS_CARD_01_BLOCK_ID,
    slots: STATISTICS_CARD_01_SLOTS,
    surfaceTemplateClass: "dashboard",
    version: BLOCK_CONTRACT_VERSION,
  } as const;
}
