import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateManifest } from "@afenda/ui/governance";
import { metadataUiCssManifest, METADATA_UI_CSS_BUDGET } from "../styles/css-manifest.js";

const packageRoot = join(import.meta.dirname, "../..");
const pkgJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as { exports?: Record<string, unknown>; sideEffects?: unknown };

describe("@afenda/metadata-ui CSS manifest", () => {
  it("passes manifest validation (no violations)", () => {
    const violations = validateManifest(metadataUiCssManifest);
    expect(violations).toHaveLength(0);
  });

  it("every manifest sourceFile exists on disk", () => {
    for (const entry of metadataUiCssManifest) {
      const abs = join(packageRoot, entry.sourceFile);
      expect(existsSync(abs), `sourceFile missing: ${entry.sourceFile}`).toBe(true);
    }
  });

  it("every manifest exportPath has a matching package.json export", () => {
    for (const entry of metadataUiCssManifest) {
      expect(
        pkgJson.exports?.[entry.exportPath],
        `Missing export "${entry.exportPath}" in package.json`
      ).toBeDefined();
    }
  });

  it("fixture entry is NOT productionSafe", () => {
    const fixture = metadataUiCssManifest.find((e) => e.purpose === "fixture");
    expect(fixture).toBeDefined();
    expect(fixture?.productionSafe).toBe(false);
  });

  it("fixture entry is blocked from apps/erp", () => {
    const fixture = metadataUiCssManifest.find((e) => e.purpose === "fixture");
    expect(fixture?.prohibitedImporters).toContain("apps/erp");
  });

  it("renderer-structural entry has metadata- class namespace", () => {
    const structural = metadataUiCssManifest.find((e) => e.purpose === "renderer-structural");
    expect(structural?.classNamespace).toBe("metadata-");
  });

  it("afenda-metadata-ui.css contains no .metadata-fixture- selectors", () => {
    const css = readFileSync(join(packageRoot, "src/afenda-metadata-ui.css"), "utf8");
    expect(css).not.toMatch(/\.metadata-fixture-/);
  });

  it("afenda-metadata-ui.css defines no --afenda-* token authority", () => {
    const css = readFileSync(join(packageRoot, "src/afenda-metadata-ui.css"), "utf8");
    expect(css).not.toMatch(/--afenda-[a-z]/);
  });
});

describe("@afenda/metadata-ui CSS budget", () => {
  it("has at most maxSourceFiles CSS files", () => {
    const allCss = collectCssFiles(join(packageRoot, "src"));
    expect(allCss.length).toBeLessThanOrEqual(METADATA_UI_CSS_BUDGET.maxSourceFiles);
  });

  it("every CSS file is in the allowed list", () => {
    const allCss = collectCssFiles(join(packageRoot, "src"));
    for (const file of allCss) {
      const rel = file.replace(packageRoot + "\\", "").replace(packageRoot + "/", "");
      const normalised = rel.replace(/\\/g, "/");
      expect(
        (METADATA_UI_CSS_BUDGET.allowedSourceFiles as readonly string[]).includes(normalised),
        `Unregistered CSS file ${normalised} — add to METADATA_UI_CSS_BUDGET or remove`
      ).toBe(true);
    }
  });
});

function collectCssFiles(dir: string): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) return result;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (["node_modules", "__tests__", "_storybook"].includes(entry.name)) continue;
    if (entry.isDirectory()) {
      result.push(...collectCssFiles(full));
    } else if (entry.name.endsWith(".css")) {
      result.push(full);
    }
  }
  return result;
}
