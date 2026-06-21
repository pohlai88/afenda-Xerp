import { describe, expect, it } from "vitest";
import { STATUS_TONES, TOKEN_CATEGORIES } from "../contracts/token.contract";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";
import { validateTokenRegistry } from "../validation/token.validation";

describe("token registry completeness", () => {
  it("has a single canonical registry with no duplicate names", () => {
    const names = AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.length).toBeGreaterThan(100);
  });

  it("covers all governed categories", () => {
    const categories = new Set(
      AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.category)
    );
    for (const category of TOKEN_CATEGORIES) {
      expect(categories.has(category)).toBe(true);
    }
  });

  it("passes all token validation rules", () => {
    const failures = validateTokenRegistry().filter((r) => !r.passed);
    expect(failures, failures.map((f) => f.detail).join("\n")).toHaveLength(0);
  });

  it("marks every token stable and public", () => {
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(token.stable, token.name).toBe(true);
      expect(token.public, token.name).toBe(true);
    }
  });

  it("covers all status tones with surface, foreground, border, and focus", () => {
    const tokenNames = new Set(
      AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
    );
    for (const tone of STATUS_TONES) {
      for (const variant of ["surface", "foreground", "border", "focus"]) {
        expect(tokenNames.has(`afenda.status-tone.${tone}.${variant}`)).toBe(
          true
        );
      }
    }
  });
});
