import {
  buildDatatableBlockMetadata,
  DATATABLE_BLOCK_SLOTS,
} from "./datatable-block.contract.js";

export const DATATABLE_INVOICE_BLOCK_ID = "datatable-invoice" as const;

export const DATATABLE_INVOICE_SLOTS = DATATABLE_BLOCK_SLOTS;

export function datatableInvoiceBlockMetadata() {
  return buildDatatableBlockMetadata(DATATABLE_INVOICE_BLOCK_ID, {
    acceptanceRecordId: "acceptance-record:datatable-invoice",
  });
}
