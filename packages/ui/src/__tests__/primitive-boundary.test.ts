import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const srcRoot = join(packageRoot, "src");

const FORBIDDEN_IMPORTS = [
  "@afenda/database",
  "@afenda/permissions",
  "@afenda/metadata-ui",
  "@afenda/appshell",
  "drizzle-orm",
  "server-only",
  "next/server",
] as const;

const FORBIDDEN_SOURCE_PATTERNS = [
  /\bcva\s*\(/u,
  /\bbuttonVariants\b/u,
  /\bbadgeVariants\b/u,
  /\bcardVariants\b/u,
  /\bbg-#/u,
  /\btext-#/u,
  /\bshadow-\[/u,
  /\brounded-\[/u,
  /\bfrom-/u,
  /\bbackdrop-blur/u,
] as const;

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "__tests__" || entry === "shadcn-studio") {
        continue;
      }
      files.push(...collectSourceFiles(full));
    } else if (/\.[cm]?tsx?$/u.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const componentFiles = collectSourceFiles(join(srcRoot, "components")).filter(
  (file) => !file.endsWith(".stories.tsx")
);

describe("primitive package boundary", () => {
  it("does not import forbidden downstream packages from src/components", () => {
    for (const file of componentFiles) {
      const source = readFileSync(file, "utf8");
      for (const forbidden of FORBIDDEN_IMPORTS) {
        expect(source, file).not.toContain(`from "${forbidden}`);
        expect(source, file).not.toContain(`from '${forbidden}`);
      }
    }
  });

  it("does not define local cva visual authority in component files", () => {
    for (const file of componentFiles) {
      const source = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN_SOURCE_PATTERNS) {
        expect(source, file).not.toMatch(pattern);
      }
    }
  });

  it("afenda-ui.css imports the design-system entry and defines no :root authority", () => {
    const css = readFileSync(join(srcRoot, "styles", "afenda-ui.css"), "utf8");
    expect(css).toContain(
      '@import "@afenda/design-system/css/afenda-design-system.css"'
    );
    expect(css).not.toMatch(/:root\s*\{/u);
    expect(css).not.toMatch(/^\s*--afenda-/mu);
  });

  it("package.json exports afenda-ui.css with sideEffects", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as {
      exports?: Record<string, unknown>;
      sideEffects?: readonly string[];
    };

    expect(packageJson.exports?.["./afenda-ui.css"]).toBeDefined();
    expect(packageJson.sideEffects?.some((entry) => entry.includes(".css"))).toBe(
      true
    );
  });
});
