/**
 * Discovers MCP block entry points under packages/shadcn-studio and emits
 * shadcn-studio-blocks-auto.stories.tsx for Storybook lab coverage after install.
 *
 * Curated stories (dark variants, sample data) stay in shadcn-studio-blocks.stories.tsx.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  discoverBlockStories,
  slugToImportName,
} from "./lib/discover-block-stories.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");
const blocksRoot = join(
  repoRoot,
  "packages/shadcn-studio/src/components/shadcn-studio/blocks"
);
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/_storybook/block-story-manifest.generated.json"
);
const outputPath = join(
  repoRoot,
  "packages/shadcn-studio/src/shadcn-studio-blocks-auto.stories.tsx"
);

/**
 * @param {import("./lib/discover-block-stories.mjs").BlockEntry[]} blocks
 * @returns {string}
 */
function renderStoriesFile(blocks) {
  const imports = blocks
    .map((block) => `import ${block.importName} from "${block.importPath}";`)
    .join("\n");

  const storyExports = blocks
    .map((block) => {
      const storyName = slugToImportName(block.slug);
      const layoutSpread =
        block.layout === "fullscreen"
          ? "    parameters: {\n      ...shadcnStudioFullscreenLayout,\n    },\n"
          : "";

      return `export const ${storyName}: Story = {
  render: () => <${block.importName} />,
${layoutSpread}};`;
    })
    .join("\n\n");

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-block-auto-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

${imports}
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-theme.decorator.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "./_storybook/story-parameters.js";

const meta = {
  title: "Shadcn Studio/Blocks Auto",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Auto-discovered self-contained MCP page blocks (folder entry files). Prop-driven flat components are listed in block-story-manifest.generated.json — add curated stories in shadcn-studio-blocks.stories.tsx.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

${storyExports}
`;
}

function main() {
  const { auto, manualStoryRequired } = discoverBlockStories(blocksRoot);

  writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        autoStoryCount: auto.length,
        manualStoryRequiredCount: manualStoryRequired.length,
        autoStories: auto.map(({ slug, importPath, layout }) => ({
          slug,
          importPath,
          layout,
        })),
        manualStoryRequired,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  writeFileSync(outputPath, renderStoriesFile(auto), "utf8");

  console.log(
    `storybook:generate-block-auto-stories — ${auto.length} auto story(ies), ${manualStoryRequired.length} require curated props → ${outputPath}`
  );
}

main();
