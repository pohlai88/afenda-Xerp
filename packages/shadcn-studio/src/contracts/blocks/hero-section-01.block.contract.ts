import {
  BLOCK_CONTRACT_VERSION,
  type BlockContractMetadata,
} from "../block-governance.contract.js";

export const HERO_SECTION_01_BLOCK_ID = "hero-section-01" as const;

export const HERO_SECTION_01_SLOTS = {
  title: "hero.title",
  subtitle: "hero.subtitle",
  cta: "hero.cta",
} as const;

export function heroSection01BlockMetadata(): BlockContractMetadata {
  return {
    acceptanceRecordId: "acceptance-record:hero-section-01",
    blockDataContractId: "block-data-contract:hero-section-01",
    blockId: HERO_SECTION_01_BLOCK_ID,
    slots: HERO_SECTION_01_SLOTS,
    surfaceTemplateClass: "dashboard",
    version: BLOCK_CONTRACT_VERSION,
  } as const;
}
