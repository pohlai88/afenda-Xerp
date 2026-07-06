import { readFile } from "node:fs/promises";
import path from "node:path";

interface ApcaW3 {
  readonly APCAcontrast: (textY: number, backgroundY: number) => number;
  readonly sRGBtoY: (channels: readonly [number, number, number]) => number;
}

interface OklchColor {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
}

interface TokenBlock {
  readonly selector: string;
  readonly tokens: ReadonlyMap<string, string>;
}

const apca = (await import("apca-w3")) as unknown as ApcaW3;
const PACKAGE_ROOT = process.cwd();
const STYLE_ROOT = path.join(PACKAGE_ROOT, "src", "styles");
const REQUIRED_STYLE_FILES = [
  "shadcn-default.css",
  "afenda-brand.css",
  "swiss-noir.css",
  "verdant-noir.css",
] as const;
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
const CSS_COMMENT_PATTERN = /\/\*[\s\S]*?\*\//gu;
const TOKEN_BLOCK_PATTERN = /(?:^|(?<=\}))\s*([^{}@][^{}]*)\{([^{}]*)\}/gu;
const TOKEN_VALUE_PATTERN = /--([a-z0-9-]+)\s*:\s*([^;]+);/gu;
const OKLCH_PATTERN =
  /oklch\(\s*(?<lightness>[0-9.]+%?)\s+(?<chroma>[0-9.]+)\s+(?<hue>[0-9.]+)(?:deg)?(?:\s*\/\s*[^)]+)?\s*\)/u;
const MIN_APCA_LC = 75;

const stripCssComments = (source: string): string =>
  source.replace(CSS_COMMENT_PATTERN, "");

const listTokenBlocks = (source: string): TokenBlock[] =>
  [...stripCssComments(source).matchAll(TOKEN_BLOCK_PATTERN)].map((match) => {
    const tokenPairs = [...(match[2] ?? "").matchAll(TOKEN_VALUE_PATTERN)].map(
      (tokenMatch) =>
        [tokenMatch[1] ?? "", (tokenMatch[2] ?? "").trim()] as const
    );

    return {
      selector: (match[1] ?? "").trim(),
      tokens: new Map(tokenPairs),
    };
  });

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

const oklchToSrgb = ({ chroma, hue, lightness }: OklchColor) => {
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
    Math.round(
      linearToSrgb(
        4.076_741_662_1 * l - 3.307_711_591_3 * m + 0.230_969_929_2 * s
      ) * 255
    ),
    Math.round(
      linearToSrgb(
        -1.268_438_004_6 * l + 2.609_757_401_1 * m - 0.341_319_396_5 * s
      ) * 255
    ),
    Math.round(
      linearToSrgb(
        -0.004_196_086_3 * l - 0.703_418_614_7 * m + 1.707_614_701 * s
      ) * 255
    ),
  ] as const;
};

const getApcaLc = (background: string, foreground: string): number | null => {
  const backgroundColor = parseOklchColor(background);
  const foregroundColor = parseOklchColor(foreground);

  if (!(backgroundColor && foregroundColor)) {
    return null;
  }

  return apca.APCAcontrast(
    apca.sRGBtoY(oklchToSrgb(foregroundColor)),
    apca.sRGBtoY(oklchToSrgb(backgroundColor))
  );
};

const main = async (): Promise<void> => {
  const violations: string[] = [];

  for (const fileName of REQUIRED_STYLE_FILES) {
    const source = await readFile(path.join(STYLE_ROOT, fileName), "utf8");

    for (const { selector, tokens } of listTokenBlocks(source)) {
      for (const [backgroundToken, foregroundToken] of TEXT_TOKEN_PAIRS) {
        const background = tokens.get(backgroundToken);
        const foreground = tokens.get(foregroundToken);

        if (!(background && foreground)) {
          continue;
        }

        const lc = getApcaLc(background, foreground);

        if (lc === null || Math.abs(lc) >= MIN_APCA_LC) {
          continue;
        }

        violations.push(
          `${fileName} ${selector} --${foregroundToken} on --${backgroundToken} has Lc ${lc.toFixed(
            1
          )}; expected abs Lc >= ${MIN_APCA_LC}.`
        );
      }
    }
  }

  if (violations.length === 0) {
    console.log("Afenda Studio V2 APCA token contrast check passed.");
    return;
  }

  console.error("Afenda Studio V2 APCA token contrast check failed.");

  for (const violation of violations) {
    console.error(`- ${violation}`);
  }

  process.exitCode = 1;
};

await main();
