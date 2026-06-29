import { describe, expect, it } from "vitest";

import {
  type BlockDataContractWire,
  isBlockDataContractWire,
} from "../contracts/block-data-contract.js";
import {
  BLOCK_DATA_CONTRACT_REGISTRY,
  getBlockDataContractForBlockId,
} from "../registry/block-slot.registry.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "../registry/studio-block-parity.registry.js";

describe("block data contract (PAS-006B P06-003)", () => {
  it("registry contracts are JSON-serializable", () => {
    expect(() => JSON.stringify(BLOCK_DATA_CONTRACT_REGISTRY)).not.toThrow();

    for (const contract of BLOCK_DATA_CONTRACT_REGISTRY) {
      const parsed: unknown = JSON.parse(JSON.stringify(contract));
      expect(isBlockDataContractWire(parsed)).toBe(true);
    }
  });

  it("includes one contract per parity block", () => {
    expect(BLOCK_DATA_CONTRACT_REGISTRY).toHaveLength(
      SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.length
    );
  });

  it("validates wire guard rejects invalid shapes", () => {
    const sample: BlockDataContractWire = {
      blockDataContractId: "block-data-contract:hero-section-01",
      blockId: "hero-section-01",
      fields: [
        {
          fieldKey: "title",
          slotId: "hero.title",
          kind: "text",
        },
      ],
    };

    expect(isBlockDataContractWire(sample)).toBe(true);
    expect(isBlockDataContractWire({ blockId: "x" })).toBe(false);
  });

  it("exposes contract lookup by block id", () => {
    const contract = getBlockDataContractForBlockId("statistics-card-01");
    expect(contract?.blockDataContractId).toBe(
      "block-data-contract:statistics-card-01"
    );
    expect(contract?.fields.some((field) => field.fieldKey === "value")).toBe(
      true
    );
  });
});
