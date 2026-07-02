import { describe, expect, it } from "vitest";

import { composeClassName } from "../../lib/compose-class-name.js";

describe("composeClassName", () => {
  it("merges string className with base", () => {
    expect(composeClassName("base", "extra")).toBe("base extra");
  });

  it("returns base when className is omitted", () => {
    expect(composeClassName("base")).toBe("base");
  });

  it("composes function className with base per state", () => {
    const composed = composeClassName<{ open: boolean }>("base", (state) =>
      state.open ? "open" : undefined
    );

    expect(typeof composed).toBe("function");
    if (typeof composed === "function") {
      expect(composed({ open: true })).toBe("base open");
      expect(composed({ open: false })).toBe("base");
    }
  });
});
