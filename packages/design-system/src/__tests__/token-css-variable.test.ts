import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { tokenNameToCssVariable } from "../css/token-css-variable.js";
import { tokenRegistry } from "../tokens/registry.js";

describe("tokenNameToCssVariable", () => {
  it("maps dotted token names to dashed CSS custom properties", () => {
    expect(tokenNameToCssVariable("color.surface.canvas")).toBe(
      "--token-color-surface-canvas",
    );
  });

  it("produces unique variables for every registry token", () => {
    const variables = tokenRegistry.tokens.map((token) =>
      tokenNameToCssVariable(token.name),
    );

    expect(new Set(variables).size).toBe(tokenRegistry.tokens.length);
  });

  it("keeps generated tokens.css aligned with the registry", () => {
    const cssPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "../../dist/css/tokens.css",
    );

    if (!existsSync(cssPath)) {
      throw new Error(
        `dist/css/tokens.css not found. Run 'pnpm --filter @afenda/design-system build' before this test.`,
      );
    }

    const css = readFileSync(cssPath, "utf8");

    for (const token of tokenRegistry.tokens) {
      const variable = tokenNameToCssVariable(token.name);
      expect(css).toContain(`${variable}: ${token.value};`);
    }
  });
});
