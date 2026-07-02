import { describe, expect, it } from "vitest";

import { initialSettings } from "../theme/settings.contract.js";
import { parseStoredSettings } from "../theme/settings-storage.js";

describe("settings storage boundary", () => {
  it("parses valid persisted settings", () => {
    const parsed = parseStoredSettings(
      JSON.stringify({
        mode: "dark",
        themePreset: "caffeine",
        font: "inter",
        radius: "lg",
        scale: "sm",
        layout: "compact",
        sidebarVariant: "floating",
        sidebarCollapsible: "offcanvas",
        sidebarOpen: false,
      })
    );

    expect(parsed).toEqual({
      mode: "dark",
      themePreset: "caffeine",
      font: "inter",
      radius: "lg",
      scale: "sm",
      layout: "compact",
      sidebarVariant: "floating",
      sidebarCollapsible: "offcanvas",
      sidebarOpen: false,
    });
  });

  it("ignores invalid keys fail-closed", () => {
    const parsed = parseStoredSettings(
      JSON.stringify({
        mode: "invalid-mode",
        themePreset: "not-a-preset",
        radius: "xl",
        layout: "wide",
        sidebarOpen: "yes",
        extra: "ignored",
      })
    );

    expect(parsed).toEqual({});
  });

  it("returns null for malformed JSON", () => {
    expect(parseStoredSettings("{not-json")).toBeNull();
    expect(parseStoredSettings("null")).toBeNull();
  });

  it("round-trips initial settings shape", () => {
    const parsed = parseStoredSettings(JSON.stringify(initialSettings));

    expect(parsed).toEqual(initialSettings);
  });
});
