#!/usr/bin/env node
/**
 * PAS-006D P06-008-R2 — block slot DOM marker coverage gate.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const requiredPaths = [
  "packages/shadcn-studio/src/contracts/block-slot-dom-marker.contract.ts",
  "packages/shadcn-studio/src/registry/assert-block-slot-dom-marker-coverage.ts",
];

const missing = requiredPaths.filter(
  (relativePath) => !existsSync(join(repoRoot, relativePath))
);

if (missing.length > 0) {
  process.stderr.write("studio block slot markers: FAIL\n");
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
    "block-slot-dom-marker-coverage",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio block slot markers: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("studio block slot markers: OK\n");
process.exit(0);
