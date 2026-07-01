/**
 * Emits shadcn-studio-blocks-flat.stories.tsx from block-flat-story.registry.ts SSOT.
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

/**
 * @param {string} source
 * @returns {{ storyName: string; labSmoke: boolean }[]}
 */
function parseFlatBlockRegistry(source) {
  /** @type {{ storyName: string; labSmoke: boolean }[]} */
  const entries = [];
  const blocks = source.split(/\{\s*\n?\s*slug:/).slice(1);

  for (const block of blocks) {
    const storyName = block.match(/storyName:\s*"([^"]+)"/)?.[1];
    if (!storyName) {
      continue;
    }

    entries.push({
      storyName,
      labSmoke: /labSmoke:\s*true/.test(block),
    });
  }

  return entries;
}

/**
 * @param {{ storyName: string; labSmoke: boolean }} entry
 * @returns {string}
 */
function renderStoryExport(entry) {
  const { storyName, labSmoke } = entry;

  if (labSmoke) {
    return `export const ${storyName}: Story = {
  ...storyPair("${storyName}").light,
  tags: ["autodocs", "lab-smoke"],
};
export const ${storyName}Dark: Story = storyPair("${storyName}").dark;`;
  }

  return `export const ${storyName}: Story = storyPair("${storyName}").light;
export const ${storyName}Dark: Story = storyPair("${storyName}").dark;`;
}

/**
 * @param {{ storyName: string; labSmoke: boolean }[]} entries
 * @param {number} manifestCount
 * @returns {string}
 */
function renderStoriesFile(entries, manifestCount) {
  const exports = entries.map(renderStoryExport).join("\n\n");

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-flat-block-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { createFlatBlockStoryPairs } from "../storybook/block-flat-story.helpers.js";
import { FLAT_BLOCK_STORY_REGISTRY } from "../storybook/block-flat-story.registry.js";
import {
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioStoryA11y,
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

function storyPair(
  storyName: (typeof FLAT_BLOCK_STORY_REGISTRY)[number]["storyName"]
) {
  const entry = FLAT_BLOCK_STORY_REGISTRY.find(
    (row) => row.storyName === storyName
  );

  if (!entry) {
    throw new Error(\`Missing flat block story registry entry: \${storyName}\`);
  }

  return createFlatBlockStoryPairs(entry);
}

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
  const manifestCount =
    manifest.manualStoryRequiredCount ?? entries.length;

  writeFileSync(outputPath, renderStoriesFile(entries, manifestCount), "utf8");

  console.log(
    `storybook:generate-flat-block-stories — ${entries.length} flat block story pair(s) → ${outputPath}`
  );
}

main();
