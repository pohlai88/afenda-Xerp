/**
 * Emits shadcn-studio-assets.stories.tsx from components-assets/index.ts exports.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");
const svgIndexPath = join(
  repoRoot,
  "packages/shadcn-studio/src/components-assets/index.ts"
);
const outputPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/shadcn-studio-assets.stories.tsx"
);

/**
 * @param {string} source
 * @returns {string[]}
 */
function parseSvgExports(source) {
  /** @type {Set<string>} */
  const seenModules = new Set();
  /** @type {string[]} */
  const names = [];

  for (const match of source.matchAll(
    /export \{ default as (\w+) \} from "(\.\/[^"]+)"/g
  )) {
    const [, name, from] = match;
    if (seenModules.has(from)) {
      continue;
    }
    seenModules.add(from);
    names.push(name);
  }

  return names;
}

/**
 * @param {string} name
 * @returns {"icon" | "card" | "illustration"}
 */
function classifyAsset(name) {
  if (name.endsWith("Icon") || name === "LogoSvg") {
    return "icon";
  }

  if (name.endsWith("CardSvg")) {
    return "card";
  }

  if (name.endsWith("Illustration")) {
    return "illustration";
  }

  return "icon";
}

/**
 * @param {string[]} names
 * @param {"brand" | "monochrome"} variant
 * @param {"icon" | "card" | "illustration"} kind
 * @returns {string}
 */
function renderAssetGrid(names, variant, kind) {
  if (names.length === 0) {
    return `<p className="text-muted-foreground text-sm">No ${kind} assets exported.</p>`;
  }

  const iconProps =
    variant === "brand"
      ? `variant="brand" className="size-8"`
      : `variant="monochrome" className="size-8 text-muted-foreground"`;

  const cells = names
    .map(
      (
        name
      ) => `      <figure key="${name}-${variant}" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <${name} ${kind === "icon" ? iconProps : 'className="size-8 text-primary"'} />
        <figcaption className="text-muted-foreground text-xs">${name}</figcaption>
      </figure>`
    )
    .join("\n");

  return `<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
${cells}
    </div>`;
}

/**
 * @param {{ icons: string[]; cards: string[]; illustrations: string[] }} groups
 * @returns {string}
 */
function renderStoriesFile(groups) {
  const imports = [...groups.icons, ...groups.cards, ...groups.illustrations]
    .map((name) => `  ${name},`)
    .join("\n");

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-svg-gallery.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import {
${imports}
} from "../components-assets/index.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Assets",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "SVG React assets with brand-color and monochrome variants (social icons, logo).",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIconsBrand: Story = {
  render: () => (
    ${renderAssetGrid(groups.icons, "brand", "icon")}
  ),
};

export const AllIconsMonochrome: Story = {
  render: () => (
    ${renderAssetGrid(groups.icons, "monochrome", "icon")}
  ),
};

export const AllCardIllustrations: Story = {
  render: () => (
    ${renderAssetGrid(groups.cards, "brand", "card")}
  ),
};

export const AllIllustrations: Story = {
  render: () => (
    ${renderAssetGrid(groups.illustrations, "brand", "illustration")}
  ),
};

export const AllAssetsDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 font-medium text-sm">Icons (brand)</h3>
        ${renderAssetGrid(groups.icons, "brand", "icon")}
      </section>
      <section>
        <h3 className="mb-3 font-medium text-sm">Icons (monochrome)</h3>
        ${renderAssetGrid(groups.icons, "monochrome", "icon")}
      </section>
      <section>
        <h3 className="mb-3 font-medium text-sm">Card illustrations</h3>
        ${renderAssetGrid(groups.cards, "brand", "card")}
      </section>
      <section>
        <h3 className="mb-3 font-medium text-sm">Illustrations</h3>
        ${renderAssetGrid(groups.illustrations, "brand", "illustration")}
      </section>
    </div>
  ),
};
`;
}

function main() {
  const source = readFileSync(svgIndexPath, "utf8");
  const exports = parseSvgExports(source);

  const groups = {
    icons: exports.filter((name) => classifyAsset(name) === "icon"),
    cards: exports.filter((name) => classifyAsset(name) === "card"),
    illustrations: exports.filter(
      (name) => classifyAsset(name) === "illustration"
    ),
  };

  writeFileSync(outputPath, renderStoriesFile(groups), "utf8");

  console.log(
    `storybook:generate-svg-gallery — ${exports.length} asset(s) (${groups.icons.length} icons, ${groups.cards.length} cards, ${groups.illustrations.length} illustrations) → ${outputPath}`
  );
}

main();
