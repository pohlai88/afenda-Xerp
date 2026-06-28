import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DESIGN_SYSTEM_CSS_BUDGET,
  designSystemCssManifest,
} from "../css/css-manifest.js";

const packageRoot = join(import.meta.dirname, "../..");
const pkgJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as { exports?: Record<string, unknown>; sideEffects?: unknown };

describe("@afenda/design-system CSS manifest", () => {
  it("every manifest sourceFile exists on disk", () => {
    const seen = new Set<string>();
    for (const entry of designSystemCssManifest) {
      if (seen.has(entry.sourceFile)) {
        continue;
      }
      seen.add(entry.sourceFile);
      const abs = join(packageRoot, entry.sourceFile);
      expect(existsSync(abs), `sourceFile missing: ${entry.sourceFile}`).toBe(
        true
      );
    }
  });

  it("every manifest entry has a non-empty sourceFile", () => {
    for (const entry of designSystemCssManifest) {
      expect(entry.sourceFile.trim().length).toBeGreaterThan(0);
    }
  });

  it("no duplicate export paths", () => {
    const paths = designSystemCssManifest.map((e) => e.exportPath);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
  });

  it("every canonical export path exists in package.json exports", () => {
    for (const entry of designSystemCssManifest) {
      const exports = pkgJson.exports as Record<string, unknown> | undefined;
      expect(
        exports?.[entry.exportPath],
        `Missing export "${entry.exportPath}" in package.json`
      ).toBeDefined();
    }
  });

  it("does not expose a globals.css export (reserved for apps)", () => {
    const exports = pkgJson.exports as Record<string, unknown> | undefined;
    const keys = Object.keys(exports ?? {});
    expect(keys.some((k) => k.endsWith("globals.css"))).toBe(false);
  });

  it("all entries are generated (design-system CSS is never handwritten)", () => {
    for (const entry of designSystemCssManifest) {
      expect(
        entry.generated,
        `${entry.exportPath} must be marked generated`
      ).toBe(true);
    }
  });

  it("sideEffects covers all unique dist CSS files", () => {
    const sideEffects = pkgJson.sideEffects;
    expect(Array.isArray(sideEffects)).toBe(true);
    const list = sideEffects as string[];
    expect(list.some((e) => e.includes("tokens.css"))).toBe(true);
    expect(list.some((e) => e.includes("afenda-design-system.css"))).toBe(true);
  });

  it("requiresTailwindTheme is false for tokens entries", () => {
    for (const entry of designSystemCssManifest.filter(
      (e) => e.purpose === "tokens"
    )) {
      expect(entry.requiresTailwindTheme).toBe(false);
    }
  });

  it("requiresTailwindTheme is true for theme-bridge entries", () => {
    for (const entry of designSystemCssManifest.filter(
      (e) => e.purpose === "theme-bridge"
    )) {
      expect(entry.requiresTailwindTheme).toBe(true);
    }
  });

  it("afenda-design-system.css is a B30 deprecation shim (not a monolith)", () => {
    const css = readFileSync(
      join(packageRoot, "src/css/afenda-design-system.css"),
      "utf8"
    );
    expect(css).toContain("@deprecated");
    expect(css).toContain("@afenda/css-authority/css/afenda-css-authority.css");
    expect(css).not.toMatch(/@theme\s*(inline)?\s*\{/);
  });
});

describe("@afenda/design-system CSS budget", () => {
  it("src/css/ contains at most maxSourceFiles CSS files", () => {
    const cssDir = join(packageRoot, "src/css");
    if (!existsSync(cssDir)) {
      return;
    }
    const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith(".css"));
    expect(cssFiles.length).toBeLessThanOrEqual(
      DESIGN_SYSTEM_CSS_BUDGET.maxSourceFiles
    );
  });

  it("every CSS file in src/css/ is in the allowed list", () => {
    const cssDir = join(packageRoot, "src/css");
    if (!existsSync(cssDir)) {
      return;
    }
    const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith(".css"));
    const allowedBasenames = DESIGN_SYSTEM_CSS_BUDGET.allowedSourceFiles.map(
      (p) => p.split("/").pop()!
    );
    for (const file of cssFiles) {
      expect(
        allowedBasenames.includes(file),
        `Unregistered CSS file src/css/${file} — add to DESIGN_SYSTEM_CSS_BUDGET.allowedSourceFiles or remove it`
      ).toBe(true);
    }
  });

  it("no .css files exist outside src/css/ in design-system src/", () => {
    const srcDir = join(packageRoot, "src");
    const allCss = collectCssFiles(srcDir);
    const cssDir = join(packageRoot, "src/css");
    const stray = allCss.filter((f) => !f.startsWith(cssDir));
    expect(
      stray,
      `CSS files outside src/css/: ${stray.join(", ")}`
    ).toHaveLength(0);
  });
});

function collectCssFiles(dir: string): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) {
    return result;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === "__tests__") {
      continue;
    }
    if (entry.isDirectory()) {
      result.push(...collectCssFiles(full));
    } else if (entry.name.endsWith(".css")) {
      result.push(full);
    }
  }
  return result;
}
