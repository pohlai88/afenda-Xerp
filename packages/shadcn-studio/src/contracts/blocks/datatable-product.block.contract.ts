import {
  buildDatatableBlockMetadata,
  DATATABLE_BLOCK_SLOTS,
} from "./datatable-block.contract.js";

export const DATATABLE_PRODUCT_BLOCK_ID = "datatable-product" as const;

export const DATATABLE_PRODUCT_SLOTS = DATATABLE_BLOCK_SLOTS;

export function datatableProductBlockMetadata() {
  return buildDatatableBlockMetadata(DATATABLE_PRODUCT_BLOCK_ID);
}
