import {
  BLOCK_CONTRACT_VERSION,
  type BlockContractMetadata,
} from "../block-governance.contract.js";

export const ACCOUNT_SETTINGS_01_BLOCK_ID = "account-settings-01" as const;

export const ACCOUNT_SETTINGS_01_SLOTS = {
  avatar: "profile.avatar",
  displayName: "profile.displayName",
  displayNameHelp: "profile.displayName.help",
  email: "profile.email",
  emailHelp: "profile.email.help",
  save: "profile.save",
} as const;

export function accountSettings01BlockMetadata(): BlockContractMetadata {
  return {
    acceptanceRecordId: "acceptance-record:account-settings-01",
    blockDataContractId: "block-data-contract:account-settings-01",
    blockId: ACCOUNT_SETTINGS_01_BLOCK_ID,
    slots: ACCOUNT_SETTINGS_01_SLOTS,
    surfaceTemplateClass: "settings",
    version: BLOCK_CONTRACT_VERSION,
  } as const;
}
