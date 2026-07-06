import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  CANONICAL_THEME_TOKEN_NAMES,
  studioThemeConfig,
} from "../configs/theme-config";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const STYLE_ROOT = path.join(PACKAGE_ROOT, "src", "styles");
const COMPONENTS_JSON_PATH = path.join(PACKAGE_ROOT, "components.json");
const PACKAGE_JSON_PATH = path.join(PACKAGE_ROOT, "package.json");

const REQUIRED_STYLE_FILES = [
  "shadcn-default.css",
  "swiss-noir.css",
  "verdant-noir.css",
] as const;

const THEME_STYLE_FILES = ["swiss-noir.css", "verdant-noir.css"] as const;
const DEFAULT_STYLE_FILE = "shadcn-default.css";
const STYLE_FILE_THEME_IDS = {
  "shadcn-default.css": "shadcn-default",
  "swiss-noir.css": "swiss-noir",
  "verdant-noir.css": "verdant-noir",
} as const;
const REQUIRED_CSS_EXPORTS = {
  "./shadcn-default.css": "./dist/shadcn-default.css",
  "./themes/swiss-noir.css": "./dist/themes/swiss-noir.css",
  "./themes/verdant-noir.css": "./dist/themes/verdant-noir.css",
} as const;
const TEXT_TOKEN_PAIRS = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "destructive-foreground"],
  ["sidebar", "sidebar-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
] as const;
const TOKEN_DECLARATION_PATTERN = /--([a-z0-9-]+)\s*:/g;
const TOKEN_VALUE_PATTERN = /--([a-z0-9-]+)\s*:\s*([^;]+);/g;
const SELECTOR_PATTERN = /(^|})\s*([^{}@][^{}]*)\{/g;
const TOKEN_BLOCK_PATTERN = /(?:^|(?<=}))\s*([^{}@][^{}]*)\{([^{}]*)\}/g;
const CSS_COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
const TAILWIND_CONFIG_FILE_PATTERN =
  /^tailwind\.config\.(?:cjs|js|mjs|mts|ts)$/;
const OKLCH_PATTERN =
  /oklch\(\s*(?<lightness>[0-9.]+%?)\s+(?<chroma>[0-9.]+)\s+(?<hue>[0-9.]+)(?:deg)?(?:\s*\/\s*[^)]+)?\s*\)/;
const MIN_TEXT_CONTRAST_RATIO = 4.5;
const FORBIDDEN_TOKEN_FAMILY_PATTERN =
  /--(?:(?:afenda|brand|gradient|luxury|shadow|surface)-[a-z0-9-]+|background-alt|card-secondary|muted-2|primary-2\b)/;
const FORBIDDEN_TAILWIND_V4_STYLE_PATTERN =
  /@import\s+["']tailwindcss["']|@tailwind\b|@apply\b|@theme\b|@plugin\b|@utility\b|@custom-variant\b|@source\b|hsl\(\s*var\(\s*--[a-z0-9-]+\s*\)\s*\)|oklch\(\s*var\(\s*--[a-z0-9-]+\s*\)\s*\)|@layer\s+base\s*\{[\s\S]*(?::root|\.dark)/;

const CANONICAL_SHADCN_TOKENS = new Set([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]);

const ALLOWED_SELECTORS = new Set([":root", ".dark"]);

interface ComponentsJson {
  tailwind?: {
    config?: unknown;
    css?: unknown;
    cssVariables?: unknown;
  };
}

interface PackageJson {
  exports?: Record<string, { import?: string }>;
  sideEffects?: string[];
}

interface TokenBlock {
  selector: string;
  tokens: Map<string, string>;
}

interface OklchColor {
  chroma: number;
  hue: number;
  lightness: number;
}

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

function stripCssComments(source: string): string {
  return source.replace(CSS_COMMENT_PATTERN, "");
}

function listSelectors(source: string): string[] {
  return [...stripCssComments(source).matchAll(SELECTOR_PATTERN)].map((match) =>
    (match[2] ?? "").trim()
  );
}

function listTokenBlocks(source: string): TokenBlock[] {
  return [...stripCssComments(source).matchAll(TOKEN_BLOCK_PATTERN)].map(
    (match) => {
      const tokens = new Map(
        [...(match[2] ?? "").matchAll(TOKEN_VALUE_PATTERN)].map(
          (tokenMatch) =>
            [tokenMatch[1] ?? "", (tokenMatch[2] ?? "").trim()] as const
        )
      );

      return {
        selector: (match[1] ?? "").trim(),
        tokens,
      };
    }
  );
}

function getTokenBlock(
  source: string,
  selector: ":root" | ".dark"
): TokenBlock {
  const block = listTokenBlocks(source).find(
    (candidate) => candidate.selector === selector
  );

  if (!block) {
    throw new Error(`Token block not found: ${selector}`);
  }

  return block;
}

function toCanonicalTokenRecord(tokens: Map<string, string>) {
  const entries = CANONICAL_THEME_TOKEN_NAMES.map((tokenName) => [
    tokenName,
    tokens.get(tokenName),
  ]);

  return Object.fromEntries(entries);
}

function parseOklchColor(value: string): OklchColor {
  const match = OKLCH_PATTERN.exec(value);

  if (!match?.groups) {
    throw new Error(`Expected OKLCH color, received ${value}`);
  }

  const lightnessSource = match.groups.lightness;
  const lightness = lightnessSource.endsWith("%")
    ? Number(lightnessSource.slice(0, -1)) / 100
    : Number(lightnessSource);

  return {
    chroma: Number(match.groups.chroma),
    hue: Number(match.groups.hue),
    lightness,
  };
}

function linearToSrgb(channel: number): number {
  const boundedChannel = Math.min(1, Math.max(0, channel));

  if (boundedChannel <= 0.003_130_8) {
    return 12.92 * boundedChannel;
  }

  return 1.055 * boundedChannel ** (1 / 2.4) - 0.055;
}

function oklchToSrgb({ chroma, hue, lightness }: OklchColor): number[] {
  const hueRadians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);
  const lPrime = lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b;
  const mPrime = lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b;
  const sPrime = lightness - 0.089_484_177_5 * a - 1.291_485_548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return [
    linearToSrgb(
      4.076_741_662_1 * l - 3.307_711_591_3 * m + 0.230_969_929_2 * s
    ),
    linearToSrgb(
      -1.268_438_004_6 * l + 2.609_757_401_1 * m - 0.341_319_396_5 * s
    ),
    linearToSrgb(
      -0.004_196_086_3 * l - 0.703_418_614_7 * m + 1.707_614_701 * s
    ),
  ];
}

function srgbToRelativeLuminance(channels: number[]): number {
  const [red = 0, green = 0, blue = 0] = channels.map((channel) => {
    if (channel <= 0.040_45) {
      return channel / 12.92;
    }

    return ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getContrastRatio(background: string, foreground: string): number {
  const backgroundLuminance = srgbToRelativeLuminance(
    oklchToSrgb(parseOklchColor(background))
  );
  const foregroundLuminance = srgbToRelativeLuminance(
    oklchToSrgb(parseOklchColor(foreground))
  );
  const lighter = Math.max(backgroundLuminance, foregroundLuminance);
  const darker = Math.min(backgroundLuminance, foregroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function listPackageEntries(): string[] {
  return readdirSync(PACKAGE_ROOT).sort();
}

function readComponentsJson(): ComponentsJson {
  return JSON.parse(
    readFileSync(COMPONENTS_JSON_PATH, "utf8")
  ) as ComponentsJson;
}

function readPackageJson(): PackageJson {
  return JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf8")) as PackageJson;
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
    const defaultTokenNames = listTokenNames(readStyle(DEFAULT_STYLE_FILE));
    const defaultTokens = new Set(defaultTokenNames);

    expect([...CANONICAL_SHADCN_TOKENS]).toEqual([
      ...CANONICAL_THEME_TOKEN_NAMES,
    ]);
    expect(defaultTokens.size).toBeGreaterThan(0);
    expect(defaultTokens).toEqual(CANONICAL_SHADCN_TOKENS);
    expect(
      defaultTokenNames.every((tokenName) =>
        CANONICAL_SHADCN_TOKENS.has(tokenName)
      )
    ).toBe(true);

    for (const themeFile of THEME_STYLE_FILES) {
      const themeTokens = listTokenNames(readStyle(themeFile));

      expect(themeTokens.length).toBeGreaterThan(0);
      expect(
        themeTokens.every((tokenName) => CANONICAL_SHADCN_TOKENS.has(tokenName))
      ).toBe(true);
      expect(
        themeTokens.every((tokenName) => defaultTokens.has(tokenName))
      ).toBe(true);
    }
  });

  it("keeps the runtime token mirror equal to CSS source values", () => {
    for (const fileName of REQUIRED_STYLE_FILES) {
      const themeId = STYLE_FILE_THEME_IDS[fileName];
      const theme = studioThemeConfig.themes.find(
        (candidate) => candidate.id === themeId
      );
      const source = readStyle(fileName);

      expect(theme).toBeDefined();
      expect(theme?.tokens.light).toEqual(
        toCanonicalTokenRecord(getTokenBlock(source, ":root").tokens)
      );
      expect(theme?.tokens.dark).toEqual(
        toCanonicalTokenRecord(getTokenBlock(source, ".dark").tokens)
      );
    }
  });

  it("keeps noir theme exports as static root and dark override sheets", () => {
    const defaultSelectors = new Set(
      listSelectors(readStyle(DEFAULT_STYLE_FILE))
    );

    expect(defaultSelectors.has(":root")).toBe(true);
    expect(defaultSelectors.has(".dark")).toBe(true);

    for (const themeFile of THEME_STYLE_FILES) {
      const themeSelectors = listSelectors(readStyle(themeFile));

      expect(themeSelectors).toEqual([":root", ".dark"]);
    }
  });

  it("blocks custom token families and component selector creep", () => {
    for (const fileName of REQUIRED_STYLE_FILES) {
      const source = readStyle(fileName);

      expect(source).not.toMatch(FORBIDDEN_TOKEN_FAMILY_PATTERN);
      expect(stripCssComments(source)).not.toMatch(
        FORBIDDEN_TAILWIND_V4_STYLE_PATTERN
      );

      for (const selector of listSelectors(source)) {
        expect(ALLOWED_SELECTORS.has(selector)).toBe(true);
      }
    }
  });

  it("keeps text token pairs at WCAG AA contrast", () => {
    for (const fileName of REQUIRED_STYLE_FILES) {
      const source = readStyle(fileName);

      for (const { selector, tokens } of listTokenBlocks(source)) {
        for (const [backgroundToken, foregroundToken] of TEXT_TOKEN_PAIRS) {
          const background = tokens.get(backgroundToken);
          const foreground = tokens.get(foregroundToken);

          if (!(background && foreground)) {
            continue;
          }

          expect(
            getContrastRatio(background, foreground),
            `${fileName} ${selector} --${foregroundToken} on --${backgroundToken}`
          ).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST_RATIO);
        }
      }
    }
  });

  it("keeps shadcn generation on the Tailwind v4 CSS-variable path", () => {
    const componentsJson = readComponentsJson();

    expect(
      listPackageEntries().some((entry) =>
        TAILWIND_CONFIG_FILE_PATTERN.test(entry)
      )
    ).toBe(false);
    expect(componentsJson.tailwind?.config).toBe("");
    expect(componentsJson.tailwind?.css).toBe("src/styles/shadcn-default.css");
    expect(componentsJson.tailwind?.cssVariables).toBe(true);
  });

  it("keeps CSS consumable only through package export boundaries", () => {
    const packageJson = readPackageJson();

    for (const [exportPath, distPath] of Object.entries(REQUIRED_CSS_EXPORTS)) {
      expect(packageJson.exports?.[exportPath]?.import).toBe(distPath);
      expect(packageJson.sideEffects).toContain(distPath);
    }
  });
});
