import { describe, expect, it } from "vitest";

import {
  applyThemePresetStyles,
  clearThemePresetStyles,
  resolveColorMode,
} from "../theme/apply-theme-preset.js";
import {
  assertThemePresetSlug,
  isThemeFont,
  isThemePresetSlug,
  NAMED_THEME_PRESET_SLUGS,
  PRESET_CSS_VARS,
  THEME_FONTS,
  THEME_PRESET_SLUGS,
} from "../theme/theme-preset.contract.js";
import { themePresets } from "../theme/theme-presets.js";

describe("theme preset registry", () => {
  it("exports all typed preset slugs including default", () => {
    expect(THEME_PRESET_SLUGS).toEqual([
      "default",
      "caffeine",
      "claude",
      "corporate",
      "ghibli-studio",
      "marvel",
      "material-design",
      "modern-minimal",
      "nature",
      "perplexity",
      "slack",
      "pastel-dreams",
    ]);
  });

  it("registers eleven named presets with light and dark maps", () => {
    expect(NAMED_THEME_PRESET_SLUGS).toHaveLength(11);

    for (const slug of NAMED_THEME_PRESET_SLUGS) {
      const preset = themePresets[slug];
      expect(preset.label.length).toBeGreaterThan(0);
      expect(Object.keys(preset.styles.light).length).toBeGreaterThan(0);
      expect(Object.keys(preset.styles.dark).length).toBeGreaterThan(0);
    }
  });

  it("accepts every typed slug", () => {
    for (const slug of THEME_PRESET_SLUGS) {
      expect(isThemePresetSlug(slug)).toBe(true);
      expect(assertThemePresetSlug(slug)).toBe(slug);
    }
  });

  it("exports theme font vocabulary", () => {
    expect(THEME_FONTS).toEqual(["geist", "inter", "system"]);
    expect(isThemeFont("geist")).toBe(true);
    expect(isThemeFont("inter")).toBe(true);
    expect(isThemeFont("system")).toBe(true);
    expect(isThemeFont("invalid")).toBe(false);
  });

  it("rejects invalid slugs fail-closed", () => {
    expect(isThemePresetSlug("not-a-preset")).toBe(false);
    expect(() => assertThemePresetSlug("not-a-preset")).toThrow(
      'Invalid theme preset slug: "not-a-preset"'
    );
  });

  it("default preset clears inline CSS variable overrides", () => {
    const root = document.createElement("html");

    applyThemePresetStyles(root, "caffeine", "light");
    expect(root.style.getPropertyValue("--primary").length).toBeGreaterThan(0);

    applyThemePresetStyles(root, "default", "light");

    for (const key of PRESET_CSS_VARS) {
      expect(root.style.getPropertyValue(`--${key}`)).toBe("");
    }
  });

  it("clearThemePresetStyles removes preset overrides", () => {
    const root = document.createElement("html");

    root.style.setProperty("--primary", "oklch(0.5 0 0)");
    clearThemePresetStyles(root);
    expect(root.style.getPropertyValue("--primary")).toBe("");
  });

  it("resolveColorMode maps next-themes resolved values", () => {
    expect(resolveColorMode("dark")).toBe("dark");
    expect(resolveColorMode("light")).toBe("light");
    expect(resolveColorMode(undefined)).toBe("light");
  });

  it("does not leave stale CSS variables when switching named presets", () => {
    const root = document.createElement("html");

    applyThemePresetStyles(root, "marvel", "light");
    expect(root.style.getPropertyValue("--shadow-blur")).toBe("3px");

    applyThemePresetStyles(root, "caffeine", "light");
    expect(root.style.getPropertyValue("--shadow-blur")).toBe("");
  });
});
