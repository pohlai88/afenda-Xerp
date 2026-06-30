#!/usr/bin/env node
/**
 * PAS-006 — Safe shadcn CLI wrapper for @afenda/shadcn-studio.
 *
 * Never passes --overwrite to shadcn when adding/updating components/ui primitives.
 * Use: pnpm studio:shadcn add button --yes
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const studioRoot = join(repoRoot, "packages/shadcn-studio");

const OVERWRITE_FLAGS = new Set([
  "--overwrite",
  "-o",
  "-so",
  "--silent-overwrite",
]);

const args = process.argv.slice(2);

if (args.length === 0) {
  process.stderr.write(
    "Usage: pnpm studio:shadcn <shadcn-args...>\nExample: pnpm studio:shadcn add button --yes\n"
  );
  process.exit(1);
}

const blocked = args.filter((arg) => OVERWRITE_FLAGS.has(arg));

if (blocked.length > 0) {
  process.stderr.write(
    "studio:shadcn: blocked overwrite flag(s): " +
      blocked.join(", ") +
      "\nExisting components/ui/* must not be overwritten. Edit contract + adapter manually.\n"
  );
  process.exit(1);
}

const shadcnArgs = [...args];

const result = spawnSync("pnpm", ["dlx", "shadcn@latest", ...shadcnArgs], {
  cwd: studioRoot,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
