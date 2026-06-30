import { describe, expect, it } from "vitest";

import {
  PROCUREMENT_PAS006_UI_ATTESTATION,
  PROCUREMENT_PAS006_UI_BLOCK_IDS,
  PROCUREMENT_PAS006_UI_CONTRACT,
  PROCUREMENT_PAS006_UI_SLICE_ID,
  PROCUREMENT_PAS006_UI_STATUS,
  PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE,
  PROCUREMENT_REQUISITIONS_LIST_ROUTE,
} from "../procurement.pas006-ui.contract.js";

describe("procurement.pas006-ui.contract (ERP-PROC-OP-007)", () => {
  it("declares ERP-PROC-OP-007 scaffold attestation", () => {
    expect(PROCUREMENT_PAS006_UI_SLICE_ID).toBe("ERP-PROC-OP-007");
    expect(PROCUREMENT_PAS006_UI_STATUS).toBe("scaffold_attested");
    expect(PROCUREMENT_PAS006_UI_ATTESTATION.sliceId).toBe("ERP-PROC-OP-007");
  });

  it("registers requisitions and purchase-order PAS-006 blocks", () => {
    expect(PROCUREMENT_PAS006_UI_BLOCK_IDS).toEqual([
      "datatable-procurement-requisitions",
      "datatable-procurement-purchase-orders",
    ]);
    expect(PROCUREMENT_PAS006_UI_CONTRACT.blockIds).toHaveLength(2);
  });

  it("declares fixture-backed list routes with deferred permission enforcement", () => {
    expect(PROCUREMENT_REQUISITIONS_LIST_ROUTE.dataSource).toBe("fixture");
    expect(PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE.dataSource).toBe("fixture");
    expect(PROCUREMENT_PAS006_UI_CONTRACT.permissionEnforcement).toBe(
      "deferred"
    );
    expect(PROCUREMENT_PAS006_UI_CONTRACT.databaseBackedLists).toBe(false);
    expect(PROCUREMENT_PAS006_UI_CONTRACT.routes).toHaveLength(2);
  });
});
