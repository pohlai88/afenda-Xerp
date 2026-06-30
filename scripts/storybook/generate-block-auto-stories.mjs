/**
 * Discovers MCP block entry points under packages/shadcn-studio and emits
 * shadcn-studio-blocks-auto.stories.tsx for Storybook lab coverage after install.
 *
 * Curated stories (dark variants, sample data) stay in shadcn-studio-blocks.stories.tsx.
 */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

const FULLSCREEN_BLOCK_SLUG_PATTERN =
  /login|error|account-settings|application-shell|page-\d/i;
const TSX_FILE_EXTENSION_PATTERN = /\.tsx$/;

/** @typedef {{ slug: string; importPath: string; importName: string; layout: "centered" | "fullscreen" }} BlockEntry */

/**
 * @param {string} slug
 * @returns {string}
 */
function slugToImportName(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * @param {string} slug
 * @returns {"centered" | "fullscreen"}
 */
function resolveLayout(slug) {
  return FULLSCREEN_BLOCK_SLUG_PATTERN.test(slug) ? "fullscreen" : "centered";
}

/**
 * @returns {{ auto: BlockEntry[]; manualStoryRequired: string[] }}
 */
function discoverBlocks() {
  /** @type {BlockEntry[]} */
  const auto = [];
  /** @type {string[]} */
  const manualStoryRequired = [];

  for (const name of readdirSync(blocksRoot)) {
    const absolute = join(blocksRoot, name);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      const entryFile = join(absolute, `${name}.tsx`);
      try {
        statSync(entryFile);
      } catch {
        manualStoryRequired.push(name);
        continue;
      }

      auto.push({
        slug: name,
        importPath: `./components/shadcn-studio/blocks/${name}/${name}.js`,
        importName: `${slugToImportName(name)}Block`,
        layout: resolveLayout(name),
      });
      continue;
    }

    if (name.endsWith(".tsx")) {
      manualStoryRequired.push(name.replace(TSX_FILE_EXTENSION_PATTERN, ""));
    }
  }

  auto.sort((a, b) => a.slug.localeCompare(b.slug));
  manualStoryRequired.sort();

  return { auto, manualStoryRequired };
}

/**
 * @param {BlockEntry[]} blocks
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
  shadcnStudioBlockDocs,
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
  const { auto, manualStoryRequired } = discoverBlocks();

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
