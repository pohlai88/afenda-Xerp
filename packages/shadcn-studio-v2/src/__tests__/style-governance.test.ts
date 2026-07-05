import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const STYLE_ROOT = path.join(PACKAGE_ROOT, "src", "styles");

const REQUIRED_STYLE_FILES = [
  "shadcn-default.css",
  "swiss-noir.css",
  "verdant-noir.css",
] as const;

const THEME_STYLE_FILES = ["swiss-noir.css", "verdant-noir.css"] as const;
const TOKEN_DECLARATION_PATTERN = /--([a-z0-9-]+)\s*:/g;
const SELECTOR_PATTERN = /(^|})\s*([^{}@][^{}]*)\{/g;
const FORBIDDEN_TOKEN_FAMILY_PATTERN =
  /--(?:afenda|brand|luxury|surface)-[a-z0-9-]+/;

const ALLOWED_SELECTORS = new Set([
  ":root",
  ".dark",
  '[data-theme="swiss-noir"]',
  '[data-theme="verdant-noir"]',
]);

function readStyle(fileName: string): string {
  return readFileSync(path.join(STYLE_ROOT, fileName), "utf8");
}

function listStyleEntries(): string[] {
  return readdirSync(STYLE_ROOT).sort();
}

function listTokenNames(source: string): string[] {
  return [...source.matchAll(TOKEN_DECLARATION_PATTERN)].map(
    (match) => match[1] ?? ""
  );
}

function listSelectors(source: string): string[] {
  return [...source.matchAll(SELECTOR_PATTERN)].map((match) =>
    (match[2] ?? "").trim()
  );
}

describe("shadcn-studio-v2 style governance", () => {
  it("keeps styles as CSS-only registered files", () => {
    expect(listStyleEntries()).toEqual([...REQUIRED_STYLE_FILES].sort());

    for (const fileName of REQUIRED_STYLE_FILES) {
      const filePath = path.join(STYLE_ROOT, fileName);

      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).isFile()).toBe(true);
      expect(fileName.endsWith(".css")).toBe(true);
    }
  });

  it("uses the default layer as the canonical token source", () => {
    const defaultTokens = new Set(
      listTokenNames(readStyle("shadcn-default.css"))
    );

    expect(defaultTokens.size).toBeGreaterThan(0);

    for (const themeFile of THEME_STYLE_FILES) {
      const themeTokens = listTokenNames(readStyle(themeFile));

      expect(themeTokens.length).toBeGreaterThan(0);
      expect(
        themeTokens.every((tokenName) => defaultTokens.has(tokenName))
      ).toBe(true);
    }
  });

  it("blocks custom token families and component selector creep", () => {
    for (const fileName of REQUIRED_STYLE_FILES) {
      const source = readStyle(fileName);

      expect(source).not.toMatch(FORBIDDEN_TOKEN_FAMILY_PATTERN);

      for (const selector of listSelectors(source)) {
        expect(ALLOWED_SELECTORS.has(selector)).toBe(true);
      }
    }
  });
});
