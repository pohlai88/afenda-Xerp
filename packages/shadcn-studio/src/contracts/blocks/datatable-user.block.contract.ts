import {
  buildDatatableBlockMetadata,
  DATATABLE_BLOCK_SLOTS,
} from "./datatable-block.contract.js";

export const DATATABLE_USER_BLOCK_ID = "datatable-user" as const;

export const DATATABLE_USER_SLOTS = DATATABLE_BLOCK_SLOTS;

export function datatableUserBlockMetadata() {
  return buildDatatableBlockMetadata(DATATABLE_USER_BLOCK_ID);
}
