import { describe, expect, it } from "vitest";

import {
  mapStockButtonProps,
  mapStockButtonSize,
  mapStockButtonVisualToGoverned,
} from "../../governance/stock-shadcn-compat";

describe("stock shadcn button compatibility", () => {
  it("maps default visual to primary solid", () => {
    expect(mapStockButtonVisualToGoverned("default")).toEqual({
      intent: "primary",
      emphasis: "solid",
      size: "md",
    });
  });

  it("maps destructive visual to destructive solid", () => {
    expect(mapStockButtonVisualToGoverned("destructive")).toEqual({
      intent: "destructive",
      emphasis: "solid",
      size: "md",
    });
  });

  it("maps icon size to governed icon presentation", () => {
    expect(mapStockButtonSize("icon-sm")).toEqual({
      size: "sm",
      presentation: "icon",
    });
  });

  it("combines visual and size mappings", () => {
    expect(mapStockButtonProps("outline", "icon-lg")).toEqual({
      intent: "primary",
      emphasis: "outline",
      size: "lg",
      presentation: "icon",
    });
  });

  it("maps stock link to governed primary ghost", () => {
    expect(mapStockButtonProps("link")).toEqual({
      intent: "primary",
      emphasis: "ghost",
      size: "md",
      presentation: "default",
    });
  });

  it("defaults visual and size when omitted", () => {
    expect(mapStockButtonProps()).toEqual({
      intent: "primary",
      emphasis: "solid",
      size: "md",
      presentation: "default",
    });
  });
});
