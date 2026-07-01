import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  RESIZABLE_PRIMITIVE_ID,
  RESIZABLE_SLOTS,
  resizableHandleClassName,
  resizablePanelGroupClassName,
  resizablePrimitiveMetadata,
} from "./resizable.contract.js";
import type { ResizableHandleProps, ResizableSlot } from "./resizable.js";

describe("resizable primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports RESIZABLE_PRIMITIVE_ID for metadata registries", () => {
    expect(RESIZABLE_PRIMITIVE_ID).toBe("shadcn-studio.ui.resizable");
  });

  it("exports RESIZABLE_SLOTS", () => {
    expect(RESIZABLE_SLOTS).toEqual({
      panelGroup: "resizable-panel-group",
      panel: "resizable-panel",
      handle: "resizable-handle",
    });
  });

  it("exports governed class constants", () => {
    expect(resizablePanelGroupClassName).toContain("flex h-full");
    expect(resizableHandleClassName).toContain("bg-border");
  });

  it("resizablePrimitiveMetadata is JSON-serializable", () => {
    const payload = resizablePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
    expect(payload.vendorNotes).toBe("react-resizable-panels");
  });

  it("ResizableSlot is a governed slot literal union", () => {
    expectTypeOf<ResizableSlot>().toEqualTypeOf<
      "resizable-panel-group" | "resizable-panel" | "resizable-handle"
    >();
  });

  it("ResizableHandleProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ResizableHandleProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
