#!/usr/bin/env node
/**
 * PAS-006B P06-004 — verify block lifecycle registry integrity in shadcn-studio.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const requiredPaths = [
  "packages/shadcn-studio/src/registry/block-lifecycle-mutation.ts",
  "packages/shadcn-studio/src/registry/block-lifecycle.ts",
  "packages/shadcn-studio/src/registry/presentation-inventory.registry.ts",
];

const missing = requiredPaths.filter(
  (relativePath) => !existsSync(join(repoRoot, relativePath))
);

if (missing.length > 0) {
  process.stderr.write("studio inventory lifecycle: FAIL\n");
  for (const path of missing) {
    process.stderr.write(`- missing required file: ${path}\n`);
  }
  process.exit(1);
}

const testRun = spawnSync(
  "pnpm",
  [
    "--filter",
    "@afenda/shadcn-studio",
    "exec",
    "vitest",
    "run",
    "block-lifecycle-mutation",
    "presentation-inventory.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio inventory lifecycle: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("studio inventory lifecycle: OK\n");
process.exit(0);
