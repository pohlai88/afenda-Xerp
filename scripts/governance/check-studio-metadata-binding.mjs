#!/usr/bin/env node
/**
 * PAS-006D P06-008-R1 — metadata binding registry coverage gate.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const requiredPaths = [
  "packages/shadcn-studio/src/meta-contracts/metadata-binding-waiver.contract.ts",
  "packages/shadcn-studio/src/meta-registry/metadata-binding-waiver.registry.ts",
  "packages/shadcn-studio/src/meta-registry/build-metadata-binding-from-data-contracts.ts",
  "packages/shadcn-studio/src/meta-registry/assert-metadata-binding-coverage.ts",
  "packages/shadcn-studio/src/meta-registry/metadata-binding.registry.ts",
];

const missing = requiredPaths.filter(
  (relativePath) => !existsSync(join(repoRoot, relativePath))
);

if (missing.length > 0) {
  process.stderr.write("studio metadata binding: FAIL\n");
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
    "metadata-binding-coverage",
    "metadata-binding.registry",
    "metadata-binding.contract",
    "metadata-binding-waiver.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio metadata binding: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("studio metadata binding: OK\n");
process.exit(0);
