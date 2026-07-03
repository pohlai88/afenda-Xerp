/**
 * Emits shadcn-studio-blocks-flat.stories.tsx from block-flat-story.registry.ts SSOT.
 *
 * Story exports must be statically parseable by Storybook's CSF indexer (acorn).
 * Do not emit spread-of-call patterns like `...storyPair("X").light` — they break dev indexing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");
const registryPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/block-flat-story.registry.ts"
);
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/block-story-manifest.generated.json"
);
const outputPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/shadcn-studio-blocks-flat.stories.tsx"
);

const FLAT_BLOCK_SPLIT_RE = /\{\s*\n?\s*slug:/;
const STORY_NAME_RE = /storyName:\s*"([^"]+)"/;
const SAMPLE_RE = /sample:\s*(\w+)/;
const LAYOUT_RE = /layout:\s*"([^"]+)"/;
const LAB_SMOKE_TRUE_RE = /labSmoke:\s*true/;

/** @type {Record<string, string>} */
const LAYOUT_PARAMETERS = {
  centered: "shadcnStudioCenteredLayout",
  fullscreen: "shadcnStudioFullscreenLayout",
  padded: "shadcnStudioPaddedLayout",
};

/**
 * @param {string} source
 * @returns {{ storyName: string; sample: string; layout: string; labSmoke: boolean }[]}
 */
function parseFlatBlockRegistry(source) {
  /** @type {{ storyName: string; sample: string; layout: string; labSmoke: boolean }[]} */
  const entries = [];
  const blocks = source.split(FLAT_BLOCK_SPLIT_RE).slice(1);

  for (const block of blocks) {
    const storyName = block.match(STORY_NAME_RE)?.[1];
    const sample = block.match(SAMPLE_RE)?.[1];
    const layout = block.match(LAYOUT_RE)?.[1];

    if (!(storyName && sample && layout)) {
      continue;
    }

    entries.push({
      storyName,
      sample,
      layout,
      labSmoke: LAB_SMOKE_TRUE_RE.test(block),
    });
  }

  return entries;
}

/**
 * @param {{ storyName: string; sample: string; layout: string; labSmoke: boolean }} entry
 * @returns {string}
 */
function renderStoryExport(entry) {
  const { storyName, sample, layout, labSmoke } = entry;
  const layoutParam = LAYOUT_PARAMETERS[layout] ?? LAYOUT_PARAMETERS.centered;
  const tagsLine = labSmoke ? '\n  tags: ["autodocs", "lab-smoke"],' : "";

  return `export const ${storyName}: Story = {
  render: () => <${sample} />,
  parameters: ${layoutParam},${tagsLine}
};
export const ${storyName}Dark: Story = {
  render: () => <${sample} />,
  parameters: ${layoutParam},
  globals: shadcnStudioDarkThemeGlobals,
};`;
}

/**
 * @param {{ storyName: string; sample: string; layout: string; labSmoke: boolean }[]} entries
 * @param {number} manifestCount
 * @returns {string}
 */
function renderStoriesFile(entries, manifestCount) {
  const sampleImports = [...new Set(entries.map((entry) => entry.sample))].sort();
  const layoutImports = [
    ...new Set(
      entries.map(
        (entry) =>
          LAYOUT_PARAMETERS[entry.layout] ?? LAYOUT_PARAMETERS.centered
      )
    ),
  ].sort();

  const labImports = [
    "shadcnStudioBlockDocs",
    "shadcnStudioDarkThemeGlobals",
    "shadcnStudioStoryA11y",
    ...layoutImports,
  ].sort();

  const exports = entries.map(renderStoryExport).join("\n\n");

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-flat-block-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  ${sampleImports.join(",\n  ")}
} from "./block-flat-story.compositions.js";
import { FLAT_BLOCK_STORY_REGISTRY } from "./block-flat-story.registry.js";
import {
  ${labImports.join(",\n  ")}
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Blocks Flat",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Curated CSF3 stories for prop-driven MCP flat blocks (manualStoryRequired manifest). Fixtures live in storybook/block-flat-story.compositions.tsx.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

${exports}

/** Registry count guard — visible in Storybook docs for lab operators. */
export const FlatBlockCatalog: Story = {
  tags: ["autodocs", "lab-smoke"],
  render: () => (
    <p className="text-muted-foreground text-sm">
      {FLAT_BLOCK_STORY_REGISTRY.length} curated flat blocks · see{" "}
      <code>block-story-manifest.generated.json</code>
    </p>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText(/${manifestCount} curated flat blocks/i)
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: shadcnStudioBlockDocs.component,
      },
    },
  },
};
`;
}

function main() {
  const registrySource = readFileSync(registryPath, "utf8");
  const entries = parseFlatBlockRegistry(registrySource);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const manifestCount = manifest.manualStoryRequiredCount ?? entries.length;

  writeFileSync(outputPath, renderStoriesFile(entries, manifestCount), "utf8");

  console.log(
    `storybook:generate-flat-block-stories — ${entries.length} flat block story pair(s) → ${outputPath}`
  );
}

main();
