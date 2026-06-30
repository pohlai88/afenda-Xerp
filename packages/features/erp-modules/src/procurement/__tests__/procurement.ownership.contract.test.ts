import { PROCUREMENT_FOUNDATION_BUNDLE } from "@afenda/erp-module-foundation";
import { describe, expect, it } from "vitest";

import {
  PROCUREMENT_OWNERSHIP_ATTESTATION,
  PROCUREMENT_OWNERSHIP_CONTRACT,
  PROCUREMENT_OWNERSHIP_MATRIX,
  PROCUREMENT_OWNERSHIP_SLICE_ID,
  PROCUREMENT_OWNERSHIP_STATUS,
} from "../procurement.ownership.contract.js";

describe("procurement.ownership.contract (ERP-PROC-OP-002)", () => {
  it("declares ERP-PROC-OP-002 adr_locked attestation", () => {
    expect(PROCUREMENT_OWNERSHIP_SLICE_ID).toBe("ERP-PROC-OP-002");
    expect(PROCUREMENT_OWNERSHIP_STATUS).toBe("adr_locked");
    expect(PROCUREMENT_OWNERSHIP_ATTESTATION.sliceId).toBe("ERP-PROC-OP-002");
    expect(PROCUREMENT_OWNERSHIP_ATTESTATION.status).toBe("adr_locked");
    expect(PROCUREMENT_OWNERSHIP_ATTESTATION.operationalFilesystem).toBe(
      "packages/features/erp-modules/src/procurement/"
    );
    expect(PROCUREMENT_OWNERSHIP_ATTESTATION.registryReservation).toBe(
      "@afenda/procurement"
    );
  });

  it("matches PROCUREMENT_FOUNDATION_BUNDLE.ownership on all eight surfaces", () => {
    const bundleOwnership = PROCUREMENT_FOUNDATION_BUNDLE.ownership;

    expect(PROCUREMENT_OWNERSHIP_CONTRACT).toEqual(bundleOwnership);
  });

  it("extends matrix with PAS-001 supplierIdentity row", () => {
    expect(PROCUREMENT_OWNERSHIP_MATRIX.supplierIdentity).toBe(
      "PAS-001 business-reference (SupplierId, supplier_no)"
    );
    expect(PROCUREMENT_OWNERSHIP_MATRIX.wireVocabulary).toBe(
      PROCUREMENT_OWNERSHIP_CONTRACT.wireVocabulary
    );
    expect(PROCUREMENT_OWNERSHIP_MATRIX.runtimeBehavior).toBe(
      PROCUREMENT_OWNERSHIP_CONTRACT.runtimeBehavior
    );
  });
});
