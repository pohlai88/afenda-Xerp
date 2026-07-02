import { describe, expect, it } from "vitest";

import {
  PRIMITIVE_CONTRACT_VERSION,
  SONNER_PRIMITIVE_ID,
  SONNER_SLOTS,
  sonnerPrimitiveMetadata,
  sonnerRootClassName,
  sonnerToastClassName,
} from "../../components-ui/sonner.contract.js";

describe("sonner primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SONNER_PRIMITIVE_ID for metadata registries", () => {
    expect(SONNER_PRIMITIVE_ID).toBe("shadcn-studio.ui.sonner");
  });

  it("exports SONNER_SLOTS", () => {
    expect(SONNER_SLOTS).toEqual({
      root: "toaster",
      toast: "toast",
    });
  });

  it("exports governed class constants", () => {
    expect(sonnerRootClassName).toBe("toaster group");
    expect(sonnerToastClassName).toBe("cn-toast");
  });

  it("sonnerPrimitiveMetadata is JSON-serializable", () => {
    const payload = sonnerPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
    expect(payload.vendorNotes).toBe("sonner");
  });
});
