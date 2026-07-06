import { existsSync } from "node:fs";
import path from "node:path";
import {
  collectFiles,
  type DriftViolation,
  findFirstMatch,
  isSourceFile,
  PACKAGE_ROOT,
  PACKAGE_SRC,
  readText,
  STYLE_ROOT,
  toRelative,
} from "./shared.ts";

interface TokenBlock {
  readonly selector: string;
  readonly tokens: ReadonlyMap<string, string>;
}

interface OklchColor {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
}

const REQUIRED_STYLE_FILES = [
  "shadcn-default.css",
  "afenda-brand.css",
  "swiss-noir.css",
  "verdant-noir.css",
] as const;

const THEME_STYLE_FILES = [
  "afenda-brand.css",
  "swiss-noir.css",
  "verdant-noir.css",
] as const;
const DEFAULT_STYLE_FILE = "shadcn-default.css";
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
const TOKEN_DECLARATION_PATTERN = /--([a-z0-9-]+)\s*:/gu;
const TOKEN_VALUE_PATTERN = /--([a-z0-9-]+)\s*:\s*([^;]+);/gu;
const SELECTOR_PATTERN = /(^|\})\s*([^{}@][^{}]*)\{/gu;
const TOKEN_BLOCK_PATTERN = /(?:^|(?<=\}))\s*([^{}@][^{}]*)\{([^{}]*)\}/gu;
const CSS_COMMENT_PATTERN = /\/\*[\s\S]*?\*\//gu;
const OKLCH_PATTERN =
  /oklch\(\s*(?<lightness>[0-9.]+%?)\s+(?<chroma>[0-9.]+)\s+(?<hue>[0-9.]+)(?:deg)?(?:\s*\/\s*[^)]+)?\s*\)/u;
const MIN_TEXT_CONTRAST_RATIO = 4.5;

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

const FORBIDDEN_TOKEN_PATTERNS = [
  { label: "--brand-*", pattern: /--brand-[\w-]+/u },
  { label: "--afenda-*", pattern: /--afenda-[\w-]+/u },
  { label: "--surface-*", pattern: /--surface-[\w-]+/u },
  { label: "--luxury-*", pattern: /--luxury-[\w-]+/u },
  { label: "--primary-2", pattern: /--primary-2\b/u },
  { label: "--background-alt", pattern: /--background-alt\b/u },
  { label: "--card-secondary", pattern: /--card-secondary\b/u },
  { label: "--muted-2", pattern: /--muted-2\b/u },
  { label: "--shadow-*", pattern: /--shadow-[\w-]+/u },
  { label: "--gradient-*", pattern: /--gradient-[\w-]+/u },
] satisfies ReadonlyArray<{ readonly label: string; readonly pattern: RegExp }>;

const FORBIDDEN_THEME_FILES = [
  "ledger-noir.css",
  "phantom-noir.css",
  "executive-noir.css",
  "audit-noir.css",
  "erp-dark.css",
  "luxury-admin.css",
] as const;

const FORBIDDEN_STYLE_AUTHORITY_PATTERNS = [
  {
    label: '@import "tailwindcss"',
    pattern: /@import\s+["']tailwindcss["']/u,
    detail:
      "Tailwind app entrypoint imports must not live in package token authority files.",
  },
  {
    label: "@tailwind",
    pattern: /@tailwind\b/u,
    detail:
      "Tailwind v3 directives must not be restored in Phase 2 token authority files.",
  },
  {
    label: "@apply",
    pattern: /@apply\b/u,
    detail: "Phase 2 CSS authority files must stay token-only.",
  },
  {
    label: "@theme",
    pattern: /@theme\b/u,
    detail:
      "Tailwind utility mapping belongs at the app/global CSS boundary, not inside token authority files.",
  },
  {
    label: "@plugin",
    pattern: /@plugin\b/u,
    detail:
      "Tailwind plugins belong at the app/global CSS boundary, not inside token authority files.",
  },
  {
    label: "@utility",
    pattern: /@utility\b/u,
    detail:
      "Reusable utilities belong in a utility slice, not Phase 2 token authority files.",
  },
  {
    label: "@custom-variant",
    pattern: /@custom-variant\b/u,
    detail:
      "Tailwind variants belong at the app/global CSS boundary, not inside token authority files.",
  },
  {
    label: "@source",
    pattern: /@source\b/u,
    detail:
      "Tailwind source scanning belongs at the app/global CSS boundary, not inside token authority files.",
  },
  {
    label: "double-wrapped hsl(var())",
    pattern: /hsl\(\s*var\(\s*--[a-z0-9-]+\s*\)\s*\)/u,
    detail: "Tailwind v4 shadcn values must not double-wrap CSS variables.",
  },
  {
    label: "double-wrapped oklch(var())",
    pattern: /oklch\(\s*var\(\s*--[a-z0-9-]+\s*\)\s*\)/u,
    detail: "Tailwind v4 shadcn values must not double-wrap CSS variables.",
  },
  {
    label: "nested root token layer",
    pattern: /@layer\s+base\s*\{[\s\S]*(?::root|\.dark)/u,
    detail: ":root and .dark token declarations must remain top-level.",
  },
] satisfies ReadonlyArray<{
  readonly detail: string;
  readonly label: string;
  readonly pattern: RegExp;
}>;

const listTokenNames = (content: string): string[] => {
  TOKEN_DECLARATION_PATTERN.lastIndex = 0;

  return [...content.matchAll(TOKEN_DECLARATION_PATTERN)].map(
    (match) => match[1] ?? ""
  );
};

const stripCssComments = (content: string): string =>
  content.replace(CSS_COMMENT_PATTERN, "");

const listselectors = (content: string): string[] => {
  const source = stripCssComments(content);
  SELECTOR_PATTERN.lastIndex = 0;

  return [...source.matchAll(SELECTOR_PATTERN)].map((match) =>
    (match[2] ?? "").trim()
  );
};

const listTokenBlocks = (content: string): TokenBlock[] => {
  const source = stripCssComments(content);
  TOKEN_BLOCK_PATTERN.lastIndex = 0;

  return [...source.matchAll(TOKEN_BLOCK_PATTERN)].map((match) => {
    const tokenPairs = [...(match[2] ?? "").matchAll(TOKEN_VALUE_PATTERN)].map(
      (tokenMatch) =>
        [tokenMatch[1] ?? "", (tokenMatch[2] ?? "").trim()] as const
    );

    return {
      selector: (match[1] ?? "").trim(),
      tokens: new Map(tokenPairs),
    };
  });
};

const parseOklchColor = (value: string): OklchColor | null => {
  const match = OKLCH_PATTERN.exec(value);

  if (!match?.groups) {
    return null;
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
};

const linearToSrgb = (channel: number): number => {
  const boundedChannel = Math.min(1, Math.max(0, channel));

  if (boundedChannel <= 0.003_130_8) {
    return 12.92 * boundedChannel;
  }

  return 1.055 * boundedChannel ** (1 / 2.4) - 0.055;
};

const oklchToSrgb = ({ chroma, hue, lightness }: OklchColor): number[] => {
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
};

const srgbToRelativeLuminance = (channels: number[]): number => {
  const [red = 0, green = 0, blue = 0] = channels.map((channel) => {
    if (channel <= 0.040_45) {
      return channel / 12.92;
    }

    return ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const getContrastRatio = (
  background: string,
  foreground: string
): number | null => {
  const backgroundColor = parseOklchColor(background);
  const foregroundColor = parseOklchColor(foreground);

  if (!(backgroundColor && foregroundColor)) {
    return null;
  }

  const backgroundLuminance = srgbToRelativeLuminance(
    oklchToSrgb(backgroundColor)
  );
  const foregroundLuminance = srgbToRelativeLuminance(
    oklchToSrgb(foregroundColor)
  );
  const lighter = Math.max(backgroundLuminance, foregroundLuminance);
  const darker = Math.min(backgroundLuminance, foregroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

export const checkForbiddenTokens = async (): Promise<DriftViolation[]> => {
  const files = (await collectFiles(PACKAGE_SRC)).filter(isSourceFile);
  const violations: DriftViolation[] = [];

  for (const file of files) {
    const content = await readText(file);

    for (const { label, pattern } of FORBIDDEN_TOKEN_PATTERNS) {
      const match = findFirstMatch(content, pattern);

      if (match) {
        violations.push({
          rule: "forbidden-token",
          file: toRelative(file),
          detail: `${label} matched ${match}`,
        });
      }
    }
  }

  return violations;
};

export const checkForbiddenThemeFiles = async (): Promise<DriftViolation[]> => {
  const files = await collectFiles(PACKAGE_ROOT);
  const forbiddenNames = new Set(FORBIDDEN_THEME_FILES);

  return files
    .filter((file) =>
      forbiddenNames.has(
        path.basename(file) as (typeof FORBIDDEN_THEME_FILES)[number]
      )
    )
    .map((file) => ({
      rule: "forbidden-theme-file",
      file: toRelative(file),
      detail:
        "Future theme candidates require taxonomy, export, Storybook, and consumer proof before file creation.",
    }));
};

const checkRequiredStyleFiles = (styleNames: Set<string>): DriftViolation[] =>
  REQUIRED_STYLE_FILES.filter((fileName) => !styleNames.has(fileName)).map(
    (fileName) => ({
      rule: "missing-required-style-file",
      file: toRelative(path.join(STYLE_ROOT, fileName)),
      detail: "Phase 2 requires exactly the approved CSS authority files.",
    })
  );

const checkApprovedStyleFile = (file: string): DriftViolation[] => {
  const fileName = path.basename(file);
  const requiredNames = new Set(REQUIRED_STYLE_FILES);

  if (requiredNames.has(fileName as (typeof REQUIRED_STYLE_FILES)[number])) {
    return [];
  }

  return [
    {
      rule: "unapproved-style-file",
      file: toRelative(file),
      detail: "New theme files require an explicit taxonomy and export slice.",
    },
  ];
};

const checkCanonicalTokenNames = (
  file: string,
  tokenNames: string[]
): DriftViolation[] =>
  tokenNames
    .filter((tokenName) => !CANONICAL_SHADCN_TOKENS.has(tokenName))
    .map((tokenName) => ({
      rule: "non-canonical-token",
      file: toRelative(file),
      detail: `--${tokenName} is not in the canonical shadcn token list.`,
    }));

const checkTokenPairContrast = (
  file: string,
  tokenBlocks: TokenBlock[]
): DriftViolation[] => {
  const violations: DriftViolation[] = [];

  for (const { selector, tokens } of tokenBlocks) {
    for (const [backgroundToken, foregroundToken] of TEXT_TOKEN_PAIRS) {
      const background = tokens.get(backgroundToken);
      const foreground = tokens.get(foregroundToken);

      if (!(background && foreground)) {
        continue;
      }

      const contrastRatio = getContrastRatio(background, foreground);

      if (contrastRatio === null || contrastRatio >= MIN_TEXT_CONTRAST_RATIO) {
        continue;
      }

      violations.push({
        rule: "token-pair-contrast",
        file: toRelative(file),
        detail: `${selector} --${foregroundToken} on --${backgroundToken} has ${contrastRatio.toFixed(
          2
        )}:1 contrast; expected at least ${MIN_TEXT_CONTRAST_RATIO}:1.`,
      });
    }
  }

  return violations;
};

const checkDefaultStyleselectors = (
  file: string,
  selectors: string[]
): DriftViolation[] => {
  const selectorSet = new Set(selectors);

  if (selectorSet.has(":root") && selectorSet.has(".dark")) {
    return [];
  }

  return [
    {
      rule: "default-style-selector",
      file: toRelative(file),
      detail:
        "Default CSS must declare the canonical :root and .dark token layers.",
    },
  ];
};

const checkDefaultStyleTokenCompleteness = (
  file: string,
  tokenNames: string[]
): DriftViolation[] => {
  const tokenSet = new Set(tokenNames);

  return [...CANONICAL_SHADCN_TOKENS]
    .filter((tokenName) => !tokenSet.has(tokenName))
    .map((tokenName) => ({
      rule: "default-style-token-baseline",
      file: toRelative(file),
      detail: `${DEFAULT_STYLE_FILE} must declare --${tokenName} as part of the complete semantic token baseline.`,
    }));
};

const isApprovedThemeStyle = (fileName: string): boolean =>
  THEME_STYLE_FILES.includes(fileName as (typeof THEME_STYLE_FILES)[number]);

const checkThemeStyleselector = (
  file: string,
  expectedselector: string,
  selectors: string[]
): DriftViolation[] => {
  if (
    selectors.length === 2 &&
    selectors[0] === expectedselector &&
    selectors[1] === ".dark"
  ) {
    return [];
  }

  return [
    {
      rule: "theme-selector",
      file: toRelative(file),
      detail: `Named theme must use only ${expectedselector} followed by .dark.`,
    },
  ];
};

const checkThemeTokensDeclaredByDefault = (
  file: string,
  tokenNames: string[],
  defaultTokens: Set<string>
): DriftViolation[] =>
  tokenNames
    .filter((tokenName) => !defaultTokens.has(tokenName))
    .map((tokenName) => ({
      rule: "theme-token-not-in-default",
      file: toRelative(file),
      detail: `--${tokenName} is not declared by ${DEFAULT_STYLE_FILE}.`,
    }));

const checkThemeStyle = (
  file: string,
  tokenNames: string[],
  selectors: string[],
  defaultTokens: Set<string>
): DriftViolation[] => {
  const expectedselector = ":root";

  return [
    ...checkThemeStyleselector(file, expectedselector, selectors),
    ...checkThemeTokensDeclaredByDefault(file, tokenNames, defaultTokens),
  ];
};

const checkCssFileAuthority = (
  file: string,
  content: string,
  tokenNames: string[],
  selectors: string[],
  defaultTokens: Set<string>
): DriftViolation[] => {
  const fileName = path.basename(file);
  const sourceWithoutComments = stripCssComments(content);
  const violations = [
    ...checkApprovedStyleFile(file),
    ...checkCanonicalTokenNames(file, tokenNames),
  ];

  for (const { detail, label, pattern } of FORBIDDEN_STYLE_AUTHORITY_PATTERNS) {
    const match = findFirstMatch(sourceWithoutComments, pattern);

    if (match) {
      violations.push({
        rule: "tailwind-v4-shadcn-style-authority",
        file: toRelative(file),
        detail: `${label} matched ${match}; ${detail}`,
      });
    }
  }

  if (fileName === DEFAULT_STYLE_FILE) {
    return [
      ...violations,
      ...checkDefaultStyleselectors(file, selectors),
      ...checkDefaultStyleTokenCompleteness(file, tokenNames),
    ];
  }

  if (isApprovedThemeStyle(fileName)) {
    return [
      ...violations,
      ...checkThemeStyle(file, tokenNames, selectors, defaultTokens),
    ];
  }

  return violations;
};

export const checkCssTokenAuthority = async (): Promise<DriftViolation[]> => {
  const violations: DriftViolation[] = [];
  const styleFiles = (await collectFiles(STYLE_ROOT)).filter(
    (file) => path.extname(file) === ".css"
  );
  const styleNames = new Set(styleFiles.map((file) => path.basename(file)));
  const defaultStylePath = path.join(STYLE_ROOT, DEFAULT_STYLE_FILE);
  const defaultSource = existsSync(defaultStylePath)
    ? await readText(defaultStylePath)
    : "";
  const defaultTokens = new Set(listTokenNames(defaultSource));

  violations.push(...checkRequiredStyleFiles(styleNames));

  for (const file of styleFiles) {
    const content = await readText(file);
    const tokenNames = listTokenNames(content);
    const selectors = listselectors(content);
    const tokenBlocks = listTokenBlocks(content);

    violations.push(
      ...checkCssFileAuthority(
        file,
        content,
        tokenNames,
        selectors,
        defaultTokens
      ),
      ...checkTokenPairContrast(file, tokenBlocks)
    );
  }

  return violations;
};
