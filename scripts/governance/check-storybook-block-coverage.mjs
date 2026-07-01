#!/usr/bin/env node
/**
 * PAS-006 Storybook lab — flat block registry must cover every manualStoryRequired slug.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/block-story-manifest.generated.json"
);
const registryPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/block-flat-story.registry.ts"
);

function readRegistrySlugs(source) {
  const slugs = [];
  const slugPattern = /slug:\s*"([^"]+)"/g;

  for (const match of source.matchAll(slugPattern)) {
    slugs.push(match[1]);
  }

  return slugs;
}

function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const required = manifest.manualStoryRequired ?? [];
  const registrySource = readFileSync(registryPath, "utf8");
  const registrySlugs = readRegistrySlugs(registrySource);

  const requiredSet = new Set(required);
  const registrySet = new Set(registrySlugs);

  const missing = required.filter((slug) => !registrySet.has(slug));
  const extra = registrySlugs.filter((slug) => !requiredSet.has(slug));

  if (missing.length > 0 || extra.length > 0) {
    console.error("storybook block coverage: FAIL");
    if (missing.length > 0) {
      console.error(
        `  Missing from block-flat-story.registry.ts (${missing.length}):`
      );
      for (const slug of missing) {
        console.error(`    - ${slug}`);
      }
    }
    if (extra.length > 0) {
      console.error(
        `  Extra registry entries not in manifest (${extra.length}):`
      );
      for (const slug of extra) {
        console.error(`    - ${slug}`);
      }
    }
    console.error(
      "  Fix: add compositions + registry rows, then pnpm storybook generate"
    );
    process.exit(1);
  }

  console.log(
    `storybook block coverage: OK (${required.length} flat blocks synced with manifest)`
  );
}

main();
