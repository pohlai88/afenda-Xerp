import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateManifest } from "../governance/css-manifest.js";
import { uiCssManifest, UI_CSS_BUDGET } from "../styles/css-manifest.js";

const packageRoot = join(import.meta.dirname, "../..");
const pkgJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as { exports?: Record<string, unknown>; sideEffects?: unknown };

describe("@afenda/ui CSS manifest", () => {
  it("passes manifest validation (no violations)", () => {
    const violations = validateManifest(uiCssManifest);
    expect(violations).toHaveLength(0);
  });

  it("every manifest sourceFile exists on disk", () => {
    for (const entry of uiCssManifest) {
      const abs = join(packageRoot, entry.sourceFile);
      expect(existsSync(abs), `sourceFile missing: ${entry.sourceFile}`).toBe(true);
    }
  });

  it("every manifest exportPath has a matching package.json export", () => {
    for (const entry of uiCssManifest) {
      expect(
        pkgJson.exports?.[entry.exportPath],
        `Missing export "${entry.exportPath}" in package.json`
      ).toBeDefined();
    }
  });

  it("sideEffects includes the single CSS dist file", () => {
    const sideEffects = pkgJson.sideEffects;
    expect(Array.isArray(sideEffects)).toBe(true);
    const list = sideEffects as string[];
    expect(list).toContain("./dist/styles/afenda-ui.css");
  });

  it("no fixture entries in @afenda/ui (ui owns no fixture CSS)", () => {
    const purposes = uiCssManifest.map((e) => e.purpose as string);
    expect(purposes).not.toContain("fixture");
  });

  it("afenda-ui.css imports the design-system theme bridge", () => {
    const css = readFileSync(
      join(packageRoot, "src/styles/afenda-ui.css"),
      "utf8"
    );
    expect(css).toContain("@afenda/design-system/css/afenda-design-system.css");
  });

  it("afenda-ui.css does not define --afenda-* tokens", () => {
    const css = readFileSync(
      join(packageRoot, "src/styles/afenda-ui.css"),
      "utf8"
    );
    expect(css).not.toMatch(/^\s*--afenda-[a-z][\w-]*\s*:/m);
  });

  it("afenda-ui.css does not declare a @theme block", () => {
    const css = readFileSync(
      join(packageRoot, "src/styles/afenda-ui.css"),
      "utf8"
    );
    expect(css).not.toMatch(/@theme\s*(inline)?\s*\{/);
  });
});

describe("@afenda/ui CSS budget", () => {
  it("src/styles/ has at most maxSourceFiles CSS files", () => {
    const stylesDir = join(packageRoot, "src/styles");
    const cssFiles = readdirSync(stylesDir).filter((f) => f.endsWith(".css"));
    expect(cssFiles.length).toBeLessThanOrEqual(UI_CSS_BUDGET.maxSourceFiles);
  });

  it("every CSS file in src/styles/ is in the allowed list", () => {
    const stylesDir = join(packageRoot, "src/styles");
    const cssFiles = readdirSync(stylesDir).filter((f) => f.endsWith(".css"));
    const allowedBasenames = UI_CSS_BUDGET.allowedSourceFiles.map(
      (p) => p.split("/").pop()!
    );
    for (const file of cssFiles) {
      expect(
        allowedBasenames.includes(file),
        `Unregistered CSS file src/styles/${file} — add to UI_CSS_BUDGET or remove`
      ).toBe(true);
    }
  });

  it("no CSS files outside src/styles/ in @afenda/ui src/", () => {
    const srcDir = join(packageRoot, "src");
    const allCss = collectCssFilesRecursive(srcDir);
    const stylesDir = join(packageRoot, "src/styles");
    const stray = allCss.filter((f) => !f.startsWith(stylesDir));
    expect(stray, `Stray CSS: ${stray.join(", ")}`).toHaveLength(0);
  });
});

function collectCssFilesRecursive(dir: string): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) return result;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (["node_modules", "__tests__", "components"].includes(entry.name)) continue;
    if (entry.isDirectory()) {
      result.push(...collectCssFilesRecursive(full));
    } else if (entry.name.endsWith(".css")) {
      result.push(full);
    }
  }
  return result;
}
