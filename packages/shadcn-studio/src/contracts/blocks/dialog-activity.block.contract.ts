import {
  BLOCK_CONTRACT_VERSION,
  type BlockContractMetadata,
} from "../block-governance.contract.js";

export const DIALOG_ACTIVITY_BLOCK_ID = "dialog-activity" as const;

export const DIALOG_ACTIVITY_SLOTS = {
  header: "dialog.header",
  body: "dialog.body",
  footer: "dialog.footer",
} as const;

export function dialogActivityBlockMetadata(): BlockContractMetadata {
  return {
    blockDataContractId: "block-data-contract:dialog-activity",
    blockId: DIALOG_ACTIVITY_BLOCK_ID,
    slots: DIALOG_ACTIVITY_SLOTS,
    surfaceTemplateClass: "form",
    version: BLOCK_CONTRACT_VERSION,
  } as const;
}
