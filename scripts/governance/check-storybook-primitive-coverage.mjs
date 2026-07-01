#!/usr/bin/env node
/**
 * PAS-006 Storybook lab — every UI primitive slug needs a colocated story or composition.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  compositionExportName,
  parseUiPrimitiveSlugs,
} from "../storybook/lib/discover-primitive-stories.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const governanceRegistryPath = join(
  repoRoot,
  "packages/shadcn-studio/src/meta-gates/_governance.registry.ts"
);
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/primitive-story-manifest.generated.json"
);
const compositionsPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/primitive-story.compositions.tsx"
);
const uiRoot = join(repoRoot, "packages/shadcn-studio/src/components-ui");

function readCompositionSlugs(source) {
  const match = source.match(
    /PRIMITIVE_COMPOSITION_SLUGS\s*=\s*\[([\s\S]*?)\]\s*as const/
  );

  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

function main() {
  const slugs = parseUiPrimitiveSlugs(
    readFileSync(governanceRegistryPath, "utf8")
  );
  const compositionsSource = readFileSync(compositionsPath, "utf8");
  const compositionSlugs = new Set(readCompositionSlugs(compositionsSource));

  /** @type {string[]} */
  const missingStories = [];
  /** @type {string[]} */
  const missingCompositions = [];

  for (const slug of slugs) {
    const componentPath = join(uiRoot, `${slug}.tsx`);
    if (!existsSync(componentPath)) {
      continue;
    }

    const storyPath = join(uiRoot, `${slug}.stories.tsx`);
    if (!existsSync(storyPath)) {
      missingStories.push(slug);
      continue;
    }

    if (compositionSlugs.has(slug)) {
      const exportName = compositionExportName(slug);
      if (!compositionsSource.includes(`export function ${exportName}`)) {
        missingCompositions.push(slug);
      }
    }
  }

  let manifestManual = [];
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifestManual = manifest.manualCompositionRequired ?? [];
  }

  if (
    missingStories.length > 0 ||
    missingCompositions.length > 0 ||
    manifestManual.length > 0
  ) {
    console.error("storybook primitive coverage: FAIL");
    if (missingStories.length > 0) {
      console.error(
        `  Missing colocated stories (${missingStories.length}):`
      );
      for (const slug of missingStories) {
        console.error(`    - ${slug}`);
      }
    }
    if (missingCompositions.length > 0) {
      console.error(
        `  Missing composition exports (${missingCompositions.length}):`
      );
      for (const slug of missingCompositions) {
        console.error(`    - ${slug}`);
      }
    }
    if (manifestManual.length > 0) {
      console.error(
        `  manualCompositionRequired (${manifestManual.length}):`
      );
      for (const slug of manifestManual) {
        console.error(`    - ${slug}`);
      }
    }
    console.error("  Fix: pnpm storybook generate");
    process.exit(1);
  }

  console.log(
    `storybook primitive coverage: OK (${slugs.length} primitive slugs with colocated stories)`
  );
}

main();
