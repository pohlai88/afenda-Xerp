/**
 * storybook-boundary.test.ts
 *
 * Asserts that Storybook story files and _storybook helper files are
 * development-only concerns:
 * - Not exported from public entry points (index, client, server)
 * - No stories/ subdirectory inside src (story files live directly in src/)
 * - Story files follow the metadata-*.stories.tsx kebab-case convention
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = join(import.meta.dirname, "../..");
const srcRoot = join(packageRoot, "src");

const PUBLIC_ENTRY_FILES = ["index.ts", "client.ts", "server.ts"] as const;

const STORIES_IMPORT_PATTERN = /from ["']\..*stories["']/;
const STORYBOOK_HELPER_IMPORT_PATTERN = /from ["']\..*_storybook["']/;
const STORY_CONTEXT_IMPORT_PATTERN = /from ["']\..*story-context["']/;
const STORY_SHELL_IMPORT_PATTERN = /from ["']\..*story-shell["']/;
const STORY_FIXTURES_IMPORT_PATTERN = /from ["']\..*story-fixtures["']/;
const KEBAB_METADATA_STORY_PATTERN = /^metadata-.+\.stories\.tsx$/;

describe("storybook import boundary", () => {
  for (const entryFile of PUBLIC_ENTRY_FILES) {
    it(`does not export story files from ${entryFile}`, () => {
      const content = readFileSync(join(srcRoot, entryFile), "utf8");
      expect(STORIES_IMPORT_PATTERN.test(content)).toBe(false);
    });

    it(`does not export _storybook helpers from ${entryFile}`, () => {
      const content = readFileSync(join(srcRoot, entryFile), "utf8");
      expect(STORYBOOK_HELPER_IMPORT_PATTERN.test(content)).toBe(false);
    });

    it(`does not export story-context from ${entryFile}`, () => {
      const content = readFileSync(join(srcRoot, entryFile), "utf8");
      expect(STORY_CONTEXT_IMPORT_PATTERN.test(content)).toBe(false);
    });

    it(`does not export story-shell from ${entryFile}`, () => {
      const content = readFileSync(join(srcRoot, entryFile), "utf8");
      expect(STORY_SHELL_IMPORT_PATTERN.test(content)).toBe(false);
    });

    it(`does not export story-fixtures from ${entryFile}`, () => {
      const content = readFileSync(join(srcRoot, entryFile), "utf8");
      expect(STORY_FIXTURES_IMPORT_PATTERN.test(content)).toBe(false);
    });
  }

  it("does not create a stories/ subdirectory inside src (story files live at src root)", () => {
    const entries = readdirSync(srcRoot, { withFileTypes: true });
    const hasSrcStoriesDir = entries.some(
      (e) => e.isDirectory() && e.name === "stories"
    );
    expect(
      hasSrcStoriesDir,
      "src/stories/ must not exist — story files live at src/metadata-*.stories.tsx"
    ).toBe(false);
  });
});

describe("storybook story file naming", () => {
  it("story files follow the metadata-*.stories.tsx kebab-case convention at src root", () => {
    const srcEntries = readdirSync(srcRoot, { withFileTypes: true });
    const storyFiles = srcEntries
      .filter((e) => e.isFile() && e.name.endsWith(".stories.tsx"))
      .map((e) => e.name);

    expect(
      storyFiles.length,
      "at least one story file must exist"
    ).toBeGreaterThan(0);

    for (const file of storyFiles) {
      expect(
        KEBAB_METADATA_STORY_PATTERN.test(file),
        `Story file "${file}" must follow kebab-case metadata-*.stories.tsx convention`
      ).toBe(true);
    }
  });

  it("_storybook helpers are not accidentally named as stories", () => {
    const helperEntries = readdirSync(join(srcRoot, "_storybook"), {
      withFileTypes: true,
    });
    const accidentalStories = helperEntries
      .filter((e) => e.isFile() && e.name.includes(".stories."))
      .map((e) => e.name);

    expect(
      accidentalStories,
      "_storybook/ must not contain *.stories.* files"
    ).toEqual([]);
  });
});
