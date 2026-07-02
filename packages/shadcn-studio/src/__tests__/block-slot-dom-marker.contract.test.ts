import { describe, expect, it } from "vitest";

import {
  AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
  blockSlotDomMarkerProps,
} from "../meta-contracts/block-slot-dom-marker.contract.js";

describe("block slot DOM marker contract (P06-008-R2)", () => {
  it("emits the canonical data attribute", () => {
    expect(blockSlotDomMarkerProps("hero.title")).toEqual({
      [AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE]: "hero.title",
    });
  });

  it("is JSON-serializable", () => {
    const marker = blockSlotDomMarkerProps("profile.displayName");
    expect(() => JSON.stringify(marker)).not.toThrow();
    expect(JSON.parse(JSON.stringify(marker))).toEqual(marker);
  });
});
