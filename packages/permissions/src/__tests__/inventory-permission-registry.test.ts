import { describe, expect, it } from "vitest";

import { PERMISSION_REGISTRY } from "../grants/permission.contract.js";

/**
 * Keep aligned with kernel INVENTORY_PERMISSION_KEY_VOCABULARY
 * (`@afenda/kernel/erp-domain/inventory`). No cross-package import.
 */
const EXPECTED_INVENTORY_WIRE_PERMISSION_KEYS = [
  "inventory.product_read",
  "inventory.product_manage",
  "inventory.warehouse_read",
  "inventory.warehouse_manage",
  "inventory.stock_movement_read",
  "inventory.stock_movement_post",
  "inventory.stock_movement_cancel",
  "inventory.stock_reservation_read",
  "inventory.stock_reservation_reserve",
  "inventory.stock_reservation_fulfill",
  "inventory.stock_reservation_cancel",
] as const;

describe("inventory permission registry parity", () => {
  it("registers product, warehouse, stockMovement, and stockReservation domains", () => {
    expect(PERMISSION_REGISTRY.inventory.product.read).toBe(
      "inventory.product_read"
    );
    expect(PERMISSION_REGISTRY.inventory.product.manage).toBe(
      "inventory.product_manage"
    );
    expect(PERMISSION_REGISTRY.inventory.warehouse.read).toBe(
      "inventory.warehouse_read"
    );
    expect(PERMISSION_REGISTRY.inventory.warehouse.manage).toBe(
      "inventory.warehouse_manage"
    );
    expect(PERMISSION_REGISTRY.inventory.stockMovement.read).toBe(
      "inventory.stock_movement_read"
    );
    expect(PERMISSION_REGISTRY.inventory.stockMovement.post).toBe(
      "inventory.stock_movement_post"
    );
    expect(PERMISSION_REGISTRY.inventory.stockMovement.cancel).toBe(
      "inventory.stock_movement_cancel"
    );
    expect(PERMISSION_REGISTRY.inventory.stockReservation.read).toBe(
      "inventory.stock_reservation_read"
    );
    expect(PERMISSION_REGISTRY.inventory.stockReservation.reserve).toBe(
      "inventory.stock_reservation_reserve"
    );
    expect(PERMISSION_REGISTRY.inventory.stockReservation.fulfill).toBe(
      "inventory.stock_reservation_fulfill"
    );
    expect(PERMISSION_REGISTRY.inventory.stockReservation.cancel).toBe(
      "inventory.stock_reservation_cancel"
    );
  });

  it("covers every kernel wire vocabulary permission key", () => {
    const registered = new Set<string>([
      PERMISSION_REGISTRY.inventory.product.read,
      PERMISSION_REGISTRY.inventory.product.manage,
      PERMISSION_REGISTRY.inventory.warehouse.read,
      PERMISSION_REGISTRY.inventory.warehouse.manage,
      PERMISSION_REGISTRY.inventory.stockMovement.read,
      PERMISSION_REGISTRY.inventory.stockMovement.post,
      PERMISSION_REGISTRY.inventory.stockMovement.cancel,
      PERMISSION_REGISTRY.inventory.stockReservation.read,
      PERMISSION_REGISTRY.inventory.stockReservation.reserve,
      PERMISSION_REGISTRY.inventory.stockReservation.fulfill,
      PERMISSION_REGISTRY.inventory.stockReservation.cancel,
    ]);

    expect([...registered].sort()).toEqual(
      [...EXPECTED_INVENTORY_WIRE_PERMISSION_KEYS].sort()
    );
  });

  it("retains stock_adjust as a runtime API overlay outside wire vocabulary", () => {
    expect(PERMISSION_REGISTRY.inventory.stock.adjust).toBe(
      "inventory.stock_adjust"
    );
    expect(EXPECTED_INVENTORY_WIRE_PERMISSION_KEYS).not.toContain(
      PERMISSION_REGISTRY.inventory.stock.adjust
    );
  });
});
