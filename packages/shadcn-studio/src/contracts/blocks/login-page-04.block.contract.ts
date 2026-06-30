import {
  BLOCK_CONTRACT_VERSION,
  type BlockContractMetadata,
} from "../block-governance.contract.js";

export const LOGIN_PAGE_04_BLOCK_ID = "login-page-04" as const;

export const LOGIN_PAGE_04_SLOTS = {
  branding: "login.branding",
  email: "login.email",
  password: "login.password",
  passwordHelp: "login.password.help",
  submit: "login.submit",
} as const;

export function loginPage04BlockMetadata(): BlockContractMetadata {
  return {
    acceptanceRecordId: "acceptance-record:login-page-04",
    blockDataContractId: "block-data-contract:login-page-04",
    blockId: LOGIN_PAGE_04_BLOCK_ID,
    slots: LOGIN_PAGE_04_SLOTS,
    surfaceTemplateClass: "form",
    version: BLOCK_CONTRACT_VERSION,
  } as const;
}
