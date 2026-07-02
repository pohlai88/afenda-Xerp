#!/usr/bin/env node
/**
 * PAS-006 — Quarantine shadcn CLI wrapper for @afenda/shadcn-studio.
 *
 * Installs via components.json quarantine aliases. @ss-blocks registry JSON may
 * still write to legacy src/components/shadcn-studio/blocks/ — this wrapper
 * relocates those files into src/components-quarantine/ after install.
 *
 * Use: pnpm studio:shadcn:quarantine add @ss-blocks/foo --overwrite --yes
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const studioRoot = join(repoRoot, "packages/shadcn-studio");
const studioSrc = join(studioRoot, "src");
const quarantineRoot = join(studioSrc, "components-quarantine");
const legacyBlocksRoot = join(
  studioSrc,
  "components",
  "shadcn-studio",
  "blocks"
);
const legacyComponentsRoot = join(studioSrc, "components");
const strayLibUtils = join(studioSrc, "lib", "utils.ts");
const canonicalUtils = join(studioSrc, "utils", "utils.ts");

const args = process.argv.slice(2);

if (args.length === 0) {
  process.stderr.write(
    "Usage: pnpm studio:shadcn:quarantine <shadcn-args...>\n" +
      "Example: pnpm studio:shadcn:quarantine add @ss-blocks/statistics-component-01 --overwrite --yes\n"
  );
  process.exit(1);
}

function relocateLegacyBlocks() {
  if (!existsSync(legacyBlocksRoot)) {
    return [];
  }

  mkdirSync(quarantineRoot, { recursive: true });
  const moved = [];

  for (const entry of readdirSync(legacyBlocksRoot)) {
    const sourcePath = join(legacyBlocksRoot, entry);
    if (!statSync(sourcePath).isFile()) {
      continue;
    }

    const targetPath = join(quarantineRoot, entry);
    copyFileSync(sourcePath, targetPath);
    unlinkSync(sourcePath);
    moved.push(`components-quarantine/${entry}`);
  }

  if (existsSync(legacyComponentsRoot)) {
    rmSync(legacyComponentsRoot, { recursive: true, force: true });
  }

  return moved;
}

function removeStrayLibUtils() {
  if (existsSync(strayLibUtils) && existsSync(canonicalUtils)) {
    unlinkSync(strayLibUtils);
    return true;
  }
  return false;
}

const result = spawnSync("pnpm", ["dlx", "shadcn@latest", ...args], {
  cwd: studioRoot,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if ((result.status ?? 1) !== 0) {
  process.exit(result.status ?? 1);
}

const isAddCommand = args[0] === "add" || args.includes("add");
if (!isAddCommand) {
  process.exit(0);
}

const movedBlocks = relocateLegacyBlocks();
const removedStrayUtils = removeStrayLibUtils();

if (movedBlocks.length > 0) {
  process.stdout.write(
    `studio:shadcn:quarantine: relocated legacy block path → ${movedBlocks.join(", ")}\n`
  );
}

if (removedStrayUtils) {
  process.stdout.write(
    "studio:shadcn:quarantine: removed stray src/lib/utils.ts (canonical: src/utils/utils.ts)\n"
  );
}

process.exit(0);
