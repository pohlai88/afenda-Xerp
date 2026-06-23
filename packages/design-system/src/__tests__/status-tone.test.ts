import { describe, expect, it } from "vitest";
import { STATUS_TONES } from "../contracts/token.contract";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";

describe("status tone completeness", () => {
  const tokenNames = new Set(AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name));

  it("includes workflow tones: neutral, info, success, warning, danger, critical, pending", () => {
    for (const tone of [
      "neutral",
      "info",
      "success",
      "warning",
      "danger",
      "critical",
      "pending",
    ] as const) {
      expect(STATUS_TONES).toContain(tone);
    }
  });

  it("defines surface, foreground, border, focus, and solid variants per tone", () => {
    for (const tone of STATUS_TONES) {
      for (const variant of [
        "surface",
        "foreground",
        "border",
        "focus",
        "solid",
        "solid-foreground",
      ] as const) {
        expect(
          tokenNames.has(`afenda.status-tone.${tone}.${variant}`),
          `missing afenda.status-tone.${tone}.${variant}`
        ).toBe(true);
      }
    }
  });

  it("maps semantic status roles for info, success, warning, error, critical, pending", () => {
    expect(tokenNames.has("afenda.semantic.status.info.bg")).toBe(true);
    expect(tokenNames.has("afenda.semantic.status.critical.bg")).toBe(true);
    expect(tokenNames.has("afenda.semantic.status.pending.bg")).toBe(true);
  });
});
