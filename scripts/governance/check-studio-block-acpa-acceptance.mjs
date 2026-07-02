#!/usr/bin/env node
import { spawnSync } from "node:child_process";
/**
 * PAS-006C P06-006 — ACPA block acceptance gate (statistics metric contract tests).
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const contractTestPath =
  "packages/shadcn-studio/src/__tests__/statistics-metric-a11y.contract.test.tsx";

if (!existsSync(join(repoRoot, contractTestPath))) {
  process.stderr.write("studio block ACPA acceptance: FAIL\n");
  process.stderr.write(`- missing ${contractTestPath}\n`);
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
    "statistics-metric-a11y.contract",
    "acceptance-record.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio block ACPA acceptance: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("studio block ACPA acceptance: OK\n");
process.exit(0);
