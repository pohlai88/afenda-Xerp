import type { WarehouseAuthorityRecord } from "@afenda/database";
import type { WarehouseWireReference } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

/**
 * PAS-001-AUD-05 P4 — ERP integration attestation: database read model ↔ kernel wire reference.
 *
 * Lives in apps/erp (not @afenda/database) so persistence layer does not depend on @afenda/kernel.
 */
describe("warehouse kernel wire consumer attestation (PAS-001-AUD-05 P4)", () => {
  it("aligns database authority record fields with kernel WarehouseWireReference", () => {
    const wire: WarehouseWireReference = {
      tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      warehouseId: "whs_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      warehouseCode: "WH-001",
    };

    const record: WarehouseAuthorityRecord = {
      tenantId: wire.tenantId,
      companyId: wire.companyId,
      warehouseId: wire.warehouseId,
      warehouseCode: wire.warehouseCode,
      displayName: "Main warehouse",
      status: "active",
    };

    expect(record.tenantId).toBe(wire.tenantId);
    expect(record.companyId).toBe(wire.companyId);
    expect(record.warehouseId).toBe(wire.warehouseId);
    expect(record.warehouseCode).toBe(wire.warehouseCode);
  });
});
