import { describe, expect, it } from "vitest";

import {
  BLOCK_SLOT_REGISTRY,
  getBlockDataContractForBlockId,
  getBlockSlotsForBlockId,
} from "../registry/block-slot.registry.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "../registry/studio-block-parity.registry.js";

describe("block slot registry (PAS-006B P06-003)", () => {
  it("covers every seeded parity block with at least one slot", () => {
    expect(() => JSON.stringify(BLOCK_SLOT_REGISTRY)).not.toThrow();

    for (const parity of SHADCN_STUDIO_BLOCK_PARITY_REGISTRY) {
      const slots = getBlockSlotsForBlockId(parity.mcpBlockId);
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.every((slot) => slot.blockId === parity.mcpBlockId)).toBe(
        true
      );
    }
  });

  it("applies family slot templates to non-primary MCP blocks", () => {
    expect(
      getBlockSlotsForBlockId("statistics-card-03").map((slot) => slot.slotId)
    ).toEqual(["metric.label", "metric.value", "metric.change"]);
    expect(
      getBlockSlotsForBlockId("widget-total-earning").length
    ).toBeGreaterThanOrEqual(3);
    expect(
      getBlockSlotsForBlockId("chart-earning-report").length
    ).toBeGreaterThanOrEqual(3);
    expect(
      getBlockSlotsForBlockId("account-settings-05").length
    ).toBeGreaterThanOrEqual(4);
  });

  it("uses stable slot ids for login-page-04", () => {
    const slots = getBlockSlotsForBlockId("login-page-04");
    expect(slots.map((slot) => slot.slotId)).toEqual([
      "login.branding",
      "login.email",
      "login.password",
      "login.submit",
    ]);
  });

  it("links block data contract fields to registered slot ids", () => {
    for (const parity of SHADCN_STUDIO_BLOCK_PARITY_REGISTRY) {
      const contract = getBlockDataContractForBlockId(parity.mcpBlockId);
      expect(contract).toBeDefined();

      const slotIds = new Set(
        getBlockSlotsForBlockId(parity.mcpBlockId).map((slot) => slot.slotId)
      );

      for (const field of contract?.fields ?? []) {
        expect(slotIds.has(field.slotId)).toBe(true);
      }

      for (const action of contract?.actions ?? []) {
        expect(slotIds.has(action.slotId)).toBe(true);
      }
    }
  });
});
