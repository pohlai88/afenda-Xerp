import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateManifest } from "@afenda/ui/governance";
import { describe, expect, it } from "vitest";
import {
  APPSHELL_CSS_BUDGET,
  appShellCssManifest,
} from "../styles/css-manifest.js";

const packageRoot = join(import.meta.dirname, "../..");
const cssPath = join(packageRoot, "src/styles/afenda-appshell.css");
const studioPath = join(packageRoot, "src/styles/afenda-appshell-studio.css");
const pkgJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as { exports?: Record<string, unknown>; sideEffects?: unknown };

describe("@afenda/appshell CSS manifest", () => {
  it("passes manifest validation (no violations)", () => {
    const violations = validateManifest(appShellCssManifest);
    expect(violations).toHaveLength(0);
  });

  it("every manifest sourceFile exists on disk", () => {
    for (const entry of appShellCssManifest) {
      const abs = join(packageRoot, entry.sourceFile);
      expect(existsSync(abs), `sourceFile missing: ${entry.sourceFile}`).toBe(
        true
      );
    }
  });

  it("every non-internal manifest exportPath has a matching package.json export", () => {
    for (const entry of appShellCssManifest) {
      if ("internalOnly" in entry && entry.internalOnly) continue;
      expect(
        pkgJson.exports?.[entry.exportPath],
        `Missing export "${entry.exportPath}" in package.json`
      ).toBeDefined();
    }
  });

  it("sideEffects includes dist/styles/afenda-appshell.css", () => {
    const list = pkgJson.sideEffects;
    expect(Array.isArray(list)).toBe(true);
    expect(list).toContain("./dist/styles/afenda-appshell.css");
  });

  it("shell-structural entry uses app-shell- class namespace", () => {
    const entry = appShellCssManifest.find(
      (e) => e.purpose === "shell-structural"
    );
    expect(entry?.classNamespace).toBe("app-shell-");
  });

  it("shell-structural entry uses --app-shell- property namespace", () => {
    const entry = appShellCssManifest.find(
      (e) => e.purpose === "shell-structural"
    );
    expect(entry?.propertyNamespace).toBe("--app-shell-");
  });

  it("studio-patterns entry exists with correct purpose", () => {
    const entry = appShellCssManifest.find(
      (e) => e.purpose === "studio-patterns"
    );
    expect(entry).toBeDefined();
    expect(entry?.sourceFile).toBe("src/styles/afenda-appshell-studio.css");
    expect(entry?.classNamespace).toBe("app-shell-");
    expect(entry?.propertyNamespace).toBe("--app-shell-");
  });

  it("afenda-appshell.css contains no @theme inline block", () => {
    const css = readFileSync(cssPath, "utf8");
    expect(css).not.toContain("@theme inline");
  });

  it("afenda-appshell.css contains no --afenda-* token definitions", () => {
    const css = readFileSync(cssPath, "utf8");
    // Definitions have the pattern `--name: value` (colon on the same line, not a comma/paren
    // from a var() fallback argument). Using [^\n:] prevents cross-line false positives where
    // var(--afenda-foo, fallback) arguments appear at the start of their own line.
    expect(css).not.toMatch(/^\s*--afenda-[^\n:]+\s*:/m);
  });

  it("afenda-appshell.css contains no --spacing-* squatted properties", () => {
    const css = readFileSync(cssPath, "utf8");
    expect(css).not.toMatch(/^\s*--spacing-\d/m);
  });

  it("afenda-appshell.css uses --app-shell-* for its scoped custom properties", () => {
    const css = readFileSync(cssPath, "utf8");
    expect(css).toContain("--app-shell-header-strip-height");
    expect(css).toContain("--app-shell-z-header");
  });

  it("afenda-appshell-studio.css contains no --afenda-* token definitions", () => {
    const css = readFileSync(studioPath, "utf8");
    expect(css).not.toMatch(/^\s*--afenda-[^\n:]+\s*:/m);
  });

  it("B42l consolidation — studio CSS has no statistics-metric selector rules (comments only)", () => {
    const studioCss = readFileSync(studioPath, "utf8");
    const shellCss = readFileSync(cssPath, "utf8");
    expect(studioCss).toContain("PAS-005A B42l");
    expect(studioCss).toContain(".app-shell-studio-metric-");
    expect(studioCss).not.toMatch(/^\s*\.app-shell-statistics-metric-/m);
    expect(shellCss).toMatch(/^\s*\.app-shell-statistics-metric-card/m);
    expect(shellCss).not.toMatch(/^\s*\.app-shell-studio-metric-card/m);
  });

  it("afenda-appshell-studio.css contains no @theme inline block", () => {
    const css = readFileSync(studioPath, "utf8");
    expect(css).not.toContain("@theme inline");
  });

  it("afenda-appshell.css @imports the studio layer", () => {
    const css = readFileSync(cssPath, "utf8");
    expect(css).toContain('@import "./afenda-appshell-studio.css"');
  });

  it("studio-patterns entry is internalOnly with appshell-only importers", () => {
    const entry = appShellCssManifest.find(
      (e) => e.purpose === "studio-patterns"
    );
    expect(entry).toBeDefined();
    expect("internalOnly" in entry! && entry!.internalOnly).toBe(true);
    expect(entry?.allowedImporters).toEqual(["@afenda/appshell"]);
  });

  it("package.json does not export afenda-appshell-studio.css", () => {
    expect(pkgJson.exports?.["./afenda-appshell-studio.css"]).toBeUndefined();
    const exportKeys = Object.keys(pkgJson.exports ?? {});
    expect(
      exportKeys.some((key) => key.includes("afenda-appshell-studio"))
    ).toBe(false);
  });

  it("sideEffects does not list studio CSS as standalone export", () => {
    const list = pkgJson.sideEffects;
    expect(Array.isArray(list)).toBe(true);
    expect(list).not.toContain("./dist/styles/afenda-appshell-studio.css");
    expect(
      (list as string[]).some((entry) =>
        entry.includes("afenda-appshell-studio")
      )
    ).toBe(false);
  });
});

describe("@afenda/appshell CSS budget", () => {
  it("has at most maxSourceFiles CSS files", () => {
    const allCss = collectCssFiles(join(packageRoot, "src"));
    expect(
      allCss.length,
      `Budget exceeded: found ${allCss.length} CSS files (max ${APPSHELL_CSS_BUDGET.maxSourceFiles}): ${allCss.join(", ")}`
    ).toBeLessThanOrEqual(APPSHELL_CSS_BUDGET.maxSourceFiles);
  });

  it("every CSS file is in the allowed list", () => {
    const allCss = collectCssFiles(join(packageRoot, "src"));
    for (const file of allCss) {
      const normalised = file
        .replace(packageRoot + "\\", "")
        .replace(packageRoot + "/", "")
        .replace(/\\/g, "/");
      expect(
        (APPSHELL_CSS_BUDGET.allowedSourceFiles as readonly string[]).includes(
          normalised
        ),
        `Unregistered CSS file ${normalised} — add to APPSHELL_CSS_BUDGET or remove`
      ).toBe(true);
    }
  });
});

function collectCssFiles(dir: string): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) {
    return result;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (["node_modules", "__tests__", "_storybook"].includes(entry.name)) {
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
