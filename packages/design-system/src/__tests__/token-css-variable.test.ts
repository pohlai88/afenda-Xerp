import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { tokenNameToCssVariable } from "../contracts/token.contract";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";

describe("tokenNameToCssVariable", () => {
  it("maps afenda.* token names to --afenda-* CSS custom properties", () => {
    expect(tokenNameToCssVariable("afenda.color.surface.canvas")).toBe(
      "--afenda-color-surface-canvas"
    );
    expect(tokenNameToCssVariable("afenda.status-tone.danger.surface")).toBe(
      "--afenda-status-tone-danger-surface"
    );
    expect(tokenNameToCssVariable("afenda.radius.md")).toBe("--afenda-radius-md");
    expect(tokenNameToCssVariable("afenda.motion.duration.fast")).toBe(
      "--afenda-motion-duration-fast"
    );
  });

  it("produces unique CSS variables for every registry token", () => {
    const variables = AFENDA_TOKEN_REGISTRY.tokens.map((token) =>
      tokenNameToCssVariable(token.name)
    );
    expect(new Set(variables).size).toBe(AFENDA_TOKEN_REGISTRY.tokens.length);
  });

  it("every registry token cssVariable matches tokenNameToCssVariable(token.name)", () => {
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(token.cssVariable).toBe(tokenNameToCssVariable(token.name));
    }
  });

  it("every CSS variable starts with --afenda-", () => {
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(token.cssVariable).toMatch(/^--afenda-/);
    }
  });

  it("keeps generated tokens.css aligned with the registry (requires build)", () => {
    const cssPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "../../dist/css/tokens.css"
    );

    if (!existsSync(cssPath)) {
      // Skip — run 'pnpm --filter @afenda/design-system build' first
      return;
    }

    const css = readFileSync(cssPath, "utf8");

    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(css).toContain(`${token.cssVariable}: ${token.value};`);
    }
  });
});
