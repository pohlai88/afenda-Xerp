import { describe, expect, it } from "vitest";

import {
  isStockMovementType,
  STOCK_MOVEMENT_TYPES,
} from "../stock.contract.js";

describe("stock.contract", () => {
  it("exports movement type literals", () => {
    expect(STOCK_MOVEMENT_TYPES).toEqual(["receipt", "issue", "adjustment"]);
  });

  it("narrows movement type strings", () => {
    expect(isStockMovementType("receipt")).toBe(true);
    expect(isStockMovementType("transfer")).toBe(false);
  });
});
