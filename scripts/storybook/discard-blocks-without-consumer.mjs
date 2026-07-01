/**
 * Removes MCP block files/folders with no Storybook or ERP consumer.
 * Default: dry-run. Pass --apply to delete on disk.
 */
import { existsSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  isProtectedBlockSlug,
  resolveBlockConsumerSlugs,
} from "./lib/resolve-block-consumers.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const dryRun = !apply;

const blocksRoot = join(
  repoRoot,
  "packages/shadcn-studio/src/components-layouts"
);
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/block-story-manifest.generated.json"
);

/**
 * @param {string} slug
 * @returns {string | null}
 */
function resolveBlockPath(slug) {
  const tsx = join(blocksRoot, `${slug}.tsx`);
  if (existsSync(tsx)) {
    return tsx;
  }

  const dir = join(blocksRoot, slug);
  if (existsSync(dir) && statSync(dir).isDirectory()) {
    return dir;
  }

  return null;
}

function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const consumers = resolveBlockConsumerSlugs(manifest, repoRoot);
  const allSlugs = [
    ...new Set([
      ...(manifest.autoStories ?? []).map((entry) => entry.slug),
      ...(manifest.manualStoryRequired ?? []),
    ]),
  ];
  const discard = allSlugs.filter(
    (slug) => !isProtectedBlockSlug(slug, consumers)
  );

  if (dryRun) {
    console.log(
      "discard-blocks-without-consumer — dry-run (pass --apply to delete)"
    );
  }

  let removed = 0;
  for (const slug of discard) {
    const target = resolveBlockPath(slug);
    if (!target) {
      console.warn(`discard-blocks-without-consumer — skip missing: ${slug}`);
      continue;
    }

    if (target.endsWith("logo.tsx")) {
      console.log("discard-blocks-without-consumer — keep shared: logo.tsx");
      continue;
    }

    if (dryRun) {
      console.log(`discard-blocks-without-consumer — would remove: ${slug}`);
      continue;
    }

    rmSync(target, { recursive: true, force: true });
    console.log(`discard-blocks-without-consumer — removed: ${slug}`);
    removed += 1;
  }

  const verb = dryRun ? "would remove" : "removed";
  const count = dryRun ? discard.length : removed;
  console.log(
    `discard-blocks-without-consumer — ${verb} ${count} of ${discard.length} orphan block(s)`
  );
}

main();
