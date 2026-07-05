import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { discoverBlockStories } from "../lib/discover-block-stories.mjs";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, "../../..");
const blocksRoot = join(
  repoRoot,
  "packages/shadcn-studio/src/components-layouts"
);
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/block-story-manifest.generated.json"
);
const autoStoriesPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/shadcn-studio-blocks-auto.stories.tsx"
);

describe("discover-block-stories", () => {
  it("routes flat prop-driven blocks to manualStoryRequired, not auto", () => {
    const { auto, manualStoryRequired } = discoverBlockStories(blocksRoot);

    expect(manualStoryRequired).toContain("statistics-card-01");
    expect(manualStoryRequired).toContain("datatable-invoice");
    expect(auto.map((entry) => entry.slug)).not.toContain("statistics-card-01");
    expect(auto.map((entry) => entry.slug)).not.toContain("datatable-invoice");
  });

  it("includes self-contained folder page blocks in auto", () => {
    const { auto } = discoverBlockStories(blocksRoot);

    expect(auto.map((entry) => entry.slug)).toEqual(
      expect.arrayContaining([
        "account-settings-01",
        "login-page-04",
        "hero-section-01",
      ])
    );
  });

  it("keeps generated manifest and auto stories in sync", () => {
    const { auto, manualStoryRequired } = discoverBlockStories(blocksRoot);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      autoStoryCount: number;
      manualStoryRequiredCount: number;
      manualStoryRequired: string[];
    };
    const autoStoriesSource = readFileSync(autoStoriesPath, "utf8");

    expect(manifest.autoStoryCount).toBe(auto.length);
    expect(manifest.manualStoryRequiredCount).toBe(manualStoryRequired.length);
    expect(manifest.manualStoryRequired).toEqual(manualStoryRequired);

    for (const slug of manualStoryRequired) {
      expect(autoStoriesSource).not.toMatch(
        new RegExp(`blocks/${slug}\\.js`, "i")
      );
    }
  });
});
