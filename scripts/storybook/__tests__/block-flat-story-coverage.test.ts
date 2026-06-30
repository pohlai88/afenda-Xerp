import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, "../../..");
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/_storybook/block-story-manifest.generated.json"
);
const registryPath = join(
  repoRoot,
  "packages/shadcn-studio/src/_storybook/block-flat-story.registry.ts"
);
const flatStoriesPath = join(
  repoRoot,
  "packages/shadcn-studio/src/shadcn-studio-blocks-flat.stories.tsx"
);

describe("block-flat-story registry coverage", () => {
  it("covers every manualStoryRequired slug from the codegen manifest", () => {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      manualStoryRequired: string[];
    };
    const registrySource = readFileSync(registryPath, "utf8");
    const flatStoriesSource = readFileSync(flatStoriesPath, "utf8");

    for (const slug of manifest.manualStoryRequired) {
      expect(registrySource).toContain(`slug: "${slug}"`);
    }

    expect(manifest.manualStoryRequired.length).toBeGreaterThan(0);
    expect(flatStoriesSource).toContain("Shadcn Studio/Blocks Flat");
  });
});
