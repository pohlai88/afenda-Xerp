import { describe, expect, it } from "vitest";

import { InvalidMasterDataNaturalKeyError } from "../../master-data/master-data-natural-key.js";
import {
  buildWarehouseInsertRow,
  buildWarehouseUpdatePatch,
} from "../../warehouse/warehouse.contract.js";
import {
  buildProductInsertRow,
  buildProductUpdatePatch,
} from "../product.contract.js";

describe("product.contract", () => {
  it("builds insert rows with normalized SKU and display name", () => {
    expect(
      buildProductInsertRow({
        tenantId: "tenant-1",
        sku: " SKU-001 ",
        displayName: "  Widget  ",
      })
    ).toEqual({
      tenantId: "tenant-1",
      sku: "SKU-001",
      displayName: "Widget",
      status: "draft",
    });
  });

  it("rejects invalid SKU values", () => {
    expect(() =>
      buildProductInsertRow({
        tenantId: "tenant-1",
        sku: "bad sku",
        displayName: "Widget",
      })
    ).toThrow(InvalidMasterDataNaturalKeyError);
  });

  it("builds partial update patches", () => {
    expect(buildProductUpdatePatch({ displayName: " Updated " })).toEqual({
      displayName: "Updated",
    });
  });
});

describe("warehouse.contract", () => {
  it("builds insert rows with normalized warehouse code", () => {
    expect(
      buildWarehouseInsertRow({
        tenantId: "tenant-1",
        companyId: "company-1",
        warehouseCode: " WH-MAIN ",
        displayName: " Main ",
      })
    ).toEqual({
      tenantId: "tenant-1",
      companyId: "company-1",
      warehouseCode: "WH-MAIN",
      displayName: "Main",
      status: "draft",
    });
  });

  it("builds partial update patches", () => {
    expect(buildWarehouseUpdatePatch({ status: "active" })).toEqual({
      status: "active",
    });
  });
});
