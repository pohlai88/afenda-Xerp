import { describe, expect, it } from "vitest";
import { THEME_FONTS } from "../theme-config/config.preset.contract.js";
import {
  syncThemeFontAttribute,
  THEME_FONT_LABELS,
  THEME_FONT_STACKS,
} from "../theme-runtime/theme-runtime.font-attribute.js";

describe("theme font stacks", () => {
  it("defines a stack for every theme font slug", () => {
    for (const font of THEME_FONTS) {
      expect(THEME_FONT_STACKS[font].sans.length).toBeGreaterThan(0);
      expect(THEME_FONT_STACKS[font].mono.length).toBeGreaterThan(0);
      expect(THEME_FONT_STACKS[font].heading.length).toBeGreaterThan(0);
      expect(THEME_FONT_LABELS[font].length).toBeGreaterThan(0);
    }
  });

  it("syncThemeFontAttribute sets data-theme-font on html", () => {
    const root = document.createElement("html");

    syncThemeFontAttribute(root, "inter");
    expect(root.getAttribute("data-theme-font")).toBe("inter");

    syncThemeFontAttribute(root, "system");
    expect(root.getAttribute("data-theme-font")).toBe("system");
  });

  it("serializes font metadata for inventory gates", () => {
    expect(() => JSON.stringify(THEME_FONT_STACKS)).not.toThrow();
    expect(() => JSON.stringify(THEME_FONT_LABELS)).not.toThrow();
  });
});
