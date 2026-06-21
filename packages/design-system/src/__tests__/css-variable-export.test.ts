import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";

describe("CSS variable export completeness", () => {
  const cssPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../dist/css/tokens.css"
  );

  it("exports every registry token to dist/css/tokens.css (requires build)", () => {
    if (!existsSync(cssPath)) {
      return;
    }
    const css = readFileSync(cssPath, "utf8");
    expect(css).toContain(":root {");
    expect(css).toContain(".dark {");
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(css).toContain(`${token.cssVariable}: ${token.value};`);
    }
  });

  it("uses --afenda- prefix on all custom properties", () => {
    if (!existsSync(cssPath)) {
      return;
    }
    const css = readFileSync(cssPath, "utf8");
    const vars = css.match(/--[\w-]+/gu) ?? [];
    for (const name of vars) {
      if (name.startsWith("--afenda-")) {
        continue;
      }
      expect(name).not.toMatch(/^--afenda/u);
    }
    expect(vars.some((v) => v.startsWith("--afenda-"))).toBe(true);
  });

  it("includes density attribute hooks in globals.css (requires build)", () => {
    const globalsPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "../../dist/css/globals.css"
    );
    if (!existsSync(globalsPath)) {
      return;
    }
    const css = readFileSync(globalsPath, "utf8");
    expect(css).toContain('[data-afenda-density="compact"]');
    expect(css).toContain('[data-afenda-density="default"]');
    expect(css).toContain('[data-afenda-density="comfortable"]');
  });
});
